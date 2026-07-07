'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react'
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
  const [editing, setEditing] = useState<Partenaire | undefined>(undefined)
  const [showForm, setShowForm] = useState(false)
  const [typeFilter, setTypeFilter] = useState<FilterType>('all')

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

  function openCreate() {
    setEditing(undefined)
    setShowForm(true)
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
            {items.length} partenaire{items.length > 1 ? 's' : ''} ·{' '}
            {items.filter((p) => p.isActive).length} actif
            {items.filter((p) => p.isActive).length > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground shadow-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Ajouter
        </button>
      </div>

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

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">🤝</div>
          <p className="font-heading font-bold text-primary">Aucun partenaire trouvé</p>
          <p className="text-sm text-muted-foreground mt-1">
            Ajustez le filtre ou ajoutez un nouveau partenaire.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-card rounded-2xl border border-border p-5 hover:border-accent/30 transition-colors flex flex-col"
            >
              {/* Top: emoji + badges */}
              <div className="flex items-start justify-between mb-3">
                <span className="text-4xl leading-none">{p.logo}</span>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                      typeBadgeColors[p.type]
                    )}
                  >
                    {typeLabels[p.type]}
                  </span>
                </div>
              </div>

              {/* Name */}
              <h3 className="font-heading font-bold text-primary text-sm leading-tight mb-1">
                {p.name}
              </h3>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                {p.description}
              </p>

              {/* Website */}
              {p.website && (
                <a
                  href={p.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-accent hover:underline mb-3"
                >
                  <ExternalLink className="h-3 w-3" />
                  {new URL(p.website).hostname}
                </a>
              )}

              {/* Spacer */}
              <div className="mt-auto" />

              {/* Footer: active badge + actions */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <button
                  onClick={() => toggleActive(p.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors hover:opacity-70"
                >
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full',
                      p.isActive ? 'bg-emerald-500' : 'bg-red-500'
                    )}
                  />
                  <span className={p.isActive ? 'text-emerald-600' : 'text-red-500'}>
                    {p.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(p)}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                    title="Modifier"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
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
