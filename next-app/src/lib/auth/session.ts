import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";

export function getServerAuthSession() {
  return getServerSession(authOptions);
}

export type AppSession = Session;
export type AppSessionUser = NonNullable<AppSession["user"]>;
