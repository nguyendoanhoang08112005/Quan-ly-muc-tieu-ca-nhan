import { Button } from "@/components/ui/button";
import { deleteHabitAction } from "@/features/habits/actions/delete-habit";

export function DeleteHabitForm({ habitId }: { habitId: string }) {
  return (
    <form action={deleteHabitAction}>
      <input name="habitId" type="hidden" value={habitId} />
      <Button type="submit" variant="destructive">
        Xoa habit
      </Button>
    </form>
  );
}
