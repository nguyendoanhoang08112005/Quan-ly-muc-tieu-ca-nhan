import { landingFeatureModules } from "@/features/landing/content";
import { landingSurfaceShadow } from "@/features/landing/theme";
import { cn } from "@/lib/utils";

export function PublicHomeFeatures() {
  return (
    <section className="mt-16" id="tinh-nang">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b645d]">
            Vì sao app này gọn
          </p>
          <h2 className="mt-2 text-[2.15rem] font-extrabold tracking-[-0.04em] text-[#1f1c1a]">
            Không bắt bạn ghép lại luồng làm việc từ nhiều nơi.
          </h2>
        </div>
        <p className="max-w-[360px] text-sm leading-7 text-[#6b645d]">
          Section này không nhắc lại preview ở trên. Nó chỉ giải thích vì sao trải nghiệm trong app đỡ rối và dễ quay lại hơn.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {landingFeatureModules.map((item) => (
          <article
            key={item.title}
            className={cn(
              "rounded-[28px] border border-[#e8dfd5] bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf8_100%)] p-5",
              landingSurfaceShadow
            )}
          >
            <div
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-[14px]",
                item.accent
              )}
            >
              <item.icon aria-hidden="true" className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-xl font-bold tracking-[-0.03em] text-[#1f1c1a]">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[#6b645d]">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
