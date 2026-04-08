import Link from "next/link";
import { Target } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyGoalsState() {
  return (
    <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-16 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
        <Target className="h-8 w-8 text-stone-500" />
      </div>
      <h2 className="mt-6 text-3xl font-black tracking-tight text-stone-950">
        Bạn chưa có mục tiêu nào
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-stone-600">
        Hãy tạo mục tiêu đầu tiên để khởi động hệ Next.js mới.
      </p>
      <div className="mt-8">
        <Link
          className={cn(
            buttonVariants({ size: "lg" }),
            "rounded-full !text-white"
          )}
          href="/goals/new"
        >
          Tạo mục tiêu đầu tiên
        </Link>
      </div>
    </div>
  );
}
