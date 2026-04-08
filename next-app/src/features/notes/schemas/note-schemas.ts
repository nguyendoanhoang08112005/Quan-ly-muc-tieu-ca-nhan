import { z } from "zod";
import { noteableTypeValues } from "@/features/notes/types";

export const noteIdSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "Note id khong hop le.");

export const noteFormSchema = z.object({
  noteableType: z.enum(noteableTypeValues, {
    message: "Loai doi tuong ghi chu khong hop le."
  }),
  noteableId: z
    .string()
    .trim()
    .regex(/^\d+$/, "Doi tuong ghi chu khong hop le."),
  content: z
    .string()
    .trim()
    .min(3, "Noi dung ghi chu phai co it nhat 3 ky tu.")
    .max(20000, "Noi dung ghi chu qua dai.")
});

export type NoteFormInput = z.infer<typeof noteFormSchema>;
