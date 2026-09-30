import React from "react";
import { notFound } from "next/navigation";
import { getPracticeItemDetail, getPartItems } from "@/backend/services/practice.service";
import { PracticeWorkspace } from "@/frontend/components/practice/practice-workspace";

interface PracticeItemPageProps {
  params: {
    skill: string;
    partNo: string;
    itemId: string;
  };
}

export async function generateMetadata({ params }: PracticeItemPageProps) {
  const item = await getPracticeItemDetail(params.itemId);
  if (!item) {
    return { title: "Không tìm thấy bài luyện" };
  }
  return {
    title: `${item.title} — HUMG English Exit`,
    description: `Luyện tập chuẩn định dạng KET A2: ${item.title} (${item.sourceLabel})`,
  };
}

export default async function PracticeItemPage({ params }: PracticeItemPageProps) {
  const partNumber = parseInt(params.partNo, 10);
  if (isNaN(partNumber) || partNumber < 1 || partNumber > 14) {
    notFound();
  }

  const item = await getPracticeItemDetail(params.itemId);
  if (!item) {
    notFound();
  }

  // Tìm bài tiếp theo trong cùng Part (nếu có)
  const partItems = await getPartItems(partNumber);
  const currentIndex = partItems.findIndex((it) => it.id === item.id);
  const nextItem =
    currentIndex >= 0 && currentIndex < partItems.length - 1
      ? partItems[currentIndex + 1]
      : undefined;

  return (
    <div className="min-h-screen bg-[var(--surface-bg)]">
      <PracticeWorkspace itemDetail={item} nextItemId={nextItem?.id} />
    </div>
  );
}
