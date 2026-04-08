import { z } from "zod";
import { projectStatusValues } from "@/features/projects/types";
import { parseDateInput } from "@/lib/dates";

const optionalNumericId = z.preprocess((value) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();

  return trimmed === "" ? undefined : trimmed;
}, z.string().regex(/^\d+$/, "Gia tri khong hop le.").optional());

const optionalDateField = z
  .string()
  .trim()
  .default("")
  .refine(
    (value) => value === "" || parseDateInput(value) !== null,
    "Ngay khong hop le."
  );

export const projectIdSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "Project id khong hop le.");

export const projectFormSchema = z
  .object({
    goalId: optionalNumericId,
    name: z
      .string()
      .trim()
      .min(3, "Ten project phai co it nhat 3 ky tu.")
      .max(180, "Ten project khong duoc vuot qua 180 ky tu."),
    description: z.string().trim().default(""),
    status: z.enum(projectStatusValues, {
      message: "Trang thai project khong hop le."
    }),
    color: z.string().trim().max(20, "Mau project qua dai.").default(""),
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
        message: "Ngay ket thuc phai bang hoac sau ngay bat dau."
      });
    }
  });

export type ProjectFormInput = z.infer<typeof projectFormSchema>;
