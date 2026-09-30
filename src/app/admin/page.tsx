import * as React from "react";
import Link from "next/link";
import {
  Users,
  Clock,
  Database,
  FileCheck,
  Plus,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";

export default function AdminDashboardPage() {
  const stats = [
    {
      title: "Tổng sinh viên đăng ký",
      value: "1,428",
      change: "+12% tuần này",
      icon: Users,
      color: "text-primary bg-primary/10",
    },
    {
      title: "Tổng lượt thi thử",
      value: "3,892",
      change: "68.4% đạt chuẩn A2",
      icon: Clock,
      color: "text-secondary bg-secondary/15",
    },
    {
      title: "Kho phần (Part bank)",
      value: "72",
      change: "Đủ 14 dạng bài KET",
      icon: Database,
      color: "text-accent bg-accent/10",
    },
    {
      title: "Bộ đề thi hoàn chỉnh",
      value: "5 đề",
      change: "Tất cả đang công khai",
      icon: FileCheck,
      color: "text-success bg-success/15",
    },
  ];

  const popularExams = [
    {
      id: "de-01",
      title: "Đề thi thử Chuẩn đầu ra số 01",
      code: "KET-2026-T1",
      attempts: 1420,
      avgScore: "72/100",
      passRate: "71%",
      status: "Công khai",
    },
    {
      id: "de-02",
      title: "Đề thi thử Chuẩn đầu ra số 02",
      code: "KET-2026-T2",
      attempts: 980,
      avgScore: "68/100",
      passRate: "66%",
      status: "Công khai",
    },
    {
      id: "de-03",
      title: "Đề thi thử Chuẩn đầu ra số 03",
      code: "KET-2026-T3",
      attempts: 742,
      avgScore: "65/100",
      passRate: "62%",
      status: "Công khai",
    },
  ];

  const recentUsers = [
    {
      name: "Nguyễn Văn An",
      studentId: "2121050123",
      email: "an.nv@humg.edu.vn",
      joined: "10 phút trước",
      examsTaken: 2,
    },
    {
      name: "Trần Thị Mai",
      studentId: "2221050456",
      email: "mai.tt@humg.edu.vn",
      joined: "35 phút trước",
      examsTaken: 1,
    },
    {
      name: "Lê Hoàng Long",
      studentId: "2021050890",
      email: "long.lh@humg.edu.vn",
      joined: "2 giờ trước",
      examsTaken: 4,
    },
    {
      name: "Phạm Thu Hương",
      studentId: "2221050321",
      email: "huong.pt@humg.edu.vn",
      joined: "4 giờ trước",
      examsTaken: 3,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Tiêu đề & Nút thao tác nhanh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
            Tổng quan hệ thống
          </h1>
          <p className="text-sm text-muted mt-1">
            Theo dõi tình hình ôn luyện, lượt thi thử và quản trị nội dung học tập.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/part-bank">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
              <Plus className="h-3.5 w-3.5" />
              <span>Thêm Part mới</span>
            </Button>
          </Link>
          <Link href="/admin/de-thi">
            <Button variant="primary" size="sm" className="gap-1.5 text-xs font-semibold">
              <Plus className="h-3.5 w-3.5" />
              <span>Ghép đề thi mới</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Thẻ chỉ số tổng quan (AD-01) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card key={idx} className="p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-muted">{item.title}</span>
                <div className={`p-2 rounded-lg ${item.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div>
                <span className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground">
                  {item.value}
                </span>
                <p className="text-xs text-secondary font-medium mt-1">
                  {item.change}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Bảng Đề thi & Người dùng mới */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cột trái: Đề thi được làm nhiều nhất */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg">Đề thi thử được làm nhiều nhất</CardTitle>
                <CardDescription className="text-xs">
                  Thống kê lượt thi và tỷ lệ đạt chuẩn của sinh viên
                </CardDescription>
              </div>
              <Link href="/admin/de-thi">
                <Button variant="ghost" size="sm" className="text-xs gap-1 text-primary">
                  <span>Quản lý đề</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-xs text-muted font-heading">
                      <th className="pb-3 font-semibold">Tên đề thi</th>
                      <th className="pb-3 font-semibold text-center">Lượt thi</th>
                      <th className="pb-3 font-semibold text-center">Điểm TB</th>
                      <th className="pb-3 font-semibold text-right">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {popularExams.map((exam) => (
                      <tr key={exam.id} className="hover:bg-surface-raised/40 transition-colors">
                        <td className="py-3">
                          <p className="font-semibold text-foreground text-xs sm:text-sm">{exam.title}</p>
                          <span className="text-[11px] text-muted font-mono">{exam.code}</span>
                        </td>
                        <td className="py-3 text-center text-xs font-semibold text-foreground">
                          {exam.attempts}
                        </td>
                        <td className="py-3 text-center text-xs font-semibold text-secondary">
                          {exam.avgScore}
                        </td>
                        <td className="py-3 text-right">
                          <Badge variant="success" className="text-[11px]">
                            {exam.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Trạng thái hệ thống */}
          <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
            <h3 className="font-heading font-bold text-sm text-foreground">Trạng thái kết nối ngoại vi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2.5 p-3 rounded-md bg-surface-raised border border-border">
                <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Cổng CFI HUMG</p>
                  <p className="text-muted">kqt.cfi.humg.edu.vn sẵn sàng</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-md bg-surface-raised border border-border">
                <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Đồng hồ Server Timer</p>
                  <p className="text-muted">Đồng bộ chính xác 60 phút</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải: Sinh viên mới đăng ký */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg">Sinh viên mới đăng ký</CardTitle>
                <CardDescription className="text-xs">
                  Danh sách sinh viên vừa tạo tài khoản
                </CardDescription>
              </div>
              <Link href="/admin/nguoi-dung">
                <Button variant="ghost" size="sm" className="text-xs gap-1 text-primary">
                  <span>Xem tất cả</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentUsers.map((user, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-md border border-border bg-surface hover:bg-surface-raised/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{user.name}</p>
                        <p className="text-[11px] text-muted font-mono">MSV: {user.studentId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-muted block">{user.joined}</span>
                      <span className="text-[11px] font-semibold text-secondary">
                        {user.examsTaken} bài thi
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Card phím tắt kho phần */}
          <Card className="p-5 border border-primary/20 bg-primary/5">
            <h4 className="font-heading font-bold text-sm text-foreground mb-1">
              Kho phần đề thi (Part bank)
            </h4>
            <p className="text-xs text-muted leading-relaxed mb-4">
              Quản lý các khối độc lập bám theo định dạng Cambridge KET. Nhập 1 lần và ghép vào nhiều đề thi khác nhau.
            </p>
            <Link href="/admin/part-bank">
              <Button size="sm" className="w-full text-xs font-semibold gap-1.5">
                <Database className="h-3.5 w-3.5" />
                <span>Xem 72 phần trong kho</span>
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
