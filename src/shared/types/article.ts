export type ArticleStatus = "DRAFT" | "PUBLISHED";

export const ARTICLE_CATEGORIES = [
  "Quy định & Lịch thi HUMG",
  "Mẹo làm bài thi KET",
  "Kỹ năng Reading & Writing",
  "Kỹ năng Listening",
  "Ngữ pháp & Từ vựng",
  "Thông báo chung",
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

export interface CreateArticleInput {
  title: string;
  slug?: string;
  excerpt?: string | null;
  content: string;
  coverImageUrl?: string | null;
  category: string;
  tags?: string[];
  authorName?: string;
  status: ArticleStatus;
}

export interface UpdateArticleInput extends Partial<CreateArticleInput> {
  id: string;
}

export interface ArticleListItemDTO {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  category: string;
  tags: string[];
  authorName: string;
  status: ArticleStatus;
  viewsCount: number;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleDetailDTO extends ArticleListItemDTO {
  content: string;
}

export interface ArticleStatsDTO {
  total: number;
  published: number;
  draft: number;
  totalViews: number;
}

export interface ArticleCompletenessIssue {
  field: string;
  message: string;
  severity: "error" | "warning";
}
