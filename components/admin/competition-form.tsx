'use client'

import { useState, useEffect } from 'react'
import { X, Plus, MapPin, Trophy, Trash2, ChevronDown, ChevronUp, Image, Volume2, Video } from 'lucide-react'
import { cn } from '@/lib/utils'
import { THEMES } from '@/lib/theme-config'
import type { ThemeId } from '@/lib/theme-config'
import type { Competition, CompetitionStatus } from '@/lib/admin-data'
import type { Fragment } from '@/lib/game-data'

const THEME_IDS: ThemeId[] = ['culture', 'sport', 'nature', 'histoire', 'science', 'gastronomie']
const STATUS_OPTIONS: CompetitionStatus[] = ['brouillon', 'active', 'terminée', 'archivée']

const inputClass =
  'w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all'
const labelClass =
  'block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5'

interface CompetitionFormProps {
  competition?: Competition
  onSave: (data: Competition) => void
  onClose: () => void
}

let nextId = 100

// Helper to convert date: "2026-07-15" <=> "15 Juillet 2026"
function formatToFrenchDate(isoString: string): string {
  if (!isoString) return ''
  const dateObj = new Date(isoString)
  if (isNaN(dateObj.getTime())) return isoString
  const day = dateObj.getDate()
  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ]
  const month = monthNames[dateObj.getMonth()]
  const year = dateObj.getFullYear()
  return `${day} ${month} ${year}`
}

function parseFromFrenchDate(frenchDate: string): string {
  if (!frenchDate) return ''
  const parts = frenchDate.split(' ')
  if (parts.length !== 3) {
    if (frenchDate.match(/^\d{4}-\d{2}-\d{2}$/)) return frenchDate
    return ''
  }
  const day = parts[0].padStart(2, '0')
  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ]
  const monthIdx = monthNames.indexOf(parts[1])
  if (monthIdx === -1) return ''
  const month = String(monthIdx + 1).padStart(2, '0')
  const year = parts[2]
  return `${year}-${month}-${day}`
}

