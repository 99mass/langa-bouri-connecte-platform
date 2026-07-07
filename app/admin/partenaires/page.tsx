'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, ExternalLink, Check, X, Inbox, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { partenaires as initialPartenaires } from '@/lib/admin-data'
import type { Partenaire, PartenaireType } from '@/lib/admin-data'
import PartenaireForm from '@/components/admin/partenaire-form'

const typeLabels: Record<PartenaireType, string> = {
  sponsor: 'Sponsor',
  media: 'Média',
  institutionnel: 'Institutionnel',
  technique: 'Technique',
}

const typeBadgeColors: Record<PartenaireType, string> = {
  sponsor: 'bg-amber-500/15 text-amber-600 border-amber-500/25',
  media: 'bg-blue-500/15 text-blue-600 border-blue-500/25',
  institutionnel: 'bg-purple-500/15 text-purple-600 border-purple-500/25',
  technique: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/25',
}

type FilterType = 'all' | PartenaireType

export default function PartenairesPage() {
  const [items, setItems] = useState<Partenaire[]>(initialPartenaires)
  const [requests, setRequests] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'actives' | 'demandes'>('demandes')
  
  const [editing, setEditing] = useState<Partenaire | undefined>(undefined)
  const [showForm, setShowForm] = useState(false)
  const [typeFilter, setTypeFilter] = useState<FilterType>('all')

  // Load and seed partnership requests
  useEffect(() => {
    try {
      const stored = localStorage.getItem("lb_partner_requests")
      if (stored) {
        setRequests(JSON.parse(stored))
      } else {
        const initialRequests = [
          {
            id: 101,
            name: "Fatoumata Diop",
            email: "f.diop@teranga-tours.sn",
            phone: "+221 77 123 45 67",
            org: "Teranga Tours Sénégal",
            interest: "Devenir partenaire / sponsor",
            message: "Nous aimerions sponsoriser l'étape Nature de la prochaine compétition en offrant des excursions gratuites pour les gagnants de la catégorie.",
            status: "pending",
            createdAt: new Date(Date.now() - 3600000 * 24).toISOString() // 1 day ago
          },
          {
            id: 102,
            name: "Jean-Pierre Gomis",
            email: "contact@ndar-media.com",
            phone: "+221 76 987 65 43",
            org: "Ndar Médias",
            interest: "Proposition commerciale",
            message: "Nous proposons une couverture médiatique complète (vidéos, reportages, posts réseaux) de vos défis historiques en haute définition.",
            status: "pending",
            createdAt: new Date(Date.now() - 3600000 * 4).toISOString() // 4 hours ago
          }
        ]
        localStorage.setItem("lb_partner_requests", JSON.stringify(initialRequests))
        setRequests(initialRequests)
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  const filtered = typeFilter === 'all' ? items : items.filter((p) => p.type === typeFilter)

  function handleSave(data: Partenaire) {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === data.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = data
        return next
      }
      return [...prev, data]
    })
    setShowForm(false)
    setEditing(undefined)
  }

  function handleDelete(id: number) {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ?')) {
      setItems((prev) => prev.filter((p) => p.id !== id))
    }
  }

  function toggleActive(id: number) {
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    )
  }

  function openEdit(p: Partenaire) {
    setEditing(p)
    setShowForm(true)
  }

  // Handle requests actions
  function handleRequestAction(requestId: number, action: 'approve' | 'reject') {
    const updated = requests.map((req) => {
      if (req.id === requestId) {
        const status = action === 'approve' ? 'approved' : 'rejected'
        return { ...req, status }
      }
      return req
    })
    setRequests(updated)
    localStorage.setItem("lb_partner_requests", JSON.stringify(updated))

    // If approved, automatically add to active partners list!
    if (action === 'approve') {
      const targetReq = requests.find(r => r.id === requestId)
      if (targetReq) {
        // Determine category mapping from request interest options
        let mappedType: PartenaireType = 'sponsor'
        if (targetReq.interest.includes("technique")) mappedType = 'technique'
        else if (targetReq.interest.includes("média") || targetReq.interest.includes("media") || targetReq.interest.includes("commerciale")) mappedType = 'media'
        else if (targetReq.interest.includes("information")) mappedType = 'institutionnel'

        const newPartner: Partenaire = {
          id: Date.now(),
          name: targetReq.name,
          org: targetReq.org,
          logo: "", // Triggers the beautiful brand initials fallback logo
          website: "https://",
          type: mappedType,
          description: targetReq.message || "Partenaire inscrit depuis le formulaire de contact.",
          email: targetReq.email,
          phone: targetReq.phone,
          isActive: true,
          createdAt: new Date().toISOString()
        }

        setItems((prev) => [...prev, newPartner])
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">
            Gestion des Partenaires
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configurez et validez les partenariats de la plateforme.
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(undefined)
            setShowForm(true)
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground shadow-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Ajouter un partenaire
        </button>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-border/60">
        <button
          onClick={() => setActiveTab('actives')}
          className={cn(
            "flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer",
            activeTab === 'actives'
              ? "border-amber-500 text-amber-500"
              : "border-transparent text-muted-foreground hover:text-primary"
          )}
        >
          <Users className="h-4 w-4" />
          Partenaires Actifs ({items.length})
        </button>
        <button
          onClick={() => setActiveTab('demandes')}
          className={cn(
            "flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer relative",
            activeTab === 'demandes'
              ? "border-amber-500 text-amber-500"
              : "border-transparent text-muted-foreground hover:text-primary"
          )}
        >
          <Inbox className="h-4 w-4" />
          Demandes Reçues
          {requests.filter(r => r.status === 'pending').length > 0 && (
            <span className="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white inline-block">
              {requests.filter(r => r.status === 'pending').length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'actives' ? (
        /* ═══════════ TAB: ACTIVE PARTNERS (LIST FORMAT) ═══════════ */
        <div className="space-y-4">
          {/* Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Filtrer :
            </span>
            {(['all', 'sponsor', 'media', 'institutionnel', 'technique'] as FilterType[]).map(
              (f) => (
                <button
                  key={f}
                  onClick={() => setTypeFilter(f)}
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-semibold border transition-colors',
                    typeFilter === f
                      ? 'bg-accent text-accent-foreground border-accent'
                      : 'bg-muted/50 text-muted-foreground border-border hover:border-accent/30'
                  )}
                >
                  {f === 'all' ? 'Tous' : typeLabels[f]}
                </button>
              )
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-3xl border border-border">
              <div className="text-5xl mb-4">🤝</div>
              <p className="font-heading font-bold text-primary">Aucun partenaire trouvé</p>
              <p className="text-sm text-muted-foreground mt-1">
                Ajustez le filtre ou ajoutez un nouveau partenaire.
              </p>
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/50 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border">
                      <th className="px-6 py-4">Partenaire</th>
                      <th className="px-6 py-4">Catégorie</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Site Web</th>
                      <th className="px-6 py-4">Statut</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => (
                      <tr key={p.id} className="border-b border-border/60 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {p.logo && p.logo.startsWith('data:image') ? (
                              <img src={p.logo} alt={p.name} className="h-9 w-9 rounded-xl object-cover shrink-0 border border-border/60 shadow-sm" />
                            ) : (
                              <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/25 flex items-center justify-center font-heading font-black text-xs uppercase shrink-0">
                                {p.name.slice(0, 2)}
                              </div>
                            )}
                            <span className="font-heading font-bold text-primary text-sm">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn('rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide', typeBadgeColors[p.type])}>
                            {typeLabels[p.type]}
                          </span>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {p.description}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          {p.website ? (
                            <a
                              href={p.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                            >
                              <ExternalLink className="h-3 w-3 shrink-0" />
                              {p.website.replace('https://', '').replace('http://', '').split('/')[0]}
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground/45">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleActive(p.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border border-border hover:border-accent/40 bg-muted/10 transition-colors"
                          >
                            <span className={cn('h-1.5 w-1.5 rounded-full', p.isActive ? 'bg-emerald-500' : 'bg-red-500')} />
                            <span className={p.isActive ? 'text-emerald-600' : 'text-red-500'}>
                              {p.isActive ? 'Actif' : 'Inactif'}
                            </span>
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEdit(p)}
                              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                              title="Modifier"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="rounded-lg p-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ═══════════ TAB: PARTNERSHIP REQUESTS ═══════════ */
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-3xl border border-border">
              <div className="text-5xl mb-4">📥</div>
              <p className="font-heading font-bold text-primary">Aucune demande reçue</p>
              <p className="text-sm text-muted-foreground mt-1">
                Les demandes soumises depuis le formulaire de contact apparaîtront ici.
              </p>
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/50 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border">
                      <th className="px-6 py-4">Demandeur</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">Demande</th>
                      <th className="px-6 py-4">Message</th>
                      <th className="px-6 py-4">Statut</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req.id} className="border-b border-border/60 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-heading font-bold text-primary text-sm">{req.name}</p>
                            <p className="text-[11px] text-muted-foreground font-semibold">{req.org || 'Particulier'}</p>
                            <p className="text-[10px] text-muted-foreground/60 mt-1">
                              {new Date(req.createdAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <a href={`mailto:${req.email}`} className="block text-xs text-accent hover:underline font-semibold leading-none">
                              {req.email}
                            </a>
                            <span className="block text-[11px] text-muted-foreground leading-none">{req.phone || 'Non renseigné'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            'rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide border',
                            req.interest.includes('partenaire')
                              ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                              : req.interest.includes('commerciale')
                              ? 'bg-purple-500/10 text-purple-600 border-purple-500/20'
                              : 'bg-muted text-muted-foreground border-border'
                          )}>
                            {req.interest}
                          </span>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {req.message}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            'rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide border',
                            req.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                              : req.status === 'approved'
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                          )}>
                            {req.status === 'pending' ? 'En attente' : req.status === 'approved' ? 'Approuvée' : 'Refusée'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {req.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleRequestAction(req.id, 'approve')}
                                className="rounded-lg p-1.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                                title="Approuver la demande"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleRequestAction(req.id, 'reject')}
                                className="rounded-lg p-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                                title="Refuser la demande"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground/40 italic">Traitée</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <PartenaireForm
          partenaire={editing}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false)
            setEditing(undefined)
          }}
        />
      )}
    </div>
  )
}
