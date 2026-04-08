import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { LoginForm } from "@/features/auth/components/login-form";
import { authRoutes } from "@/lib/auth/routes";

export const metadata: Metadata = {
  title: "Dang nhap",
  description: "Dang nhap vao he thong quan ly muc tieu ca nhan.",
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
      description="Dang nhap de truy cap dashboard va bat dau migrate tung module nghiep vu tren app moi."
      eyebrow="Authentication"
      footer={
        <p>
          Chua co tai khoan?{" "}
          <Link
            className="font-semibold text-stone-950 underline decoration-stone-300 underline-offset-4"
            href={authRoutes.register}
          >
            Tao tai khoan
          </Link>
        </p>
      }
      title="Dang nhap vao he thong moi"
    >
      <LoginForm
        callbackUrl={callbackUrl}
        defaultEmail={defaultEmail}
        showRegisteredMessage={showRegisteredMessage}
      />
    </AuthShell>
  );
}
