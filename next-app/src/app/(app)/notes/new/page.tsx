import { PageFormShell } from "@/components/shared/app-page-patterns";
import { NoteForm } from "@/features/notes/components/note-form";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { listNoteTargetOptionsForUser } from "@/server/modules/notes/queries";

export default async function NewNotePage() {
  const userId = await requireAuthenticatedUserId();
  const targetOptions = await listNoteTargetOptionsForUser(userId);

  return (
    <PageFormShell
      backHref="/notes"
      backLabel="Quay lại ghi chú"
      description="Lưu nhanh ý tưởng hoặc ngữ cảnh cho đúng đối tượng đang làm việc."
      eyebrow="Tạo ghi chú"
      maxWidthClassName="max-w-4xl"
      title="Ghi chú mới"
    >
      <NoteForm cancelHref="/notes" mode="create" targetOptions={targetOptions} />
    </PageFormShell>
  );
}
