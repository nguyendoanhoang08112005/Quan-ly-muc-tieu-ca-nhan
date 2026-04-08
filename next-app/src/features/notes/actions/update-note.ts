"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAuthenticatedUserId } from "@/lib/auth/session";
import {
  buildNoteFormErrorState,
  type NoteFormActionState,
  readNoteFormValues
} from "@/features/notes/actions/shared";
import { noteFormSchema, noteIdSchema } from "@/features/notes/schemas/note-schemas";
import { updateNoteForUser } from "@/server/modules/notes/mutations";

export async function updateNoteAction(
  _previousState: NoteFormActionState,
  formData: FormData
): Promise<NoteFormActionState> {
  const userId = await requireAuthenticatedUserId();
  const noteId = formData.get("noteId");
  const parsedNoteId = noteIdSchema.safeParse(noteId);
  const values = readNoteFormValues(formData);
  const parsed = noteFormSchema.safeParse(values);

  if (!parsedNoteId.success) {
    return buildNoteFormErrorState(values, "Note khong hop le.");
  }

  if (!parsed.success) {
    return buildNoteFormErrorState(
      values,
      "Du lieu note chua hop le.",
      parsed.error.flatten().fieldErrors
    );
  }

  const updatedNoteId = await updateNoteForUser(
    userId,
    BigInt(parsedNoteId.data),
    parsed.data
  );

  if (!updatedNoteId) {
    return buildNoteFormErrorState(
      values,
      "Không tìm thấy note hoặc đối tượng được gắn note không hợp lệ."
    );
  }

  revalidatePath("/notes");
  redirect(`/notes?updated=${updatedNoteId}` as Route);
}
