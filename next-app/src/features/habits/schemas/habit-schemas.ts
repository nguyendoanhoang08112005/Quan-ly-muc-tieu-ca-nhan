import { z } from "zod";
import {
  habitFrequencyValues,
  habitStatusValues
} from "@/features/habits/types";
import { parseDateInput, parseTimeInput } from "@/lib/dates";

const optionalNumericId = z.preprocess((value) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();

  return trimmed === "" ? undefined : trimmed;
}, z.string().regex(/^\d+$/, "Giá trị không hợp lệ.").optional());

const dateField = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày không hợp lệ.")
  .refine((value) => parseDateInput(value) !== null, "Ngày không hợp lệ.");

const optionalDateField = z
  .string()
  .trim()
  .default("")
  .refine(
    (value) => value === "" || parseDateInput(value) !== null,
    "Ngày không hợp lệ."
  );

const optionalTimeField = z
  .string()
  .trim()
  .default("")
  .refine(
    (value) => value === "" || parseTimeInput(value) !== null,
    "Giờ nhắc không hợp lệ."
  );

const requiredPositiveNumber = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();

  return trimmed === "" ? undefined : Number(trimmed);
}, z.number().int().min(1, "Gia tri phai lon hon 0."));

const nonNegativeNumber = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();

  return trimmed === "" ? undefined : Number(trimmed);
}, z.number().int().min(0, "Giá trị không được âm."));

export const habitIdSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "Mã thói quen không hợp lệ.");

export const habitFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Tên thói quen phải có ít nhất 3 ký tự.")
      .max(180, "Tên thói quen không được vượt quá 180 ký tự."),
    description: z.string().trim().default(""),
    goalId: optionalNumericId,
    frequency: z.enum(habitFrequencyValues, {
      message: "Tần suất thói quen không hợp lệ."
    }),
    targetCount: requiredPositiveNumber,
    unit: z
      .string()
      .trim()
      .min(1, "Đơn vị không được để trống.")
      .max(50, "Đơn vị không được vượt quá 50 ký tự."),
    reminderTime: optionalTimeField,
    status: z.enum(habitStatusValues, {
      message: "Trạng thái thói quen không hợp lệ."
    }),
    startDate: dateField,
    endDate: optionalDateField
  })
  .superRefine((value, context) => {
    if (!value.endDate) {
      return;
    }

    const startDate = parseDateInput(value.startDate);
    const endDate = parseDateInput(value.endDate);

    if (startDate && endDate && endDate.getTime() < startDate.getTime()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "Ngày kết thúc phải bằng hoặc sau ngày bắt đầu."
      });
    }
  });

export const habitLogFormSchema = z.object({
  logDate: dateField,
  completedCount: nonNegativeNumber,
  note: z.string().trim().max(10000, "Ghi chú quá dài.").default("")
});

export type HabitFormInput = z.infer<typeof habitFormSchema>;
export type HabitLogFormInput = z.infer<typeof habitLogFormSchema>;
