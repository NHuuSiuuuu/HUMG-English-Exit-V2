import "server-only";

// Dung sai trễ mạng cho phép khi nộp bài (30 giây)
export const SUBMISSION_GRACE_PERIOD_MS = 30 * 1000;

export interface ExamTimeStatus {
  isExpired: boolean;
  remainingSeconds: number;
  isOverdueWithGrace: boolean;
}

// Hàm thuần kiểm tra hạn giờ thi phía máy chủ (theo AGENTS.md rule 2)
export function checkExamDeadline(
  deadlineAt: Date | string,
  now: Date = new Date()
): ExamTimeStatus {
  const deadlineMs = new Date(deadlineAt).getTime();
  const currentMs = now.getTime();
  const diffMs = deadlineMs - currentMs;

  const isExpired = diffMs <= 0;
  const isOverdueWithGrace = diffMs < -SUBMISSION_GRACE_PERIOD_MS;
  const remainingSeconds = Math.max(0, Math.floor(diffMs / 1000));

  return {
    isExpired,
    remainingSeconds,
    isOverdueWithGrace,
  };
}
