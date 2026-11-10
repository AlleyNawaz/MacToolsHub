import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Clock3, ExternalLink, GitBranch, Laptop, ShieldCheck, Terminal } from "lucide-react"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { BrandMark } from "@/components/BrandMark"
import { CommandCopy } from "@/components/CommandCopy"
import { FavoriteButton } from "@/components/FavoriteButton"
import { ToolCard } from "@/components/ToolCard"

type Props = { params: Promise<{ slug: string }> }
type Documentation = { overview: string; installation: string }

function parseDocs(value: string, fallback: string): Documentation {
  try {
    const parsed: unknown = JSON.parse(value)
    if (parsed && typeof parsed === "object") {
      const docs = parsed as Record<string, unknown>
      return {
        overview: typeof docs.overview === "string" ? docs.overview : fallback,
        installation: typeof docs.installation === "string" ? docs.installation : "Check the vendor's installation guide before running this step.",
      }
    }
  } catch { /* Older catalog rows can contain plain text. */ }
  return { overview: fallback, installation: "Check the vendor's installation guide before running this step." }
}

async function getTool(slug: string) {
  return prisma.tool.findUnique({ where: { slug }, include: { category: true } })
}

export async function generateStaticParams() {
  return (await prisma.tool.findMany({ select: { slug: true } })).map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = await getTool(slug)
  return tool
    ? { title: `${tool.name} for Mac`, description: `${tool.description} Installation and related tools.`, openGraph: { title: `${tool.name} for Mac`, description: tool.description, type: "article" } }
    : { title: "Tool not found" }
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params
  const tool = await getTool(slug)
  if (!tool) notFound()

  const related = await prisma.tool.findMany({ where: { categoryId: tool.categoryId, id: { not: tool.id } }, orderBy: { name: "asc" }, take: 3, include: { category: true } })
  const docs = parseDocs(tool.documentation, tool.description)
  const tags = tool.tags.split(",").filter(Boolean)
  const jsonLd = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: tool.name, description: tool.description, applicationCategory: tool.category.name, operatingSystem: "macOS" }

  return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    <Link href="/tools" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> All tools</Link>

    <section className="relative mt-8 overflow-hidden rounded-[2rem] border bg-card p-7 sm:p-10">
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-sky-500/10 via-violet-500/10 to-fuchsia-500/10" />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
        <BrandMark name={tool.name} className="size-20 rounded-3xl text-xl shadow-xl sm:size-24 sm:text-2xl" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
            <Link href={`/category/${tool.category.slug}`} className="rounded-full bg-sky-500/10 px-3 py-1 text-sky-600 dark:text-sky-400">{tool.category.name}</Link>
            <span className="rounded-full border bg-background/80 px-3 py-1 capitalize">{tool.difficulty.toLowerCase()}</span>
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{tool.name}</h1>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-muted-foreground">{tool.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <FavoriteButton slug={tool.slug} />
            <a href={tool.website} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-4 text-sm font-semibold text-background">Search official site <ExternalLink className="size-4" /></a>
            {tool.github && <a href={tool.github} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-full border bg-background px-4 text-sm font-medium"><GitBranch className="size-4" /> Source</a>}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Search results can include unofficial pages. Confirm the vendor before installing.</p>
        </div>
      </div>
    </section>

    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_18rem]">
      <div className="space-y-8">
        <section id="installation" className="scroll-mt-28 rounded-3xl border bg-slate-950 p-6 text-white shadow-xl">
          <div className="mb-4 flex items-center justify-between gap-3"><h2 className="flex items-center gap-2 font-semibold"><Terminal className="size-5 text-sky-400" /> Install {tool.name}</h2><span className="text-xs text-slate-400">macOS</span></div>
          <CommandCopy command={tool.installCommand} kind={tool.installKind} />
          <p className="mt-4 text-sm leading-6 text-slate-400">{docs.installation}</p>
        </section>
        {docs.overview !== tool.description && <section className="border-b pb-8"><h2 className="text-2xl font-semibold tracking-tight">Overview</h2><p className="mt-4 text-base leading-8 text-muted-foreground">{docs.overview}</p></section>}
        {related.length > 0 && <section><div className="mb-5 flex items-center justify-between gap-3"><h2 className="text-2xl font-semibold tracking-tight">More in {tool.category.name}</h2><Link href={`/category/${tool.category.slug}`} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-sky-600 dark:text-sky-400">View all <ArrowRight className="size-4" /></Link></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{related.map((item) => <ToolCard key={item.id} tool={item} />)}</div></section>}
      </div>
      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl border bg-card p-5"><h2 className="font-semibold">At a glance</h2><dl className="mt-4 space-y-4 text-sm"><Detail icon={<ShieldCheck />} label="Difficulty" value={tool.difficulty.toLowerCase()} /><Detail icon={<Clock3 />} label="Catalog updated" value={tool.updatedAt.toLocaleDateString("en", { month: "short", year: "numeric" })} /><Detail icon={<Laptop />} label="Category" value={tool.category.name} /></dl></div>
        <div className="rounded-3xl border bg-card p-5"><h2 className="font-semibold">Tags</h2><div className="mt-3 flex flex-wrap gap-2">{tags.map((tag) => <span key={tag} className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground">#{tag}</span>)}</div></div>
      </aside>
    </div>
  </div>
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex gap-3"><span className="mt-0.5 text-muted-foreground [&>svg]:size-4">{icon}</span><div><dt className="text-muted-foreground">{label}</dt><dd className="mt-0.5 font-medium capitalize text-foreground">{value}</dd></div></div>
}
