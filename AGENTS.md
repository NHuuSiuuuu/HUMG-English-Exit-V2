# HUMG English Exit — Quy tắc cho agent

Website ôn luyện và thi thử chuẩn đầu ra tiếng Anh cho sinh viên Trường Đại học Mỏ - Địa chất (HUMG). Web responsive (desktop, tablet, mobile), song ngữ Việt - Anh, có theme sáng/tối. Người dùng: sinh viên và admin.

Tên "HUMG English Exit" là tên tạm.

## Tài liệu của dự án (đọc khi cần, không đọc hết mỗi lần)

| File | Đọc khi |
|---|---|
| `docs/PRD.md` | Cần biết tính năng, quy tắc nghiệp vụ, mô hình dữ liệu, tiêu chí nghiệm thu |
| `docs/DESIGN.md` | Làm bất kỳ giao diện nào: màu, font, component, dark mode |
| `docs/PAGES.md` | Làm một trang cụ thể: các khối, trạng thái, mobile/desktop |
| `docs/design/` | Xem ảnh mockup/tham khảo được nhắc trong `PAGES.md` |

Trước khi làm một trang, **đọc mục của trang đó trong `docs/PAGES.md`** và các quy tắc trong `docs/DESIGN.md`. Nếu tài liệu mâu thuẫn nhau, hỏi lại người dùng, đừng tự chọn.

## Công nghệ

**Đã chốt**
- Next.js (App Router) + TypeScript ở chế độ `strict`
- Tailwind CSS
- PostgreSQL

**Mặc định đề xuất** (dùng nếu người dùng không nói khác, đổi được)
- ORM: Prisma
- Validate: Zod, dùng chung cho client và server
- i18n: next-intl, chọn ngôn ngữ bằng cookie, không dùng tiền tố URL `/vi` `/en`
- Theme: next-themes (class `dark` trên `<html>`)
- Icon: lucide-react
- UI primitives có sẵn accessibility: shadcn/ui (Radix)
- Test: Vitest cho logic (chấm điểm, tính giờ), Playwright cho luồng chính nếu kịp

**Chưa chốt — HỎI người dùng trước khi chọn**
- Nơi host PostgreSQL (Neon, Supabase hoặc khác)
- Nơi lưu file audio/ảnh/tài liệu
- Thư viện xác thực (Auth.js hay tự làm session cookie)
- Dịch vụ gửi email
- Nơi deploy

## Cấu trúc thư mục

Một dự án Next.js duy nhất, nhưng **frontend và backend nằm ở hai thư mục riêng** và có ranh giới bắt buộc (xem bên dưới).

```
.
├─ prisma/                    schema.prisma, migrations, seed
├─ docs/                      PRD.md, DESIGN.md, PAGES.md, design/
├─ public/                    ảnh tĩnh, favicon (audio và ảnh đề để ở storage, không để đây)
└─ src/
   ├─ app/                    ROUTING, giữ thật mỏng
   │  ├─ (public)/            /, /bai-viet, /tra-cuu, xem /on-luyen
   │  ├─ (auth)/              /dang-nhap, /dang-ky, /quen-mat-khau
   │  ├─ (app)/               /on-luyen/..., /thi-thu/..., /tai-khoan
   │  ├─ admin/               khu quản trị
   │  └─ api/                 route handler mỏng, gọi backend/services
   │
   ├─ frontend/               FRONTEND: giao diện
   │  ├─ components/
   │  │  ├─ ui/               primitive (button, input, dialog, tabs...)
   │  │  ├─ layout/           header, footer, ngăn kéo menu
   │  │  ├─ practice/         thẻ part, thẻ bài, bộ lọc, kiểu xem
   │  │  ├─ exam/             đồng hồ, thanh điều hướng phần, câu hỏi theo dạng
   │  │  └─ admin/            bảng, trình chỉnh sửa part/đề/bài viết
   │  ├─ hooks/               hook giao diện (useTimer, useAutosave, useTheme...)
   │  ├─ lib/                 tiện ích giao diện (cn, format, gọi API từ client)
   │  └─ styles/              globals.css (token màu, xem DESIGN.md)
   │
   ├─ backend/                BACKEND: nghiệp vụ, dữ liệu, bảo mật (chỉ chạy ở server)
   │  ├─ services/            exam, attempt, practice, part, article, user, auth
   │  └─ lib/                 db (Prisma client), auth, storage, mailer, scoring, time
   │
   ├─ shared/                 DÙNG CHUNG hai phía, KHÔNG chứa bí mật
   │  ├─ types/               kiểu và DTO gửi xuống client
   │  ├─ schemas/             Zod (validate dùng cả client và server)
   │  └─ constants/           hằng số (dạng câu hỏi, vai trò, trạng thái...)
   │
   └─ messages/               vi.json, en.json (dùng cho giao diện và email)
```

