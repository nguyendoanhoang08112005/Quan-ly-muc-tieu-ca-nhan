import { ConfirmSubmitButton } from "@/components/shared/confirm-submit-button";
import { deleteNoteAction } from "@/features/notes/actions/delete-note";

export function DeleteNoteForm({ noteId }: { noteId: string }) {
  return (
    <form action={deleteNoteAction}>
      <input name="noteId" type="hidden" value={noteId} />
      <ConfirmSubmitButton
        confirmMessage="Bạn có chắc muốn xóa ghi chú này không?"
        idleLabel="Xóa ghi chú"
        pendingLabel="Đang xóa ghi chú..."
        variant="destructive"
      />
    </form>
  );
}
