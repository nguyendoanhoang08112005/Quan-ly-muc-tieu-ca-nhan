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
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngay khong hop le.")
  .refine((value) => parseDateInput(value) !== null, "Ngay khong hop le.");

const optionalNumericId = z.preprocess((value) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();

  return trimmed === "" ? undefined : trimmed;
}, z.string().regex(/^\d+$/, "Gia tri khong hop le.").optional());

export const goalIdSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "Goal id khong hop le.");

export const goalFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Ten muc tieu phai co it nhat 3 ky tu.")
      .max(180, "Ten muc tieu khong duoc vuot qua 180 ky tu."),
    description: z
      .string()
      .trim()
      .min(10, "Mo ta phai co it nhat 10 ky tu."),
    goalType: z.enum(goalTypeValues, {
      message: "Loai muc tieu khong hop le."
    }),
    priority: z.enum(goalPriorityValues, {
      message: "Do uu tien khong hop le."
    }),
    status: z.enum(goalStatusValues, {
      message: "Trang thai khong hop le."
    }),
    startDate: dateField,
    targetDate: dateField,
    note: z.string().trim().max(10000, "Ghi chu qua dai.").default(""),
    categoryId: optionalNumericId,
    tagIds: z
      .array(z.string().regex(/^\d+$/, "Tag khong hop le."))
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
        message: "Ngay muc tieu phai bang hoac sau ngay bat dau."
      });
    }
  });

export type GoalFormInput = z.infer<typeof goalFormSchema>;
