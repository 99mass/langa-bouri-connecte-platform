"use client"

import { Award, Check, Fingerprint, Lock, MapPin, Stamp } from "lucide-react"
import { cn } from "@/lib/utils"
import { GAME, achievements, fragments } from "@/lib/game-data"

export function Profile({ nickname }: { nickname: string }) {
  const found = fragments.filter((f) => f.status === "completed").length
  const progress = Math.round((found / GAME.totalFragments) * 100)

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

      {/* Completed challenges */}
      <section className="mt-6">
        <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-widest text-primary">
          Défis complétés
        </h2>
        <ul className="flex flex-col gap-2">
          {fragments
            .filter((f) => f.status === "completed")
            .map((f) => (
              <li
                key={f.id}
                className="parchment gold-frame flex items-center gap-3 rounded-lg px-4 py-2.5"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-wood text-accent ring-1 ring-accent/50">
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-heading text-sm font-bold text-primary">
                    {f.title}
                  </p>
                  <p className="truncate font-serif text-xs italic text-muted-foreground">
                    {f.reward}
                  </p>
                </div>
                <span className="font-heading text-xs font-bold text-muted-foreground">
                  {f.index}
                </span>
              </li>
            ))}
        </ul>
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
