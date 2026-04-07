import Link from "next/link";

export default function PublicHomePage() {
  return (
    <main className="min-h-screen">
      <section className="border-b-4 border-black bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="inline-flex border-2 border-black px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-black">
            Phase 4 dang chay
          </div>
          <h1 className="mt-6 max-w-4xl text-5xl font-black uppercase tracking-tight text-black md:text-6xl">
            Goals module da duoc dua len Next.js App Router
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-stone-600">
            He moi da co auth that, private layout, dashboard snapshot va flow
            goals list-create-detail-edit. Laravel va CRA van duoc
            giu song song de doi chieu trong qua trinh migrate.
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
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-stone-200 px-5 py-5">
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">
                Server first
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Goals list va dashboard doc du lieu tu server component, khong
                fetch bang useEffect.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-stone-200 px-5 py-5">
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">
                Safe mutations
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Create, edit, delete goal duoc validate bang Zod truoc khi ghi
                vao MySQL qua Prisma.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-stone-200 px-5 py-5">
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">
                Migration tiep
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Milestone, task va dashboard analytics se tiep tuc dua len o
                phase sau.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
