# Thiết kế Kỹ thuật Tính năng "Tạo Part mới" trong Admin Dashboard

- **Dự án:** HUMG English Exit
- **Ngày:** 30/09/2026
- **Trạng thái:** Đã phê duyệt (Approved)
- **Tác giả:** Antigravity & Quản trị viên dự án

---

## 1. Mục tiêu & Phạm vi

### 1.1 Mục tiêu
Cung cấp màn hình và luồng xử lý toàn diện cho Quản trị viên (Admin) để soạn thảo, thẩm định chất lượng nội dung và lưu trữ một Part mới (thuộc 14 dạng đề Cambridge KET A2) vào Kho phần (Part bank) của hệ thống HUMG English Exit.

### 1.2 Phạm vi nghiệp vụ & Quyết định kiến trúc
- **Ngôn ngữ:** Sử dụng hoàn toàn **Tiếng Việt** cho toàn bộ giao diện quản trị, nhãn hướng dẫn, kiểm tra lỗi và dòng trạng thái (theo yêu cầu lược bỏ đa ngôn ngữ). Nội dung câu hỏi và bài đọc giữ nguyên văn bản tiếng Anh theo chuẩn Cambridge KET.
- **Lưu trữ:** Lưu trữ quan hệ thực vào cơ sở dữ liệu PostgreSQL qua Prisma ORM (`Part`, `QuestionGroup`, `Question`).
- **Phân quyền:** Chỉ tài khoản có vai trò `ADMIN` mới được phép gọi API tạo và quản lý Part.
- **Chế độ lưu:**
  - *Lưu nháp (`DRAFT`):* Cho phép lưu bài bất kỳ lúc nào để tiếp tục soạn sau, không bắt buộc đủ số lượng câu hỏi hay đầy đủ đáp án.
  - *Công khai (`PUBLISHED`):* Chỉ cho phép công khai khi nội dung đã vượt qua toàn bộ Checklist thẩm định (đủ số lượng câu chuẩn KET theo từng Part, 100% câu có đáp án đúng, có đầy đủ tư liệu bài đọc hoặc audio).

---

## 2. Mô hình Cơ sở dữ liệu (Prisma Schema)

Cập nhật `prisma/schema.prisma` với các model và enum sau:

```prisma
enum SkillType {
  READING_WRITING
  LISTENING
}

enum PartStatus {
  DRAFT
  PUBLISHED
}

enum QuestionType {
  MATCH_POOL    // Part 1, 11 (Ghép kho A-H)
  MCQ3          // Part 2, 3, 4, 12 (Trắc nghiệm A/B/C hoặc Right/Wrong/Doesn't say)
  MCQ3_IMAGE    // Part 10 (Trắc nghiệm 3 ảnh A/B/C)
  CLOZE_MCQ     // Part 5 (Điền đoạn văn trắc nghiệm A/B/C)
  SHORT_TEXT    // Part 6, 7, 8, 13, 14 (Điền từ, đoán từ, hoàn thành biểu mẫu)
  WRITING       // Part 9 (Viết note 25-35 từ)
}

model Part {
  id             String          @id @default(cuid())
  partNo         Int             @map("part_no") // 1 đến 14
  skill          SkillType
  title          String          // Tiêu đề bài (VD: "Bài luyện tập KET 5 - Test 1")
  sourceLabel    String          @map("source_label") // VD: "KET 5 · Test 1"
  groupSet       String          @map("group_set")    // VD: "KET 5"
  instructions   String          @db.Text             // Hướng dẫn làm bài (Tiếng Việt)
  exampleRow     Json?           @map("example_row")  // { question, correctAnswer, explanation }
  difficulty     String          @default("MEDIUM")   // EASY | MEDIUM | HARD
  status         PartStatus      @default(DRAFT)
  createdAt      DateTime        @default(now()) @map("created_at")
  updatedAt      DateTime        @updatedAt @map("updated_at")

  questionGroups QuestionGroup[]

  @@index([partNo])
  @@index([skill])
  @@index([status])
  @@map("parts")
}

model QuestionGroup {
  id                  String       @id @default(cuid())
  partId              String       @map("part_id")
  part                Part         @relation(fields: [partId], references: [id], onDelete: Cascade)
  type                QuestionType
  order               Int          @default(1)
  passageText         String?      @map("passage_text") @db.Text
  audioUrl            String?      @map("audio_url")
  maxPlays            Int          @default(2) @map("max_plays")
  transcript          String?      @db.Text
  poolOptions         Json?        @map("pool_options")          // [{ letter: "A", text: "..." }]
  writingRequirements Json?        @map("writing_requirements")  // [string, string, string]
  minWords            Int?         @map("min_words")             // Mặc định 25
  maxWords            Int?         @map("max_words")             // Mặc định 35
  sampleWriting       String?      @map("sample_writing") @db.Text
  createdAt           DateTime     @default(now()) @map("created_at")

  questions           Question[]

  @@index([partId])
  @@map("question_groups")
}

model Question {
  id              String        @id @default(cuid())
  groupId         String        @map("group_id")
  group           QuestionGroup @relation(fields: [groupId], references: [id], onDelete: Cascade)
  orderNumber     Int           @map("order_number")
  prompt          String        @db.Text
  options         Json?                              // [{ key: "A", text: "...", imageUrl: "..." }]
  correctAnswer   String        @map("correct_answer")
  acceptedAnswers Json?         @map("accepted_answers") // string[]
  explanation     String?       @db.Text
  firstLetterHint String?       @map("first_letter_hint")
  charCountHint   Int?          @map("char_count_hint")
  formFieldLabel  String?       @map("form_field_label")
  createdAt       DateTime      @default(now()) @map("created_at")

  @@index([groupId])
  @@map("questions")
}
```

