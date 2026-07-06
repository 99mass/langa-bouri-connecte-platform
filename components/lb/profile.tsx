"use client"

import { useState } from "react"
import { Award, Check, Fingerprint, Lock, MapPin, Stamp, ChevronDown, ChevronUp, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { GAME, achievements, fragments } from "@/lib/game-data"

export function Profile({ nickname }: { nickname: string }) {
  const found = fragments.filter((f) => f.status === "completed").length
  const progress = Math.round((found / GAME.totalFragments) * 100)

  // Expand/collapse state for event cards
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({
    ndiadiane: true,
    ndar: false,
    saloum: false,
  })

  const toggleEvent = (id: string) => {
    setExpandedEvents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Dynamic active event details mapped from the actual game state
  const activeEvent = {
    id: "ndiadiane",
    title: "L'Héritage de Ndiadiane",
    date: "En cours",
    isCurrent: true,
    total: GAME.totalFragments,
    solvedCount: found,
    challenges: fragments.map((f) => ({
      name: f.title,
      solved: f.status === "completed",
      place: f.place,
      reward: f.reward,
      isActive: f.status === "active",
      isLocked: f.status === "locked",
      index: f.index,
    })),
  }

  // Static completed events for player history
  const pastEvents = [
    {
      id: "ndar",
      title: "Le Trésor de Ndar",
      date: "Juin 2026",
      isCurrent: false,
      total: 4,
      solvedCount: 4,
      challenges: [
        { name: "Le Pont Faidherbe", solved: true, place: "Fleuve Sénégal", reward: "Pièce coloniale en argent", index: "1/4" },
        { name: "La Pirogue Bleue", solved: true, place: "Quai des Pêcheurs", reward: "Filet tressé porte-bonheur", index: "2/4" },
        { name: "La Maison des Archives", solved: true, place: "Quartier Sud", reward: "Lettre scellée de 1845", index: "3/4" },
        { name: "Le Signal du Phare", solved: true, place: "Phare de Gandiole", reward: "Lentille de verre taillé", index: "4/4" },
      ],
    },
    {
      id: "saloum",
      title: "Les Secrets du Sine Saloum",
      date: "Mai 2026",
      isCurrent: false,
      total: 3,
      solvedCount: 3,
      challenges: [
        { name: "L'Île aux Coquillages", solved: true, place: "Fadiouth", reward: "Collier de perles sauvages", index: "1/3" },
        { name: "Le Repaire des Pêcheurs", solved: true, place: "Djiffer", reward: "Hameçon d'or ancien", index: "2/3" },
        { name: "Le Secret des Palétuviers", solved: true, place: "Maringouins", reward: "Fiole de sève purifiée", index: "3/3" },
      ],
    },
  ]

  const allEvents = [activeEvent, ...pastEvents]

  return (
    <div className="mx-auto max-w-md px-4 pb-28 pt-4">
      <header className="mb-5 text-center">
        <h1 className="ink-title font-heading text-2xl font-black text-primary">
          Journal de l'Aventurier
        </h1>
      </header>

      {/* Passport card */}
      <section className="parchment wood-frame relative overflow-hidden rounded-xl p-5">
        <span className="absolute right-4 top-4 flex h-16 w-16 rotate-12 items-center justify-center rounded-full border-2 border-dashed border-ember/70 font-heading text-[9px] uppercase leading-tight tracking-widest text-ember/80">
          Passeport
          <br />
          Officiel
        </span>

        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-wood text-accent ring-2 ring-accent/70">
            <Fingerprint className="h-10 w-10" strokeWidth={1.25} />
          </div>
          <div className="min-w-0">
            <p className="font-heading text-[10px] uppercase tracking-widest text-muted-foreground">
              Aventurier
            </p>
            <p className="truncate font-heading text-xl font-bold text-primary">
              {nickname}
            </p>
            <p className="flex items-center gap-1 font-serif text-sm italic text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> Expédition du Sénégal
            </p>
          </div>
        </div>

        <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="grid grid-cols-3 gap-3 text-center">
          <Stat label="Fragments" value={`${found}/${GAME.totalFragments}`} />
          <Stat label="Progression" value={`${progress}%`} />
          <Stat label="Rang" value="#12" />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Stamp className="h-4 w-4 text-ember" />
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted ring-1 ring-border/60">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </section>

      {/* Participated Events & Solved Challenges */}
      <section className="mt-6">
        <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-widest text-primary">
          Expéditions & Chasses
        </h2>
        <div className="flex flex-col gap-3">
          {allEvents.map((evt) => {
            const isExpanded = !!expandedEvents[evt.id]
            return (
              <div key={evt.id} className="parchment gold-frame rounded-xl overflow-hidden transition-all duration-200">
                {/* Event header - clickable */}
                <button
                  type="button"
                  onClick={() => toggleEvent(evt.id)}
                  className="flex items-center justify-between w-full px-4 py-3 bg-secondary/25 hover:bg-secondary/45 active:bg-secondary/60 text-left border-b border-border/10 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                        evt.isCurrent 
                          ? "bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20"
                      )}>
                        {evt.isCurrent ? "En Cours" : "Terminé"}
                      </span>
                      <span className="font-serif text-[10px] italic text-muted-foreground">{evt.date}</span>
                    </div>
                    <h3 className="font-heading text-sm font-bold text-primary mt-1 truncate">
                      {evt.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2.5 ml-3">
                    <span className="font-heading text-xs font-bold text-primary">
                      {evt.solvedCount}/{evt.total}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Challenges list */}
                {isExpanded && (
                  <ul className="flex flex-col divide-y divide-border/20 px-3 py-1 bg-transparent">
                    {evt.challenges.map((c, idx) => (
                      <li key={idx} className="flex items-center gap-3 py-2.5 animate-fade-in">
                        {/* Status Icon badge */}
                        {c.solved ? (
                          <span className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20">
                            <Check className="h-3.5 w-3.5" strokeWidth={3} />
                          </span>
                        ) : c.isActive ? (
                          <span className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20 animate-pulse">
                            <Sparkles className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                          </span>
                        ) : (
                          <span className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-border">
                            <Lock className="h-3 w-3" strokeWidth={2.5} />
                          </span>
                        )}

                        {/* Title and details */}
                        <div className="min-w-0 flex-1">
                          <p className={cn(
                            "font-heading text-xs font-bold truncate",
                            c.solved ? "text-primary" : c.isActive ? "text-amber-600" : "text-muted-foreground"
                          )}>
                            {c.name}
                          </p>
                          <p className="font-serif text-[10px] italic text-muted-foreground truncate">
                            {c.solved ? c.reward : c.place}
                          </p>
                        </div>

                        {/* Index */}
                        <span className="font-heading text-[10px] font-semibold text-muted-foreground whitespace-nowrap ml-2">
                          {c.index}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Achievements */}
      <section className="mt-6">
        <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-widest text-primary">
          Trophées
        </h2>
        <ul className="grid grid-cols-2 gap-2">
          {achievements.map((a) => (
            <li
              key={a.title}
              className={cn(
                "gold-frame flex flex-col gap-1 rounded-lg p-3",
                a.unlocked ? "parchment" : "bg-muted/60 opacity-70",
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full ring-1",
                  a.unlocked
                    ? "bg-wood text-accent ring-accent/50"
                    : "bg-muted text-muted-foreground ring-border",
                )}
              >
                {a.unlocked ? (
                  <Award className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
              </span>
              <p className="font-heading text-sm font-bold leading-tight text-primary">
                {a.title}
              </p>
              <p className="font-serif text-xs italic leading-snug text-muted-foreground">
                {a.description}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-secondary/60 py-2 ring-1 ring-border/50">
      <p className="font-heading text-lg font-bold text-primary tabular-nums">
        {value}
      </p>
      <p className="font-heading text-[9px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
    </div>
  )
}
