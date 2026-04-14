import Link from "next/link";
import { AlertTriangle, CheckCircle2, Compass, ListChecks, Plus, Target } from "lucide-react";
import { PageHero } from "@/components/shared/app-page-patterns";
import { buttonVariants } from "@/components/ui/button";
import { TaskBoard } from "@/features/tasks/components/task-board";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import { listGoalsForUser } from "@/server/modules/goals/queries";
import { listMilestoneQuickCreateOptionsForUser } from "@/server/modules/milestones/queries";
import { listTasksForUser } from "@/server/modules/tasks/queries";

function getTaskDueTime(dueAt: string | null) {
  if (!dueAt) {
    return Number.POSITIVE_INFINITY;
  }

  const dueTime = new Date(dueAt).getTime();

  return Number.isNaN(dueTime) ? Number.POSITIVE_INFINITY : dueTime;
}

export default async function TaskBoardPage() {
  const userId = await requireAuthenticatedUserId();
  const [goals, tasks, quickCreateMilestones] = await Promise.all([
    listGoalsForUser(userId),
    listTasksForUser(userId),
    listMilestoneQuickCreateOptionsForUser(userId, 100)
  ]);
  const referenceDate = new Date();
  const referenceNow = referenceDate.toISOString();
  const referenceTime = referenceDate.getTime();
  const openTasks = tasks.filter((task) => task.status !== "completed");
  const completedTasks = tasks.filter((task) => task.status === "completed");
  const focusTasks = openTasks.filter((task) => task.isFocus);
  const overdueTasks = openTasks.filter((task) => getTaskDueTime(task.dueAt) < referenceTime);
  const quickCreateMilestone = quickCreateMilestones[0] ?? null;

  return (
    <div className="flex w-full max-w-none flex-col gap-4">
      <PageHero
        actions={
          <>
            <Link
              className={cn(buttonVariants({ size: "sm" }), "gap-2 rounded-full !text-white")}
              href={
                quickCreateMilestone
                  ? `/goals/${quickCreateMilestone.goal.id}/milestones/${quickCreateMilestone.id}/tasks/new`
                  : "/goals"
              }
            >
              <Plus className="h-4 w-4" />
              {quickCreateMilestone ? "Thêm việc" : "Tạo mục tiêu trước"}
            </Link>
            <Link
              className={cn(
                buttonVariants({ size: "sm", variant: "secondary" }),
                "rounded-full"
              )}
              href="/dashboard"
            >
              Về tổng quan
            </Link>
          </>
        }
        aside={
          <div className="rounded-[1.45rem] border border-[#eadfd4] bg-[#fffaf6] px-4 py-4 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-stone-500">
              Cách dùng nhanh
            </p>
            <div className="mt-3 space-y-2 text-sm text-stone-700">
              <div className="flex items-center justify-between gap-3">
                <span>Kéo card</span>
                <span className="font-semibold text-stone-950">Đổi trạng thái</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Lọc nhanh</span>
                <span className="font-semibold text-stone-950">Focus / quá hạn</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Quick add</span>
                <span className="font-semibold text-stone-950">
                  {quickCreateMilestone ? `Mốc ${quickCreateMilestone.sequenceNo}` : "Chưa có mốc"}
                </span>
              </div>
            </div>
          </div>
        }
        description="Đây là trang riêng cho thao tác kéo thả: đổi trạng thái, thêm việc nhanh trong đúng cột mốc và lọc board theo ngữ cảnh làm việc."
        eyebrow="Bảng kéo thả"
        metrics={[
          {
            icon: Compass,
            label: "Đang mở",
            value: openTasks.length,
            hint: "Chưa hoàn thành"
          },
          {
            icon: Target,
            label: "Tập trung",
            value: focusTasks.length,
            tone: "warm",
            hint: "Đang được ghim"
          },
          {
            icon: AlertTriangle,
            label: "Quá hạn",
            value: overdueTasks.length,
            tone: overdueTasks.length > 0 ? "alert" : "neutral",
            hint: "Cần xử lý trước"
          },
          {
            icon: CheckCircle2,
            label: "Hoàn thành",
            value: completedTasks.length,
            tone: "bamboo",
            hint: "Đã kéo xong"
          }
        ]}
        title="Bảng kéo thả công việc"
        trailVariant="mixed"
      />

      {tasks.length > 0 || quickCreateMilestones.length > 0 ? (
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
      ) : (
        <section className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-12 text-center shadow-sm">
          <ListChecks className="mx-auto h-8 w-8 text-stone-400" />
          <h2 className="mt-4 text-2xl font-black text-stone-950">
            Chưa có dữ liệu để kéo thả
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-stone-500">
            Cần có ít nhất một mục tiêu và cột mốc để thêm việc trực tiếp trên board.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              className={cn(buttonVariants({ size: "sm" }), "rounded-full !text-white")}
              href="/goals?create=1"
            >
              Tạo mục tiêu
            </Link>
            <Link
              className={cn(
                buttonVariants({ size: "sm", variant: "secondary" }),
                "rounded-full"
              )}
              href="/goals"
            >
              Mở mục tiêu
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
