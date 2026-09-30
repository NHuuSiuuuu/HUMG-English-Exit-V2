# PAGES — Mô tả từng trang

Mỗi trang ghi những gì agent không thể tự đoán: các khối theo thứ tự, các trạng thái đặc biệt, khác biệt mobile/desktop. Màu, font, component xem `DESIGN.md`. Tính năng và quy tắc nghiệp vụ xem `PRD.md` (mã yêu cầu ghi trong ngoặc).


## Thành phần dùng chung

**Thanh điều hướng trên (mọi trang, trừ màn hình làm bài thi thử)**
- Trái: logo (tham khảo Trường đại học mỏ địa chất hà nội) + tên (HUMG English Exit). Giữa/phải: Ôn luyện · Thi thử · Bài viết · Tra cứu điểm.
- Phải: nút đổi ngôn ngữ (VI/EN), nút đổi theme (sáng/tối/theo hệ thống), Đăng nhập (khách) hoặc avatar + menu (Tài khoản, Đăng xuất; thêm "Quản trị" nếu là admin).
- Mobile: chỉ còn logo, nút ngôn ngữ, nút theme và nút mở ngăn kéo chứa menu; Đăng nhập nằm trong ngăn kéo.
- Mục đang ở có trạng thái nhấn rõ.

**Footer (trang công khai):** liên kết trang, liên kết tới hệ thống tra cứu chính thức của CFI, liên hệ, nút Góp ý (nếu có).

**Trang 404 / lỗi chung:** icon, một dòng giải thích, nút "Về trang chủ".

**Yêu cầu đăng nhập:** truy cập trang cần đăng nhập khi chưa đăng nhập thì chuyển tới `/dang-nhap` kèm địa chỉ quay lại; sau khi đăng nhập về đúng trang đó.

---

## `/` — Trang chủ (landing) (LD-01 → LD-11)

**Khối, theo thứ tự**
1. Hero: tiêu đề, mô tả ngắn, nút chính "Bắt đầu ôn luyện", nút phụ "Thi thử" và "Tra cứu điểm". Bên cạnh (desktop) hoặc dưới (mobile) là hình minh họa/ảnh chụp giao diện.
2. Ba thẻ chức năng: Ôn luyện từng phần · Thi thử mô phỏng · Tra cứu điểm.
3. Cấu trúc đề thi: hai khối Reading & Writing (9 part) và Listening (5 part), tổng thời gian, các dạng câu hỏi.
4. Số liệu động: tổng số bài luyện, số đề thi thử.
5. Cách hoạt động: 3 bước.
6. Bài viết mới nhất (3 bài).
7. Câu hỏi thường gặp (accordion).
8. Footer.

**Trạng thái**
- Số liệu và bài viết đang tải: skeleton. Lỗi tải số liệu: ẩn khối số liệu, không hiện lỗi to.
- Không có bài viết: ẩn khối bài viết.
- **Đã đăng nhập:** thay hero bằng "Tiếp tục bài đang làm" (nếu có bài dở), tiến độ tổng quan và gợi ý part nên luyện tiếp (LD-09, mức Could).

**Desktop:** hero hai cột. **Mobile:** một cột, hai nút CTA xếp dọc, nút chính ở trên.

*Ảnh mẫu:* `docs/design/landing.png` (bổ sung sau).

---

## `/dang-nhap`, `/dang-ky`, `/quen-mat-khau` (AU-01 → AU-07)

**Khối:** thẻ căn giữa (logo, tiêu đề, form, liên kết sang trang kia). Đăng ký: họ tên, email, mật khẩu, nhập lại mật khẩu, mã sinh viên (tùy chọn).

**Trạng thái**
- Đang gửi: nút vào trạng thái tải, vô hiệu hóa form.
- Lỗi từng ô hiện ngay dưới ô; lỗi chung (sai mật khẩu, email đã tồn tại) hiện trong khung cảnh báo trên form. Không tiết lộ email có tồn tại hay không ở "Quên mật khẩu".
- Nút hiện/ẩn mật khẩu; kiểm tra độ dài tối thiểu 8 ký tự.
- Quá số lần thử: thông báo thử lại sau.
- Quên mật khẩu xong: màn hình "Đã gửi email (nếu tài khoản tồn tại)".

