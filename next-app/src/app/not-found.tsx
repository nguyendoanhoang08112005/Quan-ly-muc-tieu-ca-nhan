import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-lg rounded-3xl border border-stone-300 bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
          404
        </p>
        <h1 className="mt-3 text-3xl font-black text-stone-950">
          Không tìm thấy trang
        </h1>
        <p className="mt-4 text-sm leading-6 text-stone-600">
          Trang này chưa được chuyển sang hệ mới hoặc không tồn tại.
        </p>
        <Link
          className="mt-6 inline-flex rounded-2xl bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white"
          href="/"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
