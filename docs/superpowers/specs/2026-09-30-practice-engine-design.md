# Design Spec: Phân hệ Ôn luyện từng Part & Bộ Renderers Câu hỏi KET A2

| Thông tin | Chi tiết |
|---|---|
| **Tính năng** | Phân hệ Ôn luyện (Practice Hub, Part Details & Practice Room) |
| **Đặc tả nghiệp vụ** | `docs/PRD.md` (PR-01 → PR-13) & `docs/PAGES.md` (mục `/on-luyen` & `/on-luyen/[skill]/[partNo]`) |
| **Phiên bản** | 1.0 (Design Spec theo quy trình Superpowers) |
| **Ngày lập** | 30/09/2026 |
| **Ngôn ngữ giao diện**| 100% Tiếng Việt (nội dung câu hỏi đề thi giữ nguyên tiếng Anh KET gốc) |

---

## 1. Mục tiêu & Phạm vi (Scope & Goals)

Xây dựng toàn bộ hệ thống ôn luyện theo từng kỹ năng và từng part độc lập để sinh viên rèn luyện phương pháp làm bài mà không chịu áp lực thời gian:
1. **Trang danh sách bài luyện của một Part (`/on-luyen/[skill]/[partNo]`):**
   - Hiển thị 3 chỉ số tiến độ: Tổng số bài · Đã làm (x/N) · Tỷ lệ hoàn thành (%).
   - Nút hành động chính: **Luyện tất cả (N đề)** (tự động mở bài đầu tiên chưa làm).
   - Bộ lọc trạng thái: **Tất cả (N) · Chưa làm (n) · Đã làm (n)**.
   - 3 kiểu hiển thị linh hoạt: **Lưới (Grid)**, **Gom nhóm (Grouped theo bộ đề KET 2, KET 3...)**, **Danh sách (List)**.
2. **Màn hình làm bài luyện (`/on-luyen/[skill]/[partNo]/[itemId]`):**
   - Thanh điều khiển gọn: Nút quay lại, tên bài ("Part 1 — Biển báo · KET 5 · Test 3"), trạng thái lưu nháp, bộ đếm "Đã trả lời a/b câu", nút Nộp bài.
   - Hướng dẫn làm bài và **dòng ví dụ (câu 0)** có dấu ✓ mẫu.
   - Không giới hạn thời gian (không có đồng hồ đếm ngược).
   - Sau khi nộp bài: Hiển thị điểm số, từng câu đúng/sai, đáp án đúng, giải thích chi tiết, audio player nghe 2 lần kèm transcript (Listening) và bài mẫu + rubric (Writing).
   - Nút "Làm lại" và "Bài tiếp theo".
3. **Bộ Renderers chuyên biệt cho 6 dạng câu hỏi Cambridge KET chuẩn:**
   - `MatchPoolRenderer`: Ghép câu với kho đáp án A–H (Part 1, Part 11).
   - `MCQ3Renderer`: Trắc nghiệm 3 lựa chọn A/B/C và Right/Wrong/Doesn't say (Part 2, 3, 4, 12).
   - `MCQ3ImageRenderer`: Trắc nghiệm nghe chọn tranh A/B/C (Part 10).
   - `ClozeMCQRenderer`: Điền đoạn văn khuyết 8 chỗ (Part 5).
   - `ShortTextRenderer`: Ô nhập text với chữ cái đầu và số ký tự gợi ý (Part 6, 7, 8, 13, 14).
   - `WritingRenderer`: Viết note ngắn 25–35 từ kèm bộ đếm từ trực tiếp (Part 9).

---

## 2. Kiến trúc & Phân chia Component

```
src/
├─ shared/
│  ├─ types/
│  │  ├─ practice.ts          (Kiểu dữ liệu Part, Question, Attempt, Review)
│  │  └─ question.ts          (Định nghĩa DTO cho từng dạng câu hỏi)
│  └─ constants/
│     └─ mock-practice-data.ts (Dữ liệu mẫu 14 part bám sát KET A2)
├─ backend/
│  ├─ services/
│  │  └─ practice.service.ts  (Lấy danh sách bài luyện, nộp bài, chấm điểm lẻ)
│  └─ lib/
│     └─ scoring.ts           (Logic chấm điểm trắc nghiệm & text)
└─ frontend/
   ├─ components/
   │  └─ practice/
   │     ├─ part-header.tsx            (Tiêu đề part, 3 chỉ số, nút Luyện tất cả)
   │     ├─ view-controls.tsx          (Bộ lọc trạng thái & Bộ chuyển 3 kiểu xem)
   │     ├─ practice-item-card.tsx     (Thẻ bài luyện kèm badge trạng thái & điểm)
   │     ├─ practice-room-header.tsx   (Thanh topbar gọn làm bài: back, autosave, submit)
   │     ├─ practice-result-banner.tsx (Bảng điểm sau khi nộp, giải thích, làm lại)
   │     └─ questions/                 (Bộ Renderers câu hỏi)
   │        ├─ match-pool-renderer.tsx
   │        ├─ mcq3-renderer.tsx
   │        ├─ mcq3-image-renderer.tsx
   │        ├─ cloze-mcq-renderer.tsx
   │        ├─ short-text-renderer.tsx
   │        └─ writing-renderer.tsx
```

---

