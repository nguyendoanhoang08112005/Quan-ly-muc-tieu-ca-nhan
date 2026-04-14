"use client";

import Link from "next/link";
import type { Route } from "next";
import { useActionState, useMemo, useState, type ReactNode } from "react";
import {
  AlarmClock,
  CalendarDays,
  CheckCircle2,
  Flame,
  FolderKanban,
  Sparkles,
  Target
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  habitFrequencyLabels,
  habitStatusClassNames,
  habitStatusLabels
} from "@/features/habits/habit-helpers";
import { createHabitAction } from "@/features/habits/actions/create-habit";
import { getInitialHabitFormActionState } from "@/features/habits/actions/shared";
import { updateHabitAction } from "@/features/habits/actions/update-habit";
import type {
  HabitFormValues,
  HabitGoalOption
} from "@/features/habits/types";
import { cn } from "@/lib/utils";

type HabitFormProps = {
  cancelHref: Route;
  goalOptions: HabitGoalOption[];
  habitId?: string;
  initialValues?: Partial<HabitFormValues>;
  mode: "create" | "edit";
};

const inputClassName =
  "h-12 rounded-2xl border-stone-200 bg-white text-base shadow-sm";
const compactInputClassName =
  "h-11 rounded-2xl border-stone-200 bg-white shadow-sm";

const frequencyHints: Record<HabitFormValues["frequency"], string> = {
  daily: "Tốt cho thói quen cần đều mỗi ngày.",
  weekly: "Dùng cho mục tiêu có chu kỳ theo tuần.",
  monthly: "Phù hợp việc kiểm tra hoặc tổng kết định kỳ."
};

const statusHints: Record<HabitFormValues["status"], string> = {
  active: "Hiện trong danh sách cần ghi.",
  paused: "Tạm ngưng nhưng vẫn giữ dữ liệu.",
  completed: "Đã hoàn thành mục tiêu thói quen.",
  archived: "Ẩn khỏi nhịp theo dõi chính."
};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-2 text-sm font-medium text-rose-600" role="alert">
      {message}
    </p>
  );
}

