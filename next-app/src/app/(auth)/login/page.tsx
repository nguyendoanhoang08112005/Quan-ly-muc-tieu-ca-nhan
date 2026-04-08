import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { LoginForm } from "@/features/auth/components/login-form";
import { authRoutes } from "@/lib/auth/routes";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập vào hệ thống quản lý mục tiêu cá nhân.",
  robots: {
    index: false,
    follow: false
  }
};

type LoginPageProps = {
  searchParams?: Promise<{
    callbackUrl?: string | string[];
    email?: string | string[];
    registered?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  const callbackUrl =
    typeof resolvedSearchParams?.callbackUrl === "string"
      ? resolvedSearchParams.callbackUrl
      : undefined;
  const defaultEmail =
    typeof resolvedSearchParams?.email === "string"
      ? resolvedSearchParams.email
      : "";
  const showRegisteredMessage = resolvedSearchParams?.registered === "1";

  return (
    <AuthShell
      description="Đăng nhập để truy cập dashboard và bắt đầu migrate từng module nghiệp vụ trên app mới."
      eyebrow="Authentication"
      footer={
        <p>
          Chưa có tài khoản?{" "}
          <Link
            className="font-semibold text-stone-950 underline decoration-stone-300 underline-offset-4"
            href={authRoutes.register}
          >
            Tạo tài khoản
          </Link>
        </p>
      }
      title="Đăng nhập vào hệ thống mới"
    >
      <LoginForm
        callbackUrl={callbackUrl}
        defaultEmail={defaultEmail}
        showRegisteredMessage={showRegisteredMessage}
      />
    </AuthShell>
  );
}