**Mobile:** thẻ chiếm gần hết chiều rộng, không đổ bóng, bàn phím không che nút gửi.

---

## `/on-luyen` — Chọn part (PR-01)

**Khối:** tiêu đề "Ôn luyện từng phần" + mô tả "Chọn một dạng bài để luyện". Hai nhóm: **Reading & Writing** (9 thẻ), **Listening** (5 thẻ). Mỗi thẻ: số part, tên, mô tả một dòng, số bài (đếm từ dữ liệu). Khi đã đăng nhập, mỗi thẻ có thêm thanh tiến độ nhỏ và "x/N đã làm".

**Trạng thái**
- Đang tải: skeleton thẻ.
- Part chưa có bài nào: thẻ mờ, ghi "Sắp có", không bấm được.
- Lỗi: thông báo + nút thử lại.

**Desktop:** lưới 3 cột. **Tablet:** 2 cột. **Mobile:** 1 cột.

---

## `/on-luyen/[skill]/[partNo]` — Trang một part (PR-02 → PR-06, PR-11, PR-13)

Ví dụ: "Part 1 — Biển báo".

**Khối, theo thứ tự**
1. Tiêu đề part + mô tả một dòng (ví dụ "Nối câu với biển báo / thông báo (A–H)").
2. Nút **Luyện tất cả (N đề)**.
3. Ba chỉ số: **Tổng số bài** · **Đã hoàn thành** (x / N đề, %) · **Tiến độ chung** (%, có thanh tiến độ).
4. Hàng điều khiển: bộ lọc **Tất cả (N) · Chưa làm (n) · Đã làm (n)** và chọn kiểu xem **Lưới · Gom nhóm · Danh sách**.
5. Danh sách bài theo kiểu xem đang chọn.

**Thẻ bài:** nhãn nguồn ("KET 2 · Test 1", hoặc "Đề 1" với Listening), badge Chưa làm/Đã làm (kèm điểm tốt nhất nếu đã làm), tên part. Toàn thẻ bấm được.

**Ba kiểu xem**
- *Lưới:* thẻ bài xếp lưới.
- *Gom nhóm:* gom theo bộ đề (KET 2, KET 3...), mỗi nhóm có tiêu đề gập được và đếm "(đã làm/tổng)". Với Listening không gom hoặc gom theo khoảng đề.
- *Danh sách:* mỗi bài một dòng gọn.
- Ghi nhớ kiểu xem lần trước của người dùng.

**Trạng thái**
- Đang tải: skeleton cho ba chỉ số và thẻ bài.
- Bộ lọc không có kết quả: "Không có bài nào ở mục này" + nút "Xem tất cả".
- Part rỗng hoặc không tồn tại: trang trống có nút quay lại; `partNo` sai thì 404.
- **Khách chưa đăng nhập:** vẫn xem được danh sách; ba chỉ số và badge tiến độ thay bằng lời nhắc "Đăng nhập để lưu tiến độ"; các bài không mở thì bấm sẽ dẫn tới đăng nhập.
- **Luyện tất cả:** bấm vào bài đầu tiên chưa làm; nếu đã làm hết thì bắt đầu từ bài đầu. Nếu đang dở dở dang thì đổi nhãn nút thành "Tiếp tục".

**Desktop:** ba chỉ số hàng ngang; lưới 3-4 cột. **Mobile:** ba chỉ số xếp dọc hoặc cuộn ngang; bộ lọc và kiểu xem cuộn ngang; lưới 1 cột (hoặc 2 cột nhỏ).

*Ảnh mẫu:* `docs/design/part-page.png` (bổ sung sau).

---

## `/on-luyen/[skill]/[partNo]/[itemId]` — Làm một bài luyện (PR-07 → PR-10, PR-12)

**Khối, theo thứ tự**
1. Thanh trên gọn: nút quay lại trang part, tên bài ("Part 1 — Biển báo · KET 5 · Test 3"), trạng thái lưu nháp, nút Nộp bài.
2. Tiêu đề part, hướng dẫn, **dòng ví dụ (câu 0)**.
3. Nội dung đề và các câu hỏi theo dạng của part (xem "Bố cục theo dạng câu hỏi" ở dưới).
4. Bộ đếm "Đã trả lời a/b câu".
5. Sau khi nộp: điểm, từng câu đúng/sai, đáp án đúng, giải thích; với Listening có transcript; với Part 9 có bài mẫu và rubric.
6. Chân trang: "Làm lại" và "Bài tiếp theo". Khi đang ở chế độ **Luyện tất cả**, hiện tiến độ hàng đợi ("Bài 3/20") và nút "Bài tiếp theo" nổi bật.

