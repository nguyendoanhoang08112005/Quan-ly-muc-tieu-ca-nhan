import { CalendarDays, Flag, Users } from "lucide-react";
import {
  goalPriorityLabels,
  goalStatusClassNames,
  goalStatusLabels,
  goalTypeLabels
} from "@/features/goals/goal-helpers";
import { FollowGoalForm } from "@/features/follows/components/follow-goal-form";
import type { FollowGoalListItem } from "@/features/follows/types";
import { UnfollowGoalForm } from "@/features/follows/components/unfollow-goal-form";
import { formatDisplayDate, formatDisplayDateTime } from "@/lib/dates";
import { cn } from "@/lib/utils";

export function FollowGoalCard({
  goal,
  variant
}: {
  goal: FollowGoalListItem;
  variant: "discover" | "following";
}) {
  return (
    <article className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-4xl">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
              {goalTypeLabels[goal.goalType]}
            </span>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
                goalStatusClassNames[goal.status]
              )}
            >
              {goalStatusLabels[goal.status]}
            </span>
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
              {goalPriorityLabels[goal.priority]}
            </span>
          </div>

          <h3 className="mt-4 text-2xl font-black tracking-tight text-stone-950">
            {goal.title}
          </h3>
          <p className="mt-2 text-sm font-semibold text-stone-500">
            Owner: {goal.owner.name}
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            {goal.description}
          </p>

          {goal.category || goal.tags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {goal.category ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-stone-400"
                    style={{
                      backgroundColor: goal.category.color ?? undefined
                    }}
                  />
                  {goal.category.name}
                </span>
              ) : null}
              {goal.tags.slice(0, 3).map((tag) => (
                <span
                  className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600"
                  key={tag.id}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-stone-400"
                    style={{
                      backgroundColor: tag.color ?? undefined
                    }}
                  />
                  #{tag.name}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="rounded-[1.5rem] bg-stone-50 px-4 py-4 text-right">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
            Progress
          </div>
          <div className="mt-2 text-3xl font-black text-stone-950">
            {Math.round(goal.progress)}%
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-stone-600 md:grid-cols-2 xl:grid-cols-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          <span>Han {formatDisplayDate(goal.targetDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Flag className="h-4 w-4" />
          <span>
            {goal.milestonesCount} milestone • {goal.tasksCount} task
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>{goal.followerCount} follower</span>
        </div>
        <div className="text-stone-500">
          {goal.followedAt
            ? `Theo doi tu ${formatDisplayDateTime(goal.followedAt)}`
            : "Goal cong khai"}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-stone-200 pt-5">
        {variant === "discover" ? (
          <FollowGoalForm goalId={goal.id} />
        ) : (
          <UnfollowGoalForm goalId={goal.id} />
        )}
      </div>
    </article>
  );
}
