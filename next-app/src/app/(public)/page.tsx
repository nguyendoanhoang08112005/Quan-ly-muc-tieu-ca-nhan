import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { PublicHomeFeatures } from "@/features/landing/components/public-home-features";
import { PublicHomeHeader } from "@/features/landing/components/public-home-header";
import { PublicHomeHero } from "@/features/landing/components/public-home-hero";
import { PublicHomeStart } from "@/features/landing/components/public-home-start";
import { landingPageDescription } from "@/features/landing/content";
import { getServerAuthSession } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  title: "Trang chủ",
  description: landingPageDescription
};

export default async function PublicHomePage() {
  const session = await getServerAuthSession();
  const isAuthenticated = Boolean(session?.user?.id);

  return (
    <main
      className={cn(
        bodyFont.className,
        "min-h-screen bg-[linear-gradient(180deg,#faf8f3_0%,#f6f3ee_100%)] text-[#1f1c1a]"
      )}
    >
      <PublicHomeHeader isAuthenticated={isAuthenticated} />

      <div className="mx-auto w-full max-w-[1120px] px-5 pb-20 pt-12 sm:pt-16">
        <section id="tong-quan">
          <PublicHomeHero isAuthenticated={isAuthenticated} />
        </section>
        <PublicHomeFeatures />
        <PublicHomeStart isAuthenticated={isAuthenticated} />
      </div>
    </main>
  );
}