---

## 3. Ranh giới Kiến trúc & Shared Schemas

### 3.1 Quy tắc ranh giới
- `@/frontend/` tuyệt đối không import từ `@/backend/`.
- `@/backend/` chỉ chạy trên máy chủ (luôn có `import "server-only"`).
- Dữ liệu trao đổi giữa client và server thông qua kiểu dữ liệu và schema Zod định nghĩa trong `@/shared/`.

### 3.2 Schema Zod (`@/shared/schemas/part.schema.ts`)
- Định nghĩa schema `createPartSchema`:
  - `partNo`: số nguyên từ 1 đến 14.
  - `skill`: `READING_WRITING` hoặc `LISTENING`.
  - `title`: tối thiểu 3 ký tự.
  - `sourceLabel`: không để trống.
  - `groupSet`: không để trống.
  - `instructions`: chuỗi hướng dẫn.
  - `status`: `DRAFT` hoặc `PUBLISHED`.
  - `exampleRow`: `{ question: string, correctAnswer: string, explanation?: string }`.
  - `stimulus`:
    - `passageText`: chuỗi hoặc null.
    - `audioUrl`: URL hợp lệ hoặc null.
    - `maxPlays`: 1, 2 hoặc 3.
    - `transcript`: chuỗi hoặc null.
    - `poolOptions`: danh sách `{ letter: string, text: string }`.
    - `writingRequirements`: mảng 3 chuỗi ý chính.
    - `sampleWriting`: chuỗi bài viết mẫu.
  - `questions`: mảng câu hỏi với `prompt`, `correctAnswer`, `options`, `acceptedAnswers`, `explanation`, `firstLetterHint`, `charCountHint`, `formFieldLabel`.
- Hàm thẩm định `validatePartForPublish(data)`:
  - Kiểm tra xem số lượng câu hỏi có khớp với `EXAM_PARTS[partNo - 1].totalQuestions` không.
  - Kiểm tra 100% câu hỏi đã có `correctAnswer` hợp lệ.
  - Nếu là bài Listening, kiểm tra `audioUrl` không được để trống.
  - Nếu là bài Reading có bài đọc (Part 4, 5, 7, 8), kiểm tra `passageText` không được để trống.
  - Nếu là Part 1 hoặc Part 11, kiểm tra có ít nhất 5 phương án trong `poolOptions` (A-H).

---

## 4. Backend Service & API Routes

### 4.1 Service `@/backend/services/part.service.ts`
- Bắt đầu với `import "server-only"`.
- `createPart(input: CreatePartInput, adminId: string)`:
  - Nếu `status === "PUBLISHED"`, chạy hàm kiểm tra tính đầy đủ (`validatePartForPublish`). Nếu vi phạm, ném lỗi với danh sách các điểm chưa đạt.
  - Thực hiện ghi dữ liệu an toàn vào database thông qua Prisma Nested Writes:
    ```ts
    await db.part.create({
      data: {
        partNo: input.partNo,
        skill: input.skill,
        title: input.title,
        sourceLabel: input.sourceLabel,
        groupSet: input.groupSet,
        instructions: input.instructions,
        exampleRow: input.exampleRow ?? Prisma.JsonNull,
        status: input.status,
        questionGroups: {
          create: [{
            type: input.questionType,
            passageText: input.passageText,
            audioUrl: input.audioUrl,
            maxPlays: input.maxPlays ?? 2,
            transcript: input.transcript,
            poolOptions: input.poolOptions ?? Prisma.JsonNull,
            writingRequirements: input.writingRequirements ?? Prisma.JsonNull,
            sampleWriting: input.sampleWriting,
            questions: {
              create: input.questions.map((q, idx) => ({
                orderNumber: idx + 1,
                prompt: q.prompt,
                options: q.options ?? Prisma.JsonNull,
                correctAnswer: q.correctAnswer,
                acceptedAnswers: q.acceptedAnswers ?? Prisma.JsonNull,
                explanation: q.explanation,
                firstLetterHint: q.firstLetterHint,
                charCountHint: q.charCountHint,
                formFieldLabel: q.formFieldLabel,
              })),
            },
          }],
        },
      },
    });
    ```

