# Kết nối OffiMealDB

Backend ASP.NET Core / EF Core đọc SQL Server đã được tạo bằng `OffiMealDB.sql`. Không tự tạo bảng, sửa schema hoặc thêm dữ liệu khi khởi động.

## Chạy trên máy hiện tại

Mở terminal tại thư mục `officemeal`:

```powershell
npm run dev:api
```

Mở terminal thứ hai:

```powershell
npm run dev
```

API local: `http://localhost:5050/api/health`, `/api/meals`, `/api/packages`.
Vite chuyển tiếp `/api` đến backend, nên frontend gọi URL tương đối `/api/...`.

Cấu hình Development sử dụng Windows Authentication tới `DESKTOP-V2J7BSI`, database `OffiMealDB`. Không cần mật khẩu sa. Trên máy khác, thay server và cấp quyền cho tài khoản Windows chạy backend. `TrustServerCertificate=True` chỉ dành cho môi trường phát triển local; production cần chứng chỉ hợp lệ và cấu hình kết nối riêng phía server.

## Phạm vi hiện tại

- GET `/api/health`: kiểm tra kết nối database (503 khi không kết nối được).
- GET `/api/meals`: món đang bán, dữ liệu camelCase phù hợp frontend; không tự giả định có thông tin dị ứng đã xác minh.
- GET `/api/packages`: gói đang hoạt động.
- Đã có API và giao diện tài khoản, xác minh/khôi phục mật khẩu, địa chỉ và đọc đơn theo người đăng nhập. Xem [ACCOUNTS.md](ACCOUNTS.md) để chạy schema bổ sung, kiểm thử thư local và cấu hình SMTP. Trang dinh dưỡng vẫn dùng hồ sơ localStorage, chưa có API lưu thể trạng.
- Database mới có thể trả `[]` ở `/api/meals` vì SQL nguồn chỉ seed gói và chế độ ăn, chưa seed món.

## Bước tiếp theo

1. Nhập dữ liệu món thật với nguyên liệu và dinh dưỡng đã kiểm tra.
2. Bổ sung schema hồ sơ: giới tính dùng trong công thức, chế độ ăn, nguyên liệu thích/không thích, dị ứng, tỷ lệ calo bữa trưa. Thống nhất cách đổi ngày sinh thành tuổi, và ánh xạ goal/activity giữa API với SQL.
3. Dùng danh tính đăng nhập đã có để xây API hồ sơ thể trạng, không nhận userId tùy ý từ trình duyệt.
4. Chuyển nguồn dữ liệu React sang API, xử lý tải/rỗng/lỗi rõ ràng. Không âm thầm thay bằng món mẫu khi API lỗi.

Khi đưa lên hosting, cấu hình reverse proxy `/api` ở môi trường production; proxy trong Vite chỉ phục vụ phát triển local.
