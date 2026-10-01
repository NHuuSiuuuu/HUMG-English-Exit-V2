"use client";

import React from "react";
import { LayoutGrid, Layers, ListFilter, Search } from "lucide-react";

export type ViewMode = "grid" | "grouped" | "list";

interface ViewControlsProps {
  groups: string[];
  selectedGroup: string;
  onSelectGroup: (group: string) => void;
  selectedStatus: "all" | "completed" | "uncompleted";
  onSelectStatus: (status: "all" | "completed" | "uncompleted") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

/**
 * Thanh điều khiển bộ lọc, tìm kiếm và chuyển đổi 3 kiểu xem phong cách TADR OU:
 * Nút bo tròn mềm mại rounded-xl / pill, màu sắc tươi sáng, bóng đổ siêu nhẹ
 */
export function ViewControls({
  groups,
  selectedGroup,
  onSelectGroup,
  selectedStatus,
  onSelectStatus,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
}: ViewControlsProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-slate-100 dark:border-slate-800/80 space-y-3.5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Tìm kiếm */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo tên bài hoặc nguồn đề..."
            className="w-full min-h-[44px] pl-10 pr-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#0095F6] transition-all duration-300 ease-in-out"
          />
        </div>

        {/* Lọc theo Trạng thái & Chuyển kiểu xem */}
        <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap">
          {/* Lọc trạng thái (Pill tabs) */}
          <div className="flex items-center gap-1 bg-slate-100/70 dark:bg-slate-800/60 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => onSelectStatus("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ease-in-out min-h-[34px] ${
                selectedStatus === "all"
                  ? "bg-white dark:bg-slate-700 text-[#0095F6] dark:text-sky-300 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => onSelectStatus("uncompleted")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ease-in-out min-h-[34px] ${
                selectedStatus === "uncompleted"
                  ? "bg-white dark:bg-slate-700 text-[#0095F6] dark:text-sky-300 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              Chưa làm
            </button>
            <button
              type="button"
              onClick={() => onSelectStatus("completed")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ease-in-out min-h-[34px] ${
                selectedStatus === "completed"
                  ? "bg-white dark:bg-slate-700 text-[#0095F6] dark:text-sky-300 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              Đã làm
            </button>
          </div>

          {/* Nút chuyển 3 kiểu xem */}
          <div className="flex items-center gap-1 bg-slate-100/70 dark:bg-slate-800/60 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              title="Xem dạng lưới"
              className={`p-1.5 rounded-lg transition-all duration-300 ease-in-out min-h-[34px] min-w-[34px] flex items-center justify-center ${
                viewMode === "grid"
                  ? "bg-white dark:bg-slate-700 text-[#0095F6] dark:text-sky-300 shadow-sm"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("grouped")}
              title="Gom nhóm theo bộ đề"
              className={`p-1.5 rounded-lg transition-all duration-300 ease-in-out min-h-[34px] min-w-[34px] flex items-center justify-center ${
                viewMode === "grouped"
                  ? "bg-white dark:bg-slate-700 text-[#0095F6] dark:text-sky-300 shadow-sm"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              title="Xem danh sách gọn"
              className={`p-1.5 rounded-lg transition-all duration-300 ease-in-out min-h-[34px] min-w-[34px] flex items-center justify-center ${
                viewMode === "list"
                  ? "bg-white dark:bg-slate-700 text-[#0095F6] dark:text-sky-300 shadow-sm"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
            >
              <ListFilter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Dải tab lọc theo nhóm bộ đề dạng Pill Tags */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-medium shrink-0 mr-1">Bộ đề:</span>
        {groups.map((grp) => (
          <button
            key={grp}
            type="button"
            onClick={() => onSelectGroup(grp)}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap font-medium transition-all duration-300 ease-in-out ${
              selectedGroup === grp
                ? "bg-[#0095F6] text-white shadow-[0_2px_0_0_#0275ba]"
                : "bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80"
            }`}
          >
            {grp}
          </button>
        ))}
      </div>
    </div>
  );
}
