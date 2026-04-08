import { z } from "zod";
import { workStatusValues } from "@/features/goals/types";
import { parseDateInput } from "@/lib/dates";

const optionalDateField = z
  .string()
  .trim()
  .default("")
  .refine(
    (value) => value === "" || parseDateInput(value) !== null,
    "Ngay khong hop le."
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
  .regex(/^\d+$/, "Milestone id khong hop le.");

export const milestoneFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Ten milestone phai co it nhat 3 ky tu.")
      .max(180, "Ten milestone khong duoc vuot qua 180 ky tu."),
    description: z.string().trim().default(""),
    status: z.enum(workStatusValues, {
      message: "Trang thai milestone khong hop le."
    }),
    startDate: optionalDateField,
    targetDate: optionalDateField,
    note: z.string().trim().max(10000, "Ghi chu qua dai.").default(""),
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
        message: "Ngay muc tieu phai bang hoac sau ngay bat dau."
      });
    }
  });

export type MilestoneFormInput = z.infer<typeof milestoneFormSchema>;
