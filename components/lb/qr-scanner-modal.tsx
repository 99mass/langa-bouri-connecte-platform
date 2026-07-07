"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, CheckCircle2, QrCode, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function QrScannerModal({
  title,
  onScanSuccess,
  onClose,
  isLast = false,
}: {
  title: string
  onScanSuccess: () => void
  onClose: () => void
  isLast?: boolean
}) {
  const [scanning, setScanning] = useState(true)
  const [success, setSuccess] = useState(false)
  const [flash, setFlash] = useState(false)
  const [hasCamera, setHasCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Randomized emojis for celebration rain (simpler, prettier)
  const [celebrationItems] = useState(() =>
    Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      emoji: ["🎁", "🎉", "✨", "🏆", "🌟", "👑"][i % 6],
      left: `${Math.random() * 80 + 10}%`,
      delay: `${Math.random() * 1.5}s`,
      duration: `${Math.random() * 1.2 + 2}s`,
      size: `${Math.random() * 8 + 12}px`,
    }))
  )

  // Request actual camera stream on mount
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        streamRef.current = stream
        setHasCamera(true)
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      })
      .catch((err) => {
        console.warn("Camera access denied or unavailable, using simulation backdrop:", err)
        setHasCamera(false)
      })

    // Simulate scan detection after 2.8 seconds
    const scanTimer = setTimeout(() => {
      setScanning(false)
      setSuccess(true)
      setFlash(true)
    }, 2800)

    return () => {
      clearTimeout(scanTimer)
      // Stop all camera tracks when scanner closes
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // Close scanner and report success to page state (2.0s for the winner screen)
  useEffect(() => {
    if (success) {
      const closeTimer = setTimeout(() => {
        onScanSuccess()
      }, 2000)
      return () => clearTimeout(closeTimer)
    }
  }, [success, onScanSuccess])

  function handleCloseClick() {
    if (success) {
      onScanSuccess()
    } else {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Scanner de QR Code">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={handleCloseClick} />

      {/* Screen flash visual effect on scan success */}
      <div
        className={cn(
          "absolute inset-0 bg-white pointer-events-none transition-opacity duration-300 z-[75]",
          flash ? "opacity-100" : "opacity-0"
        )}
        onTransitionEnd={() => setFlash(false)}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl bg-[#131110] border border-white/10 text-white shadow-2xl animate-unfurl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-amber-400" />
            <span className="font-heading text-sm font-bold uppercase tracking-wider">Scanner QR Code</span>
          </div>
          <button
            type="button"
            onClick={handleCloseClick}
            className="rounded-full p-1 text-white/40 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Fermer le scanner"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Viewfinder area */}
        <div className="relative aspect-square w-full bg-black flex items-center justify-center overflow-hidden">
          {scanning ? (
            <>
              {/* Actual live camera stream */}
              {hasCamera ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                /* Fallback grid if camera blocked/unavailable */
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
              )}
              
              {/* Laser scan line overlay */}
              <div className="absolute h-48 w-48 border-[2.5px] border-white/25 rounded-2xl flex items-center justify-center z-10">
                <div className="absolute left-0 right-0 h-0.5 bg-amber-400 shadow-[0_0_12px_2.5px_rgba(251,191,36,0.9)] animate-bounce" />
              </div>

              {/* Viewfinder corner brackets */}
              <div className="absolute h-52 w-52 pointer-events-none z-10">
                <div className="absolute top-0 left-0 h-6 w-6 border-t-4 border-l-4 border-amber-400 rounded-tl-xl" />
                <div className="absolute top-0 right-0 h-6 w-6 border-t-4 border-r-4 border-amber-400 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 h-6 w-6 border-b-4 border-l-4 border-amber-400 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 h-6 w-6 border-b-4 border-r-4 border-amber-400 rounded-br-xl" />
              </div>

              <div className="absolute bottom-6 flex items-center gap-2 rounded-full bg-black/60 px-4 py-1.5 ring-1 ring-white/15 z-10">
                <Camera className="h-4 w-4 text-amber-400 animate-pulse" />
                <span className="font-sans text-[11px] font-semibold tracking-wide">
                  {hasCamera ? "Caméra Active" : "Accès caméra requis"}
                </span>
              </div>
            </>
          ) : (
            /* Success state overlay with raining gifts & confetti - simplified & prettier */
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md overflow-hidden z-20">
              {/* Confetti / Gifts rain */}
              <style>{`
                @keyframes confetti-rain {
                  0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
                  10% { opacity: 1; }
                  90% { opacity: 1; }
                  100% { transform: translateY(320px) rotate(360deg); opacity: 0; }
                }
                .confetti-item {
                  position: absolute;
                  top: -20px;
                  animation: confetti-rain linear infinite;
                  pointer-events: none;
                }
              `}</style>
              
              {celebrationItems.map((item) => (
                <span
                  key={item.id}
                  className="confetti-item"
                  style={{
                    left: item.left,
                    animationDelay: item.delay,
                    animationDuration: item.duration,
                    fontSize: item.size,
                  }}
                >
                  {item.emoji}
                </span>
              ))}

              <div className="flex flex-col items-center gap-3 animate-scale-up text-center px-6">
                <CheckCircle2 className="h-14 w-14 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)] animate-bounce" />
                
                <div className="mt-2">
                  <h4 className="font-heading text-base font-black uppercase tracking-wider text-primary">
                    {isLast ? "Quête Complétée ! 🏆" : "Code Validé !"}
                  </h4>
                  <p className="font-serif text-[11px] italic text-muted-foreground mt-1 max-w-[220px] leading-relaxed">
                    {isLast 
                      ? "Vous avez triomphé de l'expédition et débloqué le Trésor Final."
                      : "L'étape a été enregistrée dans votre journal."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="px-6 py-6 text-center">
          <p className="font-heading text-xs font-semibold uppercase tracking-widest text-amber-400/70">
            Étape active
          </p>
          <p className="mt-1 font-sans text-sm font-bold text-white truncate px-2">
            {title}
          </p>
          <p className="mt-2 font-sans text-xs text-white/40 max-w-[240px] mx-auto leading-relaxed">
            Positionnez le code dans le viseur pour enregistrer votre passage.
          </p>
        </div>
      </div>
    </div>
  )
}
