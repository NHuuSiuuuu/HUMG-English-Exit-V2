# HUMG English Exit — Design System

Tên thương hiệu hiện là tên tạm. Sản phẩm phục vụ sinh viên HUMG luyện tiếng Anh chuẩn đầu ra và quản trị nội dung học tập.

## Hướng thiết kế

Giao diện lấy cảm hứng từ bảng điều khiển luyện thi: rõ cấu trúc, thao tác nhanh, đọc lâu không mỏi. Con số 14 và tiến độ theo từng phần là dấu hiệu nhận diện; phần còn lại tiết chế để nội dung đề làm trung tâm. Không dùng nhận diện chính thức của trường nếu chưa được cung cấp quyền sử dụng.

## Màu

Chỉ dùng token dưới đây trong component. Không hard-code màu tại component.

| Token                  | Sáng      | Tối       | Công dụng                                    |
| ---------------------- | --------- | --------- | -------------------------------------------- |
| `--background`         | `#F4F7FB` | `#101925` | Nền trang                                    |
| `--surface`            | `#FFFFFF` | `#1A2737` | Bề mặt và nội dung đề                        |
| `--surface-raised`     | `#E6EDF6` | `#243448` | Khu vực phụ, thanh điều hướng                |
| `--foreground`         | `#14243A` | `#E9F0F8` | Chữ chính                                    |
| `--muted`              | `#52627A` | `#A8B7C9` | Chữ phụ, mô tả                               |
| `--primary`            | `#1248A0` | `#78A9FF` | Hành động chính, liên kết                    |
| `--primary-foreground` | `#FFFFFF` | `#101925` | Chữ trên hành động chính                     |
| `--accent`             | `#B83E2B` | `#FF8873` | Tín hiệu cần chú ý, không dùng làm nền trang |
| `--accent-foreground`  | `#FFFFFF` | `#14243A` | Chữ trên nền accent                          |
| `--secondary`          | `#2C766E` | `#68BDB1` | Tiến độ, Reading/Listening phụ trợ           |
| `--border`             | `#D5DEEB` | `#3A4A5E` | Viền phân tách                               |
| `--success`            | `#28715E` | `#68BDB1` | Trạng thái hoàn thành                        |
| `--danger`             | `#B83E2B` | `#FF8873` | Lỗi và cảnh báo quan trọng                   |

Chữ chính và chữ phụ phải đạt WCAG AA trên bề mặt tương ứng. Không truyền đạt trạng thái chỉ bằng màu; luôn kèm nhãn, biểu tượng hoặc văn bản. Ảnh đề nền trắng được đặt trên `--surface` kể cả ở theme tối, không đảo màu ảnh.

## Chữ

- **Nunito Sans:** tiêu đề giao diện, điều hướng, nút và nhãn điều khiển. Cảm giác thân thiện, rõ ở kích thước nhỏ.
- **Open Sans:** nội dung bài đọc, câu hỏi, lựa chọn, hướng dẫn và văn bản dài để dễ đọc liên tục.
- Nạp font bằng `next/font/google`, có fallback sans-serif. Không dùng font display cho nội dung đề.
- Cỡ chữ nội dung tối thiểu 16px trên mobile. Không co giãn cỡ chữ theo chiều rộng viewport. Giữ chiều dài dòng dưới khoảng 80 ký tự; bài đọc có line-height thoáng.
- Thang chữ: 12, 14, 16, 20, 24, 32, 40px. Tiêu đề compact trong khu vực công cụ; không dùng hero-scale type ngoài trang chủ.

## Bố cục và thành phần

- Mobile-first; kiểm tra 375px, 768px và 1280px. Vùng bấm tối thiểu 44px, focus bàn phím phải nhìn thấy.
- Lưới nội dung tối đa khoảng 1200px; bài đọc và câu hỏi giới hạn chiều rộng để không thành dòng quá dài.
- Khoảng cách theo bội 4px: 4, 8, 12, 16, 24, 32, 48, 64px. Bo góc tối đa 8px.
- Dùng card cho các mục lặp lại như part, bài viết, đề thi; không bọc các section lớn trong card và không lồng card trong card. Bảng điều khiển ưu tiên đường phân cách và nhóm điều khiển gọn.
- Màn hình làm bài và nội dung đề ưu tiên độ tương phản, bố cục ổn định và khả năng đọc hơn trang trí. Không có gradient nền, hiệu ứng chuyển động gây phân tán hoặc layout thử nghiệm trong bài thi.
- Chuyển động chỉ phản hồi thao tác; tôn trọng `prefers-reduced-motion`.

## Song ngữ và theme

- Mọi nhãn, trạng thái, lỗi và nút giao diện nằm trong `messages/vi.json` và `messages/en.json`; mặc định tiếng Việt.
- Nội dung đề giữ nguyên ngôn ngữ nguồn. Hướng dẫn/giải thích song ngữ dùng bản `vi` làm fallback khi thiếu `en`.
- Theme sáng/tối/theo hệ thống được quản lý bằng class `dark` trên `<html>`, không nháy theme khi tải. Khách lưu lựa chọn ở cookie; tài khoản đồng bộ lựa chọn hồ sơ.

## Nội dung hình ảnh

Ưu tiên hình ảnh tự tạo hoặc được cấp phép. Không sao chép đề Cambridge, logo trường hay nội dung từ website tham khảo. Hình minh họa phải giải thích cấu trúc học tập, không chỉ làm nền trang trí.
