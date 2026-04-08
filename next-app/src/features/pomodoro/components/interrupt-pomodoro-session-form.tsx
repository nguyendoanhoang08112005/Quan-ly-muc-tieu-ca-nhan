import { Button } from "@/components/ui/button";
import { interruptPomodoroSessionAction } from "@/features/pomodoro/actions/interrupt-pomodoro-session";

export function InterruptPomodoroSessionForm({
  sessionId
}: {
  sessionId: string;
}) {
  return (
    <form action={interruptPomodoroSessionAction}>
      <input name="sessionId" type="hidden" value={sessionId} />
      <Button type="submit" variant="secondary">
        Dừng phiên
      </Button>
    </form>
  );
}
