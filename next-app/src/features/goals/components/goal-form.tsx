"use client";

import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { useActionState, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  CircleDot,
  Clock3,
  Flag,
  Layers3,
  Sparkles,
  Target
} from "lucide-react";
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
  error,
  label,
  name,
  onChange
}: {
  children: ReactNode;
  defaultValue: string;
  error?: string;
  label: string;
  name: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-stone-700">{label}</span>
      <select
        className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm text-stone-950 shadow-sm outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
        defaultValue={defaultValue}
        name={name}
        onChange={
          onChange
            ? (event) => {
                onChange(event.target.value);
              }
            : undefined
        }
      >
        {children}
      </select>
      {error ? <p className="mt-2 text-sm text-rose-600">{error}</p> : null}
    </label>
  );
}

function SummaryPill({
  icon,
  label,
  value
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-white/70 bg-white/80 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-2 text-stone-500">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-[0.12em]">{label}</span>
      </div>
      <p className="mt-2 text-sm font-semibold text-stone-900">{value}</p>
    </div>
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
  const [titleValue, setTitleValue] = useState(state.values.title);
  const [priorityValue, setPriorityValue] = useState(state.values.priority);
  const [goalTypeValue, setGoalTypeValue] = useState(state.values.goalType);
  const [statusValue, setStatusValue] = useState(state.values.status);
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
      {!showAdvanced ? <input name="status" type="hidden" value={statusValue} /> : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-5">
          <div className="relative overflow-hidden rounded-[2rem] border border-stone-200 bg-[linear-gradient(180deg,#ffffff_0%,#fafaf8_100%)] p-6 shadow-sm">
            <div className="pointer-events-none absolute -right-8 top-0 h-28 w-28 rounded-full bg-amber-100/60 blur-2xl" />
            <div className="flex flex-col gap-2">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-600 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Tạo Nhanh
              </div>
              <h2 className="text-[2rem] font-black leading-tight text-stone-950">
                {title ?? (mode === "edit" ? "Cập nhật mục tiêu" : "Tạo mục tiêu mới")}
              </h2>
              {description ? (
                <p className="max-w-2xl text-sm leading-6 text-stone-600">{description}</p>
              ) : null}
            </div>

            {state.status === "error" && state.message ? (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {state.message}
              </div>
            ) : null}

            <div className="mt-5 grid gap-4">
              <label className="block">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-stone-700">Tên mục tiêu</span>
                  <span className="text-xs text-stone-400">Quan trọng nhất</span>
                </div>
                <Input
                  defaultValue={state.values.title}
                  name="title"
                  onChange={(event) => setTitleValue(event.target.value)}
                  placeholder="Ví dụ: Ra mắt trang mục tiêu rõ ràng và dễ dùng"
                />
                {state.fieldErrors?.title?.[0] ? (
                  <p className="mt-2 text-sm text-rose-600">{state.fieldErrors.title[0]}</p>
                ) : null}
              </label>

              <label className="block">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-stone-700">Kết quả mong muốn</span>
                  <span className="text-xs text-stone-400">Tuỳ chọn</span>
                </div>
                <Textarea
                  defaultValue={state.values.description}
                  name="description"
                  placeholder="Có thể bỏ trống, hoặc mô tả ngắn kết quả mong muốn"
                  rows={3}
                />
                {state.fieldErrors?.description?.[0] ? (
                  <p className="mt-2 text-sm text-rose-600">
                    {state.fieldErrors.description[0]}
                  </p>
                ) : null}
              </label>
            </div>
          </div>

          <div className="rounded-[2rem] border border-stone-200 bg-[linear-gradient(180deg,#fffefb_0%,#f7f7f4_100%)] p-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500">
                  Khung Thời Gian
                </p>
                <h3 className="mt-1 text-xl font-black text-stone-950">
                  Chọn hạn và mức ưu tiên
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {[7, 30, 90].map((days) => (
                  <button
                    className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-600 transition hover:border-stone-900 hover:text-stone-950"
                    key={days}
                    onClick={() => setTargetDate(addDaysToDateInput(startDate, days))}
                    type="button"
                  >
                    +{days} ngày
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
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

              <SelectField
                defaultValue={priorityValue}
                error={state.fieldErrors?.priority?.[0]}
                label="Độ ưu tiên"
                name="priority"
                onChange={(value) =>
                  setPriorityValue(value as GoalFormValues["priority"])
                }
              >
                {Object.entries(goalPriorityLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </SelectField>

              <SelectField
                defaultValue={goalTypeValue}
                error={state.fieldErrors?.goalType?.[0]}
                label="Loại mục tiêu"
                name="goalType"
                onChange={(value) =>
                  setGoalTypeValue(value as GoalFormValues["goalType"])
                }
              >
                {Object.entries(goalTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </SelectField>
            </div>
          </div>

          <div className="rounded-[2rem] border border-stone-200 bg-[linear-gradient(180deg,#f7f7f4_0%,#f1f1ee_100%)] p-5 shadow-sm">
            <button
              className="flex w-full items-center justify-between gap-3 text-left"
              onClick={() => setShowAdvanced((current) => !current)}
              type="button"
            >
              <div>
                <p className="text-sm font-semibold text-stone-900">Tuỳ chọn nâng cao</p>
                <p className="text-sm text-stone-500">
                  Danh mục, thẻ, trạng thái, ghi chú và hiển thị công khai
                </p>
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
                  defaultValue={statusValue}
                  error={state.fieldErrors?.status?.[0]}
                  label="Trạng thái"
                  name="status"
                  onChange={(value) =>
                    setStatusValue(value as GoalFormValues["status"])
                  }
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
                    <p className="mt-2 text-sm text-rose-600">
                      {state.fieldErrors.tagIds[0]}
                    </p>
                  ) : null}
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-stone-700">
                    Ghi chú
                  </span>
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
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-[2rem] border border-stone-200 bg-[linear-gradient(180deg,#fefefe_0%,#f3f4f6_100%)] p-5 text-stone-950 shadow-sm xl:sticky xl:top-6">
            <div className="flex items-center gap-2 text-stone-500">
              <Target className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                Xem nhanh
              </span>
            </div>
            <h3 className="mt-3 text-xl font-black leading-tight">
              {titleValue.trim() || "Mục tiêu chưa đặt tên"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Hoàn thiện phần chính trước, phần phụ có thể bổ sung sau.
            </p>

            <div className="mt-4 space-y-3">
              <SummaryPill
                icon={<Clock3 className="h-4 w-4" />}
                label="Thời gian"
                value={
                  timelineDays === null ? "Chưa đủ dữ liệu" : `${timelineDays} ngày thực hiện`
                }
              />
              <SummaryPill
                icon={<Flag className="h-4 w-4" />}
                label="Ưu tiên"
                value={goalPriorityLabels[priorityValue]}
              />
              <SummaryPill
                icon={<Layers3 className="h-4 w-4" />}
                label="Loại"
                value={goalTypeLabels[goalTypeValue]}
              />
              <SummaryPill
                icon={<CircleDot className="h-4 w-4" />}
                label="Trạng thái"
                value={goalStatusLabels[statusValue]}
              />
            </div>

            <div className="mt-4 rounded-[1.5rem] border border-stone-200 bg-white/70 px-4 py-3 text-sm text-stone-600">
              {startDate && targetDate ? (
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>
                    {startDate} {"->"} {targetDate}
                  </span>
                </div>
              ) : (
                <span>Chọn ngày bắt đầu và hạn hoàn thành.</span>
              )}
            </div>
          </div>
        </aside>
      </div>

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
