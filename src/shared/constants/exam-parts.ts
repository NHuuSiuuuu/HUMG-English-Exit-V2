// Hằng số định nghĩa 14 phần thi Cambridge KET (A2 Key) theo PRD.md và PAGES.md

export interface ExamPartDef {
  partNo: number;
  skill: "reading_writing" | "listening";
  titleVi: string;
  titleEn: string;
  questionType: string;
  inputFormat: "choice" | "text" | "essay" | "image_choice";
  questionRange: string;
  totalQuestions: number;
}

export const EXAM_PARTS: ExamPartDef[] = [
  // Khối Reading & Writing (Part 1 - 9)
  {
    partNo: 1,
    skill: "reading_writing",
    titleVi: "Biển báo & Thông báo",
    titleEn: "Notices & Signs",
    questionType: "Nối câu với biển báo (A–H)",
    inputFormat: "choice",
    questionRange: "1–5",
    totalQuestions: 5,
  },
  {
    partNo: 2,
    skill: "reading_writing",
    titleVi: "Từ vựng",
    titleEn: "Vocabulary",
    questionType: "Chọn từ đúng A/B/C điền vào chỗ trống",
    inputFormat: "choice",
    questionRange: "6–10",
    totalQuestions: 5,
  },
  {
    partNo: 3,
    skill: "reading_writing",
    titleVi: "Hội thoại",
    titleEn: "Conversations",
    questionType: "Chọn câu đối đáp phù hợp A/B/C",
    inputFormat: "choice",
    questionRange: "11–15",
    totalQuestions: 5,
  },
  {
    partNo: 4,
    skill: "reading_writing",
    titleVi: "Đọc hiểu",
    titleEn: "Reading Comprehension",
    questionType: "Đọc bài và chọn Right / Wrong / Doesn't say",
    inputFormat: "choice",
    questionRange: "21–27",
    totalQuestions: 7,
  },
  {
    partNo: 5,
    skill: "reading_writing",
    titleVi: "Điền đoạn",
    titleEn: "Cloze Text",
    questionType: "Đoạn văn khuyết 8 chỗ, chọn A/B/C",
    inputFormat: "choice",
    questionRange: "28–35",
    totalQuestions: 8,
  },
  {
    partNo: 6,
    skill: "reading_writing",
    titleVi: "Đoán từ",
    titleEn: "Word Completion",
    questionType: "Định nghĩa từ, cho chữ cái đầu và số ký tự",
    inputFormat: "text",
    questionRange: "36–40",
    totalQuestions: 5,
  },
  {
    partNo: 7,
    skill: "reading_writing",
    titleVi: "Điền từ",
    titleEn: "Open Cloze",
    questionType: "Thư/email khuyết 10 chỗ, viết đúng 1 từ",
    inputFormat: "text",
    questionRange: "41–50",
    totalQuestions: 10,
  },
  {
    partNo: 8,
    skill: "reading_writing",
    titleVi: "Điền form thông tin",
    titleEn: "Information Transfer",
    questionType: "Đọc ghi chú, điền phiếu thông tin",
    inputFormat: "text",
    questionRange: "51–55",
    totalQuestions: 5,
  },
  {
    partNo: 9,
    skill: "reading_writing",
    titleVi: "Viết note ngắn",
    titleEn: "Short Message / Note",
    questionType: "Viết note 25-35 từ trả lời thư theo 3 ý yêu cầu",
    inputFormat: "essay",
    questionRange: "56",
    totalQuestions: 1,
  },

  // Khối Listening (Part 10 - 14)
  {
    partNo: 10,
    skill: "listening",
    titleVi: "Listening 1: Tranh hội thoại",
    titleEn: "Listening 1: Picture Selection",
    questionType: "5 hội thoại ngắn, chọn tranh A/B/C",
    inputFormat: "image_choice",
    questionRange: "1–5",
    totalQuestions: 5,
  },
  {
    partNo: 11,
    skill: "listening",
    titleVi: "Listening 2: Ghép ý",
    titleEn: "Listening 2: Matching",
    questionType: "Ghép sự việc/đồ vật với lý do (A–H)",
    inputFormat: "choice",
    questionRange: "6–10",
    totalQuestions: 5,
  },
  {
    partNo: 12,
    skill: "listening",
    titleVi: "Listening 3: Trắc nghiệm",
    titleEn: "Listening 3: Multiple Choice",
    questionType: "Hội thoại dài, chọn trắc nghiệm A/B/C",
    inputFormat: "choice",
    questionRange: "11–15",
    totalQuestions: 5,
  },
  {
    partNo: 13,
    skill: "listening",
    titleVi: "Listening 4: Điền thông tin",
    titleEn: "Listening 4: Note Taking",
    questionType: "Nghe và điền thông tin (tên, giá, giờ...)",
    inputFormat: "text",
    questionRange: "16–20",
    totalQuestions: 5,
  },
  {
    partNo: 14,
    skill: "listening",
    titleVi: "Listening 5: Điền thông tin chi tiết",
    titleEn: "Listening 5: Detailed Form",
    questionType: "Nghe hội thoại/thông báo và điền thông tin chi tiết",
    inputFormat: "text",
    questionRange: "21–25",
    totalQuestions: 5,
  },
];
