import { Button } from "@/components/ui/button";
import { followGoalAction } from "@/features/follows/actions/follow-goal";

export function FollowGoalForm({ goalId }: { goalId: string }) {
  return (
    <form action={followGoalAction}>
      <input name="goalId" type="hidden" value={goalId} />
      <Button size="sm" type="submit">
        Follow goal
      </Button>
    </form>
  );
}
