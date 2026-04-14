"use client";

import Link from "next/link";
import type { Route } from "next";
import { useActionState, useMemo, useState, type ReactNode } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Sparkles,
  Target
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  goalPriorityClassNames,
  goalPriorityLabels,
  workStatusClassNames,
  workStatusLabels
} from "@/features/goals/goal-helpers";
import type { ProjectOption } from "@/features/projects/types";
import { createTaskAction } from "@/features/tasks/actions/create-task";
import { getInitialTaskFormActionState } from "@/features/tasks/actions/shared";
import { updateTaskAction } from "@/features/tasks/actions/update-task";
import type { TaskFormValues } from "@/features/tasks/types";
import { cn } from "@/lib/utils";

type TaskFormProps = {
  cancelHref: Route;
  goalId: string;
  milestoneId?: string;
  taskId?: string;
  initialValues?: Partial<TaskFormValues>;
  mode: "create" | "edit";
  projectOptions: ProjectOption[];
};

function padDateTimePart(value: number) {
  return `${value}`.padStart(2, "0");
}

function formatDateTimeLocalValue(date: Date) {
  return [
    date.getFullYear(),
    padDateTimePart(date.getMonth() + 1),
    padDateTimePart(date.getDate())
  ].join("-") + `T${padDateTimePart(date.getHours())}:${padDateTimePart(date.getMinutes())}`;
}

function buildQuickDueAt(daysToAdd: number, hours: number, minutes = 0) {
  const date = new Date();

  date.setDate(date.getDate() + daysToAdd);
  date.setHours(hours, minutes, 0, 0);

  return formatDateTimeLocalValue(date);
}

function getTodayDateValue() {
  const date = new Date();

  return [
    date.getFullYear(),
    padDateTimePart(date.getMonth() + 1),
    padDateTimePart(date.getDate())
  ].join("-");
}

function getDatePartFromDateTimeLocalValue(value: string) {
  const [datePart] = value.split("T");

  return datePart ?? "";
}

function getTimePartFromDateTimeLocalValue(value: string) {
  const [, timePart] = value.split("T");

  return timePart ?? "09:00";
}

function joinDateAndTimeParts(datePart: string, timePart: string) {
  if (!datePart) {
    return "";
  }

  return `${datePart}T${timePart || "09:00"}`;
}

