"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Clock, Compass, Crown, Lock, Sparkles, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { GAME, type Fragment } from "@/lib/game-data"
import { useTheme } from "@/lib/theme-context"
import { ThemeIcon } from "@/components/lb/theme-icon"
import MediaRenderer from "@/components/lb/media-renderer"

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
          stroke={completed ? "var(--accent)" : "color-mix(in oklch, var(--primary) 30%, transparent)"}
          strokeWidth={completed ? "5.5" : "4"}
          strokeDasharray={completed ? "none" : "5 6"}
          strokeLinecap="round"
          opacity={completed ? 0.95 : 0.55}
        />
      </svg>
    </div>
  )
}

/* ═══════════════════════════════════════════
   Treasure images mapped by theme/category
   ═══════════════════════════════════════════ */
const themeTreasureImages: Record<string, { locked: string; unlocked: string }> = {
  culture: {
    locked: "/images/treasure_locked.jpg",
    unlocked: "/images/treasure_unlocked.jpg",
  },
  sport: {
    locked: "/images/treasure_locked.jpg",
    unlocked: "/images/treasure_unlocked_sport.jpg",
  },
  nature: {
    locked: "/images/treasure_locked.jpg",
    unlocked: "/images/event-baobab.png",
  },
  histoire: {
    locked: "/images/treasure_locked.jpg",
    unlocked: "/images/clue-artifact.png",
  },
  science: {
    locked: "/images/treasure_locked.jpg",
    unlocked: "/images/ancient-map.png",
  },
  gastronomie: {
    locked: "/images/treasure_locked.jpg",
    unlocked: "/images/event-river.png",
  },
}

/* ═══════════════════════════════════════════
   MAIN MAP DASHBOARD
   ═══════════════════════════════════════════ */
