import { Button } from "@/components/ui/button";
import { completePomodoroSessionAction } from "@/features/pomodoro/actions/complete-pomodoro-session";

const textareaClassName =
  "min-h-28 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10";

export function CompletePomodoroSessionForm({
  sessionId
}: {
  sessionId: string;
}) {
  return (
    <form action={completePomodoroSessionAction} className="space-y-4">
      <input name="sessionId" type="hidden" value={sessionId} />
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-stone-700">
          Ghi chú phiên
        </span>
        <textarea className={textareaClassName} name="notes" />
      </label>
      <Button type="submit">Hoàn thành phiên</Button>
    </form>
  );
}
