# Cấu trúc MVC theo nghiệp vụ của OffiMeal

Backend dùng ASP.NET Core MVC Web API kết hợp service xử lý nghiệp vụ và EF Core truy cập database. Frontend React là phần giao diện (View), tổ chức theo từng nghiệp vụ. Không dùng Razor Views vì React đã đảm nhiệm việc hiển thị.

## Luồng xử lý

```text
React View → Frontend Service → HTTP Client → API Controller
                                               ↓
                                         Business Service
                                               ↓
                                       EF Core DbContext
                                               ↓
                                          SQL Server
```

Controller nhận dữ liệu, lấy danh tính đã xác thực và chuyển kết quả thành HTTP response. Service kiểm tra quy tắc nghiệp vụ và sở hữu transaction. Model chứa cấu trúc dữ liệu; DbContext ánh xạ bảng và đóng vai trò unit of work của EF Core. Chưa cần thêm generic repository chỉ bọc lại các hàm EF Core.

## Backend

```text
server/
  sql/001_accounts.sql
  OffiMeal.Api/
    Controllers/
      AuthController.cs
      AccountController.cs
      AddressesController.cs
      CatalogController.cs
      AdminController.cs
      SecurityController.cs
      HealthController.cs
    Services/
      AuthService.cs
      AccountService.cs
      AddressService.cs
      CatalogService.cs
      PasswordService.cs
      TokenService.cs
      AccountMailer.cs
    Models/
      Entities/
      Requests/
      Responses/
    Data/OffiMealDbContext.cs
    Security/
    Middleware/
    Exceptions/
    Properties/launchSettings.json
    Program.cs
```

- `AuthController`/`AuthService`: đăng ký, đăng nhập, xác minh email, khôi phục mật khẩu. Controller quản lý sign-in/sign-out cookie; service không phụ thuộc HttpContext.
- `AccountController`/`AccountService`: đọc/sửa thông tin, đổi mật khẩu, đọc đơn của người đang đăng nhập.
- `AddressesController`/`AddressService`: quản lý địa chỉ theo chủ sở hữu; giữ transaction cập nhật địa chỉ mặc định, bảo vệ địa chỉ đã tham chiếu bởi đơn hàng.
- `CatalogController`/`CatalogService`: đọc món và gói từ database.
- `SecurityController`: cấp token CSRF và thông tin chế độ thư local, tách khỏi nhóm hạn mức đăng nhập.
- `TokenService`: phát hành, hết hạn và tiêu thụ mã dùng một lần. `PasswordService`: băm/kiểm tra mật khẩu. `AccountMailer`: gửi thư SMTP hoặc lưu thư development.
- `Models/Entities`: một lớp mỗi bảng đang được dùng, giữ nguyên tên bảng trong DbContext. Entity tài khoản không được trả trực tiếp ra API.
- `Models/Requests`, `Models/Responses`: dữ liệu vào/ra theo nghiệp vụ, không chứa password hash hoặc security stamp trong response.
- `Security`: cấu hình cookie, policy Verified/Admin, rate limit, tạo claims và kiểm tra thông tin đầu vào tài khoản.
- `AccountSecurityMiddleware`: CSRF, cache và Referrer-Policy. `BusinessExceptionMiddleware`: đổi lỗi nghiệp vụ thành mã HTTP và thông điệp cho giao diện.
- `Program.cs`: khởi tạo và cấu hình ứng dụng; không chứa lớp model, query hoặc toàn bộ nghiệp vụ như trước.

URL API, tên bảng SQL và hành vi chính được giữ nguyên. Thay đổi này không cần migration SQL mới. API địa chỉ dùng response DTO và không trả UserId nội bộ.

## Frontend

```text
src/
  app/
    App.tsx
    routes/AppRoutes.tsx
  features/
    accounts/
      views/
      services/
      models/
      context/
    admin/
      views/
      services/
    nutrition/
      views/
      components/
      models/
      services/
    catalog/
      views/
      components/
      models/
      data/
    workouts/
      views/
      components/
      models/
      data/
    home/
      views/
      components/
      data/
    about/views/
  shared/
    components/
      forms/
      layout/
      ui/
    services/httpClient.ts
    data/navigation.ts
    views/NotFoundPage.tsx
  styles/main.css
  main.tsx
```

- `views`: trang hiển thị, nhận thao tác và quản lý trạng thái giao diện.
- `components`: thành phần nhỏ của nghiệp vụ; form, nút và layout dùng nhiều nơi đặt ở `shared`.
- `models`: các kiểu dữ liệu tài khoản, món, gói, hồ sơ dinh dưỡng và bài tập.
- `services`: hàm gọi API hoặc tính toán nghiệp vụ. `authService`/`accountService` chứa endpoint tài khoản; View không tự ghép URL hoặc gửi fetch. `nutritionCalculator` tính calo/macro, `mealSuggestions` lọc/xếp hạng món, `profileStorage` đọc bản lưu hồ sơ trên trình duyệt.
- `context`: trạng thái phiên đăng nhập dùng chung của nghiệp vụ tài khoản.
- `data`: danh mục mẫu hiện có; không phải dữ liệu đã lấy từ database. Khi nối API thật, cập nhật service/nguồn dữ liệu tương ứng.
- `shared/services/httpClient.ts`: xử lý HTTP, cookie, CSRF và lỗi kết nối; không chứa quy tắc riêng của từng nghiệp vụ.

Những nghiệp vụ chưa cần model/service thì chưa tạo thư mục rỗng. Type được tái xuất từ một số module cũ để giữ tương thích import; định nghĩa chính nằm ở `models`.

## Ví dụ tìm nơi sửa

- Sửa form đăng ký: `src/features/accounts/views/AuthPage.tsx`.
- Sửa endpoint giao diện gọi khi đăng ký: `src/features/accounts/services/authService.ts`.
- Sửa xử lý HTTP đăng ký: `server/OffiMeal.Api/Controllers/AuthController.cs`.
- Sửa nghiệp vụ đăng ký/email trùng: `server/OffiMeal.Api/Services/AuthService.cs`.
- Sửa thời hạn mã xác nhận: `server/OffiMeal.Api/Services/TokenService.cs`.
- Sửa cách tính dinh dưỡng: `src/features/nutrition/services/nutritionCalculator.ts`.
- Sửa quy tắc chọn món: `src/features/nutrition/services/mealSuggestions.ts`.
- Sửa liên kết điều hướng trang: `src/app/routes/AppRoutes.tsx`.

## Thêm nghiệp vụ mới

1. Tạo request/response và entity nếu cần; cấu hình bảng trong DbContext. Thay đổi database phải có script SQL riêng được kiểm tra.
2. Tạo service chứa logic nghiệp vụ, kiểm tra quyền sở hữu theo UserId được controller truyền từ cookie, không dùng UserId tùy ý trong request.
3. Tạo controller, gắn Route/Authorize/policy phù hợp rồi đăng ký service trong Program.cs.
4. Tạo model và service frontend trong feature tương ứng, sau đó View/components và route.
5. Kiểm tra backend build, frontend build/lint, test tính toán và test tích hợp khi đổi tài khoản/quyền.

Giữ các lệnh chạy hiện tại: `npm run dev:api`, `npm run dev`. Kiểm thử tài khoản dùng `npm run test:accounts` theo điều kiện trong `server/ACCOUNTS.md`. Hồ sơ dinh dưỡng vẫn lưu trên trình duyệt; tổ chức MVC chưa chuyển chức năng này sang database.
