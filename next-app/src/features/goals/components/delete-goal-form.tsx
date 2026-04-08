import { deleteGoalAction } from "@/features/goals/actions/delete-goal";
import { Button } from "@/components/ui/button";

export function DeleteGoalForm({ goalId }: { goalId: string }) {
  return (
    <form action={deleteGoalAction}>
      <input name="goalId" type="hidden" value={goalId} />
      <Button type="submit" variant="secondary">
        Xóa mục tiêu
      </Button>
    </form>
  );
}
