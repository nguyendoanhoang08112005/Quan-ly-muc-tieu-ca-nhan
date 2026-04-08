import { GoalCard } from "@/features/goals/components/goal-card";
import { FollowGoalCard } from "@/features/follows/components/follow-goal-card";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
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
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-500">
              Phase 10
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-950 md:text-5xl">
              Follow public goals
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600">
              Module follow đã có privacy rõ ràng: chỉ goal công khai mới xuất
              hiện ở đây, và bạn có thể follow/unfollow bằng Server Actions.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] bg-stone-950 px-5 py-5 text-white">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-300">
              Đang theo dõi
            </div>
            <div className="mt-2 text-4xl font-black">
              {overview.followedGoals.length}
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
              Khám phá
            </div>
            <div className="mt-2 text-4xl font-black text-stone-950">
              {overview.discoverGoals.length}
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
              Goal công khai của bạn
            </div>
            <div className="mt-2 text-4xl font-black text-stone-950">
              {publicGoals.length}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">
            Goals công khai của bạn
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950">
            Các goal đang mở cho người khác theo dõi
          </h2>
        </div>

        {publicGoals.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {publicGoals.map((goal) => (
              <GoalCard goal={goal} key={goal.id} />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-12 text-center shadow-sm">
            <h3 className="text-2xl font-black text-stone-950">
              Bạn chưa công khai goal nào
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-500">
              Hãy bật checkbox công khai trong form goal nếu bạn muốn goal xuất
              hiện trong khu vực follow.
            </p>
          </div>
        )}
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">
            Đang theo dõi
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950">
            Public goals mà bạn đã follow
          </h2>
        </div>

        {overview.followedGoals.length > 0 ? (
          <div className="grid gap-6">
            {overview.followedGoals.map((goal) => (
              <FollowGoalCard goal={goal} key={goal.id} variant="following" />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-12 text-center shadow-sm">
            <h3 className="text-2xl font-black text-stone-950">
              Bạn chưa follow goal nào
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-500">
              Khám phá danh sách công khai bên dưới để bắt đầu theo dõi.
            </p>
          </div>
        )}
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">
            Khám phá công khai
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950">
            Goals có thể follow ngay
          </h2>
        </div>

        {overview.discoverGoals.length > 0 ? (
          <div className="grid gap-6">
            {overview.discoverGoals.map((goal) => (
              <FollowGoalCard goal={goal} key={goal.id} variant="discover" />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-12 text-center shadow-sm">
            <h3 className="text-2xl font-black text-stone-950">
              Chưa có public goal mới để khám phá
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-500">
              Khi người dùng khác công khai thêm goal, danh sách này sẽ tự động
              cập nhật.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
