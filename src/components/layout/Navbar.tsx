import { Suspense } from "react"
import Link from "next/link"
import { Command } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ThemeToggle } from "@/components/ThemeToggle"
import { SearchPalette } from "@/components/SearchPalette"
import { PrimaryNav } from "@/components/layout/PrimaryNav"

export async function Navbar() {
  const [tools, categories] = await Promise.all([
    prisma.tool.findMany({ select: { name: true, slug: true, description: true, category: { select: { name: true } } }, orderBy: { name: "asc" } }),
    prisma.category.findMany({ select: { name: true, slug: true }, orderBy: { name: "asc" } }),
  ])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" aria-label="MacTools Hub home" className="mr-auto flex shrink-0 items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-9 place-items-center rounded-xl bg-foreground text-background"><Command className="size-5" /></span>
          <span className="hidden sm:inline">MacTools<span className="text-sky-500"> Hub</span></span>
        </Link>
        <Suspense fallback={null}><PrimaryNav /></Suspense>
        <div className="w-11 sm:w-auto"><SearchPalette tools={tools} categories={categories} /></div>
        <ThemeToggle />
      </div>
      <Suspense fallback={null}><PrimaryNav mobile /></Suspense>
    </header>
  )
}
