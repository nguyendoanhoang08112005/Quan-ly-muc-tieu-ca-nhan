"use client";

import { ChevronDown, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GoalForm } from "@/features/goals/components/goal-form";
import type { GoalMetadataOption } from "@/features/goals/types";

type GoalsInlineCreatePanelProps = {
  categories: GoalMetadataOption[];
  initialOpen: boolean;
  tags: GoalMetadataOption[];
  wasJustCreated: boolean;
};

export function GoalsInlineCreatePanel({
  categories,
  initialOpen,
  tags,
  wasJustCreated
}: GoalsInlineCreatePanelProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-stone-200 bg-[linear-gradient(180deg,#ffffff_0%,#f6f6f3_100%)] shadow-sm">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/80" />
      <div className="pointer-events-none absolute -left-10 top-6 h-24 w-24 rounded-full bg-emerald-100/50 blur-2xl" />
      {wasJustCreated ? (
        <div className="border-b border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-800">
          Đã tạo mục tiêu mới.
        </div>
      ) : null}

      {!isOpen ? (
        <div className="relative flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-stone-500">
              Tạo Mới
            </p>
            <h2 className="text-xl font-black tracking-tight text-stone-950">
              Tạo mục tiêu ngay tại đây
            </h2>
            <p className="text-sm text-stone-600">
              Mở form ngắn gọn, nhập phần cốt lõi trước rồi bổ sung sau.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button className="gap-2 rounded-full" onClick={() => setIsOpen(true)}>
              <Plus className="h-4 w-4" />
              Tạo mục tiêu mới
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative px-5 py-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-600 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Form tạo mục tiêu
            </div>

            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 hover:text-stone-950"
              type="button"
              onClick={() => setIsOpen(false)}
            >
              Thu gọn
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <GoalForm
            categories={categories}
            description="Nhập thông tin chính trước. Tuỳ chọn thêm có thể mở sau."
            mode="create"
            onCancel={() => setIsOpen(false)}
            redirectTo="/goals?created=1"
            tags={tags}
            title="Tạo mục tiêu mới"
          />
        </div>
      )}
    </section>
  );
}
