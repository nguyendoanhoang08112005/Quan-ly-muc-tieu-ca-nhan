import { Button } from "@/components/ui/button";
import { deleteNoteAction } from "@/features/notes/actions/delete-note";

export function DeleteNoteForm({ noteId }: { noteId: string }) {
  return (
    <form action={deleteNoteAction}>
      <input name="noteId" type="hidden" value={noteId} />
      <Button type="submit" variant="destructive">
        Xóa ghi chú
      </Button>
    </form>
  );
}
