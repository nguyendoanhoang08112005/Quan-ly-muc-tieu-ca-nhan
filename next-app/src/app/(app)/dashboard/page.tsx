import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { TaskBoard } from "@/features/tasks/components/task-board";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import { getDashboardOverviewForUser } from "@/server/modules/dashboard/queries";
import { listTasksForUser } from "@/server/modules/tasks/queries";

export default async function DashboardPage() {
  const userId = await requireAuthenticatedUserId();
  const [dashboard, tasks] = await Promise.all([
    getDashboardOverviewForUser(userId),
    listTasksForUser(userId)
  ]);
  const openTasks = tasks.filter((task) => task.status !== "completed");
  const focusTasks = openTasks.filter((task) => task.isFocus);

  return (
    <div className="flex w-full max-w-none flex-col gap-4">
      <section className="ui-toolbar-panel px-4 py-3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-stone-500">
              Workspace
            </p>
            <h1 className="mt-1 text-xl font-black tracking-tight text-stone-950">
              Bảng công việc
            </h1>
            <p className="mt-1 text-sm text-stone-600">
              Kéo thả để đổi trạng thái. Đây là màn điều phối chính của bạn.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              className={cn(buttonVariants({ size: "sm" }), "gap-2 rounded-full !text-white")}
              href="/goals/new"
            >
              <Plus className="h-4 w-4" />
              Tạo mục tiêu
            </Link>
            <Link
              className={cn(buttonVariants({ size: "sm", variant: "secondary" }), "rounded-full")}
              href="/tasks"
            >
              Mở công việc
            </Link>
            <Link
              className={cn(buttonVariants({ size: "sm", variant: "secondary" }), "rounded-full")}
              href="/goals"
            >
              Mở mục tiêu
            </Link>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="ui-pill">
            Đang mở
            <strong className="font-semibold text-stone-900">{openTasks.length}</strong>
          </span>
          <span className="ui-pill">
            Tập trung
            <strong className="font-semibold text-stone-900">{focusTasks.length}</strong>
          </span>
          <span className="ui-pill">
            Quá hạn
            <strong className="font-semibold text-stone-900">
              {dashboard.summary.overdueTasks}
            </strong>
          </span>
          <span className="ui-pill">
            Hôm nay
            <strong className="font-semibold text-stone-900">
              {dashboard.summary.tasksToday}
            </strong>
          </span>
        </div>
      </section>

      <TaskBoard tasks={tasks} />
    </div>
  );
}
