import { Button } from "@/components/ui/button";
import { followGoalAction } from "@/features/follows/actions/follow-goal";

export function FollowGoalForm({ goalId }: { goalId: string }) {
  return (
    <form action={followGoalAction}>
      <input name="goalId" type="hidden" value={goalId} />
      <Button className="!text-white" size="sm" type="submit">
        Theo dõi mục tiêu
      </Button>
    </form>
  );
}
