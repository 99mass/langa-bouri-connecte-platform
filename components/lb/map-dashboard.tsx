"use client"

import { useEffect, useRef, useState } from "react"
import {
  Check,
  ChevronRight,
  Clock,
  Compass,
  Crown,
  Lock,
  MapPin,
  Sparkles,
  Star,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { GAME, type Fragment } from "@/lib/game-data"
import { useTheme } from "@/lib/theme-context"
import { ThemeIcon } from "@/components/lb/theme-icon"

/* ═══════════════════════════════════════════
   Duolingo-style winding path positions.
   Fragments zigzag left↔right as they go down.
   ═══════════════════════════════════════════ */
function getPathX(index: number, total: number): number {
  // Zigzag: even = left (30%), odd = right (70%), with slight variation
  const base = index % 2 === 0 ? 32 : 68
  const jitter = Math.sin(index * 1.7) * 8
  return base + jitter
}

/* ═══════════════════════════════════════════
   Decorative Background — theme-aware shapes
   ═══════════════════════════════════════════ */
function PathBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Large accent blob top-right */}
      <div
        className="absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-[0.07] blur-[80px]"
        style={{ background: "var(--accent)" }}
      />
      {/* Large accent blob bottom-left */}
      <div
        className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full opacity-[0.06] blur-[90px]"
        style={{ background: "var(--gold)" }}
      />
      {/* Small floating decorative circles */}
      {[
        { x: "85%", y: "15%", s: 120, o: 0.04 },
        { x: "10%", y: "40%", s: 80,  o: 0.05 },
        { x: "90%", y: "60%", s: 100, o: 0.03 },
        { x: "15%", y: "80%", s: 60,  o: 0.06 },
      ].map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-drift"
          style={{
            left: b.x,
            top: b.y,
            width: b.s,
            height: b.s,
            background: i % 2 === 0 ? "var(--accent)" : "var(--gold)",
            opacity: b.o,
            filter: "blur(40px)",
            animationDelay: `${i * 2}s`,
          }}
        />
      ))}
      {/* Decorative dotted pattern */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.03]" aria-hidden>
        <defs>
          <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="var(--foreground)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
    </div>
  )
}

/* ═══════════════════════════════════════════
   Section Divider Card (between groups)
   ═══════════════════════════════════════════ */
