"use client";

import Link from "next/link";
import type { Route } from "next";
import { useActionState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  habitFrequencyLabels,
  habitStatusLabels
} from "@/features/habits/habit-helpers";
import { createHabitAction } from "@/features/habits/actions/create-habit";
import { getInitialHabitFormActionState } from "@/features/habits/actions/shared";
import { updateHabitAction } from "@/features/habits/actions/update-habit";
import type {
  HabitFormValues,
  HabitGoalOption
} from "@/features/habits/types";

type HabitFormProps = {
  cancelHref: Route;
  goalOptions: HabitGoalOption[];
  habitId?: string;
  initialValues?: Partial<HabitFormValues>;
  mode: "create" | "edit";
};

const textareaClassName =
  "min-h-28 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10";

export function HabitForm({
  cancelHref,
  goalOptions,
  habitId,
  initialValues,
  mode
}: HabitFormProps) {
  const initialState = useMemo(
    () => getInitialHabitFormActionState(initialValues),
    [initialValues]
  );
  const serverAction = mode === "edit" ? updateHabitAction : createHabitAction;
  const [state, formAction, isPending] = useActionState(
    serverAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      {habitId ? <input name="habitId" type="hidden" value={habitId} /> : null}

      <div>
        <h2 className="mt-3 text-3xl font-black text-stone-950">
          {mode === "edit" ? "Cập nhật thói quen" : "Tạo thói quen mới"}
        </h2>
      </div>

      {state.status === "error" && state.message ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Tên thói quen
          </span>
          <Input defaultValue={state.values.title} name="title" />
          {state.fieldErrors?.title?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">
              {state.fieldErrors.title[0]}
            </p>
          ) : null}
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Mô tả
          </span>
          <textarea
            className={textareaClassName}
            defaultValue={state.values.description}
            name="description"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Mục tiêu liên kết
          </span>
          <select
            className="h-11 w-full rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
            defaultValue={state.values.goalId}
            name="goalId"
          >
            <option value="">Không liên kết mục tiêu</option>
            {goalOptions.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.title}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Tần suất
          </span>
          <select
            className="h-11 w-full rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
            defaultValue={state.values.frequency}
            name="frequency"
          >
            {Object.entries(habitFrequencyLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Mục tiêu mỗi kỳ
          </span>
          <Input
            defaultValue={state.values.targetCount}
            min="1"
            name="targetCount"
            type="number"
          />
          {state.fieldErrors?.targetCount?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">
              {state.fieldErrors.targetCount[0]}
            </p>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Đơn vị
          </span>
          <Input defaultValue={state.values.unit} name="unit" placeholder="lần" />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Giờ nhắc
          </span>
          <Input
            defaultValue={state.values.reminderTime}
            name="reminderTime"
            type="time"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Trạng thái
          </span>
          <select
            className="h-11 w-full rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
            defaultValue={state.values.status}
            name="status"
          >
            {Object.entries(habitStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Ngày bắt đầu
          </span>
          <Input
            defaultValue={state.values.startDate}
            name="startDate"
            type="date"
          />
          {state.fieldErrors?.startDate?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">
              {state.fieldErrors.startDate[0]}
            </p>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">
            Ngày kết thúc
          </span>
          <Input defaultValue={state.values.endDate} name="endDate" type="date" />
          {state.fieldErrors?.endDate?.[0] ? (
            <p className="mt-2 text-sm text-rose-600">
              {state.fieldErrors.endDate[0]}
            </p>
          ) : null}
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={isPending} type="submit">
          {mode === "edit"
            ? isPending
              ? "Đang cập nhật..."
              : "Cập nhật thói quen"
            : isPending
              ? "Đang tạo..."
              : "Tạo thói quen"}
        </Button>
        <Link
          className="inline-flex h-10 items-center justify-center rounded-2xl border border-stone-300 px-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 hover:text-stone-950"
          href={cancelHref}
        >
          Hủy
        </Link>
      </div>
    </form>
  );
}
