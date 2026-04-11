import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { LoginForm } from "@/features/auth/components/login-form";
import { authRoutes } from "@/lib/auth/routes";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập để quay lại bảng điều khiển, mục tiêu và nhịp làm việc của bạn.",
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
      description="Quay lại dashboard, board công việc và các mục tiêu bạn đang theo. Không cần bắt đầu lại từ đầu."
      eyebrow="Mèo đang chờ bạn"
      footer={
        <p>
          Chưa có tài khoản?{" "}
          <Link
            className="font-semibold text-[#b05d42] underline decoration-[#efc8b9] underline-offset-4"
            href={authRoutes.register}
          >
            Tạo tài khoản
          </Link>
        </p>
      }
      mode="login"
      title="Đăng nhập để tiếp tục"
    >
      <LoginForm
        callbackUrl={callbackUrl}
        defaultEmail={defaultEmail}
        showRegisteredMessage={showRegisteredMessage}
      />
    </AuthShell>
  );
}
