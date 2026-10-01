import * as React from "react";
import { partService } from "@/backend/services/part.service";
import { PartEditorForm } from "@/frontend/components/admin/part-editor-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Soạn thảo Part — Admin Kho phần | HUMG English Exit",
  description: "Trình biên soạn và quản lý ngân hàng câu hỏi 14 Part Cambridge KET",
};

interface PageProps {
  searchParams?: {
    edit?: string;
  };
}

export default async function AdminCreatePartPage({ searchParams }: PageProps) {
  const editId = searchParams?.edit;

  const part = editId ? await partService.getPartById(editId) : null;

  return <PartEditorForm initialPart={part} isEditing={!!editId} />;
}
