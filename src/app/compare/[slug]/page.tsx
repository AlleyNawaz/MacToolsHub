import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { comparisons } from "@/data/editorial"
import { BrandMark } from "@/components/BrandMark"
import { CommandCopy } from "@/components/CommandCopy"

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() { return comparisons.map(({ slug }) => ({ slug })) }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = comparisons.find((entry) => entry.slug === slug)
  return item ? { title: item.title, description: item.summary } : { title: "Comparison not found" }
}

export default async function ComparisonPage({ params }: Props) {
  const { slug } = await params
  const item = comparisons.find((entry) => entry.slug === slug)
  if (!item) notFound()
  const [left, right] = await Promise.all([
    prisma.tool.findUnique({ where: { slug: item.left }, include: { category: true } }),
    prisma.tool.findUnique({ where: { slug: item.right }, include: { category: true } }),
  ])
  if (!left || !right) notFound()

  const rows = [
    ["Difficulty", left.difficulty.toLowerCase(), right.difficulty.toLowerCase()],
    ["Category", left.category.name, right.category.name],
  ]

  return <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
    <Link href="/compare" className="inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="size-4" /> All comparisons</Link>
    <div className="mx-auto mt-10 max-w-3xl text-center"><p className="text-sm font-semibold text-sky-500">SIDE BY SIDE</p><h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{item.title}</h1><p className="mt-4 text-lg text-muted-foreground">{item.summary}</p></div>
    <p className="mt-10 text-xs text-muted-foreground sm:hidden">Swipe sideways to see both tools.</p>
    <div className="mt-2 overflow-x-auto rounded-3xl border bg-card sm:mt-12">
      <div className="grid min-w-[34rem] grid-cols-[.65fr_1fr_1fr]">
        <div className="border-b p-4 sm:p-6" />
        <ToolHead tool={left} />
        <ToolHead tool={right} />
        {rows.flatMap(([label, a, b]) => [
          <div key={`${label}-l`} className="border-t p-4 text-xs font-medium text-muted-foreground sm:p-5 sm:text-sm">{label}</div>,
          <div key={`${label}-a`} className="border-l border-t p-4 text-sm capitalize sm:p-5">{a}</div>,
          <div key={`${label}-b`} className="border-l border-t p-4 text-sm capitalize sm:p-5">{b}</div>,
        ])}
      </div>
    </div>
    <div className="mt-8 grid gap-5 md:grid-cols-2"><Install tool={left} /><Install tool={right} /></div>
    <section className="mt-8 rounded-3xl border bg-sky-500/5 p-7"><p className="text-xs font-semibold text-sky-500">OUR TAKE</p><h2 className="mt-2 text-2xl font-semibold">The right choice depends on your workflow.</h2><p className="mt-3 leading-7 text-muted-foreground">{item.verdict}</p></section>
  </div>
}

function ToolHead({ tool }: { tool: { name: string; slug: string; description: string } }) {
  return <div className="border-l border-b p-4 sm:p-6"><BrandMark name={tool.name} className="size-12 rounded-xl text-xs" /><Link href={`/tool/${tool.slug}`} className="mt-3 block font-semibold hover:text-sky-500">{tool.name}</Link><p className="mt-1 text-xs leading-5 text-muted-foreground">{tool.description}</p></div>
}

function Install({ tool }: { tool: { name: string; installCommand: string; installKind: string } }) {
  return <div className="rounded-3xl border bg-slate-950 p-5 text-white"><p className="mb-3 font-semibold">Install {tool.name}</p><CommandCopy command={tool.installCommand} kind={tool.installKind} /></div>
}
