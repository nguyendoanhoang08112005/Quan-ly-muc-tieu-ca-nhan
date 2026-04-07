import Link from "next/link";

export default function PublicHomePage() {
  return (
    <main className="min-h-screen">
      <section className="border-b-4 border-black bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="inline-flex border-2 border-black px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-black">
            Phase 1 da bat dau
          </div>
          <h1 className="mt-6 max-w-4xl text-5xl font-black uppercase tracking-tight text-black md:text-6xl">
            Next.js dang duoc dung song song voi Laravel va CRA
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-stone-600">
            Day la bo khung moi cho qua trinh chuyen doi full-stack. Tu diem nay,
            chung ta se migrate tung module theo thu tu phu thuoc ky thuat.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              className="rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white"
              href="/login"
            >
              Dang nhap
            </Link>
            <Link
              className="rounded-2xl border border-black px-6 py-3 text-sm font-semibold text-black"
              href="/register"
            >
              Tao tai khoan
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

