import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { RegisterForm } from "@/features/auth/components/register-form";
import { authRoutes } from "@/lib/auth/routes";

export const metadata: Metadata = {
  title: "Đăng ký",
  description: "Tạo tài khoản để bắt đầu quản lý mục tiêu, công việc và thói quen theo nhịp mới.",
  robots: {
    index: false,
    follow: false
  }
};

export default async function RegisterPage() {
  return (
    <AuthShell
      description="Tạo tài khoản để bắt đầu mục tiêu, sắp việc trong ngày và giữ nhịp gọn hơn."
      eyebrow="Đăng ký"
      footer={
        <p>
          Đã có tài khoản?{" "}
          <Link
            className="font-semibold text-[#1f1c1a] underline decoration-[#d8d0c8] underline-offset-4"
            href={authRoutes.signIn}
          >
            Đăng nhập
          </Link>
        </p>
      }
      mode="register"
      title="Tạo tài khoản để bắt đầu"
    >
      <RegisterForm />
    </AuthShell>
  );
}
