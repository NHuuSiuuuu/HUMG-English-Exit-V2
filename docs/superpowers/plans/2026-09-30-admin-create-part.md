# Kế hoạch Thực thi: Tính năng "Tạo Part mới" trong Admin Dashboard

> **Dành cho kỹ sư / tác nhân AI:** SUB-SKILL BẮT BUỘC: Sử dụng `superpowers:subagent-driven-development` (khuyến nghị) hoặc `superpowers:executing-plans` để thực hiện kế hoạch này theo từng tác vụ. Các bước sử dụng cú pháp checkbox (`- [ ]`) để theo dõi tiến độ.

**Mục tiêu:** Xây dựng hoàn chỉnh tính năng "Tạo Part mới" (`/admin/part-bank/tao-moi`) trong Admin Dashboard, bao gồm Schema Prisma PostgreSQL, Zod validation, Service backend, API route và Form soạn thảo động cho 14 dạng đề Cambridge KET A2 bằng Tiếng Việt.

**Kiến trúc:** Dữ liệu quan hệ 3 cấp (`Part` -> `QuestionGroup` -> `Question`) trong PostgreSQL qua Prisma; ranh giới nghiêm ngặt (Frontend không import Backend, Backend có `import "server-only"`, DTO/Zod ở Shared); form client tương tác trực quan với Live Preview và Realtime Quality Checklist.

**Công nghệ:** Next.js 14 App Router, TypeScript strict, Tailwind CSS, Prisma ORM, PostgreSQL, Zod, Lucide-react, Vitest.

