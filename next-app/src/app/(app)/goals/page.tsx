import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PageFilterForm } from "@/components/shared/page-filter-form";
import { WorkspaceViewTabs } from "@/components/shared/workspace-view-tabs";
import { GoalBoard } from "@/features/goals/components/goal-board";
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
    view?: string | string[];
  }>;
};

function buildGoalsHref({
  q,
  status,
  view
}: {
  q: string;
  status: string;
  view: "board" | "list";
}) {
  const params = new URLSearchParams();

  if (q) {
    params.set("q", q);
  }

  if (status !== "all") {
    params.set("status", status);
  }

  if (view !== "board") {
    params.set("view", view);
  }

  const query = params.toString();

  return query ? `/goals?${query}` : "/goals";
}

export default async function GoalsPage({ searchParams }: GoalsPageProps) {
  const userId = await requireAuthenticatedUserId();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const goals = await listGoalsForUser(userId);
  const query = getSingleSearchParam(resolvedSearchParams?.q).trim();
  const statusFilter = getSingleSearchParam(resolvedSearchParams?.status) || "all";
  const view = getSingleSearchParam(resolvedSearchParams?.view) === "list" ? "list" : "board";

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
      <section className="ui-toolbar-panel px-4 py-3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-stone-500">
              Mục tiêu
            </p>
            <h1 className="mt-1 text-xl font-black tracking-tight text-stone-950">
              Workspace mục tiêu
            </h1>
            <p className="mt-1 text-sm text-stone-600">
              Chuyển giữa bảng và danh sách để điều phối mục tiêu theo cách gọn hơn.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <WorkspaceViewTabs
              tabs={[
                {
                  active: view === "board",
                  count: filteredGoals.length,
                  href: buildGoalsHref({ q: query, status: statusFilter, view: "board" }),
                  label: "Bảng"
                },
                {
                  active: view === "list",
                  count: filteredGoals.length,
                  href: buildGoalsHref({ q: query, status: statusFilter, view: "list" }),
                  label: "Danh sách"
                }
              ]}
            />
            <Link
              className={cn(buttonVariants({ size: "sm" }), "gap-2 rounded-full !text-white")}
              href="/goals/new"
            >
              <Plus className="h-4 w-4" />
              Tạo mục tiêu
            </Link>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="ui-pill">
            Tổng mục tiêu
            <strong className="font-semibold text-stone-900">{filteredGoals.length}</strong>
          </span>
          <span className="ui-pill">
            Đang thực hiện
            <strong className="font-semibold text-stone-900">{inProgressGoals.length}</strong>
          </span>
          <span className="ui-pill">
            Hoàn thành
            <strong className="font-semibold text-stone-900">{completedGoals.length}</strong>
          </span>
          <span className="ui-pill">
            Hạn gần nhất
            <strong className="font-semibold text-stone-900">
              {nearestDeadline ? formatDisplayDate(nearestDeadline.targetDate) : "Chưa có"}
            </strong>
          </span>
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
        hiddenFields={view === "list" ? [{ name: "view", value: "list" }] : []}
        resetHref={view === "list" ? "/goals?view=list" : "/goals"}
        resultLabel={`Đang hiển thị ${filteredGoals.length}/${goals.length} mục tiêu.`}
        searchPlaceholder="Tìm theo tên, mô tả, danh mục hoặc thẻ"
        searchValue={query}
      />

      {filteredGoals.length > 0 ? (
        view === "board" ? (
          <GoalBoard goals={filteredGoals} />
        ) : (
          <section className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
            {filteredGoals.map((goal) => (
              <GoalCard goal={goal} key={goal.id} />
            ))}
          </section>
        )
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
        <EmptyGoalsState />
      )}
    </div>
  );
}
