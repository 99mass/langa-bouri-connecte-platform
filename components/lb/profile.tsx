"use client"

import { useState, useEffect } from "react"
import { Award, Check, Fingerprint, Lock, MapPin, Stamp, ChevronDown, ChevronUp, Sparkles, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { GAME, achievements, fragments } from "@/lib/game-data"
import MediaRenderer from "@/components/lb/media-renderer"

export function Profile({
  nickname,
  isAuthed = false,
  onConnect,
  onDisconnect,
}: {
  nickname: string
  isAuthed?: boolean
  onConnect?: () => void
  onDisconnect?: () => void
}) {
  const found = fragments.filter((f) => f.status === "completed").length
  const progress = Math.round((found / GAME.totalFragments) * 100)

  const [adConfig, setAdConfig] = useState<any>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("lb_sponsoring_campaigns")
      if (stored) {
        const list = JSON.parse(stored)
        const active = list.find((c: any) => c.isActive)
        if (active && active.profile?.enabled) {
          setAdConfig(active)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  if (!isAuthed) {
    return (
      <div className="mx-auto max-w-md px-4 pb-28 pt-10 flex flex-col items-center justify-center min-h-[60dvh] text-center select-none">
        <div className="parchment wood-frame relative overflow-hidden rounded-xl p-8 flex flex-col items-center w-full shadow-lg">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-wood/40 ring-2 ring-accent/60 text-accent mb-6">
            <Lock className="h-10 w-10" strokeWidth={1.5} />
          </div>

          <h1 className="font-heading text-lg font-black text-primary uppercase tracking-wider mb-2">
            Journal Sécurisé
          </h1>

          <p className="font-serif text-sm italic leading-relaxed text-muted-foreground mb-6">
            Pour sauvegarder vos fragments trouvés, suivre votre classement en temps réel et débloquer vos badges d'expédition, vous devez vous identifier.
          </p>

          <button
            type="button"
            onClick={onConnect}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-wood py-3.5 px-6 font-heading text-xs font-bold uppercase tracking-widest text-accent ring-2 ring-accent/70 transition-all hover:scale-[1.02] active:scale-95 shadow-md cursor-pointer"
          >
            Se connecter
          </button>

          <p className="mt-4 font-serif text-[10px] italic text-muted-foreground/60">
            Gratuit, sécurisé et sans installation.
          </p>
        </div>
      </div>
    )
  }

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
                            {c.solved && c.reward && c.reward !== "Aucune" && c.reward.trim() !== "" ? c.reward : c.place}
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

      {/* Sponsoring Banner */}
      {adConfig && adConfig.profile?.displayMode === 'banner' && (
        <div className="mt-8 mx-auto max-w-sm rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-center relative overflow-hidden shadow-sm">
          <div className="absolute top-[-20px] left-[-20px] w-16 h-16 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />
          <div className="flex items-center justify-center gap-2 mb-2">
            {adConfig.adImage && adConfig.profile.adType !== 'only_video' ? (
              <MediaRenderer src={adConfig.adImage} type="image" className="h-6 w-6 rounded-md object-cover border border-amber-500/10" />
            ) : (
              <div className="h-6 w-6 rounded bg-amber-500/10 flex items-center justify-center text-[8px] font-black text-amber-500">
                {adConfig.profile.adType === 'only_video' ? "🎬" : "AD"}
              </div>
            )}
            <span className="font-heading text-[10px] font-bold text-amber-500 uppercase tracking-widest">
              Sponsor Officiel : {adConfig.sponsorName}
            </span>
          </div>
          
          {adConfig.profile.adType === 'text_banner' ? (
            <p className="font-serif text-[11px] leading-relaxed text-muted-foreground/90">
              {adConfig.adText}
            </p>
          ) : adConfig.profile.adType === 'only_video' && adConfig.adVideo ? (
            <div className="rounded-lg overflow-hidden h-20 bg-black relative mb-2">
              <MediaRenderer src={adConfig.adVideo} type="video" className="w-full h-full object-cover" />
            </div>
          ) : adConfig.adImage ? (
            <MediaRenderer src={adConfig.adImage} type="image" className="w-full h-20 object-cover rounded-lg mb-2" />
          ) : null}

          {adConfig.targetUrl && (
            <a
              href={adConfig.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-500 hover:text-amber-600 transition-colors cursor-pointer"
            >
              Visiter le sponsor <Award className="h-3 w-3" />
            </a>
          )}
        </div>
      )}

      {/* Sponsoring Overlay: Full Screen Mode on Profile */}
      {adConfig && adConfig.profile?.displayMode === 'fullscreen' && (
        <div className="fixed inset-0 z-50 bg-[#0e0c0b]/98 backdrop-blur-md flex flex-col justify-between p-6 pt-12 animate-fade-in select-none text-left">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.03] via-transparent to-transparent pointer-events-none" />
          
          {/* Close button */}
          <div className="flex justify-end relative z-10">
            <button
              type="button"
              onClick={() => {
                setAdConfig(null)
              }}
              className="text-xs font-black uppercase tracking-widest text-black bg-amber-400 border border-amber-400 px-5 py-2.5 rounded-full shadow-lg shadow-amber-400/20 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Fermer l'annonce ×
            </button>
          </div>

          {/* Ad Body */}
          <div className="flex-1 flex flex-col items-center justify-center my-6 relative z-10 max-w-lg mx-auto w-full">
            {adConfig.profile.adType === 'only_image' && adConfig.adImage ? (
              <MediaRenderer
                src={adConfig.adImage}
                type="image"
                className="w-full max-h-[70vh] object-contain rounded-2xl shadow-[0_20px_50px_rgba(251,191,36,0.12)] border border-white/10"
              />
            ) : adConfig.profile.adType === 'only_video' && adConfig.adVideo ? (
              <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black/80 relative border border-white/10 shadow-[0_20px_50px_rgba(251,191,36,0.12)]">
                <MediaRenderer src={adConfig.adVideo} type="video" className="w-full h-full object-cover" />
                <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-[8px] font-bold text-white uppercase tracking-widest px-2 py-0.5 rounded">
                  Vidéo Sponsor
                </span>
              </div>
            ) : (
              <div className="bg-[#1c1816]/95 border border-amber-500/25 rounded-3xl p-6 text-center space-y-4 shadow-2xl w-full max-w-md backdrop-blur-sm">
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

          {/* CTA Footer */}
          {adConfig.targetUrl && (
            <div className="relative z-10 w-full max-w-sm mx-auto pt-4 border-t border-white/10">
              <a
                href={adConfig.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black py-4 rounded-2xl font-heading text-xs font-black uppercase tracking-widest shadow-xl shadow-amber-500/15 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                Découvrir l'offre <Award className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      )}

      {/* Disconnect Button */}
      {onDisconnect && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={onDisconnect}
            className="flex items-center gap-2 rounded-full border border-border/40 bg-secondary/10 px-6 py-2.5 font-sans text-xs font-semibold text-muted-foreground hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-all active:scale-95 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Se déconnecter
          </button>
        </div>
      )}
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
