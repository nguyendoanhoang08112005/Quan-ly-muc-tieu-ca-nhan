import { PageFormShell } from "@/components/shared/app-page-patterns";
import { ProjectForm } from "@/features/projects/components/project-form";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { listProjectGoalOptionsForUser } from "@/server/modules/projects/queries";

export default async function NewProjectPage() {
  const userId = await requireAuthenticatedUserId();
  const goalOptions = await listProjectGoalOptionsForUser(userId);

  return (
    <PageFormShell
      backHref="/projects"
      backLabel="Quay lại dự án"
      description="Tạo dự án mới để gom các công việc liên quan vào một nhịp triển khai rõ hơn."
      eyebrow="Tạo dự án"
      title="Dự án mới"
    >
      <ProjectForm cancelHref="/projects" goalOptions={goalOptions} mode="create" />
    </PageFormShell>
  );
}
