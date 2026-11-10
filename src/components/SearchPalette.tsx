"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Folder, Search, Wrench, X } from "lucide-react"
import { BrandMark } from "@/components/BrandMark"

type SearchTool = { name: string; slug: string; description: string; category: { name: string } }
type SearchCategory = { name: string; slug: string }
type Result = { kind: "tool" | "category"; name: string; description: string; path: string }

export function SearchPalette({ tools, categories }: { tools: SearchTool[]; categories: SearchCategory[] }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMac, setIsMac] = useState(true)
  const [restoreFocus, setRestoreFocus] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsMac(/Mac|iPhone|iPad/.test(navigator.platform)))
    return () => cancelAnimationFrame(frame)
  }, [])

  function closeSearch() {
    setOpen(false)
    setQuery("")
    setActiveIndex(0)
    setRestoreFocus(true)
  }

  useEffect(() => {
    if (open || !restoreFocus) return
    const frame = requestAnimationFrame(() => {
      triggerRef.current?.focus()
      setRestoreFocus(false)
    })
    return () => cancelAnimationFrame(frame)
  }, [open, restoreFocus])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        if (open) closeSearch()
        else setOpen(true)
      } else if (event.key === "Escape" && open) {
        event.preventDefault()
        closeSearch()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const frame = requestAnimationFrame(() => inputRef.current?.focus())
    return () => {
      cancelAnimationFrame(frame)
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const results = useMemo<Result[]>(() => {
    const value = query.trim().toLowerCase()
    const matchingTools = (value
      ? tools.filter((tool) => `${tool.name} ${tool.description} ${tool.category.name}`.toLowerCase().includes(value)).slice(0, 8)
      : tools.slice(0, 7)
    ).map((tool) => ({ kind: "tool" as const, name: tool.name, description: `${tool.category.name} · ${tool.description}`, path: `/tool/${tool.slug}` }))
    const matchingCategories = value
      ? categories.filter((category) => category.name.toLowerCase().includes(value)).slice(0, 5).map((category) => ({ kind: "category" as const, name: category.name, description: "Category", path: `/category/${category.slug}` }))
      : []
    return [...matchingTools, ...matchingCategories]
  }, [query, tools, categories])

  function go(path: string) {
    closeSearch()
    router.push(path)
  }

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((index) => (index + 1) % Math.max(1, results.length))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((index) => (index - 1 + Math.max(1, results.length)) % Math.max(1, results.length))
    } else if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault()
      go(results[activeIndex].path)
    }
  }

  function trapFocus(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab" || !dialogRef.current) return
    const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("input, button, a[href]"))
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first?.focus()
    }
  }

  return (
    <>
      <button ref={triggerRef} type="button" onClick={() => setOpen(true)} className="flex h-10 w-full items-center gap-2 rounded-xl border bg-card px-3 text-sm text-muted-foreground shadow-sm transition hover:bg-muted md:w-56 lg:w-64" aria-label="Search tools and categories" aria-haspopup="dialog" aria-expanded={open}>
        <Search className="size-4" />
        <span className="hidden flex-1 text-left sm:inline">Search the toolkit</span>
        <kbd className="hidden rounded-md border bg-background px-1.5 py-0.5 font-mono text-[10px] sm:inline">{isMac ? "⌘ K" : "Ctrl K"}</kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-950/60 px-3 pt-[8vh] backdrop-blur-sm sm:px-4 sm:pt-[12vh]" onMouseDown={(event) => { if (event.target === event.currentTarget) closeSearch() }}>
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Search tools and categories" onKeyDown={trapFocus} className="w-full max-w-2xl overflow-hidden rounded-3xl border bg-background shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 border-b px-4 sm:px-5">
              <Search className="size-5 shrink-0 text-muted-foreground" />
              <input ref={inputRef} value={query} onChange={(event) => { setQuery(event.target.value); setActiveIndex(0) }} onKeyDown={onInputKeyDown} role="combobox" aria-expanded="true" aria-controls="search-results" aria-activedescendant={results[activeIndex] ? `search-result-${activeIndex}` : undefined} aria-label="Search query" className="h-16 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground" placeholder="Search tools or categories…" />
              <button type="button" onClick={closeSearch} className="rounded-lg p-2 hover:bg-muted" aria-label="Close search"><X className="size-4" /></button>
            </div>
            <div id="search-results" role="listbox" aria-label="Search results" className="max-h-[58vh] overflow-y-auto p-3">
              <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{query ? "Results" : "Suggested tools"}</p>
              {results.length ? results.map((item, index) => (
                <button id={`search-result-${index}`} role="option" aria-selected={index === activeIndex} key={item.path} type="button" onMouseEnter={() => setActiveIndex(index)} onClick={() => go(item.path)} className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${index === activeIndex ? "bg-muted" : "hover:bg-muted"}`}>
                  {item.kind === "tool" ? <BrandMark name={item.name} className="size-10 rounded-xl text-xs" /> : <Folder className="size-10 shrink-0 rounded-xl bg-muted p-2.5 text-sky-500" />}
                  <span className="min-w-0 flex-1"><span className="block font-medium">{item.name}</span><span className="block truncate text-xs text-muted-foreground">{item.description}</span></span>
                </button>
              )) : <div className="px-3 py-10 text-center text-sm text-muted-foreground">No matches. Try a shorter search.</div>}
            </div>
            <div className="flex items-center gap-4 border-t bg-muted/40 px-5 py-3 text-xs text-muted-foreground"><span>↑ ↓ Select</span><span>↵ Open</span><span>esc Close</span><span className="ml-auto hidden items-center gap-1 sm:flex"><Wrench className="size-3" /> {tools.length} tools</span></div>
          </div>
        </div>
      )}
    </>
  )
}
