"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Eye,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Headphones,
  BookOpen,
  HelpCircle,
  Volume2,
  FileText,
  Sparkles,
  Loader2,
  Image as ImageIcon,
  Check,
  Info,
} from "lucide-react";
import { EXAM_PARTS, type ExamPartDef } from "@/shared/constants/exam-parts";
import {
  validatePartForPublish,
  KET_PART_QUESTION_COUNTS,
} from "@/shared/schemas/part.schema";
import type {
  CreatePartInput,
  PoolOptionDef,
  QuestionInputItem,
  PartCompletenessIssue,
} from "@/shared/types/part";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { cn } from "@/frontend/lib/utils";

// Lấy QuestionType chuẩn Prisma cho từng PartNo
function getQuestionTypeForPart(partNo: number): CreatePartInput["questionType"] {
  switch (partNo) {
    case 1:
    case 11:
      return "MATCH_POOL";
    case 2:
    case 3:
    case 4:
    case 12:
      return "MCQ3";
    case 5:
      return "CLOZE_MCQ";
    case 6:
    case 7:
    case 8:
    case 13:
    case 14:
      return "SHORT_TEXT";
    case 9:
      return "WRITING";
    case 10:
      return "MCQ3_IMAGE";
    default:
      return "MCQ3";
  }
}

// Khởi tạo danh sách câu hỏi mẫu mặc định phù hợp cho từng Part
function getDefaultQuestionsForPart(partNo: number): QuestionInputItem[] {
  const count = KET_PART_QUESTION_COUNTS[partNo] || 5;

  switch (partNo) {
    case 1: // Biển báo (match_pool)
      return Array.from({ length: count }, (_, i) => ({
        orderNumber: i + 1,
        prompt: `Nội dung mô tả tình huống ${i + 1}...`,
        correctAnswer: ["A", "B", "C", "D", "E"][i] || "A",
        explanation: `Biển báo tương ứng nêu rõ thông tin này.`,
      }));

    case 2: // Từ vựng (MCQ3)
    case 3: // Hội thoại (MCQ3)
    case 12: // Listening MCQ3
      return Array.from({ length: count }, (_, i) => ({
        orderNumber: i + 1,
        prompt: `Nội dung câu hỏi số ${i + 1}...`,
        options: [
          { key: "A", text: "Lựa chọn A" },
          { key: "B", text: "Lựa chọn B" },
          { key: "C", text: "Lựa chọn C" },
        ],
        correctAnswer: "A",
        explanation: `Giải thích vì sao lựa chọn A là đáp án chính xác.`,
      }));

    case 4: // Đọc hiểu Right / Wrong / Doesn't say
      return Array.from({ length: count }, (_, i) => ({
        orderNumber: i + 1,
        prompt: `Ý kiến hoặc nhận định kiểm tra nội dung ${i + 1}...`,
        options: [
          { key: "A", text: "Right" },
          { key: "B", text: "Wrong" },
          { key: "C", text: "Doesn't say" },
        ],
        correctAnswer: "A",
        explanation: `Thông tin trong bài đọc xác nhận nhận định này.`,
      }));

    case 5: // Điền đoạn văn (cloze_mcq: câu 28-35)
      return Array.from({ length: count }, (_, i) => ({
        orderNumber: i + 1,
        prompt: `Chỗ trống [${27 + i + 1}] trong đoạn văn`,
        options: [
          { key: "A", text: "Phương án A" },
          { key: "B", text: "Phương án B" },
          { key: "C", text: "Phương án C" },
        ],
        correctAnswer: "A",
        explanation: `Từ này phù hợp nhất về mặt ngữ pháp và ngữ cảnh.`,
      }));

    case 6: // Đoán từ (cho sẵn chữ cái đầu và số ký tự)
      return [
        {
          orderNumber: 1,
          prompt: "You can carry all your clothes in this when you travel.",
          firstLetterHint: "s",
          charCountHint: 8,
          correctAnswer: "suitcase",
          acceptedAnswers: ["suitcase"],
          explanation: "Vali (suitcase) bắt đầu bằng s và có 8 chữ cái.",
        },
        {
          orderNumber: 2,
          prompt: "People who work in hospitals wear this special clothing.",
          firstLetterHint: "u",
          charCountHint: 7,
          correctAnswer: "uniform",
          acceptedAnswers: ["uniform"],
          explanation: "Đồng phục (uniform) có 7 chữ cái.",
        },
        {
          orderNumber: 3,
          prompt: "You put this on when you feel cold.",
          firstLetterHint: "j",
          charCountHint: 6,
          correctAnswer: "jacket",
          acceptedAnswers: ["jacket", "jumper"],
          explanation: "Áo khoác (jacket).",
        },
        {
          orderNumber: 4,
          prompt: "You wear these on your feet inside your shoes.",
          firstLetterHint: "s",
          charCountHint: 5,
          correctAnswer: "socks",
          acceptedAnswers: ["socks"],
          explanation: "Tất/vớ (socks).",
        },
        {
          orderNumber: 5,
          prompt: "Women often carry their money and keys in this.",
          firstLetterHint: "p",
          charCountHint: 5,
          correctAnswer: "purse",
          acceptedAnswers: ["purse"],
          explanation: "Ví nữ (purse).",
        },
      ];

    case 7: // Điền từ khuyết vào thư/email (10 câu)
      return Array.from({ length: count }, (_, i) => ({
        orderNumber: i + 1,
        prompt: `Chỗ trống [${40 + i + 1}]`,
        correctAnswer: ["for", "in", "to", "with", "at", "on", "is", "are", "have", "been"][i] || "the",
        acceptedAnswers: [["for"], ["in"], ["to"], ["with"], ["at"], ["on"], ["is"], ["are"], ["have"], ["been"]][i] || ["the"],
        explanation: `Giới từ hoặc trợ động từ phù hợp cho chỗ trống này.`,
      }));

    case 8: // Điền biểu mẫu thông tin (form transfer)
    case 13: // Listening điền form 1
    case 14: // Listening điền form 2
      return [
        {
          orderNumber: 1,
          prompt: "Tên hoạt động hoặc địa điểm",
          formFieldLabel: "Destination / Event:",
          correctAnswer: "London Library",
          acceptedAnswers: ["London Library", "the London Library"],
          explanation: "Thông tin xuất hiện ở dòng đầu của tờ thông báo.",
        },
        {
          orderNumber: 2,
          prompt: "Thời gian khởi hành hoặc diễn ra",
          formFieldLabel: "Time / Date:",
          correctAnswer: "9:30 AM",
          acceptedAnswers: ["9:30", "9:30 AM", "9.30 am"],
          explanation: "Thời gian bắt đầu được nêu rõ.",
        },
        {
          orderNumber: 3,
          prompt: "Chi phí hoặc giá vé",
          formFieldLabel: "Price / Cost:",
          correctAnswer: "15 pounds",
          acceptedAnswers: ["15", "15 pounds", "£15"],
          explanation: "Mức giá cho sinh viên.",
        },
        {
          orderNumber: 4,
          prompt: "Vật dụng cần mang theo",
          formFieldLabel: "What to bring:",
          correctAnswer: "Student ID card",
          acceptedAnswers: ["Student ID", "ID card", "Student card"],
          explanation: "Yêu cầu xuất trình thẻ sinh viên.",
        },
        {
          orderNumber: 5,
          prompt: "Người liên hệ hoặc số điện thoại",
          formFieldLabel: "Contact person:",
          correctAnswer: "Mr. David",
          acceptedAnswers: ["Mr David", "David"],
          explanation: "Tên người phụ trách ghi ở cuối thông báo.",
        },
      ];

    case 9: // Writing note (1 câu duy nhất)
      return [
        {
          orderNumber: 1,
          prompt: "Write a note to your friend Alex. In your note:\n- tell Alex about your new English class\n- explain what you like about the teacher\n- suggest meeting next weekend\n\nWrite 25-35 words on your answer sheet.",
          correctAnswer: "SAMPLE_WRITING_REQUIRED",
          explanation: "Bài viết cần nêu đủ 3 ý, dùng từ vựng và ngữ pháp phù hợp cấp độ A2, độ dài 25-35 từ.",
        },
      ];

    case 10: // Trắc nghiệm 3 ảnh A/B/C
      return Array.from({ length: count }, (_, i) => ({
        orderNumber: i + 1,
        prompt: `Nội dung câu hỏi nghe số ${i + 1}...`,
        options: [
          {
            key: "A",
            text: "Tranh A",
            imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
          },
          {
            key: "B",
            text: "Tranh B",
            imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
          },
          {
            key: "C",
            text: "Tranh C",
            imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
          },
        ],
        correctAnswer: "A",
        explanation: `Đoạn hội thoại nhắc đến hình ảnh và chi tiết của Tranh A.`,
      }));

    case 11: // Nghe nối lý do A-H
      return Array.from({ length: count }, (_, i) => ({
        orderNumber: i + 1,
        prompt: `Người hoặc đồ vật ${i + 1}...`,
        correctAnswer: ["A", "B", "C", "D", "E"][i] || "A",
        explanation: `Trong lời thoại người nói đã chọn lý do này.`,
      }));

    default:
      return [];
  }
}

