"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { authRoutes } from "@/lib/auth/routes";

export function SignOutButton() {
  const [isPending, setIsPending] = useState(false);

  async function handleSignOut() {
    setIsPending(true);
    await signOut({
      callbackUrl: authRoutes.afterSignOut
    });
  }

  return (
    <Button
      className="w-full"
      disabled={isPending}
      onClick={handleSignOut}
      variant="secondary"
    >
      {isPending ? "Đang đăng xuất..." : "Đăng xuất"}
    </Button>
  );
}
