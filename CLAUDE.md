# CLAUDE.md — api.historein

> NestJS project guide for Claude. Read this before making any changes.

---

## CRITICAL RULES (always enforced)

1. **`pnpm build` is mandatory after every task.** Fix all errors before stopping.
2. **NEVER run `pnpm start:dev` or `pnpm start`** — port conflicts with running server.
3. **NEVER run `pnpm migration:run`** without explicit user confirmation.
4. **Always use `pnpm`** — never `npm` or `yarn`.
5. **Read files before modifying them.** Never edit code you haven't read.
6. **No `console.log`** — use NestJS `Logger` only.
7. **No `any`** — use `unknown` or proper types. ESLint will error on `no-unused-vars`.

---

## Project Overview

| Item | Value |
|------|-------|
| Framework | NestJS 10 |
| ORM | TypeORM + MySQL |
| Cache | Redis (`cache-manager-redis-yet`) |
| Logging | nestjs-pino + pino-pretty |
| Auth | passport-jwt (global JWT guard) |
| Docs | Swagger UI + Scalar |
| Package manager | **pnpm** |

### Path Aliases

| Alias | Resolves to |
|-------|-------------|
| `@/` | `src/` |
| `@common/` | `src/common/` |
| `@core/` | `src/core/` |
| `@config/` | `src/config/` |
| `@modules/` | `src/modules/` |

Always prefer path aliases over deep relative imports (`../../..`).

### Directory Structure

```
src/
├── main.ts
├── app.module.ts
├── config/          # App, DB, Redis, Mail, SMS, Firebase, Storage, Swagger configs
├── core/            # Database, Cache, Mail, Health modules
├── common/
│   ├── base/        # BaseEntity, BaseRepository, base DTOs
│   ├── constants/   # ErrorCode enum, UserRoles enum
│   ├── decorators/  # @CurrentUser, @Public, @Roles, @ApiWrappedResponse, etc.
│   ├── dto/         # CursorPaginationDto, PaginationDto, response DTOs
│   ├── exceptions/  # BaseException, BusinessException, ConflictException
│   ├── filters/     # AllExceptionsFilter, HttpExceptionFilter
│   ├── guards/      # JwtAuthGuard, RolesGuard
│   ├── interceptors/# TransformInterceptor, TimeoutInterceptor
│   ├── middleware/  # CorrelationIdMiddleware
│   └── utils/       # cursor.util, password.util, string.util
└── modules/
    ├── auth/
    ├── user/
    ├── events/
    ├── categories/
    ├── shorts/
    ├── social/
    ├── notifications/
    ├── support/
    ├── storage/
    ├── agreements/
    ├── ai/
    └── crawler/
```

---

## Development Workflow

For every task, follow this order:

1. **Read** — read all relevant files before writing anything
2. **Plan** — identify what needs to change and where
3. **Implement** — make the changes
4. **Build** — run `pnpm build` and fix all errors
5. **Done** — confirm success to user

---

## Architecture Rules

### Entity

Every entity **must** extend `BaseEntity` from `@common/base/base.entity.ts`.

```typescript
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@common/base/base.entity';

@Entity('posts')
export class Post extends BaseEntity {
  @Column()
  title!: string;

  @Column({ type: 'text' })
  body!: string;
}
```

`BaseEntity` provides: `id` (UUID v7, auto-generated), `createdAt`, `updatedAt`, `deletedAt` (soft delete), `createdBy`, `updatedBy`.

### Repository

Every repository **must** extend `BaseRepository<T>`.

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@common/base/base.repository';
import { Post } from './entities/post.entity';

@Injectable()
export class PostRepository extends BaseRepository<Post> {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {
    super(postRepository);
  }
}
```

`BaseRepository<T>` provides: `findById`, `findByIdOrFail`, `findAll`, `findOne`, `findOneOrFail`, `findWithCursorPagination`, `create`, `createMany`, `update`, `softDelete`, `hardDelete`, `restore`, `count`, `exists`, `findRandom`.

### Controller

- Always use versioned path: `@Controller({ path: 'posts', version: '1' })`
- Inject `@CurrentUser()` to get authenticated user
- Return `{ message, data }` for single responses
- Return `{ message, ...cursorResult }` for paginated responses

```typescript
@Controller({ path: 'posts', version: '1' })
@ApiTags('Posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @ApiCursorPaginatedResponse(PostResponseDto)
  async list(
    @CurrentUser() user: JwtPayloadDto,
    @Query() dto: CursorPaginationDto,
  ) {
    const result = await this.postService.list(user.sub, dto);
    return { message: 'Posts listed', ...result };
  }

  @Post()
  @ApiWrappedResponse(PostResponseDto, { status: 201 })
  async create(@CurrentUser() user: JwtPayloadDto, @Body() dto: CreatePostDto) {
    const data = await this.postService.create(user.sub, dto);
    return { message: 'Post created', data };
  }
}
```

### Module

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostController],
  providers: [PostService, PostRepository],
  exports: [PostService],
})
export class PostModule {}
```

Register in `app.module.ts` imports array.

---

## Response & API Conventions

`TransformInterceptor` automatically wraps all controller returns.

### Single response

Controller returns:
```typescript
return { message: 'Done', data: result };
```

Client receives:
```json
{
  "success": true,
  "message": "Done",
  "meta": { "timestamp": "...", "path": "...", "correlationId": "..." },
  "data": { ... }
}
```

### Cursor paginated response

Controller returns:
```typescript
return { message: 'Listed', ...cursorResult };
// cursorResult = { data: [...], nextCursor: '...', hasNextPage: true, limit: 10 }
```