function SectionCard({
  children,
  description,
  title
}: {
  children: ReactNode;
  description?: string;
  title: string;
}) {
  return (
    <section className="rounded-[1.6rem] border border-stone-200 bg-white/90 p-5 shadow-sm">
      <div>
        <h3 className="text-lg font-black tracking-tight text-stone-950">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-stone-500">{description}</p>
        ) : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function PreviewMetric({
  icon,
  label,
  value
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="rounded-[1.15rem] border border-white/10 bg-white/5 px-4 py-3">
      <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
        {icon}
        {label}
      </div>
      <p className="mt-2 break-words text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function GuidanceItem({ children, icon }: { children: ReactNode; icon: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-stone-400">{icon}</span>
      <p>{children}</p>
    </div>
  );
}

function formatDateLabel(value: string, fallback: string) {
  if (!value) {
    return fallback;
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "Ngày chưa hợp lệ";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

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
  const [title, setTitle] = useState(state.values.title);
  const [description, setDescription] = useState(state.values.description);
  const [frequency, setFrequency] = useState(state.values.frequency);
  const [targetCount, setTargetCount] = useState(state.values.targetCount);
  const [unit, setUnit] = useState(state.values.unit);
  const [goalId, setGoalId] = useState(state.values.goalId);
  const [startDate, setStartDate] = useState(state.values.startDate);
  const [endDate, setEndDate] = useState(state.values.endDate);
  const [reminderTime, setReminderTime] = useState(state.values.reminderTime);
  const [status, setStatus] = useState(state.values.status);

  const selectedGoal = goalOptions.find((goal) => goal.id === goalId);
  const targetLabel = `${targetCount.trim() || "1"} ${unit.trim() || "lần"}`;
  const titleLabel = title.trim() || "Chưa đặt tên thói quen";

  return (
    <form action={formAction} className="space-y-6">
      {habitId ? <input name="habitId" type="hidden" value={habitId} /> : null}
      <input name="frequency" type="hidden" value={frequency} />
      <input name="status" type="hidden" value={status} />

      <section className="rounded-[2rem] border border-stone-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,246,242,0.94))] p-5 shadow-[0_24px_60px_-44px_rgba(120,113,108,0.42)] sm:p-7">
        <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-stone-600 shadow-sm">
          <Sparkles className="h-3.5 w-3.5" />
          {mode === "edit" ? "Tinh chỉnh nhịp thói quen" : "Thiết kế thói quen mới"}
        </div>

        <div className="mt-4 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <h2 className="text-3xl font-black tracking-tight text-stone-950 sm:text-4xl">
              {mode === "edit" ? "Cập nhật thói quen" : "Tạo thói quen dễ giữ nhịp"}
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-8 text-stone-600">
              Tập trung vào tín hiệu thành công, nhịp lặp và thời điểm nhắc. Phần xem trước bên phải giúp kiểm tra nhanh trước khi lưu.
            </p>

            {state.status === "error" && state.message ? (
              <div
                aria-live="polite"
                className="mt-5 rounded-[1.25rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
              >
                {state.message}
              </div>
            ) : null}

            <div className="mt-6 space-y-5">
              <SectionCard
                description="Tên nên mô tả hành động có thể ghi nhận được. Mô tả chỉ cần thêm điều kiện đạt hoặc lưu ý quan trọng."
                title="Tín hiệu thành công"
              >
                <div className="space-y-5">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-stone-700">
                      Tên thói quen
                    </span>
                    <Input
                      className={inputClassName}
                      maxLength={180}
                      name="title"
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="Ví dụ: Đọc 20 trang sách"
                      value={title}
                    />
                    <FieldError message={state.fieldErrors?.title?.[0]} />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-stone-700">
                      Mô tả ngắn
                    </span>
                    <Textarea
                      className="min-h-32 border-stone-200 bg-white"
                      name="description"
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder="Tùy chọn: điều kiện đạt, phạm vi hoặc lưu ý để vài ngày sau đọc lại vẫn hiểu."
                      rows={4}
                      value={description}
                    />
                  </label>
                </div>
              </SectionCard>

              <div className="grid gap-5 lg:grid-cols-2">
                <SectionCard
                  description="Chọn chu kỳ trước, rồi đặt số lượng đủ nhỏ để có thể ghi đều."
                  title="Nhịp đo"
                >
                  <div className="space-y-4">
                    <div>
                      <span className="mb-2 block text-sm font-semibold text-stone-700">
                        Nhịp lặp
                      </span>
                      <div className="grid gap-2">
                        {Object.entries(habitFrequencyLabels).map(([value, label]) => {
                          const typedValue = value as HabitFormValues["frequency"];
                          const isActive = frequency === typedValue;

                          return (
                            <button
                              aria-pressed={isActive}
                              className={cn(
                                "rounded-[1.15rem] border px-4 py-3 text-left transition",
                                isActive
                                  ? "border-stone-950 bg-stone-950 text-white shadow-sm"
                                  : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50 hover:text-stone-950"
                              )}
                              key={value}
                              onClick={() => setFrequency(typedValue)}
                              type="button"
                            >
                              <span className="text-sm font-bold">{label}</span>
                              <span
                                className={cn(
                                  "mt-1 block text-xs leading-5",
                                  isActive ? "text-stone-300" : "text-stone-500"
                                )}
                              >
                                {frequencyHints[typedValue]}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <FieldError message={state.fieldErrors?.frequency?.[0]} />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_9rem]">
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-stone-700">
                          Số lượng cần đạt
                        </span>
                        <Input
                          className={compactInputClassName}
                          min="1"
                          name="targetCount"
                          onChange={(event) => setTargetCount(event.target.value)}
                          type="number"
                          value={targetCount}
                        />
                        <FieldError message={state.fieldErrors?.targetCount?.[0]} />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-stone-700">
                          Đơn vị
                        </span>
                        <Input
                          className={compactInputClassName}
                          maxLength={50}
                          name="unit"
                          onChange={(event) => setUnit(event.target.value)}
                          placeholder="lần"
                          value={unit}
                        />
                        <FieldError message={state.fieldErrors?.unit?.[0]} />
                      </label>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard
                  description="Ngày và giờ nhắc nên giúp bạn bắt đầu đúng lúc, không biến thành dữ liệu trang trí."
                  title="Lịch theo dõi"
                >
                  <div className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-stone-700">
                          Ngày bắt đầu
                        </span>
                        <Input
                          className={compactInputClassName}
                          name="startDate"
                          onChange={(event) => setStartDate(event.target.value)}
                          type="date"
                          value={startDate}
                        />
                        <FieldError message={state.fieldErrors?.startDate?.[0]} />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-stone-700">
                          Ngày kết thúc
                        </span>
                        <Input
                          className={compactInputClassName}
                          name="endDate"
                          onChange={(event) => setEndDate(event.target.value)}
                          type="date"
                          value={endDate}
                        />
                        <FieldError message={state.fieldErrors?.endDate?.[0]} />
                      </label>
                    </div>

                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-stone-700">
                        Giờ nhắc
                      </span>
                      <Input
                        className={compactInputClassName}
                        name="reminderTime"
                        onChange={(event) => setReminderTime(event.target.value)}
                        type="time"
                        value={reminderTime}
                      />
                      <FieldError message={state.fieldErrors?.reminderTime?.[0]} />
                    </label>
                  </div>
                </SectionCard>
              </div>

              <SectionCard
                description="Liên kết mục tiêu nếu thói quen này đang phục vụ một kết quả lớn hơn. Nếu không, để trống sẽ giữ danh sách gọn hơn."
                title="Ngữ cảnh và trạng thái"
              >
                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-stone-700">
                      Mục tiêu liên kết
                    </span>
                    <select
                      className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
                      name="goalId"
                      onChange={(event) => setGoalId(event.target.value)}
                      value={goalId}
                    >
                      <option value="">Không liên kết mục tiêu</option>
                      {goalOptions.map((goal) => (
                        <option key={goal.id} value={goal.id}>
                          {goal.title}
                        </option>
                      ))}
                    </select>
                    <FieldError message={state.fieldErrors?.goalId?.[0]} />
                  </label>

                  <div>
                    <span className="mb-2 block text-sm font-semibold text-stone-700">
                      Trạng thái
                    </span>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {Object.entries(habitStatusLabels).map(([value, label]) => {
                        const typedValue = value as HabitFormValues["status"];
                        const isActive = status === typedValue;

                        return (
                          <button
                            aria-pressed={isActive}
                            className={cn(
                              "rounded-[1.15rem] border px-4 py-3 text-left transition",
                              isActive
                                ? "border-stone-950 bg-white shadow-[0_14px_28px_-24px_rgba(28,25,23,0.4)]"
                                : "border-stone-200 bg-stone-50 text-stone-600 hover:bg-white hover:text-stone-950"
                            )}
                            key={value}
                            onClick={() => setStatus(typedValue)}
                            type="button"
                          >
                            <span
                              className={cn(
                                "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                                habitStatusClassNames[typedValue]
                              )}
                            >
                              {label}
                            </span>
                            <span className="mt-2 block text-xs leading-5 text-stone-500">
                              {statusHints[typedValue]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <FieldError message={state.fieldErrors?.status?.[0]} />
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
            <section className="rounded-[1.7rem] border border-stone-950 bg-stone-950 p-5 text-white shadow-[0_22px_48px_-30px_rgba(12,10,9,0.88)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                Xem trước thói quen
              </p>

              <p className="mt-4 line-clamp-3 text-2xl font-black tracking-tight">
                {titleLabel}
              </p>

              {description.trim() ? (
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-300">
                  {description}
                </p>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold",
                    habitStatusClassNames[status]
                  )}
                >
                  {habitStatusLabels[status]}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-stone-100">
                  {habitFrequencyLabels[frequency]}
                </span>
                {selectedGoal ? (
                  <span className="max-w-full rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                    {selectedGoal.title}
                  </span>
                ) : null}
              </div>

              <div className="mt-5 grid gap-3">
                <PreviewMetric
                  icon={<Target className="h-4 w-4" />}
                  label="Mục tiêu mỗi kỳ"
                  value={targetLabel}
                />
                <PreviewMetric
                  icon={<AlarmClock className="h-4 w-4" />}
                  label="Giờ nhắc"
                  value={reminderTime || "Chưa đặt giờ nhắc"}
                />
                <PreviewMetric
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Khoảng theo dõi"
                  value={`${formatDateLabel(startDate, "Chưa đặt ngày bắt đầu")} - ${formatDateLabel(endDate, "không giới hạn")}`}
                />
                <PreviewMetric
                  icon={<FolderKanban className="h-4 w-4" />}
                  label="Mục tiêu liên kết"
                  value={selectedGoal?.title ?? "Không gắn mục tiêu"}
                />
              </div>
            </section>

            <SectionCard
              description="Nếu cả ba câu dưới đây đều rõ, thói quen đã đủ tốt để lưu."
              title="Kiểm tra nhanh"
            >
              <div className="space-y-3 text-sm leading-6 text-stone-600">
                <GuidanceItem icon={<Target className="h-4 w-4" />}>
                  Tôi biết chính xác hành động nào được tính là hoàn thành.
                </GuidanceItem>
                <GuidanceItem icon={<Flame className="h-4 w-4" />}>
                  Mục tiêu mỗi kỳ đủ nhỏ để duy trì chuỗi đều.
                </GuidanceItem>
                <GuidanceItem icon={<CheckCircle2 className="h-4 w-4" />}>
                  Trạng thái phản ánh đúng việc có cần ghi hôm nay hay không.
                </GuidanceItem>
              </div>
            </SectionCard>
          </aside>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 pt-5">
          <p className="text-sm text-stone-500">
            Khi lưu, danh sách thói quen và trang chi tiết sẽ được đồng bộ lại.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "rounded-full"
              )}
              href={cancelHref}
            >
              Hủy
            </Link>
            <button
              aria-busy={isPending}
              className={cn(buttonVariants({ size: "lg" }), "rounded-full !text-white")}
              disabled={isPending}
              type="submit"
            >
              {mode === "edit"
                ? isPending
                  ? "Đang cập nhật..."
                  : "Lưu thay đổi"
                : isPending
                  ? "Đang tạo..."
                  : "Tạo thói quen"}
            </button>
          </div>
        </div>
      </section>
    </form>
  );
}
