"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { BottomNav, type Tab } from "@/components/lb/bottom-nav"
import { MapDashboard } from "@/components/lb/map-dashboard"
import { Challenges } from "@/components/lb/challenges"
import { Ranking } from "@/components/lb/ranking"
import { Profile } from "@/components/lb/profile"
import { ChallengeDetail } from "@/components/lb/challenge-detail"
import { AuthModal } from "@/components/lb/auth-modal"
import { useTheme } from "@/lib/theme-context"
import { ThemeIcon } from "@/components/lb/theme-icon"
import { GAME, fragments as initialFragments, type Fragment } from "@/lib/game-data"
import { cn } from "@/lib/utils"

function useElapsed() {
  const [start] = useState(() => Date.now() - (1 * 3600000 + 12 * 60000))
  const [now, setNow] = useState(start)
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const s  = Math.floor((now - start) / 1000)
  const hh = String(Math.floor(s / 3600)).padStart(2, "0")
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0")
  const ss = String(s % 60).padStart(2, "0")
  return `${hh}:${mm}:${ss}`
}

export default function PlayPage() {
  const [tab, setTab]           = useState<Tab>("map")
  const [fragmentList, setFragmentList] = useState<Fragment[]>(() => initialFragments)
  const [selected, setSelected] = useState<Fragment | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [isAuthed, setIsAuthed] = useState(false)
  const [nickname, setNickname] = useState(GAME.player)
  const { theme, setTheme, themeId } = useTheme()
  const elapsed = useElapsed()

  const found = fragmentList.filter((f) => f.status === "completed").length

  function cycleTheme() {
    const domainIds = ["culture", "sport", "nature", "histoire", "science", "gastronomie"]
    const currentIdx = domainIds.indexOf(themeId)
    const nextIdx = (currentIdx + 1) % domainIds.length
    setTheme(domainIds[nextIdx] as any)
  }

  const titles: Record<Tab, string> = {
    map:        GAME.event,
    challenges: "Événements",
    ranking:    "Classement",
    profile:    "Profil",
  }

  // Handle QR Scan complete
  function handleCompleteFragment(id: number) {
    setFragmentList((prevList) =>
      prevList.map((f) => {
        if (f.id === id) {
          return { ...f, status: "completed" }
        }
        // Unlock next fragment
        if (f.id === id + 1 && f.status === "locked") {
          return { ...f, status: "active" }
        }
        return f
      })
    )
    // Update selected fragment reference if currently open
    if (selected && selected.id === id) {
      setSelected((prev) => prev ? { ...prev, status: "completed" } : null)
    }
  }

  // Color filter class per theme for full page background
  const filterClass = {
    culture:     "",
    sport:       "hue-rotate-[80deg] saturate-110 contrast-[1.02]",
    nature:      "hue-rotate-[110deg] saturate-120 contrast-100",
    histoire:    "sepia-[0.12] contrast-[0.98] brightness-[0.98]",
    science:     "hue-rotate-[210deg] saturate-130 brightness-95",
    gastronomie: "hue-rotate-[-25deg] saturate-120 brightness-[1.02]",
  }[theme.id] || ""

  return (
    <div className="relative mx-auto flex min-h-dvh max-w-md flex-col bg-background text-foreground overflow-hidden">
      
      {/* ── Full-page Topographic Map Background (behind all UI layers) ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Topography vector map base */}
        <div
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-[0.22]",
            filterClass
          )}
          style={{ backgroundImage: "url('/images/map_culture.jpg')" }}
        />

        {/* Dynamic theme accent coloring */}
        <div
          className="absolute inset-0 transition-colors duration-700 mix-blend-color opacity-[0.20]"
          style={{ backgroundColor: "var(--accent)" }}
        />

        {/* Floating gradient depth blobs */}
        <div
          className="absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-[0.05] blur-[70px] transition-colors duration-700"
          style={{ background: "var(--accent)" }}
        />
        <div
          className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full opacity-[0.04] blur-[80px] transition-colors duration-700"
          style={{ background: "var(--gold)" }}
        />

        {/* Subtle screen vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30 opacity-90" />
      </div>

      {/* ── Top bar (Z-Index layer floating on top of background) ── */}
      <div className="sticky top-0 z-30 flex flex-col gap-2 px-4 py-2.5 bg-card/85 backdrop-blur-md border-b border-border/40 shadow-sm select-none sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:py-3">
        {/* Row 1 (Mobile container holding Left and Right side-by-side, disappears on desktop grid) */}
        <div className="flex items-center justify-between w-full col-span-3 sm:contents">
          
          {/* Left Column */}
          <div className="flex flex-col items-start gap-1">
            <Link
              href="/"
              className="flex items-center gap-1 font-sans text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Accueil
            </Link>
            
            <div className="flex items-center gap-1.5 rounded-full px-2 py-0.5 bg-emerald-500/5 ring-1 ring-emerald-500/10 font-sans text-[10px] font-bold text-emerald-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="truncate max-w-[55px] sm:max-w-[70px]">{nickname}</span>
              <span className="opacity-40">|</span>
              <span>{found}/{GAME.totalFragments}</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col items-end gap-1 sm:order-2">
            <button
              type="button"
              onClick={cycleTheme}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1 ring-1 transition-all cursor-pointer hover:bg-accent/15 active:scale-95 text-left"
              style={{
                background: "color-mix(in oklch, var(--accent) 8%, var(--card))",
                borderColor: "color-mix(in oklch, var(--accent) 25%, var(--border))",
              }}
            >
              <ThemeIcon iconName={theme.iconName} className="h-3.5 w-3.5 text-accent" strokeWidth={1.75} />
              <span className="font-sans text-[10px] font-semibold uppercase tracking-wider text-accent">
                {theme.label.split(" ")[0]}
              </span>
            </button>
            
            <div className="flex items-center gap-1.5 font-mono text-[12px] font-extrabold text-accent px-2 py-0.5 rounded-md bg-accent/5 ring-1 ring-accent/10">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              {elapsed}
            </div>
          </div>

        </div>

        {/* Center column - Event name in full (Row 2 on mobile, Center on desktop) */}
        <div className="flex items-center justify-center text-center w-full min-h-[22px] sm:min-h-[38px] border-t border-border/10 pt-2 sm:border-0 sm:pt-0 sm:col-start-2 sm:row-start-1">
          <span className="font-heading text-[11px] sm:text-xs font-black uppercase tracking-wider text-primary leading-tight">
            {titles[tab]}
          </span>
        </div>
      </div>

      {/* ── Content (Main display tab) ── */}
      <main className="relative z-10 flex-1 bg-transparent">
        {tab === "map" && (
          <div className="h-[calc(100dvh-3.5rem)] bg-transparent">
            <MapDashboard
              fragments={fragmentList}
              nickname={nickname}
              elapsed={elapsed}
              onSelect={setSelected}
            />
          </div>
        )}
        {tab === "challenges" && (
          <Challenges
            fragments={fragmentList}
            onSelect={setSelected}
          />
        )}
        {tab === "ranking"    && <Ranking />}
        {tab === "profile"    && <Profile nickname={nickname} />}
      </main>

      {/* ── Bottom Nav (Z-Index layer floating on top of background) ── */}
      <BottomNav active={tab} onChange={setTab} />

      {selected && (
        <ChallengeDetail
          fragment={selected}
          isAuthed={isAuthed}
          onClose={() => setSelected(null)}
          onRequireAuth={() => setShowAuth(true)}
          onComplete={handleCompleteFragment}
        />
      )}

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onComplete={(name) => {
            setNickname(name)
            setIsAuthed(true)
            setShowAuth(false)
          }}
        />
      )}
    </div>
  )
}
