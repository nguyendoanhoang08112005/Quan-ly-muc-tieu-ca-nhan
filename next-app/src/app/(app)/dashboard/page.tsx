import Link from "next/link";
import { Compass, Plus, Sparkles, Target } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { TaskBoard } from "@/features/tasks/components/task-board";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import { getDashboardOverviewForUser } from "@/server/modules/dashboard/queries";
import { listGoalsForUser } from "@/server/modules/goals/queries";
import { listMilestoneQuickCreateOptionsForUser } from "@/server/modules/milestones/queries";
import { listTasksForUser } from "@/server/modules/tasks/queries";

export default async function DashboardPage() {
  const userId = await requireAuthenticatedUserId();
  const [dashboard, goals, tasks, quickCreateMilestones] = await Promise.all([
    getDashboardOverviewForUser(userId),
    listGoalsForUser(userId),
    listTasksForUser(userId),
    listMilestoneQuickCreateOptionsForUser(userId, 100)
  ]);
  const openTasks = tasks.filter((task) => task.status !== "completed");
  const focusTasks = openTasks.filter((task) => task.isFocus);
  const overdueTasks = dashboard.summary.overdueTasks;
  const referenceNow = new Date().toISOString();

  return (
    <div className="flex w-full max-w-none flex-col gap-4">
      <section className="relative overflow-hidden rounded-[2rem] border border-stone-200 bg-[linear-gradient(135deg,#fcfcfb_0%,#f7f7f5_48%,#eff6ff_100%)] px-5 py-5 shadow-sm">
        <div className="pointer-events-none absolute -right-12 top-0 h-36 w-36 rounded-full bg-amber-100/60 blur-3xl" />
        <div className="pointer-events-none absolute left-1/3 top-10 h-24 w-24 rounded-full bg-sky-100/70 blur-2xl" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative z-10 min-w-0 space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-stone-600 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Work Space
            </div>
            <h1 className="text-2xl font-black tracking-tight text-stone-950">
              Không gian làm việc
            </h1>
            <p className="text-sm text-stone-600">
              Đây là nơi duy nhất để kéo thả và đổi trạng thái công việc.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/80 bg-white/85 px-4 py-4 backdrop-blur">
                <div className="flex items-center gap-2 text-stone-500">
                  <Compass className="h-4 w-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">Đang mở</span>
                </div>
                <p className="mt-2 text-2xl font-black text-stone-950">{openTasks.length}</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/80 bg-white/85 px-4 py-4 backdrop-blur">
                <div className="flex items-center gap-2 text-stone-500">
                  <Target className="h-4 w-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">Tập trung</span>
                </div>
                <p className="mt-2 text-2xl font-black text-stone-950">{focusTasks.length}</p>
              </div>
              <div
                className={cn(
                  "rounded-[1.5rem] border px-4 py-4 backdrop-blur",
                  overdueTasks > 0
                    ? "border-rose-200 bg-rose-50/90"
                    : "border-white/80 bg-white/85"
                )}
              >
                <div className={cn("flex items-center gap-2", overdueTasks > 0 ? "text-rose-600" : "text-stone-500")}>
                  <Plus className="h-4 w-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">Quá hạn</span>
                </div>
                <p className={cn("mt-2 text-2xl font-black", overdueTasks > 0 ? "text-rose-700" : "text-stone-950")}>{overdueTasks}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              className={cn(buttonVariants({ size: "sm" }), "gap-2 rounded-full !text-white")}
              href="/goals?create=1"
            >
              <Plus className="h-4 w-4" />
              Mục tiêu mới
            </Link>
            <Link
              className={cn(buttonVariants({ size: "sm", variant: "secondary" }), "rounded-full")}
              href="/goals"
            >
              Mở mục tiêu
            </Link>
          </div>
        </div>
      </section>

      <TaskBoard
        goalOptions={goals.map((goal) => ({
          id: goal.id,
          milestonesCount: goal.milestonesCount,
          title: goal.title
        }))}
        quickCreateMilestones={quickCreateMilestones}
        referenceNow={referenceNow}
        tasks={tasks}
      />
    </div>
  );
}