**Không có đồng hồ.** Nộp bài không bắt buộc trả lời hết; nếu còn câu trống thì hỏi xác nhận và nêu số câu chưa làm.

**Trạng thái**
- Đang tải: skeleton.
- Bài dở: khôi phục đáp án đã lưu, hiện "Đã khôi phục bài làm dở".
- Lưu nháp: "Đang lưu…" / "Đã lưu lúc HH:mm" / "Lưu thất bại, thử lại".
- Sau khi nộp: các lựa chọn chuyển sang chế độ xem lại, không sửa được; câu nhập text hiện đáp án chấp nhận.
- Listening: nếu audio không tải được, hiện lỗi cạnh trình phát + nút thử lại.
- Bài không tồn tại hoặc chưa công khai: 404.
- Khách vào bài không mở: chuyển tới đăng nhập.

**Mobile:** cột đơn, nút Nộp bài cố định ở dưới (tránh vùng an toàn).

---

## `/thi-thu` — Danh sách đề thi thử (MK-01)

**Khối:** tiêu đề + mô tả ngắn quy định (14 phần, thời gian, chấm điểm); danh sách thẻ đề. Mỗi thẻ: tên đề, thời gian làm bài (theo cài đặt), số phần/số câu, trạng thái người dùng (Chưa thi / Đang làm dở / Đã thi + điểm gần nhất).

**Trạng thái**
- Có bài **đang làm dở**: thẻ đó nổi bật với nút "Tiếp tục" và thời gian còn lại; thẻ khác vẫn bắt đầu được nhưng cảnh báo nếu bắt đầu đề mới khi còn bài dở của đề khác (theo quy định: mỗi lúc chỉ một bài đang làm).
- Chưa có đề nào: trạng thái rỗng "Chưa có đề thi thử".
- Đang tải/lỗi: skeleton / thông báo + thử lại.
- Khách: chuyển tới đăng nhập khi bấm vào đề.

---

## `/thi-thu/[id]` — Hướng dẫn trước khi thi (MK-02)

**Khối:** tên đề, thời gian làm bài, cấu trúc 14 phần (bảng tóm tắt hai khối), quy định (đồng hồ chạy theo giờ server, tự lưu, hết giờ tự nộp, Listening nghe theo số lần quy định, không thi lại trong cùng lượt), yêu cầu kỹ thuật (bật âm thanh, mạng ổn định). Nút **Bắt đầu làm bài** (chỉ bật khi đã tick "Tôi đã đọc quy định").

**Trạng thái:** có bài dở của đề này → nút thành "Tiếp tục làm bài". Đề chưa công khai → 404. Bấm Bắt đầu: nút tải, server ghi `started_at`, chuyển sang màn hình làm bài; lỗi thì báo và cho thử lại mà **không** bắt đầu tính giờ.

---

## `/thi-thu/[id]/lam-bai` — Màn hình làm bài thi thử (MK-03 → MK-10, MK-14)

Đây là màn hình khó nhất, làm cẩn thận nhất.

**Khối, theo thứ tự**
1. **Thanh trên cố định (gọn, không có menu điều hướng của site):** tên đề · **đồng hồ đếm ngược** · trạng thái lưu · tiến độ tổng "Đã trả lời a/b" · nút **Nộp bài**.
2. **Thanh điều hướng phần:** 14 chip "1…14" nhảy tới từng phần; trạng thái mỗi chip: chưa làm, đang làm (một phần), đã làm hết, có câu đánh dấu. Cuộn ngang trên mobile.
3. **Nội dung: một trang cuộn dài, mỗi phần một khối.** Mỗi khối gồm: thanh tiêu đề "Phần x/14 · Part n — tên · nhãn nguồn", hướng dẫn, dòng ví dụ (câu 0), các câu hỏi, bộ đếm "Đã trả lời a/b câu".
4. Cuối trang: nút Nộp bài.

