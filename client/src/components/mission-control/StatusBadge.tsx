import { cn } from "@/lib/utils";

type Tone = "neutral" | "info" | "success" | "warning" | "danger" | "violet";

const toneByValue: Record<string, Tone> = {
  active: "info",
  ready: "success",
  approved: "success",
  complete: "success",
  passed: "success",
  pending: "warning",
  planning: "neutral",
  planned: "neutral",
  drafting: "neutral",
  designing: "violet",
  testing: "info",
  open: "warning",
  monitoring: "info",
  blocked: "danger",
  failed: "danger",
  critical: "danger",
  high: "danger",
  revision_requested: "warning",
  revision_needed: "warning",
  under_review: "violet",
  in_progress: "info",
  not_started: "neutral",
  deferred: "neutral",
  rejected: "danger",
  intake: "neutral",
  queued: "neutral",
  mitigated: "success",
  accepted: "neutral",
  working_assumption: "violet",
  open_decision: "warning",
  needs_evidence: "warning",
  authoritative_source: "success",
  new_proposal: "violet",
  historical_context: "neutral",
};

const classes: Record<Tone, string> = {
  neutral: "border-slate-700/70 bg-slate-800/70 text-slate-300",
  info: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
  success: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  warning: "border-amber-400/20 bg-amber-400/10 text-amber-200",
  danger: "border-rose-400/20 bg-rose-400/10 text-rose-200",
  violet: "border-violet-400/20 bg-violet-400/10 text-violet-200",
};

export function readable(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase());
}

export default function StatusBadge({ value, tone, className }: { value: string; tone?: Tone; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]", classes[tone ?? toneByValue[value] ?? "neutral"], className)}>
      {readable(value)}
    </span>
  );
}
