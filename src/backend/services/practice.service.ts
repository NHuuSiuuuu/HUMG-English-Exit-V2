import "server-only";

import type {
  PracticePartSummary,
  PracticeItemSummary,
  PracticeItemDetail,
  PracticeGradeResult,
  QuestionGradingDetail,
} from "@/shared/types/practice";
import { MOCK_PRACTICE_ITEMS } from "@/shared/constants/mock-practice-data";
import { scoreShortText, countWords } from "@/backend/lib/text-scoring";

// Danh mục chuẩn 14 Part của bài thi Cambridge KET A2 theo PRD.md
const KET_PARTS_METADATA: PracticePartSummary[] = [
  // Kỹ năng Reading & Writing (Part 1 - 9)
  {
    partNo: 1,
    skill: "reading_writing",
    titleVi: "Part 1 — Biển báo, thông báo",
    titleEn: "Part 1 — Matching Signs & Notices",
    descriptionVi: "Nối 5 câu mô tả với 8 biển báo/thông báo ngắn (A–H). Kiểm tra kỹ năng đọc hiểu biển chỉ dẫn thực tế.",
    questionType: "match_pool",
    totalItems: 12,
    completedItems: 4,
    progressPercent: 33,
    averageScorePercent: 85,
  },
  {
    partNo: 2,
    skill: "reading_writing",
    titleVi: "Part 2 — Từ vựng theo ngữ cảnh",
    titleEn: "Part 2 — Contextual Vocabulary",
    descriptionVi: "Chọn 1 trong 3 từ (A/B/C) để hoàn thành câu mô tả về một chủ đề quen thuộc hàng ngày.",
    questionType: "mcq3",
    totalItems: 15,
    completedItems: 6,
    progressPercent: 40,
    averageScorePercent: 80,
  },
  {
    partNo: 3,
    skill: "reading_writing",
    titleVi: "Part 3 — Hội thoại giao tiếp",
    titleEn: "Part 3 — Conversational English",
    descriptionVi: "Phản xạ giao tiếp tình huống hàng ngày: trắc nghiệm A/B/C và ghép hoàn thành đoạn hội thoại 5 lượt lời.",
    questionType: "mcq3",
    totalItems: 14,
    completedItems: 2,
    progressPercent: 14,
    averageScorePercent: 70,
  },
  {
    partNo: 4,
    skill: "reading_writing",
    titleVi: "Part 4 — Đọc hiểu văn bản dài",
    titleEn: "Part 4 — Reading Comprehension",
    descriptionVi: "Đọc bài báo hoặc bài tường thuật ngắn (200-250 từ). Chọn Right/Wrong/Doesn't say hoặc A/B/C.",
    questionType: "mcq3",
    totalItems: 10,
    completedItems: 3,
    progressPercent: 30,
    averageScorePercent: 75,
  },
  {
    partNo: 5,
    skill: "reading_writing",
    titleVi: "Part 5 — Điền đoạn văn khuyết",
    titleEn: "Part 5 — Multiple Choice Cloze",
    descriptionVi: "Đọc đoạn văn ngắn bị khuyết 8 chỗ và chọn từ đúng trong 3 phương án A/B/C về ngữ pháp và từ loại.",
    questionType: "cloze_mcq",
    totalItems: 12,
    completedItems: 1,
    progressPercent: 8,
    averageScorePercent: 65,
  },
  {
    partNo: 6,
    skill: "reading_writing",
    titleVi: "Part 6 — Đoán từ vựng qua định nghĩa",
    titleEn: "Part 6 — Word Definition Spelling",
    descriptionVi: "Đọc 5 câu định nghĩa đồ vật/khái niệm. Viết từ đúng dựa vào chữ cái đầu và số gạch dưới cho trước.",
    questionType: "short_text",
    totalItems: 16,
    completedItems: 8,
    progressPercent: 50,
    averageScorePercent: 90,
  },
  {
    partNo: 7,
    skill: "reading_writing",
    titleVi: "Part 7 — Điền từ tự do vào chỗ trống",
    titleEn: "Part 7 — Open Cloze",
    descriptionVi: "Điền 1 từ thích hợp duy nhất vào mỗi chỗ trống trong bức thư hoặc ghi chú ngắn (chủ yếu là giới từ, mạo từ).",
    questionType: "short_text",
    totalItems: 10,
    completedItems: 0,
    progressPercent: 0,
  },
  {
    partNo: 8,
    skill: "reading_writing",
    titleVi: "Part 8 — Đọc tổng hợp và điền biểu mẫu",
    titleEn: "Part 8 — Information Transfer",
    descriptionVi: "Đọc hai mẩu văn bản ngắn (quảng cáo, ghi chú) và trích xuất thông tin để điền vào 5 ô trong phiếu ghi nhớ.",
    questionType: "short_text",
    totalItems: 8,
    completedItems: 2,
    progressPercent: 25,
    averageScorePercent: 85,
  },
  {
    partNo: 9,
    skill: "reading_writing",
    titleVi: "Part 9 — Viết ghi chú hoặc tin nhắn ngắn",
    titleEn: "Part 9 — Guided Short Message Writing",
    descriptionVi: "Viết ghi chú từ 25 đến 35 từ gửi cho bạn bè theo 3 gợi ý bắt buộc của đề bài. Nhận gợi ý và bài mẫu đối chiếu.",
    questionType: "writing",
    totalItems: 10,
    completedItems: 5,
    progressPercent: 50,
    averageScorePercent: 85,
  },

  // Kỹ năng Listening (Part 10 - 14)
  {
    partNo: 10,
    skill: "listening",
    titleVi: "Part 10 — Nghe chọn 1 trong 3 bức tranh",
    titleEn: "Part 10 — Short Dialogues (Pictures)",
    descriptionVi: "Nghe 5 đoạn hội thoại ngắn đời sống. Mỗi câu chọn 1 trong 3 bức tranh A/B/C thể hiện thông tin được nhắc đến.",
    questionType: "mcq3_image",
    totalItems: 10,
    completedItems: 5,
    progressPercent: 50,
    averageScorePercent: 95,
  },
  {
    partNo: 11,
    skill: "listening",
    titleVi: "Part 11 — Nghe nối thông tin",
    titleEn: "Part 11 — Longer Monologue Matching",
    descriptionVi: "Nghe một đoạn độc thoại hoặc trao đổi dài hơn. Nối 5 đối tượng (người/ngày/địa điểm) với 8 đặc điểm (A–H).",
    questionType: "match_pool",
    totalItems: 10,
    completedItems: 2,
    progressPercent: 20,
    averageScorePercent: 70,
  },
  {
    partNo: 12,
    skill: "listening",
    titleVi: "Part 12 — Nghe hội thoại trắc nghiệm",
    titleEn: "Part 12 — Dialogue Multiple Choice",
    descriptionVi: "Nghe một cuộc trò chuyện giữa hai người (đặt phòng, hỏi đường...) và chọn phương án A, B hoặc C cho 5 câu hỏi.",
    questionType: "mcq3",
    totalItems: 10,
    completedItems: 1,
    progressPercent: 10,
    averageScorePercent: 60,
  },
  {
    partNo: 13,
    skill: "listening",
    titleVi: "Part 13 — Nghe điền phiếu thông tin",
    titleEn: "Part 13 — Note Taking Monologue",
    descriptionVi: "Nghe một người thông báo và ghi lại 5 mẩu thông tin ngắn (tên, số điện thoại, giờ giấc, chi phí) vào phiếu.",
    questionType: "short_text",
    totalItems: 10,
    completedItems: 3,
    progressPercent: 30,
    averageScorePercent: 80,
  },
  {
    partNo: 14,
    skill: "listening",
    titleVi: "Part 14 — Nghe thông báo điền tin nhắn",
    titleEn: "Part 14 — Information Transfer Dialogue",
    descriptionVi: "Nghe một thông điệp hoặc hướng dẫn công cộng và hoàn thành 5 ô còn thiếu trong bản tin nhắn ghi nhớ.",
    questionType: "short_text",
    totalItems: 10,
    completedItems: 2,
    progressPercent: 20,
    averageScorePercent: 75,
  },
];

