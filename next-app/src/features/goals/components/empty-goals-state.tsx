import type { Route } from "next";
import Link from "next/link";
import { Target } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyGoalsState({
  createHref = "/goals?create=1"
}: {
  createHref?: Route;
}) {
  return (
    <div className="ui-panel border-dashed px-6 py-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-stone-100">
        <Target className="h-6 w-6 text-stone-500" />
      </div>
      <h2 className="mt-4 text-2xl font-black tracking-tight text-stone-950">
        Bạn chưa có mục tiêu nào
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-stone-600">
        Hãy tạo mục tiêu đầu tiên để khởi động hệ Next.js mới.
      </p>
      <div className="mt-5">
        <Link
          className={cn(
            buttonVariants({ size: "sm" }),
            "rounded-full !text-white"
          )}
          href={createHref}
        >
          Tạo mục tiêu đầu tiên
        </Link>
      </div>
    </div>
  );
}