**Bố cục theo dạng câu hỏi** (áp dụng cho cả bài luyện): xem mục "Bố cục theo dạng câu hỏi" ở cuối file.

**Đồng hồ và giờ**
- Thời gian còn lại tính từ `deadline_at` của server; đồng hồ ở trình duyệt chỉ để hiển thị và tự đồng bộ lại định kỳ.
- Còn dưới 10 phút: đổi sang màu cảnh báo + toast một lần. Còn dưới 5 phút: màu lỗi + toast một lần. Không nhấp nháy liên tục.
- **Hết giờ:** hiện hộp thoại "Hết giờ, bài của bạn đang được nộp", khóa mọi ô, gửi bài, rồi chuyển tới trang kết quả.

**Nộp bài sớm:** hộp thoại xác nhận nêu số câu chưa trả lời và liên kết "Xem câu chưa làm"; không cho hoàn tác sau khi đã nộp.

**Lưu và mạng**
- Lưu tự động mỗi khi đổi đáp án (chọn ngay, ô nhập text sau khi ngừng gõ ngắn).
- Chỉ báo lưu: "Đang lưu…" / "Đã lưu lúc HH:mm" / "Lưu thất bại".
- **Mất mạng:** banner "Mất kết nối. Bài làm được lưu tạm trên máy và sẽ đồng bộ khi có mạng"; đồng hồ vẫn chạy. Có lại mạng: tự đồng bộ, banner đổi thành "Đã đồng bộ".
- **Tải lại trang hoặc đóng nhầm tab:** cảnh báo trước khi rời trang; mở lại thì khôi phục đáp án và thời gian còn lại đúng.

**Listening trong thi thử**
- Trình phát audio theo cấu hình: hiện "Còn x lượt nghe", không tua, hết lượt thì vô hiệu hóa và ghi rõ.
- Không tự động phát lại; bắt đầu phát khi người dùng bấm.
- Audio lỗi: thông báo + nút thử tải lại, không mất lượt nghe do lỗi tải.

**Trạng thái khác**
- Đang tải đề: skeleton toàn trang.
- Vào lại bài **đã nộp**: chuyển thẳng tới trang kết quả.
- Vào bài **hết hạn** mà chưa nộp: server chốt bài với đáp án đã lưu rồi chuyển tới kết quả.
- Bài không thuộc người dùng hoặc không tồn tại: 404.

**Desktop:** Phần 1 chia hai cột (câu hỏi bên trái, danh sách biển báo A–H dính bên phải). Các phần khác một cột giữa, rộng vừa để đọc. Thanh điều hướng phần có thể là cột dính bên trái nếu đủ chỗ.
**Tablet:** một cột, thanh điều hướng phần cuộn ngang.
**Mobile:** một cột; danh sách biển báo A–H của Phần 1 là **bảng gập dính ngay dưới thanh trên** ("Biển báo A–H") để luôn xem được khi chọn đáp án; nút Nộp bài trong thanh trên và lặp lại cuối trang.

*Ảnh mẫu:* `docs/design/exam-desktop.png`, `docs/design/exam-mobile.png` (bổ sung sau). Ảnh chụp bản thi thử tham khảo chỉ để xem cách sắp xếp.

---

## `/thi-thu/ket-qua/[attemptId]` — Kết quả (MK-10, MK-11)

**Khối, theo thứ tự**
1. Tóm tắt: tổng điểm, điểm từng khối (Reading & Writing, Listening), thời gian đã làm, ngày giờ nộp.
2. Điểm theo từng part (bảng hoặc thanh ngang).
3. Bộ lọc xem lại: Tất cả · Chỉ câu sai · Chưa trả lời.
4. Xem lại từng part: từng câu với câu trả lời của người dùng, đáp án đúng, giải thích; ✓/✗ kèm màu. Listening có transcript.
5. Part 9 (Viết note): bài đã viết, bài mẫu, rubric để tự đối chiếu. **Điểm Writing chưa cộng vào tổng** cho đến khi quy tắc chấm được chốt (PRD mục 13).
6. Hành động: "Làm lại đề này", "Về danh sách đề", "Xem lịch sử".

**Trạng thái:** đang tải skeleton; kết quả không thuộc người dùng thì 404; bài chưa nộp thì chuyển về màn hình làm bài.

