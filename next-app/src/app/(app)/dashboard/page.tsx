import Link from "next/link";
import { Compass, PawPrint, Plus, Sparkles, Target } from "lucide-react";
import { PawTrail } from "@/components/ornaments/paw-trail";
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
  const quickCreateMilestone = quickCreateMilestones[0] ?? null;

  return (
    <div className="flex w-full max-w-none flex-col gap-4">
      <section className="relative overflow-hidden rounded-[2.1rem] border border-[#e8dfd5] bg-white px-5 py-5 shadow-[0_20px_50px_-40px_rgba(28,25,23,0.22)]">
        <div className="pointer-events-none absolute -right-10 top-0 h-28 w-28 rounded-full bg-[#fff0e7] blur-3xl" />
        <div className="pointer-events-none absolute left-1/4 top-0 h-24 w-24 rounded-full bg-[#f3f8ee] blur-3xl" />
        <PawTrail className="right-20 top-16 h-24 w-[14rem]" variant="mixed" />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0 rounded-[1.75rem] border border-[#eee4da] bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf8_100%)] p-4 shadow-[0_18px_36px_-30px_rgba(28,25,23,0.22)] sm:p-5">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfd3] bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-stone-600">
                <Sparkles className="h-3.5 w-3.5" />
                Làm việc
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#f2d8cc] bg-[#fff6f1] px-3 py-1 text-[11px] font-semibold text-[#b8694d]">
                <PawPrint className="h-3.5 w-3.5" />
                Mèo canh board
              </div>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start">
              <div className="min-w-0">
                <h1 className="text-3xl font-black tracking-tight text-stone-950">
                  Kéo đúng cột. Làm đúng việc.
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">
                  Hôm nay chỉ cần nhìn đúng board, mốc đang mở và việc đang ưu tiên.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#e8dfd5] bg-white px-3 py-1.5 text-xs font-medium text-stone-700">
                    {goals.length} mục tiêu đang theo
                  </span>
                  <span className="rounded-full border border-[#e8dfd5] bg-white px-3 py-1.5 text-xs font-medium text-stone-700">
                    {quickCreateMilestone ? `Quick add vào mốc ${quickCreateMilestone.sequenceNo}` : "Chưa có mốc để thêm nhanh"}
                  </span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.35rem] border border-[#ebe1d7] bg-white px-4 py-4 shadow-sm">
                  <div className="flex items-center gap-2 text-stone-500">
                    <Compass className="h-4 w-4" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">
                      Đang mở
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-black text-stone-950">{openTasks.length}</p>
                  <p className="mt-1 text-xs text-stone-500">Các việc chưa xong</p>
                </div>

                <div className="rounded-[1.35rem] border border-[#efe5c8] bg-white px-4 py-4 shadow-sm">
                  <div className="flex items-center gap-2 text-stone-500">
                    <Target className="h-4 w-4" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">
                      Tập trung
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-black text-stone-950">{focusTasks.length}</p>
                  <p className="mt-1 text-xs text-stone-500">Đang được ghim ưu tiên</p>
                </div>

                <div className="rounded-[1.35rem] border border-[#ebe1d7] bg-white px-4 py-4 shadow-sm">
                  <div
                    className={cn(
                      "flex items-center gap-2",
                      overdueTasks > 0 ? "text-rose-600" : "text-stone-500"
                    )}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">
                      Quá hạn
                    </span>
                  </div>
                  <p
                    className={cn(
                      "mt-2 text-2xl font-black",
                      overdueTasks > 0 ? "text-rose-700" : "text-stone-950"
                    )}
                  >
                    {overdueTasks}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">Cần xử lý trước</p>
                </div>

                <div className="rounded-[1.35rem] border border-[#e6efd9] bg-[#fbfdf8] px-4 py-4 shadow-sm">
                  <div className="flex items-center gap-2 text-stone-500">
                    <PawPrint className="h-4 w-4" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">
                      Quick add
                    </span>
                  </div>
                  <p className="mt-2 text-lg font-black text-stone-950">
                    {quickCreateMilestone ? `Mốc ${quickCreateMilestone.sequenceNo}` : "Chưa có"}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    {quickCreateMilestone ? quickCreateMilestone.title : "Cần tạo cột mốc trước"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 xl:items-stretch">
            <div className="flex flex-wrap gap-2 xl:justify-end">
              <Link
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "gap-2 rounded-full !text-white shadow-[0_12px_24px_-18px_rgba(28,25,23,0.3)]"
                )}
                href="/goals?create=1"
              >
                <Plus className="h-4 w-4" />
                Mục tiêu mới
              </Link>
              <Link
                className={cn(
                  buttonVariants({ size: "sm", variant: "secondary" }),
                  "rounded-full border-[#e5dbd0] bg-white"
                )}
                href="/goals"
              >
                Mở mục tiêu
              </Link>
            </div>

            <div className="rounded-[1.45rem] border border-[#eadfd4] bg-[#fffaf6] px-4 py-4 shadow-sm">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-stone-500">
                <PawPrint className="h-3.5 w-3.5" />
                Hôm nay
              </div>
              <div className="mt-3 space-y-2 text-sm text-stone-700">
                <div className="flex items-center justify-between gap-3">
                  <span>Board</span>
                  <span className="font-semibold text-stone-950">Sẵn sàng</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Quick add</span>
                  <span className="font-semibold text-stone-950">
                    {quickCreateMilestone ? `Mốc ${quickCreateMilestone.sequenceNo}` : "Chưa có"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Tập trung</span>
                  <span className="font-semibold text-stone-950">{focusTasks.length}</span>
                </div>
              </div>
            </div>
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
