# PRD — Website ôn luyện & thi thử Chuẩn đầu ra Tiếng Anh HUMG

| | |
|---|---|
| **Tên tạm** | HUMG English Exit (đặt tên chính thức sau) |
| **Phiên bản** | 0.3 (thêm landing page, song ngữ, theme, chi tiết trang ôn luyện) |
| **Ngày** | 29/09/2026 |
| **Nền tảng** | Web responsive: desktop, tablet, mobile |
| **Trạng thái** | Còn vài câu hỏi mở ở phần 13, chưa chặn việc bắt đầu code |

---

## 1. Tổng quan

### 1.1 Vấn đề
Sinh viên Trường Đại học Mỏ - Địa chất (HUMG) phải đạt chuẩn đầu ra ngoại ngữ để tốt nghiệp. Tài liệu ôn tập hiện nằm rải rác (Studocu, nhóm chat, fanpage), không có nơi luyện tập có chấm điểm, không mô phỏng được áp lực thi thật, và việc tra cứu kết quả/lịch thi phải vào một hệ thống riêng của Trung tâm Ngoại ngữ - Tin học (CFI).

### 1.2 Mục tiêu
1. Cho sinh viên một nơi **ôn luyện theo từng kỹ năng** (Reading, Writing, Listening) và có phản hồi ngay.
2. Cho phép **thi thử mô phỏng đề thật** với đủ các phần và đồng hồ đếm ngược **60 phút**.
3. Gom **bài viết hướng dẫn, mẹo, ngữ pháp** vào một chỗ.
4. Tích hợp **tra cứu kết quả thi và lịch thi** từ hệ thống CFI-HUMG ngay trong website.
5. Cho **admin** quản lý đề, tài liệu, đáp án và người dùng mà không cần sửa code.
6. Giao diện **song ngữ Việt - Anh** và **sáng/tối** dành cho sinh viên HUMG.

### 1.3 Đối tượng
- **Sinh viên HUMG** cần thi chuẩn đầu ra ngoại ngữ (người dùng chính).
- **Admin/giảng viên/người quản trị nội dung** (số lượng ít).

### 1.4 Thước đo thành công (sau 1 học kỳ vận hành)
- Có ít nhất 5 đề thi thử hoàn chỉnh và 100 bài luyện theo kỹ năng.
- Tỷ lệ người dùng đăng ký làm ít nhất 1 bài thi thử: đặt mục tiêu ban đầu 50%. *(Số này là giả định, điều chỉnh khi có dữ liệu thực.)*
- Trang tra cứu trả kết quả thành công trên 95% lượt tra cứu hợp lệ.
- Không có sự cố mất bài làm giữa chừng do lỗi hệ thống.

### 1.5 Ngoài phạm vi (bản đầu)
- Ôn luyện **Tin học** (chỉ tập trung tiếng Anh).
- Thanh toán, gói trả phí.
- Ứng dụng native iOS/Android (chỉ là web responsive, có thể cài như PWA sau).
- Đăng ký thi chính thức (việc này vẫn thực hiện ở hệ thống của nhà trường/CFI).
- Chấm Writing bằng giáo viên thật.

---

## 2. Vai trò & quyền

| Vai trò | Quyền chính |
|---|---|
| **Khách (chưa đăng nhập)** | Xem trang chủ, đọc bài viết công khai, dùng trang tra cứu điểm/lịch thi. Làm thử một số ít bài luyện mẫu (không lưu kết quả). |
| **Người dùng (sinh viên)** | Toàn bộ chức năng luyện tập, thi thử, lưu lịch sử, xem tiến độ, bình luận (nếu bật). |
| **Admin** | Quản lý đề, câu hỏi, đáp án, tài liệu, bài viết, người dùng, xem thống kê. |

Có thể tách thêm vai trò **Biên tập viên** (chỉ quản lý nội dung, không quản lý người dùng) ở phiên bản sau.

---

## 3. Cấu trúc đề thi

### 3.1 Nguồn xác định
Cấu trúc dưới đây lấy từ **trang thi thử mẫu** bạn cung cấp (ảnh chụp `humgenglish.site/thi-thu`) và mô tả dạng bài bạn gửi. Tài liệu Studocu (bộ 20 đề) cũng chia đề thành hai khối: Reading & Writing và Listening. Nhãn trên từng phần (KET 5, KET 2, KET 6...) cho thấy dạng đề bám theo định dạng **Cambridge KET (A2 Key)**.

### 3.2 Thời gian
- Đồng hồ đếm ngược hiển thị cố định trên đầu trang làm bài.
- **Mặc định 60 phút**, admin **đổi được trong phần cài đặt** (theo từng đề, có thể có mặc định toàn hệ thống).
- Toàn bộ 14 phần dùng chung một đồng hồ. Nếu sau này cần giờ riêng cho Listening, hệ thống đã hỗ trợ `time_limit_minutes` theo phần (bỏ trống = dùng chung).

### 3.3 Một đề thi gồm 14 phần

**Khối Reading & Writing (phần 1–9)**

