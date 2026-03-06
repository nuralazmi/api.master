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

> **Almost all modules are tenant-scoped.** Use the global variant only for system tables (e.g., `clients`).

### Tenant Module (default — use this)

1. **Entity** — `src/modules/<name>/entities/<name>.entity.ts` (extend **`TenantBaseEntity`**)
2. **DTOs** — `src/modules/<name>/dto/` (request + response DTOs, `index.ts` barrel)
3. **Repository** — `src/modules/<name>/<name>.repository.ts` (extend **`TenantBaseRepository<T>`**, inject `ClientContextService`)
4. **Service** — `src/modules/<name>/<name>.service.ts` (**no** `clientId` params — transparent)
5. **Controller** — `src/modules/<name>/<name>.controller.ts` (**no** `ClientContextService` injection)
6. **Module** — `src/modules/<name>/<name>.module.ts`
7. **Register** — add to `app.module.ts` imports
8. **Build** — `pnpm build` → fix all errors

### Global Module (rare — system tables only)

1. **Entity** — extend `BaseEntity`
2. **Repository** — extend `BaseRepository<T>`
3. Rest is the same as above

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

## Multi-Tenant Architecture

This API uses **row-level multi-tenancy** via a `client_id` column on all tenant-scoped tables.

### Entity Hierarchy

| Class | Use when | `client_id` column |
|-------|----------|-------------------|
| `BaseEntity` | Global tables (e.g., `clients`) | No |
| `TenantBaseEntity` | All feature/domain tables | Yes (auto-indexed) |

### Repository Hierarchy

| Class | Use when | clientId injection |
|-------|----------|-------------------|
| `BaseRepository<T>` | Global tables only (e.g., `ClientRepository`) | Manual / none |
| `TenantBaseRepository<T>` | All tenant-scoped repositories | Automatic via CLS |

### TenantBaseRepository Constructor Pattern

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantBaseRepository } from '@common/base';
import { ClientContextService } from '@core/cls/client-context.service';
import { Post } from './entities/post.entity';

@Injectable()
export class PostRepository extends TenantBaseRepository<Post> {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    clientContext: ClientContextService,
  ) {
    super(postRepo, clientContext);
  }
}
```

### ClientContextService

- `clientContext.getClientId()` — returns current clientId or throws if not set
- `clientContext.getClientIdOrNull()` — returns null if not set (for @Public() routes)
- `clientContext.setClientId(id)` — only called from `TenantMiddleware`

**Never** inject `ClientContextService` in services or controllers — only in repositories.
**Never** pass `clientId` as a function/method parameter — always read from CLS via repository.

> **Exception:** `AuthService` injects `ClientContextService` for OTP cache key scoping (not for DB queries). This is the only allowed service-level injection — all DB queries still go through `TenantBaseRepository`.

### Tenant Security Rules (CRITICAL)

These rules prevent cross-tenant data leaks. **Every** operation touching tenant data **must** be scoped to `clientId`.

#### 1. Raw repository operations must include clientId

If you bypass `TenantBaseRepository` methods and use raw `this.repo.update()`, `this.repo.decrement()`, `this.repo.delete()` etc., you **must** manually add `clientId` to the where clause:

```typescript
// WRONG — no tenant scope, affects any tenant's data
await this.repo.decrement({ id: userId }, 'credit', 1);

// CORRECT — scoped to current tenant
await this.repo.decrement(
  { id: userId, clientId: this.clientId } as FindOptionsWhere<Entity>,
  'credit',
  1,
);
```

**Rule: Never write a raw TypeORM query without `clientId` in the WHERE clause.**

#### 2. JWT tokens must use `user.clientId` from DB

When signing JWT tokens, always use the `clientId` from the **database record** (`user.clientId`), never from controller parameters or request headers:

```typescript
// WRONG — clientId from parameter, can be spoofed
const token = this.jwtService.sign({ sub: user.id, clientId });

// CORRECT — clientId from DB record
const token = this.jwtService.sign({ sub: user.id, clientId: user.clientId });
```

#### 3. Background jobs / Schedulers must set CLS context

Cron jobs and schedulers run outside HTTP context — no CLS is available. Before calling any tenant-scoped repository method, you **must** create a CLS context:

```typescript
import { ClsService } from 'nestjs-cls';

// In scheduler constructor
constructor(private readonly cls: ClsService) {}

// Wrap each tenant operation in cls.run()
for (const item of items) {
  await this.cls.run(async () => {
    this.cls.set('clientId', item.clientId);
    // Now tenant-scoped repository methods work correctly
    await this.repository.update(item.id, data);
  });
}
```

**Rule: Every scheduler that touches tenant data must inject `ClsService` and set `clientId` per-item.**

#### 4. Unscoped reads are allowed only for cross-tenant aggregation

Scheduler `findDueCalls()` intentionally reads ALL tenants' pending calls — this is correct. But any **write/update/delete** after that read must be scoped via CLS context (see rule 3).

### Request Flow

```
HTTP Request
  ├─ nestjs-cls middleware    → AsyncLocalStorage context created
  ├─ CorrelationIdMiddleware  → correlationId set
  └─ TenantMiddleware         → clientId → CLS (X-Client-ID header or JWT payload)
        │
  JwtAuthGuard                → verifies token, rejects if clientId missing
        │
  Route Handler
        │
  Repository.create(data)     → clientId injected from CLS automatically
```

### JWT Token Requirements

All JWT tokens **must** include `clientId` in the payload. Tokens without `clientId` are rejected by `JwtStrategy.validate()`.

```typescript
// Token payload structure
{
  sub: string;      // user id
  email: string;
  role: string;
  clientId: string; // REQUIRED — tenant identifier
}
```

### Module Creation for Tenant Modules

When creating a tenant-scoped module:

1. Entity extends `TenantBaseEntity` (not `BaseEntity`)
2. Repository extends `TenantBaseRepository<T>` (not `BaseRepository<T>`)
3. Repository constructor passes `clientContext: ClientContextService` to `super()`
4. Service never receives or passes `clientId` — it's transparent

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
| Tenant entities without `TenantBaseEntity` | Missing `client_id`, data leaks across tenants |
| Tenant repos without `TenantBaseRepository` | clientId not scoped, data leaks across tenants |
| `BaseRepository` for tenant data | Bypasses tenant isolation |
| Passing `clientId` as function parameter | Use CLS; `TenantBaseRepository` injects it |
| `ClientContextService` in services/controllers | Only inject in repositories (exception: `AuthService` for cache keys) |
| Raw TypeORM query without `clientId` in WHERE | Cross-tenant data leak — always scope raw queries |
| JWT signed with request `clientId` instead of `user.clientId` | Spoofable — always use DB record |
| Scheduler touching tenant data without `cls.run()` | No CLS context — operations become unscoped |
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
- [ ] Tenant entities extend `TenantBaseEntity`; global entities extend `BaseEntity`
- [ ] Tenant repositories extend `TenantBaseRepository<T>`; global repos extend `BaseRepository<T>`
- [ ] All new controllers use `@Controller({ path: '...', version: '1' })`
- [ ] New module registered in `app.module.ts`
- [ ] Barrel `index.ts` updated if new files added to `common/`
- [ ] **Every** raw TypeORM query includes `clientId` in WHERE clause
- [ ] JWT tokens signed with `user.clientId` (DB record), not request parameter
- [ ] Schedulers/cron jobs use `cls.run()` + `cls.set('clientId', ...)` before tenant operations
- [ ] No `clientId` passed as function/method parameter — always from CLS