Client receives:
```json
{
  "success": true,
  "message": "Listed",
  "pagination": { "nextCursor": "...", "hasNextPage": true, "limit": 10 },
  "meta": { "timestamp": "...", "path": "..." },
  "data": [ ... ]
}
```

### Swagger decorators

```typescript
@ApiWrappedResponse(ResponseDto)                   // single
@ApiWrappedResponse(ResponseDto, { status: 201 }) // single with status
@ApiCursorPaginatedResponse(ResponseDto)           // cursor paginated
@ApiPaginatedResponse(ResponseDto)                 // offset paginated (legacy)
```

---

## Cursor Pagination

1. Accept `CursorPaginationDto` (`limit`, `after`) in controller query
2. Call `repository.findWithCursorPagination(dto, { where?, relations? })`
3. Spread result directly: `return { message: '...', ...result }`
4. Client sends `?after=<nextCursor>` for subsequent pages
5. Cursor = UUID v7 of last item — naturally sortable, no extra sort field needed

For complex sorts (non-id sort), build a custom QueryBuilder and call `sliceCursorResults()` from `@common/utils/cursor.util`.

---

## Database & Migrations

```bash
# Generate migration (after entity changes)
pnpm migration:generate src/core/database/migrations/DescriptiveName

# Review generated file before running
pnpm migration:run     # ONLY with explicit user approval

pnpm migration:revert  # revert last migration
```

Migration naming: `PascalCase` descriptive name, e.g., `CreatePostsTable`, `AddSlugToEvents`.

**Never set `synchronize: true` in production config.** It's controlled via `DATABASE_SYNCHRONIZE` env var (should be `false` in prod).

---

## Auth & Guard Pattern

`JwtAuthGuard` is registered **globally** in `app.module.ts`. All routes are protected by default.

```typescript
// Make a route public (no auth required)
@Public()
@Get('health')
health() { ... }

// Require specific role
@Roles(UserRole.ADMIN)
@Get('admin-only')
adminOnly() { ... }

// Get current user in any protected route
@Get('me')
me(@CurrentUser() user: JwtPayloadDto) {
  return { message: 'Profile', data: user };
}
```

`JwtPayloadDto` has: `sub` (user id), `email`, `role`, `iat`, `exp`.

---

## Error Handling

Use project exceptions — never raw `throw new Error()`.

```typescript
import { BusinessException, ConflictException } from '@common/exceptions';
import { ErrorCode } from '@common/constants';

// Business logic error (400)
throw new BusinessException('Post not found', ErrorCode.NOT_FOUND);

// Conflict (409)
throw new ConflictException('Email already exists', ErrorCode.EMAIL_ALREADY_EXISTS);

// Standard NestJS HTTP exceptions are also fine
throw new NotFoundException('Resource not found');
throw new UnauthorizedException('Invalid token');
```

Always use `ErrorCode` enum values — never magic strings like `'USER_NOT_FOUND'`.

---

## Module Creation Template

When creating a new module, follow this order:

1. **Entity** — `src/modules/<name>/entities/<name>.entity.ts` (extend `BaseEntity`)
2. **DTOs** — `src/modules/<name>/dto/` (request + response DTOs, `index.ts` barrel)
3. **Repository** — `src/modules/<name>/<name>.repository.ts` (extend `BaseRepository<T>`)
4. **Service** — `src/modules/<name>/<name>.service.ts`
5. **Controller** — `src/modules/<name>/<name>.controller.ts`
6. **Module** — `src/modules/<name>/<name>.module.ts`
7. **Register** — add to `app.module.ts` imports
8. **Build** — `pnpm build` → fix all errors

---

## Code Quality

### Formatting (Prettier)

```
singleQuote: true
trailingComma: all
printWidth: 100
tabWidth: 2
semi: true
```

### Linting

- `no-unused-vars`: **error** — remove all unused imports/variables
- `no-explicit-any`: **warn** — avoid `any`; use `unknown` or proper types

Run: `pnpm lint`

### Barrel exports

Every directory under `common/` must have an `index.ts` that re-exports everything.

```typescript
// src/common/exceptions/index.ts
export * from './base.exception';
export * from './business.exception';
```

Import from barrel, not from individual files when consuming from outside the directory:

```typescript
import { BusinessException } from '@common/exceptions';  // correct
import { BusinessException } from '@common/exceptions/business.exception';  // avoid
```

### Import order

1. Node built-ins
2. NestJS / third-party packages
3. Internal path aliases (`@common/`, `@modules/`, etc.)
4. Relative imports (same module only)

---

## Forbidden List

| What | Why |
|------|-----|
| `npm install` / `yarn add` | Use `pnpm` |
| `pnpm start:dev` | Port conflicts |
| `pnpm migration:run` (without approval) | Irreversible DB change |
| `console.log` | Use NestJS `Logger` |
| `any` type | Use `unknown` or proper types |
| Magic error strings | Use `ErrorCode` enum |
| Deep relative imports (`../../..`) | Use path aliases |
| Entities without `BaseEntity` | Breaks common fields |
| Repos without `BaseRepository` | Loses shared CRUD |
| Controllers without version | Breaks API versioning |
| `synchronize: true` in prod | Data loss risk |

---

## Verification Checklist

Run these after every task:

```bash
pnpm build        # must produce zero errors
pnpm lint         # fix any lint errors
```

Confirm:
- [ ] `pnpm build` exits with code 0
- [ ] No `console.log` added
- [ ] No `any` types introduced
- [ ] All new entities extend `BaseEntity`
- [ ] All new repositories extend `BaseRepository<T>`
- [ ] All new controllers use `@Controller({ path: '...', version: '1' })`
- [ ] New module registered in `app.module.ts`
- [ ] Barrel `index.ts` updated if new files added to `common/`
