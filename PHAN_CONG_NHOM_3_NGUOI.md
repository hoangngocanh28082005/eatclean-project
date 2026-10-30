# Phân công hoàn thiện website OffiMeal cho nhóm 3 người

## 1. Mục tiêu và hiện trạng

Xây dựng một website OffiMeal thống nhất: người dùng tạo tài khoản, nhập hồ sơ thể trạng, nhận gợi ý dinh dưỡng và bài tập, trao đổi với trợ lý AI, đăng ký gói ăn, thanh toán và theo dõi lịch giao. Quản trị viên quản lý nội dung, khách hàng và đơn hàng trên cùng hệ thống.

Mã nguồn hiện dùng React, TypeScript, Vite, Tailwind và React Router. Trang chủ đã có các khối nội dung; trang dinh dưỡng có form tính BMR/TDEE, calo, macro và gợi ý trên trình duyệt. Trang thực đơn, gói ăn, bài tập và giới thiệu còn là trang chờ. Chưa thấy backend, database, xác thực, thanh toán hoặc quản trị trong mã nguồn đã đọc.

Các yêu cầu nền tảng từ tài liệu ý tưởng: gói tuần 350.000đ/5 bữa, gói tháng 1.300.000đ/20 bữa, thu tiền trước; thực đơn không lặp trong 4 tuần; cá nhân hóa dinh dưỡng; tổng hợp bài tập; phục vụ dân công sở và tổ chức giao bữa ăn trước 11:30 theo lịch dịch vụ.

Các chức năng tài khoản, AI, nhật ký tiến độ, thông báo, đánh giá và quy trình quản trị dưới đây là phần bổ sung đề xuất. Đây là bản phân công phát triển, chưa phải các chức năng đã được triển khai.

## 2. Các chức năng cần có và nên bổ sung

### 2.1. Đăng ký, đăng nhập và tài khoản

- Đăng ký bằng họ tên, email và mật khẩu; xác nhận mật khẩu, kiểm tra email trùng và dữ liệu không hợp lệ.
- Đăng nhập, đăng xuất, quên mật khẩu và đặt lại mật khẩu qua liên kết có thời hạn, dùng một lần.
- Xác minh email trước các thao tác cần xác nhận danh tính; cho phép gửi lại email với giới hạn tần suất.
- Chỉnh sửa thông tin cá nhân, đổi mật khẩu, quản lý số điện thoại và địa chỉ giao hàng.
- Phân quyền khách hàng và quản trị viên. Người dùng chỉ truy cập được hồ sơ, lịch sử tư vấn và đơn của mình.
- Đăng nhập Google có thể làm sau khi luồng email/mật khẩu đã ổn định.

### 2.2. Hồ sơ và dinh dưỡng cá nhân

- Nhập tuổi, chiều cao, cân nặng, thông tin cần cho công thức tính, mức vận động và mục tiêu giảm cân/duy trì/tăng cơ.
- Lưu sở thích ăn uống, nguyên liệu không thích và dị ứng để lọc món.
- Hiển thị BMR, TDEE, mục tiêu calo và protein/carb/fat; giải thích đơn vị và cách sử dụng kết quả ước tính.
- Đề xuất món theo ngân sách calo bữa ăn, mục tiêu và khẩu phần; không chỉ lấy các món đầu danh sách.
- Cho phép cập nhật hồ sơ và tính lại gợi ý. Phân biệt mục tiêu calo cả ngày với calo của riêng bữa trưa OffiMeal.

### 2.3. AI tư vấn dinh dưỡng và vận động

- Có trang hoặc khung chat “Trợ lý sức khỏe OffiMeal” để hỏi về ăn uống, cách đọc calo/macro, chọn món và cách sắp xếp bài tập văn phòng.
- Chỉ sử dụng hồ sơ thể trạng trong tư vấn khi người dùng đồng ý; cho phép hỏi chung mà không cung cấp hồ sơ.
- AI giải thích kết quả tính toán có sẵn, đề xuất món và video từ danh mục thật của website, kèm liên kết mở đúng món/bài tập.
- Các số liệu calo/macro và tổng tiền do hàm tính hoặc backend cung cấp. AI không tự thay đổi kết quả, bịa món, giá, thành phần hoặc số liệu dinh dưỡng.
- Trước khi trả kết quả, hệ thống lọc món theo dị ứng và các điều kiện đã lưu. Khi thiếu thông tin nguyên liệu thì báo chưa đủ dữ liệu để xác nhận phù hợp.
- Khi thiếu dữ liệu, AI hỏi thêm hoặc nêu giới hạn; tư vấn về bệnh lý, thuốc hoặc triệu chứng cần chuyển hướng tới nhân viên y tế phù hợp. Không xây chức năng chẩn đoán hoặc kê đơn.
- Lưu, xem lại và xóa hội thoại theo tài khoản; hiển thị đang trả lời, lỗi kết nối và nút thử lại.
- Giới hạn số lượt/độ dài câu hỏi và chi phí; xử lý khi dịch vụ AI hết hạn mức hoặc không phản hồi bằng FAQ và gợi ý theo quy tắc.
- Bản đầu chỉ cần chat văn bản và dữ liệu danh mục. Phân tích ảnh món ăn, giọng nói và AI tự sinh thực đơn nằm ở giai đoạn sau.

