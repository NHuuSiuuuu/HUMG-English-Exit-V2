# Design Spec: Kiến trúc Hệ thống HUMG English Exit

| Thông tin | Chi tiết |
|---|---|
| **Dự án** | HUMG English Exit (Nền tảng ôn luyện & thi thử chuẩn đầu ra tiếng Anh HUMG) |
| **Phiên bản tài liệu** | 1.1 (Bỏ chức năng song ngữ, chuẩn hóa 100% Tiếng Việt theo yêu cầu) |
| **Ngày lập** | 30/09/2026 |
| **Trạng thái** | Đã duyệt (Approved) |
| **Định dạng đề thi** | Cambridge KET (A2 Key) — 14 Phần thi trong 60 phút |

---

## 1. Tổng quan & Mục tiêu (Overview & Goals)

### 1.1 Bối cảnh bài toán
Sinh viên Trường Đại học Mỏ - Địa chất (HUMG) cần đạt chuẩn đầu ra ngoại ngữ tương đương trình độ Cambridge KET (A2 Key) để tốt nghiệp. Hiện tại sinh viên gặp các rào cản:
1. Thiếu nền tảng luyện tập tương tác có phản hồi ngay cho 14 dạng bài KET.
2. Chưa có môi trường thi thử mô phỏng đề thật liên tục 14 phần với áp lực thời gian 60 phút và tự động chấm điểm.
3. Việc tra cứu điểm thi và lịch thi phải truy cập cổng riêng của Trung tâm Ngoại ngữ - Tin học CFI.

### 1.2 Mục tiêu cốt lõi
- Xây dựng website ứng dụng chuẩn Next.js App Router, **giao diện 100% Tiếng Việt** tối ưu cho sinh viên HUMG (nội dung đề thi giữ nguyên tiếng Anh gốc), hỗ trợ giao diện Sáng / Tối, responsive mượt mà trên 3 loại thiết bị (Mobile 375px, Tablet 768px, Desktop 1280px).
- Cung cấp 2 chế độ học tập chính: **Ôn luyện từng phần lẻ (Practice Hub)** và **Thi thử mô phỏng 60 phút (Mock Exam Engine)**.
- Tích hợp tra cứu điểm thi và lịch thi trực tiếp từ hệ thống CFI HUMG mà không thu thập dữ liệu cá nhân của sinh viên.
- Trang bị khu quản trị **Admin Dashboard** hoàn chỉnh cho giảng viên / ban quản trị quản lý ngân hàng câu hỏi (Part bank), ghép đề thi, quản lý bài viết và người dùng.

---

## 2. Ranh giới kiến trúc mã nguồn (Architectural Boundaries)

Dự án áp dụng cấu trúc phân tách vật lý nghiêm ngặt được quy định trong `AGENTS.md` nhằm bảo vệ logic nghiệp vụ, bảo mật đề thi và tối ưu hóa hiệu năng render.

```
.
├─ docs/                      PRD.md, DESIGN.md, PAGES.md, superpowers/
├─ public/                    static assets, robots.txt
├─ messages/                  vi.json (Chuỗi giao diện tiếng Việt dùng chung)
└─ src/
   ├─ app/                    ROUTING (Rất mỏng: gom route, gọi backend service, truyền props)
   │  ├─ (public)/            /, /on-luyen, /thi-thu, /bai-viet, /tra-cuu
   │  ├─ (auth)/              /dang-nhap, /dang-ky, /quen-mat-khau
   │  ├─ admin/               Khu quản trị /admin/*
   │  └─ api/                 Route handlers mỏng
   │
   ├─ frontend/               GIAO DIỆN (Chỉ chạy trên client/browser)
   │  ├─ components/
   │  │  ├─ ui/               Primitives (Button, Card, Badge, Accordion...)
   │  │  ├─ layout/           Header, Footer, MobileNav, ThemeToggle
   │  │  ├─ home/             Các khối Landing Page (Hero, Features, Structure, Stats, FAQ...)
   │  │  └─ admin/            Sidebar, bảng điều khiển, trình quản lý
   │  ├─ providers/           ThemeProvider
   │  ├─ lib/                 utils.ts (cn)
   │  └─ styles/              globals.css (Design tokens CSS variables)
   │
   ├─ backend/                NGHIỆP VỤ & DỮ LIỆU (Chỉ chạy ở server)
   │  ├─ services/            exam.service.ts, article.service.ts, user.service.ts
   │  └─ lib/                 db.ts, scoring.ts, time.ts (Luôn có import "server-only")
   │
   └─ shared/                 DÙNG CHUNG (Lớp trung lập, KHÔNG chứa bí mật)
      ├─ types/               DTOs, Exam types, Article types, i18n types
      ├─ schemas/             Zod validation schemas
      └─ constants/           exam-parts.ts (Hằng số 14 part KET)
```

