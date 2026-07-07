'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Pencil, Megaphone, CheckCircle, HelpCircle, ExternalLink, Globe, Map as MapIcon, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import SponsoringForm, { type SponsorCampaign } from '@/components/admin/sponsoring-form'
import { mediaDB } from '@/lib/media-db'

const defaultCampaigns: SponsorCampaign[] = [
  {
    id: "sp-orange",
    sponsorName: "Orange Sénégal",
    adText: "Vivez intensément chaque défi culturel et sportif avec la connectivité 5G ultra-rapide d'Orange Sénégal !",
    adImage: "",
    adVideo: "",
    targetUrl: "https://www.orange.sn",
    isActive: true,
    landing: {
      enabled: true,
      adType: "text_banner",
      displayMode: "banner"
    },
    map: {
      enabled: true,
      adType: "only_image",
      displayMode: "fullscreen"
    },
    profile: {
      enabled: true,
      adType: "text_banner",
      displayMode: "banner"
    },
    rotationDuration: 8,
    skipDuration: 5
  },
  {
    id: "sp-wave",
    sponsorName: "Wave Sénégal",
    adText: "Rechargez votre compte Wave instantanément pour obtenir des indices bonus et des cauris !",
    adImage: "",
    adVideo: "",
    targetUrl: "https://www.wave.com",
    isActive: false,
    landing: {
      enabled: false,
      adType: "text_banner",
      displayMode: "banner"
    },
    map: {
      enabled: true,
      adType: "only_video",
      displayMode: "fullscreen"
    },
    profile: {
      enabled: true,
      adType: "text_banner",
      displayMode: "banner"
    },
    rotationDuration: 6,
    skipDuration: 4
  }
]

