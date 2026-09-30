import React from "react";
import { notFound } from "next/navigation";
import { getPartSummary, getPartItems } from "@/backend/services/practice.service";
import { PartHeader } from "@/frontend/components/practice/part-header";
import { PartItemsContainer } from "@/frontend/components/practice/part-items-container";

interface PartDetailPageProps {
  params: {
    skill: string;
    partNo: string;
  };
}

export async function generateMetadata({ params }: PartDetailPageProps) {
  const partNumber = parseInt(params.partNo, 10);
  const part = await getPartSummary(partNumber);
  if (!part) {
    return { title: "Không tìm thấy phần luyện tập" };
  }
  return {
    title: `${part.titleVi} — Ôn luyện KET A2 HUMG`,
    description: part.descriptionVi,
  };
}

export default async function PartDetailPage({ params }: PartDetailPageProps) {
  const partNumber = parseInt(params.partNo, 10);
  if (isNaN(partNumber) || partNumber < 1 || partNumber > 14) {
    notFound();
  }

  const part = await getPartSummary(partNumber);
  if (!part) {
    notFound();
  }

  const items = await getPartItems(partNumber);
  const firstIncomplete = items.find((it) => !it.isCompleted);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Khối đầu trang: Tiêu đề, Breadcrumb, Tiến độ */}
      <PartHeader part={part} firstIncompleteItemId={firstIncomplete?.id} />

      {/* Danh sách bài luyện tập với các bộ lọc và 3 kiểu xem */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-[var(--color-navy)] dark:text-sky-300">
          Danh sách các bài luyện tập
        </h2>
        <PartItemsContainer initialItems={items} />
      </div>
    </div>
  );
}
