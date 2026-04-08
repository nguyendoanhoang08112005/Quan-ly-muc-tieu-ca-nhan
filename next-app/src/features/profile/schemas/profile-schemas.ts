import { z } from "zod";

export const profileLocaleSchema = z.enum(["vi", "en"]);

export const profileFormSchema = z.object({
  avatarPath: z
    .string()
    .trim()
    .max(255, "Avatar path khong duoc vuot qua 255 ky tu."),
  email: z
    .string()
    .trim()
    .min(1, "Email la bat buoc.")
    .max(190, "Email khong duoc vuot qua 190 ky tu.")
    .email("Email khong hop le.")
    .transform((value) => value.toLowerCase()),
  locale: profileLocaleSchema,
  name: z
    .string()
    .trim()
    .min(2, "Ten phai co it nhat 2 ky tu.")
    .max(150, "Ten khong duoc vuot qua 150 ky tu."),
  timezone: z
    .string()
    .trim()
    .min(1, "Timezone la bat buoc.")
    .max(64, "Timezone khong duoc vuot qua 64 ky tu.")
});

export type ProfileFormInput = z.infer<typeof profileFormSchema>;
