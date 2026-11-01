# Nhận diện OffiMeal

- Logo web: `public/logo-offimeal.png`, dùng chung ở đầu và chân trang qua `BrandLogo.tsx`.
- Biểu tượng tab: `public/favicon.svg`, phiên bản chữ O và chiếc lá đơn giản để đọc được ở kích thước nhỏ.
- Màu và font dùng chung: `src/styles/main.css`.
- Xanh đậm chủ đạo: `#2d502b`; ô liu: `#94ad48`; cam: `#e58029`; nền kem: `#fcfaf4`.
- Chữ chính xanh đậm `#19351e`. Nút cam dùng chữ xanh đậm, không dùng chữ trắng trên cam sáng. Các cặp chữ/nền chính đã được kiểm tra độ tương phản: xanh đậm trên cam 4,75:1; trắng trên xanh 9,15:1.
- Header, footer, trạng thái điều hướng, nút, form, thẻ món, khối dinh dưỡng và gói ăn đều sử dụng bảng màu này.

Logo web là bản xử lý từ ảnh tham chiếu người dùng gửi bằng công cụ imagegen tích hợp (built-in), giữ bố cục hộp cơm, lá, người vận động và chữ OffiMeal. Đây không phải tệp ảnh gốc đã được sao chép nguyên pixel. Nền trắng được giữ để các chi tiết và chữ xanh đọc rõ trên chân trang xanh đậm.

Prompt đã sử dụng:

> Use case: precise-object-edit. Edit target: the most recent user-attached OffiMeal logo image. Prepare a faithful web-ready copy of THIS SAME LOGO, not a redesign. Preserve its exact composition: green circular arc and two large leaves at upper left, green running person upper right, central illustrated healthy meal box with chicken/rice/vegetables, the word 'OffiMeal' (Offi dark green, Meal orange) below, and exact tagline 'Healthy Meals • Better You • Every Workday'. Preserve all colors, proportions, recognizable shapes, lettering style and food details. Only trim excessive outer blank white margins so the whole logo and tagline fill about 90% of the canvas width; keep a clean pure white background. Keep all text legible and spelled exactly. No additional text, no mockup, no shadows or framing. Output a single high resolution image of the complete supplied logo with comfortable small margins, ready to use as a website brand asset.

Khi có tệp logo gốc, có thể thay trực tiếp `public/logo-offimeal.png`; nếu tỷ lệ ảnh khác, cập nhật width/height trong `src/shared/components/ui/BrandLogo.tsx`.
