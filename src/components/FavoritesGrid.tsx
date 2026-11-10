"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Heart, Search } from "lucide-react"
import { ToolCard } from "@/components/ToolCard"
import { favoritesEvent, favoritesKey, readFavorites } from "@/lib/favorites"

type Tool = { id: string; name: string; slug: string; description: string; difficulty: string; category: { name: string } }
export function FavoritesGrid({ tools }: { tools: Tool[] }) {
  const [slugs, setSlugs] = useState<string[] | null>(null)
  useEffect(() => {
    const update = () => setSlugs(readFavorites())
    const onStorage = (event: StorageEvent) => { if (event.key === favoritesKey || event.key === null) update() }
    const frame = requestAnimationFrame(update)
    window.addEventListener(favoritesEvent, update)
    window.addEventListener("storage", onStorage)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener(favoritesEvent, update)
      window.removeEventListener("storage", onStorage)
    }
  }, [])
  const favorites = useMemo(() => tools.filter((tool) => slugs?.includes(tool.slug)), [slugs, tools])
  if (slugs === null) return <div className="h-64 animate-pulse rounded-3xl bg-muted" />
  if (!favorites.length) return <div className="rounded-3xl border border-dashed py-20 text-center"><Heart className="mx-auto size-8 text-muted-foreground" /><h2 className="mt-4 text-xl font-semibold">Your shortlist is empty</h2><p className="mt-2 text-muted-foreground">Save useful tools as you explore the catalog.</p><Link href="/tools" className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background"><Search className="size-4" /> Explore tools</Link></div>
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{favorites.map((tool) => <ToolCard key={tool.id} tool={tool} />)}</div>
}