// Mock database lưu trữ đáp án và lời giải thích phía server (không bao giờ lộ trước khi nộp)
const ANSWER_KEY_DATABASE: Record<
  string,
  {
    answers: Record<string, string | string[]>;
    explanations: Record<string, string>;
  }
> = {
  "p1-bai-1": {
    answers: {
      q1: "D",
      q2: "B",
      q3: "A",
      q4: "H",
      q5: "C",
    },
    explanations: {
      q1: "Biển D ghi: 'Children under 12 must swim with an adult' -> Cần có người lớn đi kèm.",
      q2: "Biển B ghi: 'Trains run every 15 minutes day and night' -> Có thể di chuyển đến sân bay bất kỳ lúc nào cả ngày lẫn đêm.",
      q3: "Biển A ghi: 'No music or loud noise after 10 p.m.' -> Phải giữ yên lặng sau 10 giờ tối.",
      q4: "Biển H ghi: 'Free tea or coffee with every sandwich purchased today' -> Được tặng đồ uống miễn phí khi mua sandwich.",
      q5: "Biển C ghi: 'Please return all books to the front desk before leaving' -> Trả lại sách đã mượn cho nhân viên trước khi rời đi.",
    },
  },
  "p1-bai-2": {
    answers: {
      q1: "B",
      q2: "F",
      q3: "D",
      q4: "G",
      q5: "E",
    },
    explanations: {
      q1: "Biển B ghi: 'Buy tickets online to get 20% discount' -> Mua vé qua mạng rẻ hơn 20%.",
      q2: "Biển F ghi: 'Wear safety glasses and coat at all times inside' -> Cần bảo hộ mắt và quần áo trong phòng thí nghiệm.",
      q3: "Biển D ghi: 'Showers closed for repairs until Friday morning' -> Phòng tắm đóng cửa sửa chữa vài ngày.",
      q4: "Biển G ghi: 'Second-hand course books bought and sold here' -> Mua bán giáo trình cũ đã qua sử dụng.",
      q5: "Biển E ghi: 'Mind the gap between the train and the platform' -> Chú ý bước chân tại khoảng trống giữa tàu và ke ga.",
    },
  },
  "p2-bai-1": {
    answers: {
      q6: "A",
      q7: "B",
      q8: "A",
      q9: "B",
      q10: "C",
    },
    explanations: {
      q6: "Cấu trúc 'decide to + V': Sarah quyết định đi thăm ông bà.",
      q7: "Cụm từ cố định 'pack one's luggage': xếp đồ vào hành lý.",
      q8: "Tính từ đuôi -ed 'feel bored': cảm thấy buồn chán (chỉ cảm xúc người).",
      q9: "Từ 'delicious meal': bữa ăn ngon miệng.",
      q10: "Cụm từ cố định 'take photos' (quá khứ là took): chụp nhiều ảnh.",
    },
  },
  "p4-bai-1": {
    answers: {
      q21: "B",
      q22: "B",
      q23: "A",
      q24: "C",
      q25: "B",
    },
    explanations: {
      q21: "Wrong: Đoạn 1 nêu 'Linh is a third-year... student' (năm 3, không phải năm 2).",
      q22: "Wrong: Đoạn 2 nêu 'Together with two classmates, Linh built...' (cùng với 2 bạn khác, không phải một mình).",
      q23: "Right: Đoạn 2 nêu 'more than 1,200 students use the platform each semester'.",
      q24: "Doesn't say: Bài viết không đề cập đến việc mua laptop cá nhân.",
      q25: "Wrong: Đoạn cuối nêu 'she maintains excellent academic grades' (vẫn đạt điểm xuất sắc, không hề bị sa sút).",
    },
  },
  "p6-bai-1": {
    answers: {
      q36: "calculator",
      q37: "wallet",
      q38: "library",
      q39: "timetable",
      q40: "sweater",
    },
    explanations: {
      q36: "Máy tính cầm tay bỏ túi tính toán nhanh: calculator (10 chữ cái, bắt đầu bằng c).",
      q37: "Ví tiền nhỏ bằng da đựng thẻ và tiền xu: wallet (6 chữ cái, bắt đầu bằng w).",
      q38: "Tòa nhà mượn và đọc sách yên tĩnh: library (7 chữ cái, bắt đầu bằng l).",
      q39: "Thời khóa biểu/lịch trình tàu xe: timetable (9 chữ cái, bắt đầu bằng t).",
      q40: "Áo len ấm mặc bên ngoài: sweater (7 chữ cái, bắt đầu bằng s).",
    },
  },
  "p9-bai-1": {
    answers: {
      q56: "WRITING_TASK",
    },
    explanations: {
      q56: "Bài viết cần đạt từ 25 đến 35 từ, bao gồm đủ 3 ý: thời gian, địa điểm, sách/tài liệu cần mang theo.",
    },
  },
  "p10-bai-1": {
    answers: {
      q1_lis: "B",
      q2_lis: "A",
    },
    explanations: {
      q1_lis: "Transcript: 'today the professor moved it to half past nine' (9:30 AM).",
      q2_lis: "Transcript: 'it is on sale today for only eighteen pounds fifty' (£18.50).",
    },
  },
};