### Quy tắc bất biến về ranh giới (Enforced by ESLint):
1. **`frontend/` TUYỆT ĐỐI KHÔNG import từ `backend/`.** Chỉ `src/app/` được gọi `backend/services`, sau đó chuyển dữ liệu đã làm sạch xuống `frontend/` qua props.
2. **`backend/` TUYỆT ĐỐI KHÔNG import từ `frontend/`.** Mọi file trong `backend/` bắt đầu bằng `import "server-only"` để tự động chặn rò rỉ mã nguồn xuống client.
3. **`shared/` chỉ chứa types, schemas Zod, hằng số.** Không chứa bí mật và không import từ `frontend/` hay `backend/`.

---

## 3. Quy chuẩn Design System & Typography

Tuân thủ tuyệt đối bảng đặc tả trong `docs/DESIGN.md` và skill `frontend-design`.

### 3.1 Bảng màu (Color Tokens)
Toàn bộ component chỉ sử dụng token ngữ nghĩa, không hard-code mã màu hex trong JSX:

| Token | Theme Sáng (Light) | Theme Tối (Dark) | Công năng sử dụng |
|---|---|---|---|
| `--background` | `#F4F7FB` | `#101925` | Nền toàn bộ trang web |
| `--surface` | `#FFFFFF` | `#1A2737` | Bề mặt thẻ, khung bài làm, nội dung đề thi |
| `--surface-raised`| `#E6EDF6` | `#243448` | Khu vực phụ, thanh điều hướng, ô nhập text |
| `--foreground` | `#14243A` | `#E9F0F8` | Màu chữ chính (đạt chuẩn tương phản WCAG AA) |
| `--muted` | `#52627A` | `#A8B7C9` | Chữ phụ, mô tả, chú thích |
| `--primary` | `#1248A0` | `#78A9FF` | Hành động chính, liên kết, điểm nhấn thương hiệu |
| `--primary-foreground`| `#FFFFFF` | `#101925` | Chữ hiển thị trên nền primary |
| `--secondary` | `#2C766E` | `#68BDB1` | Tiến độ học tập, huy hiệu Reading/Listening |
| `--accent` | `#B83E2B` | `#FF8873` | Tín hiệu cần chú ý (timer sắp hết, cảnh báo) |
| `--border` | `#D5DEEB` | `#3A4A5E` | Viền phân tách các khối nội dung |
| `--success` | `#28715E` | `#68BDB1` | Trạng thái đúng, đạt yêu cầu |
| `--danger` | `#B83E2B` | `#FF8873` | Trạng thái sai, lỗi, nút hủy quan trọng |

### 3.2 Typography & Quy cách hiển thị
- **Nunito Sans:** Tiêu đề giao diện (h1–h6), điều hướng, nhãn nút và thanh điều khiển.
- **Open Sans:** Nội dung bài đọc, câu hỏi, lựa chọn trắc nghiệm và văn bản dài để đảm bảo đọc liên tục không mỏi mắt.
- **Bo góc (Border Radius):** Tối đa `8px` (`rounded-lg`). Không bo tròn quá mức làm mất tính học thuật.
- **Vùng bấm & Khả năng tiếp cận (Accessibility):** Vùng bấm tối thiểu `44px` trên thiết bị di động; luôn có viền focus `:focus-visible` phục vụ điều khiển bằng bàn phím.
- **Ảnh bài thi:** Ảnh đề thi nền trắng luôn được đặt trên khung nền sáng (`--surface`), tuyệt đối không đảo màu ảnh trong dark mode.

---

## 4. Đặc tả các luồng nghiệp vụ chính (Core Workflows)

### 4.1 Luồng Trang chủ (Landing Page — `docs/PAGES.md` LD-01 → LD-11)
Thứ tự các khối trên trang chủ được chốt chính xác:
1. **Hero Section:** Tiêu đề định vị HUMG, mô tả, CTA kép ("Bắt đầu ôn luyện", "Thi thử 60 phút", "Tra cứu điểm CFI"), Mockup thẻ đề thi KET có đồng hồ đếm ngược và câu hỏi mẫu.
2. **Ba thẻ tính năng trọng tâm:** Ôn luyện từng part, Thi thử mô phỏng 60 phút, Tra cứu điểm CFI.
3. **Cấu trúc đề thi 14 phần:** Chia 2 khối rõ ràng Reading & Writing (Part 1-9) và Listening (Part 10-14), tổng thời gian 60 phút, tổng 75 câu + 1 bài viết note.
4. **Số liệu thống kê:** 14 dạng bài, 60 phút thi thử, 100% tự động chấm, hỗ trợ 24/7.
5. **Quy trình 3 bước:** Chọn kỹ năng → Thi thử tính giờ → Phân tích lỗi sai & cải thiện.
6. **Bài viết mới nhất:** 3 thẻ bài viết cẩm nang hướng dẫn thi cử.
7. **FAQ Accordion:** Giải đáp các câu hỏi thường gặp về chuẩn đầu ra ngoại ngữ HUMG.

### 4.2 Luồng Ôn luyện từng phần (Part Bank & Practice — PR-01 → PR-13)
- Ngân hàng Part bank chứa 14 dạng bài Cambridge KET độc lập.
- Mỗi bài luyện không có áp lực thời gian.
- Cho phép người dùng làm thử, nộp bài từng câu hoặc toàn bộ part, hiển thị ngay đáp án, transcript nghe và giải thích cặn kẽ.

