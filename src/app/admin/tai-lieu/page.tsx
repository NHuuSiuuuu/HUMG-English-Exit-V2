import * as React from "react";
import { Upload, Search, FileAudio, FileText, Image, Trash2, Download } from "lucide-react";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";

export default function AdminDocumentsPage() {
  const documents = [
    {
      name: "audio_ket_test1_part10.mp3",
      type: "Audio MP3",
      size: "8.4 MB",
      part: "Part 10 (Listening 1)",
      uploadedAt: "26/09/2026",
      status: "Sử dụng trong 3 đề",
    },
    {
      name: "audio_ket_test1_part11.mp3",
      type: "Audio MP3",
      size: "6.2 MB",
      part: "Part 11 (Listening 2)",
      uploadedAt: "26/09/2026",
      status: "Sử dụng trong 3 đề",
    },
    {
      name: "ket_notices_signs_test1.png",
      type: "Ảnh PNG",
      size: "1.2 MB",
      part: "Part 1 (Biển báo)",
      uploadedAt: "24/09/2026",
      status: "Sử dụng trong 2 đề",
    },
    {
      name: "huong_dan_chuan_dau_ra_2026.pdf",
      type: "Tài liệu PDF",
      size: "3.5 MB",
      part: "Cẩm nang sinh viên",
      uploadedAt: "20/09/2026",
      status: "Công khai tải về",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
            Tài liệu & File nghe Audio
          </h1>
          <p className="text-sm text-muted mt-1">
            Quản lý kho file audio nghe cho khối Listening (Part 10 - 14) và hình ảnh đề thi.
          </p>
        </div>
        <Button variant="primary" size="sm" className="gap-1.5 text-xs font-semibold">
          <Upload className="h-3.5 w-3.5" />
          <span>Tải file lên</span>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface-raised/50 text-xs font-heading text-muted">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Tên tệp</th>
                  <th className="py-3.5 px-4 font-semibold">Định dạng</th>
                  <th className="py-3.5 px-4 font-semibold">Dung lượng</th>
                  <th className="py-3.5 px-4 font-semibold">Phần thi gắn kết</th>
                  <th className="py-3.5 px-4 font-semibold">Ngày tải lên</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Trạng thái</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {documents.map((doc, idx) => (
                  <tr key={idx} className="hover:bg-surface-raised/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        {doc.type.includes("Audio") ? (
                          <FileAudio className="h-4 w-4 text-primary shrink-0" />
                        ) : doc.type.includes("Ảnh") ? (
                          <Image className="h-4 w-4 text-secondary shrink-0" />
                        ) : (
                          <FileText className="h-4 w-4 text-muted shrink-0" />
                        )}
                        <span className="font-mono text-xs text-foreground font-semibold">{doc.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-muted font-medium">{doc.type}</td>
                    <td className="py-3.5 px-4 text-xs text-muted font-mono">{doc.size}</td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-primary">{doc.part}</td>
                    <td className="py-3.5 px-4 text-xs text-muted">{doc.uploadedAt}</td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant="secondary" className="text-[11px]">{doc.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 min-h-0 min-w-0" title="Tải xuống">
                        <Download className="h-3.5 w-3.5 text-muted hover:text-foreground" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
