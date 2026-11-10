import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { FavoritesGrid } from "@/components/FavoritesGrid"

export const metadata: Metadata = { title: "My favorite tools", description: "Your saved Mac developer toolkit." }
export default async function FavoritesPage() { const tools = await prisma.tool.findMany({ include: { category: true }, orderBy: { name: "asc" } }); return <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6"><div className="mb-10 max-w-3xl"><p className="text-sm font-semibold text-rose-500">YOUR TOOLKIT</p><h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Saved for later.</h1><p className="mt-4 text-lg text-muted-foreground">Favorites are saved in this browser so you can return to your shortlist later.</p></div><FavoritesGrid tools={tools} /></div> }
