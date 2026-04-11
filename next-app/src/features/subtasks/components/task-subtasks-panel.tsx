import { Button } from "@/components/ui/button";
import type { SubtaskSummary } from "@/features/tasks/types";
import { createSubtaskAction } from "@/features/subtasks/actions/create-subtask";
import { deleteSubtaskAction } from "@/features/subtasks/actions/delete-subtask";
import { toggleSubtaskAction } from "@/features/subtasks/actions/toggle-subtask";

export function TaskSubtasksPanel({
  subtasks,
  taskId
}: {
  subtasks: SubtaskSummary[];
  taskId: string;
}) {
  const completedCount = subtasks.filter(
    (subtask) => subtask.status === "completed"
  ).length;

  return (
    <div className="rounded-[1.2rem] border border-stone-200/80 bg-stone-50/80 px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-stone-900">Việc con</p>
          <p className="text-xs text-stone-500">
            Tách nhỏ đầu việc để theo dõi sát hơn.
          </p>
        </div>
        <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-500 shadow-sm">
          {completedCount}/{subtasks.length}
        </div>
      </div>

      {subtasks.length > 0 ? (
        <div className="mt-4 overflow-hidden rounded-[1rem] border border-stone-200 bg-white">
          {subtasks.map((subtask) => (
            <div
              className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 px-4 py-3 last:border-b-0"
              key={subtask.id}
            >
              <div className="flex items-center gap-3">
                <form action={toggleSubtaskAction}>
                  <input name="taskId" type="hidden" value={taskId} />
                  <input name="subtaskId" type="hidden" value={subtask.id} />
                  <button
                    className="flex h-5 w-5 items-center justify-center rounded border border-stone-300 bg-white text-xs font-black text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
                    type="submit"
                  >
                    {subtask.status === "completed" ? "x" : ""}
                  </button>
                </form>
                <div>
                  <p
                    className={
                      subtask.status === "completed"
                        ? "text-sm font-medium text-stone-400 line-through"
                        : "text-sm font-medium text-stone-700"
                    }
                  >
                    {subtask.name}
                  </p>
                </div>
              </div>

              <form action={deleteSubtaskAction}>
                <input name="taskId" type="hidden" value={taskId} />
                <input name="subtaskId" type="hidden" value={subtask.id} />
                <Button
                  className="text-stone-500 hover:bg-rose-50 hover:text-rose-700"
                  size="sm"
                  type="submit"
                  variant="ghost"
                >
                  Xóa
                </Button>
              </form>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-[1rem] border border-dashed border-stone-300 bg-white px-4 py-4 text-sm text-stone-500">
          Chưa có việc con nào. Thêm một bước nhỏ để công việc này dễ hoàn thành hơn.
        </div>
      )}

      <form action={createSubtaskAction} className="mt-4 flex flex-wrap gap-3">
        <input name="taskId" type="hidden" value={taskId} />
        <input
          className="h-10 min-w-[220px] flex-1 rounded-[1rem] border border-stone-300 bg-white px-4 text-sm text-stone-950 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
          name="name"
          placeholder="Thêm việc con mới"
          type="text"
        />
        <Button size="sm" type="submit" variant="secondary">
          Thêm việc con
        </Button>
      </form>
    </div>
  );
}
