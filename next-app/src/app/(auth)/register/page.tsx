import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { RegisterForm } from "@/features/auth/components/register-form";
import { authRoutes } from "@/lib/auth/routes";

export const metadata: Metadata = {
  title: "Đăng ký",
  description: "Tạo tài khoản mới trên hệ thống quản lý mục tiêu cá nhân.",
  robots: {
    index: false,
    follow: false
  }
};

export default async function RegisterPage() {
  return (
    <AuthShell
      description="Tài khoản mới sẽ được lưu bằng Prisma và băm mật khẩu tương thích bcrypt để sẵn sàng cho dữ liệu cũ."
      eyebrow="Đăng ký"
      footer={
        <p>
          Đã có tài khoản?{" "}
          <Link
            className="font-semibold text-stone-950 underline decoration-stone-300 underline-offset-4"
            href={authRoutes.signIn}
          >
            Đăng nhập
          </Link>
        </p>
      }
      title="Tạo tài khoản mới"
    >
      <RegisterForm />
    </AuthShell>
  );
}
