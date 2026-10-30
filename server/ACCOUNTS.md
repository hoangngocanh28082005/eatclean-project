# Tài khoản OffiMeal

Mã nguồn đã tách theo MVC và service: `Controllers/AuthController.cs`, `AccountController.cs`, `AddressesController.cs`; logic ở `Services/AuthService.cs`, `AccountService.cs`, `AddressService.cs`, `TokenService.cs`, `AccountMailer.cs`. Các đường dẫn này tính từ thư mục `server/OffiMeal.Api`. Xem [kiến trúc dự án](../docs/ARCHITECTURE.md).

## Chạy và sử dụng

1. Áp dụng `server/sql/001_accounts.sql` bằng SSMS vào OffiMealDB hoặc dùng:

```powershell
sqlcmd -S DESKTOP-V2J7BSI -E -C -d OffiMealDB -b -i server/sql/001_accounts.sql
```

Script bổ sung `EmailConfirmed`, `SecurityStamp`, email chuẩn hóa với chỉ mục duy nhất và bảng `AccountTokens`. Chạy lại được; không xóa bảng/dữ liệu hiện có. Email cũ khác nhau chỉ bởi chữ hoa/thường hoặc khoảng trắng cần được xử lý nếu chỉ mục báo trùng. Tài khoản cũ mặc định chưa xác minh email.

2. Chạy hai terminal tại thư mục gốc:

```powershell
npm run dev:api
```

```powershell
npm run dev
```

3. Mở địa chỉ Vite thông báo. Bấm biểu tượng tài khoản ở đầu trang hoặc mở `/dang-ky`. Nếu Vite dùng cổng khác 5173, cập nhật `Email:FrontendUrl` phía backend để liên kết email mở đúng địa chỉ.
4. Development mặc định dùng thư cục bộ. Sau khi đăng ký, xem tệp JSON mới trong `server/OffiMeal.Api/App_Data/mail` và mở giá trị `link` bằng trình duyệt. Thư chứa mã bí mật, không chia sẻ/commit tệp này. Thư mục đã được gitignore, không có API công khai đọc thư.
5. Xác nhận email, đăng nhập, vào `/tai-khoan` để sửa họ tên/điện thoại, đổi mật khẩu, thêm/sửa/xóa địa chỉ và xem các đơn của chính mình. Email đăng ký không sửa trong phiên bản này; đổi email cần luồng xác minh riêng.

## Email thật

SMTP đã có phần gửi thư; cần cấu hình dịch vụ và tài khoản của nhóm. Không đưa mật khẩu vào React hoặc file cấu hình commit lên Git. Thiết lập bằng .NET User Secrets ở máy phát triển hoặc biến môi trường ở hosting:

- `Email:Mode`: `Smtp` (tương ứng biến môi trường `Email__Mode`).
- `Email:FrontendUrl`: URL chính thức của frontend, dùng HTTPS ở production.
- `Email:SmtpHost`, `Email:SmtpPort` (mặc định 587 với TLS).
- `Email:Username`, `Email:Password`, `Email:From`.

Ví dụ thiết lập trường không chứa bí mật:

```powershell
dotnet user-secrets set "Email:Mode" "Smtp" --project server/OffiMeal.Api
dotnet user-secrets set "Email:FrontendUrl" "http://localhost:5173" --project server/OffiMeal.Api
```

Chế độ Local chỉ hoạt động khi môi trường là Development. Khi chưa cấu hình SMTP trong production, gửi thư thất bại có thông báo phù hợp; hệ thống không tuyên bố đã gửi thư thành công. Quên mật khẩu luôn trả thông điệp chung để không tiết lộ tài khoản tồn tại hay không.

## Xác thực và quyền