| Phần | Tên | Dạng câu hỏi | Nhập liệu | Số câu (theo bản mẫu) |
|---|---|---|---|---|
| 1 | Biển báo | Ghép 5 câu mô tả với 8 biển báo/thông báo (A–H), thừa 3 biển | Chọn 1 trong 8 | 1–5 |
| 2 | Từ vựng | Chọn từ đúng A/B/C để điền vào chỗ trống trong đoạn ngắn | Chọn 1 trong 3 | 6–10 |
| 3 | Hội thoại | Chọn câu đáp lại phù hợp A/B/C | Chọn 1 trong 3 | 11–15 |
| 4 | Đọc hiểu | Bài đọc kèm hình; chọn Right / Wrong / Doesn't say | Chọn 1 trong 3 | 21–27 |
| 5 | Điền đoạn | Đoạn văn khuyết 8 chỗ, chọn từ A/B/C cho mỗi chỗ | Chọn 1 trong 3 | 28–35 |
| 6 | Đoán từ | Đọc định nghĩa, gõ từ đầy đủ, cho sẵn chữ cái đầu và số ký tự | **Ô nhập text** | 36–40 |
| 7 | Điền từ | Thư/email khuyết 10 chỗ, viết đúng 1 từ mỗi chỗ | **Ô nhập text** | 41–50 |
| 8 | Điền form | Đọc thư, điền phiếu đặt sách (tên sách, tác giả, thời gian...) | **Ô nhập text** | 51–55 |
| 9 | Viết note | Viết một note trả lời bạn qua thư, nêu đủ 3 ý, yêu cầu 25–35 từ | **Ô văn bản tự do** + đếm từ | 1 bài viết |

**Khối Listening (phần 10–14)**

| Phần | Tên | Dạng câu hỏi | Nhập liệu | Số câu |
|---|---|---|---|---|
| 10 | Listening 1 | 5 đoạn hội thoại ngắn, mỗi đoạn nghe 2 lần; chọn tranh A/B/C | Chọn 1 trong 3 **ảnh** | 1–5 |
| 11 | Listening 2 | Ghép món đồ với lý do (A–H) | Chọn 1 trong 8 | 6–10 |
| 12 | Listening 3 | Trắc nghiệm A/B/C theo hội thoại | Chọn 1 trong 3 | 11–15 |
| 13 | Listening 4 | Điền thông tin vào tờ (địa chỉ, giá, giờ...) | **Ô nhập text** | 16–20 |
| 14 | Listening 5 | Điền thông tin vào tờ (tên rạp, giá vé, bãi đỗ xe...) | **Ô nhập text** | 21–25 |

Tổng theo bản mẫu: 50 câu Reading + 1 bài Writing, 25 câu Listening. **Lưu ý:** phần Reading & Writing trong bản mẫu đánh số nhảy từ câu 15 sang 21 (thiếu 16–20). Cần xác nhận đây là lỗi đánh số của bản mẫu hay đề thật thiếu một phần (xem mục 13).

**Chủ đề tranh trong Listening 1:** họa tiết/hoa văn, mức giá, các loại bàn, giờ trên mặt đồng hồ, thời tiết (nắng/nhiều mây/mưa). Vì vậy **đáp án có thể là hình ảnh**, không chỉ chữ.

### 3.4 Nguyên tắc thiết kế rút ra từ bản mẫu
1. **Kho phần (Part bank):** mỗi phần là một đơn vị độc lập, có nhãn nguồn riêng (ví dụ "KET 5 · Test 3"). Một đề thi thử được **ghép từ 14 phần**, có thể lấy từ các nguồn khác nhau. Trang ôn luyện chính là **làm từng phần lẻ** trong cùng kho đó, nên chỉ cần nhập nội dung một lần.
2. **Dòng ví dụ (câu 0)** ở đầu mỗi phần, hiện sẵn đáp án mẫu kèm dấu ✓.
3. Giao diện làm bài: **một trang cuộn dài**, mỗi phần có thanh tiêu đề (Phần x/14, tên phần, nhãn nguồn), hướng dẫn, và bộ đếm "Đã trả lời a/b câu".
4. Desktop chia hai cột cho Phần 1 (câu hỏi bên trái, danh sách biển báo A–H bên phải); mobile xếp dọc.
5. Ảnh và đoạn văn có thể là **ảnh chụp trang đề** (bản mẫu dùng ảnh cho Phần 4, 5, 8 và Listening), hỗ trợ cả nhập dạng văn bản sau này.
6. Audio gắn với từng nhóm câu, có **số lần nghe cấu hình** (Listening 1 nghe 2 lần).

**Các dạng câu hỏi hệ thống cần hỗ trợ:**
- `match_pool`: ghép câu với kho đáp án dùng chung (A–H, có đáp án thừa), Phần 1 và Listening 2
- `mcq3`: trắc nghiệm 3 lựa chọn chữ, kể cả Right/Wrong/Doesn't say
- `mcq3_image`: trắc nghiệm 3 lựa chọn là ảnh
- `cloze_mcq`: điền khuyết trong đoạn, mỗi chỗ có 3 lựa chọn
- `short_text`: nhập một từ/cụm ngắn (Phần 6, 7, 8, Listening 4, 5), có **danh sách đáp án chấp nhận** và tùy chọn không phân biệt hoa thường
- `writing`: văn bản tự do, có giới hạn số từ tối thiểu/tối đa

---

## 4. Yêu cầu chức năng

Ký hiệu ưu tiên: **M** = Must (bắt buộc bản đầu), **S** = Should, **C** = Could (để sau).

### 4.1 Giao diện chung: song ngữ Việt - Anh và sáng/tối

Website dành cho sinh viên HUMG, nên **mặc định tiếng Việt** và có bản tiếng Anh.

