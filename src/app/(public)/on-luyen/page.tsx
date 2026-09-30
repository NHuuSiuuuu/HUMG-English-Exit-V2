import * as React from "react";
import Link from "next/link";
import { BookOpen, ArrowLeft, ArrowRight } from "lucide-react";
import { EXAM_PARTS } from "@/shared/constants/exam-parts";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";

export default function PracticeHubPage() {
  const rwParts = EXAM_PARTS.filter((p) => p.skill === "reading_writing");
  const listeningParts = EXAM_PARTS.filter((p) => p.skill === "listening");

  return (
    <div className="py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Tiêu đề trang */}
        <div className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Về trang chủ</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Ôn luyện từng phần
          </h1>
          <p className="text-muted text-base max-w-2xl leading-relaxed">
            Chọn một dạng bài Cambridge KET để bắt đầu luyện tập chuyên sâu. Mỗi phần đều có giải thích chi tiết và không giới hạn thời gian.
          </p>
        </div>

        {/* Khối Reading & Writing */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Badge variant="default" className="text-xs">Reading & Writing</Badge>
            <h2 className="text-xl font-bold font-heading text-foreground">
              9 Dạng bài Đọc & Viết (Phần 1 - 9)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rwParts.map((part) => (
              <Card key={part.partNo} className="flex flex-col justify-between hover:border-primary/40 hover:shadow-md transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-heading font-extrabold text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                      Part {part.partNo}
                    </span>
                    <span className="text-xs text-muted font-medium">{part.questionRange} ({part.totalQuestions} câu)</span>
                  </div>
                  <CardTitle className="text-lg">{part.titleVi}</CardTitle>
                  <CardDescription className="text-xs text-muted mt-1">{part.questionType}</CardDescription>
                </CardHeader>
                <CardFooter className="pt-2">
                  <Link href={`/on-luyen/reading_writing/${part.partNo}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full justify-between group">
                      <span>Luyện phần này</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Khối Listening */}
        <div className="space-y-4 pt-6">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Badge variant="secondary" className="text-xs">Listening</Badge>
            <h2 className="text-xl font-bold font-heading text-foreground">
              5 Dạng bài Nghe (Phần 10 - 14)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listeningParts.map((part) => (
              <Card key={part.partNo} className="flex flex-col justify-between hover:border-secondary/40 hover:shadow-md transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-heading font-extrabold text-xs px-2 py-0.5 rounded bg-secondary/15 text-secondary">
                      Part {part.partNo}
                    </span>
                    <span className="text-xs text-muted font-medium">{part.questionRange} ({part.totalQuestions} câu)</span>
                  </div>
                  <CardTitle className="text-lg">{part.titleVi}</CardTitle>
                  <CardDescription className="text-xs text-muted mt-1">{part.questionType}</CardDescription>
                </CardHeader>
                <CardFooter className="pt-2">
                  <Link href={`/on-luyen/listening/${part.partNo}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full justify-between group">
                      <span>Luyện phần này</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
