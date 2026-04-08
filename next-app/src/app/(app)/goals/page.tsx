import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PageFilterForm } from "@/components/shared/page-filter-form";
import { EmptyGoalsState } from "@/features/goals/components/empty-goals-state";
import { GoalCard } from "@/features/goals/components/goal-card";
import { goalStatusLabels } from "@/features/goals/goal-helpers";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { formatDisplayDate } from "@/lib/dates";
import { getSingleSearchParam, matchesSearchTerm } from "@/lib/search-params";
import { cn } from "@/lib/utils";
import { listGoalsForUser } from "@/server/modules/goals/queries";

type GoalsPageProps = {
  searchParams?: Promise<{
    q?: string | string[];
    status?: string | string[];
  }>;
};

export default async function GoalsPage({ searchParams }: GoalsPageProps) {
  const userId = await requireAuthenticatedUserId();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const goals = await listGoalsForUser(userId);
  const query = getSingleSearchParam(resolvedSearchParams?.q).trim();
  const statusFilter = getSingleSearchParam(resolvedSearchParams?.status) || "all";
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
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-950 md:text-5xl">
              Danh sách mục tiêu
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600">
              Trang này đọc dữ liệu trực tiếp từ Prisma ở máy chủ, không còn tải
              bằng `useEffect`. Các thao tác tạo, sửa, xóa được xử lý bằng hành
              động phía máy chủ.
            </p>
          </div>

          <Link
            className={cn(buttonVariants({ size: "lg" }), "gap-2 rounded-full")}
            href="/goals/new"
          >
            <Plus className="h-4 w-4" />
            Tạo mục tiêu mới
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
              Tổng mục tiêu
            </div>
            <div className="mt-2 text-4xl font-black text-stone-950">
              {filteredGoals.length}
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
              Đang thực hiện
            </div>
            <div className="mt-2 text-4xl font-black text-stone-950">
              {inProgressGoals.length}
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
              Gần nhất
            </div>
            <div className="mt-2 text-xl font-black text-stone-950">
              {nearestDeadline
                ? formatDisplayDate(nearestDeadline.targetDate)
                : "Chưa có"}
            </div>
            <p className="mt-2 text-sm text-stone-500">
              {completedGoals.length} mục tiêu đã hoàn thành
            </p>
          </div>
        </div>
      </section>

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
        searchPlaceholder="Tìm theo tên mục tiêu, mô tả, danh mục hoặc thẻ"
        searchValue={query}
      />

      {filteredGoals.length > 0 ? (
        <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredGoals.map((goal) => (
            <GoalCard goal={goal} key={goal.id} />
          ))}
        </section>
      ) : goals.length > 0 ? (
        <section className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-12 text-center shadow-sm">
          <h2 className="text-2xl font-black text-stone-950">
            Không tìm thấy mục tiêu phù hợp
          </h2>
          <p className="mt-3 text-sm leading-7 text-stone-500">
            Hãy điều chỉnh bộ lọc để quay lại danh sách mục tiêu rộng hơn.
          </p>
        </section>
      ) : (
        <EmptyGoalsState />
      )}
    </div>
  );
}