**Mobile:** tóm tắt xếp dọc, xem lại từng part gập được.

---

## `/bai-viet` và `/bai-viet/[slug]` (AR-01 → AR-06)

**Danh sách:** tiêu đề, ô tìm kiếm, chip danh mục, lưới thẻ bài viết (ảnh bìa, tiêu đề, mô tả ngắn, ngày, danh mục), phân trang. Trạng thái: đang tải skeleton; không kết quả "Không tìm thấy bài viết" + xóa bộ lọc; rỗng "Chưa có bài viết".

**Chi tiết:** ảnh bìa, tiêu đề, ngày, danh mục/thẻ, nội dung (rộng tối đa 720px), bài viết liên quan, nút chia sẻ. Bài không có bản dịch cho ngôn ngữ đang chọn: hiện bản gốc kèm ghi chú nhỏ. Không tồn tại hoặc chưa đăng: 404.

**Desktop:** lưới 3 cột. **Mobile:** 1 cột; chip danh mục cuộn ngang.

---

## `/tra-cuu` — Tra cứu kết quả & lịch thi (LK-01 → LK-05)

**Khối, theo thứ tự**
1. Tiêu đề + mô tả ngắn cách dùng.
2. Dòng lưu ý: dữ liệu do hệ thống của CFI cung cấp, kết quả chính thức theo thông báo của nhà trường.
3. Nút **"Mở trang tra cứu chính thức"** (mở tab mới), **luôn hiển thị** phía trên khung.
4. Khung nhúng (iframe) trang `kqt.cfi.humg.edu.vn`, rộng bằng nội dung, cao đủ dùng.

**Trạng thái**
- Đang tải khung: skeleton bên trong khung.
- Trình duyệt không cho biết chắc iframe bị chặn hay không, nên **không dựa vào việc tự phát hiện lỗi**. Vì nút mở tab mới luôn có sẵn, người dùng luôn có đường thay thế. Nếu sau này xác định chắc chắn trang CFI chặn nhúng, thay khung bằng khối giải thích + nút mở tab mới.
- Không lưu, không log gì từ nội dung trong khung.

**Mobile:** khung rộng hết chiều ngang, chiều cao xấp xỉ `100dvh` trừ thanh trên; cuộn được trong khung.

---

## `/tai-khoan` — Tài khoản (AU-06, PR-11, PR-14, MK-11)

**Khối:** các tab **Hồ sơ · Tiến độ · Lịch sử · Cài đặt**.
- *Hồ sơ:* họ tên, email (chỉ đọc hoặc đổi có xác minh), mã sinh viên, lưu.
- *Tiến độ:* biểu đồ tiến bộ theo part và theo thời gian, số bài đã làm/tổng theo part.
- *Lịch sử:* các lần thi thử và bài luyện (ngày, điểm), mở lại kết quả.
- *Cài đặt:* ngôn ngữ, theme, đổi mật khẩu, xóa tài khoản (hộp thoại xác nhận nêu rõ hậu quả).

**Trạng thái:** chưa có lịch sử → trạng thái rỗng kèm nút "Bắt đầu ôn luyện". Lưu thành công/thất bại bằng toast. **Mobile:** tab cuộn ngang.

---

## Khu quản trị `/admin/*` (AD-01 → AD-13)

**Khung chung:** desktop có thanh bên trái (Tổng quan, Kho phần, Đề thi thử, Bài viết, Tài liệu, Người dùng, Cài đặt) và vùng nội dung; tablet/mobile thanh bên thành ngăn kéo. Ưu tiên desktop; tablet dùng được; mobile chỉ cần xem và sửa nhanh. Chỉ vai trò admin vào được, người khác thấy 403.

