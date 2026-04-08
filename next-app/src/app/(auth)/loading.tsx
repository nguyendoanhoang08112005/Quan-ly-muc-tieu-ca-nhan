export default function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="h-4 w-28 rounded-full bg-stone-200" />
        <div className="mt-4 h-10 w-72 rounded-full bg-stone-200" />
        <div className="mt-4 h-4 w-full rounded-full bg-stone-100" />
        <div className="mt-8 space-y-4">
          <div className="h-12 rounded-2xl bg-stone-100" />
          <div className="h-12 rounded-2xl bg-stone-100" />
          <div className="h-12 rounded-2xl bg-stone-200" />
        </div>
      </div>
    </div>
  );
}
