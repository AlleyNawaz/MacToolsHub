import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { ToolsExplorer } from "@/components/ToolsExplorer"

export const metadata: Metadata = { title: "All macOS developer tools", description: "Browse and search the complete MacTools Hub catalog." }

export default async function ToolsPage() {
  const [tools, categories] = await Promise.all([
    prisma.tool.findMany({ include: { category: true }, orderBy: { name: "asc" } }),
    prisma.category.findMany({ select: { name: true, slug: true }, orderBy: { name: "asc" } }),
  ])
  return <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6"><div className="mb-10 max-w-3xl"><p className="text-sm font-semibold text-sky-500">THE CATALOG</p><h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Every tool. One clean index.</h1><p className="mt-4 text-lg leading-8 text-muted-foreground">Search the curated macOS stack by category, skill level, name, or workflow.</p></div><ToolsExplorer tools={tools} categories={categories} /></div>
}
