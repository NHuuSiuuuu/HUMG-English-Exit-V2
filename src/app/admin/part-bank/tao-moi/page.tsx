import * as React from "react";
import { PartEditorForm } from "@/frontend/components/admin/part-editor-form";

export const metadata = {
  title: "Tạo Part mới — Admin Kho phần | HUMG English Exit",
  description: "Trình biên soạn và quản lý ngân hàng câu hỏi 14 Part Cambridge KET",
};

export default function AdminCreatePartPage() {
  return <PartEditorForm />;
}
