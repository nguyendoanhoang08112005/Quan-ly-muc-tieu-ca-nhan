import Link from "next/link";
import { Plus } from "lucide-react";
import { PageEmptyState, PageHero, PageSectionTitle } from "@/components/shared/app-page-patterns";
import { buttonVariants } from "@/components/ui/button";
import { GoalCard } from "@/features/goals/components/goal-card";
import { FollowGoalCard } from "@/features/follows/components/follow-goal-card";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import { listGoalsForUser } from "@/server/modules/goals/queries";
import { getFollowOverviewForUser } from "@/server/modules/follows/queries";

export default async function FollowsPage() {
  const userId = await requireAuthenticatedUserId();
  const [overview, goals] = await Promise.all([
    getFollowOverviewForUser(userId),
    listGoalsForUser(userId)
  ]);
  const publicGoals = goals.filter((goal) => goal.isPublic);

  return (
    <div className="flex w-full max-w-none flex-col gap-4">
      <PageHero
        actions={
          <Link
            className={cn(buttonVariants({ size: "sm", variant: "secondary" }), "rounded-full")}
            href="/goals"
          >
            Mở mục tiêu của tôi
          </Link>
        }
        aside={
          <div className="rounded-[1.45rem] border border-[#eadfd4] bg-[#fffaf6] px-4 py-4 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-stone-500">
              Theo dõi nhanh
            </p>
            <div className="mt-3 space-y-2 text-sm text-stone-700">
              <div className="flex items-center justify-between gap-3">
                <span>Đang theo dõi</span>
                <span className="font-semibold text-stone-950">{overview.followedGoals.length}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Khám phá</span>
                <span className="font-semibold text-stone-950">{overview.discoverGoals.length}</span>
              </div>
            </div>
          </div>
        }
        description="Mở rộng khỏi danh sách riêng của bạn để xem những mục tiêu công khai có thể theo dõi ngay."
        eyebrow="Không gian mở rộng"
        metrics={[
          { label: "Đang theo dõi", value: overview.followedGoals.length, hint: "Mục tiêu đã follow" },
          { label: "Khám phá", value: overview.discoverGoals.length, tone: "warm", hint: "Có thể theo dõi ngay" },
          { label: "Mục tiêu công khai của bạn", value: publicGoals.length, tone: "bamboo", hint: "Đang mở cho người khác" }
        ]}
        title="Mục tiêu công khai quanh bạn"
        trailVariant="bamboo"
      />

      <section className="space-y-6">
        <PageSectionTitle eyebrow="Mục tiêu công khai của bạn" title="Các mục tiêu đang mở cho người khác theo dõi" />

        {publicGoals.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {publicGoals.map((goal) => (
              <GoalCard goal={goal} key={goal.id} />
            ))}
          </div>
        ) : (
          <PageEmptyState
            description="Hãy bật ô công khai trong biểu mẫu mục tiêu nếu bạn muốn mục tiêu xuất hiện trong khu vực theo dõi."
            title="Bạn chưa công khai mục tiêu nào"
          />
        )}
      </section>

      <section className="space-y-6">
        <PageSectionTitle eyebrow="Đang theo dõi" title="Mục tiêu công khai bạn đang theo dõi" />

        {overview.followedGoals.length > 0 ? (
          <div className="grid gap-6">
            {overview.followedGoals.map((goal) => (
              <FollowGoalCard goal={goal} key={goal.id} variant="following" />
            ))}
          </div>
        ) : (
          <PageEmptyState
            description="Khám phá danh sách công khai bên dưới để bắt đầu theo dõi."
            title="Bạn chưa theo dõi mục tiêu nào"
          />
        )}
      </section>

      <section className="space-y-6">
        <PageSectionTitle eyebrow="Khám phá công khai" title="Mục tiêu có thể theo dõi ngay" />

        {overview.discoverGoals.length > 0 ? (
          <div className="grid gap-6">
            {overview.discoverGoals.map((goal) => (
              <FollowGoalCard goal={goal} key={goal.id} variant="discover" />
            ))}
          </div>
        ) : (
          <PageEmptyState
            description="Khi người dùng khác công khai thêm mục tiêu, danh sách này sẽ tự động cập nhật."
            title="Chưa có mục tiêu công khai mới để khám phá"
          />
        )}
      </section>
    </div>
  );
}
