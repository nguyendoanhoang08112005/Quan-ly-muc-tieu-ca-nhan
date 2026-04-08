import { Button } from "@/components/ui/button";
import { unfollowGoalAction } from "@/features/follows/actions/unfollow-goal";

export function UnfollowGoalForm({ goalId }: { goalId: string }) {
  return (
    <form action={unfollowGoalAction}>
      <input name="goalId" type="hidden" value={goalId} />
      <Button size="sm" type="submit" variant="secondary">
        Bỏ theo dõi
      </Button>
    </form>
  );
}
