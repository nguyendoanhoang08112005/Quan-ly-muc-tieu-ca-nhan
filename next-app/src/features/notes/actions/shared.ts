import type { NoteFormValues } from "@/features/notes/types";
import { buildDefaultNoteFormValues } from "@/features/notes/note-helpers";

type NoteFormField = keyof NoteFormValues;

export type NoteFormActionState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<NoteFormField, string[]>>;
  values: NoteFormValues;
};

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export function getInitialNoteFormActionState(
  values?: Partial<NoteFormValues>
): NoteFormActionState {
  return {
    status: "idle",
    values: {
      ...buildDefaultNoteFormValues(),
      ...values
    }
  };
}

export function readNoteFormValues(formData: FormData): NoteFormValues {
  return {
    noteableType: readFormValue(formData, "noteableType") as NoteFormValues["noteableType"],
    noteableId: readFormValue(formData, "noteableId"),
    content: readFormValue(formData, "content")
  };
}

export function buildNoteFormErrorState(
  values: NoteFormValues,
  message: string,
  fieldErrors?: NoteFormActionState["fieldErrors"]
): NoteFormActionState {
  return {
    status: "error",
    message,
    fieldErrors,
    values
  };
}
