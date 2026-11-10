import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ToolCard } from "@/components/ToolCard"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() { return (await prisma.category.findMany({ select: { slug: true } })).map(({ slug }) => ({ slug })) }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await prisma.category.findUnique({ where: { slug }, select: { name: true, description: true } })
  return category ? { title: category.name, description: category.description } : { title: "Category not found" }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const category = await prisma.category.findUnique({ where: { slug }, include: { tools: { orderBy: { name: "asc" }, include: { category: true } } } })
  if (!category) notFound()
  return <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6"><Link href="/categories" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> All categories</Link><div className="mt-10 max-w-3xl"><p className="text-sm font-semibold text-sky-500">{category.tools.length} CURATED TOOLS</p><h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{category.name}</h1><p className="mt-4 text-lg leading-8 text-muted-foreground">{category.description}</p></div>{category.tools.length ? <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{category.tools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}</div> : <div className="mt-12 rounded-3xl border border-dashed py-20 text-center text-muted-foreground">Tools are being curated for this category.</div>}</div>
}
