import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email la bat buoc.")
  .max(190, "Email khong duoc vuot qua 190 ky tu.")
  .email("Email khong hop le.")
  .transform((value) => value.toLowerCase());

const passwordSchema = z
  .string()
  .min(8, "Mat khau phai co it nhat 8 ky tu.")
  .max(72, "Mat khau khong duoc vuot qua 72 ky tu.");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Mat khau la bat buoc.")
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Ten phai co it nhat 2 ky tu.")
      .max(150, "Ten khong duoc vuot qua 150 ky tu."),
    email: emailSchema,
    password: passwordSchema,
    passwordConfirmation: z.string().min(1, "Ban can xac nhan mat khau.")
  })
  .superRefine((value, context) => {
    if (value.password !== value.passwordConfirmation) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["passwordConfirmation"],
        message: "Mat khau xac nhan khong khop."
      });
    }
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
