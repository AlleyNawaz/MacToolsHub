"use client"

import { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { favoritesEvent, favoritesKey, readFavorites, writeFavorites } from "@/lib/favorites"

export function FavoriteButton({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState(false)

  useEffect(() => {
    const sync = () => setSaved(readFavorites().includes(slug))
    const onStorage = (event: StorageEvent) => { if (event.key === favoritesKey || event.key === null) sync() }
    const frame = requestAnimationFrame(sync)
    window.addEventListener(favoritesEvent, sync)
    window.addEventListener("storage", onStorage)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener(favoritesEvent, sync)
      window.removeEventListener("storage", onStorage)
    }
  }, [slug])

  function toggle() {
    const values = readFavorites()
    const next = values.includes(slug) ? values.filter((value) => value !== slug) : [...values, slug]
    const persisted = writeFavorites(next)
    setSaveError(!persisted)
    if (persisted) setSaved(next.includes(slug))
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn("relative z-10 inline-flex items-center justify-center gap-2 rounded-full border bg-background/80 font-medium shadow-sm transition hover:-translate-y-0.5 hover:bg-muted", compact ? "size-9" : "h-10 px-4 text-sm")}
      aria-label={saveError ? "Could not save favorite in this browser" : saved ? "Remove from favorites" : "Save to favorites"}
      aria-pressed={saved}
      title={saveError ? "Could not save in this browser" : undefined}
    >
      <Heart className={cn("size-4", saved && "fill-rose-500 text-rose-500")} />
      {!compact && (saveError ? "Save failed" : saved ? "Saved" : "Save tool")}
    </button>
  )
}
