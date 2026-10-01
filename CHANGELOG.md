# Changelog

Tất cả các thay đổi đáng chú ý của dự án **HUMG English Exit** sẽ được ghi lại trong tài liệu này.

Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/vi/1.0.0/), và dự án này tuân thủ [Semantic Versioning](https://semver.org/).

---

## [1.0.0] - 2026-10-01

### Added
- **Hệ thống Xem lại Lịch sử Thi thử (Exam Attempt History)**:
  - Xây dựng trang chuyên biệt xem toàn bộ lịch sử thi `/thi-thu/lich-su` ([ExamHistoryPage](file:///d:/Clone/HUMG-EnglishExitV2/src/app/%28public%29/thi-thu/lich-su/page.tsx)) và component [ExamHistoryView](file:///d:/Clone/HUMG-EnglishExitV2/src/frontend/components/exam/exam-history-view.tsx).
  - 4 Thẻ chỉ số tổng quan: Tổng lượt thi, Số bài hoàn thành, Kỷ lục điểm cao nhất (%), và Tỷ lệ Đạt chuẩn (%).
  - Bộ lọc bài thi theo trạng thái: Tất cả, Đạt chuẩn (≥ 50%), Chưa đạt (< 50%).
  - Thẻ chi tiết từng lần thi: ngày giờ nộp bài, thời gian làm bài, điểm tổng quan, phân tích điểm kỹ năng Reading vs Listening, trạng thái Đạt/Chưa đạt, cùng nút xem lại chi tiết bài làm & lời giải và nút thi lại.
  - Tích hợp khối "Lịch sử làm đề này của bạn" trên trang hướng dẫn đề thi [ExamInstructionView](file:///d:/Clone/HUMG-EnglishExitV2/src/frontend/components/exam/exam-instruction-view.tsx), cho phép xem lại các lần thi trước của chính đề đó.
  - Bổ sung nút "Lịch sử thi của tôi" ở đầu trang danh sách đề thi (`/thi-thu`) và nút "Lịch sử các lần thi" trên bảng điểm kết quả (`/thi-thu/[id]/ket-qua/[attemptId]`).
  - Tiện ích [attempt-storage.ts](file:///d:/Clone/HUMG-EnglishExitV2/src/frontend/lib/attempt-storage.ts) lưu trữ kép: kết hợp giữa tài khoản đăng nhập (Database) và máy khách (LocalStorage) giúp thí sinh chưa đăng nhập vẫn lưu và xem lại được lịch sử.
  - API `GET/POST /api/exam/attempts/history` và phương thức `getUserExamHistory` trong `attemptService`.
- **Hệ thống Thi thử và Chấm điểm tự động (Mock Exam & Scoring Engine)**:
  - Cập nhật cơ sở dữ liệu PostgreSQL qua Prisma: bổ sung model `ExamAttempt` và enum `AttemptStatus` (`IN_PROGRESS`, `COMPLETED`, `EXPIRED`) lưu trữ lượt thi, thời gian bắt đầu, hạn chót server, bài làm JSON và toàn bộ điểm số từng kỹ năng.
  - Xây dựng module thuần logic tính điểm [exam-scoring.ts](file:///d:/Clone/HUMG-EnglishExitV2/src/backend/lib/exam-scoring.ts) có unit test TDD (`test/exam-scoring.test.mjs`):
    - Phân tách chính xác điểm 2 khối: Reading & Writing (Part 1-8) và Listening (Part 10-14).
    - Tách riêng Part 9 Writing theo quy định PRD mục 13: đếm số từ tự động, kiểm tra độ dài 25-35 từ, bài viết mẫu và rubric, không cộng vào điểm trắc nghiệm khách quan tự động.
    - Chấm điểm khách quan: trắc nghiệm (MCQ3, Match Pool, Cloze MCQ) và điền từ ngắn (`short_text`, không phân biệt hoa thường, tự động loại bỏ khoảng trắng thừa, hỗ trợ danh sách `accepted_answers`).
    - Tính điểm phần trăm từng kỹ năng, điểm tổng quát và trạng thái Đạt/Chưa đạt (ngưỡng 50%).
  - Dịch vụ máy chủ [attempt.service.ts](file:///d:/Clone/HUMG-EnglishExitV2/src/backend/services/attempt.service.ts):
    - Đảm bảo tính giờ tuyệt đối theo server (`started_at`, `deadline_at`), tự động chốt bài khi quá hạn kèm dung sai 30s.
    - Bảo mật dữ liệu: Lọc bỏ toàn bộ `correct_answer`, `accepted_answers`, `explanation` khi truyền dữ liệu xuống phòng thi.
    - Tự động lưu bài làm liên tục (Autosave).
  - Hệ thống API phòng thi:
    - `POST /api/exam/attempts`: Khởi tạo lượt thi.
    - `GET /api/exam/attempts/[id]`: Tải dữ liệu phòng thi bảo mật.
    - `PUT /api/exam/attempts/[id]/save`: Tự động lưu đáp án.
    - `POST /api/exam/attempts/[id]/submit`: Nộp bài và kích hoạt chấm điểm.
    - `GET /api/exam/attempts/[id]/result`: Lấy kết quả và giải thích chi tiết.
  - Giao diện Phòng thi thử 60 phút (`/thi-thu/[id]/lam-bai`):
    - [ExamRoomHeader](file:///d:/Clone/HUMG-EnglishExitV2/src/frontend/components/exam/exam-room-header.tsx): Đồng hồ đếm ngược server thời gian thực (chuyển cảnh báo đỏ khi < 5 phút), hiển thị số câu đã làm, nút Nộp bài 3D xúc giác.
    - [ExamPartNavigator](file:///d:/Clone/HUMG-EnglishExitV2/src/frontend/components/exam/exam-part-navigator.tsx): Thanh điều hướng nhanh 14 phần với huy hiệu tiến độ câu đã làm.
    - [ExamPartCard](file:///d:/Clone/HUMG-EnglishExitV2/src/frontend/components/exam/exam-part-card.tsx): Hiển thị từng Part trong 14 phần cuộn liên tục, tích hợp audio player cho Listening và bộ đếm từ trực tiếp cho Part 9.
    - [ExamRoomWorkspace](file:///d:/Clone/HUMG-EnglishExitV2/src/frontend/components/exam/exam-room-workspace.tsx): Tự động nộp khi hết giờ, xác nhận trước khi nộp sớm.
  - Giao diện Bảng điểm & Kết quả chi tiết (`/thi-thu/[id]/ket-qua/[attemptId]`):
    - [ExamResultView](file:///d:/Clone/HUMG-EnglishExitV2/src/frontend/components/exam/exam-result-view.tsx): Banner tổng kết điểm số, huy hiệu Đạt/Chưa đạt, thẻ so sánh Reading vs Listening, khu vực tự đối chiếu Writing (bài làm, số từ, bài mẫu tham khảo, rubric), và chi tiết từng câu kèm viền xanh lá (đáp án đúng) / viền đỏ (đáp án sai) và giải thích.
- **Hệ thống Xác thực người dùng (Authentication)**:
  - Triển khai đầy đủ các luồng: Đăng nhập (`/dang-nhap`), Đăng ký tài khoản sinh viên (`/dang-ky`), Quên mật khẩu (`/quen-mat-khau`) và Đặt lại mật khẩu (`/dat-lai-mat-khau`).
  - Kết nối cơ sở dữ liệu PostgreSQL qua Prisma ORM, kiểm tra định dạng email sinh viên HUMG và mật khẩu bảo mật.
  - Quản lý phiên làm việc bằng Session Cookie an toàn và đồng bộ trạng thái đăng nhập tức thì thông qua `AuthProvider`.
- **Chức năng Chỉnh sửa phần thi (Edit Part)**:
  - Bổ sung nút "Sửa" vào cột Thao tác trong bảng Quản lý Kho phần (`PartBankManager`), sử dụng icon `Pencil` từ thư viện `lucide-react` đồng bộ với giao diện chung.
  - Tạo trang chỉnh sửa chuyên biệt `/admin/kho-phan/[id]/chinh-sua` tải dữ liệu chi tiết của Part và các câu hỏi đi kèm.
  - Triển khai các API `GET /api/admin/parts/[id]` và `PUT /api/admin/parts/[id]` cùng hàm nghiệp vụ `updatePart` trong `part.service`.
  - Bộ thẩm định dữ liệu xuất bản chuẩn Cambridge KET: kiểm tra số lượng câu hỏi, đáp án đúng hợp lệ, file audio cho phần Nghe và ảnh/văn bản bài đọc cho phần Đọc.
- **Hệ thống Toast Notification toàn cục**:
  - Tích hợp thư viện `sonner`, tạo component UI [sonner.tsx](file:///d:/Clone/HUMG-EnglishExitV2/src/frontend/components/ui/sonner.tsx) tương thích hoàn hảo với cả hai theme Sáng (Light) và Tối (Dark).
  - Cấu hình Global `<Toaster />` tại [layout.tsx](file:///d:/Clone/HUMG-EnglishExitV2/src/app/layout.tsx) với `position="top-right"` và `richColors` để hiển thị đồng bộ trên mọi trang.
- **Hệ thống Quản lý Đề thi thử (Exam Bank & Exam Builder)**:
  - Quản lý danh sách đề thi 14 Parts, ghép đề từ kho phần có sẵn và kiểm tra tính toàn vẹn trước khi công khai.
- **Hệ thống Quản trị viên bổ trợ**:
  - Quản lý bài viết cẩm nang ôn tập (`ArticleManager`), hỗ trợ định dạng Markdown và tải ảnh bìa.
  - Kho quản lý file nghe audio và tài nguyên scan đề thi (`MediaManager`) tích hợp Cloudinary và trình phát âm thanh mini.
  - Quản lý tài khoản sinh viên và người dùng (`UserManager`): phân quyền, khóa/mở khóa tài khoản, tạo mật khẩu tạm thời.
  - Cấu hình tham số hệ thống và nhật ký kiểm toán quản trị (`SystemSettingsForm`).

### Changed
- **Thay thế toàn bộ thông báo Inline bằng Toast Notification**:
  - Xóa bỏ triệt để các state lưu thông báo cục bộ (`feedbackMessage`, `serverError`, `saveSuccessMessage`, `errorMessage`, `uploadError`) và các khối banner chữ/khung viền hiển thị trực tiếp trên form/bảng.
  - Chuyển toàn bộ phản hồi sang các hàm gọi `toast.success`, `toast.error`, `toast.info` mượt mà, giúp chống giật layout (layout shift) và nâng cao trải nghiệm người dùng (UX) hiện đại.
  - Áp dụng trên toàn bộ các màn hình CRUD: Kho phần, Soạn thảo phần thi, Quản lý đề thi, Ghép đề thi, Quản lý bài viết, Soạn bài viết, Kho media, Quản lý người dùng, Cài đặt hệ thống, các biểu mẫu Xác thực và Phòng luyện tập.
- **Hỗ trợ chuyển đổi trạng thái hai chiều linh hoạt cho Part**:
  - Nâng cấp API `PATCH /api/admin/parts/[id]` và hàm `updatePartStatus` cho phép chuyển đổi trạng thái qua lại giữa **Công khai (PUBLISHED)** và **Bản nháp (DRAFT)**, giúp quản trị viên dễ dàng thu hồi bài thi để chỉnh sửa hoặc bổ sung nội dung.
- **Tăng cỡ chữ tối thiểu cho thẻ `<p>` trên màn hình desktop**:
  - Bổ sung quy tắc CSS media query toàn cục trong [globals.css](file:///d:/Clone/HUMG-EnglishExitV2/src/frontend/styles/globals.css) đảm bảo toàn bộ các thẻ `<p>` trên màn hình desktop/tablet (>= 768px) đạt kích thước tối thiểu **14px** (tự động nâng cấp các thẻ có class `text-xs` hay nằm trong container chữ nhỏ lên 14px).
  - Nâng cấp cỡ chữ mặc định của [CardDescription](file:///d:/Clone/HUMG-EnglishExitV2/src/frontend/components/ui/card.tsx) và khối thông báo sang `text-sm` (14px) nhằm tăng khả năng đọc và giảm mỏi mắt cho người dùng.
- **Cải tiến giao diện các nút lựa chọn câu hỏi trắc nghiệm A, B, C, D**:
  - Thiết kế lại các nút phương án trắc nghiệm ([mcq3-renderer.tsx](file:///d:/Clone/HUMG-EnglishExitV2/src/frontend/components/practice/questions/mcq3-renderer.tsx), [cloze-mcq-renderer.tsx](file:///d:/Clone/HUMG-EnglishExitV2/src/frontend/components/practice/questions/cloze-mcq-renderer.tsx)) thành dạng thẻ bo góc lớn `rounded-2xl` với viền `border-2` rõ nét và bóng đổ đáy nhẹ `shadow-[0_2px_0_0_#e2e8f0]`.
  - Trạng thái được chọn hiển thị viền xanh cyan `#0095F6`, chữ in đậm đồng màu và bóng đổ đáy đồng bộ, triệt tiêu hoàn toàn giật layout (layout shift) và giúp sinh viên phân biệt phương án trực quan.
- **Nâng cấp toàn bộ hệ thống Button sang phong cách 3D xúc giác (Tactile Pushable Buttons)**:
  - Thay thế toàn bộ bóng đổ mờ nhạt (fuzzy drop shadow) bằng khối bóng đổ đáy đặc 3.5px (`shadow-[0_3.5px_0_0]`) và hiệu ứng lún nút khi nhấn (`active:translate-y-[2px]`), mô phỏng nút bấm cơ học hiện đại, chân thực, tạo cảm giác bấm rất thích tay.
  - Chuẩn hóa các biến thể màu sắc theo đúng ảnh mẫu: Báo lỗi (Đỏ coral), Ghi chú (Xanh cyan), Nộp bài (Thẻ trắng viền xanh), Transcript (Xanh dương), Trợ lý AI (Gradient Tím - Indigo), Lịch sử (Tím).
- **Tăng kích thước chữ toàn diện cho toàn bộ các nút bấm**:
  - Nâng cấp cỡ chữ cơ bản của component [Button](file:///d:/Clone/HUMG-EnglishExitV2/src/frontend/components/ui/button.tsx): size `sm` lên `text-sm` (14px), `md` lên `text-sm sm:text-base` (14px - 16px), `lg` lên `text-base sm:text-lg` (16px - 18px).
  - Tăng toàn bộ các nút chức năng từ `text-xs` (12px) lên `text-sm font-bold` (14px): các nút điều khiển phòng bài tập (`Báo lỗi`, `Ghi chú`, `Nộp bài`, `Transcript`, `Trợ lý AI`, `Lịch sử`), các nút hành động trên thẻ bài tập, nút đăng nhập/đăng ký trên Header và Mobile drawer.
- **Tích hợp bộ chuyển đổi giao diện Dark/Light vào menu người dùng**:
  - Ẩn nút `ThemeToggle` ngoài thanh Header khi người dùng đã đăng nhập để Header gọn gàng, không bị rối mắt.
  - Tích hợp khối chuyển đổi chế độ Sáng / Tối dạng tab bấm phân đoạn `[☀️ Sáng] [🌙 Tối]` trực quan ngay bên trong menu hồ sơ tài khoản ([header.tsx](file:///d:/Clone/HUMG-EnglishExitV2/src/frontend/components/layout/header.tsx)) và chân menu di động ([mobile-nav.tsx](file:///d:/Clone/HUMG-EnglishExitV2/src/frontend/components/layout/mobile-nav.tsx)).

### Fixed
- **Sửa lỗi khóa trạng thái Part**: Khắc phục vấn đề sau khi Part đã chuyển sang trạng thái "Công khai" thì nút thao tác không cho phép chuyển ngược lại về "Bản nháp".
- **Loại bỏ hộp thoại trình duyệt nguyên bản**: Thay thế các hàm `alert()` trong giao diện phòng làm bài luyện tập bằng thông báo toast chuyên nghiệp.

### Removed
- Xóa bỏ các state thông báo dư thừa và banner cảnh báo lỗi/thành công inline gây choán diện tích giao diện trên các biểu mẫu và bảng quản trị.
- **Gỡ bỏ cụm nút điều hướng Part tĩnh**: Loại bỏ hoàn toàn khối wrapper và các nút hiển thị "Part {n}" tĩnh ở cuối trang bài tập luyện tập ([practice-workspace.tsx](file:///d:/Clone/HUMG-EnglishExitV2/src/frontend/components/practice/practice-workspace.tsx)), giúp giao diện tinh gọn và sạch sẽ hơn.
- **Gỡ bỏ nhãn Thí sinh và Đồng hồ đếm giờ ở chế độ Ôn luyện**: Loại bỏ dòng chữ `Thí sinh: Sinh viên HUMG` và khối đồng hồ tính giờ đếm giây trên thanh điều hướng phòng luyện tập ([practice-room-header.tsx](file:///d:/Clone/HUMG-EnglishExitV2/src/frontend/components/practice/practice-room-header.tsx)) để sinh viên tự do làm bài không bị áp lực thời gian như phòng thi thật, đồng thời hiển thị huy hiệu Part cùng tiến độ số câu đã làm rõ ràng hơn.

