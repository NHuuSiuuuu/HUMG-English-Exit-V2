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
 * Thanh điều khiển bộ lọc, tìm kiếm và chuyển đổi 3 kiểu xem (Lưới, Gom nhóm, Danh sách)
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
    <div className="bg-[var(--surface-paper)] border border-[var(--border-subtle)] rounded-lg p-3.5 space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Tìm kiếm */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo tên bài hoặc nguồn đề..."
            className="w-full min-h-[44px] pl-9 pr-3 rounded border border-[var(--border-subtle)] bg-[var(--surface-bg)] text-xs sm:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none focus:border-[var(--color-navy)]"
          />
        </div>

        {/* Lọc theo Trạng thái & Chuyển kiểu xem */}
        <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap">
          {/* Lọc trạng thái */}
          <div className="flex items-center gap-1 bg-[var(--surface-bg)] p-1 rounded border border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={() => onSelectStatus("all")}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all min-h-[36px] ${
                selectedStatus === "all"
                  ? "bg-white dark:bg-slate-800 text-[var(--color-navy)] dark:text-sky-300 shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => onSelectStatus("uncompleted")}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all min-h-[36px] ${
                selectedStatus === "uncompleted"
                  ? "bg-white dark:bg-slate-800 text-[var(--color-navy)] dark:text-sky-300 shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Chưa làm
            </button>
            <button
              type="button"
              onClick={() => onSelectStatus("completed")}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all min-h-[36px] ${
                selectedStatus === "completed"
                  ? "bg-white dark:bg-slate-800 text-[var(--color-navy)] dark:text-sky-300 shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Đã làm
            </button>
          </div>

          {/* Nút chuyển 3 kiểu xem */}
          <div className="flex items-center gap-1 bg-[var(--surface-bg)] p-1 rounded border border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              title="Xem dạng lưới"
              className={`p-1.5 rounded transition-all min-h-[36px] min-w-[36px] flex items-center justify-center ${
                viewMode === "grid"
                  ? "bg-white dark:bg-slate-800 text-[var(--color-navy)] dark:text-sky-300 shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("grouped")}
              title="Gom nhóm theo bộ đề"
              className={`p-1.5 rounded transition-all min-h-[36px] min-w-[36px] flex items-center justify-center ${
                viewMode === "grouped"
                  ? "bg-white dark:bg-slate-800 text-[var(--color-navy)] dark:text-sky-300 shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              title="Xem danh sách gọn"
              className={`p-1.5 rounded transition-all min-h-[36px] min-w-[36px] flex items-center justify-center ${
                viewMode === "list"
                  ? "bg-white dark:bg-slate-800 text-[var(--color-navy)] dark:text-sky-300 shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <ListFilter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Dải tab lọc theo nhóm bộ đề */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[var(--text-secondary)] font-medium shrink-0 mr-1">Bộ đề:</span>
        {groups.map((grp) => (
          <button
            key={grp}
            type="button"
            onClick={() => onSelectGroup(grp)}
            className={`px-3 py-1.5 rounded-full border whitespace-nowrap font-medium transition-all ${
              selectedGroup === grp
                ? "bg-[var(--color-navy)] text-white border-[var(--color-navy)] shadow-sm"
                : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {grp}
          </button>
        ))}
      </div>
    </div>
  );
}
