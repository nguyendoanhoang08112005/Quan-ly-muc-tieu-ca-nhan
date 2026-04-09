import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { TaskBoard } from "@/features/tasks/components/task-board";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import { getDashboardOverviewForUser } from "@/server/modules/dashboard/queries";
import { listMilestoneQuickCreateOptionsForUser } from "@/server/modules/milestones/queries";
import { listTasksForUser } from "@/server/modules/tasks/queries";

export default async function DashboardPage() {
  const userId = await requireAuthenticatedUserId();
  const [dashboard, tasks, quickCreateMilestones] = await Promise.all([
    getDashboardOverviewForUser(userId),
    listTasksForUser(userId),
    listMilestoneQuickCreateOptionsForUser(userId, 20)
  ]);
  const openTasks = tasks.filter((task) => task.status !== "completed");
  const focusTasks = openTasks.filter((task) => task.isFocus);
  const overdueTasks = dashboard.summary.overdueTasks;
  const referenceNow = new Date().toISOString();

  return (
    <div className="flex w-full max-w-none flex-col gap-4">
      <section className="ui-toolbar-panel px-3 py-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <h1 className="text-sm font-semibold tracking-tight text-stone-950">
              Bảng công việc
            </h1>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="ui-pill">
                Đang mở
                <strong className="font-semibold text-stone-900">{openTasks.length}</strong>
              </span>
              <span className="ui-pill">
                Tập trung
                <strong className="font-semibold text-stone-900">{focusTasks.length}</strong>
              </span>
              <span
                className={cn(
                  "ui-pill",
                  overdueTasks > 0 && "border-rose-200 bg-rose-50 text-rose-700"
                )}
              >
                Quá hạn
                <strong
                  className={cn(
                    "font-semibold",
                    overdueTasks > 0 ? "text-rose-700" : "text-stone-900"
                  )}
                >
                  {overdueTasks}
                </strong>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              className={cn(buttonVariants({ size: "sm" }), "gap-2 rounded-full !text-white")}
              href="/goals/new"
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
        quickCreateMilestones={quickCreateMilestones}
        referenceNow={referenceNow}
        tasks={tasks}
      />
    </div>
  );
}
