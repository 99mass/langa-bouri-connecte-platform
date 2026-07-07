"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import {
  ArrowRight,
  ChevronDown,
  Clock,
  Coins,
  Compass,
  Landmark,
  Map as MapIcon,
  QrCode,
  ScrollText,
  Sparkles,
  Trophy,
  TreePine,
  Scroll,
  Atom,
  UtensilsCrossed,
  Users,
  Zap,
  Play,
  CalendarDays,
  Timer,
  Globe,
  Handshake,
  Megaphone,
  Check,
  Lock,
  Gift,
  MapPin,
  type LucideProps,
} from "lucide-react"
import { Seal } from "@/components/lb/seal"
import { Countdown } from "@/components/lb/countdown"
import { ContactModal } from "@/components/lb/contact-modal"
import { GAME, upcomingEventsByTheme } from "@/lib/game-data"
import { THEMES } from "@/lib/theme-config"
import { useTheme } from "@/lib/theme-context"
import { cn } from "@/lib/utils"

/* ── Domain icon map ── */
const domainIcons: Record<string, React.ComponentType<LucideProps>> = {
  culture: Landmark, sport: Trophy, nature: TreePine,
  histoire: Scroll, science: Atom, gastronomie: UtensilsCrossed,
}
const domainEntries = Object.entries(domainIcons)

