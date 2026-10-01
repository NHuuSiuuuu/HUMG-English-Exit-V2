"use client";

import type { ExamHistorySummaryDTO } from "@/shared/types/attempt";

const ATTEMPT_STORAGE_KEY = "humg_exam_attempt_ids";

/**
 * Lưu mã attemptId vào localStorage để thí sinh khách vẫn xem lại được lịch sử các lần thi
 */
export function saveLocalAttemptId(attemptId: string) {
  if (typeof window === "undefined" || !attemptId) return;

  try {
    const raw = localStorage.getItem(ATTEMPT_STORAGE_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];

    if (!list.includes(attemptId)) {
      const updated = [attemptId, ...list].slice(0, 50); // Giữ tối đa 50 lần gần nhất
      localStorage.setItem(ATTEMPT_STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (err) {
    console.warn("Không thể lưu attemptId vào localStorage:", err);
  }
}

/**
 * Lấy danh sách các attemptId đã lưu trong máy khách
 */
export function getLocalAttemptIds(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(ATTEMPT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Tải lịch sử thi thử kết hợp giữa tài khoản đăng nhập và dữ liệu máy khách
 */
export async function fetchUserExamHistory(
  examId?: string
): Promise<ExamHistorySummaryDTO> {
  const attemptIds = getLocalAttemptIds();

  const res = await fetch("/api/exam/attempts/history", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      attemptIds,
      examId,
    }),
  });

  if (!res.ok) {
    throw new Error("Không thể tải lịch sử làm bài thi");
  }

  return res.json();
}