### 2.4. Thực đơn, gói ăn và đặt hàng

- Xem thực đơn theo tuần/ngày; tìm kiếm, lọc theo mục tiêu, chế độ ăn và nguyên liệu.
- Xem chi tiết món: ảnh, mô tả, nguyên liệu, khẩu phần, calo, protein/carb/fat và thông tin dị ứng.
- So sánh gói tuần/tháng; chọn ngày bắt đầu, lịch giao và lựa chọn món trong phạm vi gói.
- Nhập địa chỉ, người nhận, số điện thoại và ghi chú; xem tổng tiền trước khi xác nhận.
- Thanh toán bằng một phương thức thống nhất: cổng thanh toán có môi trường thử nghiệm hoặc chuyển khoản được admin đối soát.
- Xem lịch sử đơn, trạng thái thanh toán, số bữa còn lại và lịch giao từng ngày.
- Gửi yêu cầu đổi món, tạm dừng hoặc hủy gói theo chính sách. Bản đầu để admin duyệt, có hạn chót và ghi nhận lịch sử xử lý.
- Chưa cần giỏ hàng mua món lẻ nếu nhóm chỉ bán gói đăng ký.

### 2.5. Bài tập, tiến độ và nhắc lịch

- Thư viện video có bộ lọc thời lượng, cường độ, mục tiêu và mức vận động.
- Gợi ý bài tập và giãn cơ phù hợp hồ sơ; giải thích ngắn lý do đề xuất.
- Đánh dấu đã tập và ghi cân nặng theo ngày; xem biểu đồ tiến độ theo tuần/tháng.
- Nhật ký bữa ăn ở bản đầu chỉ cần người dùng xác nhận bữa đã dùng; không tự suy ra đã ăn chỉ từ trạng thái giao thành công.
- Thông báo trong website về đơn hàng, kết quả duyệt yêu cầu và lịch giao. Email ưu tiên xác minh tài khoản, đặt lại mật khẩu và xác nhận đơn.
- Nhắc uống nước/tập luyện qua email hoặc thông báo đẩy làm sau; không hứa nhắc khi đóng trình duyệt nếu chưa có cơ chế chạy nền.

### 2.6. Hỗ trợ, đánh giá và quản trị

- Trang giới thiệu, liên hệ, FAQ, chính sách giao/đổi/hủy/hoàn tiền và chính sách sử dụng dữ liệu cá nhân.
- Người dùng đánh giá bữa đã nhận, gửi yêu cầu hỗ trợ và xem trạng thái xử lý. Không cần chat trực tiếp thời gian thực ở bản đầu.
- Admin quản lý món, thành phần dinh dưỡng, thực đơn 4 tuần, gói ăn và video.
- Admin quản lý đơn, thanh toán, lịch giao, yêu cầu đổi/tạm dừng/hủy và phản hồi khách hàng.
- Dashboard cơ bản: số đơn, khoản thanh toán đã xác nhận, số gói đang hoạt động và suất cần giao theo ngày. Phân biệt tiền thu với giá trị đơn chưa thanh toán.
- Danh sách suất cần chuẩn bị/giao có thể xuất CSV để phối hợp với bếp và người giao.

## 3. Chia việc để cả 3 người làm song song

Mỗi người sở hữu trọn một phân hệ: trang khách hàng, API, bảng dữ liệu, màn hình admin và kiểm thử của phân hệ đó. Không giao toàn bộ backend, toàn bộ quản trị hoặc toàn bộ tích hợp cho một người. Các phụ thuộc vẫn tồn tại khi ghép sản phẩm, nhưng không phải điều kiện để bắt đầu lập trình.

### Người 1: Thực đơn, gói ăn, đặt hàng và vận hành giao bữa

Phụ trách toàn bộ chức năng kinh doanh bữa ăn, từ dữ liệu món đến khách đặt gói và admin xử lý đơn.

