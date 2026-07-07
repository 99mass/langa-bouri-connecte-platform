'use client'

import { useState, useEffect } from 'react'
import { X, Save, Palette, Image as ImageIcon, Video as VideoIcon, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mediaDB } from '@/lib/media-db'

export type SponsorCampaign = {
  id: string
  sponsorName: string
  adText: string
  adImage: string
  adVideo: string
  targetUrl: string
  isActive: boolean
  
  // Granular settings per screen
  landing: {
    enabled: boolean
    adType: 'text_banner' | 'only_image' | 'only_video'
    displayMode: 'banner' | 'fullscreen'
  }
  map: {
    enabled: boolean
    adType: 'text_banner' | 'only_image' | 'only_video'
    displayMode: 'banner' | 'fullscreen'
  }
  profile: {
    enabled: boolean
    adType: 'text_banner' | 'only_image' | 'only_video'
    displayMode: 'banner' | 'fullscreen'
  }
  
  rotationDuration: number
  skipDuration: number
}

type SponsoringFormProps = {
  campaign?: SponsorCampaign
  onSave: (data: SponsorCampaign) => void
  onClose: () => void
  existingIds: string[]
}

const adTypeOptions = [
  { value: 'text_banner', label: 'Texte + Image' },
  { value: 'only_image', label: 'Image seule' },
  { value: 'only_video', label: 'Vidéo seule' }
]

const displayModeOptions = [
  { value: 'banner', label: 'Bandeau (Top)' },
  { value: 'fullscreen', label: 'Plein Écran' }
]