Alias import: `@/frontend/*`, `@/backend/*`, `@/shared/*`, `@/messages/*`.

### Ranh giới frontend / backend (bắt buộc)

1. **`frontend/` không import từ `backend/`.** Chỉ `src/app/` (page, layout, route handler) được import `backend/services`, lấy dữ liệu rồi truyền xuống component frontend bằng props đã lọc.
2. **`backend/` không import từ `frontend/`.** Mọi file trong `backend/` bắt đầu bằng `import "server-only"` để build lỗi nếu lỡ kéo xuống trình duyệt.
3. **`shared/` chỉ chứa kiểu, schema Zod, hằng số.** Không import gì từ `frontend/` hay `backend/`, không chứa khóa bí mật, không chứa logic nghiệp vụ.
4. **`src/app/` giữ mỏng.** Trang và layout chỉ ghép component và gọi service. Route handler làm đúng bốn việc: đọc và validate đầu vào (Zod) → kiểm tra quyền → gọi một service → trả kết quả. Không viết nghiệp vụ ở đây.
5. **Nghiệp vụ nằm ở `backend/services` và `backend/lib`**: chấm điểm, tính giờ, kiểm tra quyền, truy vấn DB. Hàm chấm điểm và tính giờ viết thuần (không đụng DB) để dễ test.
6. **Kiểu dữ liệu gửi xuống client định nghĩa ở `shared/types`, tách riêng khi có đáp án**: ví dụ `QuestionForAttempt` (không có đáp án đúng) và `QuestionWithAnswer` (chỉ dùng sau khi nộp). Không tái sử dụng kiểu có đáp án để gửi cho client.
7. Khi dựng khung dự án, thêm quy tắc ESLint (`no-restricted-imports` hoặc `eslint-plugin-boundaries`) để **tự động chặn** các vi phạm 1-3, không chỉ dựa vào việc nhớ.

Khi không chắc một file thuộc đâu: nếu chạm DB, khóa bí mật hoặc kiểm tra quyền thì là `backend/`; nếu chỉ vẽ giao diện hoặc xử lý sự kiện trên trình duyệt thì là `frontend/`; nếu cả hai cùng cần và không có bí mật thì là `shared/`.

## Lệnh

```
npm run dev        chạy local
npm run build      build production
npm run lint       kiểm tra lint
npm run typecheck  kiểm tra TypeScript
npm test           chạy test
npx prisma migrate dev   tạo và áp migration
```

Cập nhật danh sách này khi lệnh thay đổi.

## Quy ước code

