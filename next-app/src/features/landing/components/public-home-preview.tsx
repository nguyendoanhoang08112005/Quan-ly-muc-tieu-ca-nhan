import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  landingPreviewFeatureWallLeft,
  landingPreviewFeatureWallRight
} from "@/features/landing/content";

function PandaMascotArt() {
  return (
    <div className="relative h-40 w-32">
      <div className="absolute left-4 top-1 h-8 w-8 rounded-full bg-[#232323]" />
      <div className="absolute right-4 top-1 h-8 w-8 rounded-full bg-[#232323]" />
      <div className="absolute left-1/2 top-4 h-20 w-20 -translate-x-1/2 rounded-full bg-[#fffdf9]" />
      <div className="absolute left-[2.2rem] top-[2.7rem] h-7 w-5 rotate-[18deg] rounded-full bg-[#232323]" />
      <div className="absolute right-[2.2rem] top-[2.7rem] h-7 w-5 -rotate-[18deg] rounded-full bg-[#232323]" />
      <div className="absolute left-[2.8rem] top-[3.5rem] h-2 w-2 rounded-full bg-white" />
      <div className="absolute right-[2.8rem] top-[3.5rem] h-2 w-2 rounded-full bg-white" />
      <div className="absolute left-1/2 top-[4.7rem] h-2.5 w-3 -translate-x-1/2 rounded-full bg-[#232323]" />
      <div className="absolute bottom-2 left-1/2 h-20 w-20 -translate-x-1/2 rounded-[45%] bg-[#232323]" />
      <div className="absolute bottom-4 left-1/2 h-14 w-12 -translate-x-1/2 rounded-[45%] bg-[#fffdf9]" />
      <div className="absolute bottom-5 left-3 h-7 w-7 rounded-full bg-[#232323]" />
      <div className="absolute bottom-5 right-3 h-7 w-7 rounded-full bg-[#232323]" />
      <div className="absolute right-0 top-[5.7rem] flex rotate-[-18deg] gap-1">
        <span className="h-11 w-2.5 rounded-full bg-[#90b56f]" />
        <span className="mt-2 h-9 w-2.5 rounded-full bg-[#79a15b]" />
      </div>
    </div>
  );
}

function CatMascotArt() {
  return (
    <div className="relative h-40 w-32">
      <div className="absolute left-5 top-2 h-7 w-7 rotate-45 rounded-sm bg-[#ffd2c4]" />
      <div className="absolute right-5 top-2 h-7 w-7 rotate-45 rounded-sm bg-[#ffd2c4]" />
      <div className="absolute left-1/2 top-4 h-20 w-20 -translate-x-1/2 rounded-full bg-[#ffe2d8]" />
      <div className="absolute left-[2.55rem] top-[3.6rem] h-2.5 w-2.5 rounded-full bg-[#222222]" />
      <div className="absolute right-[2.55rem] top-[3.6rem] h-2.5 w-2.5 rounded-full bg-[#222222]" />
      <div className="absolute left-1/2 top-[4.5rem] h-2.5 w-2.5 -translate-x-1/2 rotate-45 rounded-sm bg-[#ff6d5a]" />
      <div className="absolute bottom-2 left-1/2 h-20 w-20 -translate-x-1/2 rounded-[45%] bg-[#ffd2c4]" />
      <div className="absolute bottom-0 right-0 h-20 w-12 rounded-full border-[9px] border-l-0 border-[#ff9b86] bg-transparent" />
      <div className="absolute bottom-4 left-4 h-7 w-7 rounded-full bg-[#ffe9e1]" />
      <div className="absolute bottom-4 right-4 h-7 w-7 rounded-full bg-[#ffe9e1]" />
    </div>
  );
}

function MascotBadge({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute hidden h-[78px] w-[78px] items-center justify-center rounded-[24px] border border-white/80 bg-white/92 backdrop-blur md:flex",
        "shadow-[rgba(17,24,39,0.08)_0px_10px_26px_-18px,rgba(17,24,39,0.08)_0px_1px_1px]",
        className
      )}
    >
      <div className="scale-[0.38]">{children}</div>
    </div>
  );
}

