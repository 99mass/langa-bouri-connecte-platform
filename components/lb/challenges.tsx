"use client"

import { useState } from "react"
import {
  CalendarDays,
  Check,
  ChevronRight,
  Gauge,
  Gift,
  Lock,
  MapPin,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { fragments, upcomingEvents, type Fragment } from "@/lib/game-data"

const statusMeta: Record<
  Fragment["status"],
  { label: string; className: string }
> = {
  completed: { label: "Terminé", className: "bg-wood text-accent" },
  active: { label: "Actif", className: "bg-ember text-background" },
  locked: { label: "Verrouillé", className: "bg-muted text-muted-foreground" },
}

const difficultyMeta = {
  Facile: "text-quest",
  Intermédiaire: "text-accent",
  Expert: "text-ember",
} as const

export function Challenges({ onSelect }: { onSelect: (f: Fragment) => void }) {
  const [tab, setTab] = useState<"current" | "upcoming">("current")

  return (
    <div className="mx-auto max-w-md px-4 pb-28 pt-4">
      <header className="mb-4 text-center">
        <h1 className="ink-title font-heading text-2xl font-black text-primary">
          Le Registre des Défis
        </h1>
      </header>

      {/* Segmented control */}
      <div className="parchment gold-frame mb-5 flex rounded-full p-1">
        {(
          [
            ["current", "Quête actuelle"],
            ["upcoming", "À venir"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "flex-1 rounded-full py-2 font-heading text-xs font-bold uppercase tracking-wider transition-colors",
              tab === id
                ? "bg-wood text-accent ring-1 ring-accent/60"
                : "text-muted-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "current" ? (
        <ul className="flex flex-col gap-3">
          {fragments.map((f) => {
            const meta = statusMeta[f.status]
            const isLocked = f.status === "locked"
            return (
              <li key={f.id}>
                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => onSelect(f)}
                  className={cn(
                    "parchment wood-frame flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-transform",
                    isLocked ? "opacity-70" : "hover:scale-[1.01] active:scale-[0.99]",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 ring-accent/50",
                      f.status === "completed" && "bg-wood text-accent",
                      f.status === "active" &&
                        "animate-quest-pulse bg-accent text-accent-foreground",
                      isLocked && "bg-muted text-muted-foreground ring-border",
                    )}
                  >
                    {f.status === "completed" ? (
                      <Check className="h-5 w-5" strokeWidth={2.5} />
                    ) : isLocked ? (
                      <Lock className="h-5 w-5" />
                    ) : (
                      <Sparkles className="h-5 w-5" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-xs font-bold text-muted-foreground">
                        {f.index}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 font-heading text-[9px] uppercase tracking-widest",
                          meta.className,
                        )}
                      >
                        {meta.label}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate font-heading text-base font-bold text-primary">
                      {f.title}
                    </p>
                    <p className="flex items-center gap-1 truncate font-serif text-xs italic text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" /> {f.place}
                    </p>
                  </div>
                  {!isLocked && (
                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      ) : (
        <ul className="flex flex-col gap-4">
          {upcomingEvents.map((e) => (
            <li
              key={e.id}
              className="parchment wood-frame animate-unfurl overflow-hidden rounded-xl"
            >
              <div className="vignette relative h-36">
                <img
                  src={e.cover || "/placeholder.svg"}
                  alt={e.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-wood/90 px-3 py-1 font-heading text-[10px] uppercase tracking-widest text-accent">
                  <Gauge className="h-3 w-3" />
                  <span className={difficultyMeta[e.difficulty]}>{e.difficulty}</span>
                </span>
              </div>
              <div className="p-4">
                <h2 className="font-heading text-lg font-bold text-primary">
                  {e.title}
                </h2>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-serif text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {e.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" /> {e.date}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-secondary/70 px-3 py-2 ring-1 ring-border/50">
                  <Gift className="h-4 w-4 text-ember" />
                  <span className="font-serif text-sm font-semibold text-primary">
                    {e.reward}
                  </span>
                </div>
                <button
                  type="button"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-wood/40 bg-card/60 py-2.5 font-heading text-xs font-bold uppercase tracking-widest text-primary transition-colors hover:bg-card"
                >
                  M'inscrire à l'expédition
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
