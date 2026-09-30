# Kế hoạch thực thi: Nền tảng dự án, Trang chủ & Dashboard Admin

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng hoàn chỉnh nền tảng kỹ thuật chuẩn kiến trúc phân tách ranh giới, toàn bộ giao diện Trang chủ (Landing Page) và Khu quản trị Admin Dashboard cho hệ thống HUMG English Exit.

**Architecture:** Áp dụng mô hình Next.js App Router với ranh giới mã nguồn nghiêm ngặt (`src/frontend` không import `src/backend`, `src/backend` có `import "server-only"`, `src/shared` trung lập). Đảm bảo tính toán thời gian và chấm điểm do máy chủ kiểm soát (Server-authoritative), tuân thủ token màu `docs/DESIGN.md` và kiểm soát qua ESLint.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript (strict), Tailwind CSS, Lucide Icons, next-themes, Zod, Node test runner.

**Spec:** `docs/superpowers/specs/2026-09-30-humg-english-exit-architecture-design.md`

## Global Constraints

- Ranh giới: `frontend/` không import `backend/`; `backend/` có `import "server-only"`; `shared/` không chứa bí mật hay logic nghiệp vụ.
- Thiết kế: Chỉ dùng token màu trong `docs/DESIGN.md`, font Nunito Sans (headings/controls) & Open Sans (body/reading), bo góc tối đa 8px (`rounded-lg`).
- Song ngữ & Theme: Không hard-code chuỗi hiển thị, dùng `messages/vi.json` và `messages/en.json`, theme class `dark` trên `<html>`.
- Bảo mật: Không bao giờ gửi `correct_answer` về client khi đang thi; cổng CFI chỉ nhúng iframe, không lưu trữ điểm thi.
- Quy ước Git & Code: Commit message bằng tiếng Việt theo Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`); comment code tiếng Việt giải thích lý do/mục đích.

## Review Focus

1. **Rò rỉ đáp án khi làm bài:** DTO cho bài thi không được phép chứa `correct_answer`.
2. **Sai lệch thời gian thi khi client chỉnh giờ:** Đồng hồ phải tính từ `deadline_at` của server.
3. **Vi phạm ranh giới import:** Tự động bắt lỗi nếu file frontend cố tình import từ backend.
4. **Vỡ layout trên mobile:** Vùng chạm tối thiểu 44px, drawer đóng mở không che khuất hay lỗi cuộn trang.
5. **Đảo màu ảnh đề thi:** Ảnh đề nền trắng phải đặt trên `--surface`, không được invert màu trong dark mode.

---

### Task 1: Thiết lập cấu trúc dự án & Cấu hình ranh giới ESLint

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Create: `.eslintrc.json`
- Create: `.gitignore`
- Create: `.env.example`

**Interfaces:**
- Consumes: None
- Produces: TypeScript path aliases `@/frontend/*`, `@/backend/*`, `@/shared/*`, `@/messages/*`, Tailwind CSS theme tokens.

- [ ] **Step 1: Viết cấu hình package.json và tsconfig.json**
  Thiết lập dependencies: Next.js 14, React 18, Tailwind, TypeScript strict, path aliases.

- [ ] **Step 2: Viết cấu hình tailwind.config.ts tích hợp token màu**
  Cấu hình các biến CSS `--background`, `--surface`, `--primary`, `--secondary`, `--accent`, `--border` và bo góc max 8px.

- [ ] **Step 3: Cấu hình quy tắc ranh giới .eslintrc.json**
  Sử dụng `no-restricted-imports` chặn `frontend` gọi `backend` và chặn `backend` gọi `frontend`.

- [ ] **Step 4: Kiểm tra cấu hình syntax**
  Chạy kiểm tra file hợp lệ không có lỗi cú pháp JSON.

- [ ] **Step 5: Commit**
  ```bash
  git add package.json tsconfig.json tailwind.config.ts postcss.config.mjs .eslintrc.json .gitignore .env.example
  git commit -m "chore: khởi tạo cấu trúc dự án và thiết lập ranh giới eslint"
  ```

---

### Task 2: Xây dựng Logic Chấm điểm & Tính giờ thi thuần với TDD

**Files:**
- Create: `src/backend/lib/scoring.ts`
- Create: `src/backend/lib/time.ts`
- Create: `test/scoring.test.mjs`
- Modify: `package.json` (thêm test script)

**Interfaces:**
- Consumes: `userAnswers: Record<string, string>`, `answerKeys: Record<string, string | string[]>`
- Produces: `calculateScore()`, `checkExamDeadline()`, `ScoreResult`, `ExamTimeStatus`

- [ ] **Step 1: Viết bài test thất bại (Failing Test - Red)**
  Tạo `test/scoring.test.mjs` kiểm thử tính điểm trắc nghiệm, chấp nhận nhiều đáp án đúng (`accepted_answers`), và tính tỷ lệ hoàn thành.

- [ ] **Step 2: Chạy test để xác nhận test thất bại**
  Chạy: `node --test test/scoring.test.mjs`
  Kết quả kỳ vọng: FAIL vì chưa có file `scoring.ts`.

- [ ] **Step 3: Viết mã nguồn thực thi tối thiểu (Green)**
  Tạo `src/backend/lib/scoring.ts` và `src/backend/lib/time.ts` có `import "server-only"`.

- [ ] **Step 4: Chạy test để xác nhận test vượt qua**
  Chạy: `node --test test/scoring.test.mjs`
  Kết quả kỳ vọng: PASS toàn bộ test suites.

- [ ] **Step 5: Commit**
  ```bash
  git add src/backend/lib/scoring.ts src/backend/lib/time.ts test/scoring.test.mjs package.json
  git commit -m "feat: thêm logic chấm điểm và tính giờ thi có unit test"
  ```

---

### Task 3: Chuẩn hóa Chuỗi Tiếng Việt & Theme Provider Sáng/Tối

**Files:**
- Create: `messages/vi.json`
- Create: `src/frontend/providers/theme-provider.tsx`
- Create: `src/frontend/styles/globals.css`
- Create: `src/app/layout.tsx`

**Interfaces:**
- Consumes: Dictionary `vi.json`
- Produces: ThemeProvider (`dark` class on html), RootLayout with Nunito Sans & Open Sans fonts.

- [ ] **Step 1: Tạo tệp messages/vi.json tiếng Việt chuẩn hóa**
  Chứa đầy đủ các chuỗi giao diện tiếng Việt cho Navigation, Landing page, 14 Parts và Footer.

- [ ] **Step 2: Viết ThemeProvider và globals.css**
  Định nghĩa CSS variables cho light/dark mode, focus `:focus-visible` và `prefers-reduced-motion`.

- [ ] **Step 3: Viết RootLayout nạp Google Fonts Nunito Sans và Open Sans**

- [ ] **Step 4: Commit**
  ```bash
  git add messages/vi.json src/frontend/providers/theme-provider.tsx src/frontend/styles/globals.css src/app/layout.tsx
  git commit -m "feat: chuẩn hóa chuỗi tiếng việt và theme provider sáng tối"
  ```

---

### Task 4: UI Primitives & Layout dùng chung

**Files:**
- Create: `src/frontend/components/ui/button.tsx`
- Create: `src/frontend/components/ui/card.tsx`
- Create: `src/frontend/components/ui/badge.tsx`
- Create: `src/frontend/components/ui/accordion.tsx`
- Create: `src/frontend/components/layout/header.tsx`
- Create: `src/frontend/components/layout/footer.tsx`
- Create: `src/frontend/components/layout/theme-toggle.tsx`
- Create: `src/frontend/components/layout/mobile-nav.tsx`

**Interfaces:**
- Consumes: `useLanguage()`, `useTheme()`, `cn()` utility
- Produces: Reusable UI primitives with >=44px mobile touch targets and accessible header/footer navigation.

- [ ] **Step 1: Tạo các UI primitives (Button, Card, Badge, Accordion)**
  Đảm bảo Button có chiều cao tối thiểu 44px, Card bo góc tối đa 8px.

- [ ] **Step 2: Tạo ThemeToggle và LanguageToggle**
  Hỗ trợ chuyển đổi giao diện mượt mà và chuyển ngữ VI/EN.

- [ ] **Step 3: Tạo MobileNav với Drawer**
  Khóa cuộn trang khi mở drawer và đóng khi bấm chuyển trang.

- [ ] **Step 4: Tạo Header và Footer công khai**
  Header chứa logo HUMG, điều hướng, nút Quản trị, đổi theme/ngôn ngữ. Footer liên kết cổng CFI HUMG.

- [ ] **Step 5: Commit**
  ```bash
  git add src/frontend/components/ui/ src/frontend/components/layout/
  git commit -m "feat: thêm các component ui cơ bản và layout dùng chung"
  ```

---

### Task 5: Triển khai Trang chủ (Landing Page) & Các trang liên kết

**Files:**
- Create: `src/frontend/components/home/hero-section.tsx`
- Create: `src/frontend/components/home/feature-cards.tsx`
- Create: `src/frontend/components/home/exam-structure.tsx`
- Create: `src/frontend/components/home/stats-section.tsx`
- Create: `src/frontend/components/home/how-it-works.tsx`
- Create: `src/frontend/components/home/latest-articles.tsx`
- Create: `src/frontend/components/home/faq-section.tsx`
- Create: `src/app/(public)/layout.tsx`
- Create: `src/app/(public)/page.tsx`
- Create: `src/app/(public)/on-luyen/page.tsx`
- Create: `src/app/(public)/thi-thu/page.tsx`
- Create: `src/app/(public)/bai-viet/page.tsx`
- Create: `src/app/(public)/tra-cuu/page.tsx`
- Create: `src/app/(auth)/dang-nhap/page.tsx`
- Create: `src/app/(auth)/dang-ky/page.tsx`
- Create: `src/app/not-found.tsx`

**Interfaces:**
- Consumes: `EXAM_PARTS` constants, UI Primitives, `useLanguage()`
- Produces: 7 khối hoàn chỉnh của Trang chủ theo `docs/PAGES.md` LD-01 → LD-11, iframe nhúng cổng CFI tại `/tra-cuu`.

- [ ] **Step 1: Tạo các khối nội dung Landing Page**
  Hero với mockup bài thi KET A2, 3 thẻ tính năng, Cấu trúc 14 part, Số liệu, Quy trình 3 bước, Bài viết và FAQ.

- [ ] **Step 2: Ghép vào src/app/(public)/page.tsx**
  Giữ page mỏng, ghép các khối theo thứ tự quy định.

- [ ] **Step 3: Tạo trang /tra-cuu nhúng iframe CFI**
  Tuân thủ quy tắc 9 của `AGENTS.md` (không thu thập dữ liệu điểm, có nút mở tab mới).

- [ ] **Step 4: Tạo các trang stub (/on-luyen, /thi-thu, /bai-viet, /dang-nhap, /dang-ky, /not-found)**

- [ ] **Step 5: Commit**
  ```bash
  git add src/frontend/components/home/ src/app/(public)/ src/app/(auth)/ src/app/not-found.tsx
  git commit -m "feat: hoàn thiện giao diện landing page và các trang điều hướng"
  ```

---

### Task 6: Xây dựng Khu quản trị Admin Dashboard (`/admin/*`)

**Files:**
- Create: `src/frontend/components/admin/admin-sidebar.tsx`
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/part-bank/page.tsx`
- Create: `src/app/admin/de-thi/page.tsx`
- Create: `src/app/admin/nguoi-dung/page.tsx`
- Create: `src/app/admin/tai-lieu/page.tsx`
- Create: `src/app/admin/bai-viet/page.tsx`
- Create: `src/app/admin/cai-dat/page.tsx`

**Interfaces:**
- Consumes: `EXAM_PARTS`, UI Primitives
- Produces: 7 phân hệ quản trị hoàn chỉnh (Tổng quan, Kho phần, Đề thi, Người dùng, Tài liệu audio, Bài viết, Cài đặt).

- [ ] **Step 1: Tạo AdminSidebar và AdminLayout**
  Sidebar cố định trên desktop, drawer trên mobile, topbar quản trị.

- [ ] **Step 2: Tạo trang Tổng quan /admin (AD-01)**
  4 thẻ KPI, bảng đề thi được làm nhiều nhất, người dùng mới đăng ký, trạng thái CFI.

- [ ] **Step 3: Tạo trang Kho phần /admin/part-bank (AD-02)**
  Bảng 14 dạng bài KET độc lập, lọc theo kỹ năng và trạng thái.

- [ ] **Step 4: Tạo các trang quản trị còn lại (de-thi, nguoi-dung, tai-lieu, bai-viet, cai-dat)**

- [ ] **Step 5: Commit**
  ```bash
  git add src/frontend/components/admin/ src/app/admin/
  git commit -m "feat: triển khai khu vực quản trị admin dashboard"
  ```

---

### Task 7: Cài đặt Dependencies, Kiểm tra Toàn diện & Nghiệm thu

**Files:**
- Verify all codebase files.

- [ ] **Step 1: Chạy kiểm tra Unit Test**
  Chạy: `node --test test/scoring.test.mjs`
  Kỳ vọng: Toàn bộ pass.

- [ ] **Step 2: Chạy kiểm tra TypeScript Strict**
  Chạy: `npm run typecheck`
  Kỳ vọng: 0 errors.

- [ ] **Step 3: Chạy kiểm tra ESLint boundaries**
  Chạy: `npm run lint`
  Kỳ vọng: 0 lint errors, ranh giới frontend/backend hoàn toàn sạch.

- [ ] **Step 4: Chạy kiểm tra Production Build**
  Chạy: `npm run build`
  Kỳ vọng: Build thành công, tạo bundle SSR tối ưu.

- [ ] **Step 5: Commit**
  ```bash
  git add .
  git commit -m "chore: nghiệm thu toàn bộ dự án sạch lỗi kiểm thử và build"
  ```