function formatDueAtSummary(value: string) {
  if (!value) {
    return "Chưa đặt hạn";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Hạn chưa hợp lệ";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
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

export function TaskForm({
  cancelHref,
  goalId,
  milestoneId,
  taskId,
  initialValues,
  mode,
  projectOptions
}: TaskFormProps) {
  const initialState = useMemo(
    () => getInitialTaskFormActionState(initialValues),
    [initialValues]
  );
  const serverAction = mode === "edit" ? updateTaskAction : createTaskAction;
  const [state, formAction, isPending] = useActionState(
    serverAction,
    initialState
  );
  const [title, setTitle] = useState(state.values.title);
  const [description, setDescription] = useState(state.values.description);
  const [status, setStatus] = useState(state.values.status);
  const [priority, setPriority] = useState(state.values.priority);
  const [estimatedMinutes, setEstimatedMinutes] = useState(
    state.values.estimatedMinutes
  );
  const [projectId, setProjectId] = useState(state.values.projectId);
  const [isFocus, setIsFocus] = useState(state.values.isFocus);
  const [dueAt, setDueAt] = useState(state.values.dueAt);
  const [dueDate, setDueDate] = useState(
    getDatePartFromDateTimeLocalValue(state.values.dueAt)
  );
  const [dueTime, setDueTime] = useState(
    getTimePartFromDateTimeLocalValue(state.values.dueAt)
  );
  const [showDetailedDueAt, setShowDetailedDueAt] = useState(
    Boolean(state.values.dueAt)
  );
  const quickDueOptions = useMemo(
    () => [
      { label: "Không hạn", value: "" },
      { label: "Hôm nay", value: buildQuickDueAt(0, 18) },
      { label: "Ngày mai", value: buildQuickDueAt(1, 9) },
      { label: "7 ngày", value: buildQuickDueAt(7, 9) }
    ],
    []
  );

  function updateDueAt(nextDueAt: string) {
    setDueAt(nextDueAt);
    setDueDate(getDatePartFromDateTimeLocalValue(nextDueAt));
    setDueTime(getTimePartFromDateTimeLocalValue(nextDueAt));
  }

  return (
    <form action={formAction} className="space-y-6">
      <input name="goalId" type="hidden" value={goalId} />
      {milestoneId ? (
        <input name="milestoneId" type="hidden" value={milestoneId} />
      ) : null}
      {taskId ? <input name="taskId" type="hidden" value={taskId} /> : null}
      <input name="dueAt" type="hidden" value={dueAt} />

      <section className="rounded-[2rem] border border-stone-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,246,242,0.94))] p-6 shadow-[0_24px_60px_-44px_rgba(120,113,108,0.42)] sm:p-7">
        <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-stone-600 shadow-sm">
          <Sparkles className="h-3.5 w-3.5" />
          {mode === "edit" ? "Chỉnh sửa công việc" : "Tạo công việc"}
        </div>

        <div className="mt-4 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <h2 className="text-4xl font-black tracking-tight text-stone-950">
              {mode === "edit" ? "Cập nhật công việc" : "Tạo công việc mới"}
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-8 text-stone-600">
              {mode === "edit"
                ? "Giữ màn này tập trung vào những thứ thật sự cần chỉnh: tên việc, trạng thái, hạn và mức quan trọng."
                : "Tạo việc theo cách gọn hơn, nhìn vào là biết cần nhập gì trước và phần nào chỉ là bổ sung."}
            </p>

            {state.status === "error" && state.message ? (
              <div className="mt-5 rounded-[1.25rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {state.message}
              </div>
            ) : null}

            <div className="mt-6 space-y-5">
              <SectionCard
                description="Đặt tên ngắn, rõ hành động. Mô tả chỉ cần thêm khi người khác hoặc chính bạn của vài ngày sau cần hiểu lại ngữ cảnh."
                title="Nội dung chính"
              >
                <div className="space-y-5">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-stone-700">
                      Tên công việc
                    </span>
                    <Input
                      className="h-12 rounded-2xl border-stone-200 bg-white text-base shadow-sm"
                      name="title"
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="Ví dụ: Hoàn thiện luồng tạo mục tiêu"
                      value={title}
                    />
                    {state.fieldErrors?.title?.[0] ? (
                      <p className="mt-2 text-sm text-rose-600">
                        {state.fieldErrors.title[0]}
                      </p>
                    ) : null}
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-stone-700">
                      Mô tả ngắn
                    </span>
                    <Textarea
                      className="min-h-36 border-stone-200 bg-white"
                      name="description"
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder="Kết quả đầu ra, phạm vi hoặc lưu ý quan trọng của công việc này."
                      rows={5}
                      value={description}
                    />
                  </label>
                </div>
              </SectionCard>

              <div className="grid gap-5 lg:grid-cols-2">
                <SectionCard
                  description="Chỉnh đúng trạng thái và độ ưu tiên để board và tiến độ phản ánh đúng thực tế."
                  title="Trạng thái và ưu tiên"
                >
                  <div className="space-y-4">
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-stone-700">
                        Trạng thái
                      </span>
                      <select
                        className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
                        name="status"
                        onChange={(event) =>
                          setStatus(event.target.value as TaskFormValues["status"])
                        }
                        value={status}
                      >
                        {Object.entries(workStatusLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-stone-700">
                        Độ ưu tiên
                      </span>
                      <select
                        className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
                        name="priority"
                        onChange={(event) =>
                          setPriority(event.target.value as TaskFormValues["priority"])
                        }
                        value={priority}
                      >
                        {Object.entries(goalPriorityLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="flex items-center justify-between gap-4 rounded-[1.2rem] border border-stone-200 bg-stone-50 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-stone-800">
                          Đánh dấu ưu tiên
                        </p>
                        <p className="mt-1 text-sm text-stone-500">
                          Việc ưu tiên sẽ dễ được chú ý hơn trong board làm việc.
                        </p>
                      </div>
                      <input
                        checked={isFocus}
                        className="h-5 w-5 rounded border-stone-300"
                        name="isFocus"
                        onChange={(event) => setIsFocus(event.target.checked)}
                        type="checkbox"
                      />
                    </label>
                  </div>
                </SectionCard>

                <SectionCard
                  description="Hạn hoàn thành và số phút dự kiến nên nhập nhanh, không nên bắt bạn phải vật lộn với một ô datetime-local thô."
                  title="Thời gian và nhịp làm"
                >
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-stone-700">
                          Hạn công việc
                        </span>
                        <span className="text-sm text-stone-500">
                          {formatDueAtSummary(dueAt)}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {quickDueOptions.map((option) => {
                          const isActive = dueAt === option.value;

                          return (
                            <button
                              key={option.label}
                              aria-pressed={isActive}
                              className={cn(
                                "rounded-full px-3 py-1.5 text-[12px] font-semibold transition",
                                isActive
                                  ? "bg-stone-950 text-white shadow-sm"
                                  : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-100 hover:text-stone-950"
                              )}
                              onClick={() => {
                                updateDueAt(option.value);
                                setShowDetailedDueAt(false);
                              }}
                              type="button"
                            >
                              {option.label}
                            </button>
                          );
                        })}

                        <button
                          aria-pressed={showDetailedDueAt}
                          className={cn(
                            "rounded-full px-3 py-1.5 text-[12px] font-semibold transition",
                            showDetailedDueAt
                              ? "bg-stone-950 text-white shadow-sm"
                              : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-100 hover:text-stone-950"
                          )}
                          onClick={() => {
                            const nextOpen = !showDetailedDueAt;

                            setShowDetailedDueAt(nextOpen);

                            if (nextOpen && !dueDate) {
                              const nextDate = getTodayDateValue();

                              setDueDate(nextDate);
                              setDueAt(joinDateAndTimeParts(nextDate, dueTime));
                            }
                          }}
                          type="button"
                        >
                          {showDetailedDueAt ? "Ẩn chi tiết" : "Hạn chi tiết"}
                        </button>
                      </div>

                      {showDetailedDueAt ? (
                        <div className="mt-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                          <Input
                            className="h-11 rounded-2xl border-stone-200 bg-white"
                            onChange={(event) => {
                              const nextDate = event.target.value;

                              setDueDate(nextDate);
                              setDueAt(joinDateAndTimeParts(nextDate, dueTime));
                            }}
                            type="date"
                            value={dueDate}
                          />
                          <div className="flex flex-wrap gap-2">
                            {["09:00", "12:00", "18:00", "21:00"].map((timeValue) => {
                              const isActive = dueTime === timeValue;

                              return (
                                <button
                                  key={timeValue}
                                  aria-pressed={isActive}
                                  className={cn(
                                    "rounded-full px-3 py-1.5 text-[12px] font-semibold transition",
                                    isActive
                                      ? "bg-stone-950 text-white shadow-sm"
                                      : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-100 hover:text-stone-950"
                                  )}
                                  onClick={() => {
                                    setDueTime(timeValue);
                                    setDueAt(joinDateAndTimeParts(dueDate, timeValue));
                                  }}
                                  type="button"
                                >
                                  {timeValue}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : null}

                      {state.fieldErrors?.dueAt?.[0] ? (
                        <p className="mt-2 text-sm text-rose-600">
                          {state.fieldErrors.dueAt[0]}
                        </p>
                      ) : null}
                    </div>

                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-stone-700">
                        Số phút dự kiến
                      </span>
                      <Input
                        className="h-12 rounded-2xl border-stone-200 bg-white"
                        min="1"
                        name="estimatedMinutes"
                        onChange={(event) => setEstimatedMinutes(event.target.value)}
                        placeholder="Ví dụ: 45"
                        type="number"
                        value={estimatedMinutes}
                      />
                      {state.fieldErrors?.estimatedMinutes?.[0] ? (
                        <p className="mt-2 text-sm text-rose-600">
                          {state.fieldErrors.estimatedMinutes[0]}
                        </p>
                      ) : null}
                    </label>
                  </div>
                </SectionCard>
              </div>

              <SectionCard
                description="Chỉ gắn dự án nếu việc này thuộc một luồng lớn hơn. Nếu không, để trống sẽ giúp bảng làm việc sạch hơn."
                title="Ngữ cảnh công việc"
              >
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-stone-700">
                    Dự án
                  </span>
                  <select
                    className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 py-2 text-sm text-stone-950 shadow-sm outline-none transition focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
                    name="projectId"
                    onChange={(event) => setProjectId(event.target.value)}
                    value={projectId}
                  >
                    <option value="">Không gắn dự án</option>
                    {projectOptions.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.goalTitle
                          ? `${project.name} | ${project.goalTitle}`
                          : project.name}
                      </option>
                    ))}
                  </select>
                  {state.fieldErrors?.projectId?.[0] ? (
                    <p className="mt-2 text-sm text-rose-600">
                      {state.fieldErrors.projectId[0]}
                    </p>
                  ) : null}
                </label>
              </SectionCard>
            </div>
          </div>

          <aside className="space-y-4">
            <section className="rounded-[1.7rem] border border-stone-950 bg-stone-950 p-5 text-white shadow-[0_22px_48px_-30px_rgba(12,10,9,0.88)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                Bức tranh hiện tại
              </p>

              <p className="mt-4 line-clamp-3 text-2xl font-black tracking-tight">
                {title.trim() || "Chưa đặt tên công việc"}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold",
                    workStatusClassNames[status]
                  )}
                >
                  {workStatusLabels[status]}
                </span>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold",
                    goalPriorityClassNames[priority]
                  )}
                >
                  {goalPriorityLabels[priority]}
                </span>
                {isFocus ? (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                    Việc ưu tiên
                  </span>
                ) : null}
              </div>

              <div className="mt-5 grid gap-3">
                <div className="rounded-[1.15rem] border border-white/10 bg-white/5 px-4 py-3">
                  <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                    <CalendarDays className="h-4 w-4" />
                    Hạn công việc
                  </div>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {formatDueAtSummary(dueAt)}
                  </p>
                </div>

                <div className="rounded-[1.15rem] border border-white/10 bg-white/5 px-4 py-3">
                  <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                    <Clock3 className="h-4 w-4" />
                    Nguồn lực
                  </div>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {estimatedMinutes.trim()
                      ? `${estimatedMinutes} phút dự kiến`
                      : "Chưa ước lượng thời gian"}
                  </p>
                </div>

                <div className="rounded-[1.15rem] border border-white/10 bg-white/5 px-4 py-3">
                  <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                    <FolderKanban className="h-4 w-4" />
                    Dự án liên quan
                  </div>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {projectOptions.find((project) => project.id === projectId)?.name ??
                      "Không gắn dự án"}
                  </p>
                </div>
              </div>
            </section>

            <SectionCard
              description="Màn này nên giúp bạn lưu nhanh hơn, không nên bắt bạn nghĩ lại form."
              title="Nhắc nhanh"
            >
              <div className="space-y-3 text-sm leading-6 text-stone-600">
                <div className="flex items-start gap-3">
                  <Target className="mt-0.5 h-4 w-4 text-stone-400" />
                  <p>Tên việc nên bắt đầu bằng hành động cụ thể, tránh đặt quá chung chung.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-4 w-4 text-stone-400" />
                  <p>Chỉ đặt hạn khi nó thật sự giúp bạn ưu tiên, không phải để lấp form.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-stone-400" />
                  <p>Đánh dấu ưu tiên cho đúng việc then chốt để board đỡ loãng sự chú ý.</p>
                </div>
              </div>
            </SectionCard>
          </aside>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 pt-5">
          <p className="text-sm text-stone-500">
            Khi lưu, tiến độ liên quan sẽ được đồng bộ lại theo công việc này.
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
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full !text-white"
              )}
              disabled={isPending}
              type="submit"
            >
              {mode === "edit"
                ? isPending
                  ? "Đang cập nhật..."
                  : "Lưu thay đổi"
                : isPending
                  ? "Đang tạo..."
                  : "Tạo công việc"}
            </button>
          </div>
        </div>
      </section>
    </form>
  );
}