## 3. Đặc tả chi tiết 6 dạng Renderers Câu hỏi KET

### 3.1 `match_pool` (Part 1 Biển báo & Part 11 Nghe nối lý do)
- **Cấu trúc:** Danh sách câu hỏi bên trái (1–5), kho đáp án dùng chung A–H bên phải (gồm 8 biển báo/lý do, thừa 3 đáp án).
- **Desktop:** Kho đáp án A–H hiển thị cố định bên phải (sticky) để sinh viên vừa đọc câu hỏi vừa tra cứu biển báo không cần cuộn.
- **Mobile:** Kho đáp án A–H thu gọn thành bảng gập dính dưới thanh trên ("Xem 8 biển báo A–H") bấm mở nhanh khi chọn đáp án.

### 3.2 `mcq3` (Part 2 Từ vựng, Part 3 Hội thoại, Part 4 Đọc hiểu, Part 12 Listening)
- Thẻ câu hỏi với 3 lựa chọn trắc nghiệm A/B/C.
- Part 4 sử dụng 3 lựa chọn ngữ nghĩa: `Right` / `Wrong` / `Doesn't say`.
- Vùng bấm của mỗi đáp án bao trùm toàn bộ thẻ (tối thiểu 44px), có highlight màu `primary` khi được chọn.

### 3.3 `mcq3_image` (Part 10 Listening 1)
- 3 ảnh minh họa A/B/C xếp ngang trên desktop/tablet và xếp linh hoạt trên mobile.
- Ảnh đặt trên bề mặt sáng (`--surface`) không bị đảo màu khi bật Dark mode.
- Huy hiệu chữ cái A, B, C nổi bật ở góc ảnh.

### 3.4 `cloze_mcq` (Part 5 Điền đoạn văn)
- Đoạn văn bài đọc hiển thị ở trên (hoặc bên trái trên desktop màn hình lớn).
- Các vị trí khuyết từ được đánh số (28 → 35). Bên dưới là danh sách 8 hàng lựa chọn A/B/C tương ứng.

### 3.5 `short_text` (Part 6 Đoán từ, Part 7 Điền từ thư, Part 8 Điền form, Part 13–14 Nghe điền)
- Ô nhập text `input` gắn liền với số thứ tự câu.
- **Part 6 (Đoán từ):** Hiển thị gợi ý chữ cái đầu và gạch dưới số ký tự, ví dụ: `u _ _ _ _ _ _` (umbrella).
- **Part 8 & Part 13–14 (Biểu mẫu/Phiếu):** Giao diện phiếu thông tin (Form sheet) gồm các nhãn trường rõ ràng (Tên, Giá vé, Thời gian, Địa điểm).

### 3.6 `writing` (Part 9 Viết note ngắn)
- Khung đề bài kèm 3 gạch đầu dòng các ý bắt buộc phải trả lời.
- Ô văn bản tự do (`textarea`) lớn, hỗ trợ bộ đếm từ thời gian thực.
- Cảnh báo trực quan nếu số từ nằm ngoài khoảng quy định 25–35 từ (không chặn nộp bài).
- Sau khi nộp: Hiển thị bài viết mẫu và tiêu chí chấm điểm (rubric).

---

## 4. Đặc tả luồng Nộp bài & Hiển thị Kết quả Ôn luyện

- **Không có đồng hồ:** Sinh viên làm bài thoải mái, tự chủ thời gian.
- **Nộp bài:**
  - Nếu còn câu chưa trả lời: Hiện dialog cảnh báo nhẹ nêu rõ số câu còn trống kèm lựa chọn "Vẫn nộp" hoặc "Làm tiếp".
  - Chấm điểm ngay trên client/server:
    - Đúng: Icon ✓ kèm viền màu `--success`.
    - Sai: Icon ✗ kèm viền màu `--danger`, hiển thị đáp án đúng màu xanh bên dưới.
    - Luôn có hộp **"Giải thích chi tiết"** phân tích lý do tại sao đáp án đó đúng và giải nghĩa từ vựng.
    - Với bài nghe Listening: Hiển thị **Audio Script / Transcript** có đánh dấu vị trí xuất hiện câu trả lời.
- **Hành động sau nộp:**
  - Nút *"Làm lại bài này"* (xóa trắng đáp án để làm lại).
  - Nút *"Luyện bài tiếp theo"* (chuyển sang bài tiếp theo trong hàng đợi).

---

## 5. Chiến lược Kiểm thử (Test Strategy)

1. **Unit Test:**
   - Kiểm tra logic đếm từ cho Part 9 Writing (xử lý khoảng trắng, xuống dòng, ký tự đặc biệt).
   - Kiểm tra logic chấm điểm Part 6 (không phân biệt chữ hoa/thường, tự động loại bỏ khoảng trắng thừa).
   - Kiểm tra logic chấp nhận nhiều đáp án đúng cho Part 7 & Part 8.
2. **Component & Accessibility Test:**
   - Kiểm tra phím Enter/Space chọn đáp án trắc nghiệm.
   - Kiểm tra 3 kiểu hiển thị Lưới / Gom nhóm / Danh sách trên mobile và desktop.
3. **Typecheck & ESLint:**
   - `npm run typecheck` đạt 0 lỗi TypeScript strict.
   - `frontend/` không import từ `backend/`.