| Mã | Yêu cầu | Ưu tiên |
|---|---|---|
| UI-01 | Nút **đổi ngôn ngữ VI / EN** trên thanh điều hướng, có ở mọi trang (kể cả đăng nhập/đăng ký) | M |
| UI-02 | Toàn bộ chữ trong giao diện (menu, nút, thông báo lỗi, email hệ thống, trang chủ) có đủ hai ngôn ngữ, lưu trong file dịch tập trung, không hard-code trong component | M |
| UI-03 | Nội dung đề thi giữ nguyên tiếng Anh; hướng dẫn của từng part và phần giải thích có bản `vi` và `en`, thiếu `en` thì hiện `vi` | M |
| UI-04 | Bài viết: tùy chọn có bản dịch theo từng ngôn ngữ; không có bản dịch thì hiện bản gốc kèm ghi chú | S |
| UI-05 | Nút **đổi giao diện sáng / tối**, có tùy chọn theo hệ thống; mặc định theo hệ thống | M |
| UI-06 | Ngôn ngữ và theme **được nhớ** (cookie/localStorage cho khách; lưu vào hồ sơ khi đã đăng nhập) | M |
| UI-07 | Không bị nháy sai theme khi tải trang (thiết lập theme trước khi hiển thị nội dung) | M |
| UI-08 | Màu định nghĩa bằng token cho cả hai theme, đạt tương phản WCAG AA ở cả sáng và tối | M |
| UI-09 | Ảnh trang đề (ảnh chụp, nền trắng) ở chế độ tối được đặt trong khung nền sáng để đọc rõ, không đảo màu ảnh | M |
| UI-10 | Ngày giờ và số hiển thị theo ngôn ngữ đang chọn | S |
| UI-11 | Giao diện admin chỉ cần tiếng Việt ở bản đầu (nhưng vẫn hỗ trợ sáng/tối) | S |
| UI-12 | Nút "Góp ý" như bản mẫu để người dùng gửi phản hồi | C |

**Chiến lược URL:** bản đầu dùng **một bộ đường dẫn chung**, ngôn ngữ chọn bằng cookie, chưa có tiền tố `/vi`, `/en`. Nếu cần SEO theo ngôn ngữ cho landing page thì bổ sung sau (xem mục 13).

---

### 4.2 Trang chủ (Landing page) `/`

Mục tiêu: giải thích website làm gì trong vài giây và đưa người dùng vào hành động (ôn luyện, thi thử, tra cứu). Nội dung dưới đây là **đề xuất khởi đầu**, chốt lại khi làm `DESIGN.md`.

| Mã | Khối | Nội dung | Ưu tiên |
|---|---|---|---|
| LD-01 | **Hero** | Tiêu đề và mô tả ngắn về ôn thi chuẩn đầu ra tiếng Anh HUMG; nút chính "Bắt đầu ôn luyện", nút phụ "Thi thử" và "Tra cứu điểm" | M |
| LD-02 | **Ba chức năng chính** | Thẻ Ôn luyện từng phần · Thi thử mô phỏng · Tra cứu điểm, mỗi thẻ có mô tả một dòng và đường dẫn | M |
| LD-03 | **Cấu trúc đề thi** | Hai khối Reading & Writing (9 part) và Listening (5 part), tổng thời gian làm bài, các dạng câu hỏi | M |
| LD-04 | **Số liệu động** | Tổng số bài luyện, số đề thi thử (lấy từ dữ liệu, không nhập tay) | S |
| LD-05 | **Cách hoạt động** | 3 bước: đăng ký → luyện từng part → thi thử và xem tiến bộ | S |
| LD-06 | **Bài viết mới nhất** | 3 bài mới nhất từ trang bài viết | S |
| LD-07 | **Câu hỏi thường gặp (FAQ)** | Ví dụ: cần đăng ký không, chấm Writing thế nào, dữ liệu tra cứu lấy từ đâu | S |
| LD-08 | **Footer** | Liên kết trang, liên kết tới hệ thống tra cứu chính thức của CFI, thông tin liên hệ, nút Góp ý | M |
| LD-09 | **Khi đã đăng nhập** | Hero đổi thành "Tiếp tục bài đang làm", hiện tiến độ tổng quan và gợi ý part nên luyện tiếp | C |
| LD-10 | Responsive đủ desktop, tablet, mobile; tải nhanh (ảnh tối ưu, chèn lười) | M |
| LD-11 | SEO cơ bản: title, meta description, Open Graph, dữ liệu có cấu trúc | S |

---

### 4.3 Tài khoản người dùng

| Mã | Yêu cầu | Ưu tiên |
|---|---|---|
| AU-01 | Đăng ký bằng email + mật khẩu (họ tên, mã sinh viên tùy chọn, khóa/ngành tùy chọn) | M |
| AU-02 | Đăng nhập, đăng xuất, giữ phiên đăng nhập | M |
| AU-03 | Quên mật khẩu qua email (link đặt lại có thời hạn) | M |
| AU-04 | Xác minh email | S |
| AU-05 | Đăng nhập bằng Google | C |
| AU-06 | Trang hồ sơ: sửa thông tin, đổi mật khẩu, chọn ngôn ngữ và theme, xóa tài khoản | M |
| AU-07 | Chống spam đăng ký (rate limit, captcha khi cần) | S |

**Quy tắc:** mật khẩu tối thiểu 8 ký tự, lưu dạng băm (argon2/bcrypt), không bao giờ lưu mật khẩu thô.

### 4.4 Trang ôn luyện (Practice)

Ôn luyện theo **từng phần (part)**, không phải làm cả đề. Mỗi part là một mục trong kho phần (mục 3.4); mỗi "bài" trong part là một đề nhỏ của part đó.

#### 4.4.1 Trang chọn part `/on-luyen`
Tiêu đề: "Ôn luyện từng phần — Chọn một dạng bài để luyện". Chia hai nhóm:

**Reading & Writing (9 part)**

