import { deleteMilestoneAction } from "@/features/milestones/actions/delete-milestone";
import { Button } from "@/components/ui/button";

export function DeleteMilestoneForm({
  goalId,
  milestoneId
}: {
  goalId: string;
  milestoneId: string;
}) {
  return (
    <form action={deleteMilestoneAction}>
      <input name="goalId" type="hidden" value={goalId} />
      <input name="milestoneId" type="hidden" value={milestoneId} />
      <Button type="submit" variant="destructive">
        Xoa milestone
      </Button>
    </form>
  );
}