**Trang chính**
- *Tổng quan:* số người dùng, lượt làm bài, đề được làm nhiều nhất, người dùng mới.
- *Kho phần (Part bank):* bảng lọc theo kỹ năng, part, bộ đề, trạng thái, tìm kiếm; thao tác tạo, sửa, nhân bản, ẩn/hiện, xóa (xác nhận). **Trình chỉnh sửa một part:** thông tin chung (kỹ năng, số part, nhãn nguồn, hướng dẫn `vi` và `en`, dòng ví dụ), các nhóm câu hỏi (đoạn văn/ảnh/audio, số lần nghe), câu hỏi (chọn dạng, nhập nội dung, đáp án, giải thích, ảnh cho đáp án nếu dạng ảnh), xem trước như người dùng, **kiểm tra đủ dữ liệu trước khi công khai** (liệt kê lỗi cụ thể: câu thiếu đáp án, thiếu audio...).
- *Đề thi thử:* danh sách đề; trình chỉnh sửa ghép đề từ 14 phần lấy trong kho, sắp thứ tự, đặt thời gian làm bài (mặc định lấy từ Cài đặt), xem trước, công khai.
- *Bài viết:* danh sách và trình soạn thảo rich text, ảnh bìa, danh mục, thẻ, bản dịch, lên lịch đăng.
- *Tài liệu:* danh sách file, tải lên, phân loại, ẩn/hiện.
- *Người dùng:* bảng tìm kiếm, khóa/mở khóa, đặt lại mật khẩu, đổi vai trò; xem bài làm (đặc biệt Writing).
- *Cài đặt:* thời gian làm bài mặc định (phút), các thiết lập chung. Có nhật ký thao tác admin.

**Trạng thái chung:** đang tải skeleton bảng; rỗng có nút tạo mới; thao tác nguy hiểm luôn qua hộp thoại xác nhận; lưu thành công/thất bại bằng toast; form báo lỗi ngay ở từng ô; thao tác công khai bị chặn nếu dữ liệu chưa đủ.

*Ảnh mẫu:* không bắt buộc cho admin; theo `DESIGN.md` là đủ.

---

## Bố cục theo dạng câu hỏi

Dùng chung cho bài luyện, thi thử và trang kết quả.

| Dạng | Bố cục |
|---|---|
| `match_pool` (Part 1, Listening 2) | Hai vùng: danh sách câu cần ghép và kho đáp án A–H dùng chung (thẻ có huy hiệu chữ cái). Mỗi câu có hàng chọn chữ A–H. Đáp án thừa vẫn hiện. Desktop: kho đáp án dính bên phải. Mobile: kho gập dính dưới thanh trên. Một đáp án có thể bị chọn cho nhiều câu; đề quyết định có cho phép hay không (mặc định: không, cảnh báo nhẹ nếu trùng). |
| `mcq3` (Part 2, 3, 4; Listening 3) | Thẻ câu: đề bài + ba lựa chọn dạng radio thẻ; Part 4 dùng nhãn Right / Wrong / Doesn't say. Lựa chọn ngắn (Part 3) xếp ngang nếu vừa, dài thì xếp dọc. |
| `mcq3_image` (Listening 1) | Ba ảnh A/B/C xếp ngang cùng tỷ lệ, cả ảnh là vùng bấm, huy hiệu chữ cái ở góc. Mobile: có thể xếp dọc hoặc cuộn ngang, ảnh vẫn đủ lớn để nhìn rõ (giá, giờ, thời tiết). |
| `cloze_mcq` (Part 5) | Đoạn văn đầy đủ (hoặc ảnh trang đề) ở trên; bên dưới danh sách các chỗ trống 28-35, mỗi chỗ ba lựa chọn. Desktop có thể đặt đoạn văn dính bên trái, câu hỏi bên phải. |
| `short_text` (Part 6, 7, 8; Listening 4, 5) | Ô nhập text gắn với số câu. Part 6: gợi ý chữ đầu và số ký tự dạng "u _ _ _ _ _ _". Part 7: đoạn thư/email hiển thị nguyên bản, số câu đánh dấu trong văn bản, ô nhập ở danh sách bên dưới hoặc chèn trong dòng (chọn một cách và dùng nhất quán). Part 8, Listening 4-5: biểu mẫu/phiếu có nhãn trường và ô nhập. Bàn phím mobile không che ô đang nhập. |
| `writing` (Part 9) | Đề bài + ba ý cần nêu (danh sách), ô văn bản lớn, **đếm từ trực tiếp** với yêu cầu 25–35 từ (trong khoảng: trung tính; ngoài khoảng: cảnh báo, không chặn nộp). |

**Chung:** mỗi nhóm có dòng ví dụ (câu 0); văn bản bài đọc dùng cỡ chữ nội dung bài đọc trong `DESIGN.md`; ảnh trang đề luôn trong khung sáng.
