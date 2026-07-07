"use client"

import { useState, useEffect } from "react"
import {
  CalendarDays,
  Gift,
  MapPin,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { upcomingEventsByTheme, type Fragment } from "@/lib/game-data"
import { useTheme } from "@/lib/theme-context"

export function Challenges({
  onSelect,
}: {
  fragments: Fragment[]
  onSelect: (f: Fragment) => void
}) {
  const { theme } = useTheme()
  const [competitionsList, setCompetitionsList] = useState<any[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem("lb_competitions")
      if (stored) {
        setCompetitionsList(JSON.parse(stored))
      } else {
        import('@/lib/admin-data').then(({ competitions }) => {
          setCompetitionsList(competitions)
        })
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  const dbEvents = competitionsList.filter((c) => c.themeId === theme.id && (c.status === 'active' || c.status === 'brouillon'))
  const staticEvents = upcomingEventsByTheme[theme.id] || upcomingEventsByTheme.culture || []
  const uniqueStaticEvents = staticEvents.filter(se => !dbEvents.some(de => de.title.toLowerCase() === se.title.toLowerCase()))
  const events = [...dbEvents, ...uniqueStaticEvents]

  return (
    <div className="mx-auto max-w-md px-4 pb-28 pt-4">
      <header className="mb-6 text-center">
        <h1 className="font-heading text-2xl font-bold text-primary">
          Événements à Venir
        </h1>
        <p className="font-sans text-xs text-muted-foreground mt-1">
          Découvrez et inscrivez-vous aux prochaines chasses au trésor connectées
        </p>
      </header>

      {/* Render upcoming events list directly based on active theme */}
      <ul className="flex flex-col gap-4">
        {events.map((e) => (
          <li
            key={e.id}
            className="modern-card overflow-hidden rounded-2xl animate-unfurl"
          >
            <div className="relative h-36">
              <img
                src={e.cover || "/placeholder.svg"}
                alt={e.title}
                className="h-full w-full object-cover"
              />
              {e.sponsorName && (
                <span className="absolute top-3 right-3 rounded-full bg-black/75 border border-amber-500/30 px-3 py-1 font-heading text-[8px] font-bold text-amber-400 uppercase tracking-widest backdrop-blur-sm shadow-md">
                  Sponsor : {e.sponsorName}
                </span>
              )}
            </div>
            <div className="p-4 bg-card/50">
              <h2 className="font-heading text-lg font-bold text-primary">
                {e.title}
              </h2>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground/60" /> {e.location}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5 text-muted-foreground/60" /> {e.date}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2 ring-1 ring-border/40">
                <Gift className="h-4 w-4 text-accent" />
                <span className="font-sans text-xs font-semibold text-primary">
                  {e.reward}
                </span>
              </div>
              <button
                type="button"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-sm transition-all hover:bg-primary/95 active:scale-[0.99]"
              >
                M'inscrire à l'expédition
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
