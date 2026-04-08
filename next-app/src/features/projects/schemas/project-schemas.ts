import { z } from "zod";
import { projectStatusValues } from "@/features/projects/types";
import { parseDateInput } from "@/lib/dates";

const optionalNumericId = z.preprocess((value) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();

  return trimmed === "" ? undefined : trimmed;
}, z.string().regex(/^\d+$/, "Giá trị không hợp lệ.").optional());

const optionalDateField = z
  .string()
  .trim()
  .default("")
  .refine(
    (value) => value === "" || parseDateInput(value) !== null,
    "Ngày không hợp lệ."
  );

export const projectIdSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "Mã dự án không hợp lệ.");

export const projectFormSchema = z
  .object({
    goalId: optionalNumericId,
    name: z
      .string()
      .trim()
      .min(3, "Tên dự án phải có ít nhất 3 ký tự.")
      .max(180, "Tên dự án không được vượt quá 180 ký tự."),
    description: z.string().trim().default(""),
    status: z.enum(projectStatusValues, {
      message: "Trạng thái dự án không hợp lệ."
    }),
    color: z.string().trim().max(20, "Màu dự án quá dài.").default(""),
    startDate: optionalDateField,
    endDate: optionalDateField
  })
  .superRefine((value, context) => {
    if (!value.startDate || !value.endDate) {
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

export type ProjectFormInput = z.infer<typeof projectFormSchema>;
