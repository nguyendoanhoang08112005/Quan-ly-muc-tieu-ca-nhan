import { z } from "zod";

export const subtaskIdSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "Subtask id khong hop le.");

export const subtaskFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ten subtask phai co it nhat 2 ky tu.")
    .max(180, "Ten subtask khong duoc vuot qua 180 ky tu.")
});

export type SubtaskFormInput = z.infer<typeof subtaskFormSchema>;
