import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email là bắt buộc.")
  .max(190, "Email không được vượt quá 190 ký tự.")
  .email("Email không hợp lệ.")
  .transform((value) => value.toLowerCase());

const passwordSchema = z
  .string()
  .min(8, "Mật khẩu phải có ít nhất 8 ký tự.")
  .max(72, "Mật khẩu không được vượt quá 72 ký tự.");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Mật khẩu là bắt buộc.")
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Tên phải có ít nhất 2 ký tự.")
      .max(150, "Tên không được vượt quá 150 ký tự."),
    email: emailSchema,
    password: passwordSchema,
    passwordConfirmation: z.string().min(1, "Bạn cần xác nhận mật khẩu.")
  })
  .superRefine((value, context) => {
    if (value.password !== value.passwordConfirmation) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["passwordConfirmation"],
        message: "Mật khẩu xác nhận không khớp."
      });
    }
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