export default function SponsoringPage() {
  const [campaigns, setCampaigns] = useState<SponsorCampaign[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<SponsorCampaign | undefined>(undefined)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Load from storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("lb_sponsoring_campaigns")
      if (stored) {
        setCampaigns(JSON.parse(stored))
      } else {
        localStorage.setItem("lb_sponsoring_campaigns", JSON.stringify(defaultCampaigns))
        setCampaigns(defaultCampaigns)
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  function triggerToast(msg: string) {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  function handleSaveCampaign(data: SponsorCampaign) {
    setCampaigns((prev) => {
      let next = [...prev]
      
      // If setting this campaign active, deactivate others
      if (data.isActive) {
        next = next.map(c => ({ ...c, isActive: false }))
      }
      
      const idx = prev.findIndex(c => c.id === data.id)
      if (idx >= 0) {
        next[idx] = data
      } else {
        next.push(data)
      }
      
      localStorage.setItem("lb_sponsoring_campaigns", JSON.stringify(next))
      
      // Sync the globally active campaign under the legacy "lb_sponsoring" key for backwards compatibility
      const activeOne = next.find(c => c.isActive) || next[0]
      if (activeOne) {
        localStorage.setItem("lb_sponsoring", JSON.stringify({
          isEnabled: activeOne.isActive,
          sponsorName: activeOne.sponsorName,
          adType: activeOne.map.adType,
          adText: activeOne.adText,
          adImage: activeOne.adImage,
          adVideo: activeOne.adVideo,
          targetUrl: activeOne.targetUrl,
          displayMode: activeOne.map.displayMode,
          displayOnLanding: activeOne.landing.enabled,
          displayOnMap: activeOne.map.enabled,
          displayOnProfile: activeOne.profile.enabled,
          rotationDuration: activeOne.rotationDuration,
          skipDuration: activeOne.skipDuration
        }))
      }
      
      // Dispatch storage update
      window.dispatchEvent(new Event('storage'))
      return next
    })
    
    setShowForm(false)
    setEditingCampaign(undefined)
    triggerToast(isEditing ? "Campagne modifiée avec succès" : "Campagne créée avec succès")
  }

  const isEditing = !!editingCampaign

  function handleDelete(id: string) {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette campagne de sponsoring ? Cette action est irréversible.")) {
      mediaDB.delete(`image-${id}`)
      mediaDB.delete(`video-${id}`)

      setCampaigns((prev) => {
        const next = prev.filter(c => c.id !== id)
        localStorage.setItem("lb_sponsoring_campaigns", JSON.stringify(next))
        
        // Sync active
        const activeOne = next.find(c => c.isActive) || next[0]
        if (activeOne) {
          localStorage.setItem("lb_sponsoring", JSON.stringify({
            isEnabled: activeOne.isActive,
            sponsorName: activeOne.sponsorName,
            adType: activeOne.map.adType,
            adText: activeOne.adText,
            adImage: activeOne.adImage,
            adVideo: activeOne.adVideo,
            targetUrl: activeOne.targetUrl,
            displayMode: activeOne.map.displayMode,
            displayOnLanding: activeOne.landing.enabled,
            displayOnMap: activeOne.map.enabled,
            displayOnProfile: activeOne.profile.enabled,
            rotationDuration: activeOne.rotationDuration,
            skipDuration: activeOne.skipDuration
          }))
        } else {
          // No active ads left
          localStorage.removeItem("lb_sponsoring")
        }
        
        window.dispatchEvent(new Event('storage'))
        return next
      })
      triggerToast("Campagne supprimée")
    }
  }

  function handleToggleActive(id: string) {
    setCampaigns((prev) => {
      const next = prev.map(c => {
        if (c.id === id) {
          return { ...c, isActive: !c.isActive }
        }
        // Deactivate others
        return { ...c, isActive: false }
      })
      localStorage.setItem("lb_sponsoring_campaigns", JSON.stringify(next))
      
      const activeOne = next.find(c => c.isActive)
      if (activeOne) {
        localStorage.setItem("lb_sponsoring", JSON.stringify({
          isEnabled: true,
          sponsorName: activeOne.sponsorName,
          adType: activeOne.map.adType,
          adText: activeOne.adText,
          adImage: activeOne.adImage,
          adVideo: activeOne.adVideo,
          targetUrl: activeOne.targetUrl,
          displayMode: activeOne.map.displayMode,
          displayOnLanding: activeOne.landing.enabled,
          displayOnMap: activeOne.map.enabled,
          displayOnProfile: activeOne.profile.enabled,
          rotationDuration: activeOne.rotationDuration,
          skipDuration: activeOne.skipDuration
        }))
      } else {
        localStorage.removeItem("lb_sponsoring")
      }
      
      window.dispatchEvent(new Event('storage'))
      return next
    })
    triggerToast("Statut de la campagne mis à jour")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-amber-500" />
            Gestion du Sponsoring
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configurez plusieurs sponsorings pour les compétitions à venir et gérez le format par écran cible.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCampaign(undefined)
            setShowForm(true)
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground shadow-lg hover:opacity-90 transition-opacity cursor-pointer self-start sm:self-center"
        >
          <Plus className="h-4 w-4" />
          Ajouter une campagne
        </button>
      </div>

      {/* Campaigns list table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {campaigns.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <Megaphone className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="font-heading font-bold text-primary">Aucune campagne configurée</p>
              <p className="text-xs text-muted-foreground mt-1">Créez votre première campagne publicitaire sponsorisée.</p>
            </div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Nom du Sponsor</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4">Landing Page</th>
                  <th className="px-6 py-4">Carte du Jeu</th>
                  <th className="px-6 py-4">Profil Joueur</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm text-primary">
                {campaigns.map((sp) => (
                  <tr key={sp.id} className="hover:bg-muted/15 transition-colors">
                    {/* Brand name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-heading font-black text-amber-500">
                          {sp.sponsorName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-heading font-bold">{sp.sponsorName}</p>
                          {sp.targetUrl && (
                            <a href={sp.targetUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-muted-foreground hover:text-accent inline-flex items-center gap-0.5">
                              CTA Link <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Active toggle */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(sp.id)}
                        className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer border transition-colors",
                          sp.isActive
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-muted text-muted-foreground border-border"
                        )}
                      >
                        {sp.isActive ? "Campagne Active" : "Inactif"}
                      </button>
                    </td>

                    {/* Screen 1: Landing config tag */}
                    <td className="px-6 py-4">
                      {sp.landing.enabled ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-semibold text-primary flex items-center gap-1">
                            <Globe className="h-3 w-3 text-amber-500" /> Yes
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase">
                            {sp.landing.adType === 'text_banner' ? "Texte" : sp.landing.adType === 'only_image' ? "Image" : "Vidéo"} ({sp.landing.displayMode === 'banner' ? "Bandeau" : "Plein Écran"})
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground/60">—</span>
                      )}
                    </td>

                    {/* Screen 2: Map config tag */}
                    <td className="px-6 py-4">
                      {sp.map.enabled ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-semibold text-primary flex items-center gap-1">
                            <MapIcon className="h-3 w-3 text-emerald-500" /> Yes
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase">
                            {sp.map.adType === 'text_banner' ? "Texte" : sp.map.adType === 'only_image' ? "Image" : "Vidéo"} ({sp.map.displayMode === 'banner' ? "Bandeau" : "Plein Écran"})
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground/60">—</span>
                      )}
                    </td>

                    {/* Screen 3: Profile config tag */}
                    <td className="px-6 py-4">
                      {sp.profile.enabled ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-semibold text-primary flex items-center gap-1">
                            <User className="h-3 w-3 text-blue-500" /> Yes
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase">
                            {sp.profile.adType === 'text_banner' ? "Texte" : sp.profile.adType === 'only_image' ? "Image" : "Vidéo"} ({sp.profile.displayMode === 'banner' ? "Bandeau" : "Plein Écran"})
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground/60">—</span>
                      )}
                    </td>

                    {/* Actions buttons */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingCampaign(sp)
                            setShowForm(true)
                          }}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-primary transition-colors cursor-pointer"
                          title="Modifier"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sp.id)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Sponsoring Form Modal */}
      {showForm && (
        <SponsoringForm
          campaign={editingCampaign}
          onSave={handleSaveCampaign}
          onClose={() => {
            setShowForm(false)
            setEditingCampaign(undefined)
          }}
          existingIds={campaigns.map(c => c.id)}
        />
      )}

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-2xl">
            <CheckCircle className="h-4 w-4" />
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  )
}