| Part | Tên | Mô tả trên thẻ | Số bài (bản mẫu) |
|---|---|---|---|
| 1 | Biển báo | Nối câu với biển báo / thông báo (A–H) | 20 |
| 2 | Từ vựng | Chọn từ đúng điền vào câu (A/B/C) | 19 |
| 3 | Hội thoại | Chọn câu đáp lại phù hợp (A/B/C) | 21 |
| 4 | Đọc hiểu | Đoạn dài → Right / Wrong / Doesn't say | 20 |
| 5 | Điền đoạn | Điền từ vào đoạn văn (trắc nghiệm A/B/C) | 20 |
| 6 | Đoán từ | Đọc định nghĩa, viết từ (cho sẵn chữ đầu) | 23 |
| 7 | Điền từ | Điền 1 từ vào chỗ trống trong văn bản | 20 |
| 8 | Điền form | Đọc 2 văn bản, hoàn thành biểu mẫu | 20 |
| 9 | Viết note | Viết mẩu tin nhắn 25–35 từ | *(chưa có số liệu)* |

**Listening (5 part)**

| Part | Tên | Mô tả trên thẻ | Số bài |
|---|---|---|---|
| Listening 1 | Nghe hội thoại ngắn | Chọn tranh (A/B/C) | 12 đề |
| Listening 2 | Nghe, ghép A–H | Ghép món đồ với lý do *(mô tả tạm)* | *(cần bổ sung)* |
| Listening 3 | Nghe, trắc nghiệm | Chọn A/B/C theo hội thoại *(mô tả tạm)* | *(cần bổ sung)* |
| Listening 4 | Nghe, điền form | Điền thông tin vào tờ *(mô tả tạm)* | *(cần bổ sung)* |
| Listening 5 | Nghe, điền form | Điền thông tin vào tờ *(mô tả tạm)* | *(cần bổ sung)* |

Số bài trên mỗi thẻ được **đếm tự động từ dữ liệu**, không nhập tay. Các con số ở bảng chỉ là số liệu của bản mẫu.

#### 4.4.2 Trang chi tiết một part `/on-luyen/[skill]/[partNo]`
Ví dụ "Part 1 — Biển báo": tiêu đề, mô tả một dòng, nút **Luyện tất cả (20 đề)**, và các khối sau:

- **Ba chỉ số:** Tổng số bài (20 đề) · Đã hoàn thành (0 / 20 đề, 0%) · Tiến độ chung (0%).
- **Bộ lọc:** Tất cả (20) · Chưa làm (20) · Đã làm (0), kèm số đếm động.
- **Ba kiểu xem:** Lưới · Gom nhóm · Danh sách.
- **Thẻ bài:** nhãn nguồn (ví dụ "KET 2 · Test 1" hoặc "Đề 1" với Listening), trạng thái (Chưa làm / Đã làm), tên part ("Part 1 — Biển báo & thông báo").
- **Gom nhóm:** với Reading & Writing, gom theo bộ đề (KET 2, KET 3, KET 4, KET 5, KET 6, mỗi bộ có Test 1–4); với Listening, gom theo khoảng đề hoặc không gom nếu ít bài.

| Mã | Yêu cầu | Ưu tiên |
|---|---|---|
| PR-01 | Trang `/on-luyen` chia hai nhóm Reading & Writing (9 part) và Listening (5 part), mỗi part một thẻ (số part, tên, mô tả, số bài) | M |
| PR-02 | Trang part hiển thị tổng bài, đã hoàn thành (số và %), tiến độ chung (%) | M |
| PR-03 | Bộ lọc Tất cả / Chưa làm / Đã làm có số đếm | M |
| PR-04 | Ba kiểu xem Lưới / Gom nhóm / Danh sách; nhớ kiểu người dùng chọn lần trước | M |
| PR-05 | Thẻ bài hiện nhãn nguồn, trạng thái, tên part; bấm vào để làm bài; bài đã làm hiện điểm lần tốt nhất | M |
| PR-06 | Nút **Luyện tất cả**: làm lần lượt các bài (ưu tiên bài chưa làm), sang bài tiếp theo sau khi nộp, thoát ra và tiếp tục sau được | M |
| PR-07 | Làm bài luyện: không giới hạn thời gian, có dòng ví dụ (câu 0), nộp bài để chấm | M |
| PR-08 | Reading/Listening **chấm tự động**, hiện đáp án đúng và giải thích; câu nhập text so với danh sách đáp án chấp nhận | M |
| PR-09 | Listening: trình phát audio, chế độ luyện cho nghe lại và tua; hiện transcript sau khi nộp | M |
| PR-10 | Part 9 Viết note: editor có đếm từ (25–35), sau khi nộp xem bài mẫu và rubric để tự đối chiếu | M |
| PR-11 | "Đã hoàn thành" = đã nộp ít nhất một lần. Lưu lịch sử các lần làm và điểm tốt nhất, **chỉ khi đã đăng nhập** | M |
| PR-12 | Lưu nháp tự động khi đang làm dở | S |
| PR-13 | Khách chưa đăng nhập: xem được danh sách part và bài, làm thử một số bài mở, không lưu tiến độ | S |
| PR-14 | Biểu đồ tiến bộ theo part và theo thời gian ở trang tài khoản | S |
| PR-15 | Đánh dấu bài/câu để xem lại, sổ từ vựng cá nhân | C |
| PR-16 | Gợi ý chấm Writing bằng AI (chỉ tham khảo, ghi rõ không phải điểm chính thức) | C |

---

### 4.5 Trang thi thử mô phỏng (Mock Exam)

