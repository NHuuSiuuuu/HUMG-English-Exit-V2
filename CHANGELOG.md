# Changelog

Tất cả các thay đổi đáng chú ý của dự án **HUMG English Exit** sẽ được ghi lại trong tài liệu này.

Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/vi/1.0.0/), và dự án này tuân thủ [Semantic Versioning](https://semver.org/).

---

## [1.0.0] - 2026-10-01

### Added
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

### Fixed
- **Sửa lỗi khóa trạng thái Part**: Khắc phục vấn đề sau khi Part đã chuyển sang trạng thái "Công khai" thì nút thao tác không cho phép chuyển ngược lại về "Bản nháp".
- **Loại bỏ hộp thoại trình duyệt nguyên bản**: Thay thế các hàm `alert()` trong giao diện phòng làm bài luyện tập bằng thông báo toast chuyên nghiệp.

### Removed
- Xóa bỏ các state thông báo dư thừa và banner cảnh báo lỗi/thành công inline gây choán diện tích giao diện trên các biểu mẫu và bảng quản trị.
- **Gỡ bỏ cụm nút điều hướng Part tĩnh**: Loại bỏ hoàn toàn khối wrapper và các nút hiển thị "Part {n}" tĩnh ở cuối trang bài tập luyện tập ([practice-workspace.tsx](file:///d:/Clone/HUMG-EnglishExitV2/src/frontend/components/practice/practice-workspace.tsx)), giúp giao diện tinh gọn và sạch sẽ hơn.