### 4.3 Luồng Thi thử mô phỏng 60 phút (Mock Exam Engine — MK-01 → MK-14)
- **Thời gian kiểm soát phía máy chủ (Server-authoritative):**
  - Khi bắt đầu: Server ghi nhận `started_at` và chốt `deadline_at = started_at + 60 phút`.
  - Client chỉ nhận `deadline_at` để render đồng hồ đếm ngược.
  - Khi còn dưới 10 phút: Đổi màu cảnh báo. Khi còn dưới 5 phút: Đổi sang màu nguy cấp.
  - Khi hết giờ: Client khóa toàn bộ tương tác và kích hoạt nộp bài tự động.
- **Autosave liên tục & Chống mất bài:**
  - Mỗi khi click chọn trắc nghiệm hoặc sau 500ms ngừng gõ ô text: Gửi payload cập nhật lên máy chủ.
  - Lưu bản sao dự phòng vào LocalStorage để tự động khôi phục nếu trình duyệt bị tắt đột ngột hoặc mất mạng.
- **Bảo mật đề thi:**
  - Dữ liệu câu hỏi gửi xuống client khi đang thi (`QuestionForAttempt`) **TUYỆT ĐỐI KHÔNG** chứa trường `correct_answer` hay `accepted_answers`.
  - Đáp án đúng chỉ được trả về sau khi server đã xác nhận bài thi đã nộp thành công (`QuestionWithAnswer`).

### 4.4 Luồng Tra cứu Điểm & Lịch thi CFI (LK-01 → LK-05)
- Nhúng trực tiếp cổng tra cứu chính thức của Trung tâm Ngoại ngữ - Tin học CFI: `https://kqt.cfi.humg.edu.vn`.
- Luôn hiển thị nút dự phòng **"Mở trang tra cứu chính thức (tab mới)"** phía trên khung nhúng.
- **Nguyên tắc bảo mật:** Hệ thống đóng vai trò trung gian hiển thị (embedded viewer), tuyệt đối không lưu trữ, không ghi log mã sinh viên hay dữ liệu điểm số của người dùng.

### 4.5 Khu vực Quản trị (Admin Dashboard — AD-01 → AD-13)
Phân hệ dành riêng cho quyền quản trị viên (`Admin Role`) bao gồm 7 phân hệ chính:
1. **Tổng quan (`/admin`):** KPI tổng sinh viên, lượt làm bài, đề được thi nhiều nhất, sinh viên mới đăng ký, trạng thái kết nối CFI.
2. **Kho phần (`/admin/part-bank`):** Quản lý ngân hàng 14 dạng bài KET độc lập, lọc theo kỹ năng và trạng thái.
3. **Quản lý đề thi (`/admin/de-thi`):** Ghép đề thi 14 parts từ kho phần, cấu hình thời gian 60 phút, công khai/bản nháp.
4. **Quản lý người dùng (`/admin/nguoi-dung`):** Danh sách sinh viên, mã sinh viên, lượt thi, đặt lại mật khẩu và phân quyền vai trò.
5. **Quản lý tài liệu (`/admin/tai-lieu`):** Quản lý file audio MP3 cho phần Listening và ảnh đề thi.
6. **Quản lý bài viết (`/admin/bai-viet`):** Soạn thảo cẩm nang ngữ pháp, mẹo làm bài thi.
7. **Cài đặt hệ thống (`/admin/cai-dat`):** Tham số thời gian mặc định, dung sai trễ mạng (30s), cấu hình cổng CFI.

---

## 5. Chiến lược Kiểm thử & Đảm bảo Chất lượng (Quality Assurance & Testing)

Để đạt định nghĩa "Hoàn thành" (Definition of Done) theo `AGENTS.md`:
1. **Unit Test Logic thuần:** Viết unit tests cho các hàm tính giờ (`src/backend/lib/time.ts`) và chấm điểm (`src/backend/lib/scoring.ts`) bằng Node test runner / Vitest. Các hàm này không chạm DB, đảm bảo tính tất định 100%.
2. **ESLint Boundary Enforcement:** Kiểm tra quy tắc `no-restricted-imports` để đảm bảo không có bất kỳ vi phạm nào về việc `frontend` import `backend` hoặc `backend` import `frontend`.
3. **TypeScript Strict Typecheck:** Chạy `npm run typecheck` (`tsc --noEmit`) đạt 0 lỗi, không sử dụng kiểu `any`.
4. **Production Build Verification:** Chạy `npm run build` thành công, kiểm tra SSR và bundling của Next.js hoàn toàn sạch lỗi.

---

## 6. Handoff & Bước tiếp theo

Sau khi bản Design Spec này được phê duyệt, quy trình sẽ chuyển sang skill:
👉 **`superpowers:writing-plans`** để lập Implementation Plan chi tiết theo từng task nhỏ, định rõ bài test TDD, file thay đổi và commit Conventional Commits bằng tiếng Việt.