### 4.2 API Route `@/app/api/admin/parts/route.ts`
- **POST**:
  1. Kiểm tra xác thực người dùng bằng `getCurrentUser()`. Nếu chưa đăng nhập hoặc `role !== "ADMIN"`, trả về HTTP `401/403`.
  2. Phân tích `request.json()` và kiểm tra qua `createPartSchema.safeParse()`. Nếu lỗi, trả về HTTP `400` kèm chi tiết lỗi validation.
  3. Gọi `partService.createPart()`.
  4. Trả về HTTP `201 Created` kèm `{ success: true, data: newPart }`.
- Xử lý lỗi tập trung, không để lộ thông tin nhạy cảm của hệ thống.

---

## 5. Thiết kế Giao diện Form Soạn thảo (`PartEditorForm`)

### 5.1 Cấu trúc Component
File: `src/frontend/components/admin/part-editor-form.tsx`

1. **Header & Thanh hành động:**
   - Nút quay lại danh sách Part (`/admin/part-bank`).
   - Switch tab: **Chỉnh sửa** (Edit) và **Xem trước** (Live Preview).
   - Nút **Lưu nháp** (`DRAFT`): Gọi API lưu với status DRAFT, hiển thị spinner khi đang gửi.
   - Nút **Công khai** (`PUBLISHED`): Thẩm định toàn bộ checklist, nếu đạt mới gửi với status PUBLISHED.
2. **Khối 1: Thông tin phân loại & Tiêu đề:**
   - Select chọn Part (1 đến 14). Khi đổi Part, tự động thiết lập số lượng câu hỏi mặc định, câu hỏi mẫu phù hợp dạng bài, gợi ý tiêu đề và hướng dẫn chuẩn tiếng Việt.
   - Nhãn nguồn đề (VD: `KET 5 · Test 1`).
   - Nhóm bộ đề (VD: `KET 5`, `Bộ 20 đề`).
   - Hướng dẫn làm bài & Dòng ví dụ câu 0.
3. **Khối 2: Tư liệu bài thi (Stimulus):**
   - Với Listening (Part 10–14): Ô nhập Audio URL + **Trình nghe thử Audio mini** tích hợp trực tiếp + Số lượt nghe tối đa + Textarea Transcript.
   - Với Reading (Part 1–8): Textarea nội dung bài đọc / đoạn văn khuyết.
   - Với dạng nối `match_pool` (Part 1, 11): Giao diện quản lý danh sách biển báo / lý do A–H.
4. **Khối 3: Trình biên soạn câu hỏi linh hoạt theo 6 dạng:**
   - `match_pool` (Part 1, 11): Nhập câu mô tả + chọn 1 chữ cái A–H + giải thích.
   - `mcq3` (Part 2, 3, 4, 12): Nhập câu hỏi + 3 phương án A, B, C (hoặc Right/Wrong/Doesn't say) + click chọn đáp án đúng + giải thích.
   - `mcq3_image` (Part 10): Nhập URL 3 ảnh kèm thumbnail xem trước + chọn đáp án đúng.
   - `cloze_mcq` (Part 5): Điền đoạn văn có đánh dấu vị trí trống, danh sách 8 câu trắc nghiệm A/B/C.
   - `short_text` (Part 6, 7, 8, 13, 14):
     - Part 6: Thêm ô chữ cái đầu gợi ý và số lượng ký tự.
     - Part 8, 13, 14: Thêm ô nhãn trường thông tin biểu mẫu.
     - Nhập đáp án chính và các đáp án chấp nhận phụ (phân cách bằng dấu phẩy).
   - `writing` (Part 9): 3 ô nhập 3 yêu cầu cần có, số từ tối thiểu/tối đa, ô bài viết mẫu & rubric.
5. **Cột phụ (Quality Checklist Sidebar):**
   - Kiểm tra trực tiếp theo thời gian thực:
     - Số câu hiện có so với chuẩn KET.
     - Đã có tư liệu bắt buộc (Audio URL / Bài đọc) chưa.
     - 100% câu hỏi đã có đáp án đúng chưa (chỉ rõ câu nào còn thiếu).
     - Thông báo lỗi/chưa đạt hiển thị rõ ràng khi bấm "Công khai".
6. **Chế độ xem trước (Live Preview Tab):**
   - Tái hiện chính xác giao diện mà sinh viên sẽ nhìn thấy khi làm bài.

---

## 6. Kế hoạch Kiểm thử & Tiêu chuẩn Nghiệm thu

- [ ] Chạy `npm run typecheck` không có lỗi TypeScript (ở chế độ `strict`).
- [ ] Chạy `npm run lint` không có cảnh báo vi phạm.
- [ ] Chạy migration Prisma tạo bảng thành công trong PostgreSQL.
- [ ] Tạo thử nghiệm thành công 1 bài luyện Part 1 (match_pool) và 1 bài luyện Part 10 (Listening audio).
- [ ] Kiểm tra tính năng Lưu nháp (DRAFT) lưu thành công vào cơ sở dữ liệu.
- [ ] Kiểm tra tính năng Công khai (PUBLISHED) chặn lưu khi cố tình để trống đáp án hoặc thiếu câu hỏi, hiển thị đúng cảnh báo.
- [ ] Hoạt động mượt mà ở cả hai theme sáng và tối (Light / Dark mode).
- [ ] Responsive hoạt động tốt trên Desktop và Tablet.