/**
 * Lấy danh sách tổng hợp 14 Part kèm số lượng bài và tiến độ hoàn thành
 */
export async function getPartSummaryList(): Promise<PracticePartSummary[]> {
  return KET_PARTS_METADATA;
}

/**
 * Lấy thông tin tóm tắt của 1 Part cụ thể
 */
export async function getPartSummary(partNo: number): Promise<PracticePartSummary | null> {
  const found = KET_PARTS_METADATA.find((p) => p.partNo === partNo);
  return found || null;
}

/**
 * Lấy danh sách các bài luyện tập của 1 Part, hỗ trợ tìm kiếm và lọc
 */
export async function getPartItems(
  partNo: number,
  options?: { groupSet?: string; query?: string; status?: "all" | "completed" | "uncompleted" }
): Promise<PracticeItemSummary[]> {
  // Lấy các bài mẫu của part này
  let items = MOCK_PRACTICE_ITEMS.filter((item) => item.partNo === partNo);

  // Nếu part chưa có bài mẫu đầy đủ, sinh bài mẫu phái sinh để sinh viên luôn có dữ liệu luyện tập
  if (items.length === 0) {
    const partMeta = await getPartSummary(partNo);
    const title = partMeta ? partMeta.titleVi : `Part ${partNo}`;
    return [
      {
        id: `p${partNo}-bai-1`,
        partNo,
        skill: partNo <= 9 ? "reading_writing" : "listening",
        title: `${title} — Bài luyện 01`,
        sourceLabel: "KET 5 · Test 1",
        groupSet: "KET 5",
        isCompleted: false,
        totalQuestions: 5,
      },
      {
        id: `p${partNo}-bai-2`,
        partNo,
        skill: partNo <= 9 ? "reading_writing" : "listening",
        title: `${title} — Bài luyện 02`,
        sourceLabel: "KET 2 · Test 1",
        groupSet: "KET 2",
        isCompleted: true,
        bestScore: 80,
        totalQuestions: 5,
      },
    ];
  }

  // Chuyển đổi thành PracticeItemSummary
  let summaries: PracticeItemSummary[] = items.map((item, index) => ({
    id: item.id,
    partNo: item.partNo,
    skill: item.skill,
    title: item.title,
    sourceLabel: item.sourceLabel,
    groupSet: item.groupSet,
    isCompleted: index % 2 === 0, // Mock: bài chẵn đã hoàn thành
    bestScore: index % 2 === 0 ? 80 : undefined,
    totalQuestions: item.questionGroup.items.length,
  }));

  // Áp dụng bộ lọc
  if (options?.groupSet && options.groupSet !== "Tất cả") {
    summaries = summaries.filter((s) => s.groupSet === options.groupSet);
  }
  if (options?.query && options.query.trim().length > 0) {
    const q = options.query.toLowerCase().trim();
    summaries = summaries.filter(
      (s) => s.title.toLowerCase().includes(q) || s.sourceLabel.toLowerCase().includes(q)
    );
  }
  if (options?.status === "completed") {
    summaries = summaries.filter((s) => s.isCompleted);
  } else if (options?.status === "uncompleted") {
    summaries = summaries.filter((s) => !s.isCompleted);
  }

  return summaries;
}

