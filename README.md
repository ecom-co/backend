## E-commerce Backend (NestJS)

Backend cho hệ thống thương mại điện tử, xây dựng bằng NestJS (TypeScript). Dự án được cấu trúc module, cấu hình tập trung, tài liệu hóa bằng Swagger, có xác thực request toàn cục và chuẩn hóa lỗi.

### Tính năng chính

- **Cấu hình tập trung**: `ConfigModule` toàn cục với validate bằng `Joi` (file `modules/config`).
- **Swagger**: tự động tạo tài liệu tại `/docs`, hỗ trợ Bearer Auth và Cookie Auth (`refresh_token`).
- **Prefix toàn cục**: mọi API đi qua prefix `api` (ví dụ: `/api/example`).
- **Validation & Transform**: `ValidationPipe` (transform, whitelist, forbidNonWhitelisted, implicit conversion).
- **Serializer & Filter**: `ClassSerializerInterceptor` và `HttpExceptionFilter` chuẩn hóa lỗi, gắn `x-correlation-id`.
- **CORS**: bật sẵn, chấp nhận credentials.
- **Giới hạn payload**: body JSON/URL-encoded tối đa 50MB.
- **Ví dụ module**: `example` và `example-2` minh họa controller/service, DTO, swagger decorator tùy chỉnh.

## Yêu cầu hệ thống

- Node.js >= 18
- pnpm >= 8

## Cài đặt

```bash
pnpm install
```

## Biến môi trường (.env)

Tối thiểu cần các biến sau. Những biến có default đã được nêu rõ.

```env
# App
NODE_ENV=development
PORT=3000

# Database (yêu cầu)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=ecom
# DATABASE_URL=postgres://user:pass@host:port/dbname (tùy chọn)

# Swagger (có default)
SWAGGER_TITLE=ecom-backend API
SWAGGER_DESCRIPTION=API Documentation
SWAGGER_VERSION=1.0

# Redis (có default)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_KEY_PREFIX=

# RabbitMQ (bắt buộc, URI hợp lệ)
RABBITMQ_URL=amqp://guest:guest@localhost:5672
```

Lưu ý: Schema validate được định nghĩa ở `modules/config/config.validation.ts`. Nếu thiếu/bất hợp lệ, ứng dụng sẽ dừng với thông báo lỗi cấu hình.

## Chạy dự án

```bash
# development
pnpm run start

# watch mode
pnpm run start:dev

# production (đã build)
pnpm run start:prod
```

- Sau khi chạy, server lắng nghe tại `http://localhost:PORT` (theo biến `PORT`).
- Swagger UI: `http://localhost:PORT/docs` (được in ra console khi `NODE_ENV=development`).
- Mọi endpoint đi qua prefix `api` (ví dụ: `GET /api/example`).

## Scripts hữu ích

- **build**: `nest build`
- **check-types**: kiểm tra kiểu TypeScript không phát sinh file
- **lint / lint:fix**: ESLint kiểm tra/sửa lỗi style
- **format**: Prettier
- **test / test:watch / test:cov / test:e2e**: Jest unit/e2e/coverage
- **prepare**: bật Husky nếu không set `SKIP_HUSKY`

Xem đầy đủ trong `package.json` phần `scripts`.

## Cấu trúc chính

```
src/
  core/
    configs/            # Swagger, export configs
    constants/          # Hằng số AUTH_TYPE, toán tử, ...
    decorators/         # Decorators (ví dụ: ApiEndpoint, ClampNumber)
    dto/                # DTO chung: error, api response, pagination
    filters/            # HttpExceptionFilter chuẩn hóa lỗi
  modules/
    config/             # ConfigModule (global), validation (Joi), service
    example/            # Ví dụ module 1
    example-2/          # Ví dụ module 2
  app.module.ts         # Root module
  main.ts               # Bootstrap app, global pipes/filters/interceptors
```

## Chuẩn lỗi (HttpExceptionFilter)

- Tự sinh/gắn `x-correlation-id` cho mỗi response lỗi.
- Trả về JSON theo `ErrorResponseDto`, ví dụ:

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

## Pagination chuẩn

`PaginationDto` hỗ trợ các query:

- **page**: mặc định 1, số nguyên ≥ 1
- **limit**: mặc định 10, clamp [1, 100]
- **q**: chuỗi tìm kiếm tùy chọn

## Module ví dụ

- `GET /api/example`: ví dụ có tích hợp decorator `ApiEndpoint` (swagger) và `PAGINATION_TYPE`.
- `GET /api/example-2`: ví dụ controller/service cơ bản.

## Đóng góp & Quy ước

- Lint/format trước khi commit: đã cấu hình ESLint + Prettier + (tùy chọn) Husky/lint-staged.
- Conventional commits: hỗ trợ `commitlint` (nếu bật hook).

## Giấy phép

UNLICENSED (private).