| Mã | Yêu cầu | Ưu tiên |
|---|---|---|
| MK-01 | Danh sách đề thi thử, mỗi đề đủ **14 phần** Reading, Writing, Listening theo mục 3.3 | M |
| MK-02 | Màn hình hướng dẫn trước khi thi (cấu trúc, thời gian, quy định), nút Bắt đầu | M |
| MK-03 | **Đồng hồ đếm ngược, mặc định 60 phút, admin đổi được trong cài đặt** (theo từng đề); luôn hiển thị, đổi màu khi còn ít thời gian | M |
| MK-04 | Thời gian **tính theo giờ server** (lưu `started_at`, `deadline_at`), không tin đồng hồ trình duyệt; tải lại trang vẫn đúng thời gian còn lại | M |
| MK-05 | Hết giờ tự động nộp bài, giữ lại các câu đã trả lời | M |
| MK-06 | Tự động lưu đáp án liên tục (mỗi khi chọn/đổi câu), mất mạng thì lưu tạm và đồng bộ lại khi có mạng | M |
| MK-07 | Bố cục một trang cuộn dài, mỗi phần có tiêu đề "Phần x/14", dòng ví dụ (câu 0), bộ đếm "Đã trả lời a/b"; có thanh điều hướng nhảy giữa các phần và câu (đã làm / chưa làm / đánh dấu xem lại) | M |
| MK-08 | Listening: audio phát theo cấu hình của đề (số lần nghe, không cho tua nếu mô phỏng thi thật) | M |
| MK-09 | Xác nhận trước khi nộp sớm; không cho làm lại bài đã nộp trong cùng lượt | M |
| MK-10 | Trang kết quả: điểm từng kỹ năng, tổng điểm, đúng/sai từng câu, đáp án + giải thích, bài mẫu Writing | M |
| MK-11 | Lưu lịch sử các lần thi thử, so sánh giữa các lần | S |
| MK-12 | Chế độ toàn màn hình, cảnh báo khi rời tab (chỉ cảnh báo/ghi log, không khóa) | C |
| MK-13 | Xếp hạng/bảng điểm cao (bật/tắt bởi admin) | C |
| MK-14 | Ô nhập text kiểm tra số từ/ký tự theo gợi ý (ví dụ "u _ _ _ _ _ _", 7 ký tự), đếm từ cho Writing (25–35 từ) | M |

**Ghi chú thiết kế:** Writing không thể chấm tự động chính xác. Bản đầu, điểm Writing hiển thị là **"tự đánh giá theo rubric"** hoặc tách riêng, không cộng lẫn với điểm chấm tự động nếu chưa chốt cách tính (xem mục 13).

### 4.6 Trang bài viết (Articles)

| Mã | Yêu cầu | Ưu tiên |
|---|---|---|
| AR-01 | Danh sách bài viết, phân trang, tìm kiếm, lọc theo danh mục/thẻ | M |
| AR-02 | Trang chi tiết bài viết (tiêu đề, ảnh bìa, nội dung định dạng, ngày đăng, tác giả) | M |
| AR-03 | Danh mục gợi ý: Mẹo làm bài, Ngữ pháp, Từ vựng, Thông báo chuẩn đầu ra, Kinh nghiệm thi | S |
| AR-04 | Bài viết liên quan, chia sẻ, lượt xem | S |
| AR-05 | SEO: meta tag, URL thân thiện, sitemap | S |
| AR-06 | Bình luận (cần đăng nhập, admin duyệt/xóa) | C |

### 4.7 Trang tra cứu điểm & lịch thi (dùng trực tiếp giao diện CFI-HUMG)

**Quyết định:** không tích hợp API. Trang tra cứu dùng **đúng giao diện của hệ thống chính thức** `kqt.cfi.humg.edu.vn`, không tự dựng form riêng và không lấy dữ liệu về máy chủ của mình.

Hệ thống nguồn có hai chức năng **Tra cứu Kết quả thi** và **Tra cứu Lịch thi**, gồm các loại kỳ thi: Chuẩn đầu ra CNTT, Chuẩn đầu ra Ngoại ngữ, Chứng chỉ ƯD CNTT CB, Kiểm tra trình độ NN, Tiếng Anh Tăng cường.

| Mã | Yêu cầu | Ưu tiên |
|---|---|---|
| LK-01 | Trang `/tra-cuu` nằm trong thanh điều hướng chính, có mô tả ngắn cách dùng | M |
| LK-02 | Nhúng trang chính thức bằng **iframe** toàn chiều rộng nếu hệ thống CFI cho phép nhúng | M |
| LK-03 | **Phương án dự phòng:** luôn có nút "Mở trang tra cứu chính thức" mở tab mới; tự động hiện nút này thay cho iframe nếu iframe bị chặn hoặc không tải được | M |
| LK-04 | Hiển thị tốt trên mobile (iframe co giãn theo màn hình, cuộn được) | M |
| LK-05 | Dòng lưu ý: dữ liệu do hệ thống của CFI cung cấp, kết quả chính thức theo thông báo của nhà trường | M |

**Lợi ích:** không cần API, không lo CORS hay thay đổi endpoint, không lưu dữ liệu điểm cá nhân trên hệ thống của mình.

**Cần kiểm tra khi làm:** trang CFI có cho nhúng iframe hay không (phụ thuộc header `X-Frame-Options`/`Content-Security-Policy` của họ). Tôi chưa kiểm tra được từ môi trường hiện tại. Nếu bị chặn, mặc định dùng nút mở tab mới (LK-03). Không bao giờ thử vượt cơ chế chặn nhúng.

---

### 4.8 Trang quản trị (Admin)

