import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  AlarmClock,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Flame,
  PencilLine,
  Target
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { DeleteHabitForm } from "@/features/habits/components/delete-habit-form";
import { HabitLogForm } from "@/features/habits/components/habit-log-form";
import {
  buildDefaultHabitLogFormValues,
  habitFrequencyLabels,
  habitStatusClassNames,
  habitStatusLabels
} from "@/features/habits/habit-helpers";
import { habitIdSchema } from "@/features/habits/schemas/habit-schemas";
import type { HabitDetail } from "@/features/habits/types";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { formatDisplayDate, formatDisplayDateTime } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { getHabitDetailForUser } from "@/server/modules/habits/queries";

type HabitDetailPageProps = {
  params: Promise<{
    habitId: string;
  }>;
};

function getTodayProgress(habit: HabitDetail) {
  const todayLogDate = buildDefaultHabitLogFormValues().logDate;
  const todayLog = habit.recentLogs.find((log) => log.logDate === todayLogDate) ?? null;
  const completedCount = todayLog?.completedCount ?? 0;
  const targetCount = todayLog?.targetCountSnapshot ?? habit.targetCount;

  if (targetCount <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((completedCount / targetCount) * 100));
}

function SummaryCard({
  hint,
  label,
  tone = "neutral",
  value
}: {
  hint: string;
  label: string;
  tone?: "neutral" | "success" | "warning";
  value: ReactNode;
}) {
  const toneClassNames = {
    neutral: "border-stone-200 bg-white",
    success: "border-emerald-200 bg-emerald-50",
    warning: "border-amber-200 bg-amber-50"
  } as const;

  return (
    <div className={cn("rounded-lg border px-4 py-3", toneClassNames[tone])}>
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500">
        {label}
      </p>
      <div className="mt-2 break-words text-3xl font-black text-stone-950">
        {value}
      </div>
      <p className="mt-1 text-xs leading-5 text-stone-600">{hint}</p>
    </div>
  );
}

function DetailRow({
  children,
  icon,
  label
}: {
  children: ReactNode;
  icon: ReactNode;
  label: string;
}) {
  return (
    <div className="grid gap-1 border-b border-stone-100 py-3 last:border-b-0 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-stone-500">
        {icon}
        {label}
      </div>
      <div className="min-w-0 break-words text-sm font-semibold text-stone-950">
        {children}
      </div>
    </div>
  );
}