export function MapDashboard({
  fragments,
  nickname,
  elapsed,
  onSelect,
  isAuthed = false,
}: {
  fragments: Fragment[]
  nickname: string
  elapsed: string
  onSelect: (f: Fragment) => void
  isAuthed?: boolean
}) {
  const { theme, themeId } = useTheme()
  const found     = fragments.filter((f) => f.status === "completed").length
  const remaining = GAME.totalFragments - found
  const progress  = Math.round((found / GAME.totalFragments) * 100)
  const isUnlockedQuest = isAuthed && remaining === 0

  const themeImages = themeTreasureImages[themeId] || themeTreasureImages.culture
  const lockedImg = themeImages.locked
  const unlockedImg = themeImages.unlocked

  const scrollRef = useRef<HTMLDivElement>(null)
  const pathPositions = fragments.map((_, i) => getPathX(i))

  const [adConfig, setAdConfig] = useState<any>(null)
  const [isAdVisible, setIsAdVisible] = useState(true)
  const [skipCountdown, setSkipCountdown] = useState(0)

  // Load sponsoring config
  useEffect(() => {
    try {
      const stored = localStorage.getItem("lb_sponsoring")
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.isEnabled && parsed.displayOnMap) {
          setAdConfig(parsed)
          if (parsed.displayMode === 'fullscreen') {
            setSkipCountdown(parsed.skipDuration)
            if (parsed.skipDuration > 0) {
              const interval = setInterval(() => {
                setSkipCountdown((prev) => {
                  if (prev <= 1) {
                    clearInterval(interval)
                    return 0
                  }
                  return prev - 1
                })
              }, 1000)
              return () => clearInterval(interval)
            }
          } else if (parsed.rotationDuration > 0) {
            const t = setTimeout(() => {
              setIsAdVisible(false)
            }, parsed.rotationDuration * 1000)
            return () => clearTimeout(t)
          }
        }
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  // Auto-scroll to active node on mount to prevent it being hidden under bottom nav
  useEffect(() => {
    const container = scrollRef.current
    const activeNode = document.getElementById("active-node")
    if (container && activeNode) {
      const t = setTimeout(() => {
        const containerHeight = container.clientHeight
        const nodeTop = activeNode.offsetTop
        const nodeHeight = activeNode.clientHeight
        const scrollTarget = nodeTop - (containerHeight / 2) + (nodeHeight / 2)
        container.scrollTo({ top: scrollTarget, behavior: "smooth" })
      }, 350)
      return () => clearTimeout(t)
    }
  }, [fragments])

  return (
    <div className="relative flex h-full flex-col bg-transparent">
      {/* Dynamic Sponsoring: Banner Mode */}
      {adConfig && isAdVisible && adConfig.displayMode === 'banner' && (
        <div className="relative z-30 mx-auto w-[90%] mt-3 bg-black/90 border border-amber-500/35 rounded-2xl p-3 shadow-2xl flex flex-col gap-2 animate-unfurl">
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            {adConfig.adImage && adConfig.adType !== 'only_video' ? (
              <MediaRenderer src={adConfig.adImage} type="image" className="h-6 w-6 rounded-md object-cover" />
            ) : (
              <div className="h-6 w-6 rounded-md bg-amber-500/20 flex items-center justify-center text-[10px] font-black text-amber-500 shrink-0">
                {adConfig.adType === 'only_video' ? "🎬" : "AD"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-heading font-black text-amber-400 tracking-wider leading-none uppercase truncate">
                {adConfig.sponsorName}
              </p>
              <p className="text-[8px] text-white/50 leading-none mt-0.5">Sponsor Officiel</p>
            </div>
            
            {adConfig.targetUrl && (
              <a
                href={adConfig.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Découvrir <ExternalLink className="h-3 w-3" />
              </a>
            )}
            
            <button
              onClick={() => setIsAdVisible(false)}
              className="text-white/40 hover:text-white/80 p-0.5 rounded transition-colors text-[11px] font-black cursor-pointer leading-none ml-2"
              title="Masquer"
            >
              ×
            </button>
          </div>
          
          {adConfig.adType === 'text_banner' ? (
            <p className="text-[10px] font-sans text-white/85 leading-relaxed">
              {adConfig.adText}
            </p>
          ) : adConfig.adType === 'only_video' && adConfig.adVideo ? (
            <div className="rounded-lg overflow-hidden h-20 bg-black relative">
              <MediaRenderer src={adConfig.adVideo} type="video" className="w-full h-full object-cover" />
            </div>
          ) : adConfig.adImage ? (
            <MediaRenderer src={adConfig.adImage} type="image" className="w-full h-20 object-cover rounded-lg" />
          ) : null}
        </div>
      )}

      {/* Dynamic Sponsoring: Full Screen Interstitial Overlay Mode */}
      {adConfig && isAdVisible && adConfig.displayMode === 'fullscreen' && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-6 pt-12 animate-fade-in select-none">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.03] via-transparent to-transparent pointer-events-none" />
          
          {/* Skip / Close timer header */}
          <div className="flex justify-end relative z-10">
            {skipCountdown > 0 ? (
              <span className="text-xs font-black tracking-widest text-white/55 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                Passer dans {skipCountdown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setIsAdVisible(false)}
                className="text-xs font-black uppercase tracking-widest text-black bg-amber-400 border border-amber-400 px-5 py-2.5 rounded-full shadow-lg shadow-amber-400/20 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Passer l'annonce ×
              </button>
            )}
          </div>

          {/* Ad Resource Body */}
          <div className="flex-1 flex flex-col items-center justify-center my-6 relative z-10 max-w-lg mx-auto w-full">
            {adConfig.adType === 'only_image' && adConfig.adImage ? (
              <MediaRenderer
                src={adConfig.adImage}
                type="image"
                className="w-full max-h-[70vh] object-contain rounded-2xl shadow-[0_20px_50px_rgba(251,191,36,0.12)] border border-white/10 animate-scale-up"
              />
            ) : adConfig.adType === 'only_video' && adConfig.adVideo ? (
              <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black/80 relative border border-white/10 shadow-[0_20px_50px_rgba(251,191,36,0.12)] animate-scale-up">
                <MediaRenderer
                  src={adConfig.adVideo}
                  type="video"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-[8px] font-bold text-white uppercase tracking-widest px-2 py-0.5 rounded">
                  Vidéo Sponsor
                </span>
              </div>
            ) : (
              /* Text + Banner card fallback */
              <div className="bg-[#1c1816]/95 border border-amber-500/25 rounded-3xl p-6 text-center space-y-4 shadow-2xl w-full max-w-md backdrop-blur-sm animate-scale-up">
                {adConfig.adImage && (
                  <MediaRenderer src={adConfig.adImage} type="image" className="h-16 mx-auto object-contain rounded-lg" />
                )}
                <div>
                  <span className="inline-block rounded-full bg-amber-500/10 px-3 py-1 font-heading text-[9px] font-black uppercase tracking-[0.2em] text-amber-400 mb-2 border border-amber-500/20">
                    Sponsor Officiel
                  </span>
                  <h4 className="font-heading text-lg font-black text-white uppercase tracking-wider">
                    {adConfig.sponsorName}
                  </h4>
                </div>
                
                {adConfig.adText && (
                  <p className="text-sm text-white/80 leading-relaxed font-sans px-2">
                    {adConfig.adText}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* CTA Link Footer */}
          {adConfig.targetUrl && (
            <div className="relative z-10 w-full max-w-sm mx-auto pt-4 border-t border-white/10">
              <a
                href={adConfig.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black py-4 rounded-2xl font-heading text-xs font-black uppercase tracking-widest shadow-xl shadow-amber-500/15 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                Découvrir l'offre <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      )}

      {/* ── Scrollable path area ── */}
      <div ref={scrollRef} className="relative flex-1 overflow-y-auto overflow-x-hidden pb-32 pt-4 bg-transparent">
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
        <div className="relative z-10 mx-auto mt-10 w-[85%] max-w-[260px] animate-fade-in">
          {isUnlockedQuest ? (
            /* Unlocked Treasure Card Design */
            <div
              className="flex flex-col items-center rounded-2xl border-2 p-4 text-center bg-card/95 backdrop-blur-sm shadow-[0_8px_32px_rgba(217,119,6,0.12)] ring-1 ring-amber-500/10"
              style={{
                borderColor: "var(--gold)",
              }}
            >
              <img
                src={unlockedImg}
                alt="Trésor Déverrouillé"
                className="w-full h-32 object-cover rounded-xl border border-amber-400/20 mb-3 shadow-sm animate-float"
              />
              <Crown className="h-5 w-5 text-amber-600 mb-1" strokeWidth={2} />
              <p className="font-heading text-xs font-black text-amber-600 uppercase tracking-wider">
                Quête Complétée ! 🏆
              </p>
              <p className="font-serif text-[10px] leading-relaxed text-primary mt-2 px-1">
                Félicitations aventurier, vous avez triomphé de l'expédition et débloqué le Trésor d'une valeur inestimable !
              </p>
            </div>
          ) : (
            /* Locked Treasure Card Design */
            <div
              className="flex flex-col items-center rounded-2xl border border-dashed p-4 text-center bg-card/65 backdrop-blur-sm"
              style={{
                borderColor: "color-mix(in oklch, var(--gold) 20%, var(--border))",
              }}
            >
              <img
                src={lockedImg}
                alt="Trésor Verrouillé"
                className="w-full h-24 object-cover rounded-xl opacity-35 grayscale mb-3"
              />
              <p className="font-heading text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Le Trésor Final
              </p>
              <p className="font-serif text-[9px] leading-normal text-muted-foreground/60 mt-1 max-w-[200px]">
                Résolvez tous les défis pour déverrouiller la récompense ultime.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
