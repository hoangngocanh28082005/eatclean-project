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

Sau khi có database, chạy thêm hai script (chạy lại được, không xóa dữ liệu):

```powershell
sqlcmd -S localhost -E -C -d OffiMealDB -b -f 65001 -i server/sql/001_accounts.sql
sqlcmd -S localhost -E -C -d OffiMealDB -b -f 65001 -i server/sql/002_catalog_orders.sql
```

`002_catalog_orders.sql` thêm chỉ mục chống gửi lặp, đổi tên gói sang tiếng Việt và seed 6 món mẫu. Số carb/béo của món mẫu là ước lượng, cần bếp xác nhận trước khi mở bán.

Cấu hình Development sử dụng Windows Authentication tới SQL Server trên `localhost`, database `OffiMealDB`. Không cần mật khẩu sa. Nếu dùng instance khác, thay server và cấp quyền cho tài khoản Windows chạy backend. `TrustServerCertificate=True` chỉ dành cho môi trường phát triển local; production cần chứng chỉ hợp lệ và cấu hình kết nối riêng phía server.

## Phạm vi hiện tại

- GET `/api/health`: kiểm tra kết nối database (503 khi không kết nối được).
- GET `/api/meals`: món đang bán, dữ liệu camelCase phù hợp frontend; không tự giả định có thông tin dị ứng đã xác minh.
- GET `/api/packages`: gói đang hoạt động.
- Đã có API và giao diện tài khoản, xác minh/khôi phục mật khẩu, địa chỉ và đọc đơn theo người đăng nhập. Xem [ACCOUNTS.md](ACCOUNTS.md) để chạy schema bổ sung, kiểm thử thư local và cấu hình SMTP. Trang dinh dưỡng vẫn dùng hồ sơ localStorage, chưa có API lưu thể trạng.
- Database mới trả `[]` ở `/api/meals` cho đến khi chạy `002_catalog_orders.sql`.
- POST `/api/subscriptions`: tạo gói `Pending` kèm khoản thanh toán `Pending`.
- GET `/api/payments/pending` (Admin): các khoản đang chờ đối soát, kèm thông tin khách. Giao diện ở `/quan-tri`.
- POST `/api/payments/{id}/confirm` (Admin): xác nhận thanh toán, chuyển gói sang `Active`.
- Thông tin tài khoản nhận tiền và mã VietQR hiện ở trang Đơn hàng lấy từ `src/features/orders/data/bankAccount.ts`.
- POST `/api/orders`: đặt một lần giao trong gói `Active`, trừ `RemainingMeals`, không thu thêm tiền.
- GET `/api/orders/manage` (Admin): đơn của mọi khách, kèm địa chỉ giao. Giao diện ở `/quan-tri`.
- PATCH `/api/orders/{id}/status` (Admin): chuyển đơn từng bước `Pending → Confirmed → Delivering → Delivered`. Chỉ đánh dấu `Delivered` được từ ngày giao.
- POST `/api/orders/{id}/received`: khách xác nhận đã nhận đơn đang giao của chính mình, chuyển sang `Delivered`.

## Bước tiếp theo

1. Nhập dữ liệu món thật với nguyên liệu và dinh dưỡng đã kiểm tra.
2. Bổ sung schema hồ sơ: giới tính dùng trong công thức, chế độ ăn, nguyên liệu thích/không thích, dị ứng, tỷ lệ calo bữa trưa. Thống nhất cách đổi ngày sinh thành tuổi, và ánh xạ goal/activity giữa API với SQL.
3. Dùng danh tính đăng nhập đã có để xây API hồ sơ thể trạng, không nhận userId tùy ý từ trình duyệt.
4. Chuyển nguồn dữ liệu React sang API, xử lý tải/rỗng/lỗi rõ ràng. Không âm thầm thay bằng món mẫu khi API lỗi.

Khi đưa lên hosting, cấu hình reverse proxy `/api` ở môi trường production; proxy trong Vite chỉ phục vụ phát triển local.
