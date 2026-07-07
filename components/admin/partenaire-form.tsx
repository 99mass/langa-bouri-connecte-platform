'use client'

import { useState } from 'react'
import { X, Save, Image as ImageIcon } from 'lucide-react'
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
  const [org, setOrg] = useState(partenaire?.org ?? '')
  const [email, setEmail] = useState(partenaire?.email ?? '')
  const [phone, setPhone] = useState(partenaire?.phone ?? '')
  const [logo, setLogo] = useState(partenaire?.logo ?? '')
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
      org,
      email,
      phone,
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
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-unfurl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
          <h2 className="font-heading text-lg font-bold text-primary">
            {isEditing ? 'Modifier le partenaire' : 'Nouveau partenaire'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Nom complet de contact + Organisation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pf-org" className={labelClass}>
                Organisation / Entreprise *
              </label>
              <input
                id="pf-org"
                type="text"
                required
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                placeholder="Ex: Orange Sénégal"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="pf-name" className={labelClass}>
                Nom du contact principal *
              </label>
              <input
                id="pf-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Fatoumata Diop"
                className={inputClass}
              />
            </div>
          </div>

          {/* Email de contact + Téléphone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pf-email" className={labelClass}>
                Adresse Email *
              </label>
              <input
                id="pf-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemple.com"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="pf-phone" className={labelClass}>
                Téléphone
              </label>
              <input
                id="pf-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+221 77 123 45 67"
                className={inputClass}
              />
            </div>
          </div>

          {/* Site Web + Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div>
              <label htmlFor="pf-type" className={labelClass}>
                Type de Partenariat
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
          </div>

          {/* Logo (Upload local) */}
          <div>
            <label className={labelClass}>Logo du partenaire (Upload local)</label>
            {logo && logo.startsWith('data:image') ? (
              <div className="relative rounded-xl border border-border overflow-hidden bg-muted/20 h-24 w-24 flex items-center justify-center group mt-2">
                <img
                  src={logo}
                  alt="Aperçu logo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setLogo('')}
                    className="rounded-lg bg-rose-600 hover:bg-rose-700 text-white p-1.5 text-xs font-bold shadow-md transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative rounded-xl border-2 border-dashed border-border/80 hover:border-amber-500/40 bg-muted/10 transition-colors h-24 flex flex-col items-center justify-center p-4 text-center group cursor-pointer mt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setLogo(reader.result as string)
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
                <ImageIcon className="h-5 w-5 text-muted-foreground/60 mb-1 group-hover:text-amber-500 transition-colors" />
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider group-hover:text-primary transition-colors">
                  Sélectionner un logo
                </span>
                <span className="text-[8px] text-muted-foreground/60 mt-0.5">
                  Format PNG, JPG, WebP
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="pf-desc" className={labelClass}>
              Description / Message de partenariat *
            </label>
            <textarea
              id="pf-desc"
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre marque ou le message transmis lors de la soumission de la candidature..."
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
