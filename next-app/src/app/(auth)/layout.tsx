import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirectAuthenticatedUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default async function AuthLayout({
  children
}: {
  children: ReactNode;
}) {
  await redirectAuthenticatedUser();

  return children;
}
