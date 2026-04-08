"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { authRoutes } from "@/lib/auth/routes";
import { cn } from "@/lib/utils";

export function SignOutButton({
  className,
  size = "default",
  variant = "secondary"
}: Pick<ButtonProps, "className" | "size" | "variant">) {
  const [isPending, setIsPending] = useState(false);

  async function handleSignOut() {
    setIsPending(true);
    await signOut({
      callbackUrl: authRoutes.afterSignOut
    });
  }

  return (
    <Button
      className={cn("w-full", className)}
      disabled={isPending}
      onClick={handleSignOut}
      size={size}
      variant={variant}
    >
      {isPending ? "Đang đăng xuất..." : "Đăng xuất"}
    </Button>
  );
}
