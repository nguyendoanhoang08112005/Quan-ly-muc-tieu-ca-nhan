"use client";

import { useSyncExternalStore, type ReactNode } from "react";

export function HydrationSafeContent({
  children
}: {
  children: ReactNode;
}) {
  const mounted = useSyncExternalStore(
    () => {
      return () => {};
    },
    () => true,
    () => false
  );

  return (
    <div className="contents" suppressHydrationWarning>
      {mounted ? children : null}
    </div>
  );
}
