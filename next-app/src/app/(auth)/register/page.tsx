import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { RegisterForm } from "@/features/auth/components/register-form";
import { authRoutes } from "@/lib/auth/routes";
import { getServerAuthSession } from "@/lib/auth/session";

export default async function RegisterPage() {
  const session = await getServerAuthSession();

  if (session?.user?.id) {
    redirect(authRoutes.afterSignIn);
  }

  return (
    <AuthShell
      description="Tai khoan moi se duoc luu bang Prisma va hash mat khau bang bcrypt-compatible flow de san sang cho migration du lieu cu."
      eyebrow="Registration"
      footer={
        <p>
          Da co tai khoan?{" "}
          <Link
            className="font-semibold text-stone-950 underline decoration-stone-300 underline-offset-4"
            href={authRoutes.signIn}
          >
            Dang nhap
          </Link>
        </p>
      }
      title="Tao tai khoan moi"
    >
      <RegisterForm />
    </AuthShell>
  );
}
