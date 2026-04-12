import type { Route } from "next";
import { notFound } from "next/navigation";
import { PageFormShell } from "@/components/shared/app-page-patterns";
import { ProjectForm } from "@/features/projects/components/project-form";
import { projectIdSchema } from "@/features/projects/schemas/project-schemas";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import {
  getProjectFormValuesForUser,
  listProjectGoalOptionsForUser
} from "@/server/modules/projects/queries";

type EditProjectPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const userId = await requireAuthenticatedUserId();
  const { projectId } = await params;
  const parsedProjectId = projectIdSchema.safeParse(projectId);

  if (!parsedProjectId.success) {
    notFound();
  }

  const [project, goalOptions] = await Promise.all([
    getProjectFormValuesForUser(userId, BigInt(parsedProjectId.data)),
    listProjectGoalOptionsForUser(userId)
  ]);

  if (!project) {
    notFound();
  }

  return (
    <PageFormShell
      backHref={`/projects/${parsedProjectId.data}`}
      backLabel="Quay lại dự án"
      description="Cập nhật thông tin triển khai, mục tiêu liên kết và tiến độ dự án."
      eyebrow="Sửa dự án"
      title="Cập nhật dự án"
    >
      <ProjectForm
        cancelHref={`/projects/${parsedProjectId.data}` as Route}
        goalOptions={goalOptions}
        initialValues={project}
        mode="edit"
        projectId={parsedProjectId.data}
      />
    </PageFormShell>
  );
}
