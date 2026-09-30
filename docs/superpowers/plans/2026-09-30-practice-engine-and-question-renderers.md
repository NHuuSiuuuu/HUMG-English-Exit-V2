# Kế hoạch thực thi: Phân hệ Ôn luyện & Bộ Renderers 6 Dạng câu hỏi KET

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng hoàn chỉnh phân hệ Ôn luyện theo part (`/on-luyen/[skill]/[partNo]`), màn hình làm bài luyện (`/on-luyen/[skill]/[partNo]/[itemId]`) và bộ component Renderers cho toàn bộ 6 dạng câu hỏi Cambridge KET A2.

**Architecture:** Sử dụng kiến trúc module hóa: các Renderers câu hỏi là các Client Components độc lập, có thể tái sử dụng trực tiếp trong cả bài luyện lẻ lẫn bài thi thử 60 phút. Dữ liệu bài luyện được phân tách rõ giữa câu hỏi hiển thị và đáp án giải thích (sau khi nộp).

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript strict, Tailwind CSS, Lucide icons, Node test runner.

**Spec:** `docs/superpowers/specs/2026-09-30-practice-engine-design.md`

## Global Constraints

- Ranh giới: `frontend/` không import `backend/`; `backend/` có `import "server-only"`; `shared/` trung lập.
- Thiết kế: Chỉ dùng token màu trong `docs/DESIGN.md`, font Nunito Sans & Open Sans, bo góc tối đa 8px (`rounded-lg`).
- Ngôn ngữ: 100% Tiếng Việt cho toàn bộ nhãn, trạng thái, hướng dẫn và giải thích; giữ nguyên câu hỏi tiếng Anh gốc của đề Cambridge KET.
- Accessibility: Vùng bấm trắc nghiệm tối thiểu 44px, hỗ trợ điều khiển bằng phím.

## Review Focus

1. **Khả năng hiển thị kho đáp án A–H (Part 1, 11) trên Mobile:** Bảng gập dính dưới thanh trên để không phải cuộn trang liên tục.
2. **Bộ đếm từ thời gian thực (Part 9 Writing):** Xử lý chính xác khoảng trắng, xuống dòng, ký tự đặc biệt; cảnh báo khi ngoài khoảng 25–35 từ.
3. **Chấm điểm ô nhập text (Part 6, 7, 8):** Không phân biệt hoa thường, tự động trim khoảng trắng thừa, hỗ trợ mảng `accepted_answers`.
4. **Bộ nhớ kiểu xem (View Mode):** Lưu lựa chọn Lưới / Gom nhóm / Danh sách vào state/localStorage.
5. **Định dạng câu hỏi Right/Wrong/Doesn't say (Part 4):** Hiển thị rõ ràng 3 lựa chọn ngữ nghĩa.

---

### Task 1: Định nghĩa Kiểu dữ liệu & Dữ liệu mẫu bài luyện 14 Part

**Files:**
- Create: `src/shared/types/practice.ts`
- Create: `src/shared/types/question.ts`
- Create: `src/shared/constants/mock-practice-data.ts`

**Interfaces:**
- Consumes: `EXAM_PARTS` from `src/shared/constants/exam-parts.ts`
- Produces: `PracticePartSummary`, `PracticeItem`, `QuestionDef`, `AnswerSubmission`, `PracticeResult`, `MOCK_PRACTICE_ITEMS`

