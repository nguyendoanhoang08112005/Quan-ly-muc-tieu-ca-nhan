export default function AppGroupLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="h-4 w-32 rounded-full bg-stone-200" />
        <div className="mt-5 h-10 w-80 max-w-full rounded-full bg-stone-200" />
        <div className="mt-4 h-4 w-full max-w-3xl rounded-full bg-stone-100" />
        <div className="mt-2 h-4 w-full max-w-2xl rounded-full bg-stone-100" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm"
            key={index}
          >
            <div className="h-4 w-24 rounded-full bg-stone-100" />
            <div className="mt-4 h-8 w-56 rounded-full bg-stone-200" />
            <div className="mt-4 h-4 w-full rounded-full bg-stone-100" />
            <div className="mt-2 h-4 w-11/12 rounded-full bg-stone-100" />
            <div className="mt-6 h-10 w-32 rounded-full bg-stone-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
