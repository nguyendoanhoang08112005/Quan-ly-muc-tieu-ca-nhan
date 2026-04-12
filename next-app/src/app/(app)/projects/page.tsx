import Link from "next/link";
import type { Route } from "next";
import { Compass, Plus, Sparkles, Target } from "lucide-react";
import {
  PageEmptyState,
  PageHero
} from "@/components/shared/app-page-patterns";
import { buttonVariants } from "@/components/ui/button";
import { PageFilterForm } from "@/components/shared/page-filter-form";
import { DeleteProjectForm } from "@/features/projects/components/delete-project-form";
import {
  projectStatusClassNames,
  projectStatusLabels
} from "@/features/projects/project-helpers";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { formatDisplayDate } from "@/lib/dates";
import { getSingleSearchParam, matchesSearchTerm } from "@/lib/search-params";
import { cn } from "@/lib/utils";
import { listProjectsForUser } from "@/server/modules/projects/queries";

type ProjectsPageProps = {
  searchParams?: Promise<{
    q?: string | string[];
    status?: string | string[];
  }>;
};

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const userId = await requireAuthenticatedUserId();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const projects = await listProjectsForUser(userId);
  const query = getSingleSearchParam(resolvedSearchParams?.q).trim();
  const statusFilter = getSingleSearchParam(resolvedSearchParams?.status) || "all";
  const filteredProjects = projects.filter((project) => {
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;

    return (
      matchesStatus &&
      matchesSearchTerm(query, [
        project.name,
        project.description,
        project.goal?.title
      ])
    );
  });
  const activeProjects = filteredProjects.filter((project) => project.status === "active");

  return (
    <div className="flex w-full max-w-none flex-col gap-4">
      <PageHero
        actions={
          <Link
            className={cn(
              buttonVariants({ size: "sm" }),
              "gap-2 rounded-full !text-white"
            )}
            href="/projects/new"
          >
            <Plus className="h-4 w-4" />
            Tạo dự án mới
          </Link>
        }
        aside={
          <div className="rounded-[1.45rem] border border-[#eadfd4] bg-[#fffaf6] px-4 py-4 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-stone-500">
              Nhịp dự án
            </p>
            <div className="mt-3 space-y-2 text-sm text-stone-700">
              <div className="flex items-center justify-between gap-3">
                <span>Đang chạy</span>
                <span className="font-semibold text-stone-950">{activeProjects.length}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Có công việc</span>
                <span className="font-semibold text-stone-950">
                  {filteredProjects.filter((project) => project.tasksCount > 0).length}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Đang hiển thị</span>
                <span className="font-semibold text-stone-950">{filteredProjects.length}</span>
              </div>
            </div>
          </div>
        }
        description="Dự án giúp gom việc theo một nhịp triển khai rõ ràng, nhưng vẫn gắn với mục tiêu và công việc thực."
        eyebrow="Dự án"
        metrics={[
          { icon: Compass, label: "Tổng dự án", value: filteredProjects.length, hint: "Theo bộ lọc hiện tại" },
          { icon: Target, label: "Đang chạy", value: activeProjects.length, tone: "bamboo", hint: "Trạng thái active" },
          { icon: Sparkles, label: "Có công việc", value: filteredProjects.filter((project) => project.tasksCount > 0).length, tone: "warm", hint: "Có task gắn vào" }
        ]}
        title="Danh sách dự án"
        trailVariant="mixed"
      />

      <PageFilterForm
        filters={[
          {
            label: "Trạng thái",
            name: "status",
            options: [
              { label: "Tất cả trạng thái", value: "all" },
              ...Object.entries(projectStatusLabels).map(([value, label]) => ({
                label,
                value
              }))
            ],
            value: statusFilter
          }
        ]}
        resetHref="/projects"
        resultLabel={`Đang hiển thị ${filteredProjects.length}/${projects.length} dự án.`}
        searchPlaceholder="Tìm theo tên dự án, mô tả hoặc mục tiêu liên kết"
        searchValue={query}
      />

      {filteredProjects.length > 0 ? (
        <section className="grid gap-6">
          {filteredProjects.map((project) => (
            <article
              className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm"
              key={project.id}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-4xl">
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        projectStatusClassNames[project.status]
                      )}
                    >
                      {projectStatusLabels[project.status]}
                    </span>
                    {project.goal ? (
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
                        {project.goal.title}
                      </span>
                    ) : null}
                  </div>

                  <h2 className="mt-4 text-2xl font-black text-stone-950">
                    {project.name}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-stone-600">
                    {project.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-stone-500">
                    <span className="rounded-full bg-stone-100 px-3 py-1">
                      Bắt đầu {formatDisplayDate(project.startDate)}
                    </span>
                    <span className="rounded-full bg-stone-100 px-3 py-1">
                      Kết thúc {formatDisplayDate(project.endDate)}
                    </span>
                    <span className="rounded-full bg-stone-100 px-3 py-1">
                      {project.completedTasksCount}/{project.tasksCount} công việc
                    </span>
                  </div>
                </div>

                <div className="rounded-[1.5rem] bg-stone-50 px-4 py-4 text-right">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                    Tiến độ
                  </div>
                  <div className="mt-2 text-3xl font-black text-stone-950">
                    {Math.round(project.progress)}%
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-stone-200 pt-5">
                <Link
                  className={cn(buttonVariants({ variant: "secondary" }))}
                  href={`/projects/${project.id}` as Route}
                >
                  Xem dự án
                </Link>
                <Link
                  className={cn(buttonVariants({ variant: "secondary" }))}
                  href={`/projects/${project.id}/edit` as Route}
                >
                  Sửa dự án
                </Link>
                <DeleteProjectForm projectId={project.id} />
              </div>
            </article>
          ))}
        </section>
      ) : projects.length > 0 ? (
        <PageEmptyState
          description="Hãy xóa bớt bộ lọc hoặc đổi từ khóa để xem nhiều dự án hơn."
          title="Không tìm thấy dự án phù hợp"
        />
      ) : (
        <PageEmptyState
          action={
            <Link
              className={cn(buttonVariants({ size: "sm" }), "gap-2 rounded-full !text-white")}
              href="/projects/new"
            >
              <Plus className="h-4 w-4" />
              Tạo dự án mới
            </Link>
          }
          description="Tạo dự án để gom công việc theo một nhóm có ý nghĩa hơn."
          title="Chưa có dự án nào"
        />
      )}
    </div>
  );
}
