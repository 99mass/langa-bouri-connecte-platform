'use client'

import { useState } from 'react'
import { X, Save, Palette } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/lib/theme-config'

type CategoryFormProps = {
  category?: ThemeConfig
  onSave: (data: ThemeConfig) => void
  onClose: () => void
  existingIds: string[]
}

const iconOptions = [
  { value: 'landmark', label: 'Monument / Culture' },
  { value: 'trophy', label: 'Trophée / Sport' },
  { value: 'tree-pine', label: 'Arbre / Nature' },
  { value: 'scroll', label: 'Parchemin / Histoire' },
  { value: 'atom', label: 'Atome / Science' },
  { value: 'utensils-crossed', label: 'Cuisine / Gastronomie' },
]

const PALETTE_PRESETS = [
  {
    name: "Sable & Terre",
    colors: { accent: '#d4a373', gold: '#ffd700', ember: '#e76f51', quest: '#2a9d8f' }
  },
  {
    name: "Forêt Casamance",
    colors: { accent: '#2d6a4f', gold: '#74c69d', ember: '#95d5b2', quest: '#1b4332' }
  },
  {
    name: "Bleu Atlantique",
    colors: { accent: '#1d3557', gold: '#a8dadc', ember: '#e63946', quest: '#457b9d' }
  },
  {
    name: "Pourpre Royal",
    colors: { accent: '#7209b7', gold: '#f72585', ember: '#4cc9f0', quest: '#3f37c9' }
  },
  {
    name: "Aurore Volcanique",
    colors: { accent: '#ff4d6d', gold: '#ffb3c1', ember: '#800f2f', quest: '#ff758f' }
  }
]

