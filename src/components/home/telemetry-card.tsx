"use client";

import { Cpu, HardDrive, MemoryStick, ShieldCheck } from "lucide-react";
import { CountUp, FillBar, GrowBar } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

/** Response-time samples in ms — the shape of a healthy node under load. */
const samples = [
  52, 47, 44, 49, 41, 45, 43, 58, 46, 42, 44, 40, 47, 45, 39, 43, 46, 41, 44,
  45,
];

const peak = Math.max(...samples);

const resources = [
  { label: "CPU", value: 12, Icon: Cpu },
  { label: "Memory", value: 28, Icon: MemoryStick },
  { label: "Storage", value: 45, Icon: HardDrive },
];

/**
 * The cockpit instrument panel. The data is fixed, but it builds itself on
 * arrival — the trace draws left to right, the meters wipe in and the headline
 * figure counts up — so it reads as an instrument coming online.
 */
export function TelemetryCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full rounded-[16px] border border-white/12 bg-white/[0.04] p-5 backdrop-blur-md",
        "shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]",
        className,
      )}
    >
      {/* Node header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal-ok opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-signal-ok" />
          </span>
          <span className="font-mono text-[12.5px] font-medium tracking-tight text-white/85">
            mum-edge-01
          </span>
        </div>
        <span className="eyebrow text-signal-ok">Operational</span>
      </div>

      {/* Headline metric */}
      <div className="pt-5">
        <div className="flex items-baseline justify-between">
          <span className="eyebrow text-white/40">Response time</span>
          <span className="font-mono text-[11.5px] text-white/35 tnum">
            last 60 min
          </span>
        </div>

        <div className="mt-2 flex items-end gap-1.5">
          <CountUp
            value={45}
            format={(n) => String(Math.round(n))}
            className="font-mono text-[38px] leading-none font-bold text-white tnum"
          />
          <span className="pb-1 font-mono text-[15px] text-white/45">ms</span>
        </div>

        {/* Sparkline — draws in left to right */}
        <div aria-hidden className="mt-4 flex h-14 items-end gap-[3px]">
          {samples.map((ms, i) => (
            <GrowBar
              key={i}
              heightPct={Math.round((ms / peak) * 100)}
              delay={0.25 + i * 0.028}
              className={cn(
                "flex-1 rounded-t-[2px]",
                i === samples.length - 1
                  ? "bg-flag-400"
                  : "bg-gradient-to-t from-brand-600/35 to-brand-400/80",
              )}
            />
          ))}
        </div>
      </div>

      {/* Resource meters */}
      <div className="mt-5 space-y-3 border-t border-white/10 pt-5">
        {resources.map(({ label, value, Icon }, i) => (
          <div key={label} className="flex items-center gap-3">
            <Icon aria-hidden className="size-[15px] shrink-0 text-white/35" />
            <span className="w-16 shrink-0 text-[12.5px] text-white/55">
              {label}
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <FillBar
                widthPct={value}
                delay={0.85 + i * 0.12}
                className="h-full rounded-full bg-gradient-racer"
              />
            </div>
            <CountUp
              value={value}
              duration={1}
              format={(n) => `${Math.round(n)}%`}
              className="w-9 shrink-0 text-right font-mono text-[12px] font-medium text-white/70 tnum"
            />
          </div>
        ))}
      </div>

      {/* Footer badges */}
      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
        <div>
          <p className="eyebrow text-white/35">Uptime</p>
          <CountUp
            value={99.9}
            format={(n) => `${n.toFixed(1)}%`}
            className="mt-1 block font-mono text-[17px] font-bold text-white tnum"
          />
        </div>
        <div>
          <p className="eyebrow text-white/35">SSL grade</p>
          <p className="mt-1 flex items-center gap-1.5 font-mono text-[17px] font-bold text-white">
            <ShieldCheck className="size-4 text-signal-ok" />
            A+
          </p>
        </div>
      </div>
    </div>
  );
}
