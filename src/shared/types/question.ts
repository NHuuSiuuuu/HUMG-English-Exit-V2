// Định nghĩa các dạng câu hỏi chuẩn Cambridge KET A2 theo PRD.md và PAGES.md

export type QuestionType =
  | "match_pool"    // Part 1 Biển báo, Part 11 Nghe nối lý do (Ghép với kho đáp án A-H)
  | "mcq3"          // Part 2 Từ vựng, Part 3 Hội thoại, Part 4 Đọc hiểu (A/B/C hoặc Right/Wrong/Doesn't say)
  | "mcq3_image"    // Part 10 Listening 1 (3 tranh A/B/C)
  | "cloze_mcq"     // Part 5 Điền đoạn văn khuyết 8 chỗ (A/B/C)
  | "short_text"    // Part 6 Đoán từ, Part 7 Điền từ, Part 8 Điền form, Part 13-14 Nghe điền thông tin
  | "writing";      // Part 9 Viết note 25-35 từ

export interface MatchPoolOption {
  letter: string; // "A", "B", ... "H"
  title?: string; // Ví dụ: "NOTICE"
  text: string;   // Nội dung trên biển báo hoặc lý do
}

export interface QuestionItemDef {
  id: string;
  orderNumber: number;
  prompt: string;               // Câu hỏi hoặc câu mô tả
  prefix?: string;              // Ví dụ "36. "
  firstLetterHint?: string;     // Dành cho Part 6: chữ cái đầu (ví dụ "u")
  charCountHint?: number;       // Dành cho Part 6: tổng số ký tự (ví dụ 8)
  formFieldLabel?: string;      // Dành cho Part 8, 13, 14: nhãn ô biểu mẫu (ví dụ "Name of film:", "Price:")
  options?: {                   // Dành cho trắc nghiệm A/B/C hoặc MCQ3
    label: string;              // "A", "B", "C" hoặc "Right", "Wrong", "Doesn't say"
    text: string;               // Văn bản lựa chọn
    imageUrl?: string;          // Dành cho mcq3_image (Part 10)
  }[];
}

export interface QuestionGroupDef {
  id: string;
  type: QuestionType;
  title: string;                 // Tiêu đề phần (ví dụ "Questions 1–5")
  instruction: string;           // Hướng dẫn làm bài
  passageText?: string;          // Bài đọc hoặc đoạn văn khuyết (Part 4, 5, 7, 8)
  passageImageUrl?: string;      // Đường dẫn ảnh bài đọc (nếu có)
  example?: {                    // Dòng ví dụ (câu 0) luôn có dấu ✓
    question: string;
    correctAnswer: string;
    explanation: string;
  };
  poolOptions?: MatchPoolOption[]; // Dành cho dạng match_pool (8 lựa chọn A–H)
  audioUrl?: string;             // Dành cho Listening (Part 10–14)
  transcript?: string;           // Lời thoại audio hiển thị sau khi nộp
  writingRequirements?: string[]; // Dành cho Part 9: 3 ý cần nêu
  minWords?: number;             // Part 9: tối thiểu (25 từ)
  maxWords?: number;             // Part 9: tối đa (35 từ)
  sampleWriting?: string;        // Part 9: bài mẫu
  items: QuestionItemDef[];
}
