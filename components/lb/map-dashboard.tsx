"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Clock, Compass, Crown, Lock, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { GAME, type Fragment } from "@/lib/game-data"
import { useTheme } from "@/lib/theme-context"
import { ThemeIcon } from "@/components/lb/theme-icon"

/* ═══════════════════════════════════════════
   Duolingo-style winding path positions.
   Nodes zigzag left↔right relative to center.
   ═══════════════════════════════════════════ */
function getPathX(index: number): number {
  // Zigzag: even = left (30%), odd = right (70%)
  return index % 2 === 0 ? 34 : 66
}

function PathBackground() {
  return null // Handled globally at root page level to span behind header/nav
}

/* ═══════════════════════════════════════════
   Duolingo-style Node Component
   ═══════════════════════════════════════════ */
function PathNode({
  fragment,
  pathX,
  onSelect,
  hasProgress,
}: {
  fragment: Fragment
  pathX: number
  onSelect: (f: Fragment) => void
  hasProgress: boolean
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
      className="relative flex flex-col items-center py-4"
      style={{
        // Align horizontally based on zigzag x position
        paddingLeft: pathX > 50 ? "35%" : "0%",
        paddingRight: pathX < 50 ? "35%" : "0%",
      }}
    >
      <div className="relative flex flex-col items-center">
        {/* Floating popover/speech bubble for active node (Duolingo style) */}
        {isActive && (
          <div className="absolute bottom-full mb-3.5 z-20 animate-bounce">
            <div className="relative bg-amber-500 text-white font-heading text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-md whitespace-nowrap">
              {hasProgress ? "Continuer" : "Commencer"}
              {/* Little downward arrow/triangle */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-amber-500" />
            </div>
          </div>
        )}

        {/* ── Circular node button (3D raised look) ── */}
        <button
          ref={ref}
          id={isActive ? "active-node" : undefined}
          type="button"
          disabled={isLocked}
          onClick={() => onSelect(fragment)}
          className={cn(
            "group relative focus:outline-none shrink-0 transition-transform active:scale-[0.97]",
            isLocked ? "cursor-not-allowed" : "cursor-pointer",
            !isLocked && "reveal-point",
          )}
          aria-label={`Fragment ${fragment.index} — ${fragment.title}`}
        >
          {/* Outer glow ring for active node */}
          {isActive && (
            <span
              aria-hidden
              className="absolute inset-[-5px] rounded-full animate-ping-slow"
              style={{ background: "color-mix(in oklch, var(--accent) 30%, transparent)" }}
            />
          )}

          {/* Main Duolingo-style circle */}
          <span
            className={cn(
              "relative flex h-15 w-15 items-center justify-center rounded-full border-b-[4px] transition-all duration-150 active:border-b-0 active:translate-y-[4px]",
              isActive && "shadow-[0_4px_16px_rgba(0,0,0,0.15)] ring-2 ring-amber-400/30 scale-105",
              isCompleted && "shadow-[0_2px_8px_rgba(0,0,0,0.08)]",
              isLocked && "opacity-50 border-b-2 translate-y-[2px]",
            )}
            style={{
              background: isActive
                ? "var(--accent)"
                : isCompleted
                ? "var(--wood)"
                : "var(--muted)",
              borderColor: isActive
                ? "color-mix(in oklch, var(--accent) 70%, black)"
                : isCompleted
                ? "color-mix(in oklch, var(--wood) 70%, black)"
                : "var(--border)",
              color: isActive || isCompleted
                ? "var(--accent-foreground)"
                : "var(--muted-foreground)",
            }}
          >
            {isCompleted ? (
              <Check className="h-6 w-6 text-white" strokeWidth={2.5} />
            ) : isLocked ? (
              <Lock className="h-5 w-5" strokeWidth={2} />
            ) : (
              <Sparkles className="h-6 w-6 text-white" strokeWidth={2} />
            )}
          </span>
        </button>

        {/* ── Title/Label centered below the node ── */}
        <div className="mt-2 text-center max-w-[120px] px-1">
          <p className={cn(
            "font-heading text-xs font-bold leading-tight truncate",
            isLocked ? "text-muted-foreground/50" : "text-primary"
          )}>
            {isLocked ? "???" : fragment.title}
          </p>
          {!isLocked && (
            <p className="font-sans text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5 truncate">
              {fragment.place}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   Connector line between nodes
   ═══════════════════════════════════════════ */
function Connector({ from, to, completed }: { from: number; to: number; completed: boolean }) {
  // Translate from/to percentages into SVG coordinate endpoints
  // Left is 34%, Right is 66%
  const startX = from < 50 ? 68 : 132
  const endX = to < 50 ? 68 : 132

  return (
    <div className="relative mx-auto h-12 w-full max-w-[280px]">
      <svg className="h-full w-full" viewBox="0 0 200 48" preserveAspectRatio="none" aria-hidden>
        <path
          d={`M ${startX} 0 C ${startX} 24, ${endX} 24, ${endX} 48`}
          fill="none"
          stroke={completed ? "var(--accent)" : "var(--border)"}
          strokeWidth="4.5"
          strokeDasharray={completed ? "none" : "5 7"}
          strokeLinecap="round"
          opacity={completed ? 0.65 : 0.25}
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

  const pathPositions = fragments.map((_, i) => getPathX(i))

  // Auto-scroll to active node on mount to prevent it being hidden under bottom nav
  useEffect(() => {
    const activeNode = document.getElementById("active-node")
    if (activeNode) {
      const t = setTimeout(() => {
        activeNode.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 350)
      return () => clearTimeout(t)
    }
  }, [fragments])

  return (
    <div className="relative flex h-full flex-col bg-transparent">

      {/* ── Scrollable path area ── */}
      <div className="relative flex-1 overflow-y-auto overflow-x-hidden pb-32 pt-4 bg-transparent">
        <PathBackground />

        {/* ── Winding path with nodes ── */}
        <div className="relative z-10 mt-6 flex flex-col gap-0 px-4 bg-transparent">
          {fragments.map((f, i) => {
            const px = pathPositions[i]
            const nextPx = pathPositions[i + 1]
            const isConnectorCompleted = f.status === "completed"
            return (
              <div key={f.id} className="bg-transparent">
                <PathNode
                  fragment={f}
                  pathX={px}
                  onSelect={onSelect}
                  hasProgress={found > 0}
                />
                {i < fragments.length - 1 && (
                  <Connector from={px} to={nextPx} completed={isConnectorCompleted} />
                )}
              </div>
            )
          })}
        </div>

        {/* ── Treasure at the end ── */}
        <div className="relative z-10 mx-auto mt-8 w-[80%] max-w-[240px]">
          <div
            className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-4 py-5 text-center bg-card/75 backdrop-blur-sm"
            style={{
              borderColor: "color-mix(in oklch, var(--gold) 30%, var(--border))",
            }}
          >
            <Crown className="h-7 w-7 text-gold animate-float" strokeWidth={1.25} />
            <p className="font-heading text-xs font-bold text-primary">Le Trésor Final</p>
            <p className="font-sans text-[10px] text-muted-foreground leading-normal">
              Résous tous les défis pour déverrouiller la récompense ultime
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
