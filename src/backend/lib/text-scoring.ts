import "server-only";

/**
 * Đếm số từ trong đoạn văn bản tiếng Anh phục vụ chấm điểm và hiển thị thời gian thực Part 9 Writing
 * Tách từ theo khoảng trắng, xuống dòng, và loại bỏ các ký tự khoảng trắng thừa.
 */
export function countWords(text: string): number {
  if (!text || typeof text !== "string") {
    return 0;
  }
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return 0;
  }
  // Tách từ theo một hoặc nhiều khoảng trắng / xuống dòng
  const tokens = trimmed.split(/\s+/);
  return tokens.filter((token) => token.length > 0).length;
}

/**
 * So khớp câu trả lời điền từ ngắn của thí sinh với đáp án chuẩn
 * Hỗ trợ một đáp án duy nhất hoặc mảng các đáp án hợp lệ (accepted answers)
 * Loại bỏ khoảng trắng thừa ở hai đầu và không phân biệt chữ hoa thường.
 */
export function scoreShortText(
  userAnswer: string | undefined,
  correct: string | string[]
): boolean {
  if (!userAnswer || typeof userAnswer !== "string") {
    return false;
  }
  const normalizedUser = userAnswer.trim().toLowerCase();
  if (normalizedUser.length === 0) {
    return false;
  }

  if (Array.isArray(correct)) {
    return correct.some((ans) => ans.trim().toLowerCase() === normalizedUser);
  }

  return correct.trim().toLowerCase() === normalizedUser;
}