/* ── Fade-up hook ── */
function useFadeUp() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add("visible") },
      { threshold: 0.08 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

/* ── Data ── */
const steps = [
  { n: "01", icon: QrCode,  title: "Scanne le QR code",     body: "Trouve le premier QR code dissimulé sur le terrain. Chaque scan ouvre une page unique sur la plateforme." },
  { n: "02", icon: Zap,     title: "Déchiffre l'indice",    body: "Texte, image, audio, vidéo — chaque indice est taillé sur mesure pour le domaine de la campagne." },
  { n: "03", icon: MapIcon,  title: "Trouve le suivant",    body: "L'indice résolu te guide vers le prochain QR code. Avance sur la carte, point par point." },
  { n: "04", icon: Trophy,  title: "Remporte le trésor",    body: "Termine la chaîne, grimpe au classement et décroche ta récompense." },
]

const rewards = [
  { icon: Coins,      title: "Cauris d'Or",       desc: "La monnaie ancestrale des grands explorateurs.",   grad: "from-amber-500 to-yellow-600" },
  { icon: ScrollText, title: "Carte Originelle",   desc: "Un fragment authentique de la grande carte.",      grad: "from-stone-500 to-amber-600" },
  { icon: Trophy,     title: "Titre de Légende",   desc: "Votre nom gravé pour toujours au Panthéon.",      grad: "from-amber-600 to-orange-500" },
]

const domains = Object.values(THEMES).map((t) => ({
  id: t.id, label: t.label, description: t.description,
  keywords: t.decorKeywords, accent: t.cssVars["--accent"],
}))

const formats = [
  { icon: Timer,        title: "Édition Flash",     duration: "1 journée",  codes: "5 – 8 QR codes",   diff: "Intermédiaire",  color: "text-amber-500" },
  { icon: CalendarDays, title: "Édition Week-end",  duration: "2 jours",    codes: "10 – 15 QR codes", diff: "Élevée",         color: "text-emerald-500" },
  { icon: Globe,        title: "Édition Nationale",  duration: "1 mois",    codes: "20 – 40 QR codes", diff: "Expert",         color: "text-blue-500" },
]

const partners = [
  { icon: Landmark,  title: "Institutionnels", desc: "Ministère de la Culture, Mairies, ASPT — légitimité et accès." },
  { icon: Zap,       title: "Techniques",      desc: "Opérateurs télécoms, Fintechs — connectivité et paiement." },
  { icon: Handshake, title: "Commerciaux",     desc: "Marques, sponsors — visibilité et lots pour les gagnants." },
]

const faqs = [
  { q: "C'est quoi Langa Bouri Connecté ?", a: "L'adaptation numérique du jeu de cache-cache traditionnel sénégalais. Des QR codes sont dissimulés sur le terrain, chacun délivrant un indice vers le suivant. Le joueur doit résoudre toute la chaîne pour accomplir la mission finale." },
  { q: "Faut-il être physiquement sur place ?", a: "Les campagnes peuvent être 100 % terrain (QR codes physiques), 100 % en ligne (énigmes numériques) ou hybrides. L'organisateur choisit le format lors de la configuration." },
  { q: "Quels domaines sont disponibles ?", a: "Culture & Patrimoine, Sport & Performance, Nature & Aventure, Histoire & Civilisations, Science & Technologie, Gastronomie & Saveurs — et de nouveaux thèmes arrivent régulièrement." },
  { q: "Comment sont déverrouillés les indices ?", a: "Chaque scan valide automatiquement l'étape et débloque l'indice suivant. En mode anonyme, le joueur doit répondre à une question de vérification anti-triche." },
  { q: "Combien coûte l'organisation d'un événement ?", a: "Le tarif varie selon le format (Flash, Week-end, National), le nombre de QR codes et la complexité des indices. Contactez-nous pour un devis personnalisé." },
  { q: "Comment devenir partenaire ou sponsor ?", a: "Cliquez sur le bouton « Nous contacter » et sélectionnez « Devenir partenaire / sponsor ». Notre équipe vous recontactera sous 24 heures." },
]

const stats = [
  { n: "6+", label: "Domaines" },
  { n: "248", label: "Aventuriers" },
  { n: "12", label: "Campagnes" },
  { n: "98%", label: "Satisfaction" },
]

/* ── Social SVG icons ── */
function SocialFacebook(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
}
function SocialInstagram(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
}
function SocialX(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
}
function SocialTikTok(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.64a8.3 8.3 0 0 0 4.73 1.47V6.69z"/></svg>
}
function SocialLinkedIn(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
}
function SocialWhatsApp(p: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
}

const socials = [
  { name: "Facebook",  icon: SocialFacebook,  href: "https://facebook.com/langabouri" },
  { name: "Instagram", icon: SocialInstagram,  href: "https://instagram.com/langabouri" },
  { name: "TikTok",    icon: SocialTikTok,     href: "https://tiktok.com/@langabouri" },
  { name: "X",         icon: SocialX,          href: "https://x.com/langabouri" },
  { name: "LinkedIn",  icon: SocialLinkedIn,    href: "https://linkedin.com/company/langabouri" },
  { name: "WhatsApp",  icon: SocialWhatsApp,    href: "https://wa.me/221771234567" },
]

/* ════════════════════════════════════════
   SUB-COMPONENTS
   ════════════════════════════════════════ */

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="modern-card overflow-hidden !rounded-2xl">
      <button type="button" onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-muted/40"
        aria-expanded={open}>
        <span className="font-sans text-sm font-semibold text-primary leading-snug lg:text-base">{q}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300", open && "rotate-180")} />
      </button>
      <div className={cn("grid transition-all duration-300 ease-in-out", open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
        <div className="overflow-hidden">
          <p className="px-6 pb-5 font-sans text-sm text-muted-foreground leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  )
}

function Section({ children, className, id, dark }: { children: React.ReactNode; className?: string; id?: string; dark?: boolean }) {
  const ref = useFadeUp()
  return (
    <section id={id} ref={ref as React.RefObject<HTMLElement>} className={cn("fade-up", dark && "bg-[#131110] text-white", className)}>
      <div className="mx-auto max-w-7xl px-4 lg:px-6">{children}</div>
    </section>
  )
}

function SectionHeader({ tag, title, sub, dark }: { tag: string; title: string; sub?: string; dark?: boolean }) {
  return (
    <div className="mb-10 text-center lg:mb-14">
      <span className={cn("inline-block rounded-full px-4 py-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] mb-4",
        dark ? "bg-white/10 text-amber-300/80" : "bg-accent/10 text-accent"
      )}>{tag}</span>
      <h2 className={cn("font-heading text-2xl font-bold sm:text-3xl lg:text-4xl", dark ? "text-white" : "text-primary")}>{title}</h2>
      {sub && <p className={cn("mx-auto mt-3 max-w-2xl font-sans text-sm sm:text-base leading-relaxed", dark ? "text-white/50" : "text-muted-foreground")}>{sub}</p>}
    </div>
  )
}

/* ════════════════════════════════════════
   WATCH-DIAL ROTATING WHEEL
   ════════════════════════════════════════ */
function WatchWheel() {
  const [mounted, setMounted] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const DOMAIN_DURATION = 3000
  const TOTAL_DURATION = DOMAIN_DURATION * 6

  useEffect(() => {
    setMounted(true)
    const iv = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % 6)
    }, DOMAIN_DURATION)
    return () => clearInterval(iv)
  }, [])

  const activeKey = domainEntries[activeIdx][0] as keyof typeof THEMES
  const activeTheme = THEMES[activeKey]

  const SIZE = 420
  const C = SIZE / 2
  const ORBIT_R = 155
  const HAND_START = 48          // gap for center compass
  const HAND_END = ORBIT_R - 12  // stop just before icons
  const TICK_OUTER_R = 205
  const NUM_TICKS = 60

  // Server-side placeholder to prevent layout shifts and hydration errors
  if (!mounted) {
    return (
      <div className="relative flex flex-col items-center justify-center overflow-hidden w-full max-w-full h-[250px] sm:h-[360px] lg:h-[430px]">
        <div className="absolute origin-center scale-[0.58] sm:scale-[0.8] sm:relative flex items-center justify-center rounded-full border border-amber-400/[0.1] shrink-0"
          style={{ width: SIZE, height: SIZE }}>
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/[0.06] ring-1 ring-amber-400/20">
            <Compass className="h-12 w-12 text-amber-400/90" strokeWidth={1.25} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden w-full max-w-full h-[250px] sm:h-[360px] lg:h-[430px]">
      <div className="absolute origin-center scale-[0.58] sm:scale-[0.8] sm:relative shrink-0"
        style={{ width: SIZE, height: SIZE }}>

        {/* ── Watch tick marks ── */}
        <svg className="absolute inset-0" viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden>
          {Array.from({ length: NUM_TICKS }).map((_, i) => {
            const a = (i / NUM_TICKS) * Math.PI * 2 - Math.PI / 2
            const isMajor = i % 5 === 0
            const innerR = isMajor ? TICK_OUTER_R - 14 : TICK_OUTER_R - 8
            const x1 = (C + Math.cos(a) * innerR).toFixed(2)
            const y1 = (C + Math.sin(a) * innerR).toFixed(2)
            const x2 = (C + Math.cos(a) * TICK_OUTER_R).toFixed(2)
            const y2 = (C + Math.sin(a) * TICK_OUTER_R).toFixed(2)
            return (
              <line key={i}
                x1={x1} y1={y1}
                x2={x2} y2={y2}
                stroke={isMajor ? "rgba(251,191,36,0.3)" : "rgba(251,191,36,0.1)"}
                strokeWidth={isMajor ? 1.8 : 0.8}
                strokeLinecap="round"
              />
            )
          })}
          {/* Radial guide lines to each domain */}
          {domainEntries.map(([, ], i) => {
            const a = (i / 6) * Math.PI * 2 - Math.PI / 2
            const x1 = (C + Math.cos(a) * 60).toFixed(2)
            const y1 = (C + Math.sin(a) * 60).toFixed(2)
            const x2 = (C + Math.cos(a) * (ORBIT_R - 26)).toFixed(2)
            const y2 = (C + Math.sin(a) * (ORBIT_R - 26)).toFixed(2)
            return (
              <line key={i}
                x1={x1} y1={y1}
                x2={x2} y2={y2}
                stroke="rgba(251,191,36,0.06)" strokeWidth="1" strokeDasharray="4 8"
              />
            )
          })}
        </svg>

        {/* ── Outer ring ── */}
        <div className="absolute inset-0 rounded-full border border-amber-400/[0.1]" />
        {/* ── Middle dashed ring — slow rotation ── */}
        <div className="absolute inset-10 animate-slow-spin" style={{ animationDuration: '50s', animationDirection: 'reverse' }}>
          <div className="h-full w-full rounded-full border border-amber-400/[0.06]" style={{ borderStyle: 'dashed' }} />
        </div>
        {/* ── Inner glow ── */}
        <div className="absolute inset-20 rounded-full bg-gradient-to-br from-amber-500/[0.05] via-amber-600/[0.02] to-transparent" />

        {/* ── FIXED domain icons ── */}
        {domainEntries.map(([key, Icon], i) => {
          const angle = (i / 6) * Math.PI * 2 - Math.PI / 2
          const x = (Math.cos(angle) * ORBIT_R).toFixed(2)
          const y = (Math.sin(angle) * ORBIT_R).toFixed(2)
          const isActive = i === activeIdx
          return (
            <div key={key}
              className="absolute left-1/2 top-1/2 transition-transform duration-500 ease-out"
              style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${isActive ? 1.2 : 1})` }}>
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-2xl backdrop-blur-sm transition-all duration-500",
                isActive
                  ? "bg-amber-400/[0.18] ring-2 ring-amber-400/50 shadow-[0_0_28px_6px_rgba(251,191,36,0.25)]"
                  : "bg-white/[0.04] ring-1 ring-white/[0.08]",
              )}>
                <Icon
                  className={cn("h-5 w-5 transition-all duration-500", isActive ? "text-amber-300" : "text-white/30")}
                  strokeWidth={1.5}
                />
              </div>
            </div>
          )
        })}

        {/* ── ROTATING HAND (aiguille) ── */}
        <svg
          className="absolute inset-0 animate-slow-spin"
          style={{ animationDuration: `${TOTAL_DURATION / 1000}s` }}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          aria-hidden
        >
          <defs>
            <linearGradient id="handGrad" x1={C} y1={C} x2={C} y2={C - HAND_END} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(251,191,36,0.15)" />
              <stop offset="70%" stopColor="rgba(251,191,36,0.6)" />
              <stop offset="100%" stopColor="rgba(251,191,36,1)" />
            </linearGradient>
            <radialGradient id="tipGlow">
              <stop offset="0%" stopColor="rgba(251,191,36,0.5)" />
              <stop offset="100%" stopColor="rgba(251,191,36,0)" />
            </radialGradient>
          </defs>
          {/* Hand line */}
          <line
            x1={C} y1={C - HAND_START}
            x2={C} y2={C - HAND_END}
            stroke="url(#handGrad)" strokeWidth="2.5" strokeLinecap="round"
          />
          {/* Tip glow halo */}
          <circle cx={C} cy={C - HAND_END} r="16" fill="url(#tipGlow)" />
          {/* Tip dot */}
          <circle cx={C} cy={C - HAND_END} r="4.5" fill="rgba(251,191,36,0.95)"
            style={{ filter: 'drop-shadow(0 0 6px rgba(251,191,36,0.7))' }} />
          {/* Pivot dot */}
          <circle cx={C} cy={C} r="5" fill="rgba(251,191,36,0.8)" stroke="rgba(251,191,36,0.3)" strokeWidth="1.5" />
        </svg>

        {/* ── Center compass + active domain name ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.05] ring-1 ring-amber-400/15 backdrop-blur-sm">
            <Compass className="h-8 w-8 text-amber-400/70" strokeWidth={1.25} />
          </div>
          <div key={activeIdx} className="animate-text-reveal mt-2.5 text-center">
            <p className="font-heading text-base font-bold text-white leading-tight drop-shadow-sm">
              {activeTheme.label.split(" &")[0]}
            </p>
            <p className="font-sans text-[10px] font-medium text-amber-300/50 uppercase tracking-[0.15em] mt-0.5">
              {activeTheme.label.includes("&") ? `& ${activeTheme.label.split("& ")[1]}` : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════
   MAP PREVIEW GALLERY
   ════════════════════════════════════════ */
function MapPreviewGallery() {
  const [selectedDomain, setSelectedDomain] = useState<string>("culture")

  const currentTheme = THEMES[selectedDomain as keyof typeof THEMES]

  const filterClass = {
    culture:     "",
    sport:       "hue-rotate-[80deg] saturate-110 contrast-[1.02]",
    nature:      "hue-rotate-[110deg] saturate-120 contrast-100",
    histoire:    "sepia-[0.12] contrast-[0.98] brightness-[0.98]",
    science:     "hue-rotate-[210deg] saturate-130 brightness-95",
    gastronomie: "hue-rotate-[-25deg] saturate-120 brightness-[1.02]",
  }[selectedDomain] || ""

  return (
    <div className="mt-10 grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
      {/* Sidebar - domain buttons */}
      <div className="lg:col-span-2 flex flex-col gap-2.5">
        <p className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 text-center lg:text-left">
          Choisissez un domaine pour voir sa carte
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
          {domains.map((d) => {
            const Icon = domainIcons[d.id]
            const isSelected = selectedDomain === d.id
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDomain(d.id)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all ring-1 text-xs font-bold font-sans",
                  isSelected
                    ? "bg-accent/10 ring-accent/40 shadow-sm text-primary"
                    : "bg-card ring-border/30 hover:ring-border/60 text-muted-foreground"
                )}
                style={isSelected ? { color: d.accent } : undefined}
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all"
                  style={{ background: isSelected ? `color-mix(in oklch, ${d.accent} 15%, transparent)` : 'var(--muted)' }}
                >
                  <Icon className="h-4.5 w-4.5" style={{ color: isSelected ? d.accent : 'var(--muted-foreground)' }} strokeWidth={1.75} />
                </div>
                <div className="truncate min-w-0">
                  <p className="font-heading text-xs font-bold leading-tight">{d.label.split(" ")[0]}</p>
                  <p className="font-sans text-[10px] opacity-70 truncate">{d.label.split(" ").slice(1).join(" ")}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Map device mock container */}
      <div className="lg:col-span-3 flex justify-center">
        <div className="relative w-full max-w-[280px] aspect-[9/16] rounded-[2.25rem] ring-[10px] ring-neutral-900 bg-neutral-950 shadow-2xl overflow-hidden flex flex-col border-[2px] border-neutral-800">
          
          {/* Mock screen status bar */}
          <div className="h-5 bg-transparent relative z-10 flex items-center justify-between px-5 pt-2 select-none">
            <span className="text-[8px] font-sans font-bold text-white/40">9:41</span>
            <div className="flex gap-1 items-center">
              <span className="w-2.5 h-1.2 rounded-sm bg-white/40" />
            </div>
          </div>

          {/* Mini Top bar */}
          <div className="flex items-center justify-between px-4 py-1 bg-transparent relative z-10">
            <span className="font-sans text-[8px] text-white/30">Accueil</span>
            <span className="font-heading text-[9px] font-bold uppercase tracking-wider text-white">Carte</span>
            <div
              className="flex items-center gap-1 rounded-full px-2 py-0.5 ring-1"
              style={{
                background: `color-mix(in oklch, ${currentTheme.cssVars["--accent"]} 10%, transparent)`,
                borderColor: `color-mix(in oklch, ${currentTheme.cssVars["--accent"]} 30%, transparent)`,
              }}
            >
              <span className="font-sans text-[7px] font-bold uppercase tracking-wider" style={{ color: currentTheme.cssVars["--accent"] }}>
                {currentTheme.label.split(" ")[0]}
              </span>
            </div>
          </div>

          {/* Winding path area inside phone mock */}
          <div className="relative flex-1 overflow-hidden p-4 flex flex-col justify-center gap-2">
            
            {/* Dynamic Map Topography Background */}
            <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
              <div
                className={cn(
                  "absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-[0.25]",
                  filterClass
                )}
                style={{ backgroundImage: "url('/images/map_culture.jpg')" }}
              />
              <div
                className="absolute inset-0 transition-colors duration-700 mix-blend-color opacity-[0.22]"
                style={{ backgroundColor: currentTheme.cssVars["--accent"] }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/20 opacity-90" />
            </div>

            {/* Winding paths list */}
            <div className="relative z-10 flex flex-col gap-0 select-none">
              
              {/* Node 1: Completed */}
              <div className="relative flex flex-col items-center pl-[35%] py-0.5">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-b-[3px]"
                  style={{
                    background: "var(--wood)",
                    borderColor: "color-mix(in oklch, var(--wood) 80%, black)",
                    color: "white"
                  }}
                >
                  <Check className="h-3 w-3" strokeWidth={3} />
                </div>
                <p className="font-heading text-[8px] text-white/80 mt-1 font-bold">Ndoumbélane</p>
              </div>

              {/* Connector line 1 */}
              <div className="relative h-5 w-full max-w-[120px] mx-auto opacity-40">
                <svg className="h-full w-full" viewBox="0 0 200 48" preserveAspectRatio="none">
                  <path d="M 68 0 C 68 24, 132 24, 132 48" fill="none" stroke={currentTheme.cssVars["--accent"]} strokeWidth="4" />
                </svg>
              </div>

              {/* Node 2: Active */}
              <div className="relative flex flex-col items-center pr-[35%] py-0.5">
                {/* Speech bubble */}
                <div className="absolute bottom-full mb-1 z-20">
                  <div className="relative bg-amber-500 text-white font-heading text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md shadow-sm">
                    Continuer
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[3px] border-t-amber-500" />
                  </div>
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-b-[3px]"
                  style={{
                    background: currentTheme.cssVars["--accent"],
                    borderColor: `color-mix(in oklch, ${currentTheme.cssVars["--accent"]} 70%, black)`,
                    color: "white"
                  }}
                >
                  <Sparkles className="h-3.5 w-3.5 text-white" strokeWidth={2} />
                </div>
                <p className="font-heading text-[8px] text-white mt-1 font-bold">Rive du Saloum</p>
              </div>

              {/* Connector line 2 */}
              <div className="relative h-5 w-full max-w-[120px] mx-auto opacity-20">
                <svg className="h-full w-full" viewBox="0 0 200 48" preserveAspectRatio="none">
                  <path d="M 132 0 C 132 24, 68 24, 68 48" fill="none" stroke="var(--border)" strokeWidth="3" strokeDasharray="4 4" />
                </svg>
              </div>

              {/* Node 3: Locked */}
              <div className="relative flex flex-col items-center pl-[35%] py-0.5 opacity-50">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-b-2"
                  style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--muted-foreground)" }}
                >
                  <Lock className="h-3 w-3" strokeWidth={2} />
                </div>
                <p className="font-heading text-[8px] text-white/50 mt-1 font-bold">???</p>
              </div>

            </div>

          </div>

          {/* Mock bottom Nav */}
          <div className="h-8 bg-neutral-900 border-t border-white/5 relative z-10 flex items-center justify-around px-4">
            <MapIcon className="h-3.5 w-3.5" style={{ color: currentTheme.cssVars["--accent"] }} />
            <ScrollText className="h-3.5 w-3.5 text-white/30" />
            <Trophy className="h-3.5 w-3.5 text-white/30" />
            <Users className="h-3.5 w-3.5 text-white/30" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════
   HERO BACKGROUND
   ════════════════════════════════════════ */
function HeroBg() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-amber-500/[0.04] blur-[120px] lg:h-[700px] lg:w-[700px]" />
      <div className="absolute -right-40 top-0 h-[600px] w-[600px] rounded-full border border-white/[0.02] animate-slow-spin" style={{ animationDuration: '60s' }} />
      {[
        { x: "8%",  y: "22%", d: "0s",   s: 3 },
        { x: "92%", y: "28%", d: "1.5s", s: 2 },
        { x: "20%", y: "72%", d: "3s",   s: 2 },
        { x: "78%", y: "68%", d: "0.8s", s: 3 },
        { x: "48%", y: "88%", d: "2s",   s: 2 },
      ].map((p, i) => (
        <div key={i} className="absolute rounded-full bg-amber-400/25 animate-drift"
          style={{ left: p.x, top: p.y, width: p.s, height: p.s, animationDelay: p.d }} />
      ))}
      {/* Transition gradient - hidden on mobile to preserve dark contrast for watch icons */}
      <div className="hidden sm:block absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-0" />
    </div>
  )
}

/* ════════════════════════════════════════
   NAV
   ════════════════════════════════════════ */
const navLinks = [
  { label: "Concept",       href: "#concept" },
  { label: "Domaines",      href: "#domaines" },
  { label: "Comment jouer", href: "#comment-jouer" },
  { label: "Formats",       href: "#formats" },
  { label: "FAQ",           href: "#faq" },
]

/* ════════════════════════════════════════
   PAGE
   ════════════════════════════════════════ */
export default function LandingPage() {
  const [showContact, setShowContact] = useState(false)
  const { theme } = useTheme()
  const activeEvents = upcomingEventsByTheme[theme.id] || upcomingEventsByTheme.culture

  return (
    <main className="min-h-dvh overflow-x-hidden bg-background" style={{ scrollBehavior: 'smooth' }}>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative isolate overflow-hidden bg-[#111010] text-white min-h-dvh flex flex-col">
        <HeroBg />

        {/* Nav */}
        <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-4 pt-5 lg:px-6 lg:pt-7">
          <div className="flex items-center gap-2.5">
            <Seal className="h-8 w-8" />
            <span className="font-heading text-xs font-bold uppercase tracking-[0.15em] text-white/85 sm:text-sm">
              Langa Bouri
            </span>
          </div>
          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href}
                className="font-sans text-[11px] font-medium uppercase tracking-wider text-white/40 transition-colors hover:text-white/90">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setShowContact(true)}
              className="hidden sm:flex items-center gap-2 rounded-full px-4 py-2 font-sans text-xs font-medium text-white/50 ring-1 ring-white/10 transition-all hover:text-white/80 hover:ring-white/25">
              <Megaphone className="h-3.5 w-3.5" /> Contact
            </button>
            <Link href="/play"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 font-sans text-xs font-bold uppercase tracking-wider text-white shadow-[0_4px_20px_-4px_rgba(217,119,6,0.4)] transition-all hover:shadow-[0_6px_28px_-4px_rgba(217,119,6,0.55)] hover:scale-[1.03] active:scale-95">
              <Play className="h-3.5 w-3.5" /> Commencer
            </Link>
          </div>
        </header>

        {/* Hero content — grid: text left, wheel right */}
        <div className="relative z-10 mx-auto flex max-w-7xl flex-1 flex-col items-center gap-4 px-4 pb-4 pt-3 sm:pb-10 sm:pt-10 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-6 lg:pb-20 lg:pt-0">

          {/* Left column */}
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start w-full max-w-2xl">
            <span className="animate-seal-in inline-flex items-center gap-2 rounded-full bg-white/[0.05] px-4 py-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.15em] text-amber-300/80 ring-1 ring-amber-400/15">
              <QrCode className="h-3.5 w-3.5" /> Chasse au trésor numérique
            </span>

            <h1 className="mt-3 sm:mt-6 text-balance font-heading text-4xl font-black leading-[1.08] sm:text-5xl lg:text-[3.5rem] xl:text-6xl">
              <span className="gradient-text-gold">{GAME.title}</span>
            </h1>

            <p className="hidden sm:block mx-auto mt-4 max-w-lg text-pretty font-sans text-base leading-relaxed text-white/50 lg:mx-0 lg:text-lg">
              L'adaptation numérique du jeu traditionnel sénégalais. Des QR codes, des énigmes, une aventure sur tous les terrains.
            </p>

            <div className="mt-4 sm:mt-6 flex flex-col items-center gap-3 sm:flex-row justify-center lg:justify-start w-full">
              <Link id="hero-cta" href="/play"
                className="shimmer group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 font-sans text-sm font-bold uppercase tracking-wider text-white shadow-[0_8px_32px_-4px_rgba(217,119,6,0.35)] transition-all hover:shadow-[0_12px_40px_rgba(217,119,6,0.45)] hover:scale-[1.02] active:scale-95">
                Commencer l'expédition <MapIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <button type="button" onClick={() => setShowContact(true)}
                className="inline-flex items-center gap-2 rounded-full px-6 py-4 font-sans text-sm font-medium text-white/50 ring-1 ring-white/15 transition-all hover:text-white/80 hover:ring-white/30 hover:bg-white/[0.04]">
                <Megaphone className="h-4 w-4" /> En savoir plus
              </button>
            </div>

            {/* Stats - Grid 2x2 on mobile, Flex row on desktop */}
            <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-x-6 gap-y-6 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-10 sm:gap-y-3 lg:justify-start w-full max-w-[320px] sm:max-w-none mx-auto lg:mx-0">
              {stats.map((s, i) => (
                <div key={s.label} className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:gap-3 lg:justify-start">
                  {i > 0 && <span className="hidden text-white/[0.08] sm:block">|</span>}
                  <div className="flex flex-col items-center text-center sm:items-start sm:text-left sm:ml-2">
                    <p className="font-heading text-2xl font-black text-white sm:text-2xl lg:text-3xl leading-tight">{s.n}</p>
                    <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40 mt-1">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — rotating wheel */}
          <WatchWheel />
        </div>

        {/* Scroll cue */}
        <div className="relative z-10 mx-auto mb-2 sm:mb-6 flex flex-col items-center gap-1 text-white/25">
          <span className="font-sans text-[9px] uppercase tracking-[0.2em]">Découvrir</span>
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </div>
      </section>

      {/* ═══════════ CONCEPT ═══════════ */}
      <Section id="concept" className="py-16 lg:py-24">
        <SectionHeader tag="Le concept" title="Le Langa Bouri, version connectée"
          sub="Le « Langa Bouri » est un jeu de cache-cache traditionnel sénégalais. Nous l'avons transformé en aventure numérique : des QR codes dissimulés sur le terrain, une plateforme web d'indices, et un classement en temps réel." />
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { icon: QrCode,  title: "QR Codes physiques", desc: "Dissimulés sur le terrain de jeu — chaque scan ouvre une page web unique." },
            { icon: Sparkles, title: "Indices interactifs", desc: "Texte, image, audio, vidéo — chaque indice guide vers le QR code suivant." },
            { icon: Trophy,  title: "Classement live", desc: "Chrono, progression, anti-triche — une compétition fair-play en temps réel." },
          ].map((item) => (
            <div key={item.title} className="modern-card p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10">
                <item.icon className="h-6 w-6 text-accent" strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-sm font-bold text-primary">{item.title}</h3>
              <p className="mt-2 font-sans text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════════ DOMAINS ═══════════ */}
      <Section id="domaines" className="py-16 lg:py-24 bg-muted/40">
        <SectionHeader tag="Multi-domaines" title="Des défis sur tous les terrains"
          sub="Chaque campagne est configurée sur un domaine distinct — design, couleurs et ambiance s'adaptent automatiquement." />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {domains.map((d) => {
            const Icon = domainIcons[d.id]
            return (
              <div key={d.id} className="modern-card group p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-300"
                  style={{ background: `color-mix(in oklch, ${d.accent} 12%, transparent)` }}>
                  <Icon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" style={{ color: d.accent }} strokeWidth={1.75} />
                </div>
                <h3 className="font-heading text-base font-bold text-primary">{d.label}</h3>
                <p className="mt-1.5 font-sans text-sm text-muted-foreground leading-relaxed">{d.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {d.keywords.slice(0, 3).map((kw) => (
                    <span key={kw} className="rounded-full bg-muted px-2.5 py-0.5 font-sans text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{kw}</span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {/* ═══════════ HOW TO PLAY ═══════════ */}
      <Section id="comment-jouer" className="py-16 lg:py-24">
        <SectionHeader tag="Comment jouer" title="De QR code en QR code"
          sub="Une mécanique simple, des énigmes modulables : de 70 % à 90 % du temps de jeu est consacré à la recherche et à la réflexion." />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {steps.map((s, i) => (
            <div key={s.n} className="modern-card relative overflow-hidden p-6 text-center lg:text-left">
              <span className="pointer-events-none absolute -right-1 -top-2 font-heading text-[4.5rem] font-black text-muted/50 leading-none select-none">{s.n}</span>
              <div className="relative z-10">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 lg:mx-0">
                  <s.icon className="h-6 w-6 text-accent" strokeWidth={1.75} />
                </div>
                <div className="truncate min-w-0">
                  <h3 className="font-heading text-base font-bold text-primary">{s.title}</h3>
                </div>
                <p className="mt-2 font-sans text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-20 text-border">
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════════ EVENTS ═══════════ */}
      <Section id="evenements" className="py-16 lg:py-24 bg-muted/20">
        <SectionHeader tag="Calendrier" title="Événements à venir"
          sub="Découvrez les prochaines expéditions prévues sur le territoire sénégalais et inscrivez-vous." />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {activeEvents.map((e) => (
            <div key={e.id} className="modern-card overflow-hidden !rounded-2xl flex flex-col">
              <div className="relative h-44 shrink-0">
                <img
                  src={e.cover || "/placeholder.svg"}
                  alt={e.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading text-base font-bold text-primary">{e.title}</h3>
                  <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground/60" /> {e.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5 text-muted-foreground/60" /> {e.date}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-muted px-3 py-2 ring-1 ring-border/40">
                    <Gift className="h-4 w-4 text-accent" />
                    <span className="font-sans text-[11px] font-semibold text-primary">
                      {e.reward}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowContact(true)}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-sm transition-all hover:bg-primary/95"
                >
                  S'inscrire à l'expédition
                </button>
              </div>
            </div>
          ))}
        </div>
      </Section>


      {/* ═══════════ REWARDS ═══════════ */}
      <Section className="py-16 lg:py-24 bg-muted/40">
        <SectionHeader tag="Récompenses" title="Des trésors à la clé"
          sub="Chaque campagne récompense les aventuriers les plus audacieux avec des prix exclusifs." />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {rewards.map((r) => (
            <div key={r.title} className="modern-card group flex flex-col items-center p-6 text-center sm:p-8">
              <div className={cn("mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg transition-transform group-hover:scale-110", r.grad)}>
                <r.icon className="h-8 w-8 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-lg font-bold text-primary">{r.title}</h3>
              <p className="mt-2 font-sans text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════════ PARTNERS ═══════════ */}
      <Section dark className="py-16 lg:py-24">
        <SectionHeader dark tag="Partenaires" title="Un écosystème de confiance"
          sub="Institutionnels, techniques et commerciaux — un réseau de partenaires pour chaque édition." />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {partners.map((p) => (
            <div key={p.title} className="rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/[0.06] transition-all hover:bg-white/[0.07] hover:ring-white/10">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10">
                <p.icon className="h-5 w-5 text-amber-300/80" strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-base font-bold text-white">{p.title}</h3>
              <p className="mt-2 font-sans text-sm text-white/45 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════════ EVENT ═══════════ */}
      <Section className="py-12 lg:py-16">
        <div className="modern-card mx-auto max-w-xl p-6 text-center lg:p-8">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-ember">Événement en cours</span>
          <h2 className="mt-2 font-heading text-xl font-bold text-primary sm:text-2xl">{GAME.event}</h2>
          <p className="mt-1 font-sans text-sm text-muted-foreground">Le premier chapitre de la grande quête se termine bientôt.</p>
          <div className="my-5 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
          <p className="mb-3 font-sans text-xs font-medium uppercase tracking-widest text-muted-foreground">Fin de la quête dans</p>
          <div className="flex justify-center"><Countdown /></div>
          
          <div className="mt-6 flex justify-center">
            <Link
              href="/play"
              className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-white shadow-[0_4px_16px_rgba(217,119,6,0.25)] transition-all hover:shadow-[0_6px_20px_rgba(217,119,6,0.35)] hover:scale-[1.02] active:scale-95"
            >
              Commencer l'expédition <ArrowRight className="h-4.5 w-4.5" />
            </Link>
          </div>
        </div>
      </Section>

      {/* ═══════════ FAQ ═══════════ */}
      <Section id="faq" className="py-16 lg:py-24 bg-muted/40">
        <SectionHeader tag="FAQ" title="Questions fréquentes"
          sub="Tout ce que vous devez savoir avant de partir à l'aventure ou d'organiser votre événement." />
        <div className="mx-auto max-w-3xl flex flex-col gap-3">
          {faqs.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
        </div>
      </Section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="bg-[#111010] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6 lg:py-14">
          {/* Top row */}
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
            <div>
              <div className="flex items-center justify-center gap-2.5 lg:justify-start">
                <Seal className="h-8 w-8" />
                <span className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-white/85">Langa Bouri Connecté</span>
              </div>
              <p className="mt-2 text-center font-sans text-xs text-white/35 leading-relaxed max-w-xs lg:text-left">
                L'adaptation numérique et événementielle du jeu de cache-cache traditionnel sénégalais.
              </p>
            </div>

            {/* Nav links */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} className="font-sans text-xs text-white/35 transition-colors hover:text-white/75">{l.label}</a>
              ))}
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" title={s.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-white/40 ring-1 ring-white/[0.06] transition-all hover:bg-white/10 hover:text-white/80 hover:ring-white/15">
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="my-8 h-px bg-white/[0.06]" />

          {/* Bottom row */}
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-between">
            <p className="font-sans text-[11px] text-white/25">© 2026 Langa Bouri Connecté — Tous droits réservés</p>
            <div className="flex gap-5">
              {["Mentions légales", "Confidentialité", "CGU"].map((l) => (
                <span key={l} className="cursor-pointer font-sans text-[11px] text-white/20 hover:text-white/50 transition-colors">{l}</span>
              ))}
            </div>
            <p className="font-sans text-[11px] italic text-white/15">
              « Celui qui suit la carte des anciens ne se perd jamais. »
            </p>
          </div>

          {/* Contact button (mobile) */}
          <div className="mt-6 text-center lg:hidden">
            <button type="button" onClick={() => setShowContact(true)}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-white shadow-md">
              <Megaphone className="h-4 w-4" /> Contacter l'agence
            </button>
          </div>
        </div>
      </footer>

      {/* ═══════════ FLOATING CTA MOBILE ═══════════ */}
      <div className="fixed bottom-6 right-4 z-50 lg:hidden">
        <Link href="/play"
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3 font-sans text-xs font-bold uppercase tracking-wider text-white shadow-xl transition-transform hover:scale-105 active:scale-95">
          <Sparkles className="h-4 w-4" /> Commencer
        </Link>
      </div>

      {/* ═══════════ CONTACT MODAL ═══════════ */}
      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
    </main>
  )
}
