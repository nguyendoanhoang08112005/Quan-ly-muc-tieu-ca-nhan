import { z } from "zod";

export const tagIdSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "Mã thẻ không hợp lệ.");

export const tagFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tên thẻ phải có ít nhất 2 ký tự.")
    .max(60, "Tên thẻ không được vượt quá 60 ký tự."),
  color: z
    .string()
    .trim()
    .max(20, "Mau qua dai.")
    .default("")
});

export type TagFormInput = z.infer<typeof tagFormSchema>;
