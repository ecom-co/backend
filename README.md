## E-commerce Backend (NestJS)

Backend for an e-commerce system built with NestJS (TypeScript). The project is modular, centrally configured, fully documented with Swagger, and ships with global request validation and standardized error responses.

### Key Features

- **Centralized configuration**: Global `ConfigModule` with `Joi` validation (`modules/config`).
- **Swagger**: auto-generated docs at `/docs`, supports Bearer Auth and Cookie Auth (`refresh_token`).
- **Global prefix**: all routes are served under `api` (e.g., `/api/example`).
- **Validation & transform**: `ValidationPipe` with transform, whitelist, forbidNonWhitelisted, and implicit conversion.
- **Serializer & filter**: `ClassSerializerInterceptor` and `HttpExceptionFilter` for consistent error shape and `x-correlation-id`.
- **CORS**: enabled, credentials allowed.
- **Payload limits**: JSON and URL-encoded up to 50MB.
- **Example modules**: `example` and `example-2` showcasing controllers/services, DTOs, and a custom Swagger decorator.

## System Requirements

- Node.js >= 18
- Package manager: pnpm >= 8 (or npm >= 9)

## Installation

```bash
# with pnpm
pnpm install

# or with npm
npm install
```

## Environment Variables (.env)

Minimum variables to run. Some have sensible defaults. Full schema is enforced in `modules/config/config.validation.ts`.

```env
# App
NODE_ENV=development
PORT=3000

# Database (recommended to use a single URL)
# Example: postgresql://USER:PASS@HOST:PORT/DBNAME
DATABASE_URL=postgresql://postgres:postgres@localhost:5442/nvn_backend

# Optional discrete DB params (used when DATABASE_URL is absent)
DB_HOST=localhost
DB_PORT=5442
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=nvn_backend

# Swagger (defaults provided)
SWAGGER_TITLE=ecom-backend API
SWAGGER_DESCRIPTION=API Documentation
SWAGGER_VERSION=1.0

# Redis (defaults provided)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_KEY_PREFIX=

# RabbitMQ (required, valid URI)
RABBITMQ_URL=amqp://guest:guest@localhost:5672
```

Note: If configuration is missing/invalid, the app will exit with a clear error message.

## Database

- TypeORM with PostgreSQL is configured in `app.module.ts` using `OrmModule.forRootAsync`.
- Uses `DATABASE_URL` when provided; falls back to discrete DB variables.
- In development, `synchronize` and SQL `logging` are enabled.
- `autoLoadEntities` is enabled, so entities are picked up automatically.
- Health check helper available via `ORM_HEALTH_CHECK` token or `checkTypeOrmHealthy(DataSource)`.

Example (`app.module.ts`):

```ts
import { CORE_ENTITIES, OrmModule } from '@ecom-co/orm';

OrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigServiceApp],
    useFactory: (config: ConfigServiceApp) => ({
        type: 'postgres',
        url: config.databaseUrl,
        synchronize: config.isDevelopment,
        logging: config.isDevelopment,
        entities: [...CORE_ENTITIES],
        autoLoadEntities: true,
        health: true,
    }),
});
```

## Run

```bash
# development
pnpm run start

# watch mode
pnpm run start:dev

# production (after build)
pnpm run start:prod
```

## Redis (via `@ecom-co/redis`)

Install in this app:

```bash
npm i @ecom-co/redis ioredis
```

Register module (prefer REDIS_URL; fallback to fields):

```ts
import { RedisModule } from '@ecom-co/redis';

RedisModule.forRootAsync({
    inject: [ConfigServiceApp],
    useFactory: (config: ConfigServiceApp) => ({
        clients: [
            config.redisUrl
                ? { type: 'single', name: 'default', connectionString: config.redisUrl }
                : {
                      type: 'single',
                      name: 'default',
                      host: config.redisHost,
                      port: config.redisPort,
                      password: config.redisPassword,
                      db: config.redisDb,
                  },
        ],
    }),
});
```

Use in services:

```ts
import { InjectRedis, RedisClient } from '@ecom-co/redis';

constructor(@InjectRedis() private readonly redis: RedisClient) {}

await this.redis.set('key', 'value', 'EX', 60);
```

Connection string examples:

```env
# Single
REDIS_URL=redis://:password@localhost:6379/0

# Cluster (set via module options.nodes)
# redis://:password@node-1:6379/0
```

- Server: `http://localhost:PORT`
- Swagger UI: `http://localhost:PORT/docs` (printed to console in development)
- Global prefix: all endpoints under `/api` (e.g., `GET /api/example`)

## Useful Scripts

- **build**: `nest build`
- **check-types**: type-check without emitting files
- **lint / lint:fix**: ESLint check/fix
- **format**: Prettier format
- **test / test:watch / test:cov / test:e2e**: Jest unit/e2e/coverage
- **prepare**: enable Husky if `SKIP_HUSKY` is not set

See more in `package.json` under `scripts`.

## Project Structure

```
src/
  core/
    configs/            # Swagger config exports
    constants/          # Constants (AUTH_TYPE, operators, ...)
    decorators/         # Decorators (e.g., ApiEndpoint, ClampNumber)
    dto/                # Shared DTOs: error, api response, pagination
    filters/            # Standard HttpExceptionFilter
  modules/
    config/             # Global ConfigModule, Joi validation, service
    example/            # Example module 1
    example-2/          # Example module 2
  app.module.ts         # Root module
  main.ts               # Bootstrap: global pipes/filters/interceptors
```

## Error Shape (HttpExceptionFilter)

- Each error response includes an `x-correlation-id`.
- Error body follows `ErrorResponseDto`, for example:

```json
{
    "statusCode": 400,
    "error": "Bad Request",
    "message": ["field is required"],
    "path": "/api/example",
    "timestamp": "2025-01-01T00:00:00.000Z",
    "requestId": "d3f7..."
}
```

## Pagination

`PaginationDto` supports:

- **page**: default 1, integer ≥ 1
- **limit**: default 10, clamped to [1, 100]
- **q**: optional search string

## Demo Modules

- `GET /api/example`: demonstrates `ApiEndpoint` decorator (Swagger) and `PAGINATION_TYPE`.
- `GET /api/example-2`: basic controller/service example.

## Contributing & Conventions

- Run lint/format before committing (ESLint + Prettier + optional Husky/lint-staged).
- Conventional commits are supported via `commitlint` (if hooks are enabled).

## License

UNLICENSED (private).
