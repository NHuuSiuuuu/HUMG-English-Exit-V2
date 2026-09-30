import "server-only";

export interface ScoreResult {
  totalQuestions: number;
  correctCount: number;
  scorePercentage: number;
  details: {
    questionId: string;
    isCorrect: boolean;
    userAnswer?: string;
  }[];
}

// Hàm thuần chấm điểm trắc nghiệm và điền từ tự động (không đụng DB, dễ viết unit test theo AGENTS.md)
export function calculateScore(
  userAnswers: Record<string, string>,
  answerKeys: Record<string, string | string[]>
): ScoreResult {
  const questionIds = Object.keys(answerKeys);
  const totalQuestions = questionIds.length;
  let correctCount = 0;

  const details = questionIds.map((qId) => {
    const userAnswer = (userAnswers[qId] || "").trim().toLowerCase();
    const correctKey = answerKeys[qId];

    let isCorrect = false;
    if (Array.isArray(correctKey)) {
      // Chấp nhận nhiều đáp án đúng (ví dụ từ đồng nghĩa hoặc chữ viết tắt)
      isCorrect = correctKey.some((k) => k.trim().toLowerCase() === userAnswer);
    } else if (typeof correctKey === "string") {
      isCorrect = correctKey.trim().toLowerCase() === userAnswer;
    }

    if (isCorrect) {
      correctCount++;
    }

    return {
      questionId: qId,
      isCorrect,
      userAnswer: userAnswers[qId],
    };
  });

  const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return {
    totalQuestions,
    correctCount,
    scorePercentage,
    details,
  };
}
