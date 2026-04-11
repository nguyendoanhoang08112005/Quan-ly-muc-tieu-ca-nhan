import Link from "next/link";
import { Compass, Plus, Sparkles, Target } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PageFilterForm } from "@/components/shared/page-filter-form";
import { GoalCard } from "@/features/goals/components/goal-card";
import { GoalsInlineCreatePanel } from "@/features/goals/components/goals-inline-create-panel";
import { goalStatusLabels } from "@/features/goals/goal-helpers";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { formatDisplayDate } from "@/lib/dates";
import { getSingleSearchParam, matchesSearchTerm } from "@/lib/search-params";
import { cn } from "@/lib/utils";
import {
  listGoalMetadataOptions,
  listGoalsForUser
} from "@/server/modules/goals/queries";

type GoalsPageProps = {
  searchParams?: Promise<{
    create?: string | string[];
    created?: string | string[];
    q?: string | string[];
    status?: string | string[];
  }>;
};

export default async function GoalsPage({ searchParams }: GoalsPageProps) {
  const userId = await requireAuthenticatedUserId();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const [goals, options] = await Promise.all([
    listGoalsForUser(userId),
    listGoalMetadataOptions(userId)
  ]);
  const query = getSingleSearchParam(resolvedSearchParams?.q).trim();
  const statusFilter = getSingleSearchParam(resolvedSearchParams?.status) || "all";
  const shouldOpenCreatePanel =
    getSingleSearchParam(resolvedSearchParams?.create) === "1" || goals.length === 0;
  const wasJustCreated = getSingleSearchParam(resolvedSearchParams?.created) === "1";

  const filteredGoals = goals.filter((goal) => {
    const matchesStatus = statusFilter === "all" || goal.status === statusFilter;

    return (
      matchesStatus &&
      matchesSearchTerm(query, [
        goal.title,
        goal.description,
        goal.category?.name,
        ...goal.tags.map((tag) => tag.name)
      ])
    );
  });

  const completedGoals = filteredGoals.filter((goal) => goal.status === "completed");
  const inProgressGoals = filteredGoals.filter((goal) => goal.status === "in_progress");
  const nearestDeadline = filteredGoals
    .flatMap((goal) => {
      if (!goal.targetDate) {
        return [];
      }

      return [
        {
          deadline: new Date(goal.targetDate).getTime(),
          goal
        }
      ];
    })
    .sort((left, right) => left.deadline - right.deadline)[0]?.goal;

  return (
    <div className="flex w-full max-w-none flex-col gap-4">
      <section className="relative overflow-hidden rounded-[2rem] border border-stone-200 bg-[linear-gradient(135deg,#fcfcfb_0%,#f7f7f5_48%,#eff6ff_100%)] px-5 py-5 shadow-sm">
        <div className="pointer-events-none absolute -right-12 top-0 h-36 w-36 rounded-full bg-amber-100/60 blur-3xl" />
        <div className="pointer-events-none absolute left-1/3 top-10 h-24 w-24 rounded-full bg-sky-100/70 blur-2xl" />
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-stone-600 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Goal Space
            </div>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-stone-950 sm:text-3xl">
              Kế hoạch mục tiêu
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-stone-600">
              Tạo mới và theo dõi mục tiêu trong cùng một màn hình.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              className={cn(
                buttonVariants({ size: "sm", variant: "secondary" }),
                "rounded-full"
              )}
              href="/dashboard"
            >
              Mở bảng công việc
            </Link>
            <Link
              className={cn(buttonVariants({ size: "sm" }), "gap-2 rounded-full !text-white")}
              href="/goals?create=1"
            >
              <Plus className="h-4 w-4" />
              Tạo mục tiêu
            </Link>
          </div>
        </div>

        <div className="relative z-10 mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.5rem] border border-white/80 bg-white/85 px-4 py-4 backdrop-blur">
            <div className="flex items-center gap-2 text-stone-500">
              <Target className="h-4 w-4" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">
              Tổng mục tiêu
              </p>
            </div>
            <p className="mt-2 text-2xl font-black text-stone-950">{filteredGoals.length}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/80 bg-white/85 px-4 py-4 backdrop-blur">
            <div className="flex items-center gap-2 text-stone-500">
              <Compass className="h-4 w-4" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">
              Đang thực hiện
              </p>
            </div>
            <p className="mt-2 text-2xl font-black text-stone-950">{inProgressGoals.length}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/80 bg-white/85 px-4 py-4 backdrop-blur">
            <div className="flex items-center gap-2 text-stone-500">
              <Sparkles className="h-4 w-4" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">
              Hoàn thành
              </p>
            </div>
            <p className="mt-2 text-2xl font-black text-stone-950">{completedGoals.length}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/80 bg-white/85 px-4 py-4 backdrop-blur">
            <div className="flex items-center gap-2 text-stone-500">
              <Plus className="h-4 w-4" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">
              Hạn gần nhất
              </p>
            </div>
            <p className="mt-2 text-base font-bold text-stone-950">
              {nearestDeadline ? formatDisplayDate(nearestDeadline.targetDate) : "Chưa có"}
            </p>
          </div>
        </div>
      </section>

      <GoalsInlineCreatePanel
        categories={options.categories}
        initialOpen={shouldOpenCreatePanel}
        tags={options.tags}
        wasJustCreated={wasJustCreated}
      />

      <PageFilterForm
        filters={[
          {
            label: "Trạng thái",
            name: "status",
            options: [
              { label: "Tất cả trạng thái", value: "all" },
              ...Object.entries(goalStatusLabels).map(([value, label]) => ({
                label,
                value
              }))
            ],
            value: statusFilter
          }
        ]}
        resetHref="/goals"
        resultLabel={`Đang hiển thị ${filteredGoals.length}/${goals.length} mục tiêu.`}
        searchPlaceholder="Tìm theo tên, mô tả, danh mục hoặc thẻ"
        searchValue={query}
      />

      {filteredGoals.length > 0 ? (
        <section className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {filteredGoals.map((goal) => (
            <GoalCard goal={goal} key={goal.id} />
          ))}
        </section>
      ) : goals.length > 0 ? (
        <section className="ui-panel border-dashed px-6 py-10 text-center">
          <h2 className="text-xl font-black text-stone-950">
            Không tìm thấy mục tiêu phù hợp
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-500">
            Hãy điều chỉnh bộ lọc để quay lại danh sách mục tiêu rộng hơn.
          </p>
        </section>
      ) : (
        <section className="ui-panel border-dashed px-6 py-10 text-center">
          <h2 className="text-xl font-black text-stone-950">Chưa có mục tiêu nào</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-stone-600">
            Biểu mẫu tạo mục tiêu đã được mở ngay phía trên. Tạo xong, mục tiêu sẽ xuất
            hiện trong danh sách này để bạn kiểm tra và tiếp tục chỉnh chi tiết nếu cần.
          </p>
        </section>
      )}
    </div>
  );
}
