import { z } from "zod";
import { noteableTypeValues } from "@/features/notes/types";

export const noteIdSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "Mã ghi chú không hợp lệ.");

export const noteFormSchema = z.object({
  noteableType: z.enum(noteableTypeValues, {
    message: "Loại đối tượng ghi chú không hợp lệ."
  }),
  noteableId: z
    .string()
    .trim()
    .regex(/^\d+$/, "Đối tượng ghi chú không hợp lệ."),
  content: z
    .string()
    .trim()
    .min(3, "Nội dung ghi chú phải có ít nhất 3 ký tự.")
    .max(20000, "Nội dung ghi chú quá dài.")
});

export type NoteFormInput = z.infer<typeof noteFormSchema>;
