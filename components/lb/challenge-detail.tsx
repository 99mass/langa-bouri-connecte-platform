"use client"

import { useState } from "react"
import {
  Eye,
  Gift,
  Image as ImageIcon,
  KeyRound,
  Play,
  Volume2,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Fragment } from "@/lib/game-data"

const mediaMeta = {
  image: { icon: ImageIcon, label: "Parchemin illustré" },
  audio: { icon: Volume2, label: "Enregistrement du griot" },
  video: { icon: Play, label: "Séquence filmée" },
} as const

export function ChallengeDetail({
  fragment,
  isAuthed,
  onClose,
  onRequireAuth,
}: {
  fragment: Fragment
  isAuthed: boolean
  onClose: () => void
  onRequireAuth: () => void
}) {
  const [revealed, setRevealed] = useState(false)
  const Media = mediaMeta[fragment.media].icon

  function handleReveal() {
    if (!isAuthed) {
      onRequireAuth()
      return
    }
    setRevealed(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="Fermer le défi"
        onClick={onClose}
        className="absolute inset-0 bg-wood/60 backdrop-blur-[2px]"
      />

      <div className="animate-unfurl parchment wood-frame relative z-10 flex max-h-[92dvh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl">
        <div className="flex items-start justify-between gap-3 px-5 pt-5">
          <div>
            <span className="font-heading text-[11px] uppercase tracking-[0.25em] text-ember">
              Fragment {fragment.index}
            </span>
            <h2 className="mt-1 font-heading text-2xl font-bold leading-tight text-primary">
              {fragment.title}
            </h2>
            <p className="font-serif text-sm italic text-muted-foreground">
              {fragment.place}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-wood text-accent ring-1 ring-accent/60"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto px-5 pb-5">
          {/* Media section */}
          <div className="gold-frame relative overflow-hidden rounded-xl">
            <img
              src="/images/clue-artifact.png"
              alt={`Indice illustré pour ${fragment.title}`}
              className="h-44 w-full object-cover"
            />
            <span className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-wood/90 px-3 py-1 font-heading text-[10px] uppercase tracking-widest text-accent">
              <Media className="h-3.5 w-3.5" />
              {mediaMeta[fragment.media].label}
            </span>
          </div>

          {/* Story */}
          <section className="mt-5">
            <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-primary">
              Le récit
            </h3>
            <p className="mt-1.5 text-pretty font-serif text-base leading-relaxed text-foreground/85">
              {fragment.story}
            </p>
          </section>

          {/* Clue */}
          <section className="mt-5">
            <h3 className="flex items-center gap-1.5 font-heading text-xs font-bold uppercase tracking-widest text-primary">
              <KeyRound className="h-3.5 w-3.5" />
              L'énigme
            </h3>
            <div
              className={cn(
                "relative mt-1.5 overflow-hidden rounded-lg border border-dashed border-wood/50 bg-background/60 p-4",
              )}
            >
              <p
                className={cn(
                  "text-pretty font-serif text-base italic leading-relaxed text-foreground/90 transition-all",
                  !revealed && "select-none blur-[6px]",
                )}
              >
                {fragment.clue}
              </p>
              {!revealed && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="rounded-full bg-wood/85 px-3 py-1 font-heading text-[10px] uppercase tracking-widest text-accent">
                    Indice scellé
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Reward */}
          <div className="mt-5 flex items-center gap-3 rounded-lg bg-secondary/70 px-4 py-3 ring-1 ring-border/60">
            <Gift className="h-5 w-5 text-ember" />
            <div>
              <p className="font-heading text-[10px] uppercase tracking-widest text-muted-foreground">
                Récompense
              </p>
              <p className="font-serif text-sm font-semibold text-primary">
                {fragment.reward}
              </p>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="border-t border-border/60 bg-card/70 p-4">
          <button
            type="button"
            onClick={handleReveal}
            disabled={revealed}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-heading text-sm font-bold uppercase tracking-widest transition-transform active:scale-[0.98]",
              revealed
                ? "bg-quest text-background"
                : "bg-wood text-accent ring-2 ring-accent/70 hover:scale-[1.01]",
            )}
          >
            <Eye className="h-4 w-4" />
            {revealed ? "Indice révélé — bonne chasse !" : "Révéler l'indice"}
          </button>
        </div>
      </div>
    </div>
  )
}
