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
}, z.string().regex(/^\d+$/, "Gia tri khong hop le.").optional());

const dateField = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngay khong hop le.")
  .refine((value) => parseDateInput(value) !== null, "Ngay khong hop le.");

const optionalDateField = z
  .string()
  .trim()
  .default("")
  .refine(
    (value) => value === "" || parseDateInput(value) !== null,
    "Ngay khong hop le."
  );

const optionalTimeField = z
  .string()
  .trim()
  .default("")
  .refine(
    (value) => value === "" || parseTimeInput(value) !== null,
    "Gio nhac khong hop le."
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
}, z.number().int().min(0, "Gia tri khong duoc am."));

export const habitIdSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "Habit id khong hop le.");

export const habitFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Ten habit phai co it nhat 3 ky tu.")
      .max(180, "Ten habit khong duoc vuot qua 180 ky tu."),
    description: z.string().trim().default(""),
    goalId: optionalNumericId,
    frequency: z.enum(habitFrequencyValues, {
      message: "Tan suat habit khong hop le."
    }),
    targetCount: requiredPositiveNumber,
    unit: z
      .string()
      .trim()
      .min(1, "Don vi khong duoc de trong.")
      .max(50, "Don vi khong duoc vuot qua 50 ky tu."),
    reminderTime: optionalTimeField,
    status: z.enum(habitStatusValues, {
      message: "Trang thai habit khong hop le."
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
        message: "Ngay ket thuc phai bang hoac sau ngay bat dau."
      });
    }
  });

export const habitLogFormSchema = z.object({
  logDate: dateField,
  completedCount: nonNegativeNumber,
  note: z.string().trim().max(10000, "Ghi chu qua dai.").default("")
});

export type HabitFormInput = z.infer<typeof habitFormSchema>;
export type HabitLogFormInput = z.infer<typeof habitLogFormSchema>;
