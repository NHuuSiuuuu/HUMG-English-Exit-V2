import { describe, it } from "node:test";
import assert from "node:assert/strict";

// Hàm logic đếm từ thuần
function countWords(text) {
  if (!text || typeof text !== "string") return 0;
  const trimmed = text.trim();
  if (trimmed.length === 0) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

// Hàm logic so khớp đáp án điền từ
function scoreShortText(userAnswer, correct) {
  if (!userAnswer || typeof userAnswer !== "string") return false;
  const normalizedUser = userAnswer.trim().toLowerCase();
  if (normalizedUser.length === 0) return false;

  if (Array.isArray(correct)) {
    return correct.some((ans) => ans.trim().toLowerCase() === normalizedUser);
  }
  return correct.trim().toLowerCase() === normalizedUser;
}

describe("Text Scoring & Word Count Logic", () => {
  describe("countWords()", () => {
    it("trả về 0 khi chuỗi rỗng hoặc chỉ có khoảng trắng", () => {
      assert.equal(countWords(""), 0);
      assert.equal(countWords("   \n\t  "), 0);
    });

    it("đếm chính xác số từ tiếng Anh ngăn cách bằng khoảng trắng hoặc xuống dòng", () => {
      const text = "Let's meet this Thursday at 2 p.m. in the campus library.";
      assert.equal(countWords(text), 11);
    });

    it("xử lý nhiều khoảng trắng liên tiếp và ký tự đặc biệt", () => {
      const text = "  Hello   world!  How    are   you? ";
      assert.equal(countWords(text), 5);
    });
  });

  describe("scoreShortText()", () => {
    it("chấm đúng khi trùng khớp chính xác (không phân biệt hoa thường và khoảng trắng thừa)", () => {
      assert.equal(scoreShortText("umbrella", "Umbrella"), true);
      assert.equal(scoreShortText("  calculator  ", "CALCULATOR"), true);
    });

    it("chấm sai khi sai chính tả", () => {
      assert.equal(scoreShortText("umbrela", "umbrella"), false);
      assert.equal(scoreShortText("", "umbrella"), false);
    });

    it("chấp nhận danh sách nhiều đáp án hợp lệ (accepted answers)", () => {
      const accepted = ["9:30", "9.30", "half past nine"];
      assert.equal(scoreShortText("9:30", accepted), true);
      assert.equal(scoreShortText("9.30", accepted), true);
      assert.equal(scoreShortText("HALF PAST NINE", accepted), true);
      assert.equal(scoreShortText("9:15", accepted), false);
    });
  });
});
