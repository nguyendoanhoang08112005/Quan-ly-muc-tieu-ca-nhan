"use client";

import { ChevronDown, PawPrint, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { PawTrail } from "@/components/ornaments/paw-trail";
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
    <section className="relative overflow-hidden rounded-[2rem] border border-[#e8dfd5] bg-white shadow-[0_18px_42px_-36px_rgba(28,25,23,0.24)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/80" />
      <div className="pointer-events-none absolute -left-10 top-6 h-24 w-24 rounded-full bg-[#edf5e8] blur-2xl" />
      <PawTrail className="right-10 top-8 h-20 w-[12rem]" variant="bamboo" />
      {wasJustCreated ? (
        <div className="border-b border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-800">
          Đã tạo mục tiêu mới.
        </div>
      ) : null}

      {!isOpen ? (
        <div className="relative grid gap-4 px-5 py-5 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d8e6cf] bg-[#f5fbf1] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#62814f]">
              <PawPrint className="h-3.5 w-3.5" />
              Gấu trúc mở form
            </div>
            <h2 className="text-xl font-black tracking-tight text-stone-950">
              Tạo mục tiêu ngay tại đây
            </h2>
            <p className="text-sm text-stone-600">Mở form ngắn, nhập phần chính trước.</p>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <div className="rounded-[1.3rem] border border-[#dfead8] bg-[#f8fcf5] px-4 py-3 text-sm text-stone-700 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-stone-500">
                Form
              </div>
              <p className="mt-1 font-semibold text-stone-950">Đang thu gọn</p>
            </div>
            <Button
              className="gap-2 rounded-full bg-stone-950 text-white hover:bg-stone-800"
              onClick={() => setIsOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Tạo mục tiêu mới
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative px-5 py-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d8e6cf] bg-[#f5fbf1] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#62814f] shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Form mục tiêu
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
