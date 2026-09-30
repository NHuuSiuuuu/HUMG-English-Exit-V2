# HUMG English Exit — Design System (Phiên bản Hiện đại - Phong cách TADR OU)

Sản phẩm phục vụ sinh viên HUMG ôn luyện chuẩn đầu ra tiếng Anh với phong cách giao diện hiện đại, sáng sủa, sạch sẽ, lấy cảm hứng từ nền tảng luyện thi chất lượng cao (tham khảo `tadr.oucommunity.dev`).

## 1. Triết lý thiết kế (Design Philosophy)

- **Sạch sẽ & Thoáng đãng (Clean & Airy):** Tuyệt đối **không lạm dụng các đường viền dày và tối** (`border-gray-300`, `border-slate-400`). Thay vào đó, phân tách các khối bằng sự tương phản nền mềm mại và đổ bóng nhiều tầng siêu nhẹ (`soft elevation shadow`).
- **Nền Grid Tinh Tế (Subtle Grid Pattern):** Sử dụng họa tiết lưới ô vuông siêu nhạt trên nền sáng (`#F8FAFC` hoặc `#FFFFFF`) tạo cảm giác hiện đại, đậm chất EdTech công nghệ cao.
- **Bo góc mềm mại (Generous Border Radius):** Thẻ (Card) dùng `rounded-2xl` (16px) hoặc `rounded-3xl` (24px). Các nút bấm và ô lựa chọn đáp án dùng `rounded-xl` (12px) hoặc `rounded-full` (capsule pill).
- **Màu sắc tươi sáng & Năng động:** Tông màu chủ đạo là Xanh dương / Cyan rực rỡ (`#0095F6`, `#0284C7`), kết hợp các màu pastel tinh tế (Xanh lá `#10B981`, Tím `#8B5CF6`, Vàng cam `#F59E0B`).

---

## 2. Bảng mã màu & Token CSS

| Token | Sáng (Light) | Tối (Dark) | Công dụng |
|---|---|---|---|
| `--background` | `#F8FAFC` (kèm subtle grid) | `#0B1120` | Nền tổng thể toàn trang |
| `--surface` | `#FFFFFF` | `#151E2E` | Bề mặt thẻ Card chính, khung làm bài |
| `--surface-raised` | `#F1F5F9` | `#1E293B` | Nền phụ, ô input, thanh điều hướng phụ |
| `--foreground` | `#0F172A` | `#F8FAFC` | Chữ tiêu đề chính (Slate-900) |
| `--muted` | `#64748B` | `#94A3B8` | Chữ phụ, mô tả, hướng dẫn (Slate-500) |
| `--primary` | `#0095F6` / `#0284C7` | `#38BDF8` | Hành động chính, nút làm bài, viền khi chọn |
| `--primary-foreground`| `#FFFFFF` | `#0F172A` | Chữ trên nút hành động chính |
| `--secondary` | `#10B981` | `#34D399` | Xanh lá tươi (Bắt đầu làm bài, đúng) |
| `--border-subtle` | `rgba(226, 232, 240, 0.8)` | `rgba(51, 65, 85, 0.6)` | Viền siêu mảnh, nhẹ nhàng, không gây rối mắt |
| `--card-shadow` | `0 4px 20px -2px rgba(0,0,0,0.04)` | `0 4px 20px -2px rgba(0,0,0,0.3)` | Đổ bóng đa tầng êm ái cho thẻ |

---

## 3. Quy chuẩn Thành phần Giao diện (Components)

### A. Thẻ lựa chọn câu hỏi (MCQ Options & Questions)
- **Khi chưa chọn:** Nền trắng tinh (`bg-white dark:bg-slate-900`), viền siêu nhẹ 1px (`border border-slate-200/80 dark:border-slate-800`), bo góc `rounded-xl`. Tuyệt đối không dùng viền đậm!
- **Khi hover:** Viền chuyển sang xanh nhạt (`border-sky-300`), nền sáng nhẹ (`bg-sky-50/20`).
- **Khi ĐÃ CHỌN:** Viền dày 2px màu xanh rực rỡ (`border-2 border-[#0095F6]`), chữ màu xanh (`text-[#0095F6] font-semibold`), nền trắng hoặc `bg-sky-50/40 dark:bg-sky-950/30`. Tạo cảm giác sạch sẽ, cao cấp.
- **Khi chấm điểm:** Viền xanh lá 2px cho đáp án đúng (`border-2 border-emerald-500`), viền đỏ cho đáp án sai.

### B. Màn hình làm bài (Practice Room)
- Khung bài làm đặt trong Card lớn màu trắng bo góc `rounded-2xl` hoặc `rounded-3xl`, shadow mềm mại nổi trên nền lưới grid.
- **Đồng hồ đếm giờ:** Dạng viên con nhộng (pill capsule) `rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-1.5 font-mono`.
- **Audio Player (Listening):** Thanh bo góc lớn `rounded-2xl` với nền tím sang trọng (`bg-[#3b1257]` hoặc gradient), nút Play tròn trắng nổi bật.
- **Nút bấm:** Bo góc `rounded-xl`, chiều cao tối thiểu 44px, không hiệu ứng giật gân, phản hồi hover mượt mà.

### C. Typography
- **Nunito Sans:** Tiêu đề, số thứ tự, nút bấm, nhãn điều khiển.
- **Open Sans:** Nội dung đề, bài đọc, câu hỏi và đáp án để dễ đọc lâu dài.