| Mã | Yêu cầu | Ưu tiên |
|---|---|---|
| AD-01 | Đăng nhập admin riêng, phân quyền theo vai trò | M |
| AD-02 | Dashboard: số người dùng, lượt làm bài, đề được làm nhiều nhất, người dùng mới | S |
| AD-03 | **Quản lý đề thi thử**: tạo/sửa/xóa/nhân bản đề; **ghép đề từ 14 phần lấy trong kho phần**; **cài đặt thời gian làm bài (mặc định 60 phút)**; thứ tự, trạng thái (nháp/công khai) | M |
| AD-03b | **Quản lý kho phần (Part bank)**: tạo/sửa từng phần (skill, số phần, nhãn nguồn, dòng ví dụ, nhóm câu hỏi); một phần dùng lại được cho cả bài luyện và đề thi thử | M |
| AD-04 | **Quản lý câu hỏi & đáp án**: tạo theo 6 dạng ở mục 3.4, nhập đáp án đúng (với `short_text` là danh sách đáp án chấp nhận), giải thích, gắn đoạn văn/ảnh/audio, đáp án dạng ảnh, kiểm tra đủ dữ liệu trước khi công khai | M |
| AD-05 | Bài luyện = các phần lẻ trong kho phần; admin gắn nhãn kỹ năng, dạng bài, độ khó, chủ đề để hiển thị ở trang Ôn luyện | M |
| AD-06 | Tải lên file audio, ảnh, PDF tài liệu (giới hạn dung lượng và định dạng) | M |
| AD-07 | **Nhập hàng loạt** câu hỏi từ CSV/Excel/JSON (kèm file mẫu) | S |
| AD-08 | **Quản lý tài liệu**: danh sách tài liệu tải về, phân loại, ẩn/hiện | M |
| AD-09 | **Quản lý bài viết**: soạn bằng trình soạn thảo rich text, ảnh bìa, danh mục, thẻ, lên lịch đăng | M |
| AD-10 | **Quản lý người dùng**: xem danh sách, tìm kiếm, khóa/mở khóa, đặt lại mật khẩu, đổi vai trò | M |
| AD-11 | Xem bài làm của người dùng (đặc biệt bài Writing) để tham khảo/chấm tay | S |
| AD-12 | Nhật ký thao tác admin (ai sửa gì, khi nào) | S |
| AD-13 | Xem trước đề/bài như người dùng trước khi công khai | S |

---

## 5. Luồng người dùng chính

**Thi thử:** Trang chủ → Thi thử → Chọn đề → Đọc hướng dẫn → Bắt đầu (server ghi `started_at`) → Làm bài 14 phần, đồng hồ chạy, lưu tự động → Nộp bài hoặc hết giờ → Xem kết quả và đáp án.

**Ôn luyện:** Trang chủ → Ôn luyện → Chọn part (ví dụ Part 1 — Biển báo) → Xem tổng bài, đã hoàn thành, tiến độ; lọc và chọn kiểu xem → Chọn một bài hoặc "Luyện tất cả" → Làm → Nộp → Xem đáp án, giải thích → Quay lại trang part, tiến độ cập nhật.

**Tra cứu:** Tra cứu → Trang hiển thị giao diện chính thức của CFI → Chọn Kết quả thi/Lịch thi, loại kỳ thi, nhập thông tin theo yêu cầu của CFI → Xem kết quả (hoặc mở tab mới nếu iframe bị chặn).

**Đổi ngôn ngữ/theme:** bấm nút trên thanh điều hướng → giao diện đổi ngay, không tải lại toàn trang, lựa chọn được nhớ.

---

## 6. Sơ đồ trang (Sitemap)

`[skill]` nhận giá trị `reading-writing` hoặc `listening`.

| Đường dẫn | Nội dung | Truy cập |
|---|---|---|
| `/` | **Trang chủ (landing page)**, mục 4.2 | Công khai |
| `/dang-nhap`, `/dang-ky`, `/quen-mat-khau` | Xác thực | Công khai |
| `/on-luyen` | Chọn part: hai nhóm Reading & Writing và Listening | Công khai (xem); lưu tiến độ cần đăng nhập |
| `/on-luyen/[skill]/[partNo]` | Trang một part: tổng bài, đã hoàn thành, tiến độ, lọc, ba kiểu xem, Luyện tất cả | Công khai (xem); lưu tiến độ cần đăng nhập |
| `/on-luyen/[skill]/[partNo]/[itemId]` | Làm một bài luyện | Đăng nhập (một số bài mở) |
| `/thi-thu` | Danh sách đề thi thử | Đăng nhập |
| `/thi-thu/[id]` | Hướng dẫn trước khi thi | Đăng nhập |
| `/thi-thu/[id]/lam-bai` | Màn hình làm bài, đồng hồ | Đăng nhập |
| `/thi-thu/ket-qua/[attemptId]` | Kết quả | Đăng nhập |
| `/bai-viet`, `/bai-viet/[slug]` | Bài viết | Công khai |
| `/tra-cuu` | Tra cứu kết quả/lịch thi (nhúng giao diện CFI) | Công khai |
| `/tai-khoan` | Hồ sơ, lịch sử, tiến độ, ngôn ngữ và theme | Đăng nhập |
| `/admin/*` | Quản trị | Admin |

Thanh điều hướng chung: **Ôn luyện · Thi thử · Bài viết · Tra cứu điểm**, bên phải là nút chuyển ngôn ngữ, nút chuyển theme, Đăng nhập (hoặc ảnh đại diện khi đã đăng nhập).

---

## 7. Mô hình dữ liệu (mức khái niệm)

