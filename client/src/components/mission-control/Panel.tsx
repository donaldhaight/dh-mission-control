import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export function Panel({ title, eyebrow, action, children, className }: { title: string; eyebrow?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("relative overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-[#111923]/80 shadow-[0_18px_50px_rgba(0,0,0,0.15)] backdrop-blur", className)}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/20 to-transparent" />
      <div className="flex items-start justify-between gap-4 px-5 pb-3 pt-5 sm:px-6">
        <div>
          {eyebrow ? <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-300/70">{eyebrow}</p> : null}
          <h2 className="text-base font-semibold tracking-[-0.02em] text-slate-100">{title}</h2>
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      <div className="px-5 pb-5 sm:px-6 sm:pb-6">{children}</div>
    </section>
  );
}

export function MetricCard({ label, value, detail, accent = "cyan" }: { label: string; value: string | number; detail: string; accent?: "cyan" | "violet" | "amber" | "rose" }) {
  const accentClasses = {
    cyan: "from-cyan-400 to-sky-300 text-cyan-200",
    violet: "from-violet-400 to-fuchsia-300 text-violet-200",
    amber: "from-amber-400 to-orange-300 text-amber-200",
    rose: "from-rose-400 to-pink-300 text-rose-200",
  }[accent];
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111923] p-4 transition-transform duration-200 hover:-translate-y-0.5">
      <div className={cn("absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r", accentClasses.replace("text-", ""))} />
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">{label}</p>
      <p className={cn("mt-2 text-3xl font-semibold tracking-[-0.06em]", accentClasses.split(" ").at(-1))}>{value}</p>
      <p className="mt-1.5 text-xs leading-5 text-slate-400">{detail}</p>
    </div>
  );
}

export function ViewAll({ children = "View details" }: { children?: ReactNode }) {
  return <span className="inline-flex items-center gap-1 text-xs font-medium text-cyan-300 transition-colors hover:text-cyan-100">{children}<ArrowUpRight className="h-3.5 w-3.5" /></span>;
}
