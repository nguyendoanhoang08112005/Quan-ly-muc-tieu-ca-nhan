"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppGroupError({ error, reset }: ErrorProps) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="rounded-[2rem] border border-rose-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-rose-600">
          App error
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-stone-950">
          Khu vuc dang nhap gap su co
        </h1>
        <p className="mt-4 text-sm leading-7 text-stone-600">
          {error.message || "Da xay ra loi khong xac dinh trong khu vuc app."}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={reset} type="button">
            Thu tai lai
          </Button>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-2xl border border-stone-300 px-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 hover:text-stone-950"
            href="/dashboard"
          >
            Ve dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
