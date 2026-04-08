import { notFound } from "next/navigation";
import { NoteForm } from "@/features/notes/components/note-form";
import { noteIdSchema } from "@/features/notes/schemas/note-schemas";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import {
  getNoteFormValuesForUser,
  listNoteTargetOptionsForUser
} from "@/server/modules/notes/queries";

type EditNotePageProps = {
  params: Promise<{
    noteId: string;
  }>;
};

export default async function EditNotePage({ params }: EditNotePageProps) {
  const userId = await requireAuthenticatedUserId();
  const { noteId } = await params;
  const parsedNoteId = noteIdSchema.safeParse(noteId);

  if (!parsedNoteId.success) {
    notFound();
  }

  const [note, targetOptions] = await Promise.all([
    getNoteFormValuesForUser(userId, BigInt(parsedNoteId.data)),
    listNoteTargetOptionsForUser(userId)
  ]);

  if (!note) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
      <NoteForm
        cancelHref="/notes"
        initialValues={note}
        mode="edit"
        noteId={parsedNoteId.data}
        targetOptions={targetOptions}
      />
    </div>
  );
}