export default function SponsoringForm({ campaign, onSave, onClose }: SponsoringFormProps) {
  const isEditing = !!campaign

  const [partnersList, setPartnersList] = useState<any[]>([])

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

  const [sponsorName, setSponsorName] = useState(campaign?.sponsorName ?? '')
  const [adText, setAdText] = useState(campaign?.adText ?? '')
  const [adImage, setAdImage] = useState(campaign?.adImage ?? '')
  const [adVideo, setAdVideo] = useState(campaign?.adVideo ?? '')
  const [targetUrl, setTargetUrl] = useState(campaign?.targetUrl ?? '')
  const [isActive, setIsActive] = useState(campaign?.isActive ?? true)

  // Per-screen states
  const [landingEnabled, setLandingEnabled] = useState(campaign?.landing?.enabled ?? true)
  const [landingAdType, setLandingAdType] = useState<'text_banner' | 'only_image' | 'only_video'>(campaign?.landing?.adType ?? 'text_banner')
  const [landingDisplayMode, setLandingDisplayMode] = useState<'banner' | 'fullscreen'>(campaign?.landing?.displayMode ?? 'banner')

  const [mapEnabled, setMapEnabled] = useState(campaign?.map?.enabled ?? true)
  const [mapAdType, setMapAdType] = useState<'text_banner' | 'only_image' | 'only_video'>(campaign?.map?.adType ?? 'text_banner')
  const [mapDisplayMode, setMapDisplayMode] = useState<'banner' | 'fullscreen'>(campaign?.map?.displayMode ?? 'banner')

  const [profileEnabled, setProfileEnabled] = useState(campaign?.profile?.enabled ?? true)
  const [profileAdType, setProfileAdType] = useState<'text_banner' | 'only_image' | 'only_video'>(campaign?.profile?.adType ?? 'text_banner')
  const [profileDisplayMode, setProfileDisplayMode] = useState<'banner' | 'fullscreen'>(campaign?.profile?.displayMode ?? 'banner')

  const [rotationDuration, setRotationDuration] = useState(campaign?.rotationDuration ?? 8)
  const [skipDuration, setSkipDuration] = useState(campaign?.skipDuration ?? 5)

  // Load IndexedDB media contents for the form fields asynchronously if referenced by db:// key
  useEffect(() => {
    if (campaign?.adImage?.startsWith('db://')) {
      const key = campaign.adImage.replace('db://', '')
      mediaDB.get(key).then(data => setAdImage(data))
    }
    if (campaign?.adVideo?.startsWith('db://')) {
      const key = campaign.adVideo.replace('db://', '')
      mediaDB.get(key).then(data => setAdVideo(data))
    }
  }, [campaign])

  const labelClass = 'block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5'
  const inputClass = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/50'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const id = campaign?.id ?? `sp-${Date.now()}`
    let imageRef = adImage
    let videoRef = adVideo

    if (adImage && adImage.startsWith('data:')) {
      const key = `image-${id}`
      await mediaDB.set(key, adImage)
      imageRef = `db://${key}`
    }

    if (adVideo && adVideo.startsWith('data:')) {
      const key = `video-${id}`
      await mediaDB.set(key, adVideo)
      videoRef = `db://${key}`
    }

    const data: SponsorCampaign = {
      id,
      sponsorName,
      adText,
      adImage: imageRef,
      adVideo: videoRef,
      targetUrl,
      isActive,
      landing: {
        enabled: landingEnabled,
        adType: landingAdType,
        displayMode: landingDisplayMode
      },
      map: {
        enabled: mapEnabled,
        adType: mapAdType,
        displayMode: mapDisplayMode
      },
      profile: {
        enabled: profileEnabled,
        adType: profileAdType,
        displayMode: profileDisplayMode
      },
      rotationDuration,
      skipDuration
    }

    onSave(data)
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-unfurl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
          <h2 className="font-heading text-lg font-bold text-primary flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            {isEditing ? 'Modifier la campagne' : 'Nouvelle campagne de Sponsoring'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* General Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-border/40 pb-1">
              Informations Générales
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nom du Sponsor *</label>
                <select
                  required
                  value={sponsorName}
                  onChange={(e) => {
                    const selectedName = e.target.value
                    setSponsorName(selectedName)
                    
                    // Auto-fill targetUrl if website matches
                    const match = partnersList.find(p => p.name === selectedName || p.org === selectedName)
                    if (match && match.website) {
                      setTargetUrl(match.website)
                    }
                  }}
                  className={inputClass}
                >
                  <option value="">-- Choisir un Partenaire --</option>
                  {partnersList.map((p) => (
                    <option key={p.id} value={p.name || p.org}>
                      {p.name || p.org} ({p.type})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Lien cible (CTA URL)</label>
                <input
                  type="url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://www.orange.sn"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Texte Promotionnel / Message *</label>
              <textarea
                required
                value={adText}
                onChange={(e) => setAdText(e.target.value)}
                placeholder="Ex: Restez connectés au meilleur réseau 5G pendant votre aventure..."
                rows={2}
                className={cn(inputClass, 'resize-none')}
              />
            </div>
          </div>

          {/* Media upload slots */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Image banner */}
            <div className="space-y-2">
              <label className={labelClass}>Bannière / Photo publicitaire</label>
              {adImage ? (
                <div className="relative rounded-xl border border-border overflow-hidden bg-muted/20 h-28 w-full flex items-center justify-center group">
                  <img src={adImage} alt="Ad brand" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setAdImage('')}
                      className="rounded-lg bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-xl border border-dashed border-border hover:border-amber-500/40 bg-muted/5 h-28 flex flex-col items-center justify-center p-3 text-center group cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => setAdImage(reader.result as string)
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <ImageIcon className="h-5 w-5 text-muted-foreground/60 mb-1 group-hover:text-amber-500 transition-colors" />
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase group-hover:text-primary transition-colors">
                    Téléverser Image
                  </span>
                </div>
              )}
            </div>

            {/* Video banner */}
            <div className="space-y-2">
              <label className={labelClass}>Clip Vidéo (MP4/WebM)</label>
              {adVideo ? (
                <div className="relative rounded-xl border border-border overflow-hidden bg-muted/20 h-28 w-full flex items-center justify-center group">
                  <video src={adVideo} className="w-full h-full object-cover animate-pulse" muted playsInline />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                    <button
                      type="button"
                      onClick={() => setAdVideo('')}
                      className="rounded-lg bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-xl border border-dashed border-border hover:border-amber-500/40 bg-muted/5 h-28 flex flex-col items-center justify-center p-3 text-center group cursor-pointer">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => setAdVideo(reader.result as string)
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <VideoIcon className="h-5 w-5 text-muted-foreground/60 mb-1 group-hover:text-amber-500 transition-colors" />
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase group-hover:text-primary transition-colors">
                    Téléverser Vidéo
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Granular Screen configurations */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-border/40 pb-1">
              Configuration par écran cible
            </h3>

            {/* ── Screen 1: Landing Page ── */}
            <div className="bg-muted/30 p-4 rounded-xl border border-border/60 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary flex items-center gap-2">
                  <span className={cn("w-2 h-2 rounded-full", landingEnabled ? "bg-emerald-500" : "bg-muted-foreground/40")} />
                  Landing Page (Page d'accueil)
                </span>
                <button
                  type="button"
                  onClick={() => setLandingEnabled(!landingEnabled)}
                  className={cn(
                    "text-[10px] font-bold px-3 py-1 rounded-lg border transition-colors cursor-pointer",
                    landingEnabled
                      ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                      : "text-muted-foreground bg-muted border-border"
                  )}
                >
                  {landingEnabled ? "Activé" : "Désactivé"}
                </button>
              </div>

              {landingEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 animate-unfurl">
                  <div>
                    <label className={labelClass}>Format de Pub</label>
                    <select
                      value={landingAdType}
                      onChange={(e) => setLandingAdType(e.target.value as any)}
                      className={inputClass}
                    >
                      {adTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Mode d'Affichage</label>
                    <select
                      value={landingDisplayMode}
                      onChange={(e) => setLandingDisplayMode(e.target.value as any)}
                      className={inputClass}
                    >
                      {displayModeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* ── Screen 2: Game Map ── */}
            <div className="bg-muted/30 p-4 rounded-xl border border-border/60 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary flex items-center gap-2">
                  <span className={cn("w-2 h-2 rounded-full", mapEnabled ? "bg-emerald-500" : "bg-muted-foreground/40")} />
                  Carte du jeu (Play Map)
                </span>
                <button
                  type="button"
                  onClick={() => setMapEnabled(!mapEnabled)}
                  className={cn(
                    "text-[10px] font-bold px-3 py-1 rounded-lg border transition-colors cursor-pointer",
                    mapEnabled
                      ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                      : "text-muted-foreground bg-muted border-border"
                  )}
                >
                  {mapEnabled ? "Activé" : "Désactivé"}
                </button>
              </div>

              {mapEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 animate-unfurl">
                  <div>
                    <label className={labelClass}>Format de Pub</label>
                    <select
                      value={mapAdType}
                      onChange={(e) => setMapAdType(e.target.value as any)}
                      className={inputClass}
                    >
                      {adTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Mode d'Affichage</label>
                    <select
                      value={mapDisplayMode}
                      onChange={(e) => setMapDisplayMode(e.target.value as any)}
                      className={inputClass}
                    >
                      {displayModeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* ── Screen 3: Player Profile ── */}
            <div className="bg-muted/30 p-4 rounded-xl border border-border/60 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary flex items-center gap-2">
                  <span className={cn("w-2 h-2 rounded-full", profileEnabled ? "bg-emerald-500" : "bg-muted-foreground/40")} />
                  Profil Joueur (Journal)
                </span>
                <button
                  type="button"
                  onClick={() => setProfileEnabled(!profileEnabled)}
                  className={cn(
                    "text-[10px] font-bold px-3 py-1 rounded-lg border transition-colors cursor-pointer",
                    profileEnabled
                      ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                      : "text-muted-foreground bg-muted border-border"
                  )}
                >
                  {profileEnabled ? "Activé" : "Désactivé"}
                </button>
              </div>

              {profileEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 animate-unfurl">
                  <div>
                    <label className={labelClass}>Format de Pub</label>
                    <select
                      value={profileAdType}
                      onChange={(e) => setProfileAdType(e.target.value as any)}
                      className={inputClass}
                    >
                      {adTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Mode d'Affichage</label>
                    <select
                      value={profileDisplayMode}
                      onChange={(e) => setProfileDisplayMode(e.target.value as any)}
                      className={inputClass}
                    >
                      {displayModeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border/40 pt-4">
            <div>
              <label className={labelClass}>Durée d'apparition (Bandeaux, s)</label>
              <input
                type="number"
                min={2}
                max={60}
                value={rotationDuration}
                onChange={(e) => setRotationDuration(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Attente passage (Plein Écran, s)</label>
              <input
                type="number"
                min={0}
                max={30}
                value={skipDuration}
                onChange={(e) => setSkipDuration(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>

          {/* Active Campaign Global Check */}
          <div className="flex items-center gap-2 pt-2">
            <input
              id="is-active"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-border text-accent focus:ring-accent bg-background cursor-pointer"
            />
            <label htmlFor="is-active" className="text-xs font-semibold text-primary cursor-pointer">
              Marquer comme Campagne Active
            </label>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2 text-sm font-bold text-accent-foreground shadow-lg hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Save className="h-4 w-4" />
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
