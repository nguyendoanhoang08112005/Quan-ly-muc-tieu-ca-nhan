"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import { noteIdSchema } from "@/features/notes/schemas/note-schemas";
import { softDeleteNoteForUser } from "@/server/modules/notes/mutations";

export async function deleteNoteAction(formData: FormData) {
  const userId = await requireAuthenticatedUserId();
  const noteId = formData.get("noteId");
  const parsedNoteId = noteIdSchema.safeParse(noteId);

  if (!parsedNoteId.success) {
    redirect("/notes");
  }

  await softDeleteNoteForUser(userId, BigInt(parsedNoteId.data));

  revalidatePath("/notes");
  redirect("/notes");
}