- A1. Hoàn thiện các khối thực đơn/gói ăn trên trang chủ; trang thực đơn theo ngày/tuần, tìm kiếm, lọc và chi tiết món.
- A2. Tạo và quản lý dữ liệu món: ảnh, nguyên liệu, khẩu phần, calo, protein/carb/fat, dị ứng và chế độ ăn. Chuẩn bị lịch thực đơn 4 tuần; nhóm/bếp xác nhận số liệu và chính sách.
- A3. Làm trang gói tuần/tháng, chọn ngày bắt đầu, món trong gói, lịch giao, phụ thu và địa chỉ nhận hàng.
- A4. Làm API danh mục món, thực đơn và gói; API tạo/xem đơn, đăng ký gói và lịch giao. Tự viết schema, migration và seed cho các bảng này.
- A5. Làm xác nhận đơn và tích hợp một phương thức thanh toán; server tính tổng tiền, chống tạo đơn trùng và kiểm tra kết quả thanh toán/đối soát.
- A6. Làm lịch sử/chi tiết đơn, số bữa còn lại, lịch giao và yêu cầu đổi món/tạm dừng/hủy; có kiểm tra hạn chót và quy tắc xử lý.
- A7. Tự làm các trang admin quản lý món, thực đơn, gói, đơn, thanh toán, lịch giao và duyệt yêu cầu gói; không chờ người 3 viết giao diện quản trị cho mình.
- A8. Làm thống kê đơn, khoản thu đã xác nhận, gói hoạt động, suất cần chuẩn bị/giao; xuất CSV theo ngày.
- A9. Tạo dữ liệu mẫu và mock API món/gói/đơn ngay ngày đầu theo cấu trúc đã chốt; người 2 dùng cùng dữ liệu đó để làm gợi ý và AI.
- A10. Kiểm thử giá, số bữa, ngày nghỉ, lịch giao, thanh toán thất bại, gửi lặp và quyền truy cập đơn; tự nối giao diện với API của mình.

Bắt đầu ngay: dùng tài khoản thử theo hợp đồng xác thực chung để xây thực đơn, API danh mục và luồng đặt gói. Form đặt hàng cho nhập trực tiếp địa chỉ, không bắt buộc đợi sổ địa chỉ của người 3. Khi xác thực thật có sẵn, thay adapter tài khoản thử tại một điểm rồi kiểm tra lại quyền.

Phạm vi mã: Menu/Plans, phần món và gói trên Home, các trang đặt gói/thanh toán/đơn hàng; trang admin kinh doanh; backend catalog, menus, plans, orders, subscriptions, deliveries, payments và báo cáo tương ứng.

Đầu ra độc lập: demo được chọn món/gói → tạo đơn → thanh toán thử → admin xử lý → xem lịch giao bằng tài khoản kiểm thử.

### Người 2: Dinh dưỡng, AI, bài tập và theo dõi tiến độ

Phụ trách toàn bộ chức năng sức khỏe, gồm cả dữ liệu, API và các màn hình quản trị nội dung sức khỏe.

- B1. Làm form và API hồ sơ thể trạng, mục tiêu, sở thích và dị ứng; kiểm tra đơn vị và dữ liệu nhập. Tự viết schema, migration và seed cho hồ sơ.
- B2. Hoàn thiện tính BMR/TDEE, mục tiêu calo và macro; giải thích kết quả ước tính, tách calo cả ngày với calo bữa trưa.
- B3. Viết quy tắc gợi ý món theo hồ sơ, khẩu phần và dị ứng; dùng ID/dữ liệu món chung do người 1 sở hữu, thông qua adapter danh mục.
- B4. Làm thư viện bài tập, bộ lọc, xem video và gợi ý theo mục tiêu/mức vận động; chuẩn bị và kiểm tra dữ liệu video.
- B5. Làm chat AI, câu hỏi mẫu, lịch sử/xóa hội thoại, đồng ý dùng hồ sơ, trạng thái tải/lỗi và thử lại.
- B6. Làm API AI phía server, cấu hình dịch vụ, ngữ cảnh tư vấn và giới hạn lượt/chi phí. Số liệu lấy từ hàm tính và danh mục; kiểm tra ID món/video, dị ứng và phạm vi trả lời.
- B7. Khi chưa có khóa AI, dùng phản hồi mẫu đúng định dạng để hoàn thiện luồng chat; sau đó tự thay bằng dịch vụ thật và kiểm tra chất lượng. Phản hồi mẫu phải được ghi rõ là mô phỏng.
- B8. Làm nhật ký cân nặng, xác nhận bữa ăn/bài tập và biểu đồ tiến độ; tự viết API, schema và dữ liệu mẫu.
- B9. Tự làm trang admin quản lý video, bài tập và nội dung FAQ sức khỏe dùng cho tư vấn; không chờ người 3 xây trang quản trị cho mình. Hồ sơ sức khỏe cá nhân không mặc định mở cho admin xem.
- B10. Nối gợi ý món sang chi tiết món/chọn gói bằng ID và tham số đã thống nhất; không cần chờ toàn bộ luồng thanh toán hoàn thành.
- B11. Kiểm thử công thức, bộ lọc dị ứng, không có món phù hợp, quyền sở hữu hồ sơ/hội thoại và AI lỗi/hết hạn mức; tự nối giao diện với API của mình.

