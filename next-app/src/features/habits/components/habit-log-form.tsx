"use client";

import { useActionState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getInitialHabitLogFormActionState
} from "@/features/habits/actions/shared";
import { upsertHabitLogAction } from "@/features/habits/actions/upsert-habit-log";
import type { HabitLogFormValues } from "@/features/habits/types";
import { cn } from "@/lib/utils";

type HabitLogFormProps = {
  habitId: string;
  initialValues?: Partial<HabitLogFormValues>;
  targetCount: number;
  unit: string;
};

const inputClassName =
  "h-11 rounded-lg border-stone-300 bg-white shadow-sm";
const textareaClassName =
  "min-h-24 w-full rounded-lg border border-stone-300 bg-white px-3 py-3 text-sm text-stone-950 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10";

export function HabitLogForm({
  habitId,
  initialValues,
  targetCount,
  unit
}: HabitLogFormProps) {
  const initialState = useMemo(
    () => getInitialHabitLogFormActionState(initialValues),
    [initialValues]
  );
  const [state, formAction, isPending] = useActionState(
    upsertHabitLogAction,
    initialState
  );
  const dateError = state.fieldErrors?.logDate?.[0];
  const completedCountError = state.fieldErrors?.completedCount?.[0];
  const noteError = state.fieldErrors?.note?.[0];
  const countHintId = `habit-log-count-hint-${habitId}`;

  return (
    <form action={formAction} className="space-y-4">
      <input name="habitId" type="hidden" value={habitId} />

      <div className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500">
          Mục tiêu mỗi chu kỳ
        </p>
        <p className="mt-1 text-lg font-black text-stone-950">
          {targetCount} {unit}
        </p>
      </div>

      {state.message ? (
        <div
          aria-live="polite"
          className={cn(
            "rounded-lg border px-4 py-3 text-sm font-medium",
            state.status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          )}
        >
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Ngày ghi nhật ký
          </span>
          <Input
            className={inputClassName}
            defaultValue={state.values.logDate}
            name="logDate"
            type="date"
          />
          {dateError ? <p className="mt-2 text-sm text-rose-600">{dateError}</p> : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Số lần hoàn thành
          </span>
          <Input
            aria-describedby={countHintId}
            className={inputClassName}
            defaultValue={state.values.completedCount}
            min="0"
            name="completedCount"
            type="number"
          />
          <p className="mt-2 text-xs text-stone-500" id={countHintId}>
            Nhập từ 0 trở lên. Đạt mục tiêu khi bằng hoặc vượt {targetCount} {unit}.
          </p>
          {completedCountError ? (
            <p className="mt-2 text-sm text-rose-600">{completedCountError}</p>
          ) : null}
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-stone-700">
          Ghi chú
        </span>
        <textarea
          className={textareaClassName}
          defaultValue={state.values.note}
          maxLength={10000}
          name="note"
          placeholder="Điều gì giúp hoặc cản nhịp hôm nay?"
        />
        {noteError ? <p className="mt-2 text-sm text-rose-600">{noteError}</p> : null}
      </label>

      <Button
        aria-busy={isPending}
        className="rounded-lg !text-white"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Đang lưu nhật ký..." : "Lưu nhật ký"}
      </Button>
    </form>
  );
}
