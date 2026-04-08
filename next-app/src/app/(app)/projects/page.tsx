import Link from "next/link";
import type { Route } from "next";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { DeleteProjectForm } from "@/features/projects/components/delete-project-form";
import {
  projectStatusClassNames,
  projectStatusLabels
} from "@/features/projects/project-helpers";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { formatDisplayDate } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { listProjectsForUser } from "@/server/modules/projects/queries";

export default async function ProjectsPage() {
  const userId = await requireAuthenticatedUserId();
  const projects = await listProjectsForUser(userId);
  const activeProjects = projects.filter((project) => project.status === "active");

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-950 md:text-5xl">
              Danh sách dự án
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600">
              Dự án giờ là mô-đun độc lập, nhưng vẫn gắn với mục tiêu và công
              việc để không bị trôi thành phần cũ không còn người quản lý.
            </p>
          </div>

          <Link
            className={cn(buttonVariants({ size: "lg" }), "gap-2 rounded-full")}
            href="/projects/new"
          >
            <Plus className="h-4 w-4" />
            Tạo dự án mới
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
              Tổng dự án
            </div>
            <div className="mt-2 text-4xl font-black text-stone-950">
              {projects.length}
            </div>
          </div>
          <div className="rounded-[1.5rem] bg-stone-950 px-5 py-5 text-white">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-300">
              Đang chạy
            </div>
            <div className="mt-2 text-4xl font-black">{activeProjects.length}</div>
          </div>
          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-5 py-5">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
              Có công việc
            </div>
            <div className="mt-2 text-4xl font-black text-stone-950">
              {projects.filter((project) => project.tasksCount > 0).length}
            </div>
          </div>
        </div>
      </section>

      {projects.length > 0 ? (
        <section className="grid gap-6">
          {projects.map((project) => (
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
      ) : (
        <section className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-12 text-center shadow-sm">
          <h2 className="text-2xl font-black text-stone-950">
            Chưa có dự án nào
          </h2>
          <p className="mt-3 text-sm leading-7 text-stone-500">
            Tạo dự án để gom công việc theo một nhóm có ý nghĩa hơn, thay vì để
            mô-đun cũ này tiếp tục bị bỏ dang dở.
          </p>
        </section>
      )}
    </div>
  );
}
