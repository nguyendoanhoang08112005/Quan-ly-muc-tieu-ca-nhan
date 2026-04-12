import { notFound } from "next/navigation";
import { PageFormShell } from "@/components/shared/app-page-patterns";
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
    <PageFormShell
      backHref="/notes"
      backLabel="Quay lại ghi chú"
      description="Chỉnh nội dung hoặc đổi lại đối tượng gắn với ghi chú này."
      eyebrow="Sửa ghi chú"
      maxWidthClassName="max-w-4xl"
      title="Cập nhật ghi chú"
    >
      <NoteForm
        cancelHref="/notes"
        initialValues={note}
        mode="edit"
        noteId={parsedNoteId.data}
        targetOptions={targetOptions}
      />
    </PageFormShell>
  );
}
