'use client'

import { useState } from 'react'
import { X, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Partenaire, PartenaireType } from '@/lib/admin-data'

type PartenaireFormProps = {
  partenaire?: Partenaire
  onSave: (data: Partenaire) => void
  onClose: () => void
}

const typeOptions: { value: PartenaireType; label: string }[] = [
  { value: 'sponsor', label: 'Sponsor' },
  { value: 'media', label: 'Média' },
  { value: 'institutionnel', label: 'Institutionnel' },
  { value: 'technique', label: 'Technique' },
]

export default function PartenaireForm({ partenaire, onSave, onClose }: PartenaireFormProps) {
  const isEditing = !!partenaire

  const [name, setName] = useState(partenaire?.name ?? '')
  const [logo, setLogo] = useState(partenaire?.logo ?? '🏢')
  const [website, setWebsite] = useState(partenaire?.website ?? '')
  const [type, setType] = useState<PartenaireType>(partenaire?.type ?? 'sponsor')
  const [description, setDescription] = useState(partenaire?.description ?? '')
  const [isActive, setIsActive] = useState(partenaire?.isActive ?? true)

  const inputClass =
    'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/50'
  const labelClass = 'block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5'

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave({
      id: partenaire?.id ?? Date.now(),
      name,
      logo,
      website,
      type,
      description,
      isActive,
      createdAt: partenaire?.createdAt ?? new Date().toISOString().slice(0, 10),
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
          <h2 className="font-heading text-lg font-bold text-primary">
            {isEditing ? 'Modifier le partenaire' : 'Nouveau partenaire'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Nom */}
          <div>
            <label htmlFor="pf-name" className={labelClass}>
              Nom
            </label>
            <input
              id="pf-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom du partenaire"
              className={inputClass}
            />
          </div>

          {/* Logo (emoji) */}
          <div>
            <label htmlFor="pf-logo" className={labelClass}>
              Logo (emoji)
            </label>
            <input
              id="pf-logo"
              type="text"
              required
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              placeholder="🏢"
              className={cn(inputClass, 'text-2xl text-center')}
            />
          </div>

          {/* Site Web */}
          <div>
            <label htmlFor="pf-website" className={labelClass}>
              Site Web
            </label>
            <input
              id="pf-website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
              className={inputClass}
            />
          </div>

          {/* Type */}
          <div>
            <label htmlFor="pf-type" className={labelClass}>
              Type
            </label>
            <select
              id="pf-type"
              value={type}
              onChange={(e) => setType(e.target.value as PartenaireType)}
              className={inputClass}
            >
              {typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="pf-desc" className={labelClass}>
              Description
            </label>
            <textarea
              id="pf-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description du partenaire…"
              className={cn(inputClass, 'resize-none')}
            />
          </div>

          {/* Actif */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              onClick={() => setIsActive(!isActive)}
              className={cn(
                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                isActive ? 'bg-emerald-500' : 'bg-muted'
              )}
            >
              <span
                className={cn(
                  'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
                  isActive ? 'translate-x-5' : 'translate-x-0'
                )}
              />
            </button>
            <span className="text-sm font-medium text-primary">
              {isActive ? 'Actif' : 'Inactif'}
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2 text-sm font-bold text-accent-foreground shadow-lg hover:opacity-90 transition-opacity"
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
