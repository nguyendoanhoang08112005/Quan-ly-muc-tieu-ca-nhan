"use client";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-lg rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
          Lỗi hệ thống
        </p>
        <h1 className="mt-3 text-3xl font-black text-stone-950">
          Ứng dụng mới gặp sự cố khi hiển thị
        </h1>
        <p className="mt-4 text-sm leading-6 text-stone-600">
          {error.message || "Đã xảy ra lỗi không xác định."}
        </p>
        <button
          className="mt-6 rounded-2xl bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white"
          onClick={reset}
          type="button"
        >
          Thử tải lại
        </button>
      </div>
    </div>
  );
}
