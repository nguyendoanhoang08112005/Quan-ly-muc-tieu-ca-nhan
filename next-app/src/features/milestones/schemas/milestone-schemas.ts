import { z } from "zod";
import { workStatusValues } from "@/features/goals/types";
import { parseDateInput } from "@/lib/dates";

const optionalDateField = z
  .string()
  .trim()
  .default("")
  .refine(
    (value) => value === "" || parseDateInput(value) !== null,
    "Ngày không hợp lệ."
  );

const optionalSequenceSchema = z.preprocess((value) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();

  return trimmed === "" ? undefined : Number(trimmed);
}, z.number().int().min(1, "Thu tu milestone phai lon hon 0.").optional());

export const milestoneIdSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "Mã cột mốc không hợp lệ.");

export const milestoneFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Ten milestone phai co it nhat 3 ky tu.")
      .max(180, "Tên cột mốc không được vượt quá 180 ký tự."),
    description: z.string().trim().default(""),
    status: z.enum(workStatusValues, {
      message: "Trạng thái cột mốc không hợp lệ."
    }),
    startDate: optionalDateField,
    targetDate: optionalDateField,
    note: z.string().trim().max(10000, "Ghi chú quá dài.").default(""),
    sequenceNo: optionalSequenceSchema
  })
  .superRefine((value, context) => {
    if (!value.startDate || !value.targetDate) {
      return;
    }

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

export type MilestoneFormInput = z.infer<typeof milestoneFormSchema>;