export default async function HabitDetailPage({
  params
}: HabitDetailPageProps) {
  const userId = await requireAuthenticatedUserId();
  const { habitId } = await params;
  const parsedHabitId = habitIdSchema.safeParse(habitId);

  if (!parsedHabitId.success) {
    notFound();
  }

  const habit = await getHabitDetailForUser(userId, BigInt(parsedHabitId.data));

  if (!habit) {
    notFound();
  }

  const todayLogDate = buildDefaultHabitLogFormValues().logDate;
  const todayLog = habit.recentLogs.find((log) => log.logDate === todayLogDate) ?? null;
  const todayProgress = getTodayProgress(habit);
  const todayCount = todayLog
    ? `${todayLog.completedCount}/${todayLog.targetCountSnapshot} ${habit.unit}`
    : `0/${habit.targetCount} ${habit.unit}`;

  return (
    <div className="flex w-full max-w-none flex-col gap-4">
      <Link
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "w-fit gap-2 rounded-lg border-stone-200 bg-white"
        )}
        href={"/habits" as Route}
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại thói quen
      </Link>

      <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span
                className={cn(
                  "rounded-md px-2.5 py-1",
                  habitStatusClassNames[habit.status]
                )}
              >
                {habitStatusLabels[habit.status]}
              </span>
              <span className="rounded-md bg-stone-100 px-2.5 py-1 text-stone-700">
                {habitFrequencyLabels[habit.frequency]}
              </span>
              <span className="rounded-md bg-stone-100 px-2.5 py-1 text-stone-700">
                {habit.targetCount} {habit.unit} / chu kỳ
              </span>
            </div>

            <h1 className="mt-4 break-words text-3xl font-black tracking-tight text-stone-950 sm:text-4xl">
              {habit.title}
            </h1>
            <p className="mt-3 max-w-4xl break-words text-sm leading-7 text-stone-600">
              {habit.description || "Thêm mô tả khi cần làm rõ tín hiệu thành công của thói quen này."}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                hint={todayLog?.isCompleted ? "Đã đạt mục tiêu hôm nay" : "Cần ghi để giữ nhịp"}
                label="Hôm nay"
                tone={todayLog?.isCompleted ? "success" : "warning"}
                value={todayCount}
              />
              <SummaryCard
                hint="Chuỗi đang giữ"
                label="Chuỗi hiện tại"
                tone="success"
                value={`${habit.currentStreak} ngày`}
              />
              <SummaryCard
                hint="Kỷ lục hiện có"
                label="Chuỗi tốt nhất"
                value={`${habit.bestStreak} ngày`}
              />
              <SummaryCard
                hint="Lần cập nhật gần nhất"
                label="Ghi gần nhất"
                value={formatDisplayDateTime(habit.lastLoggedAt, "Chưa ghi")}
              />
            </div>
          </div>

          <aside className="flex flex-col gap-2">
            <a
              className={cn(buttonVariants(), "justify-start gap-2 rounded-lg !text-white")}
              href="#habit-log"
            >
              <CheckCircle2 className="h-4 w-4" />
              Ghi nhật ký hôm nay
            </a>
            <Link
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "justify-start gap-2 rounded-lg border-stone-200 bg-white"
              )}
              href={`/habits/${habit.id}/edit` as Route}
            >
              <PencilLine className="h-4 w-4" />
              Chỉnh sửa
            </Link>
            <div className="mt-2 border-t border-stone-200 pt-2">
              <DeleteHabitForm
                className="w-full justify-start rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                habitId={habit.id}
                variant="ghost"
              />
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-4">
          <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                  Tiến độ hôm nay
                </p>
                <p className="mt-2 text-4xl font-black tracking-tight text-stone-950">
                  {todayProgress}%
                </p>
              </div>
              <p className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-semibold text-stone-700">
                {todayCount}
              </p>
            </div>

            <div
              aria-label={`Tiến độ hôm nay ${todayProgress}%`}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={todayProgress}
              className="mt-5 h-2 overflow-hidden rounded bg-stone-100"
              role="progressbar"
            >
              <div
                className={cn(
                  "h-full rounded",
                  todayLog?.isCompleted ? "bg-emerald-500" : "bg-stone-950"
                )}
                style={{ width: `${todayProgress}%` }}
              />
            </div>
          </section>

          <section
            className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:p-5"
            id="habit-log"
          >
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                Nhật ký
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-stone-950">
                Ghi nhận hôm nay
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Cập nhật số lần hoàn thành và ghi chú ngắn cho ngày đang chọn.
              </p>
            </div>

            <HabitLogForm
              habitId={habit.id}
              initialValues={
                todayLog
                  ? {
                      logDate: todayLog.logDate,
                      completedCount: String(todayLog.completedCount),
                      note: todayLog.note ?? ""
                    }
                  : undefined
              }
              targetCount={todayLog?.targetCountSnapshot ?? habit.targetCount}
              unit={habit.unit}
            />
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                Lịch sử
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-stone-950">
                Nhật ký gần đây
              </h2>
            </div>

            {habit.recentLogs.length > 0 ? (
              <ol className="mt-5 divide-y divide-stone-200 overflow-hidden rounded-lg border border-stone-200">
                {habit.recentLogs.map((log) => (
                  <li className="px-4 py-4" key={log.id}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-md bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-700">
                            {formatDisplayDate(log.logDate)}
                          </span>
                          <span
                            className={cn(
                              "rounded-md px-2.5 py-1 text-xs font-semibold",
                              log.isCompleted
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            )}
                          >
                            {log.isCompleted ? "Đạt mục tiêu" : "Chưa đạt"}
                          </span>
                        </div>
                        <p className="mt-3 break-words text-sm font-semibold text-stone-950">
                          {log.completedCount}/{log.targetCountSnapshot} {habit.unit}
                        </p>
                        <p className="mt-2 break-words text-sm leading-6 text-stone-600">
                          {log.note ?? "Không có ghi chú."}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="mt-5 rounded-lg border border-dashed border-stone-300 bg-stone-50 px-4 py-5 text-sm leading-6 text-stone-500">
                Chưa có nhật ký. Ghi ngày đầu tiên để bắt đầu tính chuỗi liên tiếp.
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-lg font-black tracking-tight text-stone-950">
              Ngữ cảnh
            </h2>
            <div className="mt-2">
              <DetailRow icon={<Target className="h-4 w-4" />} label="Mục tiêu">
                {habit.goal ? (
                  <Link className="hover:text-stone-600" href={`/goals/${habit.goal.id}` as Route}>
                    {habit.goal.title}
                  </Link>
                ) : (
                  "Chưa gắn mục tiêu"
                )}
              </DetailRow>
              <DetailRow icon={<Clock3 className="h-4 w-4" />} label="Tần suất">
                {habitFrequencyLabels[habit.frequency]}
              </DetailRow>
              <DetailRow icon={<Target className="h-4 w-4" />} label="Mỗi chu kỳ">
                {habit.targetCount} {habit.unit}
              </DetailRow>
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-lg font-black tracking-tight text-stone-950">
              Mốc thời gian
            </h2>
            <div className="mt-2">
              <DetailRow icon={<CalendarDays className="h-4 w-4" />} label="Bắt đầu">
                {formatDisplayDate(habit.startDate)}
              </DetailRow>
              <DetailRow icon={<CalendarDays className="h-4 w-4" />} label="Kết thúc">
                {formatDisplayDate(habit.endDate, "Chưa đặt")}
              </DetailRow>
              <DetailRow icon={<AlarmClock className="h-4 w-4" />} label="Giờ nhắc">
                {habit.reminderTime || "Chưa đặt"}
              </DetailRow>
              <DetailRow icon={<Flame className="h-4 w-4" />} label="Tốt nhất">
                {habit.bestStreak} ngày
              </DetailRow>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}
