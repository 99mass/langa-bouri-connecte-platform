"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft, QrCode } from "lucide-react"
import { BottomNav, type Tab } from "@/components/lb/bottom-nav"
import { MapDashboard } from "@/components/lb/map-dashboard"
import { Challenges } from "@/components/lb/challenges"
import { Ranking } from "@/components/lb/ranking"
import { Profile } from "@/components/lb/profile"
import { ChallengeDetail } from "@/components/lb/challenge-detail"
import { AuthModal } from "@/components/lb/auth-modal"
import { QrScannerModal } from "@/components/lb/qr-scanner-modal"
import { useTheme } from "@/lib/theme-context"
import { ThemeIcon } from "@/components/lb/theme-icon"
import { GAME, fragments as initialFragments, type Fragment } from "@/lib/game-data"
import { cn } from "@/lib/utils"

function useElapsed(isAuthed: boolean, isCompleted: boolean) {
  const [seconds, setSeconds] = useState(0)
  
  useEffect(() => {
    if (!isAuthed) {
      setSeconds(0)
      localStorage.removeItem("lb_timer_start")
      localStorage.removeItem("lb_timer_stopped_seconds")
      return
    }

    const savedStopped = localStorage.getItem("lb_timer_stopped_seconds")
    if (savedStopped) {
      setSeconds(Number(savedStopped))
      return
    }

    let start = Number(localStorage.getItem("lb_timer_start"))
    if (!start) {
      start = Date.now()
      localStorage.setItem("lb_timer_start", String(start))
    }

    if (isCompleted) {
      const finalSecs = Math.floor((Date.now() - start) / 1000)
      setSeconds(finalSecs)
      localStorage.setItem("lb_timer_stopped_seconds", String(finalSecs))
      return
    }

    const id = setInterval(() => {
      setSeconds(Math.floor((Date.now() - start) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [isAuthed, isCompleted])

  const hh = String(Math.floor(seconds / 3600)).padStart(2, "0")
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")
  const ss = String(seconds % 60).padStart(2, "0")
  return `${hh}:${mm}:${ss}`
}

export default function PlayPage() {
  const [tab, setTab]           = useState<Tab>("map")
  const [fragmentList, setFragmentList] = useState<Fragment[]>(() => initialFragments)
  const [selected, setSelected] = useState<Fragment | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [isAuthed, setIsAuthed] = useState(false)
  const [nickname, setNickname] = useState(GAME.player)
  const [showMapScanner, setShowMapScanner] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const { theme, setTheme, themeId } = useTheme()
  
  const isCompleted = fragmentList.filter((f) => f.status === "completed").length === GAME.totalFragments
  const elapsed = useElapsed(isAuthed, isCompleted)

  const activeFragment = fragmentList.find((f) => f.status === "active")

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAuthed = localStorage.getItem("lb_isAuthed")
      const savedNickname = localStorage.getItem("lb_nickname")
      const savedFragments = localStorage.getItem("lb_fragments")

      if (savedAuthed === "true") {
        setIsAuthed(true)
      }
      if (savedNickname) {
        setNickname(savedNickname)
      }
      if (savedFragments) {
        try {
          setFragmentList(JSON.parse(savedFragments))
        } catch (e) {
          console.error("Failed to parse saved fragments", e)
        }
      }
    }
  }, [])

  // Sync state to localStorage on changes
  useEffect(() => {
    localStorage.setItem("lb_isAuthed", String(isAuthed))
  }, [isAuthed])

  useEffect(() => {
    localStorage.setItem("lb_nickname", nickname)
  }, [nickname])

  useEffect(() => {
    localStorage.setItem("lb_fragments", JSON.stringify(fragmentList))
  }, [fragmentList])

  function handleDisconnect() {
    setIsAuthed(false)
    setNickname(GAME.player)
    localStorage.removeItem("lb_isAuthed")
    localStorage.removeItem("lb_nickname")
    localStorage.removeItem("lb_fragments")
    localStorage.removeItem("lb_timer_start")
    setFragmentList(initialFragments)
  }

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
              onClick={(e) => {
                if (isAuthed) {
                  e.preventDefault()
                  setShowExitConfirm(true)
                }
              }}
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
              isAuthed={isAuthed}
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
        {tab === "profile"    && (
          <Profile
            nickname={nickname}
            isAuthed={isAuthed}
            onConnect={() => setShowAuth(true)}
            onDisconnect={handleDisconnect}
          />
        )}
      </main>

      {/* Floating Action Button (FAB) for scanning QR codes - only on map tab when a challenge is active */}
      {tab === "map" && activeFragment && (
        <button
          type="button"
          onClick={() => {
            if (!isAuthed) {
              setShowAuth(true)
            } else {
              setShowMapScanner(true)
            }
          }}
          className="absolute bottom-32 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/35 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-400/20"
        >
          <QrCode className="h-6 w-6" />
        </button>
      )}

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

      {showMapScanner && activeFragment && (
        <QrScannerModal
          title={activeFragment.title}
          onScanSuccess={() => {
            handleCompleteFragment(activeFragment.id)
            setShowMapScanner(false)
          }}
          onClose={() => setShowMapScanner(false)}
          isLast={activeFragment.id === fragmentList[fragmentList.length - 1].id}
        />
      )}

      {showExitConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          
          {/* Box */}
          <div className="parchment wood-frame relative z-10 w-full max-w-sm rounded-2xl p-6 text-center shadow-2xl animate-scale-up">
            <h3 className="font-heading text-base font-black uppercase tracking-wider text-primary mb-2">
              Quitter l'expédition ?
            </h3>
            <p className="font-serif text-[11px] italic leading-relaxed text-muted-foreground mb-5">
              Votre progression est sauvegardée dans votre journal d'aventurier. Vous pourrez reprendre votre quête à tout moment.
            </p>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 rounded-full border border-border/40 bg-secondary/15 py-2.5 font-heading text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-secondary/35 active:scale-95 transition-all cursor-pointer"
              >
                Rester
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirm(false)
                  window.location.href = "/"
                }}
                className="flex-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 py-2.5 font-heading text-[10px] font-bold uppercase tracking-wider text-white shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
