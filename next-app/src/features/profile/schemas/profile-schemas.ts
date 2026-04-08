import { z } from "zod";

export const profileLocaleSchema = z.enum(["vi", "en"]);

export const profileFormSchema = z.object({
  avatarPath: z
    .string()
    .trim()
    .max(255, "Đường dẫn ảnh đại diện không được vượt quá 255 ký tự."),
  email: z
    .string()
    .trim()
    .min(1, "Email la bat buoc.")
    .max(190, "Email không được vượt quá 190 ký tự.")
    .email("Email không hợp lệ.")
    .transform((value) => value.toLowerCase()),
  locale: profileLocaleSchema,
  name: z
    .string()
    .trim()
    .min(2, "Ten phai co it nhat 2 ky tu.")
    .max(150, "Tên không được vượt quá 150 ký tự."),
  timezone: z
    .string()
    .trim()
    .min(1, "Timezone la bat buoc.")
    .max(64, "Múi giờ không được vượt quá 64 ký tự.")
});

export type ProfileFormInput = z.infer<typeof profileFormSchema>;
