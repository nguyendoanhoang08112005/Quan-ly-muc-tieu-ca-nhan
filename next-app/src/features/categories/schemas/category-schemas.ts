import { z } from "zod";
import { categoryTypeValues } from "@/features/categories/types";

export const categoryIdSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "Category id khong hop le.");

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ten category phai co it nhat 2 ky tu.")
    .max(100, "Ten category khong duoc vuot qua 100 ky tu."),
  color: z
    .string()
    .trim()
    .max(20, "Mau qua dai.")
    .default(""),
  icon: z
    .string()
    .trim()
    .max(50, "Icon qua dai.")
    .default(""),
  type: z.enum(categoryTypeValues, {
    message: "Loai category khong hop le."
  })
});

export type CategoryFormInput = z.infer<typeof categoryFormSchema>;
