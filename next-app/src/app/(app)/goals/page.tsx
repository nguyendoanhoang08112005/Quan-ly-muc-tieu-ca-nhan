import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EmptyGoalsState } from "@/features/goals/components/empty-goals-state";
import { GoalCard } from "@/features/goals/components/goal-card";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { formatDisplayDate } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { listGoalsForUser } from "@/server/modules/goals/queries";

export default async function GoalsPage() {
  const userId = await requireAuthenticatedUserId();
  const goals = await listGoalsForUser(userId);
  const completedGoals = goals.filter((goal) => goal.status === "completed");
  const inProgressGoals = goals.filter((goal) => goal.status === "in_progress");
  const nearestDeadline = goals.find((goal) => goal.targetDate);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-500">
              Phase 4
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-950 md:text-5xl">
              Goal list da chay bang Server Component
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600">
              Trang nay doc thang tu Prisma o server, khong con fetch bang
              `useEffect`. Mutation create/edit/delete duoc dua qua Server
              Actions.
            </p>
          </div>

          <Link
            className={cn(buttonVariants({ size: "lg" }), "gap-2 rounded-full")}
            href="/goals/new"
          >
            <Plus className="h-4 w-4" />
            Tao goal moi
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
              Tong goal
            </div>
            <div className="mt-2 text-4xl font-black text-stone-950">
              {goals.length}
            </div>
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
              Gan nhat
            </div>
            <div className="mt-2 text-xl font-black text-stone-950">
              {nearestDeadline
                ? formatDisplayDate(nearestDeadline.targetDate)
                : "Chua co"}
            </div>
            <p className="mt-2 text-sm text-stone-500">
              {completedGoals.length} goal da hoan thanh
            </p>
          </div>
        </div>
      </section>

      {goals.length > 0 ? (
        <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard goal={goal} key={goal.id} />
          ))}
        </section>
      ) : (
        <EmptyGoalsState />
      )}
    </div>
  );
}