| Bảng | Trường chính |
|---|---|
| `users` | id, email, password_hash, full_name, student_code, role, status, preferred_locale (vi/en), preferred_theme (light/dark/system), created_at |
| `parts` *(kho phần)* | id, skill (reading/writing/listening), part_no (1–14), title, part_type, series (ví dụ "KET 5"), test_no, source_label (ví dụ "KET 5 · Test 3" hoặc "Đề 3"), instructions_i18n, example_json (câu 0 + đáp án), tags, difficulty, status |
| `question_groups` | id, part_id, passage_html, passage_image_urls, audio_url, audio_play_limit, order |
| `questions` | id, group_id, type (`match_pool`/`mcq3`/`mcq3_image`/`cloze_mcq`/`short_text`/`writing`), number_label, prompt, options (json, có thể kèm ảnh), correct_answer (json), accepted_answers (json, cho short_text), min_words, max_words, explanation, points, order |
| `exams` | id, title, description, duration_minutes (mặc định 60), status, created_by |
| `exam_parts` | id, exam_id, part_id, order, time_limit_minutes (nullable) |
| `attempts` | id, user_id, mode (practice_part/mock), exam_id (nullable), part_id (nullable), started_at, deadline_at, submitted_at, status, score_json |
| `attempt_answers` | id, attempt_id, question_id, answer (json), is_correct, answered_at |
| `writing_submissions` | id, attempt_id, question_id, content, word_count, self_score, reviewer_note |
| `settings` | key, value (ví dụ `default_exam_duration_minutes = 60`) |
| `articles` | id, title, slug, cover_url, content_html, category_id, status, published_at, author_id |
| `article_categories`, `tags` | id, name, slug |
| `documents` | id, title, file_url, category, status |
| `audit_logs` | id, admin_id, action, entity, entity_id, created_at |

*(Bỏ bảng `lookup_cache` vì trang tra cứu dùng trực tiếp giao diện CFI, không lưu dữ liệu.)*

**Song ngữ:** các trường hiển thị cho người học (hướng dẫn của part, giải thích, tiêu đề/nội dung bài viết) lưu dạng `{vi, en}`. Thiếu bản `en` thì hiển thị bản `vi`. Nội dung đề thi (bài đọc, câu hỏi, đáp án) vốn là tiếng Anh nên không dịch.

**Tiến độ ôn luyện** không cần bảng riêng: một bài "Đã làm" khi tồn tại `attempts` có `mode = practice_part`, `part_id` tương ứng và `status = submitted`; điểm tốt nhất lấy từ các lần nộp.

**Nguyên tắc:** đáp án đúng (`correct_answer`, `accepted_answers`) **không bao giờ trả về trình duyệt** khi đang làm bài. Chỉ gửi sau khi nộp.

---

## 8. Yêu cầu phi chức năng

**Responsive**
- Thiết kế mobile-first. Breakpoint đề xuất: mobile < 640px, tablet 640–1024px, desktop > 1024px.
- Màn hình làm bài: desktop chia đôi (đề bên trái, câu hỏi bên phải); mobile xếp dọc, thanh điều hướng câu hỏi thu gọn, đồng hồ cố định phía trên.
- Vùng bấm tối thiểu 44px, chữ tối thiểu 16px trên mobile.

**Hiệu năng**
- Trang chính tải dưới 3 giây trên mạng 4G thông thường.
- Audio Listening tải theo dạng streaming, cho phép tua (nếu đề cho phép), chịu được mạng chậm.
- Lưu đáp án không làm giật giao diện.

**Bảo mật**
- HTTPS, mật khẩu băm, chống CSRF/XSS/SQL injection, rate limit cho đăng nhập và tra cứu.
- Phân quyền kiểm tra ở backend cho mọi API admin.
- Upload file: kiểm tra định dạng và dung lượng, lưu ngoài thư mục chạy code.
- Không để lộ đáp án qua API hoặc mã nguồn phía client.

**Độ tin cậy**
- Bài thi thử không mất dữ liệu khi tải lại trang hoặc mất mạng ngắn.
- Sao lưu database định kỳ.

**Truy cập (accessibility)**
- Tương phản màu đạt WCAG AA, điều hướng bằng bàn phím được, có nhãn cho các phần tử tương tác.

**Ngôn ngữ & theme:** xem mục 4.1. Mặc định tiếng Việt, có bản tiếng Anh; có chế độ sáng và tối.

---

## 9. Đề xuất kiến trúc & công nghệ

| Lớp | Đề xuất |
|---|---|
| Frontend | Next.js + TypeScript + Tailwind CSS |
| Backend | Route handlers của Next.js hoặc Node.js/Express riêng nếu muốn tách |
| CSDL | PostgreSQL |
| Lưu file (audio, ảnh, tài liệu) | Object storage (S3-compatible, Cloudflare R2, Supabase Storage...) |
| Xác thực | Session cookie httpOnly hoặc thư viện auth (Auth.js, Lucia...) |
| Email | Dịch vụ gửi mail (Resend, SendGrid...) |
| Triển khai | Vercel/Railway + DB managed |

Đây là đề xuất khởi đầu, có thể đổi khi bắt tay vào làm. Điều quan trọng là **chốt stack một lần** và ghi vào `CLAUDE.md`.

---

## 10. Rủi ro & cách giảm thiểu

| Rủi ro | Mức | Giảm thiểu |
|---|---|---|
| Trang CFI chặn nhúng iframe hoặc đổi địa chỉ | Thấp | Luôn có nút mở tab mới làm dự phòng; kiểm tra định kỳ liên kết |
| Lộ dữ liệu cá nhân của người dùng (email, kết quả thi thử) | Trung bình | HTTPS, băm mật khẩu, phân quyền, không log nội dung bài làm không cần thiết |
| **Bản quyền nội dung đề/tài liệu** (bộ đề trên Studocu do người dùng khác tải lên, không rõ quyền sử dụng) | Cao | Chỉ đưa lên nội dung do bạn tự soạn, được cấp phép, hoặc tham khảo cấu trúc để tự viết đề mới. Không sao chép nguyên bộ đề |
| Bản mẫu đánh số thiếu câu 16–20, cấu trúc có thể khác đề thật | Trung bình | Kho phần linh hoạt (mục 3.4); xác nhận với đề thật trước khi nhập nội dung |
| Lệch đồng hồ, gian lận thời gian | Trung bình | Tính giờ theo server |
| Chấm Writing không chính xác | Trung bình | Chỉ tự đối chiếu rubric ở bản đầu, ghi rõ không phải điểm chính thức |
| Người dùng thi trên mobile mạng kém | Trung bình | Lưu cục bộ + đồng bộ lại, thông báo trạng thái lưu |

