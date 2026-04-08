import { NoteForm } from "@/features/notes/components/note-form";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { listNoteTargetOptionsForUser } from "@/server/modules/notes/queries";

export default async function NewNotePage() {
  const userId = await requireAuthenticatedUserId();
  const targetOptions = await listNoteTargetOptionsForUser(userId);

  return (
    <div className="mx-auto max-w-4xl rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
      <NoteForm cancelHref="/notes" mode="create" targetOptions={targetOptions} />
    </div>
  );
}
