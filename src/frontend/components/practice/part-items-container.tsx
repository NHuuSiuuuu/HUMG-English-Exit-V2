"use client";

import React, { useState, useMemo } from "react";
import type { PracticeItemSummary } from "@/shared/types/practice";
import { ViewControls, type ViewMode } from "./view-controls";
import { PracticeItemCard } from "./practice-item-card";
import { SearchX } from "lucide-react";

interface PartItemsContainerProps {
  initialItems: PracticeItemSummary[];
}

/**
 * Container phía Client xử lý bộ lọc, tìm kiếm và chuyển đổi 3 kiểu xem của Part
 */
export function PartItemsContainer({ initialItems }: PartItemsContainerProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>("Tất cả");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "completed" | "uncompleted">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Danh sách các bộ đề có sẵn
  const availableGroups = useMemo(() => {
    const set = new Set<string>(["Tất cả"]);
    initialItems.forEach((item) => set.add(item.groupSet));
    return Array.from(set);
  }, [initialItems]);

  // Danh sách đã lọc theo điều kiện
  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      // Lọc nhóm đề
      if (selectedGroup !== "Tất cả" && item.groupSet !== selectedGroup) {
        return false;
      }
      // Lọc trạng thái
      if (selectedStatus === "completed" && !item.isCompleted) return false;
      if (selectedStatus === "uncompleted" && item.isCompleted) return false;

      // Lọc từ khóa
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchSource = item.sourceLabel.toLowerCase().includes(q);
        if (!matchTitle && !matchSource) return false;
      }
      return true;
    });
  }, [initialItems, selectedGroup, selectedStatus, searchQuery]);

  // Gom nhóm theo bộ đề khi ở chế độ viewMode = "grouped"
  const groupedItems = useMemo(() => {
    const groups: Record<string, PracticeItemSummary[]> = {};
    filteredItems.forEach((item) => {
      if (!groups[item.groupSet]) {
        groups[item.groupSet] = [];
      }
      groups[item.groupSet].push(item);
    });
    return groups;
  }, [filteredItems]);

  return (
    <div className="space-y-6">
      {/* Bảng điều khiển bộ lọc & kiểu xem */}
      <ViewControls
        groups={availableGroups}
        selectedGroup={selectedGroup}
        onSelectGroup={setSelectedGroup}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Hiển thị kết quả rỗng (Empty State) */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 px-4 bg-[var(--surface-paper)] border border-[var(--border-subtle)] rounded-lg">
          <SearchX className="w-10 h-10 text-[var(--text-secondary)] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Không tìm thấy bài luyện tập nào
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-sm mx-auto">
            Vui lòng thử đổi từ khóa tìm kiếm hoặc bỏ bớt các tiêu chí lọc trạng thái và bộ đề.
          </p>
        </div>
      ) : viewMode === "grouped" ? (
        /* Chế độ Gom nhóm theo bộ đề */
        <div className="space-y-8">
          {Object.entries(groupedItems).map(([groupName, items]) => (
            <div key={groupName} className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                <h3 className="text-sm font-bold text-[var(--color-navy)] dark:text-sky-300">
                  {groupName} ({items.length} bài)
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                  <PracticeItemCard key={item.id} item={item} viewMode="grid" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === "list" ? (
        /* Chế độ Danh sách gọn */
        <div className="space-y-2.5">
          {filteredItems.map((item) => (
            <PracticeItemCard key={item.id} item={item} viewMode="list" />
          ))}
        </div>
      ) : (
        /* Chế độ Lưới (Grid) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <PracticeItemCard key={item.id} item={item} viewMode="grid" />
          ))}
        </div>
      )}
    </div>
  );
}
