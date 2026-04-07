import Link from "next/link";
import type { Route } from "next";

const items = [
  { href: "/dashboard" as Route, label: "Dashboard" },
  { href: "/goals" as Route, label: "Goals" },
  { href: "/login" as Route, label: "Login" },
  { href: "/register" as Route, label: "Register" }
];

export function AppSidebar() {
  return (
    <aside className="sticky top-0 hidden min-h-screen w-72 shrink-0 border-r-4 border-black bg-white lg:block">
      <div className="border-b-4 border-black p-6">
        <div className="flex h-12 w-12 items-center justify-center bg-black text-xl font-black text-white">
          M
        </div>
        <h2 className="mt-4 text-lg font-black uppercase tracking-tight text-black">
          Muc tieu ca nhan
        </h2>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
          Next.js migrate shell
        </p>
      </div>

      <nav className="space-y-2 p-4">
        {items.map((item) => (
          <Link
            key={item.href}
            className="block rounded-2xl px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 hover:text-stone-950"
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
