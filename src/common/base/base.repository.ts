import { DeepPartial, FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { BaseEntity } from './base.entity';
import { CursorPaginationDto } from '@common/dto/cursor-pagination.dto';
import { CursorPaginationResponseDto } from '@common/dto/cursor-pagination-response.dto';
import { sliceCursorResults } from '@common/utils/cursor.util';

/**
 * Base Repository — extend this in all repositories.
 *
 * Usage:
 *   @Injectable()
 *   export class UserRepository extends BaseRepository<UserEntity> {
 *     constructor(@InjectRepository(UserEntity) repo: Repository<UserEntity>) {
 *       super(repo);
 *     }
 *   }
 */
export abstract class BaseRepository<T extends BaseEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  async findById(id: string, relations?: string[]): Promise<T | null> {
    return this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
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
    return this.repository.find(options);
  }

  /**
   * Cursor-based pagination (id DESC — UUID v7 ensures chronological order)
   */
  async findWithCursorPagination(
    cursorDto: CursorPaginationDto,
    options?: { where?: FindOptionsWhere<T>; relations?: string[] },
  ): Promise<CursorPaginationResponseDto<T>> {
    const { limit = 10, after } = cursorDto;
    const alias = 'entity';

    const qb = this.repository.createQueryBuilder(alias);

    // Relations
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

    // Where conditions
    if (options?.where) {
      const params: Record<string, any> = {};
      const conditions: string[] = [];
      Object.entries(options.where as Record<string, any>).forEach(([key, value]) => {
        conditions.push(`${alias}.${key} = :where_${key}`);
        params[`where_${key}`] = value;
      });
      if (conditions.length > 0) {
        qb.andWhere(conditions.join(' AND '), params);
      }
    }

    // Cursor
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
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async createMany(data: DeepPartial<T>[]): Promise<T[]> {
    const entities = this.repository.create(data);
    return this.repository.save(entities);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T> {
    await this.repository.update(id, data as any);
    return this.findByIdOrFail(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  async hardDelete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async restore(id: string): Promise<void> {
    await this.repository.restore(id);
  }

  async count(where?: FindOptionsWhere<T>): Promise<number> {
    return this.repository.count({ where });
  }

  async exists(where: FindOptionsWhere<T>): Promise<boolean> {
    const count = await this.repository.count({ where });
    return count > 0;
  }

  async findOne(where: FindOptionsWhere<T>, relations?: string[]): Promise<T | null> {
    return this.repository.findOne({ where, relations });
  }

  async findOneOrFail(where: FindOptionsWhere<T>, relations?: string[]): Promise<T> {
    const entity = await this.findOne(where, relations);
    if (!entity) {
      throw new NotFoundException(`${this.repository.metadata.name} not found`);
    }
    return entity;
  }

  async findRandom(limit = 1, options?: FindManyOptions<T>): Promise<T[]> {
    const total = await this.repository.count();
    if (total === 0) return [];
    const safeLimit = Math.min(limit, total);
    const randomOffset = Math.floor(Math.random() * Math.max(total - safeLimit, 0));
    return this.repository.find({ ...options, skip: randomOffset, take: safeLimit });
  }
}