/**
 * Lấy chi tiết bài luyện để thí sinh làm bài
 * QUY TẮC BẢO MẬT TUYỆT ĐỐI (AGENTS.md):
 * Tuyệt đối không trả về `correctAnswer`, `transcript` hay `explanation` khi thí sinh chưa nộp bài!
 */
export async function getPracticeItemDetail(itemId: string): Promise<PracticeItemDetail | null> {
  const item = MOCK_PRACTICE_ITEMS.find((it) => it.id === itemId);
  if (!item) {
    // Nếu chưa có bài thật, fallback sang bài mẫu theo part
    const fallbackItem = MOCK_PRACTICE_ITEMS[0];
    return {
      ...fallbackItem,
      id: itemId,
      title: `Bài luyện ${itemId}`,
    };
  }

  // Clone an toàn, loại bỏ transcript và lời giải nếu có trước khi gửi xuống client
  const safeGroup = {
    ...item.questionGroup,
    transcript: undefined, // Không trả transcript audio khi chưa nộp bài
    sampleWriting: undefined, // Không trả bài mẫu viết khi chưa nộp bài
  };

  return {
    ...item,
    questionGroup: safeGroup,
  };
}

/**
 * Chấm điểm bài làm luyện tập và trả về kết quả kèm đáp án chuẩn và lời giải thích chi tiết
 */
