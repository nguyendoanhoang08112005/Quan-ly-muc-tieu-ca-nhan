import { Button } from "@/components/ui/button";
import { deleteProjectAction } from "@/features/projects/actions/delete-project";

export function DeleteProjectForm({ projectId }: { projectId: string }) {
  return (
    <form action={deleteProjectAction}>
      <input name="projectId" type="hidden" value={projectId} />
      <Button type="submit" variant="destructive">
        Xoa project
      </Button>
    </form>
  );
}
