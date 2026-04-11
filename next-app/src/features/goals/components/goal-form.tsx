"use client";

import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { useActionState, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createGoalAction } from "@/features/goals/actions/create-goal";
import { getInitialGoalFormActionState } from "@/features/goals/actions/shared";
import { updateGoalAction } from "@/features/goals/actions/update-goal";
import {
  goalPriorityLabels,
  goalStatusLabels,
  goalTypeLabels
} from "@/features/goals/goal-helpers";
import type { GoalFormValues, GoalMetadataOption } from "@/features/goals/types";
import { addDaysToDateInput, diffDateInputs } from "@/lib/dates";

type GoalFormProps = {
  cancelHref?: Route;
  categories: GoalMetadataOption[];
  goalId?: string;
  initialValues?: Partial<GoalFormValues>;
  mode: "create" | "edit";
  onCancel?: () => void;
  redirectTo?: string;
  tags: GoalMetadataOption[];
  title?: string;
  description?: string;
};

function SelectField({
  children,
  defaultValue,
  label,
  name,
  error
}: {
  children: ReactNode;
  defaultValue: string;
  error?: string;
  label: string;
  name: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-stone-700">{label}</span>
      <select
        className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm text-stone-950 shadow-sm outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
        defaultValue={defaultValue}
        name={name}
      >
        {children}
      </select>
      {error ? <p className="mt-2 text-sm text-rose-600">{error}</p> : null}
    </label>
  );
}

