"use client"

import { useEffect, useState } from "react"
import {
  Eye,
  Gift,
  Image as ImageIcon,
  KeyRound,
  Play,
  QrCode,
  Volume2,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Fragment } from "@/lib/game-data"
import { QrScannerModal } from "./qr-scanner-modal"

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
  onComplete,
}: {
  fragment: Fragment
  isAuthed: boolean
  onClose: () => void
  onRequireAuth: () => void
  onComplete: (id: number) => void
}) {
  const [revealed, setRevealed] = useState(fragment.status === "completed")
  const [showScanner, setShowScanner] = useState(false)
  const Media = mediaMeta[fragment.media].icon

  const isActive = fragment.status === "active"
  const isCompleted = fragment.status === "completed"

  // Automatically reveal the clue if the user successfully connects
  useEffect(() => {
    if (isAuthed) {
      setRevealed(true)
    }
  }, [isAuthed])

  function handleReveal() {
    if (!isAuthed) {
      onRequireAuth()
      return
    }
    setRevealed(true)
  }

  function handleOpenScanner() {
    if (!isAuthed) {
      onRequireAuth()
      return
    }
    setShowScanner(true)
  }

  function handleScanSuccess() {
    setShowScanner(false)
    onComplete(fragment.id)
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        <button
          type="button"
          aria-label="Fermer le défi"
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        />

        <div className="animate-unfurl relative z-10 flex max-h-[92dvh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-background border-t border-border shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 px-5 pt-5">
            <div>
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                Fragment {fragment.index}
              </span>
              <h2 className="mt-1 font-heading text-xl font-bold leading-tight text-primary">
                {fragment.title}
              </h2>
              <p className="font-sans text-xs text-muted-foreground">
                {fragment.place}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80 hover:text-primary transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 flex-1 overflow-y-auto px-5 pb-5">
            {/* Media section */}
            <div className="relative overflow-hidden rounded-2xl border border-border">
              <img
                src="/images/clue-artifact.png"
                alt={`Indice illustré pour ${fragment.title}`}
                className="h-44 w-full object-cover"
              />
              <span className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-wider text-white">
                <Media className="h-3.5 w-3.5" />
                {mediaMeta[fragment.media].label}
              </span>
            </div>

            {/* Story */}
            <section className="mt-5">
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-primary">
                Le récit
              </h3>
              <p className="mt-1.5 text-pretty font-sans text-sm leading-relaxed text-muted-foreground">
                {fragment.story}
              </p>
            </section>

            {/* Clue */}
            <section className="mt-5">
              <h3 className="flex items-center gap-1.5 font-sans text-xs font-bold uppercase tracking-wider text-primary">
                <KeyRound className="h-3.5 w-3.5" />
                L'énigme
              </h3>
              <div
                className={cn(
                  "relative mt-1.5 overflow-hidden rounded-2xl border border-dashed border-border bg-muted/40 p-4 transition-all",
                  isActive && !revealed && "min-h-[72px]"
                )}
              >
                <p
                  className={cn(
                    "text-pretty font-sans text-sm leading-relaxed text-primary transition-all",
                    !revealed && "select-none blur-[6px]",
                  )}
                >
                  {fragment.clue}
                </p>
                {!revealed && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={handleReveal}
                      className="rounded-full bg-primary px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-sm transition-transform hover:scale-105 active:scale-95"
                    >
                      Révéler l'énigme
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Reward */}
            {fragment.reward && fragment.reward !== "Aucune" && fragment.reward.trim() !== "" && (
              <div className="mt-5 flex items-center gap-3 rounded-2xl bg-muted/50 px-4 py-3 ring-1 ring-border/40">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10">
                  <Gift className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Récompense
                  </p>
                  <p className="font-sans text-xs font-bold text-primary">
                    {fragment.reward}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="border-t border-border/60 bg-muted/20 p-4">
            {isCompleted ? (
              <div className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500/10 py-3.5 font-sans text-xs font-bold uppercase tracking-wider text-emerald-600">
                Défi complété avec succès !
              </div>
            ) : isActive && revealed ? (
              <div className="flex flex-col items-center gap-1.5 text-center py-2 px-4">
                <span className="font-heading text-xs font-bold text-amber-600 uppercase tracking-wide">Défi Actif</span>
                <p className="font-serif text-[11px] italic text-muted-foreground flex items-center justify-center gap-1">
                  Utilisez le scanner <QrCode className="h-3 w-3 inline text-accent" /> en bas à droite de la carte pour valider.
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleReveal}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 font-sans text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-md transition-transform hover:scale-[1.01] active:scale-[0.98]"
              >
                <Eye className="h-4 w-4" />
                Révéler le défi
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
