import { z } from "zod";

export const subtaskIdSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "Mã công việc con không hợp lệ.");

export const subtaskFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tên công việc con phải có ít nhất 2 ký tự.")
    .max(180, "Tên công việc con không được vượt quá 180 ký tự.")
});

export type SubtaskFormInput = z.infer<typeof subtaskFormSchema>;
