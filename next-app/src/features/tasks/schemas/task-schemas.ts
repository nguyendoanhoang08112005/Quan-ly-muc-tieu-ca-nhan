import { z } from "zod";
import { goalPriorityValues, workStatusValues } from "@/features/goals/types";
import { parseDateTimeLocalInput } from "@/lib/dates";

const optionalDateTimeField = z
  .string()
  .trim()
  .default("")
  .refine(
    (value) => value === "" || parseDateTimeLocalInput(value) !== null,
    "Han task khong hop le."
  );

const optionalEstimatedMinutes = z.preprocess((value) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();

  return trimmed === "" ? undefined : Number(trimmed);
}, z.number().int().min(1, "So phut du kien phai lon hon 0.").optional());

export const taskIdSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "Task id khong hop le.");

export const taskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Ten task phai co it nhat 3 ky tu.")
    .max(180, "Ten task khong duoc vuot qua 180 ky tu."),
  description: z.string().trim().default(""),
  status: z.enum(workStatusValues, {
    message: "Trang thai task khong hop le."
  }),
  priority: z.enum(goalPriorityValues, {
    message: "Do uu tien task khong hop le."
  }),
  dueAt: optionalDateTimeField,
  estimatedMinutes: optionalEstimatedMinutes,
  isFocus: z.boolean()
});

export type TaskFormInput = z.infer<typeof taskFormSchema>;