export async function gradePracticeItem(
  itemId: string,
  answers: Record<string, string>
): Promise<PracticeGradeResult> {
  const item = MOCK_PRACTICE_ITEMS.find((it) => it.id === itemId) || MOCK_PRACTICE_ITEMS[0];
  const group = item.questionGroup;
  const keyData = ANSWER_KEY_DATABASE[itemId] || ANSWER_KEY_DATABASE["p1-bai-1"];

  const details: QuestionGradingDetail[] = [];
  let correctCount = 0;

  // Xử lý từng câu hỏi
  for (const question of group.items) {
    const userAnswer = answers[question.id] || "";
    const correctKey = keyData.answers[question.id] || "A";
    const explanation =
      keyData.explanations[question.id] || "Đối chiếu với nội dung đề bài để xác định đáp án đúng.";

    let isCorrect = false;

    if (group.type === "writing") {
      // Đối với Part 9 Writing: Đánh giá theo độ dài từ 25-35 từ
      const words = countWords(userAnswer);
      isCorrect = words >= 25 && words <= 35;
    } else if (group.type === "short_text") {
      // Đối với dạng điền từ ngắn: So khớp không phân biệt hoa thường và chấp nhận từ đồng nghĩa
      isCorrect = scoreShortText(userAnswer, correctKey);
    } else {
      // Dạng trắc nghiệm hoặc match_pool: So khớp trực tiếp mã chữ cái
      isCorrect = userAnswer.trim().toUpperCase() === String(correctKey).trim().toUpperCase();
    }

    if (isCorrect) {
      correctCount++;
    }

    details.push({
      questionId: question.id,
      userAnswer,
      correctAnswer: correctKey,
      isCorrect,
      explanation,
    });
  }

  const totalQuestions = group.items.length;
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return {
    itemId,
    totalQuestions,
    correctCount,
    scorePercent,
    details,
    transcript: group.transcript,
    sampleWriting: group.sampleWriting,
  };
}
