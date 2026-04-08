import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth-options";
import { authRoutes } from "@/lib/auth/routes";

export function getServerAuthSession() {
  return getServerSession(authOptions);
}

export type AppSession = Session;
export type AppSessionUser = NonNullable<AppSession["user"]>;

export async function requireAuthenticatedUser() {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    redirect(authRoutes.signIn);
  }

  return session.user;
}

export async function requireAuthenticatedUserId() {
  const user = await requireAuthenticatedUser();

  return BigInt(user.id);
}

export async function redirectAuthenticatedUser() {
  const session = await getServerAuthSession();

  if (session?.user?.id) {
    redirect(authRoutes.afterSignIn);
  }
}
