import { z } from "zod";

export const tagIdSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "Tag id khong hop le.");

export const tagFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ten tag phai co it nhat 2 ky tu.")
    .max(60, "Ten tag khong duoc vuot qua 60 ky tu."),
  color: z
    .string()
    .trim()
    .max(20, "Mau qua dai.")
    .default("")
});

export type TagFormInput = z.infer<typeof tagFormSchema>;
