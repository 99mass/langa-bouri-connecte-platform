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
import { GAME, fragments, type Fragment } from "@/lib/game-data"

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
  const [selected, setSelected] = useState<Fragment | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [isAuthed, setIsAuthed] = useState(false)
  const [nickname, setNickname] = useState(GAME.player)
  const elapsed = useElapsed()
  const { theme } = useTheme()

  const titles: Record<Tab, string> = {
    map:        "Carte",
    challenges: "Défis",
    ranking:    "Classement",
    profile:    "Profil",
  }

  return (
    <div className="relative mx-auto flex min-h-dvh max-w-md flex-col bg-background text-foreground">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-1">
        <Link
          href="/"
          className="flex items-center gap-1 font-sans text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Accueil
        </Link>

        <span className="font-heading text-xs font-bold uppercase tracking-[0.15em] text-primary truncate max-w-[140px]">
          {titles[tab]}
        </span>

        {/* Domain badge — read-only, controlled from landing page */}
        <div
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1 ring-1"
          style={{
            background: "color-mix(in oklch, var(--accent) 8%, var(--card))",
            borderColor: "color-mix(in oklch, var(--accent) 25%, var(--border))",
          }}
        >
          <ThemeIcon iconName={theme.iconName} className="h-3.5 w-3.5 text-accent" strokeWidth={1.75} />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider text-accent">
            {theme.label.split(" ")[0]}
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="flex-1">
        {tab === "map" && (
          <div className="h-[calc(100dvh-3.5rem)]">
            <MapDashboard
              fragments={fragments}
              nickname={nickname}
              elapsed={elapsed}
              onSelect={setSelected}
            />
          </div>
        )}
        {tab === "challenges" && <Challenges onSelect={setSelected} />}
        {tab === "ranking"    && <Ranking />}
        {tab === "profile"    && <Profile nickname={nickname} />}
      </main>

      <BottomNav active={tab} onChange={setTab} />

      {selected && (
        <ChallengeDetail
          fragment={selected}
          isAuthed={isAuthed}
          onClose={() => setSelected(null)}
          onRequireAuth={() => setShowAuth(true)}
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