Bắt đầu ngay: dùng tài khoản thử, fixture món chung và video mẫu để hoàn thiện hồ sơ, quy tắc gợi ý, API và chat mô phỏng. API thực đơn chưa xong thì adapter đọc fixture; khi API có sẵn chỉ đổi nguồn đọc, không viết lại phần gợi ý.

Phạm vi mã: Nutrition/Workouts, trang AI/tiến độ, component dinh dưỡng; admin nội dung sức khỏe; backend profiles, recommendations, workouts, progress, ai-chat và health-content.

Đầu ra độc lập: demo được nhập hồ sơ → tính dinh dưỡng → gợi ý món/video → chat → lưu tiến độ bằng tài khoản kiểm thử. AI thật là một mốc kiểm tra riêng, không coi phản hồi mô phỏng là đã hoàn thành tích hợp AI.

### Người 3: Tài khoản, giao diện nền, hỗ trợ và triển khai

Phụ trách danh tính người dùng và trải nghiệm chung; không phải người làm backend hoặc admin thay cho hai người còn lại.

- C1. Làm đầy đủ giao diện và API đăng ký/đăng nhập/đăng xuất, xác minh email, quên/đặt lại/đổi mật khẩu.
- C2. Làm phiên đăng nhập, băm mật khẩu, phân quyền khách/admin, giới hạn thử đăng nhập và hàm xác thực dùng chung. Tự viết schema, migration và seed cho users/auth.
- C3. Làm trang tài khoản, chỉnh thông tin cá nhân và sổ địa chỉ; cung cấp API theo hợp đồng thống nhất để người 1 nối vào đặt hàng.
- C4. Hoàn thiện Navbar, Footer, menu điện thoại, style/component dùng chung, trang giới thiệu, liên hệ, chính sách và trang lỗi. Hai người còn lại dùng component đang có trong repo khi bản mới chưa xong.
- C5. Làm khung admin: menu, điều hướng và kiểm tra quyền; đăng ký route từ từng phân hệ. Các trang nghiệp vụ admin do người sở hữu phân hệ tự làm.
- C6. Làm hỗ trợ khách hàng, đánh giá bữa đã nhận và các trang admin xử lý hỗ trợ/đánh giá. Kiểm tra bữa đã nhận qua adapter đơn hàng của người 1; lúc đầu dùng mock đúng hợp đồng.
- C7. Làm thông báo trong website và gửi email hệ thống. Cung cấp hàm phát thông báo thống nhất; người 1/2 gọi từ phân hệ của mình. Khi chưa xong, họ dùng adapter ghi nhận sự kiện vào log kiểm thử.
- C8. Thiết lập pipeline kiểm tra và môi trường dùng thử từ sớm với dữ liệu seed, không đợi các phân hệ hoàn tất mới deploy.
- C9. Quản lý biến môi trường, HTTPS, refresh route và hướng dẫn sao lưu/khôi phục; tổng hợp README từ hướng dẫn từng phân hệ do mỗi người viết.
- C10. Kiểm thử tài khoản, quyền, khôi phục mật khẩu, hỗ trợ và thông báo; tổ chức kiểm thử chung nhưng mỗi người tự sửa lỗi thuộc phân hệ mình.

Bắt đầu ngay: làm auth, giao diện tài khoản và khung điều hướng bằng đơn/bữa giao mẫu; không chờ người 1 có đơn thật hoặc người 2 có hồ sơ thật. Hồ sơ tài khoản và hồ sơ thể trạng là hai module riêng, liên kết qua userId.

Phạm vi mã: Auth/Account, layout/style chung, App/AppRoutes, admin shell, Support/Reviews/Notifications; backend auth, users, addresses, support, reviews, notifications và cấu hình triển khai.

Đầu ra độc lập: demo được tạo tài khoản → xác minh/khôi phục → đăng nhập → sửa thông tin/địa chỉ → gửi hỗ trợ → admin xử lý → nhận thông báo.
