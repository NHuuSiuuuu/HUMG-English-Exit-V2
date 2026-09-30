import "server-only";

export interface ArticleSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readTimeMinutes: number;
}

// Service quản lý bài viết trên server theo AGENTS.md
export class ArticleService {
  static async getLatestArticles(limit: number = 3): Promise<ArticleSummary[]> {
    // Trả về dữ liệu mẫu phát triển theo quy định bản quyền AGENTS.md
    const sampleData: ArticleSummary[] = [
      {
        id: "1",
        slug: "quy-dinh-chuan-dau-ra-ngoai-ngu-humg-2026",
        title: "Tổng hợp toàn bộ quy định Chuẩn đầu ra Ngoại ngữ HUMG mới nhất",
        excerpt: "Chi tiết các chứng chỉ được công nhận, điểm quy đổi, thời hạn nộp chứng chỉ và các đợt thi đánh giá năng lực tại trường.",
        category: "Quy định & Lịch thi",
        publishedAt: "2026-09-28",
        readTimeMinutes: 5,
      },
      {
        id: "2",
        slug: "meo-lam-reading-writing-ket-a2-dat-diem-cao",
        title: "Chiến thuật làm 9 Phần Reading & Writing không bị thiếu thời gian",
        excerpt: "Cách phân bổ 40 phút cho Reading, 15 phút cho Part 9 và mẹo tránh bẫy các biển báo thông báo trong đề Cambridge KET.",
        category: "Mẹo thi cử",
        publishedAt: "2026-09-24",
        readTimeMinutes: 7,
      },
      {
        id: "3",
        slug: "bi-quyet-nghe-part-10-tranh-hoi-thoai",
        title: "Bí quyết chinh phục 5 câu nghe chọn tranh Part 10 Cambridge KET",
        excerpt: "Nhận biết bẫy gây nhiễu về giờ đồng hồ, giá tiền và hoạt động thường gặp trong các đoạn hội thoại ngắn.",
        category: "Kỹ năng Listening",
        publishedAt: "2026-09-20",
        readTimeMinutes: 6,
      },
    ];

    return sampleData.slice(0, limit);
  }
}