- Cookie phiên HttpOnly, SameSite=Lax, hết hạn sau 8 giờ, Secure bắt buộc ở production. Không lưu token đăng nhập trong localStorage.
- API thay đổi dữ liệu kiểm tra token CSRF từ `/api/auth/csrf` qua header `X-CSRF-TOKEN`. Frontend lấy token mới trước mỗi thao tác ghi; không cho phép CORS tùy ý.
- Mật khẩu băm bằng `PasswordHasher`, tối thiểu 10 và tối đa 128 ký tự; không trả hash ra API.
- Mỗi request kiểm tra trạng thái tài khoản/security stamp và đọc lại role từ database. Đổi hoặc khôi phục mật khẩu hủy các phiên cũ.
- Mã xác nhận ngẫu nhiên 32 byte; database chỉ lưu SHA-256. Mã xác minh hết hạn sau 24 giờ, mã khôi phục sau 30 phút; việc tiêu thụ được thực hiện trong transaction, chỉ dùng một lần. Mật khẩu thay đổi làm vô hiệu mã gắn với stamp cũ.
- Gửi lại thư có khoảng chờ 60 giây theo tài khoản/mục đích. Nhóm endpoint auth giới hạn 30 yêu cầu/15 phút/IP trong một process. Khi chạy nhiều instance cần bổ sung kho hạn mức dùng chung; cấu hình proxy tin cậy trước khi dùng IP chuyển tiếp.
- Email chưa xác minh vẫn đăng nhập và chỉnh thông tin cá nhân được; ghi địa chỉ cần policy Verified. Các thao tác thanh toán/đăng ký gói tương lai cũng phải gắn policy này ở server.
- Địa chỉ và đơn hàng luôn lọc bằng UserId từ cookie, không dùng UserId người dùng gửi lên. Không sửa/xóa địa chỉ đã được dùng trong đơn, để bảo toàn lịch sử.
- Role Customer được gán ở server khi đăng ký. Không có giao diện tự nâng quyền. Admin được cấp bởi người quản lý database cho tài khoản đã xác định; `/api/admin/access` kiểm tra policy Admin. Staff không tự có quyền Admin.
- Đây là phân quyền nền tảng và trang kiểm tra quyền; dashboard quản trị nghiệp vụ vẫn là phần việc riêng.
- Hồ sơ dinh dưỡng trên trang hiện có vẫn thuộc luồng localStorage, chưa chuyển sang API hồ sơ thể trạng. Chưa có phân hệ hội thoại AI; khi thêm phải lọc UserId ở server như địa chỉ/đơn hàng, không tin ID do client gửi.

Production cần HTTPS, chứng chỉ SQL hợp lệ, tài khoản database đủ quyền cần thiết và kho Data Protection keys bền vững, được bảo vệ/chia sẻ phù hợp giữa các instance. Proxy `/api` của Vite chỉ phục vụ local; hosting cần cấu hình reverse proxy tương đương. Không công khai thư cục bộ hoặc keys.

## API chính

- GET `/api/auth/csrf`, `/api/auth/delivery-mode`.
- POST `/api/auth/register`, `/login`, `/logout`, `/forgot-password`, `/reset-password`, `/verify-email`, `/resend-verification`.
- GET/PUT `/api/account/me`.
- POST `/api/account/change-password`.
- GET/POST `/api/account/addresses`; PUT/DELETE `/api/account/addresses/{id}`.
- GET `/api/account/orders` (chỉ các đơn của người đăng nhập).
- GET `/api/admin/access` (chỉ Admin).

## Kiểm thử

`npm test`: các kiểm tra dinh dưỡng hiện có.

`npm run test:accounts`: kiểm thử tích hợp trên API local + SQL Server và thư local. Chạy backend trước, dùng database phát triển. Script tạo hai tài khoản email ngẫu nhiên thuộc `example.test`, tạo dữ liệu thử và dọn đúng dữ liệu của chúng trong `finally`. Có cập nhật tạm role và thời hạn token của riêng tài khoản thử để kiểm tra quyền/hết hạn. Không chạy script trên production. Script cần Windows Authentication và quyền tạo/xóa dữ liệu thử; có thể đặt `OFFIMEAL_TEST_SERVER` khi đổi server. Nếu vừa chạy nhiều lần, khởi động lại backend local để có cửa sổ rate limit mới.

Kịch bản gồm: validation, email trùng khác hoa/thường, chống tự cấp Admin, CSRF, xác minh và replay/cooldown, yêu cầu verified, truy cập địa chỉ/đơn của người khác, đổi role từ DB, đổi mật khẩu, token hết hạn/đã dùng, thu hồi phiên và đăng xuất, giới hạn tần suất.