function FeatureGlyph({
  icon: Icon,
  label
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-[18px] border border-[#e8dfd5] bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf8_100%)] px-3 py-3 text-center">
      <Icon aria-hidden="true" className="h-4.5 w-4.5 text-[#5f5750]" />
      <span className="text-xs font-medium text-[#6b645d]">{label}</span>
    </div>
  );
}

export function PublicHomePreview() {
  return (
    <div
      className="relative mt-8 rounded-[30px] border border-[#eee4da] bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(252,250,248,0.96)_100%)] p-4 shadow-[0_16px_36px_-30px_rgba(28,25,23,0.22)] sm:p-6"
      id="xem-nhanh"
    >
      <MascotBadge className="-left-3 top-16">
        <PandaMascotArt />
      </MascotBadge>
      <MascotBadge className="right-8 top-8">
        <CatMascotArt />
      </MascotBadge>

      <div className="grid gap-4 xl:grid-cols-[0.72fr_520px_0.72fr] xl:items-center">
        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          {landingPreviewFeatureWallLeft.map((item) => (
            <FeatureGlyph key={item.label} icon={item.icon} label={item.label} />
          ))}
        </div>

        <div className="rounded-[30px] border border-[#eee4da] bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf8_100%)] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-[#fff1e9] px-3 py-1 text-xs font-semibold text-[#ba6a4d]">
              Giao diện mẫu
            </span>
            <span className="rounded-full border border-[#e8dfd5] bg-white px-3 py-1 text-xs font-semibold text-[#6b645d]">
              Trong ngày
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[22px] border border-[#f0ddd4] bg-[#fff8f4] p-4 sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9d6b55]">
                Mục tiêu
              </p>
              <p className="mt-2 text-xl font-bold text-[#2b211d]">Ra mắt phiên bản mới</p>
              <div className="mt-4 h-2 rounded-full bg-white">
                <div aria-hidden="true" className="h-2 w-[62%] rounded-full bg-[#c9795a]" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-[#6a6480]">
                <span className="rounded-full bg-white px-3 py-1">3/5 cột mốc đã xong</span>
                <span className="rounded-full bg-white px-3 py-1">2 việc ưu tiên đang mở</span>
              </div>
            </div>

            <div className="rounded-[22px] border border-[#f1dfdb] bg-[#fff8f7] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b85e6f]">
                Công việc
              </p>
              <div className="mt-3 space-y-2">
                <div className="rounded-[14px] bg-white px-3 py-2">
                  <p className="text-sm font-semibold text-[#1f1c1a]">Hoàn thiện dashboard</p>
                  <p className="mt-1 text-xs text-[#8a8179]">Đang làm · 18:00 hôm nay</p>
                </div>
                <div className="rounded-[14px] border border-dashed border-[#f0d4cb] px-3 py-2 text-sm text-[#b8694d]">
                  + Thêm nhanh vào đúng cột
                </div>
              </div>
            </div>

            <div className="rounded-[22px] border border-[#e2ebd6] bg-[#f7fbf2] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6f8058]">
                Nhịp hôm nay
              </p>
              <div className="mt-4 flex gap-2">
                {["on", "on", "on", "on", "on", "off", "on"].map((state, index) => (
                  <span
                    aria-hidden="true"
                    key={`${state}-${index}`}
                    className={cn("h-8 w-8 rounded-full", state === "on" ? "bg-[#90b56f]" : "bg-white")}
                  />
                ))}
              </div>
              <p className="mt-3 text-sm text-[#6a735f]">6 ngày giữ nhịp và vẫn còn đà quay lại.</p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-[#6b645d]">
            Preview này mô phỏng cách app gom mục tiêu, việc đang chạy và nhịp làm việc hằng ngày vào cùng một bề mặt.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          {landingPreviewFeatureWallRight.map((item) => (
            <FeatureGlyph key={item.label} icon={item.icon} label={item.label} />
          ))}
        </div>
      </div>
    </div>
  );
}
