import { CalendarDays, Flag, PawPrint, Users } from "lucide-react";
import {
  goalPriorityClassNames,
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
    <article className="relative overflow-hidden rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm">
      <div className="pointer-events-none absolute -right-10 top-0 h-28 w-28 rounded-full bg-[#fff3eb] blur-3xl" />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="min-w-0">
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
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
                goalPriorityClassNames[goal.priority]
              )}
            >
              {goalPriorityLabels[goal.priority]}
            </span>
          </div>

          <h3 className="mt-4 text-2xl font-black tracking-tight text-stone-950">
            {goal.title}
          </h3>
          <p className="mt-2 text-sm font-semibold text-stone-500">
            Bởi {goal.owner.name}
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            {goal.description || "Mục tiêu công khai này chưa có mô tả chi tiết."}
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

          <div className="mt-5 grid gap-2 md:grid-cols-3">
            <div className="rounded-[1.15rem] border border-[#ebe1d7] bg-[#fffdfa] px-3 py-3 text-[11px] text-stone-500">
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>Hạn</span>
              </div>
              <p className="mt-1.5 font-semibold text-stone-800">
                {formatDisplayDate(goal.targetDate, "Chưa đặt")}
              </p>
            </div>
            <div className="rounded-[1.15rem] border border-[#ebe1d7] bg-[#fffdfa] px-3 py-3 text-[11px] text-stone-500">
              <div className="flex items-center gap-1.5">
                <Flag className="h-3.5 w-3.5" />
                <span>Phạm vi</span>
              </div>
              <p className="mt-1.5 font-semibold text-stone-800">
                {goal.milestonesCount} mốc / {goal.tasksCount} việc
              </p>
            </div>
            <div className="rounded-[1.15rem] border border-[#ebe1d7] bg-[#fffdfa] px-3 py-3 text-[11px] text-stone-500">
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                <span>Theo dõi</span>
              </div>
              <p className="mt-1.5 font-semibold text-stone-800">{goal.followerCount} người</p>
            </div>
          </div>
        </div>

        <aside className="rounded-[1.6rem] border border-[#efe3d8] bg-[#fffaf6] p-4 shadow-[0_16px_30px_-30px_rgba(28,25,23,0.2)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-500">
            {variant === "discover" ? "Khám phá" : "Đang theo dõi"}
          </p>
          <div className="mt-3">
            <div className="text-4xl font-black tracking-tight text-stone-950">
              {Math.round(goal.progress)}%
            </div>
            <p className="mt-1 text-sm text-stone-600">Tiến độ hiện tại</p>
          </div>

          <div className="mt-4 space-y-3 text-sm text-stone-700">
            <div className="rounded-[1rem] border border-[#efe3d8] bg-white px-3 py-2.5">
              <div className="flex items-center justify-between gap-3">
                <span>Người sở hữu</span>
                <span className="font-semibold text-stone-950">{goal.owner.name}</span>
              </div>
            </div>
            <div className="rounded-[1rem] border border-[#efe3d8] bg-white px-3 py-2.5">
              <div className="flex items-center justify-between gap-3">
                <span>Trạng thái</span>
                <span className="font-semibold text-stone-950">{goalStatusLabels[goal.status]}</span>
              </div>
            </div>
            <div className="rounded-[1rem] border border-[#efe3d8] bg-white px-3 py-2.5">
              <div className="flex items-center justify-between gap-3">
                <span>{goal.followedAt ? "Theo dõi từ" : "Hiển thị"}</span>
                <span className="font-semibold text-stone-950">
                  {goal.followedAt ? formatDisplayDateTime(goal.followedAt) : "Công khai"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-[#eadfd4] pt-4">
            <div className="mb-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-stone-500">
              <PawPrint className="h-3.5 w-3.5 text-[#c97b5f]" />
              {variant === "discover" ? "Theo dõi để xem gần hơn" : "Có thể bỏ theo dõi bất cứ lúc nào"}
            </div>
            {variant === "discover" ? (
              <FollowGoalForm goalId={goal.id} />
            ) : (
              <UnfollowGoalForm goalId={goal.id} />
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}