export default function CategoryForm({ category, onSave, onClose, existingIds }: CategoryFormProps) {
  const isEditing = !!category

  const [id, setId] = useState(category?.id ?? '')
  const [label, setLabel] = useState(category?.label ?? '')
  const [iconName, setIconName] = useState(category?.iconName ?? 'landmark')
  const [description, setDescription] = useState(category?.description ?? '')
  
  // Custom colors with simple color pickers
  const [accentColor, setAccentColor] = useState(category?.cssVars['--accent'] || '#e2b13c')
  const [goldColor, setGoldColor] = useState(category?.cssVars['--gold'] || '#ffd700')
  const [emberColor, setEmberColor] = useState(category?.cssVars['--ember'] || '#ff4500')
  const [questColor, setQuestColor] = useState(category?.cssVars['--quest'] || '#00ced1')

  const [keywordInput, setKeywordInput] = useState('')
  const [keywords, setKeywords] = useState<string[]>(category?.decorKeywords ?? [])

  const inputClass =
    'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/50'
  const labelClass = 'block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5'

  function addKeyword() {
    const val = keywordInput.trim()
    if (val && !keywords.includes(val)) {
      setKeywords([...keywords, val])
    }
    setKeywordInput('')
  }

  function removeKeyword(kw: string) {
    setKeywords(keywords.filter(k => k !== kw))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const cleanId = id.trim().toLowerCase().replace(/\s+/g, '-')
    if (!cleanId) return

    if (!isEditing && existingIds.includes(cleanId)) {
      alert("Cet identifiant de catégorie existe déjà !")
      return
    }

    const data: ThemeConfig = {
      id: cleanId as any,
      label,
      iconName: iconName as any,
      description,
      cssVars: {
        '--accent': accentColor,
        '--accent-foreground': '#ffffff',
        '--gold': goldColor,
        '--gold-foreground': '#000000',
        '--wood': '#2c1e11',
        '--ember': emberColor,
        '--quest': questColor,
        '--primary': '#1d1916',
        '--primary-foreground': '#ffffff',
      },
      bodyClass: `theme-${cleanId}`,
      decorKeywords: keywords
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
      <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-unfurl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
          <h2 className="font-heading text-lg font-bold text-primary">
            {isEditing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
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
          {/* Identifiant + Nom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cat-id" className={labelClass}>
                Identifiant (Unique) *
              </label>
              <input
                id="cat-id"
                type="text"
                required
                disabled={isEditing}
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Ex: cinema"
                className={cn(inputClass, isEditing && 'bg-muted text-muted-foreground cursor-not-allowed')}
              />
            </div>
            <div>
              <label htmlFor="cat-label" className={labelClass}>
                Nom de la catégorie *
              </label>
              <input
                id="cat-label"
                type="text"
                required
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Ex: Cinéma & Arts"
                className={inputClass}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="cat-desc" className={labelClass}>
              Description *
            </label>
            <textarea
              id="cat-desc"
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Courte description du thème..."
              className={cn(inputClass, 'resize-none')}
            />
          </div>

          {/* Icône de catégorie */}
          <div>
            <label htmlFor="cat-icon" className={labelClass}>
              Icône thématique
            </label>
            <select
              id="cat-icon"
              value={iconName}
              onChange={(e) => setIconName(e.target.value as any)}
              className={inputClass}
            >
              {iconOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Palette de couleurs */}
          <div className="bg-muted/40 p-4 rounded-xl border border-border/40 space-y-3">
            <h3 className="text-xs font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider">
              <Palette className="h-4 w-4 text-amber-500" />
              Palette de couleurs (Thème)
            </h3>
            
            {/* Presets List */}
            <div>
              <span className="block text-[10px] font-bold text-muted-foreground/80 uppercase mb-1.5">
                Appliquer une palette prédéfinie :
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PALETTE_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setAccentColor(preset.colors.accent)
                      setGoldColor(preset.colors.gold)
                      setEmberColor(preset.colors.ember)
                      setQuestColor(preset.colors.quest)
                    }}
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border border-border bg-background text-[10px] font-bold text-primary hover:border-amber-500/40 hover:bg-muted/40 transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <div className="flex gap-0.5 shrink-0">
                      <span className="w-2 h-2 rounded-full border border-black/10" style={{ backgroundColor: preset.colors.accent }} />
                      <span className="w-2 h-2 rounded-full border border-black/10" style={{ backgroundColor: preset.colors.gold }} />
                      <span className="w-2 h-2 rounded-full border border-black/10" style={{ backgroundColor: preset.colors.ember }} />
                      <span className="w-2 h-2 rounded-full border border-black/10" style={{ backgroundColor: preset.colors.quest }} />
                    </div>
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Couleur Accent */}
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                  Couleur Accent
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor.startsWith('#') ? accentColor : '#e2b13c'}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="h-8 w-8 rounded cursor-pointer border border-border"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="flex-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-primary"
                  />
                </div>
              </div>

              {/* Couleur Or */}
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                  Couleur Or
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={goldColor.startsWith('#') ? goldColor : '#ffd700'}
                    onChange={(e) => setGoldColor(e.target.value)}
                    className="h-8 w-8 rounded cursor-pointer border border-border"
                  />
                  <input
                    type="text"
                    value={goldColor}
                    onChange={(e) => setGoldColor(e.target.value)}
                    className="flex-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-primary"
                  />
                </div>
              </div>

              {/* Couleur Braise */}
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                  Couleur Braise
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={emberColor.startsWith('#') ? emberColor : '#ff4500'}
                    onChange={(e) => setEmberColor(e.target.value)}
                    className="h-8 w-8 rounded cursor-pointer border border-border"
                  />
                  <input
                    type="text"
                    value={emberColor}
                    onChange={(e) => setEmberColor(e.target.value)}
                    className="flex-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-primary"
                  />
                </div>
              </div>

              {/* Couleur Quête */}
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                  Couleur Quête
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={questColor.startsWith('#') ? questColor : '#00ced1'}
                    onChange={(e) => setQuestColor(e.target.value)}
                    className="h-8 w-8 rounded cursor-pointer border border-border"
                  />
                  <input
                    type="text"
                    value={questColor}
                    onChange={(e) => setQuestColor(e.target.value)}
                    className="flex-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mots-clés */}
          <div>
            <label className={labelClass}>Mots-clés décoratifs</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {keywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1 bg-muted rounded-full px-2.5 py-0.5 text-xs text-primary"
                >
                  {kw}
                  <button
                    type="button"
                    onClick={() => removeKeyword(kw)}
                    className="text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addKeyword()
                  }
                }}
                placeholder="Ajouter un mot-clé..."
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
              <button
                type="button"
                onClick={addKeyword}
                className="rounded-xl bg-muted hover:bg-muted/80 text-primary px-4 py-2 text-sm font-semibold transition-colors cursor-pointer"
              >
                Ajouter
              </button>
            </div>
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
