import { z } from "zod";
import { categoryTypeValues } from "@/features/categories/types";

export const categoryIdSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "Mã danh mục không hợp lệ.");

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tên danh mục phải có ít nhất 2 ký tự.")
    .max(100, "Tên danh mục không được vượt quá 100 ký tự."),
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
    message: "Loại danh mục không hợp lệ."
  })
});

export type CategoryFormInput = z.infer<typeof categoryFormSchema>;
