'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ThemeConfig, ThemeId } from '@/lib/theme-config'

type CategoryCardProps = {
  config: ThemeConfig
  onUpdateDescription: (id: ThemeId, desc: string) => void
  onUpdateKeywords: (id: ThemeId, keywords: string[]) => void
}

const colorVarKeys = ['--accent', '--gold', '--ember', '--quest'] as const

export default function CategoryCard({
  config,
  onUpdateDescription,
  onUpdateKeywords,
}: CategoryCardProps) {
  const [desc, setDesc] = useState(config.description)
  const [newKeyword, setNewKeyword] = useState('')

  function handleDescBlur() {
    if (desc !== config.description) {
      onUpdateDescription(config.id, desc)
    }
  }

  function addKeyword() {
    const kw = newKeyword.trim()
    if (kw && !config.decorKeywords.includes(kw)) {
      onUpdateKeywords(config.id, [...config.decorKeywords, kw])
    }
    setNewKeyword('')
  }

  function removeKeyword(keyword: string) {
    onUpdateKeywords(
      config.id,
      config.decorKeywords.filter((k) => k !== keyword)
    )
  }

  function handleKeywordKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addKeyword()
    }
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-5 flex flex-col gap-4">
      {/* Header: icon circle + label */}
      <div className="flex items-center gap-3">
        <div
          className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
          style={{ background: config.cssVars['--accent'] }}
        >
          {config.label.charAt(0)}
        </div>
        <div>
          <h3 className="font-heading font-bold text-primary text-sm leading-tight">
            {config.label}
          </h3>
          <p className="text-[11px] text-muted-foreground">{config.id}</p>
        </div>
      </div>

      {/* Editable description */}
      <div>
        <label
          htmlFor={`desc-${config.id}`}
          className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5"
        >
          Description
        </label>
        <textarea
          id={`desc-${config.id}`}
          rows={2}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          onBlur={handleDescBlur}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
        />
      </div>

      {/* Keywords */}
      <div>
        <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
          Mots-clés décoratifs
        </span>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {config.decorKeywords.map((kw) => (
            <span
              key={kw}
              className="inline-flex items-center gap-1 bg-muted rounded-full px-2 py-0.5 text-xs text-primary"
            >
              {kw}
              <button
                onClick={() => removeKeyword(kw)}
                className="text-muted-foreground hover:text-red-500 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={handleKeywordKeyDown}
            placeholder="Ajouter…"
            className="flex-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
          <button
            onClick={addKeyword}
            disabled={!newKeyword.trim()}
            className={cn(
              'rounded-lg p-1.5 transition-colors',
              newKeyword.trim()
                ? 'text-accent hover:bg-accent/10'
                : 'text-muted-foreground/40 cursor-not-allowed'
            )}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Color preview strip */}
      <div>
        <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
          Palette
        </span>
        <div className="flex items-center gap-1.5">
          {colorVarKeys.map((key) => (
            <div key={key} className="flex flex-col items-center gap-1">
              <div
                className="h-6 w-6 rounded-md border border-border"
                style={{ background: config.cssVars[key] }}
                title={`${key}: ${config.cssVars[key]}`}
              />
              <span className="text-[9px] text-muted-foreground leading-none">
                {key.replace('--', '')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
