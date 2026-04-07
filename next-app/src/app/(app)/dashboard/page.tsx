import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { goalStatusLabels } from "@/features/goals/goal-helpers";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { formatDisplayDate } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { listGoalsForUser } from "@/server/modules/goals/queries";

export default async function DashboardPage() {
  const userId = await requireAuthenticatedUserId();
  const goals = await listGoalsForUser(userId);
  const recentGoals = goals.slice(0, 3);
  const completedGoals = goals.filter((goal) => goal.status === "completed");
  const inProgressGoals = goals.filter((goal) => goal.status === "in_progress");

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-500">
              Dashboard
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-950">
              Tong quan ca nhan
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600">
              Dashboard da bat dau doc du lieu that tu Prisma. O phase nay, no
              tap trung vao snapshot goal de lam diem neo cho milestone va task
              sap toi.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "rounded-full"
              )}
              href="/goals"
            >
              Xem tat ca goals
            </Link>
            <Link
              className={cn(buttonVariants({ size: "lg" }), "gap-2 rounded-full")}
              href="/goals/new"
            >
              <Plus className="h-4 w-4" />
              Tao goal moi
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] bg-stone-950 px-5 py-5 text-white">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-300">
              Tong goal
            </div>
            <div className="mt-2 text-4xl font-black">{goals.length}</div>
          </div>
          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
              Dang thuc hien
            </div>
            <div className="mt-2 text-4xl font-black text-stone-950">
              {inProgressGoals.length}
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
              Da hoan thanh
            </div>
            <div className="mt-2 text-4xl font-black text-stone-950">
              {completedGoals.length}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-stone-400">
              Muc tieu gan day
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950">
              Recent goals
            </h2>
          </div>

          <Link
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "gap-2"
            )}
            href="/goals"
          >
            Xem them
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {recentGoals.length > 0 ? (
          <div className="mt-6 grid gap-4">
            {recentGoals.map((goal) => (
              <Link
                className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5 transition hover:border-stone-950"
                href={`/goals/${goal.id}`}
                key={goal.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-stone-950">
                      {goal.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      {goal.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                      Progress
                    </div>
                    <div className="text-3xl font-black text-stone-950">
                      {Math.round(goal.progress)}%
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-stone-500">
                  {goalStatusLabels[goal.status]} • Han{" "}
                  {formatDisplayDate(goal.targetDate)} • {goal.milestonesCount}{" "}
                  milestone • {goal.tasksCount} task
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-50 px-6 py-10 text-center">
            <h3 className="text-2xl font-black text-stone-950">
              Chua co goal nao tren he moi
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-500">
              Tao goal dau tien de dashboard bat dau co du lieu that.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
