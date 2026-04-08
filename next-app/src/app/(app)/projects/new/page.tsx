import { ProjectForm } from "@/features/projects/components/project-form";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { listProjectGoalOptionsForUser } from "@/server/modules/projects/queries";

export default async function NewProjectPage() {
  const userId = await requireAuthenticatedUserId();
  const goalOptions = await listProjectGoalOptionsForUser(userId);

  return (
    <div className="mx-auto max-w-5xl rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
      <ProjectForm cancelHref="/projects" goalOptions={goalOptions} mode="create" />
    </div>
  );
}
