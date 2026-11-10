"use client"

import { useMemo, useState } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { ToolCard } from "@/components/ToolCard"

type Tool = { id: string; name: string; slug: string; description: string; difficulty: string; tags: string; installCommand: string; category: { name: string; slug: string } }

export function ToolsExplorer({ tools, categories, initialCategory = "all" }: { tools: Tool[]; categories: { name: string; slug: string }[]; initialCategory?: string }) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState(initialCategory)
  const [difficulty, setDifficulty] = useState("all")
  const [sort, setSort] = useState("name-asc")

  const results = useMemo(() => {
    const value = query.trim().toLowerCase()
    const filtered = tools.filter((tool) => {
      const matchesQuery = !value || `${tool.name} ${tool.description} ${tool.tags} ${tool.category.name} ${tool.installCommand}`.toLowerCase().includes(value)
      return matchesQuery && (category === "all" || tool.category.slug === category) && (difficulty === "all" || tool.difficulty === difficulty)
    })
    const level = { BEGINNER: 0, INTERMEDIATE: 1, ADVANCED: 2 }
    return filtered.sort((a, b) => {
      if (sort === "name-desc") return b.name.localeCompare(a.name)
      if (sort === "difficulty") return (level[a.difficulty as keyof typeof level] ?? 3) - (level[b.difficulty as keyof typeof level] ?? 3) || a.name.localeCompare(b.name)
      return a.name.localeCompare(b.name)
    })
  }, [tools, query, category, difficulty, sort])

  return (
    <div>
      <div className="mb-8 rounded-2xl border bg-background/90 p-3 shadow-lg shadow-black/5 backdrop-blur-xl md:sticky md:top-16 md:z-30 lg:top-20">
        <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
          <label className="relative flex-1"><Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><span className="sr-only">Search tools</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by tool, workflow, or command…" className="h-11 w-full rounded-xl border bg-card pl-10 pr-4 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10" /></label>
          <label className="relative"><span className="sr-only">Category</span><select value={category} onChange={(event) => setCategory(event.target.value)} className="h-11 min-w-48 appearance-none rounded-xl border bg-card pl-4 pr-9 text-sm outline-none"><option value="all">All categories</option>{categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select><SlidersHorizontal className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /></label>
          <label><span className="sr-only">Difficulty</span><select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} className="h-11 min-w-40 rounded-xl border bg-card px-4 text-sm outline-none"><option value="all">Any difficulty</option><option value="BEGINNER">Beginner</option><option value="INTERMEDIATE">Intermediate</option><option value="ADVANCED">Advanced</option></select></label>
          <label><span className="sr-only">Sort tools</span><select value={sort} onChange={(event) => setSort(event.target.value)} className="h-11 min-w-36 rounded-xl border bg-card px-4 text-sm outline-none"><option value="name-asc">Name A–Z</option><option value="name-desc">Name Z–A</option><option value="difficulty">Easiest first</option></select></label>
        </div>
      </div>
      <div className="mb-5 flex items-center justify-between"><p aria-live="polite" className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">{results.length}</span> tools found</p>{(query || category !== "all" || difficulty !== "all" || sort !== "name-asc") && <button type="button" onClick={() => { setQuery(""); setCategory("all"); setDifficulty("all"); setSort("name-asc") }} className="text-sm font-medium text-sky-600 dark:text-sky-400">Reset controls</button>}</div>
      {results.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{results.map((tool) => <ToolCard key={tool.id} tool={tool} />)}</div> : <div className="rounded-3xl border border-dashed py-24 text-center"><p className="font-semibold">No matching tools</p><p className="mt-2 text-sm text-muted-foreground">Try a broader search or clear a filter.</p></div>}
    </div>
  )
}
