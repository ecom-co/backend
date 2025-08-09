# api-endpoint.decorator.ts

## English

This file provides the `ApiEndpoint` decorator for NestJS controllers, which standardizes Swagger documentation and API response structure. It combines multiple Swagger decorators (operation summary, response types, authentication, error responses) into a single, configurable decorator for cleaner and more maintainable code.

### Key Features

- **Summary & Description**: Easily set endpoint summary and description for Swagger UI.
- **Response Types**: Supports normal, paginated (offset/cursor), and created responses.
- **Authentication**: Integrates JWT authentication and auto-documents 401/403 errors.
- **Custom Errors**: Allows specifying additional HTTP error responses.

---

# api-endpoint.decorator.ts

## Tiếng Việt

File này cung cấp decorator `ApiEndpoint` cho các controller của NestJS, giúp chuẩn hóa tài liệu Swagger và cấu trúc phản hồi API. Decorator này kết hợp nhiều decorator của Swagger (mô tả endpoint, kiểu phản hồi, xác thực, lỗi) thành một decorator duy nhất, giúp code gọn gàng và dễ bảo trì hơn.

### Tính năng chính

- **Tóm tắt & Mô tả**: Dễ dàng thiết lập summary và description cho Swagger UI.
- **Kiểu phản hồi**: Hỗ trợ phản hồi thường, phân trang (offset/cursor), và phản hồi khi tạo mới.
- **Xác thực**: Tích hợp xác thực JWT và tự động tài liệu hóa lỗi 401/403.
- **Lỗi tuỳ chỉnh**: Cho phép chỉ định thêm các mã lỗi HTTP khác.
