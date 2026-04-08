import Link from "next/link";

export default function PublicHomePage() {
  return (
    <main className="min-h-screen">
      <section className="border-b-4 border-black bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h1 className="mt-6 max-w-4xl text-5xl font-black uppercase tracking-tight text-black md:text-6xl">
            Mô-đun mục tiêu đã được đưa lên App Router của Next.js
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-stone-600">
            Hệ mới đã có xác thực thật, bố cục khu vực riêng tư, ảnh chụp nhanh
            bảng điều khiển và luồng danh sách, tạo, xem chi tiết, chỉnh sửa mục tiêu.
            Laravel và CRA vẫn được giữ song song để đối chiếu trong quá trình
            chuyển đổi.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              className="ui-dark-cta rounded-2xl bg-black px-6 py-3 text-sm font-semibold !text-white"
              href="/login"
            >
              Đăng nhập
            </Link>
            <Link
              className="rounded-2xl border border-black px-6 py-3 text-sm font-semibold text-black"
              href="/register"
            >
              Tạo tài khoản
            </Link>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-stone-200 px-5 py-5">
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">
                Ưu tiên máy chủ
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Danh sách mục tiêu và bảng điều khiển đọc dữ liệu từ thành phần
                phía máy chủ, không tải bằng `useEffect`.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-stone-200 px-5 py-5">
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">
                Thao tác an toàn
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Tạo, sửa, xóa mục tiêu được validate bằng Zod trước khi ghi vào
                MySQL qua Prisma.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-stone-200 px-5 py-5">
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">
                Lộ trình tiếp theo
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Cột mốc, công việc và phân tích bảng điều khiển sẽ tiếp tục
                được đưa lên trong các bước tiếp theo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