function SectionBanner({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mx-auto w-[85%] max-w-xs">
      <div
        className="rounded-2xl px-5 py-4 text-center"
        style={{
          background: "var(--accent)",
          color: "var(--accent-foreground)",
        }}
      >
        <p className="font-heading text-sm font-bold uppercase tracking-wider">{title}</p>
        <p className="mt-0.5 font-sans text-[11px] opacity-70">{subtitle}</p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   Node / Marker (Duolingo-style circle)
   ═══════════════════════════════════════════ */
function PathNode({
  fragment,
  pathX,
  onSelect,
}: {
  fragment: Fragment
  pathX: number
  onSelect: (f: Fragment) => void
}) {
  const { status } = fragment
  const isActive    = status === "active"
  const isLocked    = status === "locked"
  const isCompleted = status === "completed"
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || isLocked) return
    const t = setTimeout(() => el.classList.add("revealed"), 100 + fragment.id * 150)
    return () => clearTimeout(t)
  }, [fragment.id, isLocked])

  return (
    <div
      className="relative flex items-center"
      style={{
        justifyContent: pathX > 50 ? "flex-end" : "flex-start",
        paddingLeft: pathX > 50 ? undefined : `${pathX - 14}%`,
        paddingRight: pathX > 50 ? `${100 - pathX - 14}%` : undefined,
      }}
    >
      {/* Card + Node group — always goes node first, card beside */}
      <div className={cn(
        "flex items-center gap-3",
        pathX > 50 ? "flex-row-reverse" : "flex-row",
      )}>
        {/* ── Circle node ── */}
        <button
          ref={ref}
          type="button"
          disabled={isLocked}
          onClick={() => onSelect(fragment)}
          className={cn(
            "group relative shrink-0 focus:outline-none",
            isLocked ? "cursor-not-allowed" : "cursor-pointer",
            !isLocked && "reveal-point",
          )}
          aria-label={`Fragment ${fragment.index} — ${fragment.title}`}
        >
          {/* Ping for active */}
          {isActive && (
            <span
              aria-hidden
              className="absolute inset-0 rounded-full animate-ping-slow"
              style={{ background: "color-mix(in oklch, var(--accent) 35%, transparent)" }}
            />
          )}

          <span
            className={cn(
              "relative flex h-14 w-14 items-center justify-center rounded-full ring-[3px] transition-all duration-300",
              isActive && "ring-accent shadow-[0_0_24px_-2px_rgba(0,0,0,0.2)] scale-110",
              isCompleted && "ring-accent/70",
              isLocked && "ring-border/40 opacity-40",
            )}
            style={{
              background: isActive
                ? "var(--accent)"
                : isCompleted
                ? "var(--wood)"
                : "var(--muted)",
              color: isActive || isCompleted
                ? "var(--accent-foreground)"
                : "var(--muted-foreground)",
            }}
          >
            {isCompleted ? (
              <Check className="h-6 w-6" strokeWidth={2.5} />
            ) : isLocked ? (
              <Lock className="h-5 w-5" strokeWidth={2} />
            ) : (
              <Sparkles className="h-6 w-6 animate-quest-pulse" strokeWidth={1.75} />
            )}
          </span>

          {/* Step number badge */}
          <span
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 font-heading text-[9px] font-bold uppercase tracking-wider shadow-sm"
            style={{
              background: isActive ? "var(--ember)" : isCompleted ? "var(--wood)" : "var(--muted)",
              color: isActive || isCompleted ? "var(--primary-foreground)" : "var(--muted-foreground)",
            }}
          >
            {isLocked ? "?" : fragment.index}
          </span>
        </button>

        {/* ── Info card beside the node ── */}
        {!isLocked && (
          <button
            type="button"
            onClick={() => onSelect(fragment)}
            className={cn(
              "modern-card group/card flex max-w-[200px] items-center gap-2.5 px-4 py-3 text-left transition-all !rounded-2xl",
              isActive && "!ring-accent/30 !shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12)]",
            )}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-heading text-xs font-bold text-primary">{fragment.title}</p>
              <p className="mt-0.5 flex items-center gap-1 font-sans text-[10px] text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{fragment.place}</span>
              </p>
              {isCompleted && (
                <div className="mt-1 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-accent text-accent" />
                  <span className="font-sans text-[10px] font-semibold text-accent">{fragment.reward}</span>
                </div>
              )}
              {isActive && (
                <div className="mt-1 flex items-center gap-1">
                  <Zap className="h-3 w-3 text-ember" />
                  <span className="font-sans text-[10px] font-semibold text-ember">En cours</span>
                </div>
              )}
            </div>
            <ChevronRight
              className={cn("h-4 w-4 shrink-0 transition-transform group-hover/card:translate-x-0.5",
                isActive ? "text-accent" : "text-muted-foreground/50"
              )}
            />
          </button>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   Connector line between nodes
   ═══════════════════════════════════════════ */
function Connector({ from, to, completed }: { from: number; to: number; completed: boolean }) {
  return (
    <div className="relative mx-auto h-10 w-[60%]">
      <svg className="h-full w-full" viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden>
        <path
          d={`M ${from > 50 ? 150 : 50} 0 C ${100} 15, ${100} 25, ${to > 50 ? 150 : 50} 40`}
          fill="none"
          stroke={completed ? "var(--accent)" : "var(--border)"}
          strokeWidth={completed ? "3" : "2"}
          strokeDasharray={completed ? "none" : "6 6"}
          strokeLinecap="round"
          opacity={completed ? 0.5 : 0.3}
        />
      </svg>
    </div>
  )
}

/* ═══════════════════════════════════════════
   MAIN MAP DASHBOARD
   ═══════════════════════════════════════════ */
export function MapDashboard({
  fragments,
  nickname,
  elapsed,
  onSelect,
}: {
  fragments: Fragment[]
  nickname: string
  elapsed: string
  onSelect: (f: Fragment) => void
}) {
  const { theme } = useTheme()
  const found     = fragments.filter((f) => f.status === "completed").length
  const remaining = GAME.totalFragments - found
  const progress  = Math.round((found / GAME.totalFragments) * 100)

  const pathPositions = fragments.map((_, i) => getPathX(i, fragments.length))

  return (
    <div className="relative flex h-full flex-col bg-background">

      {/* ── Top HUD ── */}
      <header className="relative z-20 mx-3 mt-3 modern-card !rounded-2xl px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex items-center gap-2.5">
            {/* Theme icon */}
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
              style={{ background: "color-mix(in oklch, var(--accent) 15%, transparent)" }}
            >
              <ThemeIcon iconName={theme.iconName} className="h-4.5 w-4.5 text-accent" strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <p className="truncate font-heading text-sm font-bold text-primary">{nickname}</p>
              <p className="truncate font-sans text-[11px] text-muted-foreground">{GAME.event}</p>
            </div>
          </div>
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 font-heading text-sm font-bold tabular-nums ring-1"
            style={{
              background: "var(--wood)",
              color: "var(--accent)",
              borderColor: "color-mix(in oklch, var(--accent) 40%, transparent)",
            }}
          >
            <Clock className="h-4 w-4" />
            {elapsed}
          </div>
        </div>

        {/* Progress */}
        <div className="mt-3 flex items-center gap-3">
          <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-muted ring-1 ring-border/50">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, var(--wood), var(--accent))",
              }}
            />
          </div>
          <span className="font-heading text-xs font-bold text-primary">
            {found}/{GAME.totalFragments}
          </span>
        </div>
        <p className="mt-1 font-sans text-[11px] text-muted-foreground">
          {remaining} fragment{remaining > 1 ? "s" : ""} restant{remaining > 1 ? "s" : ""} avant le trésor
        </p>
      </header>

      {/* ── Scrollable path area ── */}
      <div className="relative flex-1 overflow-y-auto overflow-x-hidden pb-28 pt-4">
        <PathBackground />

        {/* ── Section banner ── */}
        <SectionBanner title={theme.label} subtitle={theme.description} />

        {/* ── Winding path with nodes ── */}
        <div className="relative z-10 mt-6 flex flex-col gap-0 px-4">
          {fragments.map((f, i) => {
            const px = pathPositions[i]
            const nextPx = pathPositions[i + 1]
            const isConnectorCompleted = f.status === "completed"
            return (
              <div key={f.id}>
                <PathNode fragment={f} pathX={px} onSelect={onSelect} />
                {i < fragments.length - 1 && (
                  <Connector from={px} to={nextPx} completed={isConnectorCompleted} />
                )}
              </div>
            )
          })}
        </div>

        {/* ── Treasure at the end ── */}
        <div className="relative z-10 mx-auto mt-6 w-[85%] max-w-xs">
          <div
            className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-5 py-6 text-center"
            style={{
              borderColor: "color-mix(in oklch, var(--gold) 30%, var(--border))",
              background: "color-mix(in oklch, var(--gold) 5%, var(--card))",
            }}
          >
            <Crown className="h-8 w-8 text-gold animate-float" strokeWidth={1.25} />
            <p className="font-heading text-sm font-bold text-primary">Le Trésor Final</p>
            <p className="font-sans text-[11px] text-muted-foreground">
              Résous tous les défis pour déverrouiller la récompense ultime
            </p>
          </div>
        </div>

        {/* ── Compass badge floating ── */}
        <div
          className="pointer-events-none fixed right-4 top-[7.5rem] z-20 flex h-12 w-12 items-center justify-center rounded-full shadow-lg ring-1"
          style={{
            background: "color-mix(in oklch, var(--card) 90%, var(--accent))",
            borderColor: "color-mix(in oklch, var(--accent) 30%, var(--border))",
          }}
        >
          <Compass className="h-7 w-7 text-accent" strokeWidth={1.25} />
        </div>
      </div>
    </div>
  )
}
