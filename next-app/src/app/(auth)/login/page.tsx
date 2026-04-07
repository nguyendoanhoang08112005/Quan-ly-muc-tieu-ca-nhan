import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { LoginForm } from "@/features/auth/components/login-form";
import { authRoutes } from "@/lib/auth/routes";
import { getServerAuthSession } from "@/lib/auth/session";

type LoginPageProps = {
  searchParams?: Promise<{
    callbackUrl?: string | string[];
    email?: string | string[];
    registered?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getServerAuthSession();

  if (session?.user?.id) {
    redirect(authRoutes.afterSignIn);
  }

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