---

## 11. Lộ trình đề xuất

| Giai đoạn | Nội dung | Kết quả |
|---|---|---|
| **0. Chuẩn bị** | Chốt các câu hỏi mở còn lại (mục 13), viết `DESIGN.md`, kiểm tra iframe CFI | Đặc tả và thiết kế chốt |
| **1. Nền tảng** | Khung dự án, CSDL, đăng ký/đăng nhập, layout responsive, **đa ngôn ngữ VI/EN và theme sáng/tối** (làm ngay từ đầu vì thêm muộn rất tốn công), landing page | Người dùng đăng nhập, đổi ngôn ngữ/theme được |
| **2. Admin nội dung** | Quản lý đề, câu hỏi, đáp án, upload | Admin nhập được một đề hoàn chỉnh |
| **3. Ôn luyện** | Trang chọn part, trang part (tiến độ, lọc, 3 kiểu xem), làm bài, chấm tự động, Luyện tất cả | Luyện được từng part |
| **4. Thi thử** | Đồng hồ server, lưu tự động, nộp, kết quả | Làm trọn một đề 60 phút |
| **5. Bài viết + Tra cứu** | Bài viết, trang tra cứu nhúng giao diện CFI | Đủ các trang theo yêu cầu |
| **6. Hoàn thiện** | Kiểm thử trên thiết bị thật, bảo mật, hiệu năng, deploy | Bản phát hành đầu |

Có thể deploy sớm từ giai đoạn 1 để phát hiện lỗi môi trường sớm.

---

## 12. Tiêu chí nghiệm thu (bản đầu)

1. Đăng ký, đăng nhập, quên mật khẩu hoạt động trên desktop, tablet, mobile.
2. Admin tạo được một đề thi thử đủ 14 phần (có audio, ảnh, các dạng câu ở mục 3.4) và công khai.
3. Admin đổi được thời gian làm bài trong cài đặt; người dùng làm hết đề trong khoảng thời gian đó (mặc định 60 phút); tải lại trang giữa chừng vẫn giữ đáp án và thời gian còn lại đúng; hết giờ tự nộp.
4. Kết quả hiện đúng điểm Reading/Listening, kèm đáp án và giải thích; Writing có bài mẫu và rubric.
5. Bài luyện của cả 3 kỹ năng chấm và hiển thị đáp án đúng.
6. Trang bài viết có danh sách, chi tiết, tìm kiếm; admin đăng/sửa/xóa được.
7. Trang tra cứu hiển thị giao diện chính thức của CFI (iframe) hoặc nút mở tab mới nếu bị chặn, dùng được trên mobile.
8. Không có đáp án đúng nào lộ trong phản hồi API khi đang làm bài.
9. Người không phải admin không truy cập được `/admin` và các API admin.
10. Đổi được ngôn ngữ VI/EN và theme sáng/tối trên mọi trang; lựa chọn được nhớ sau khi tải lại và đăng nhập lại; không nháy sai theme khi tải trang.
11. Trang ôn luyện: mỗi part hiện đúng tổng bài, đã hoàn thành, tiến độ %; bộ lọc và ba kiểu xem hoạt động; "Luyện tất cả" chạy tuần tự các bài.
12. Landing page hiển thị đủ các khối M ở mục 4.2 trên desktop, tablet, mobile.

---

## 13. Câu hỏi mở

**Đã chốt**
- Thời gian thi: mặc định 60 phút, admin đổi được trong cài đặt.
- Cấu trúc đề: 14 phần như mục 3.3.
- Tra cứu điểm/lịch thi: dùng trực tiếp giao diện `kqt.cfi.humg.edu.vn`, không dùng API.
- Có landing page `/`, giao diện song ngữ Việt - Anh có nút đổi, có theme sáng/tối.
- Trang ôn luyện theo part với trang chi tiết part (mục 4.2 và 4.4).

**Còn lại**
1. **Cách tính điểm Writing** (Part 9, note 25–35 từ): tự đối chiếu bài mẫu/rubric, giáo viên chấm tay, hay có AI hỗ trợ? Có cộng vào tổng điểm không? Thang điểm và điểm đạt của từng khối?
2. **Số câu 16–20 bị thiếu** trong phần Reading & Writing của bản mẫu: lỗi đánh số hay đề thật không có?
3. **Số liệu còn thiếu cho ôn luyện:** số bài của Part 9 và của Listening 2, 3, 4, 5; mô tả ngắn cho từng Listening part.
4. **Nguồn nội dung đề:** các bài gắn nhãn KET của Cambridge là tài liệu có bản quyền. Bạn tự soạn, xin phép, hay dùng nguồn nào?
5. **Khách chưa đăng nhập** được làm bài luyện đến đâu (chỉ xem danh sách, hay làm thử một số bài)? Có giới hạn đăng ký chỉ cho email/mã sinh viên HUMG không?
6. **URL theo ngôn ngữ:** chỉ dùng cookie (bản đầu), hay cần `/vi`, `/en` riêng để SEO?
7. **Có làm mục "Bài giảng"** như bản mẫu (đang ghi BETA) và nút "Góp ý" không? PRD hiện chỉ có Góp ý ở mức Could.
8. **Tên website, logo, màu chủ đạo** để đưa vào `DESIGN.md`.
9. **Có cần bảng xếp hạng, bình luận, thông báo email** trong bản đầu không?