- [ ] **Step 1: Tạo types cho câu hỏi và bài luyện trong shared/types/**
  Định nghĩa kiểu dữ liệu cho 6 dạng câu hỏi: `match_pool`, `mcq3`, `mcq3_image`, `cloze_mcq`, `short_text`, `writing`.

- [ ] **Step 2: Tạo dữ liệu mẫu mock-practice-data.ts cho 14 Part KET**
  Chứa dữ liệu mẫu tự biên soạn cho đủ 14 Part (biển báo, đoạn văn, đoán từ, hội thoại, audio transcript, rubric bài viết).

- [ ] **Step 3: Commit**
  ```bash
  git add src/shared/types/practice.ts src/shared/types/question.ts src/shared/constants/mock-practice-data.ts
  git commit -m "feat: định nghĩa types và dữ liệu mẫu bài luyện 14 part ket"
  ```

---

### Task 2: Backend Practice Service & TDD Chấm điểm Text / Đếm từ Writing

**Files:**
- Create: `src/backend/lib/text-scoring.ts`
- Create: `test/text-scoring.test.mjs`
- Create: `src/backend/services/practice.service.ts`

**Interfaces:**
- Consumes: `mock-practice-data.ts`
- Produces: `countWords(text: string)`, `scoreShortText()`, `PracticeService.getPartItems()`, `PracticeService.getItemById()`, `PracticeService.gradePracticeItem()`

- [ ] **Step 1: Viết bài test thất bại (Failing Test - Red)**
  Tạo `test/text-scoring.test.mjs` kiểm tra: đếm từ chính xác, bỏ qua khoảng trắng/xuống dòng thừa, chấm điểm text case-insensitive, chấp nhận nhiều đáp án đúng.

- [ ] **Step 2: Chạy test để xác nhận fail**
  Chạy: `node --test test/text-scoring.test.mjs`
  Kỳ vọng: FAIL.

- [ ] **Step 3: Viết mã nguồn thực thi tối thiểu (Green)**
  Viết `src/backend/lib/text-scoring.ts` có `import "server-only"`.

- [ ] **Step 4: Chạy test xác nhận pass**
  Chạy: `node --test test/text-scoring.test.mjs`
  Kỳ vọng: PASS.

- [ ] **Step 5: Viết PracticeService trong src/backend/services/**
  Các hàm lấy danh sách bài, lấy chi tiết bài luyện theo id, chấm điểm và trả về lời giải thích chi tiết.

- [ ] **Step 6: Commit**
  ```bash
  git add src/backend/lib/text-scoring.ts test/text-scoring.test.mjs src/backend/services/practice.service.ts
  git commit -m "feat: thêm practice service và logic chấm điểm text tdd"
  ```

---

### Task 3: Xây dựng Bộ Renderers 6 Dạng câu hỏi KET A2

**Files:**
- Create: `src/frontend/components/practice/questions/match-pool-renderer.tsx`
- Create: `src/frontend/components/practice/questions/mcq3-renderer.tsx`
- Create: `src/frontend/components/practice/questions/mcq3-image-renderer.tsx`
- Create: `src/frontend/components/practice/questions/cloze-mcq-renderer.tsx`
- Create: `src/frontend/components/practice/questions/short-text-renderer.tsx`
- Create: `src/frontend/components/practice/questions/writing-renderer.tsx`
- Create: `src/frontend/components/practice/questions/question-renderer-dispatcher.tsx`

**Interfaces:**
- Consumes: `QuestionDef`, `userAnswers`, `onChange(questionId, value)`, `isSubmitted`, `resultDetails`
- Produces: UI tương tác cho từng dạng câu hỏi, hiển thị đúng/sai, đáp án đúng và giải thích khi `isSubmitted = true`.

- [ ] **Step 1: Tạo MatchPoolRenderer (Part 1, 11)**
  Kho đáp án A–H sticky bên phải trên desktop, bảng gập trên mobile.

- [ ] **Step 2: Tạo MCQ3Renderer (Part 2, 3, 4, 12)**
  Hỗ trợ A/B/C và Right/Wrong/Doesn't say.

- [ ] **Step 3: Tạo MCQ3ImageRenderer (Part 10)**
  3 tranh A/B/C giữ nguyên khung nền sáng trên dark mode.

- [ ] **Step 4: Tạo ClozeMCQRenderer (Part 5)**
  Đoạn văn có vị trí khuyết từ 28-35 và các dòng chọn đáp án bên dưới.

- [ ] **Step 5: Tạo ShortTextRenderer (Part 6, 7, 8, 13, 14)**
  Gợi ý chữ cái đầu `u _ _ _ _ _ _` cho Part 6; phiếu thông tin cho Part 8, 13, 14.

- [ ] **Step 6: Tạo WritingRenderer (Part 9)**
  Textarea lớn có bộ đếm từ thời gian thực, hiển thị rubric và bài mẫu sau khi nộp.

- [ ] **Step 7: Tạo QuestionRendererDispatcher**
  Component trung chuyển tự động chọn renderer phù hợp theo `questionType`.

- [ ] **Step 8: Commit**
  ```bash
  git add src/frontend/components/practice/questions/
  git commit -m "feat: hoàn thiện bộ renderers cho 6 dạng câu hỏi ket a2"
  ```

---

### Task 4: Xây dựng Trang Chi tiết Part (`/on-luyen/[skill]/[partNo]`)

**Files:**
- Create: `src/frontend/components/practice/part-header.tsx`
- Create: `src/frontend/components/practice/view-controls.tsx`
- Create: `src/frontend/components/practice/practice-item-card.tsx`
- Create: `src/app/(public)/on-luyen/[skill]/[partNo]/page.tsx`

**Interfaces:**
- Consumes: `PracticeService.getPartItems()`, `EXAM_PARTS`
- Produces: Giao diện danh mục bài của một Part với 3 chỉ số tiến độ, nút "Luyện tất cả", bộ lọc trạng thái và 3 kiểu xem (Lưới, Gom nhóm, Danh sách).

- [ ] **Step 1: Tạo PartHeader với 3 chỉ số tiến độ và nút Luyện tất cả**
- [ ] **Step 2: Tạo ViewControls với bộ lọc Tất cả/Chưa làm/Đã làm và chuyển đổi 3 kiểu xem**
- [ ] **Step 3: Tạo PracticeItemCard hiển thị nhãn nguồn KET, badge trạng thái và điểm cao nhất**
- [ ] **Step 4: Tạo page.tsx tại /on-luyen/[skill]/[partNo] ghép các components**
- [ ] **Step 5: Commit**
  ```bash
  git add src/frontend/components/practice/ src/app/(public)/on-luyen/[skill]/[partNo]/page.tsx
  git commit -m "feat: xây dựng trang danh mục bài luyện theo part"
  ```

---

### Task 5: Xây dựng Màn hình Làm bài luyện (`/on-luyen/[skill]/[partNo]/[itemId]`)

**Files:**
- Create: `src/frontend/components/practice/practice-room-header.tsx`
- Create: `src/frontend/components/practice/practice-result-banner.tsx`
- Create: `src/frontend/components/practice/audio-player-listening.tsx`
- Create: `src/app/(public)/on-luyen/[skill]/[partNo]/[itemId]/page.tsx`

**Interfaces:**
- Consumes: `PracticeService.getItemById()`, `QuestionRendererDispatcher`, `calculateScore()`
- Produces: Màn hình làm bài hoàn chỉnh, nộp bài, chấm điểm tức thì, xem giải thích chi tiết, audio player nghe 2 lần và transcript.

- [ ] **Step 1: Tạo PracticeRoomHeader với nút Back, tên bài, trạng thái lưu nháp, bộ đếm câu và nút Nộp bài**
- [ ] **Step 2: Tạo AudioPlayerListening cho khối nghe (giới hạn 2 lượt nghe, không tua)**
- [ ] **Step 3: Tạo PracticeResultBanner hiển thị điểm số, nút Làm lại và nút Bài tiếp theo**
- [ ] **Step 4: Tạo page.tsx tại /on-luyen/[skill]/[partNo]/[itemId] tích hợp toàn bộ luồng làm bài và nộp bài**
- [ ] **Step 5: Commit**
  ```bash
  git add src/frontend/components/practice/ src/app/(public)/on-luyen/[skill]/[partNo]/[itemId]/page.tsx
  git commit -m "feat: xây dựng màn hình làm bài luyện và xem giải thích tức thì"
  ```

---

### Task 6: Kiểm tra Toàn diện, Test Suite & Nghiệm thu

**Files:**
- Verify all practice and exam components.

- [ ] **Step 1: Chạy toàn bộ Unit Tests**
  Chạy: `npm test`
  Kỳ vọng: PASS toàn bộ test suites (scoring + text scoring).

- [ ] **Step 2: Chạy TypeScript Strict Typecheck**
  Chạy: `npm run typecheck`
  Kỳ vọng: 0 lỗi.

- [ ] **Step 3: Kiểm tra ranh giới kiến trúc ESLint**
  Đảm bảo `frontend` không import `backend`.

- [ ] **Step 4: Xác minh trải nghiệm trên Dev Server**
  Kiểm tra tương tác tại `http://localhost:3001/on-luyen/reading_writing/1` và làm bài tại `http://localhost:3001/on-luyen/reading_writing/1/bai-1`.

- [ ] **Step 5: Commit**
  ```bash
  git add .
  git commit -m "chore: nghiệm thu toàn bộ phân hệ ôn luyện kêt quả hoàn chỉnh"
  ```
