import { DeepPartial, FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ClientContextService } from '@core/cls/client-context.service';
import { TenantBaseEntity } from './tenant-base.entity';
import { CursorPaginationDto } from '@common/dto/cursor-pagination.dto';
import { CursorPaginationResponseDto } from '@common/dto/cursor-pagination-response.dto';
import { sliceCursorResults } from '@common/utils/cursor.util';

/**
 * TenantBaseRepository — extend this for all tenant-scoped repositories.
 *
 * Automatically scopes all queries to the current client from CLS context.
 * Never pass clientId as a parameter — it's resolved automatically.
 *
 * Usage:
 *   @Injectable()
 *   export class PostRepository extends TenantBaseRepository<Post> {
 *     constructor(
 *       @InjectRepository(Post) repo: Repository<Post>,
 *       clientContext: ClientContextService,
 *     ) {
 *       super(repo, clientContext);
 *     }
 *   }
 */
export abstract class TenantBaseRepository<T extends TenantBaseEntity> {
  constructor(
    protected readonly repository: Repository<T>,
    protected readonly clientContext: ClientContextService,
  ) {}

  protected get clientId(): string {
    return this.clientContext.getClientId();
  }

  protected get tenantWhere(): FindOptionsWhere<T> {
    return { clientId: this.clientId } as FindOptionsWhere<T>;
  }

  async findById(id: string, relations?: string[]): Promise<T | null> {
    return this.repository.findOne({
      where: { id, clientId: this.clientId } as FindOptionsWhere<T>,
      relations,
    });
  }

  async findByIdOrFail(id: string, relations?: string[]): Promise<T> {
    const entity = await this.findById(id, relations);
    if (!entity) {
      throw new NotFoundException(
        `${this.repository.metadata.name} with id ${id} not found`,
      );
    }
    return entity;
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find({
      ...options,
      where: { ...((options?.where as object) ?? {}), clientId: this.clientId } as FindOptionsWhere<T>,
    });
  }

  async findOne(where: FindOptionsWhere<T>, relations?: string[]): Promise<T | null> {
    return this.repository.findOne({
      where: { ...where, clientId: this.clientId } as FindOptionsWhere<T>,
      relations,
    });
  }

  async findOneOrFail(where: FindOptionsWhere<T>, relations?: string[]): Promise<T> {
    const entity = await this.findOne(where, relations);
    if (!entity) {
      throw new NotFoundException(`${this.repository.metadata.name} not found`);
    }
    return entity;
  }

  async findWithCursorPagination(
    cursorDto: CursorPaginationDto,
    options?: { where?: FindOptionsWhere<T>; relations?: string[] },
  ): Promise<CursorPaginationResponseDto<T>> {
    const { limit = 10, after } = cursorDto;
    const alias = 'entity';

    const qb = this.repository
      .createQueryBuilder(alias)
      .where(`${alias}.clientId = :clientId`, { clientId: this.clientId });

    if (options?.relations) {
      const addedAliases = new Set<string>();
      for (const relation of options.relations) {
        const parts = relation.split('.');
        if (parts.length === 1) {
          if (!addedAliases.has(parts[0])) {
            qb.leftJoinAndSelect(`${alias}.${parts[0]}`, parts[0]);
            addedAliases.add(parts[0]);
          }
        } else if (parts.length === 2) {
          const [parent, child] = parts;
          if (!addedAliases.has(parent)) {
            qb.leftJoinAndSelect(`${alias}.${parent}`, parent);
            addedAliases.add(parent);
          }
          const childAlias = `${parent}_${child}`;
          if (!addedAliases.has(childAlias)) {
            qb.leftJoinAndSelect(`${parent}.${child}`, child);
            addedAliases.add(childAlias);
          }
        }
      }
    }

    if (options?.where) {
      const params: Record<string, unknown> = {};
      const conditions: string[] = [];
      Object.entries(options.where as Record<string, unknown>).forEach(([key, value]) => {
        conditions.push(`${alias}.${key} = :where_${key}`);
        params[`where_${key}`] = value;
      });
      if (conditions.length > 0) {
        qb.andWhere(conditions.join(' AND '), params);
      }
    }

    if (after) {
      qb.andWhere(`${alias}.id < :afterId`, { afterId: after });
    }

    qb.orderBy(`${alias}.id`, 'DESC').take(limit + 1);

    const rows = await qb.getMany();
    const { items, hasNextPage } = sliceCursorResults(rows, limit);

    return {
      data: items,
      nextCursor: hasNextPage && items.length > 0 ? items[items.length - 1].id : null,
      hasNextPage,
      limit,
    };
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create({
      ...data,
      clientId: this.clientId,
    } as DeepPartial<T>);
    return this.repository.save(entity);
  }

  async createMany(data: DeepPartial<T>[]): Promise<T[]> {
    const entities = this.repository.create(
      data.map((d) => ({ ...d, clientId: this.clientId }) as DeepPartial<T>),
    );
    return this.repository.save(entities);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T> {
    await this.repository.update(
      { id, clientId: this.clientId } as FindOptionsWhere<T>,
      data as never,
    );
    return this.findByIdOrFail(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete({ id, clientId: this.clientId } as FindOptionsWhere<T>);
  }

  async hardDelete(id: string): Promise<void> {
    await this.repository.delete({ id, clientId: this.clientId } as FindOptionsWhere<T>);
  }

  async restore(id: string): Promise<void> {
    await this.repository.restore({ id, clientId: this.clientId } as FindOptionsWhere<T>);
  }

  async count(where?: FindOptionsWhere<T>): Promise<number> {
    return this.repository.count({
      where: { ...where, clientId: this.clientId } as FindOptionsWhere<T>,
    });
  }

  async exists(where: FindOptionsWhere<T>): Promise<boolean> {
    const count = await this.repository.count({
      where: { ...where, clientId: this.clientId } as FindOptionsWhere<T>,
    });
    return count > 0;
  }

  async findRandom(limit = 1, options?: FindManyOptions<T>): Promise<T[]> {
    const total = await this.repository.count({
      where: { clientId: this.clientId } as FindOptionsWhere<T>,
    });
    if (total === 0) return [];
    const safeLimit = Math.min(limit, total);
    const randomOffset = Math.floor(Math.random() * Math.max(total - safeLimit, 0));
    return this.repository.find({
      ...options,
      where: { ...((options?.where as object) ?? {}), clientId: this.clientId } as FindOptionsWhere<T>,
      skip: randomOffset,
      take: safeLimit,
    });
  }
}