export function PartEditorForm() {
  const router = useRouter();

  // 1. Phân loại & Thông tin chung
  const [selectedPartNo, setSelectedPartNo] = React.useState<number>(1);
  const [title, setTitle] = React.useState("Bài luyện tập KET 5 - Test 1: Biển báo & Thông báo");
  const [sourceLabel, setSourceLabel] = React.useState("KET 5 · Test 1");
  const [groupSet, setGroupSet] = React.useState("KET 5");
  const [instructions, setInstructions] = React.useState(
    "Nối 5 câu mô tả với 8 biển báo/thông báo ngắn (A–H). Chọn một chữ cái tương ứng."
  );
  const [exampleQuestion, setExampleQuestion] = React.useState("0. Do not feed the animals.");
  const [exampleAnswer, setExampleAnswer] = React.useState("E");
  const [exampleExplanation, setExampleExplanation] = React.useState("Biển E: Zoo notice - Không cho thú ăn.");

  // 2. Tư liệu bài thi (Stimulus)
  const [passageText, setPassageText] = React.useState(
    "A: Please show tickets at the entrance.\nB: Swimming pool closed for maintenance today.\nC: Special student discount 20% on Thursdays.\nD: Luggage must not be left unattended.\nE: Turn off all mobile phones during the performance.\nF: No parking here on weekdays.\nG: Fresh sandwiches available from 8 AM.\nH: Free Wi-Fi in the waiting room."
  );
  const [poolOptions, setPoolOptions] = React.useState<PoolOptionDef[]>([
    { letter: "A", text: "Please show tickets at the entrance." },
    { letter: "B", text: "Swimming pool closed for maintenance today." },
    { letter: "C", text: "Special student discount 20% on Thursdays." },
    { letter: "D", text: "Luggage must not be left unattended." },
    { letter: "E", text: "Turn off all mobile phones during the performance." },
    { letter: "F", text: "No parking here on weekdays." },
    { letter: "G", text: "Fresh sandwiches available from 8 AM." },
    { letter: "H", text: "Free Wi-Fi in the waiting room." },
  ]);
  const [audioUrl, setAudioUrl] = React.useState("https://assets.humg-english.site/audio/ket5-t1-p10.mp3");
  const [maxPlays, setMaxPlays] = React.useState<number>(2);
  const [audioScript, setAudioScript] = React.useState("");

  // Writing riêng cho Part 9
  const [writingRequirements, setWritingRequirements] = React.useState<string[]>([
    "Kể cho Alex về lớp học tiếng Anh mới của bạn",
    "Giải thích lý do bạn thích giáo viên",
    "Gợi ý gặp nhau vào cuối tuần tới",
  ]);
  const [sampleWriting, setSampleWriting] = React.useState(
    "Hi Alex,\nMy new English class is fantastic! Our teacher is very friendly and makes grammar fun. Would you like to meet up next Saturday at the campus cafe?\nBest,\nNam"
  );

  // 3. Danh sách câu hỏi
  const [questions, setQuestions] = React.useState<QuestionInputItem[]>(() =>
    getDefaultQuestionsForPart(1)
  );

  // Trạng thái giao diện
  const [activeTab, setActiveTab] = React.useState<"edit" | "preview">("edit");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = React.useState<string | null>(null);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [validationIssues, setValidationIssues] = React.useState<PartCompletenessIssue[]>([]);

  // Lấy định nghĩa Part hiện tại theo hằng số
  const currentPartDef = React.useMemo<ExamPartDef>(() => {
    return EXAM_PARTS.find((p) => p.partNo === selectedPartNo) || EXAM_PARTS[0];
  }, [selectedPartNo]);

  const isListening = selectedPartNo >= 10;
  const currentQuestionType = getQuestionTypeForPart(selectedPartNo);

  // Khi chọn Part khác: Cập nhật form tương ứng
  const handlePartChange = (partNo: number) => {
    setSelectedPartNo(partNo);
    const def = EXAM_PARTS.find((p) => p.partNo === partNo) || EXAM_PARTS[0];
    setTitle(`Bài luyện tập KET - Part ${partNo}: ${def.titleVi}`);
    setInstructions(`Đọc kỹ yêu cầu và hoàn thành ${def.totalQuestions} câu hỏi theo định dạng ${def.questionType}.`);
    setQuestions(getDefaultQuestionsForPart(partNo));
    setValidationIssues([]);
    setServerError(null);
  };

  // Thêm câu hỏi mới
  const handleAddQuestion = () => {
    const nextNo = questions.length + 1;
    let newQ: QuestionInputItem;

    if (currentQuestionType === "MCQ3" || currentQuestionType === "CLOZE_MCQ") {
      newQ = {
        orderNumber: nextNo,
        prompt: `Nội dung câu hỏi số ${nextNo}...`,
        options: [
          { key: "A", text: "Lựa chọn A" },
          { key: "B", text: "Lựa chọn B" },
          { key: "C", text: "Lựa chọn C" },
        ],
        correctAnswer: "A",
        explanation: "Giải thích đáp án đúng...",
      };
    } else if (currentQuestionType === "MCQ3_IMAGE") {
      newQ = {
        orderNumber: nextNo,
        prompt: `Nội dung câu hỏi số ${nextNo}...`,
        options: [
          { key: "A", text: "Tranh A", imageUrl: "https://placehold.co/300x200?text=Picture+A" },
          { key: "B", text: "Tranh B", imageUrl: "https://placehold.co/300x200?text=Picture+B" },
          { key: "C", text: "Tranh C", imageUrl: "https://placehold.co/300x200?text=Picture+C" },
        ],
        correctAnswer: "A",
        explanation: "Giải thích đáp án đúng...",
      };
    } else if (currentQuestionType === "MATCH_POOL") {
      newQ = {
        orderNumber: nextNo,
        prompt: `Câu mô tả số ${nextNo}...`,
        correctAnswer: "A",
        explanation: "Biển báo tương ứng nêu rõ thông tin này.",
      };
    } else {
      newQ = {
        orderNumber: nextNo,
        prompt: `Yêu cầu câu hỏi số ${nextNo}...`,
        correctAnswer: "answer",
        acceptedAnswers: ["answer"],
        explanation: "Giải thích đáp án...",
      };
    }

    setQuestions([...questions, newQ]);
  };

  // Xóa câu hỏi
  const handleRemoveQuestion = (index: number) => {
    const updated = questions
      .filter((_, i) => i !== index)
      .map((q, idx) => ({ ...q, orderNumber: idx + 1 }));
    setQuestions(updated);
  };

  // Tính toán kiểm tra thẩm định Realtime
  const realtimeIssues = React.useMemo<PartCompletenessIssue[]>(() => {
    const payload: Partial<CreatePartInput> = {
      partNo: selectedPartNo,
      skill: isListening ? "LISTENING" : "READING_WRITING",
      questionType: currentQuestionType,
      title,
      sourceLabel,
      groupSet,
      instructions,
      passageText,
      audioUrl,
      poolOptions,
      questions,
    };
    return validatePartForPublish(payload);
  }, [
    selectedPartNo,
    isListening,
    currentQuestionType,
    title,
    sourceLabel,
    groupSet,
    instructions,
    passageText,
    audioUrl,
    poolOptions,
    questions,
  ]);

  // Xử lý gửi dữ liệu lên Backend API
  const handleSave = async (status: "DRAFT" | "PUBLISHED") => {
    setServerError(null);
    setSaveSuccessMessage(null);

    // Nếu bấm công khai: kiểm tra tính đầy đủ trước
    if (status === "PUBLISHED") {
      if (realtimeIssues.length > 0) {
        setValidationIssues(realtimeIssues);
        setServerError("Bài luyện chưa đạt tiêu chuẩn để công khai. Vui lòng xem danh sách điểm cần sửa ở bảng bên phải.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const payload: CreatePartInput = {
        partNo: selectedPartNo,
        skill: isListening ? "LISTENING" : "READING_WRITING",
        questionType: currentQuestionType,
        title: title.trim(),
        sourceLabel: sourceLabel.trim(),
        groupSet: groupSet.trim(),
        instructions: instructions.trim(),
        exampleRow: exampleQuestion
          ? {
              question: exampleQuestion.trim(),
              correctAnswer: exampleAnswer.trim(),
              explanation: exampleExplanation.trim(),
            }
          : null,
        difficulty: "MEDIUM",
        status,
        passageText: passageText.trim() || null,
        audioUrl: isListening ? audioUrl.trim() || null : null,
        maxPlays: isListening ? maxPlays : 2,
        transcript: isListening ? audioScript.trim() || null : null,
        poolOptions: currentQuestionType === "MATCH_POOL" ? poolOptions : null,
        writingRequirements: currentQuestionType === "WRITING" ? writingRequirements : null,
        minWords: currentQuestionType === "WRITING" ? 25 : undefined,
        maxWords: currentQuestionType === "WRITING" ? 35 : undefined,
        sampleWriting: currentQuestionType === "WRITING" ? sampleWriting.trim() || null : null,
        questions,
      };

      const res = await fetch("/api/admin/parts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Không thể lưu Part. Vui lòng kiểm tra lại dữ liệu.");
        if (data.issues) {
          setValidationIssues(data.issues);
        }
        return;
      }

      setSaveSuccessMessage(
        status === "PUBLISHED"
          ? `Đã tạo và công khai bài luyện Part ${selectedPartNo} thành công vào Kho phần!`
          : `Đã lưu bản nháp Part ${selectedPartNo} thành công!`
      );

      // Chuyển hướng về trang danh sách Kho phần sau 1.5 giây
      setTimeout(() => {
        router.push("/admin/part-bank");
      }, 1500);
    } catch {
      setServerError("Lỗi kết nối máy chủ. Vui lòng kiểm tra lại mạng hoặc liên hệ quản trị viên.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Thanh điều hướng & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/part-bank"
            className="w-9 h-9 rounded-xl border border-border bg-surface flex items-center justify-center text-muted hover:text-foreground transition-colors shadow-sm"
            title="Quay lại kho phần"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Kho phần đề thi
              </span>
              <span className="text-muted">•</span>
              <Badge variant={isListening ? "secondary" : "default"} className="text-[11px]">
                Part {selectedPartNo} · {isListening ? "Listening" : "Reading & Writing"}
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground mt-0.5">
              Soạn bài luyện Part {selectedPartNo}: {currentPartDef.titleVi}
            </h1>
          </div>
        </div>

        {/* Nút thao tác nhanh */}
        <div className="flex items-center gap-2">
          {/* Switch tab Chỉnh sửa / Xem trước */}
          <div className="flex items-center bg-surface-raised p-1 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                activeTab === "edit"
                  ? "bg-surface text-primary shadow-sm"
                  : "text-muted hover:text-foreground"
              )}
            >
              Chỉnh sửa
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5",
                activeTab === "preview"
                  ? "bg-surface text-primary shadow-sm"
                  : "text-muted hover:text-foreground"
              )}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Xem trước</span>
            </button>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSubmitting}
            onClick={() => handleSave("DRAFT")}
            className="text-xs font-semibold"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5 mr-1.5" />
            )}
            <span>Lưu nháp</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            onClick={() => handleSave("PUBLISHED")}
            className="text-xs font-bold shadow-[0_4px_12px_rgba(0,149,246,0.25)]"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            )}
            <span>Công khai</span>
          </Button>
        </div>
      </div>

      {/* Thông báo lỗi server hoặc thành công */}
      {serverError && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {saveSuccessMessage && (
        <div className="p-4 rounded-2xl bg-success/10 border border-success/20 text-success text-xs flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* GIAO DIỆN CHỈNH SỬA (EDIT TAB) */}
      {activeTab === "edit" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cột chính (2/3): Form nội dung và câu hỏi */}
          <div className="lg:col-span-2 space-y-6">
            {/* Khối 1: Thông tin phân loại & Tiêu đề */}
            <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground pb-3 border-b border-border">
                <FileText className="w-4 h-4 text-primary" />
                <span>1. Thông tin phân loại & Tiêu đề bài luyện</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Chọn Part */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Thuộc Part thi (1 – 14) *
                  </label>
                  <select
                    value={selectedPartNo}
                    onChange={(e) => handlePartChange(Number(e.target.value))}
                    className="w-full min-h-[42px] px-3 rounded-xl border border-border bg-surface-raised text-xs sm:text-sm text-foreground outline-none focus:ring-2 focus:ring-primary font-medium"
                  >
                    {EXAM_PARTS.map((p) => (
                      <option key={p.partNo} value={p.partNo}>
                        Part {p.partNo}: {p.titleVi} ({p.skill === "listening" ? "Listening" : "Reading & Writing"})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nhãn nguồn đề */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Nhãn nguồn đề (Source label) *
                  </label>
                  <input
                    type="text"
                    value={sourceLabel}
                    onChange={(e) => setSourceLabel(e.target.value)}
                    placeholder="VD: KET 5 · Test 1"
                    className="w-full min-h-[42px] px-3.5 rounded-xl border border-border bg-surface-raised text-xs sm:text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Nhóm bộ đề */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Bộ đề gom nhóm (Group set) *
                  </label>
                  <input
                    type="text"
                    value={groupSet}
                    onChange={(e) => setGroupSet(e.target.value)}
                    placeholder="VD: KET 5, Bộ đề 2026"
                    className="w-full min-h-[42px] px-3.5 rounded-xl border border-border bg-surface-raised text-xs sm:text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Tiêu đề bài luyện */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Tiêu đề bài luyện (Title) *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="VD: Bài luyện tập KET 5 - Test 1"
                    className="w-full min-h-[42px] px-3.5 rounded-xl border border-border bg-surface-raised text-xs sm:text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Hướng dẫn làm bài */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground">
                    Hướng dẫn thí sinh (Directions)
                  </label>
                  <input
                    type="text"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full min-h-[42px] px-3.5 rounded-xl border border-border bg-surface-raised text-xs sm:text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Dòng ví dụ câu 0 */}
                <div className="sm:col-span-2 p-3.5 rounded-2xl bg-surface-raised border border-border space-y-2.5">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-primary" />
                    <span>Dòng ví dụ câu 0 (Hiển thị sẵn mẫu cho thí sinh)</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={exampleQuestion}
                      onChange={(e) => setExampleQuestion(e.target.value)}
                      placeholder="Câu hỏi mẫu (VD: 0. Do not feed...)"
                      className="sm:col-span-2 min-h-[38px] px-3 rounded-lg border border-border bg-surface text-xs text-foreground outline-none focus:ring-1 focus:ring-primary"
                    />
                    <input
                      type="text"
                      value={exampleAnswer}
                      onChange={(e) => setExampleAnswer(e.target.value)}
                      placeholder="Đáp án đúng (VD: E)"
                      className="min-h-[38px] px-3 rounded-lg border border-border bg-surface text-xs text-foreground outline-none focus:ring-1 focus:ring-primary font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Khối 2: Tư liệu đề thi (Stimulus: Đọc đoạn văn hoặc Tải Audio) */}
            <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground pb-3 border-b border-border">
                {isListening ? (
                  <Headphones className="w-4 h-4 text-emerald-500" />
                ) : (
                  <BookOpen className="w-4 h-4 text-purple-500" />
                )}
                <span>2. Tư liệu bài thi ({isListening ? "Audio & Lời thoại nghe" : "Văn bản bài đọc & Dữ liệu"})</span>
              </div>

              {isListening ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Đường dẫn File Audio (MP3 URL) *
                      </label>
                      <input
                        type="url"
                        value={audioUrl}
                        onChange={(e) => setAudioUrl(e.target.value)}
                        placeholder="https://.../audio.mp3"
                        className="w-full min-h-[42px] px-3.5 rounded-xl border border-border bg-surface-raised text-xs sm:text-sm font-mono text-foreground outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Số lần nghe tối đa
                      </label>
                      <select
                        value={maxPlays}
                        onChange={(e) => setMaxPlays(Number(e.target.value))}
                        className="w-full min-h-[42px] px-3 rounded-xl border border-border bg-surface-raised text-xs sm:text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value={1}>1 lần duy nhất</option>
                        <option value={2}>2 lần (Chuẩn KET)</option>
                        <option value={3}>3 lần</option>
                      </select>
                    </div>
                  </div>

                  {/* Trình nghe thử audio trực tiếp */}
                  {audioUrl && (
                    <div className="p-3.5 rounded-2xl bg-surface-raised border border-border flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                        <Volume2 className="w-4 h-4 text-primary shrink-0" />
                        <span>Nghe thử Audio:</span>
                      </div>
                      <audio controls src={audioUrl} className="h-8 max-w-sm w-full" />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Audio Script (Bản ghi lời thoại - đối chiếu sau khi nộp bài)
                    </label>
                    <textarea
                      rows={3}
                      value={audioScript}
                      onChange={(e) => setAudioScript(e.target.value)}
                      placeholder="Dán nội dung hội thoại audio vào đây để phục vụ giải thích..."
                      className="w-full p-3.5 rounded-xl border border-border bg-surface-raised text-xs sm:text-sm text-foreground outline-none focus:ring-2 focus:ring-primary leading-relaxed"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Văn bản bài đọc */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Nội dung bài đọc hoặc đoạn văn khuyết (Reading Passage) *
                    </label>
                    <textarea
                      rows={5}
                      value={passageText}
                      onChange={(e) => setPassageText(e.target.value)}
                      placeholder="Nhập nội dung bài đọc, hoặc các mục biển báo A, B, C, D, E..."
                      className="w-full p-3.5 rounded-xl border border-border bg-surface-raised text-xs sm:text-sm text-foreground outline-none focus:ring-2 focus:ring-primary font-mono leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* Quản lý kho đáp án A-H cho dạng MATCH_POOL (Part 1, 11) */}
              {currentQuestionType === "MATCH_POOL" && (
                <div className="pt-3 border-t border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">
                      Kho phương án lựa chọn A – H (Biển báo / Lý do ghép nối):
                    </span>
                    <span className="text-[11px] text-muted">{poolOptions.length} phương án</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {poolOptions.map((opt, idx) => (
                      <div
                        key={opt.letter}
                        className="flex items-center gap-2 p-2 rounded-xl border border-border bg-surface-raised"
                      >
                        <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                          {opt.letter}
                        </span>
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => {
                            const updated = [...poolOptions];
                            updated[idx].text = e.target.value;
                            setPoolOptions(updated);
                          }}
                          placeholder={`Nội dung phương án ${opt.letter}...`}
                          className="w-full bg-transparent text-xs text-foreground outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cấu hình đặc thù cho Part 9 (Writing) */}
              {currentQuestionType === "WRITING" && (
                <div className="pt-3 border-t border-border space-y-3">
                  <span className="text-xs font-bold text-foreground">
                    3 Yêu cầu ý chính cần có trong bài viết (Writing Requirements):
                  </span>
                  {writingRequirements.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => {
                          const updated = [...writingRequirements];
                          updated[idx] = e.target.value;
                          setWritingRequirements(updated);
                        }}
                        className="w-full min-h-[36px] px-3 rounded-lg border border-border bg-surface-raised text-xs text-foreground outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  ))}

                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-semibold text-foreground">
                      Bài viết mẫu tham khảo (Sample writing) & Barem:
                    </label>
                    <textarea
                      rows={3}
                      value={sampleWriting}
                      onChange={(e) => setSampleWriting(e.target.value)}
                      className="w-full p-3 rounded-lg border border-border bg-surface-raised text-xs text-foreground outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Khối 3: Danh sách câu hỏi trong Part */}
            <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <HelpCircle className="w-4 h-4 text-emerald-500" />
                  <span>
                    3. Danh sách câu hỏi ({questions.length} / {currentPartDef.totalQuestions} câu)
                  </span>
                </div>
                {currentQuestionType !== "WRITING" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddQuestion}
                    className="gap-1.5 text-xs font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm câu hỏi</span>
                  </Button>
                )}
              </div>

              {/* Từng câu hỏi */}
              <div className="space-y-4">
                {questions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-border bg-surface-raised/40 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                        Câu hỏi {q.orderNumber}
                      </span>
                      {questions.length > 1 && currentQuestionType !== "WRITING" && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(idx)}
                          className="text-xs text-destructive hover:underline flex items-center gap-1 font-medium transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa câu này</span>
                        </button>
                      )}
                    </div>

                    {/* Nội dung câu hỏi */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted">
                        Đề bài / Câu dẫn:
                      </label>
                      <input
                        type="text"
                        value={q.prompt}
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[idx].prompt = e.target.value;
                          setQuestions(updated);
                        }}
                        className="w-full min-h-[38px] px-3 rounded-xl border border-border bg-surface text-xs sm:text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {/* Dạng 1: MATCH_POOL (Part 1, 11) - Chọn chữ cái từ kho A-H */}
                    {currentQuestionType === "MATCH_POOL" && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted">
                          Chọn đáp án đúng (khớp với chữ cái A–H):
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {poolOptions.map((opt) => {
                            const isCorrect = q.correctAnswer === opt.letter;
                            return (
                              <button
                                key={opt.letter}
                                type="button"
                                onClick={() => {
                                  const updated = [...questions];
                                  updated[idx].correctAnswer = opt.letter;
                                  setQuestions(updated);
                                }}
                                className={cn(
                                  "w-9 h-9 rounded-xl border font-bold text-xs flex items-center justify-center transition-all",
                                  isCorrect
                                    ? "border-success bg-success/10 text-success ring-2 ring-success/20"
                                    : "border-border bg-surface text-muted hover:border-foreground"
                                )}
                              >
                                {opt.letter}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Dạng 2: Trắc nghiệm chữ MCQ3 hoặc CLOZE_MCQ (Part 2, 3, 4, 5, 12) */}
                    {(currentQuestionType === "MCQ3" || currentQuestionType === "CLOZE_MCQ") && q.options && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted">
                          Phương án lựa chọn & Nhấp chọn đáp án đúng:
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {q.options.map((opt, optIdx) => {
                            const isCorrect = q.correctAnswer === opt.key;
                            return (
                              <div
                                key={opt.key}
                                onClick={() => {
                                  const updated = [...questions];
                                  updated[idx].correctAnswer = opt.key;
                                  setQuestions(updated);
                                }}
                                className={cn(
                                  "flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all text-xs",
                                  isCorrect
                                    ? "border-success bg-success/10 text-success font-bold ring-2 ring-success/20"
                                    : "border-border bg-surface text-foreground hover:border-muted"
                                )}
                              >
                                <span
                                  className={cn(
                                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                                    isCorrect ? "bg-success text-white" : "bg-surface-raised text-muted"
                                  )}
                                >
                                  {opt.key}
                                </span>
                                <input
                                  type="text"
                                  value={opt.text}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    const updated = [...questions];
                                    if (updated[idx].options) {
                                      updated[idx].options![optIdx].text = e.target.value;
                                      setQuestions(updated);
                                    }
                                  }}
                                  className="w-full bg-transparent outline-none text-xs"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Dạng 3: Trắc nghiệm 3 ảnh MCQ3_IMAGE (Part 10) */}
                    {currentQuestionType === "MCQ3_IMAGE" && q.options && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted">
                          Đường dẫn 3 ảnh minh họa A, B, C & Chọn ảnh đúng:
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {q.options.map((opt, optIdx) => {
                            const isCorrect = q.correctAnswer === opt.key;
                            return (
                              <div
                                key={opt.key}
                                onClick={() => {
                                  const updated = [...questions];
                                  updated[idx].correctAnswer = opt.key;
                                  setQuestions(updated);
                                }}
                                className={cn(
                                  "p-2.5 rounded-2xl border cursor-pointer transition-all space-y-2",
                                  isCorrect
                                    ? "border-success bg-success/10 text-success ring-2 ring-success/20"
                                    : "border-border bg-surface text-foreground"
                                )}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-xs">Tranh {opt.key}</span>
                                  {isCorrect && (
                                    <span className="text-[10px] font-extrabold text-success flex items-center gap-0.5">
                                      <Check className="w-3 h-3" /> Đúng
                                    </span>
                                  )}
                                </div>
                                <div className="h-24 rounded-lg bg-surface-raised border border-border overflow-hidden flex items-center justify-center">
                                  {opt.imageUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={opt.imageUrl}
                                      alt={`Tranh ${opt.key}`}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLElement).style.display = "none";
                                      }}
                                    />
                                  ) : (
                                    <ImageIcon className="w-6 h-6 text-muted" />
                                  )}
                                </div>
                                <input
                                  type="url"
                                  value={opt.imageUrl || ""}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => {
                                    const updated = [...questions];
                                    if (updated[idx].options) {
                                      updated[idx].options![optIdx].imageUrl = e.target.value;
                                      setQuestions(updated);
                                    }
                                  }}
                                  placeholder="URL ảnh tranh..."
                                  className="w-full px-2 py-1 rounded bg-surface border border-border text-[11px] font-mono outline-none"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Dạng 4: Điền từ SHORT_TEXT (Part 6, 7, 8, 13, 14) */}
                    {currentQuestionType === "SHORT_TEXT" && (
                      <div className="space-y-3 pt-1">
                        {/* Nếu là Part 6 (Đoán từ): thêm chữ cái đầu và độ dài */}
                        {selectedPartNo === 6 && (
                          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-surface border border-border">
                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-muted">
                                Chữ cái đầu gợi ý:
                              </label>
                              <input
                                type="text"
                                maxLength={2}
                                value={q.firstLetterHint || ""}
                                onChange={(e) => {
                                  const updated = [...questions];
                                  updated[idx].firstLetterHint = e.target.value.toLowerCase();
                                  setQuestions(updated);
                                }}
                                placeholder="VD: u"
                                className="w-full h-8 px-2 rounded border border-border bg-surface-raised text-xs font-mono font-bold text-primary"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-muted">
                                Số ký tự đầy đủ:
                              </label>
                              <input
                                type="number"
                                min={1}
                                max={25}
                                value={q.charCountHint || ""}
                                onChange={(e) => {
                                  const updated = [...questions];
                                  updated[idx].charCountHint = Number(e.target.value) || undefined;
                                  setQuestions(updated);
                                }}
                                placeholder="VD: 7"
                                className="w-full h-8 px-2 rounded border border-border bg-surface-raised text-xs font-mono font-bold"
                              />
                            </div>
                          </div>
                        )}

                        {/* Nếu là Part 8, 13, 14 (Điền form): thêm nhãn form */}
                        {[8, 13, 14].includes(selectedPartNo) && (
                          <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-muted">
                              Nhãn ô thông tin biểu mẫu (Form field label):
                            </label>
                            <input
                              type="text"
                              value={q.formFieldLabel || ""}
                              onChange={(e) => {
                                const updated = [...questions];
                                updated[idx].formFieldLabel = e.target.value;
                                setQuestions(updated);
                              }}
                              placeholder="VD: Name of museum:, Ticket price:"
                              className="w-full h-8 px-3 rounded-lg border border-border bg-surface text-xs font-medium"
                            />
                          </div>
                        )}

                        {/* Ô nhập đáp án đúng chính & accepted answers */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-success">
                              Đáp án đúng chính (Correct answer) *:
                            </label>
                            <input
                              type="text"
                              value={q.correctAnswer}
                              onChange={(e) => {
                                const updated = [...questions];
                                updated[idx].correctAnswer = e.target.value;
                                setQuestions(updated);
                              }}
                              placeholder="Nhập từ hoặc cụm từ đúng..."
                              className="w-full min-h-[36px] px-3 rounded-lg border border-success/40 bg-surface text-xs font-bold text-foreground outline-none focus:ring-2 focus:ring-success"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted">
                              Đáp án chấp nhận khác (cách nhau dấu phẩy):
                            </label>
                            <input
                              type="text"
                              value={(q.acceptedAnswers || []).join(", ")}
                              onChange={(e) => {
                                const updated = [...questions];
                                updated[idx].acceptedAnswers = e.target.value
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean);
                                setQuestions(updated);
                              }}
                              placeholder="VD: swim, swimming, to swim"
                              className="w-full min-h-[36px] px-3 rounded-lg border border-border bg-surface text-xs text-foreground outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Lời giải thích */}
                    <div className="space-y-1 pt-1">
                      <label className="text-xs font-semibold text-muted">
                        Giải thích chi tiết (Explanation):
                      </label>
                      <input
                        type="text"
                        value={q.explanation || ""}
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[idx].explanation = e.target.value;
                          setQuestions(updated);
                        }}
                        placeholder="Giải thích vì sao chọn đáp án này..."
                        className="w-full min-h-[36px] px-3 rounded-xl border border-border bg-surface text-xs text-foreground outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cột phụ bên phải (1/3): Bảng tóm tắt & Checklist thẩm định */}
          <div className="space-y-6">
            {/* Checklist tiêu chuẩn chất lượng */}
            <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm space-y-4 sticky top-20">
              <h3 className="text-sm font-bold text-foreground pb-2 border-b border-border flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Tiêu chuẩn thẩm định bài</span>
              </h3>

              <div className="space-y-3 text-xs">
                {/* 1. Định dạng Part */}
                <div className="flex items-center justify-between">
                  <span className="text-muted">Định dạng Part:</span>
                  <span className="font-bold text-success flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Part {selectedPartNo}
                  </span>
                </div>

                {/* 2. Số lượng câu */}
                <div className="flex items-center justify-between">
                  <span className="text-muted">Số lượng câu đã soạn:</span>
                  <span
                    className={cn(
                      "font-bold px-2 py-0.5 rounded-full text-[11px]",
                      questions.length === currentPartDef.totalQuestions
                        ? "bg-success/10 text-success"
                        : "bg-warning/10 text-warning"
                    )}
                  >
                    {questions.length} / {currentPartDef.totalQuestions} câu
                  </span>
                </div>

                {/* 3. Tư liệu đính kèm */}
                <div className="flex items-center justify-between">
                  <span className="text-muted">Tư liệu đính kèm:</span>
                  {isListening ? (
                    audioUrl ? (
                      <span className="font-bold text-success flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đã có Audio
                      </span>
                    ) : (
                      <span className="font-bold text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Thiếu Audio URL
                      </span>
                    )
                  ) : passageText ? (
                    <span className="font-bold text-success flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Đã có bài đọc
                    </span>
                  ) : (
                    <span className="font-bold text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Thiếu bài đọc
                    </span>
                  )}
                </div>

                {/* 4. Đáp án đúng đầy đủ */}
                <div className="flex items-center justify-between">
                  <span className="text-muted">Đầy đủ đáp án đúng:</span>
                  {questions.every((q) => q.correctAnswer && q.correctAnswer.trim() !== "") ? (
                    <span className="font-bold text-success flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 100% Đầy đủ
                    </span>
                  ) : (
                    <span className="font-bold text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Còn câu thiếu
                    </span>
                  )}
                </div>
              </div>

              {/* Danh sách lỗi thẩm định nếu có */}
              {validationIssues.length > 0 && (
                <div className="pt-3 border-t border-border space-y-2">
                  <span className="text-[11px] font-bold text-destructive uppercase tracking-wider">
                    Các điểm chưa đạt chuẩn để công khai:
                  </span>
                  <ul className="space-y-1 text-[11px] text-destructive list-disc pl-4">
                    {validationIssues.map((issue, idx) => (
                      <li key={idx}>{issue.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-3 border-t border-border">
                <p className="text-[11px] text-muted leading-relaxed">
                  Lưu ý: Bạn có thể bấm <strong>&quot;Lưu nháp&quot;</strong> bất kỳ lúc nào để lưu tiến độ soạn bài. Nút <strong>&quot;Công khai&quot;</strong> chỉ cho phép khi đã hoàn thành 100% tiêu chuẩn.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* GIAO DIỆN XEM TRƯỚC (PREVIEW MODE) */
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                Chế độ xem trước như sinh viên làm bài
              </span>
              <h2 className="text-xl font-bold text-foreground mt-1.5">{title}</h2>
              <p className="text-xs text-muted mt-0.5">{instructions}</p>
            </div>
          </div>

          {/* Tư liệu bài thi */}
          {isListening ? (
            <div className="p-4 rounded-2xl bg-surface-raised border border-border flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-primary" />
                <span className="text-xs font-mono text-foreground">{audioUrl || "Chưa có file Audio"}</span>
              </div>
              <span className="text-xs text-muted">Tối đa {maxPlays} lần nghe</span>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-surface-raised border border-border font-mono text-xs whitespace-pre-wrap leading-relaxed text-foreground">
              {passageText}
            </div>
          )}

          {/* Kho A-H xem trước nếu là match_pool */}
          {currentQuestionType === "MATCH_POOL" && (
            <div className="p-4 rounded-2xl bg-surface-raised border border-border space-y-2">
              <span className="text-xs font-bold text-foreground">Bảng thông báo / Biển chỉ dẫn:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {poolOptions.map((opt) => (
                  <div key={opt.letter} className="p-2 rounded-lg bg-surface border border-border text-xs flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-primary/10 text-primary font-bold flex items-center justify-center text-[11px]">
                      {opt.letter}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Danh sách câu hỏi xem trước */}
          <div className="space-y-4 pt-2">
            {questions.map((q) => (
              <div key={q.orderNumber} className="p-4 rounded-2xl border border-border space-y-3">
                <p className="text-sm font-bold text-foreground">
                  Câu {q.orderNumber}: {q.prompt}
                </p>

                {/* Trắc nghiệm lựa chọn */}
                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {q.options.map((opt) => (
                      <div
                        key={opt.key}
                        className={cn(
                          "p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2",
                          q.correctAnswer === opt.key
                            ? "border-success bg-success/10 text-success"
                            : "border-border text-muted"
                        )}
                      >
                        <span className="w-5 h-5 rounded-full bg-surface-raised flex items-center justify-center text-[10px]">
                          {opt.key}
                        </span>
                        <span>{opt.text}</span>
                        {q.correctAnswer === opt.key && (
                          <span className="ml-auto text-[10px] font-bold text-success">(Đáp án đúng)</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Điền từ hoặc match_pool */}
                {!q.options && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-muted">Đáp án chuẩn:</span>
                    <span className="px-2.5 py-1 rounded-lg bg-success/10 text-success font-bold font-mono">
                      {q.correctAnswer}
                    </span>
                    {q.acceptedAnswers && q.acceptedAnswers.length > 1 && (
                      <span className="text-muted">
                        (Chấp nhận thêm: {q.acceptedAnswers.filter((a) => a !== q.correctAnswer).join(", ")})
                      </span>
                    )}
                  </div>
                )}

                {q.explanation && (
                  <p className="text-[11px] text-muted italic">Giải thích: {q.explanation}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
