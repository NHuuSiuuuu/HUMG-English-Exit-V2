import * as React from "react";
import { articleService } from "@/backend/services/article.service";
import { ArticleEditorForm } from "@/frontend/components/admin/article-editor-form";

export const metadata = {
  title: "Soạn thảo Bài viết & Cẩm nang — Admin | HUMG English Exit",
  description: "Biên tập tin tức, hướng dẫn quy định chuẩn đầu ra, mẹo làm bài thi KET Cambridge",
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams?: {
    edit?: string;
  };
}

export default async function AdminCreateArticlePage({ searchParams }: PageProps) {
  const editId = searchParams?.edit;

  const article = editId
    ? await articleService.getArticleById(editId)
    : null;

  return <ArticleEditorForm initialData={article} isEditing={!!editId} />;
}
