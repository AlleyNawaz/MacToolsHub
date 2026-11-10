import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = { title: "Tool categories", description: "Explore macOS developer tools by workflow and discipline." }

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({ include: { _count: { select: { tools: true } }, tools: { take: 4, orderBy: { name: "asc" }, select: { name: true } } }, orderBy: { name: "asc" } })
  return <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6"><div className="max-w-3xl"><p className="text-sm font-semibold text-sky-500">{categories.length} WORKFLOWS</p><h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Find your corner of the stack.</h1><p className="mt-4 text-lg text-muted-foreground">Focused collections for every stage of building, shipping, and maintaining software on a Mac.</p></div><div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{categories.map((category, index) => <Link key={category.id} href={`/category/${category.slug}`} className="group rounded-3xl border bg-card p-6 transition hover:-translate-y-1 hover:border-sky-500/30 hover:shadow-xl"><div className="flex items-start justify-between"><span className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span><ArrowUpRight className="size-5 text-muted-foreground transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-sky-500" /></div><h2 className="mt-8 text-xl font-semibold">{category.name}</h2><p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{category.description}</p><p className="mt-5 border-t pt-4 text-xs text-muted-foreground"><span className="font-semibold text-foreground">{category._count.tools} tools</span> · {category.tools.map((tool) => tool.name).join(", ")}</p></Link>)}</div></div>
}