**Tài liệu đặc tả (Spec):** [docs/superpowers/specs/2026-09-30-admin-create-part-design.md](file:///d:/Clone/HUMG-EnglishExitV2/docs/superpowers/specs/2026-09-30-admin-create-part-design.md)

---

## Global Constraints

- Toàn bộ giao diện người dùng, nhãn, hướng dẫn và thông báo lỗi hiển thị bằng **Tiếng Việt**. Nội dung câu hỏi và bài đọc giữ nguyên văn bản tiếng Anh Cambridge KET.
- Không import chéo giữa `frontend/` và `backend/`. Mọi file trong `backend/` bắt đầu bằng `import "server-only"`.
- Mọi thao tác lưu Part từ API đều phải xác thực quyền `ADMIN` thông qua `getCurrentUser()`.
- Tuyệt đối không hard-code mã màu; sử dụng design tokens (Tailwind CSS) và hỗ trợ cả hai theme sáng/tối.
- Commit theo chuẩn Conventional Commits tiếng Việt: `feat:`, `test:`, `refactor:`, `chore:`.

---

## Review Focus

1. **Part dạng `match_pool` (Part 1, 11):** Kho đáp án A-H phải có tối thiểu 5 nhãn chữ cái và câu hỏi phải liên kết đúng chữ cái hợp lệ.
2. **Part dạng `short_text` (Part 6, 7, 8, 13, 14):** Hỗ trợ gợi ý chữ cái đầu, số ký tự hoặc nhãn ô biểu mẫu, đồng thời lưu danh sách đáp án chấp nhận phụ (`acceptedAnswers`).
3. **Part dạng `writing` (Part 9):** Lưu 3 yêu cầu ý chính, giới hạn từ 25-35 từ và bài mẫu tham khảo.
4. **Phân biệt Lưu nháp (DRAFT) vs Công khai (PUBLISHED):** DRAFT cho phép lưu thiếu câu/đáp án; PUBLISHED bắt buộc chặn và trả về lỗi nếu không đủ câu chuẩn KET hoặc thiếu đáp án.
5. **Listening Stimulus:** Trình nghe thử mini phát đúng file MP3 URL khi nhập, không gây crash nếu URL không hợp lệ.

---

## Danh sách Tác vụ Thực thi

### Tác vụ 1: Cập nhật Prisma Schema & Tạo Migration Cơ sở dữ liệu

**Files:**
- Sửa: `prisma/schema.prisma`
- Lệnh: `npx prisma db push` hoặc `npx prisma migrate dev --name add_parts_and_questions` và `npx prisma generate`

**Interfaces:**
- Produces: Các model Prisma `Part`, `QuestionGroup`, `Question` và enum `SkillType`, `PartStatus`, `QuestionType` trong `@prisma/client`.

- [ ] **Bước 1: Cập nhật `prisma/schema.prisma`**
  Thêm các enum `SkillType`, `PartStatus`, `QuestionType` và 3 model `Part`, `QuestionGroup`, `Question` theo đúng thiết kế tại Mục 2 của Spec.

- [ ] **Bước 2: Chạy migration Prisma và sinh Client**
  Chạy lệnh: `npx prisma db push` (hoặc `npx prisma migrate dev`) và `npx prisma generate`.
  Kỳ vọng: Lệnh chạy thành công, tạo bảng `parts`, `question_groups`, `questions` trong PostgreSQL.

- [ ] **Bước 3: Kiểm tra TypeScript type generation**
  Chạy: `npm run typecheck`
  Kỳ vọng: PASS không có lỗi.

- [ ] **Bước 4: Commit**
  ```bash
  git add prisma/schema.prisma
  git commit -m "feat: thêm schema prisma cho part và câu hỏi"
  ```

---

### Tác vụ 2: Tạo Shared Types & Zod Schemas Thẩm định

**Files:**
- Tạo: `src/shared/types/part.ts`
- Tạo: `src/shared/schemas/part.schema.ts`
- Tạo: `test/part-validation.test.ts`

**Interfaces:**
- Produces:
  - `CreatePartInput`, `PartCompletenessIssue` types trong `src/shared/types/part.ts`
  - `createPartSchema`, `validatePartForPublish` trong `src/shared/schemas/part.schema.ts`

- [ ] **Bước 1: Viết test kiểm tra Zod Schema và Validation logic**
  Tạo `test/part-validation.test.ts` kiểm tra:
  - Dữ liệu hợp lệ cho DRAFT (chấp nhận 1 câu, chưa có đáp án).
  - Thẩm định PUBLISHED (bắt lỗi khi Part 1 thiếu câu < 5 câu, hoặc thiếu đáp án đúng, hoặc Listening thiếu audioUrl).

- [ ] **Bước 2: Chạy test để xác nhận test thất bại**
  Chạy: `npm test` hoặc `npx vitest run test/part-validation.test.ts`
  Kỳ vọng: FAIL (do file schema chưa tồn tại).

- [ ] **Bước 3: Định nghĩa types trong `src/shared/types/part.ts`**
  Khai báo interface DTO cho Part, QuestionGroup, Question, PoolOption, QuestionItemInput.

- [ ] **Bước 4: Triển khai Zod schema trong `src/shared/schemas/part.schema.ts`**
  Viết `createPartSchema` và hàm `validatePartForPublish(input)`.

- [ ] **Bước 5: Chạy lại test**
  Chạy: `npx vitest run test/part-validation.test.ts`
  Kỳ vọng: PASS toàn bộ test case.

- [ ] **Bước 6: Commit**
  ```bash
  git add src/shared/types/part.ts src/shared/schemas/part.schema.ts test/part-validation.test.ts
  git commit -m "feat: thêm shared types và zod schema cho part"
  ```

---

### Tác vụ 3: Xây dựng Backend Service (`part.service.ts`)

**Files:**
- Tạo: `src/backend/services/part.service.ts`
- Tạo: `test/part-service.test.ts`

**Interfaces:**
- Consumes: `db` từ `@/backend/lib/db`, `validatePartForPublish` từ `@/shared/schemas/part.schema`
- Produces:
  - `createPart(input: CreatePartInput, adminId?: string): Promise<Part>`
  - `checkPartCompleteness(input: CreatePartInput): PartCompletenessIssue[]`

- [ ] **Bước 1: Viết test cho `part.service.ts`**
  Tạo `test/part-service.test.ts` mock `db.part.create` để kiểm tra:
  - Khi lưu PUBLISHED nhưng chưa đủ tiêu chuẩn: ném lỗi kèm danh sách issues.
  - Khi lưu hợp lệ: gọi `db.part.create` với đúng nested structure.

- [ ] **Bước 2: Chạy test để xác nhận test thất bại**
  Chạy: `npx vitest run test/part-service.test.ts`
  Kỳ vọng: FAIL (do service chưa tồn tại).

- [ ] **Bước 3: Triển khai `src/backend/services/part.service.ts`**
  Bắt đầu với `import "server-only";`.
  Triển khai các hàm `createPart`, `checkPartCompleteness`.

- [ ] **Bước 4: Chạy lại test**
  Chạy: `npx vitest run test/part-service.test.ts`
  Kỳ vọng: PASS toàn bộ test.

- [ ] **Bước 5: Commit**
  ```bash
  git add src/backend/services/part.service.ts test/part-service.test.ts
  git commit -m "feat: xây dựng backend service quản lý part"
  ```

---

### Tác vụ 4: Triển khai Route Handler `POST /api/admin/parts`

**Files:**
- Tạo: `src/app/api/admin/parts/route.ts`

**Interfaces:**
- Consumes: `getCurrentUser()` từ `@/backend/lib/auth`, `partService` từ `@/backend/services/part.service`, `createPartSchema` từ `@/shared/schemas/part.schema`
- Produces: HTTP API Endpoint `POST /api/admin/parts`

- [ ] **Bước 1: Viết Route Handler trong `src/app/api/admin/parts/route.ts`**
  - Kiểm tra xác thực `getCurrentUser()`. Nếu không phải `ADMIN`, trả về `401` hoặc `403`.
  - Validate body với `createPartSchema.safeParse()`. Nếu không hợp lệ, trả về `400` kèm chi tiết lỗi.
  - Gọi `partService.createPart()`.
  - Trả về `201 Created` với `{ success: true, data: newPart }`.
  - Bắt lỗi ngoại lệ và trả về mã lỗi thích hợp.

- [ ] **Bước 2: Kiểm tra biên dịch Typecheck**
  Chạy: `npm run typecheck`
  Kỳ vọng: PASS.

- [ ] **Bước 3: Commit**
  ```bash
  git add src/app/api/admin/parts/route.ts
  git commit -m "feat: thêm api route tạo part cho admin"
  ```

---

### Tác vụ 5: Tái cấu trúc & Hoàn thiện Form Soạn thảo (`PartEditorForm`)

**Files:**
- Sửa: `src/frontend/components/admin/part-editor-form.tsx`

**Interfaces:**
- Consumes: `EXAM_PARTS` từ `@/shared/constants/exam-parts`, `createPartSchema` từ `@/shared/schemas/part.schema`
- Produces: Component Client hoàn chỉnh với đầy đủ 6 dạng câu hỏi, Stimulus player, Quality checklist, Preview mode và kết nối API.

- [ ] **Bước 1: Bổ sung State quản lý động theo từng Part**
  - Xử lý chuyển đổi `selectedPartNo`: Cập nhật tự động tiêu đề, hướng dẫn chuẩn, số câu yêu cầu, bộ câu hỏi mẫu mặc định theo từng dạng bài.
  - State cho Stimulus: `audioUrl`, `maxPlays`, `transcript`, `passageText`, `poolOptions` (A-H).
  - State cho Writing: `writingRequirements`, `minWords`, `maxWords`, `sampleWriting`.

- [ ] **Bước 2: Triển khai các khối nhập liệu câu hỏi chuyên biệt theo 6 dạng**
  - `match_pool` (Part 1, 11): Bộ nhập kho lựa chọn A-H + câu hỏi chọn chữ cái A-H.
  - `mcq3` (Part 2, 3, 4, 12): 3 lựa chọn A/B/C + chọn đáp án đúng.
  - `mcq3_image` (Part 10): Nhập URL ảnh A/B/C + preview thumbnail ảnh.
  - `cloze_mcq` (Part 5): Đoạn văn khuyết kèm 8 câu hỏi A/B/C.
  - `short_text` (Part 6, 7, 8, 13, 14): Gợi ý chữ đầu, độ dài (Part 6), nhãn form (Part 8, 13, 14), đáp án đúng & accepted answers.
  - `writing` (Part 9): 3 yêu cầu ý chính, đếm từ, rubric bài mẫu.

- [ ] **Bước 3: Tích hợp Trình nghe thử Audio mini & Thumbnail ảnh**
  - Khi Admin nhập `audioUrl`, hiển thị thanh audio player HTML5 để nghe thử trực tiếp.
  - Kiểm tra link ảnh với fallback nếu ảnh lỗi.

- [ ] **Bước 4: Triển khai Cột Thẩm định Chất lượng (Quality Checklist) thời gian thực**
  - Đếm số câu hiện tại / số câu yêu cầu.
  - Cảnh báo câu thiếu đáp án đúng.
  - Cảnh báo thiếu tư liệu bài thi.
  - Ngăn chặn nút "Công khai" nếu chưa đạt và hiển thị hộp thoại/thông báo chi tiết lỗi.

- [ ] **Bước 5: Kết nối API `POST /api/admin/parts`**
  - Hiển thị spinner trạng thái đang lưu.
  - Bắt lỗi từ server và hiển thị toast/thông báo lỗi thân thiện.
  - Khi lưu thành công: hiển thị thông báo thành công và chuyển hướng về `/admin/part-bank` sau 1.5s hoặc cho phép tạo tiếp.

- [ ] **Bước 6: Hoàn thiện Tab "Xem trước" (Live Preview)**
  - Hiển thị giao diện mô phỏng chính xác trải nghiệm của sinh viên khi làm bài luyện.

- [ ] **Bước 7: Kiểm tra TypeScript & Lint**
  Chạy: `npm run typecheck` và `npm run lint`
  Kỳ vọng: PASS không có lỗi.

- [ ] **Bước 8: Commit**
  ```bash
  git add src/frontend/components/admin/part-editor-form.tsx
  git commit -m "feat: hoàn thiện giao diện form tạo part động đa dạng KET"
  ```

---

### Tác vụ 6: Kiểm thử Tích hợp & Kiểm tra Tổng thể (Verification)

**Files:**
- Toàn bộ các file liên quan.

- [ ] **Bước 1: Chạy toàn bộ test suite**
  Chạy: `npm test`
  Kỳ vọng: 100% test pass.

- [ ] **Bước 2: Kiểm tra typecheck và build production**
  Chạy: `npm run typecheck` và `npm run build`
  Kỳ vọng: Build thành công sạch sẽ.

- [ ] **Bước 3: Kiểm tra giao diện Light / Dark Mode & Responsive**
  Kiểm tra độ tương phản, các nút bấm và layout trên màn hình Desktop và Tablet.

- [ ] **Bước 4: Commit hoàn tất**
  ```bash
  git commit --allow-empty -m "chore: hoàn thành kiểm thử tính năng tạo part mới"
  ```