export function GoalForm({
  cancelHref,
  categories,
  goalId,
  initialValues,
  mode,
  onCancel,
  redirectTo,
  title,
  description,
  tags
}: GoalFormProps) {
  const initialState = useMemo(
    () => getInitialGoalFormActionState(initialValues),
    [initialValues]
  );
  const serverAction = mode === "edit" ? updateGoalAction : createGoalAction;
  const [state, formAction, isPending] = useActionState(
    serverAction,
    initialState
  );
  const [startDate, setStartDate] = useState(state.values.startDate);
  const [targetDate, setTargetDate] = useState(state.values.targetDate);
  const [showAdvanced, setShowAdvanced] = useState(mode === "edit");
  const timelineDays = diffDateInputs(startDate, targetDate);
  const submitLabel =
    mode === "edit"
      ? isPending
        ? "Đang cập nhật..."
        : "Lưu thay đổi"
      : isPending
        ? "Đang tạo..."
        : "Tạo mục tiêu";

  return (
    <form action={formAction} className="space-y-5">
      {goalId ? <input name="goalId" type="hidden" value={goalId} /> : null}
      {redirectTo ? <input name="redirectTo" type="hidden" value={redirectTo} /> : null}

      <div className="flex flex-col gap-2">
        <h2 className="text-[2rem] font-black leading-tight text-stone-950">
          {title ?? (mode === "edit" ? "Cập nhật mục tiêu" : "Mục tiêu mới")}
        </h2>
        {description ? (
          <p className="max-w-2xl text-sm leading-6 text-stone-600">{description}</p>
        ) : null}
      </div>

      {state.status === "error" && state.message ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {state.message}
        </div>
      ) : null}

      <section className="space-y-4 rounded-[1.75rem] border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-stone-500">
              Thông Tin Chính
            </p>
            <p className="mt-1 text-sm text-stone-600">
              Chỉ cần tên, thời gian và độ ưu tiên là đủ để bắt đầu.
            </p>
          </div>
          {timelineDays !== null ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1.5 text-sm font-semibold text-stone-700">
              <Clock3 className="h-4 w-4" />
              {timelineDays} ngày
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-stone-700">
              Tên mục tiêu
            </span>
            <Input
              defaultValue={state.values.title}
              name="title"
              placeholder="Ví dụ: Hoàn thành dashboard quản lý mục tiêu"
            />
            {state.fieldErrors?.title?.[0] ? (
              <p className="mt-2 text-sm text-rose-600">{state.fieldErrors.title[0]}</p>
            ) : null}
          </label>

          <label className="block md:col-span-2">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="block text-sm font-semibold text-stone-700">Mô tả ngắn</span>
              <span className="text-xs text-stone-400">Tuỳ chọn</span>
            </div>
            <Textarea
              defaultValue={state.values.description}
              name="description"
              placeholder="Kết quả mong muốn là gì?"
              rows={3}
            />
            {state.fieldErrors?.description?.[0] ? (
              <p className="mt-2 text-sm text-rose-600">
                {state.fieldErrors.description[0]}
              </p>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-stone-700">
              Ngày bắt đầu
            </span>
            <Input
              name="startDate"
              onChange={(event) => {
                const nextStartDate = event.target.value;
                setStartDate(nextStartDate);

                if (targetDate && nextStartDate > targetDate) {
                  setTargetDate(nextStartDate);
                }
              }}
              type="date"
              value={startDate}
            />
            {state.fieldErrors?.startDate?.[0] ? (
              <p className="mt-2 text-sm text-rose-600">
                {state.fieldErrors.startDate[0]}
              </p>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-stone-700">
              Hạn hoàn thành
            </span>
            <Input
              name="targetDate"
              onChange={(event) => setTargetDate(event.target.value)}
              type="date"
              value={targetDate}
            />
            {state.fieldErrors?.targetDate?.[0] ? (
              <p className="mt-2 text-sm text-rose-600">
                {state.fieldErrors.targetDate[0]}
              </p>
            ) : null}
          </label>

          <div className="md:col-span-2">
            <div className="flex flex-wrap gap-2">
              {[7, 30, 90].map((days) => (
                <button
                  className="rounded-full border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-600 transition hover:border-stone-900 hover:text-stone-950"
                  key={days}
                  onClick={() => setTargetDate(addDaysToDateInput(startDate, days))}
                  type="button"
                >
                  +{days} ngày
                </button>
              ))}
            </div>
          </div>

          <SelectField
            defaultValue={state.values.priority}
            error={state.fieldErrors?.priority?.[0]}
            label="Độ ưu tiên"
            name="priority"
          >
            {Object.entries(goalPriorityLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectField>

          <SelectField
            defaultValue={state.values.goalType}
            error={state.fieldErrors?.goalType?.[0]}
            label="Loại mục tiêu"
            name="goalType"
          >
            {Object.entries(goalTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectField>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-4">
        <button
          className="flex w-full items-center justify-between gap-3 text-left"
          onClick={() => setShowAdvanced((current) => !current)}
          type="button"
        >
          <div>
            <p className="text-sm font-semibold text-stone-900">Tuỳ chọn thêm</p>
            <p className="text-sm text-stone-500">Trạng thái, danh mục, thẻ, ghi chú, công khai</p>
          </div>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-stone-700 shadow-sm">
            {showAdvanced ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </span>
        </button>

        {showAdvanced ? (
          <div className="mt-4 grid gap-4 border-t border-stone-200 pt-4 md:grid-cols-2">
            <SelectField
              defaultValue={state.values.status}
              error={state.fieldErrors?.status?.[0]}
              label="Trạng thái"
              name="status"
            >
              {Object.entries(goalStatusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </SelectField>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-stone-700">
                Danh mục
              </span>
              <select
                className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm text-stone-950 shadow-sm outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
                defaultValue={state.values.categoryId}
                name="categoryId"
              >
                <option value="">Không gắn danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {state.fieldErrors?.categoryId?.[0] ? (
                <p className="mt-2 text-sm text-rose-600">
                  {state.fieldErrors.categoryId[0]}
                </p>
              ) : null}
            </label>

            <label className="block md:col-span-2">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="block text-sm font-semibold text-stone-700">Thẻ</span>
                <span className="text-xs text-stone-400">{tags.length} thẻ</span>
              </div>
              <div className="flex flex-wrap gap-2 rounded-[1.5rem] border border-stone-200 bg-white p-3">
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <label
                      className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-3 py-2 text-sm text-stone-700"
                      key={tag.id}
                    >
                      <input
                        className="h-4 w-4 rounded border-stone-300"
                        defaultChecked={state.values.tagIds.includes(tag.id)}
                        name="tagIds"
                        type="checkbox"
                        value={tag.id}
                      />
                      <span>{tag.name}</span>
                    </label>
                  ))
                ) : (
                  <div className="text-sm text-stone-500">Chưa có thẻ nào.</div>
                )}
              </div>
              {state.fieldErrors?.tagIds?.[0] ? (
                <p className="mt-2 text-sm text-rose-600">{state.fieldErrors.tagIds[0]}</p>
              ) : null}
            </label>

            <label className="block md:col-span-2">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="block text-sm font-semibold text-stone-700">Ghi chú</span>
                <span className="text-xs text-stone-400">Tuỳ chọn</span>
              </div>
              <Textarea
                defaultValue={state.values.note}
                name="note"
                placeholder="Ràng buộc, tài nguyên, lưu ý..."
                rows={3}
              />
              {state.fieldErrors?.note?.[0] ? (
                <p className="mt-2 text-sm text-rose-600">{state.fieldErrors.note[0]}</p>
              ) : null}
            </label>

            <label className="flex items-start gap-3 rounded-[1.5rem] border border-stone-200 bg-white px-4 py-4 md:col-span-2">
              <input
                className="mt-1 h-4 w-4 rounded border-stone-300"
                defaultChecked={state.values.isPublic}
                name="isPublic"
                type="checkbox"
              />
              <span>
                <span className="block text-sm font-semibold text-stone-800">
                  Công khai mục tiêu
                </span>
                <span className="mt-1 block text-sm text-stone-500">
                  Hiển thị trong khu vực Follow.
                </span>
              </span>
            </label>
          </div>
        ) : null}
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={isPending} size="lg" type="submit">
          {submitLabel}
        </Button>
        {onCancel ? (
          <button
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-stone-300 px-5 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 hover:text-stone-950"
            onClick={onCancel}
            type="button"
          >
            Hủy
          </button>
        ) : cancelHref ? (
          <Link
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-stone-300 px-5 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 hover:text-stone-950"
            href={cancelHref}
          >
            Hủy
          </Link>
        ) : null}
      </div>
    </form>
  );
}
