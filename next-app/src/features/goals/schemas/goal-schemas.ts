import { z } from "zod";
import {
  goalPriorityValues,
  goalStatusValues,
  goalTypeValues
} from "@/features/goals/types";
import { parseDateInput } from "@/lib/dates";

const dateField = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày không hợp lệ.")
  .refine((value) => parseDateInput(value) !== null, "Ngày không hợp lệ.");

const optionalNumericId = z.preprocess((value) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();

  return trimmed === "" ? undefined : trimmed;
}, z.string().regex(/^\d+$/, "Giá trị không hợp lệ.").optional());

export const goalIdSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "Mã mục tiêu không hợp lệ.");

export const goalFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Tên mục tiêu phải có ít nhất 3 ký tự.")
      .max(180, "Tên mục tiêu không được vượt quá 180 ký tự."),
    description: z
      .string()
      .trim()
      .max(4000, "Mô tả quá dài.")
      .refine(
        (value) => value === "" || value.length >= 10,
        "Nếu nhập mô tả, cần có ít nhất 10 ký tự."
      ),
    goalType: z.enum(goalTypeValues, {
      message: "Loại mục tiêu không hợp lệ."
    }),
    priority: z.enum(goalPriorityValues, {
      message: "Độ ưu tiên không hợp lệ."
    }),
    status: z.enum(goalStatusValues, {
      message: "Trạng thái không hợp lệ."
    }),
    startDate: dateField,
    targetDate: dateField,
    note: z.string().trim().max(10000, "Ghi chú quá dài.").default(""),
    isPublic: z.boolean().default(false),
    categoryId: optionalNumericId,
    tagIds: z
      .array(z.string().regex(/^\d+$/, "Thẻ không hợp lệ."))
      .default([])
  })
  .superRefine((value, context) => {
    const startDate = parseDateInput(value.startDate);
    const targetDate = parseDateInput(value.targetDate);

    if (
      startDate &&
      targetDate &&
      targetDate.getTime() < startDate.getTime()
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["targetDate"],
        message: "Ngày mục tiêu phải bằng hoặc sau ngày bắt đầu."
      });
    }
  });

export type GoalFormInput = z.infer<typeof goalFormSchema>;
