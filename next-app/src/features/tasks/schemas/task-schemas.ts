import { z } from "zod";
import { goalPriorityValues, workStatusValues } from "@/features/goals/types";
import { parseDateTimeLocalInput } from "@/lib/dates";

const optionalNumericId = z.preprocess((value) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();

  return trimmed === "" ? undefined : trimmed;
}, z.string().regex(/^\d+$/, "Giá trị không hợp lệ.").optional());

const optionalDateTimeField = z
  .string()
  .trim()
  .default("")
  .refine(
    (value) => value === "" || parseDateTimeLocalInput(value) !== null,
    "Hạn công việc không hợp lệ."
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
  .regex(/^\d+$/, "Mã công việc không hợp lệ.");

export const taskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Tên công việc phải có ít nhất 3 ký tự.")
    .max(180, "Tên công việc không được vượt quá 180 ký tự."),
  description: z.string().trim().default(""),
  status: z.enum(workStatusValues, {
    message: "Trạng thái công việc không hợp lệ."
  }),
  priority: z.enum(goalPriorityValues, {
    message: "Độ ưu tiên công việc không hợp lệ."
  }),
  dueAt: optionalDateTimeField,
  estimatedMinutes: optionalEstimatedMinutes,
  projectId: optionalNumericId,
  isFocus: z.boolean()
});

export type TaskFormInput = z.infer<typeof taskFormSchema>;
