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
import { noteFormSchema } from "@/features/notes/schemas/note-schemas";
import { createNoteForUser } from "@/server/modules/notes/mutations";

export async function createNoteAction(
  _previousState: NoteFormActionState,
  formData: FormData
): Promise<NoteFormActionState> {
  const userId = await requireAuthenticatedUserId();
  const values = readNoteFormValues(formData);
  const parsed = noteFormSchema.safeParse(values);

  if (!parsed.success) {
    return buildNoteFormErrorState(
      values,
      "Du lieu note chua hop le.",
      parsed.error.flatten().fieldErrors
    );
  }

  const noteId = await createNoteForUser(userId, parsed.data);

  if (!noteId) {
    return buildNoteFormErrorState(
      values,
      "Doi tuong duoc gan note khong hop le."
    );
  }

  revalidatePath("/notes");
  redirect(`/notes?created=${noteId}` as Route);
}
