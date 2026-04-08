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
  return (
    <div className="mt-5 rounded-[1.5rem] border border-stone-200 bg-white px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-black text-stone-950">Danh sách công việc con</p>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
          {subtasks.filter((subtask) => subtask.status === "completed").length}/
          {subtasks.length}
        </p>
      </div>

      {subtasks.length > 0 ? (
        <div className="mt-4 space-y-3">
          {subtasks.map((subtask) => (
            <div
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3"
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
                <Button size="sm" type="submit" variant="ghost">
                  Xóa
                </Button>
              </form>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-4 py-4 text-sm text-stone-500">
          Chưa có công việc con nào cho công việc này.
        </div>
      )}

      <form action={createSubtaskAction} className="mt-4 flex flex-wrap gap-3">
        <input name="taskId" type="hidden" value={taskId} />
        <input
          className="h-10 min-w-[220px] flex-1 rounded-2xl border border-stone-300 bg-white px-4 text-sm text-stone-950 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
          name="name"
          placeholder="Thêm công việc con mới"
          type="text"
        />
        <Button size="sm" type="submit">
          Thêm công việc con
        </Button>
      </form>
    </div>
  );
}
