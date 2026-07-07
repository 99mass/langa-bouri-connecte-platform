'use client'

import { useState, useEffect } from 'react'
import { mediaDB } from '@/lib/media-db'
import { cn } from '@/lib/utils'

type MediaRendererProps = {
  src?: string
  type: 'image' | 'video'
  alt?: string
  className?: string
  // Video specific attributes
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  playsInline?: boolean
}

export default function MediaRenderer({
  src,
  type,
  alt = 'Sponsor ad',
  className,
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true
}: MediaRendererProps) {
  const [resolvedSrc, setResolvedSrc] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!src) {
      setResolvedSrc('')
      return
    }

    if (src.startsWith('db://')) {
      const key = src.replace('db://', '')
      setLoading(true)
      mediaDB.get(key)
        .then((data) => {
          setResolvedSrc(data)
          setLoading(false)
        })
        .catch((e) => {
          console.error('Failed to load media from IndexedDB:', e)
          setLoading(false)
        })
    } else {
      setResolvedSrc(src)
    }
  }, [src])

  if (!src) return null

  if (loading) {
    return (
      <div className={cn("bg-muted/10 animate-pulse flex items-center justify-center text-xs text-muted-foreground/60 rounded-lg", className)}>
        Chargement...
      </div>
    )
  }

  if (type === 'video') {
    return (
      <video
        src={resolvedSrc || undefined}
        className={className}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
      />
    )
  }

  return (
    <img
      src={resolvedSrc || undefined}
      alt={alt}
      className={className}
    />
  )
}