- Tên biến, hàm, file, bảng, cột dùng **tiếng Anh**. File dùng `kebab-case`, component dùng `PascalCase`.
- Không dùng `any`. Bật `strict`. Kiểu dữ liệu chung đặt ở một nơi, không lặp.
- Mặc định dùng Server Component; chỉ thêm `"use client"` khi cần tương tác.
- Validate mọi dữ liệu đầu vào ở server bằng Zod, không tin dữ liệu từ client.
- Lỗi trả về có mã rõ ràng, thông báo hiển thị cho người dùng lấy từ file dịch.
- Commit theo Conventional Commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`.
- Không để code chết, `console.log` gỡ lỗi hay `TODO` không có ngữ cảnh khi kết thúc một nhiệm vụ.

## Quy tắc nghiệp vụ và bảo mật (bắt buộc)

1. **Không bao giờ trả `correct_answer` hoặc `accepted_answers` về trình duyệt khi đang làm bài.** Chỉ trả sau khi bài đã nộp. Áp dụng cả cho props của Server Component truyền xuống Client Component.
2. **Tính giờ theo server.** Lưu `started_at` và `deadline_at` khi bắt đầu thi thử. Đồng hồ ở trình duyệt chỉ để hiển thị. Nộp bài sau `deadline_at` (cộng dung sai ngắn) thì server tự chốt bài với những câu đã lưu.
3. **Lưu đáp án liên tục** trong lúc thi; tải lại trang phải khôi phục đáp án và thời gian còn lại đúng.
4. **Kiểm tra quyền ở server** cho mọi API và server action. Không dựa vào việc ẩn nút ở giao diện. Mọi thứ dưới `/admin` chỉ cho vai trò admin.
5. Mật khẩu chỉ lưu dạng băm (argon2 hoặc bcrypt). Không lưu, không log mật khẩu, token, dữ liệu cá nhân không cần thiết.
6. Khóa bí mật (API key, chuỗi kết nối DB) chỉ nằm trong biến môi trường `.env`, không commit, không đưa xuống client. Có `.env.example` không chứa giá trị thật.
7. Có rate limit cho đăng nhập, đăng ký, quên mật khẩu.
8. Upload file: kiểm tra loại và dung lượng, không thực thi file upload.
9. **Trang tra cứu điểm chỉ nhúng giao diện `kqt.cfi.humg.edu.vn`** (iframe, có nút mở tab mới dự phòng). Không gọi API, không thu thập, không lưu, không log dữ liệu điểm. Không thử vượt cơ chế chặn nhúng nếu có.
10. Điểm phần Writing chưa được quy định chấm thế nào trong `docs/PRD.md` (mục 13). Đừng tự cộng vào tổng điểm; hỏi người dùng.

## Quy tắc giao diện

- Khi làm hoặc sửa giao diện, dùng skill `frontend-design` (trong `.agents/skills/`) cho bố cục, chữ, chi tiết hoàn thiện.
- **`docs/DESIGN.md` luôn thắng skill** về màu, font, token, và độ gọn. Skill chỉ quyết định cách sắp xếp và tinh chỉnh bên trong khuôn khổ đó.
- Màn hình làm bài và mọi chỗ đọc đề: ưu tiên dễ đọc hơn phong cách. Không dùng hiệu ứng nổi bật hay bố cục thử nghiệm.
- Chi tiết ở `docs/DESIGN.md`. Tóm tắt: **chỉ dùng token màu/khoảng cách/bo góc**, không hard-code mã màu trong component.
- Mọi màn hình phải đúng ở **cả theme sáng và tối** và **cả hai ngôn ngữ**. Không hard-code chữ hiển thị, luôn qua `messages/vi.json` và `messages/en.json`. Thêm khóa vào cả hai file cùng lúc.
- Kiểm tra ba kích thước: mobile (~375px), tablet (~768px), desktop (~1280px).
- Vùng bấm tối thiểu 44px, chữ tối thiểu 16px trên mobile, có trạng thái focus nhìn thấy được, dùng được bằng bàn phím.
- Ảnh trang đề nền trắng luôn đặt trong khung sáng, kể cả dark mode. Không đảo màu ảnh.
- Trang tham khảo `humgenglish.site` chỉ để tham khảo **bố cục và luồng dùng**. Không sao chép màu, logo, câu chữ, hay nội dung đề của họ.


## Language & Documentation Conventions

### Commit messages

* Commit message phải viết bằng **tiếng Việt**.
* Giữ nguyên prefix theo Conventional Commits:

  * `feat:` — thêm chức năng
  * `fix:` — sửa lỗi
  * `refactor:` — tái cấu trúc code
  * `docs:` — cập nhật tài liệu
  * `chore:` — công việc cấu hình, dependency, tooling
  * `test:` — thêm hoặc cập nhật test
* Nội dung commit ngắn gọn, rõ ràng, viết bằng tiếng Việt.
* Không viết hoa chữ cái đầu và không đặt dấu chấm ở cuối commit message.
* Ví dụ:

  * `feat: thêm chức năng đăng nhập`
  * `feat: thêm tìm kiếm từ vựng`
  * `fix: sửa lỗi hiển thị danh sách bài học`
  * `refactor: tách logic xử lý bài kiểm tra`
  * `docs: cập nhật tài liệu api`

### Code comments

* Các comment trong code phải viết bằng **tiếng Việt**.
* Chỉ thêm comment khi comment giúp giải thích mục đích, logic hoặc lý do của đoạn code.
* Không thêm comment cho những đoạn code đơn giản, tự giải thích được.
* Comment phải ngắn gọn, tự nhiên và tập trung vào **tại sao** hoặc **mục đích**, không chỉ mô tả lại code.
* Các function có logic quan trọng nên có comment tiếng Việt giải thích mục đích của function.
* Không sử dụng comment tiếng Anh nếu có thể diễn đạt rõ ràng bằng tiếng Việt.

Ví dụ:

```ts
// Lấy danh sách từ vựng theo cấp độ và chủ đề
async function getVocabulary(level: string, topic: string) {
  ...
}
```

```ts
// Giữ lại kết quả cũ trong lúc gọi API để giao diện không bị nhấp nháy
const { data } = useQuery({
  ...
});
```

```ts
// Kiểm tra thời gian hết hạn trước khi cho phép người dùng bắt đầu bài thi
function canStartExam(exam: Exam) {
  ...
}
```

### Language rule

* Tên biến, tên function, tên class, type, interface và các identifier trong code vẫn sử dụng **tiếng Anh** theo convention của dự án.
* Chỉ commit message và comment trong code sử dụng tiếng Việt.
* Không dịch các thuật ngữ kỹ thuật, API, library hoặc framework name nếu việc dịch làm giảm tính rõ ràng.


## Nội dung và bản quyền

- Không tự sinh nội dung đề Cambridge KET hoặc chép nguyên đề từ Studocu vào dữ liệu. Dùng dữ liệu mẫu do mình tự viết để phát triển và kiểm thử.
- Dữ liệu seed chỉ là ví dụ giả, ghi rõ là dữ liệu mẫu.

## Cách làm việc với agent

1. **Lập kế hoạch trước, chưa code.** Với việc lớn hơn một trang hoặc một bảng, đưa kế hoạch các bước nhỏ để người dùng duyệt.
2. **Mỗi lần một lát nhỏ chạy được** (một trang, một API, một bảng), rồi dừng để người dùng kiểm tra.
3. **Hỏi trước khi** thêm thư viện mới, đổi cấu trúc thư mục, đổi schema DB đã có dữ liệu, hoặc đụng file ngoài phạm vi nhiệm vụ.
4. Không sửa `docs/PRD.md`, `docs/DESIGN.md`, `docs/PAGES.md` trừ khi được yêu cầu. Nếu thấy tài liệu thiếu hoặc sai, nêu ra và đề xuất chỉnh.
5. Khi gặp lỗi: đọc kỹ thông báo, tìm nguyên nhân gốc, không vá chồng vá. Nếu sửa 2 lần vẫn lỗi, dừng lại và báo cáo những gì đã thử.
6. Cuối mỗi nhiệm vụ, tóm tắt ngắn: đã đổi gì, file nào, cách kiểm tra, điều còn dang dở.

## Quy trình cho việc lớn
Với một tính năng cả trang hoặc nhiều file: dùng Superpowers theo thứ tự brainstorm → lập kế hoạch → thực thi. Việc nhỏ (sửa chữ, chỉnh style, sửa lỗi nhỏ) làm thẳng, không cần cả quy trình.
Quy tắc trong `AGENTS.md` và `docs/` luôn thắng khi mâu thuẫn với quy trình của Superpowers.

## Định nghĩa "xong" cho một nhiệm vụ

- [ ] Chạy được, không lỗi console
- [ ] `npm run lint` và `npm run typecheck` sạch; test liên quan đã viết và đạt
- [ ] Đúng ở theme sáng/tối, tiếng Việt/tiếng Anh, 3 kích thước màn hình
- [ ] Có các trạng thái: đang tải, rỗng, lỗi (theo `docs/PAGES.md`)
- [ ] Không lộ đáp án đúng, không hard-code chữ hay màu
- [ ] Đã commit theo Conventional Commits
