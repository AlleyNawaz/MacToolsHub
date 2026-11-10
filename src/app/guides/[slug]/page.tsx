import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { guides } from "@/data/editorial"
import { ToolCard } from "@/components/ToolCard"

type Props = { params: Promise<{ slug: string }> }
export function generateStaticParams() { return guides.map(({ slug }) => ({ slug })) }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const guide = guides.find((item) => item.slug === slug); return guide ? { title: guide.title, description: guide.description } : { title: "Guide not found" } }
export default async function GuidePage({ params }: Props) { const { slug } = await params; const guide = guides.find((item) => item.slug === slug); if (!guide) notFound(); const tools = await prisma.tool.findMany({ where: { slug: { in: [...guide.toolSlugs] } }, include: { category: true } }); return <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6"><Link href="/guides" className="inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="size-4" /> All guides</Link><article className="mx-auto mt-12 max-w-3xl text-center"><p className="text-sm font-semibold text-sky-500">{guide.eyebrow}</p><h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">{guide.title}</h1><p className="mt-5 text-lg leading-8 text-muted-foreground">{guide.description}</p></article><ol className="mx-auto mt-14 grid max-w-3xl gap-4">{guide.steps.map((step, index) => <li key={step} className="flex gap-4 rounded-2xl border bg-card p-5"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-sky-500 text-sm font-semibold text-white">{index + 1}</span><p className="pt-1 leading-7 text-muted-foreground">{step}</p></li>)}</ol><div className="mt-16 flex items-center gap-3"><CheckCircle2 className="size-6 text-emerald-500" /><div><h2 className="text-2xl font-semibold">Recommended stack</h2><p className="text-sm text-muted-foreground">A focused starting point—add tools only when a real need appears.</p></div></div><div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{tools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}</div></div> }
