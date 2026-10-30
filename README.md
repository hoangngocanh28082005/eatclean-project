# OffiMeal

React/Vite frontend, ASP.NET Core MVC API và SQL Server.

Chạy từ thư mục có `package.json`, trong hai terminal riêng:

```powershell
npm run dev:api
```

```powershell
npm run dev
```

Kiểm tra: `npm run build`, `npm run lint`, `npm test`.

- [Kiến trúc MVC và vị trí mã nguồn](docs/ARCHITECTURE.md)
- [Backend và database](server/README.md)
- [Tài khoản, xác minh email và kiểm thử](server/ACCOUNTS.md)

Các tệp `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig*.json`, `index.html`, `src/main.tsx` và `src/styles/main.css` là cấu hình/điểm khởi động cần thiết, phải giữ khi dọn dự án. Chỉnh giao diện tại `src/features/`, thành phần chung tại `src/shared/`. `dist/` là bản build sinh tự động.
