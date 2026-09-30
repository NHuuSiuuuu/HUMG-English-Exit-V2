"use client";

import * as React from "react";
import Link from "next/link";
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
} from "lucide-react";
import { EXAM_PARTS, type ExamPartDef } from "@/shared/constants/exam-parts";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { cn } from "@/frontend/lib/utils";

interface QuestionItem {
  id: string;
  questionNo: number;
  prompt: string;
  options: { key: string; text: string }[];
  correctAnswer: string;
  acceptedAnswers?: string; // Cho dạng điền từ
  explanation: string;
}

export function PartEditorForm() {
  const [selectedPartNo, setSelectedPartNo] = React.useState<number>(1);
  const [title, setTitle] = React.useState("Bài luyện tập KET 5 - Test 1");
  const [sourceLabel, setSourceLabel] = React.useState("KET 5 · Test 1");
  const [groupSet, setGroupSet] = React.useState("KET 5");
  const [instructions, setInstructions] = React.useState(
    "Đọc các thông báo và chọn phương án đúng tương ứng cho mỗi câu."
  );
  const [exampleRow, setExampleRow] = React.useState("0. Do not feed the animals. -> E (ZOO NOTICE)");
  const [passageText, setPassageText] = React.useState(
    "A: Please show tickets at the entrance.\nB: Swimming pool closed for maintenance today.\nC: Special student discount 20% on Thursdays.\nD: Luggage must not be left unattended.\nE: Turn off all mobile phones during the performance."
  );
  const [audioUrl, setAudioUrl] = React.useState("https://assets.humg-english.site/audio/ket5-t1-p10.mp3");
  const [maxPlays, setMaxPlays] = React.useState<number>(2);
  const [audioScript, setAudioScript] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"edit" | "preview">("edit");
  const [isSaved, setIsSaved] = React.useState(false);

  // Lấy định nghĩa Part hiện tại
  const currentPartDef = React.useMemo<ExamPartDef>(() => {
    return EXAM_PARTS.find((p) => p.partNo === selectedPartNo) || EXAM_PARTS[0];
  }, [selectedPartNo]);

  // Khởi tạo danh sách câu hỏi mẫu phù hợp với Part
  const [questions, setQuestions] = React.useState<QuestionItem[]>([
    {
      id: "q1",
      questionNo: 1,
      prompt: "You cannot swim here at the moment.",
      options: [
        { key: "A", text: "Notice A" },
        { key: "B", text: "Notice B" },
        { key: "C", text: "Notice C" },
      ],
      correctAnswer: "B",
      explanation: "Notice B ghi rõ hồ bơi đóng cửa để bảo trì hôm nay.",
    },
    {
      id: "q2",
      questionNo: 2,
      prompt: "Students pay less money if they come on this day.",
      options: [
        { key: "A", text: "Notice A" },
        { key: "B", text: "Notice B" },
        { key: "C", text: "Notice C" },
      ],
      correctAnswer: "C",
      explanation: "Notice C giảm giá 20% cho sinh viên vào thứ Năm.",
    },
    {
      id: "q3",
      questionNo: 3,
      prompt: "You must keep your bags with you at all times.",
      options: [
        { key: "A", text: "Notice B" },
        { key: "B", text: "Notice C" },
        { key: "C", text: "Notice D" },
      ],
      correctAnswer: "C",
      explanation: "Notice D yêu cầu không được để hành lý mà không trông coi.",
    },
  ]);

  // Cập nhật khi chọn Part khác
  const handlePartChange = (partNo: number) => {
    setSelectedPartNo(partNo);
    const def = EXAM_PARTS.find((p) => p.partNo === partNo);
    if (def) {
      setInstructions(`Đọc kỹ yêu cầu và hoàn thành ${def.totalQuestions} câu hỏi theo định dạng ${def.questionType}.`);
    }
  };

  const handleAddQuestion = () => {
    const nextNo = questions.length + 1;
    setQuestions([
      ...questions,
      {
        id: `q-${Date.now()}`,
        questionNo: nextNo,
        prompt: `Nội dung câu hỏi số ${nextNo}...`,
        options: [
          { key: "A", text: "Lựa chọn A" },
          { key: "B", text: "Lựa chọn B" },
          { key: "C", text: "Lựa chọn C" },
        ],
        correctAnswer: "A",
        explanation: "Giải thích đáp án đúng...",
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    const updated = questions.filter((_, i) => i !== index).map((q, idx) => ({ ...q, questionNo: idx + 1 }));
    setQuestions(updated);
  };

  const handleSave = (status: "draft" | "published") => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const isListening = currentPartDef.skill === "listening";

  return (
    <div className="space-y-6">
      {/* Thanh điều hướng & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/part-bank"
            className="w-9 h-9 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors shadow-sm"
            title="Quay lại kho phần"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                Kho phần đề thi
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <Badge variant={isListening ? "secondary" : "default"} className="text-[11px]">
                Part {selectedPartNo} · {isListening ? "Listening" : "Reading & Writing"}
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              Soạn bài luyện Part {selectedPartNo}: {currentPartDef.titleVi}
            </h1>
          </div>
        </div>

        {/* Nút thao tác nhanh */}
        <div className="flex items-center gap-2">
          {/* Switch tab Chỉnh sửa / Xem trước */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                activeTab === "edit"
                  ? "bg-white dark:bg-slate-700 text-[#0095F6] dark:text-sky-300 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
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
                  ? "bg-white dark:bg-slate-700 text-[#0095F6] dark:text-sky-300 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
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
            onClick={() => handleSave("draft")}
            className="text-xs font-semibold"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            <span>Lưu nháp</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => handleSave("published")}
            className="text-xs font-bold shadow-[0_4px_12px_rgba(0,149,246,0.25)]"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            <span>Công khai</span>
          </Button>
        </div>
      </div>

      {/* Thông báo lưu thành công */}
      {isSaved && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          <span>Bài luyện Part {selectedPartNo} đã được lưu thành công vào cơ sở dữ liệu Kho phần!</span>
        </div>
      )}

      {/* GIAO DIỆN CHỈNH SỬA (EDIT TAB) */}
      {activeTab === "edit" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cột chính (2/3): Form nội dung và câu hỏi */}
          <div className="lg:col-span-2 space-y-6">
            {/* Khối 1: Thông tin cơ bản */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                <FileText className="w-4 h-4 text-[#0095F6]" />
                <span>1. Thông tin phân loại & Tiêu đề</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Chọn Part */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Thuộc Part thi (1 – 14) *
                  </label>
                  <select
                    value={selectedPartNo}
                    onChange={(e) => handlePartChange(Number(e.target.value))}
                    className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#0095F6]"
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
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Nhãn nguồn đề (Source label) *
                  </label>
                  <input
                    type="text"
                    value={sourceLabel}
                    onChange={(e) => setSourceLabel(e.target.value)}
                    placeholder="VD: KET 5 · Test 1"
                    className="w-full min-h-[42px] px-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#0095F6]"
                  />
                </div>

                {/* Tiêu đề bài luyện */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Tiêu đề bài luyện (Title) *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="VD: Bài luyện tập KET 5 - Test 1 - Notices & Signs"
                    className="w-full min-h-[42px] px-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#0095F6]"
                  />
                </div>

                {/* Hướng dẫn làm bài */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Hướng dẫn thí sinh (Directions)
                  </label>
                  <input
                    type="text"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full min-h-[42px] px-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#0095F6]"
                  />
                </div>

                {/* Dòng ví dụ mẫu */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Dòng ví dụ mẫu (Example row)
                  </label>
                  <input
                    type="text"
                    value={exampleRow}
                    onChange={(e) => setExampleRow(e.target.value)}
                    placeholder="VD: 0. Do not feed the animals. -> E (ZOO NOTICE)"
                    className="w-full min-h-[42px] px-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#0095F6]"
                  />
                </div>
              </div>
            </div>

            {/* Khối 2: Tư liệu đề thi (Stimulus: Đọc đoạn văn hoặc Tải Audio) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                {isListening ? (
                  <Headphones className="w-4 h-4 text-emerald-500" />
                ) : (
                  <BookOpen className="w-4 h-4 text-purple-500" />
                )}
                <span>2. Tư liệu bài thi ({isListening ? "Audio & Lời thoại" : "Đoạn văn đọc hiểu & Thông báo"})</span>
              </div>

              {isListening ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                        Đường dẫn File Audio (MP3 URL) *
                      </label>
                      <input
                        type="url"
                        value={audioUrl}
                        onChange={(e) => setAudioUrl(e.target.value)}
                        placeholder="https://.../audio.mp3"
                        className="w-full min-h-[42px] px-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-sm font-mono text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#0095F6]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                        Số lần nghe tối đa
                      </label>
                      <select
                        value={maxPlays}
                        onChange={(e) => setMaxPlays(Number(e.target.value))}
                        className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#0095F6]"
                      >
                        <option value={1}>1 lần duy nhất</option>
                        <option value={2}>2 lần (Chuẩn KET)</option>
                        <option value={3}>3 lần</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      Audio Script (Bản ghi lời thoại - hiển thị cho thí sinh sau khi nộp bài)
                    </label>
                    <textarea
                      rows={4}
                      value={audioScript}
                      onChange={(e) => setAudioScript(e.target.value)}
                      placeholder="Dán nội dung hội thoại audio vào đây để phục vụ giải thích chi tiết..."
                      className="w-full p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#0095F6] leading-relaxed"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Nội dung văn bản / Danh sách biển báo (Reading Passage) *
                  </label>
                  <textarea
                    rows={6}
                    value={passageText}
                    onChange={(e) => setPassageText(e.target.value)}
                    placeholder="Nhập nội dung bài đọc, hoặc các mục biển báo A, B, C, D, E..."
                    className="w-full p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#0095F6] font-mono leading-relaxed"
                  />
                  <p className="text-[11px] text-slate-400">
                    Gợi ý: Với Part 1 & Part 11, ghi rõ tiền tố A:, B:, C:... để hệ thống tự nhận diện các thẻ nối.
                  </p>
                </div>
              )}
            </div>

            {/* Khối 3: Danh sách câu hỏi trong Part */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <HelpCircle className="w-4 h-4 text-emerald-500" />
                  <span>3. Danh sách câu hỏi ({questions.length} câu)</span>
                </div>
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
              </div>

              {/* Từng câu hỏi */}
              <div className="space-y-4">
                {questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                        Câu hỏi {q.questionNo}
                      </span>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(idx)}
                          className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-medium transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa câu này</span>
                        </button>
                      )}
                    </div>

                    {/* Nội dung câu hỏi */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
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
                        className="w-full min-h-[38px] px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#0095F6]"
                      />
                    </div>

                    {/* Lựa chọn & Đáp án đúng */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        Các phương án & Chọn đáp án đúng:
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
                                  ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold ring-2 ring-emerald-500/20"
                                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                              )}
                            >
                              <span
                                className={cn(
                                  "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                                  isCorrect
                                    ? "bg-emerald-600 text-white"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600"
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
                                  updated[idx].options[optIdx].text = e.target.value;
                                  setQuestions(updated);
                                }}
                                className="w-full bg-transparent outline-none text-xs"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Lời giải thích */}
                    <div className="space-y-1 pt-1">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        Giải thích chi tiết (Explanation):
                      </label>
                      <input
                        type="text"
                        value={q.explanation}
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[idx].explanation = e.target.value;
                          setQuestions(updated);
                        }}
                        placeholder="Giải thích vì sao chọn đáp án này..."
                        className="w-full min-h-[36px] px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#0095F6]"
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
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0095F6]" />
                <span>Tiêu chuẩn thẩm định bài</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Đã chọn đúng định dạng Part:</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Part {selectedPartNo}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Số lượng câu đã soạn:</span>
                  <span
                    className={cn(
                      "font-bold px-2 py-0.5 rounded-full text-[11px]",
                      questions.length === currentPartDef.totalQuestions
                        ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-600"
                        : "bg-amber-100 dark:bg-amber-950 text-amber-600"
                    )}
                  >
                    {questions.length} / {currentPartDef.totalQuestions} câu
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Tư liệu đính kèm:</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isListening ? "Audio URL hợp lệ" : "Đã có đoạn văn"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Đáp án đúng 100%:</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Đầy đủ
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Mẹo: Khi công khai, bài này sẽ xuất hiện ngay trong trang Ôn luyện sinh viên và sẵn sàng để ghép vào bất kỳ đề thi thử 60 phút nào.
                </p>
              </div>
            </div>

            {/* Thông số kỹ thuật Part */}
            <div className="bg-sky-50/60 dark:bg-sky-950/30 rounded-3xl p-6 border border-sky-100 dark:border-sky-900/50 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-sky-800 dark:text-sky-300">
                Định dạng chuẩn Cambridge KET
              </h4>
              <p className="text-xs text-sky-700 dark:text-sky-400 font-medium">
                {currentPartDef.questionType}
              </p>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 pt-2 border-t border-sky-100 dark:border-sky-900/40">
                <p>• Dải số thứ tự đề: Câu {currentPartDef.questionRange}</p>
                <p>• Hình thức nhập: {currentPartDef.inputFormat}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* GIAO DIỆN XEM TRƯỚC (PREVIEW MODE) */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                Chế độ xem trước như sinh viên làm bài
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1.5">
                {title}
              </h2>
              <p className="text-xs text-slate-500">{instructions}</p>
            </div>
          </div>

          {/* Khung tài liệu */}
          {isListening ? (
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-sky-400" />
                <span className="text-xs font-mono">{audioUrl}</span>
              </div>
              <span className="text-xs text-slate-400">Tối đa {maxPlays} lần nghe</span>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 font-mono text-xs whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-200">
              {passageText}
            </div>
          )}

          {/* Danh sách câu hỏi xem trước */}
          <div className="space-y-4 pt-2">
            {questions.map((q) => (
              <div key={q.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2.5">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Câu {q.questionNo}: {q.prompt}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {q.options.map((opt) => (
                    <div
                      key={opt.key}
                      className={cn(
                        "p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2",
                        q.correctAnswer === opt.key
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                      )}
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px]">
                        {opt.key}
                      </span>
                      <span>{opt.text}</span>
                      {q.correctAnswer === opt.key && (
                        <span className="ml-auto text-[10px] font-bold text-emerald-600 dark:text-emerald-400">(Đáp án đúng)</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
