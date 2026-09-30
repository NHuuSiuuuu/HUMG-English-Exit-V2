import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sampleArticles = [
  {
    slug: "tong-hop-quy-dinh-chuan-dau-ra-ngoai-ngu-humg",
    title: "Tổng hợp toàn bộ quy định Chuẩn đầu ra Ngoại ngữ HUMG mới nhất",
    excerpt: "Hướng dẫn chi tiết về các chứng chỉ tương đương, thang điểm KET B1 và các đợt thi chuẩn đầu ra tiếng Anh tại Đại học Mỏ - Địa chất.",
    content: `## 1. Quy định chung về Chuẩn đầu ra Ngoại ngữ
Theo thông báo mới nhất từ Trung tâm Ngoại ngữ - Tin học (CFI) và Phòng Đào tạo Đại học Mỏ - Địa chất, toàn bộ sinh viên hệ chính quy cần đạt chuẩn đầu ra ngoại ngữ trước khi xét tốt nghiệp.

### Các chứng chỉ được công nhận tương đương:
- **Cambridge KET (Key English Test)**: Đạt mức từ 120 điểm trở lên (tương đương B1 CEFR theo chuẩn trường).
- **TOEIC**: Đạt từ 450 điểm (hai kỹ năng Nghe - Đọc).
- **IELTS**: Đạt từ 4.0 trở lên.
- **VSTEP**: Bậc 3 theo Khung năng lực ngoại ngữ 6 bậc dùng cho Việt Nam.

> **Lưu ý quan trọng:** Chứng chỉ ngoại ngữ phải còn trong thời hạn 02 năm tính đến thời điểm nộp hồ sơ xét chuẩn đầu ra tốt nghiệp.

## 2. Lịch thi và hồ sơ đăng ký tại CFI
Sinh viên theo dõi lịch thi thử và thi chính thức được cập nhật định kỳ hàng tháng trên trang web chính thức của CFI hoặc mục Tra cứu trên hệ thống này.`,
    coverImageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80",
    category: "Quy định & Lịch thi HUMG",
    tags: ["quy-định", "chuẩn-đầu-ra", "humg", "ket-b1"],
    authorName: "Ban Quản trị HUMG",
    status: "PUBLISHED",
    viewsCount: 1840,
    publishedAt: new Date("2026-09-28T08:30:00Z"),
  },
  {
    slug: "chien-thuat-lam-9-phan-reading-writing-ket",
    title: "Chiến thuật làm 9 Phần Reading & Writing không bị thiếu thời gian",
    excerpt: "Phương pháp phân bổ 60 phút làm bài thi Reading & Writing Cambridge KET hiệu quả, tránh bẫy và tối đa hóa điểm số.",
    content: `## 1. Phân bổ thời gian 60 phút thông minh
Bài thi Reading & Writing KET gồm 9 phần với tổng cộng 56 câu hỏi trong đúng 60 phút.

### Khung thời gian gợi ý cho từng phần:
- **Part 1 (Nối biển báo & thông báo)**: 5 - 6 phút.
- **Part 2 (Điền từ vào câu ngữ cảnh)**: 4 - 5 phút.
- **Part 3 (Hội thoại giao tiếp)**: 6 - 7 phút.
- **Part 4 (Đọc hiểu đoạn văn dài)**: 8 - 10 phút.
- **Part 5 (Điền từ vào đoạn văn ngữ pháp)**: 6 - 7 phút.
- **Part 6 (Đoán từ vựng theo gợi ý ký tự)**: 5 - 6 phút.
- **Part 7 (Điền từ vào đoạn thư email)**: 7 - 8 phút.
- **Part 8 (Điền thông tin vào phiếu/form)**: 6 - 7 phút.
- **Part 9 (Viết tin nhắn/email ngắn 25-35 từ)**: 10 - 12 phút.

> **Mẹo làm bài:** Luôn dành ra ít nhất 3 phút cuối giờ để kiểm tra lại phiếu trả lời, soát lỗi chính tả ở các câu Part 6, 7, 8 và Part 9 Writing.`,
    coverImageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80",
    category: "Kỹ năng Reading & Writing",
    tags: ["reading", "writing", "chiến-thuật", "cambridge-ket"],
    authorName: "Thầy Cô Bộ Môn Tiếng Anh",
    status: "PUBLISHED",
    viewsCount: 1220,
    publishedAt: new Date("2026-09-24T14:15:00Z"),
  },
  {
    slug: "bi-quyet-chinh-phuc-part-10-ket-nghe-chon-tranh",
    title: "Bí quyết chinh phục 5 câu nghe chọn tranh Part 10 Cambridge KET",
    excerpt: "Kỹ năng đọc trước câu hỏi, phân tích điểm khác nhau giữa 3 bức tranh A/B/C và tránh bẫy gây nhiễu trong phòng thi.",
    content: `## 1. Đặc điểm của Part 10 (Listening Part 1)
Đây là phần mở đầu của bài thi Nghe KET với 5 câu hỏi trắc nghiệm qua tranh vẽ minh họa. Mỗi câu hỏi gồm 3 hình vẽ A, B, C miêu tả thời gian, địa điểm, đồ vật, giá tiền hoặc thời tiết.

### Quy trình 3 bước xử lý:
1. **Bước 1 (Đọc trước 10 giây)**: Đọc nhanh câu hỏi và tìm từ khóa (Ai? Ở đâu? Lúc mấy giờ?).
2. **Bước 2 (Tìm điểm khác biệt giữa 3 tranh)**: Xác định rõ sự khác nhau giữa hình A, B và C trước khi nghe băng phát.
3. **Bước 3 (Bẫy thường gặp)**: Băng thường nhắc đến cả 3 bức tranh để gây nhiễu, nhưng chỉ có một bức tranh trả lời đúng câu hỏi chính.

> **Ví dụ:** Nếu người nói đổi ý: "I planned to buy the shirt, but I finally chose the jacket", đáp án phải là jacket chứ không phải shirt!`,
    coverImageUrl: "https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=1200&auto=format&fit=crop&q=80",
    category: "Kỹ năng Listening",
    tags: ["listening", "part-10", "chọn-tranh", "mẹo-nghe"],
    authorName: "Ban Quản trị HUMG",
    status: "PUBLISHED",
    viewsCount: 950,
    publishedAt: new Date("2026-09-20T09:00:00Z"),
  },
  {
    slug: "huong-dan-tra-cuu-va-nhan-chung-nhan-ket-qua-thi",
    title: "Hướng dẫn tra cứu kết quả và nhận giấy chứng nhận chuẩn đầu ra",
    excerpt: "Các bước tra cứu điểm trực tuyến qua cổng CFI và thủ tục cấp giấy chứng nhận hoàn thành chuẩn đầu ra ngoại ngữ.",
    content: `## Bản nháp hướng dẫn tra cứu
Nội dung đang được ban biên tập hoàn thiện và đối soát cùng phòng Đào tạo CFI trước khi chính thức công bố tới toàn thể sinh viên HUMG.`,
    coverImageUrl: null,
    category: "Thông báo chung",
    tags: ["tra-cứu", "chứng-nhận"],
    authorName: "Ban Quản trị HUMG",
    status: "DRAFT",
    viewsCount: 0,
    publishedAt: null,
  },
];

async function main() {
  console.log("Đang kiểm tra bảng Article...");
  const count = await prisma.article.count();
  console.log(`Số bài viết hiện tại: ${count}`);

  if (count === 0) {
    console.log("Bảng Article trống. Bắt đầu seed bài viết mẫu...");
    for (const art of sampleArticles) {
      await prisma.article.create({
        data: art,
      });
      console.log(`+ Đã tạo bài viết: ${art.title}`);
    }
    console.log("Seed bài viết mẫu hoàn tất!");
  } else {
    console.log("Bảng Article đã có dữ liệu, bỏ qua seed.");
  }
}

main()
  .catch((e) => {
    console.error("Lỗi seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
