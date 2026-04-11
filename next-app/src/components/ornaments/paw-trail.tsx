import { PawPrint } from "lucide-react";
import { cn } from "@/lib/utils";

type PawTrailProps = {
  className?: string;
  variant?: "bamboo" | "mixed" | "peach" | "stone";
};

const pawTrailVariants: Record<NonNullable<PawTrailProps["variant"]>, string[]> = {
  bamboo: [
    "text-[#c9ddb9]",
    "text-[#bfd5af]",
    "text-[#b1ca9f]",
    "text-[#d6e7ca]",
    "text-[#c0d6b3]",
    "text-[#cadcbc]"
  ],
  mixed: [
    "text-[#e9c9b7]",
    "text-[#cddfc1]",
    "text-[#efcfbf]",
    "text-[#d8cabd]",
    "text-[#e4cfbf]",
    "text-[#cfdcc8]"
  ],
  peach: [
    "text-[#efc1aa]",
    "text-[#e8b196]",
    "text-[#f2ccbb]",
    "text-[#eebda8]",
    "text-[#f4d3c5]",
    "text-[#e8bca7]"
  ],
  stone: [
    "text-[#ddd1c5]",
    "text-[#d0c3b7]",
    "text-[#e4d8ce]",
    "text-[#cabdaf]",
    "text-[#d9cec2]",
    "text-[#cec1b5]"
  ]
};

export function PawTrail({
  className,
  variant = "peach"
}: PawTrailProps) {
  const colors = pawTrailVariants[variant];

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute hidden lg:block", className)}
    >
      <div
        className="absolute left-0 top-7 animate-[paw-float_7.8s_ease-in-out_infinite]"
        style={{ animationDelay: "0s" }}
      >
        <PawPrint className={cn("h-5 w-5 rotate-[-18deg] opacity-70", colors[0])} />
      </div>
      <div
        className="absolute left-8 top-0 animate-[paw-float_6.6s_ease-in-out_infinite]"
        style={{ animationDelay: "0.7s" }}
      >
        <PawPrint className={cn("h-6 w-6 rotate-[12deg] opacity-65", colors[1])} />
      </div>
      <div
        className="absolute left-16 top-12 animate-[paw-float_7.2s_ease-in-out_infinite]"
        style={{ animationDelay: "1.2s" }}
      >
        <PawPrint className={cn("h-4.5 w-4.5 rotate-[-10deg] opacity-62", colors[2])} />
      </div>
      <div
        className="absolute left-28 top-4 animate-[paw-float_8.4s_ease-in-out_infinite]"
        style={{ animationDelay: "0.4s" }}
      >
        <PawPrint className={cn("h-7 w-7 rotate-[18deg] opacity-58", colors[3])} />
      </div>
      <div
        className="absolute left-36 top-[3.3rem] animate-[paw-float_7s_ease-in-out_infinite]"
        style={{ animationDelay: "1.1s" }}
      >
        <PawPrint className={cn("h-4 w-4 rotate-[8deg] opacity-68", colors[4])} />
      </div>
      <div
        className="absolute left-[11.5rem] top-2 animate-[paw-float_8.8s_ease-in-out_infinite]"
        style={{ animationDelay: "0.2s" }}
      >
        <PawPrint className={cn("h-5.5 w-5.5 rotate-[-12deg] opacity-60", colors[5])} />
      </div>
    </div>
  );
}
