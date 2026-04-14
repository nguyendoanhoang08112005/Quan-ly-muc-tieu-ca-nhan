import Link from "next/link";
import { Compass, PawPrint, Plus, Sparkles, Target } from "lucide-react";
import { PawTrail } from "@/components/ornaments/paw-trail";
import { buttonVariants } from "@/components/ui/button";
import { PageEmptyState, PageSectionTitle } from "@/components/shared/app-page-patterns";
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
      <section className="relative overflow-hidden rounded-[2rem] border border-[#e8dfd5] bg-white px-5 py-5 shadow-[0_20px_50px_-40px_rgba(28,25,23,0.22)]">
        <div className="pointer-events-none absolute -right-10 top-0 h-28 w-28 rounded-full bg-[#edf5e8] blur-3xl" />
        <div className="pointer-events-none absolute left-1/4 top-0 h-24 w-24 rounded-full bg-[#f7faf4] blur-3xl" />
        <PawTrail className="right-16 top-16 h-24 w-[14rem]" variant="bamboo" />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfd3] bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-stone-600">
                <Sparkles className="h-3.5 w-3.5" />
                Mục tiêu
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d8e6cf] bg-[#f5fbf1] px-3 py-1 text-[11px] font-semibold text-[#62814f]">
                <PawPrint className="h-3.5 w-3.5" />
                Gấu trúc giữ nhịp
              </div>
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-stone-950">
              Mục tiêu rõ. Đích đến rõ.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
              Tạo mới, lọc nhanh và giữ toàn bộ mục tiêu trong một màn hình.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.35rem] border border-[#e6ddd2] bg-white px-4 py-4 shadow-sm">
                <div className="flex items-center gap-2 text-stone-500">
                  <Target className="h-4 w-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">
                    Tổng mục tiêu
                  </span>
                </div>
                <p className="mt-2 text-2xl font-black text-stone-950">{filteredGoals.length}</p>
              </div>

              <div className="rounded-[1.35rem] border border-[#dfead8] bg-white px-4 py-4 shadow-sm">
                <div className="flex items-center gap-2 text-stone-500">
                  <Compass className="h-4 w-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">
                    Đang thực hiện
                  </span>
                </div>
                <p className="mt-2 text-2xl font-black text-stone-950">{inProgressGoals.length}</p>
              </div>

              <div className="rounded-[1.35rem] border border-[#e6ddd2] bg-white px-4 py-4 shadow-sm">
                <div className="flex items-center gap-2 text-stone-500">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">
                    Hoàn thành
                  </span>
                </div>
                <p className="mt-2 text-2xl font-black text-stone-950">{completedGoals.length}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2 xl:justify-end">
              <Link
                className={cn(
                  buttonVariants({ size: "sm", variant: "secondary" }),
                  "rounded-full border-[#e5dbd0] bg-white"
                )}
                href="/tasks/board"
              >
                Mở bảng kéo thả
              </Link>
              <Link
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "gap-2 rounded-full !text-white"
                )}
                href="/goals?create=1"
              >
                <Plus className="h-4 w-4" />
                Tạo mục tiêu
              </Link>
            </div>

            <div className="rounded-[1.45rem] border border-[#dfead8] bg-[#f8fcf5] px-4 py-4 shadow-sm">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-stone-500">
                <PawPrint className="h-3.5 w-3.5" />
                Nhịp mục tiêu
              </div>
              <div className="mt-3 space-y-2 text-sm text-stone-700">
                <div className="flex items-center justify-between gap-3">
                  <span>Form tạo mới</span>
                  <span className="font-semibold text-stone-950">
                    {shouldOpenCreatePanel ? "Đang mở" : "Thu gọn"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Hạn gần nhất</span>
                  <span className="font-semibold text-stone-950">
                    {nearestDeadline ? formatDisplayDate(nearestDeadline.targetDate) : "Chưa có"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Đang chạy</span>
                  <span className="font-semibold text-stone-950">{inProgressGoals.length}</span>
                </div>
              </div>
            </div>
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
        <section className="space-y-4">
          <PageSectionTitle
            description="Tiến độ, nhịp mục tiêu và quyền xem đều nằm gọn ngay trên từng card."
            eyebrow="Danh sách mục tiêu"
            title="Các mục tiêu đang hiện trên màn"
          />
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {filteredGoals.map((goal) => (
              <GoalCard goal={goal} key={goal.id} />
            ))}
          </div>
        </section>
      ) : goals.length > 0 ? (
        <PageEmptyState
          description="Đổi bộ lọc hoặc từ khóa tìm kiếm để quay lại danh sách rộng hơn."
          title="Không tìm thấy mục tiêu phù hợp"
        />
      ) : (
        <PageEmptyState
          action={
            <Link
              className={cn(buttonVariants({ size: "sm" }), "gap-2 rounded-full !text-white")}
              href="/goals?create=1"
            >
              <Plus className="h-4 w-4" />
              Tạo mục tiêu đầu tiên
            </Link>
          }
          description="Form tạo mới đã mở ở phía trên. Chỉ cần nhập tên, thời gian và ưu tiên để bắt đầu."
          title="Chưa có mục tiêu nào"
        />
      )}
    </div>
  );
}