export default function CompetitionForm({ competition, onSave, onClose }: CompetitionFormProps) {
  const isEdit = !!competition

  const [partnersList, setPartnersList] = useState<any[]>([])
  const [sponsorName, setSponsorName] = useState(competition?.sponsorName ?? '')

  useEffect(() => {
    try {
      const stored = localStorage.getItem("lb_partenaires")
      if (stored) {
        setPartnersList(JSON.parse(stored))
      } else {
        import('@/lib/admin-data').then(({ partenaires }) => {
          setPartnersList(partenaires)
        })
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  const [title, setTitle] = useState(competition?.title ?? '')
  const [themeId, setThemeId] = useState<ThemeId>(competition?.themeId ?? 'culture')
  const [location, setLocation] = useState(competition?.location ?? '')
  
  // Set date states
  const [startDate, setStartDate] = useState(() => {
    if (competition?.startDate) return competition.startDate
    if (competition?.date) {
      const cleanDate = competition.date.startsWith("Du ")
        ? competition.date.split(" au ")[0].replace("Du ", "").split(" à ")[0]
        : competition.date
      return parseFromFrenchDate(cleanDate)
    }
    return ''
  })
  
  const [startTime, setStartTime] = useState(competition?.startTime ?? '08:00')
  
  const [endDate, setEndDate] = useState(() => {
    if (competition?.endDate) return competition.endDate
    if (competition?.date && competition.date.includes(" au ")) {
      const cleanDate = competition.date.split(" au ")[1].split(" à ")[0]
      return parseFromFrenchDate(cleanDate)
    }
    return ''
  })
  
  const [endTime, setEndTime] = useState(competition?.endTime ?? '18:00')
  
  const [reward, setReward] = useState(competition?.reward ?? '')
  const [cover, setCover] = useState(competition?.cover ?? '')
  const [status, setStatus] = useState<CompetitionStatus>(competition?.status ?? 'brouillon')
  const [fragments, setFragments] = useState<Fragment[]>(competition?.fragments ?? [])
  
  // Keep track of which challenge card is expanded in the editor list
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  function handleAddFragment() {
    const newIndex = fragments.length + 1
    const total = newIndex
    const newFrag: Fragment = {
      id: Date.now() + Math.round(Math.random() * 1000),
      index: `${newIndex}/${total}`,
      title: `Défi ${newIndex}`,
      place: 'Lieu à définir',
      story: '',
      clue: '',
      media: 'image',
      reward: '',
      status: newIndex === 1 ? 'active' : 'locked',
      x: 100 + Math.round(Math.random() * 200),
      y: 60 + Math.round(Math.random() * 300),
    }

    const updated = [
      ...fragments.map((f, i) => ({ ...f, index: `${i + 1}/${total}` })),
      newFrag,
    ]
    setFragments(updated)
    setExpandedIndex(updated.length - 1)
  }

  function handleRemoveFragment(indexToRemove: number) {
    const updated = fragments
      .filter((_, i) => i !== indexToRemove)
      .map((f, i, arr) => ({
        ...f,
        index: `${i + 1}/${arr.length}`,
        status: i === 0 ? 'active' : f.status // Ensure 1st one stays active
      }))
    setFragments(updated)
    setExpandedIndex(updated.length > 0 ? Math.max(0, indexToRemove - 1) : null)
  }

  function handleUpdateFragment<K extends keyof Fragment>(index: number, key: K, value: Fragment[K]) {
    const updated = fragments.map((f, i) => {
      if (i === index) {
        return { ...f, [key]: value }
      }
      return f
    })
    setFragments(updated)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Format the date picker value back to "Du [Start] à [Time] au [End] à [Time]" string for database compatibility
    const formattedStart = formatToFrenchDate(startDate)
    const formattedEnd = formatToFrenchDate(endDate)
    const formattedDateRange = startDate && endDate 
      ? `Du ${formattedStart} à ${startTime} au ${formattedEnd} à ${endTime}`
      : formattedStart || 'Non planifiée'

    const data: Competition = {
      id: competition?.id ?? nextId++,
      title,
      themeId,
      location,
      date: formattedDateRange,
      startDate,
      startTime,
      endDate,
      endTime,
      status,
      totalFragments: fragments.length,
      fragments,
      reward,
      cover: cover || '/images/event-fort.png',
      treasureLockedImage: competition?.treasureLockedImage ?? '/images/treasure_locked.jpg',
      treasureUnlockedImage: competition?.treasureUnlockedImage ?? '/images/treasure_unlocked.jpg',
      participantsCount: competition?.participantsCount ?? 0,
      completedCount: competition?.completedCount ?? 0,
      createdAt: competition?.createdAt ?? new Date().toISOString().slice(0, 10),
      sponsorName
    }

    onSave(data)
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-card rounded-3xl border border-border shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-up relative">
        
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border sticky top-0 bg-card/95 backdrop-blur-sm rounded-t-3xl z-10">
          <div>
            <h2 className="font-heading text-base font-black uppercase tracking-wider text-primary">
              {isEdit ? 'Modifier la Compétition' : 'Nouvelle Compétition'}
            </h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">
              Configuration de la campagne de jeu
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-muted-foreground hover:text-primary hover:bg-muted/80 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Titre */}
          <div>
            <label className={labelClass}>Titre de la Compétition</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="Ex: L'Héritage de Ndiadiane"
              required
            />
          </div>

          {/* Catégorie + Statut */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Catégorie</label>
              <select
                value={themeId}
                onChange={(e) => setThemeId(e.target.value as ThemeId)}
                className={inputClass}
              >
                {THEME_IDS.map((id) => (
                  <option key={id} value={id}>
                    {THEMES[id].label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Statut</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CompetitionStatus)}
                className={inputClass}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Localisation & Sponsor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Localisation</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={inputClass}
                placeholder="Ex: Saint-Louis, Sénégal"
                required
              />
            </div>
            <div>
              <label className={labelClass}>Sponsor de la Compétition</label>
              <select
                value={sponsorName}
                onChange={(e) => setSponsorName(e.target.value)}
                className={inputClass}
              >
                <option value="">Aucun sponsor</option>
                {partnersList.map((p) => (
                  <option key={p.id} value={p.name || p.org}>
                    {p.name || p.org} ({p.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Heure de Début */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Date de début</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Heure de début</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Date & Heure de Fin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Date de fin</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Heure de fin</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Récompense finale + Cover URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Récompense Finale</label>
              <input
                type="text"
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                className={inputClass}
                placeholder="Ex: Couronne sacrée (Badge Or)"
                required
              />
            </div>
            {/* Local Cover Image Upload */}
            <div>
              <label className={labelClass}>Image de couverture (Upload en local)</label>
              {cover ? (
                <div className="relative rounded-2xl border border-border overflow-hidden bg-muted/20 h-40 flex items-center justify-center group">
                  <img
                    src={cover}
                    alt="Prévisualisation couverture"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCover('')}
                      className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 text-xs font-bold shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                      Supprimer l'image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-2xl border-2 border-dashed border-border/80 hover:border-amber-500/40 bg-muted/10 transition-colors h-36 flex flex-col items-center justify-center p-6 text-center group cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setCover(reader.result as string)
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  <Image className="h-8 w-8 text-muted-foreground/60 mb-2 group-hover:text-amber-500 transition-colors" />
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider group-hover:text-primary transition-colors">
                    Sélectionner un fichier image
                  </p>
                  <p className="text-[9px] text-muted-foreground/60 mt-1">
                    Glissez-déposez ou cliquez pour parcourir vos fichiers (PNG, JPG, WebP)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Défis Section (Interactive Editor) ── */}
          <div className="border-t border-border/80 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <label className={cn(labelClass, 'mb-0')}>
                  Défis & Étapes de la Quête ({fragments.length})
                </label>
                <p className="text-[10px] text-muted-foreground/80 lowercase mt-0.5">
                  Configurez le tracé, les énigmes et les récompenses
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddFragment}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Ajouter un défi
              </button>
            </div>

            {fragments.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border/80 rounded-2xl bg-muted/10 text-center">
                <MapPin className="h-8 w-8 text-muted-foreground/40 mb-2 animate-float" />
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Aucun défi configuré
                </p>
                <p className="text-[10px] text-muted-foreground/60 mt-1 max-w-[280px]">
                  Ajoutez votre première étape pour dessiner la carte aux trésors.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {fragments.map((f, i) => {
                  const isExpanded = expandedIndex === i
                  const hasReward = f.reward && f.reward !== '' && f.reward !== 'Aucune'

                  return (
                    <div
                      key={f.id}
                      className={cn(
                        "rounded-2xl border transition-all duration-200 overflow-hidden",
                        isExpanded 
                          ? "border-amber-500/30 bg-muted/20 shadow-sm" 
                          : "border-border/60 bg-muted/10 hover:border-border"
                      )}
                    >
                      {/* Card Header Accordion Toggle */}
                      <div 
                        className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                        onClick={() => setExpandedIndex(isExpanded ? null : i)}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="font-mono text-xs font-black text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg shrink-0">
                            {f.index}
                          </span>
                          <span className="text-sm font-semibold text-primary truncate">
                            {f.title || `Défi #${i + 1}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">
                            {f.place || 'Lieu non défini'}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveFragment(i)
                            }}
                            className="p-1 text-muted-foreground/60 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Supprimer ce défi"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground/85" /> : <ChevronDown className="h-4 w-4 text-muted-foreground/85" />}
                        </div>
                      </div>

                      {/* Card Expanded Content Body */}
                      {isExpanded && (
                        <div className="px-4 pb-5 pt-1 border-t border-border/40 grid grid-cols-1 gap-4 text-sm animate-unfurl">
                          {/* Title & Place inputs */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className={labelClass}>Titre du Défi</label>
                              <input
                                type="text"
                                value={f.title}
                                onChange={(e) => handleUpdateFragment(i, 'title', e.target.value)}
                                className={inputClass}
                                placeholder="Nom du défi"
                                required
                              />
                            </div>
                            <div>
                              <label className={labelClass}>Lieu</label>
                              <input
                                type="text"
                                value={f.place}
                                onChange={(e) => handleUpdateFragment(i, 'place', e.target.value)}
                                className={inputClass}
                                placeholder="Ex: Baobab centenaire"
                                required
                              />
                            </div>
                          </div>

                          {/* Clue & Story textareas */}
                          <div className="grid grid-cols-1 gap-3">
                            <div>
                              <label className={labelClass}>Histoire / Description Contextuelle</label>
                              <textarea
                                value={f.story}
                                onChange={(e) => handleUpdateFragment(i, 'story', e.target.value)}
                                className={cn(inputClass, "min-h-[60px] resize-none")}
                                placeholder="Racontez la légende ou l'importance de ce lieu..."
                                required
                              />
                            </div>
                            <div>
                              <label className={labelClass}>Indice / Énigme</label>
                              <textarea
                                value={f.clue}
                                onChange={(e) => handleUpdateFragment(i, 'clue', e.target.value)}
                                className={cn(inputClass, "min-h-[60px] resize-none")}
                                placeholder="Indice de géolocalisation ou énigme à résoudre..."
                                required
                              />
                            </div>
                          </div>

                          {/* Media Type, Coordinates, and Reward inputs */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className={labelClass}>Format Média</label>
                              <select
                                value={f.media}
                                onChange={(e) => handleUpdateFragment(i, 'media', e.target.value as 'image' | 'audio' | 'video')}
                                className={inputClass}
                              >
                                <option value="image">Photo / Image</option>
                                <option value="audio">Audio / Podcast</option>
                                <option value="video">Vidéo / Motion</option>
                              </select>
                            </div>
                            <div>
                              <label className={labelClass}>Coordonnée X (position)</label>
                              <input
                                type="number"
                                value={f.x}
                                onChange={(e) => handleUpdateFragment(i, 'x', Number(e.target.value))}
                                className={inputClass}
                                min={20}
                                max={340}
                                required
                              />
                            </div>
                            <div>
                              <label className={labelClass}>Coordonnée Y (position)</label>
                              <input
                                type="number"
                                value={f.y}
                                onChange={(e) => handleUpdateFragment(i, 'y', Number(e.target.value))}
                                className={inputClass}
                                min={20}
                                max={480}
                                required
                              />
                            </div>
                          </div>

                          {/* Local media upload zone (for images, audio, and video formats) */}
                          <div className="bg-muted/40 p-4 rounded-xl border border-border/40 space-y-2">
                            <label className={labelClass}>
                              Fichier média ({f.media === 'image' ? 'Image' : f.media === 'audio' ? 'Audio' : 'Vidéo'} local)
                            </label>
                            
                            {f.mediaUrl ? (
                              <div className="rounded-xl border border-border bg-background p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-unfurl">
                                {/* Preview based on media type */}
                                {f.media === 'image' && (
                                  <div className="relative rounded-lg overflow-hidden h-24 w-40 shrink-0 border border-border flex items-center justify-center">
                                    <img src={f.mediaUrl} alt="Défi image" className="h-full w-full object-cover" />
                                  </div>
                                )}
                                {f.media === 'audio' && (
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 text-xs font-bold text-amber-600 mb-1.5 uppercase tracking-wide">
                                      <Volume2 className="w-3.5 h-3.5" />
                                      Fichier Audio Imparti
                                    </div>
                                    <audio controls className="w-full h-8" src={f.mediaUrl} />
                                  </div>
                                )}
                                {f.media === 'video' && (
                                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wide">
                                      <Video className="w-3.5 h-3.5" />
                                      Fichier Vidéo Imparti
                                    </div>
                                    <video controls className="w-full max-h-36 rounded-lg bg-black/90" src={f.mediaUrl} />
                                  </div>
                                )}
                                
                                <button
                                  type="button"
                                  onClick={() => handleUpdateFragment(i, 'mediaUrl', '')}
                                  className="self-end sm:self-center shrink-0 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 text-xs font-bold shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Supprimer
                                </button>
                              </div>
                            ) : (
                              <div className="relative rounded-xl border-2 border-dashed border-border/80 hover:border-amber-500/40 bg-background transition-all duration-300 h-24 flex flex-col items-center justify-center p-4 text-center group cursor-pointer">
                                <input
                                  type="file"
                                  accept={f.media === 'image' ? 'image/*' : f.media === 'audio' ? 'audio/*' : 'video/*'}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                      const reader = new FileReader()
                                      reader.onloadend = () => {
                                        handleUpdateFragment(i, 'mediaUrl', reader.result as string)
                                      }
                                      reader.readAsDataURL(file)
                                    }
                                  }}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                  key={`${f.id}-${f.media}`} // Reset input element state on media type switch
                                />
                                {f.media === 'image' && <Image className="h-6 w-6 text-muted-foreground/60 mb-1 group-hover:text-amber-500 transition-colors" />}
                                {f.media === 'audio' && <Volume2 className="h-6 w-6 text-muted-foreground/60 mb-1 group-hover:text-amber-500 transition-colors" />}
                                {f.media === 'video' && <Video className="h-6 w-6 text-muted-foreground/60 mb-1 group-hover:text-amber-500 transition-colors" />}
                                
                                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider group-hover:text-primary transition-colors">
                                  Importer un fichier {f.media === 'image' ? 'photo' : f.media === 'audio' ? 'audio' : 'vidéo'} local
                                </p>
                                <p className="text-[8px] text-muted-foreground/60 mt-0.5">
                                  Format supporté : {f.media === 'image' ? 'PNG, JPG, WebP' : f.media === 'audio' ? 'MP3, WAV, OGG' : 'MP4, WebM'}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Reward toggle & Input */}
                          <div className="bg-muted/40 p-4 rounded-xl border border-border/40 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                id={`has-reward-${f.id}`}
                                checked={hasReward}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    handleUpdateFragment(i, 'reward', 'Nouveau badge')
                                  } else {
                                    handleUpdateFragment(i, 'reward', '')
                                  }
                                }}
                                className="w-4 h-4 text-amber-500 rounded border-border focus:ring-amber-500 bg-background cursor-pointer"
                              />
                              <label htmlFor={`has-reward-${f.id}`} className="text-xs font-bold text-primary cursor-pointer select-none">
                                Récompense spécifique pour ce défi ?
                              </label>
                            </div>
                            {hasReward && (
                              <div>
                                <label className={labelClass}>Titre du Badge/Récompense</label>
                                <input
                                  type="text"
                                  value={f.reward}
                                  onChange={(e) => handleUpdateFragment(i, 'reward', e.target.value)}
                                  className={inputClass}
                                  placeholder="Nom de la récompense"
                                  required
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-5 py-2 text-sm font-semibold text-muted-foreground hover:text-primary hover:bg-muted/80 transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="rounded-xl bg-amber-500 hover:bg-amber-600 text-black px-6 py-2.5 text-sm font-bold shadow-md transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Trophy className="h-4 w-4" strokeWidth={2.5} />
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
