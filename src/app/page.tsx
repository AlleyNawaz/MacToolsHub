import Link from "next/link"
import { ArrowRight, Check, ChevronRight, Command, Laptop, Sparkles, Terminal } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ToolCard } from "@/components/ToolCard"
import { CommandCopy } from "@/components/CommandCopy"

export default async function Home() {
  const [popularTools, categories, toolCount] = await Promise.all([
    prisma.tool.findMany({ where: { slug: { in: ["homebrew", "visual-studio-code", "git", "raycast", "orbstack", "ollama"] } }, orderBy: { name: "asc" }, include: { category: true } }),
    prisma.category.findMany({ include: { _count: { select: { tools: true } } }, orderBy: { tools: { _count: "desc" } }, take: 8 }),
    prisma.tool.count(),
  ])

  return (
    <div>
      <section className="relative overflow-hidden border-b">
        <div className="dot-grid absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="absolute left-1/2 top-0 h-[32rem] w-[48rem] -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[1.12fr_.88fr] lg:py-32">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur"><Sparkles className="size-3.5 text-sky-500" /> A focused Mac developer catalog</div>
            <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-7xl">Build a better Mac.<br /><span className="bg-gradient-to-r from-sky-500 via-blue-500 to-violet-500 bg-clip-text text-transparent">Ship your best work.</span></h1>
            <p className="mt-7 max-w-2xl text-balance text-lg leading-8 text-muted-foreground sm:text-xl">Explore tools by workflow, compare your options, and build a setup script you can review before running.</p>
            <div className="mt-9 flex flex-wrap gap-3"><Link href="/tools" className="inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-background shadow-lg transition hover:-translate-y-0.5">Explore {toolCount} tools <ArrowRight className="size-4" /></Link><Link href="/setup" className="inline-flex h-12 items-center gap-2 rounded-full border bg-background/70 px-6 text-sm font-semibold shadow-sm transition hover:bg-muted"><Laptop className="size-4" /> Build my setup</Link></div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground"><span className="flex items-center gap-1.5"><Check className="size-4 text-emerald-500" /> Reviewable setup scripts</span><span className="flex items-center gap-1.5"><Check className="size-4 text-emerald-500" /> No account required</span><span className="flex items-center gap-1.5"><Check className="size-4 text-emerald-500" /> Organized by workflow</span></div>
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-tr from-sky-500/20 to-violet-500/15 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border bg-slate-950 text-slate-100 shadow-2xl shadow-sky-950/20">
              <div className="flex h-12 items-center border-b border-white/10 px-4"><div className="flex gap-1.5"><span className="size-2.5 rounded-full bg-rose-400" /><span className="size-2.5 rounded-full bg-amber-400" /><span className="size-2.5 rounded-full bg-emerald-400" /></div><span className="mx-auto pr-10 font-mono text-[11px] text-slate-400">mac-setup.sh</span></div>
              <div className="space-y-5 p-6 font-mono text-sm leading-7"><p><span className="text-fuchsia-400">$</span> brew update</p><p><span className="text-fuchsia-400">$</span> brew install git node pnpm</p><p><span className="text-fuchsia-400">$</span> brew install --cask cursor orbstack raycast</p><div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-emerald-300"><span className="mr-2">✓</span>Review the plan before you run it.</div></div>
              <div className="border-t border-white/10 p-4"><CommandCopy command="brew install git node pnpm" /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-9 flex items-end justify-between"><div><p className="text-sm font-semibold text-sky-500">EDITOR&apos;S PICKS</p><h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Start with the essentials</h2><p className="mt-2 text-muted-foreground">A few useful starting points for your dock or terminal.</p></div><Link href="/tools" className="hidden items-center gap-1 text-sm font-semibold sm:flex">View all <ArrowRight className="size-4" /></Link></div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{popularTools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}</div>
      </section>

      <section className="border-y bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]"><div><div className="grid size-12 place-items-center rounded-2xl bg-sky-500/10 text-sky-500"><Command className="size-6" /></div><h2 className="mt-5 text-3xl font-semibold tracking-tight">Everything in its place.</h2><p className="mt-3 leading-7 text-muted-foreground">From your first package manager to local AI and production infrastructure, explore a catalog organized around how Mac developers actually work.</p><Link href="/categories" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-sky-500">Explore every category <ArrowRight className="size-4" /></Link></div>
            <div className="grid gap-3 sm:grid-cols-2">{categories.map((category) => <Link key={category.id} href={`/category/${category.slug}`} className="group flex items-center gap-4 rounded-2xl border bg-background p-4 transition hover:border-sky-500/30 hover:shadow-md"><span className="grid size-10 place-items-center rounded-xl bg-muted font-mono text-sm font-semibold">{category.name.slice(0, 2).toUpperCase()}</span><span className="flex-1"><span className="block font-medium">{category.name}</span><span className="text-xs text-muted-foreground">{category._count.tools} curated tools</span></span><ChevronRight className="size-4 text-muted-foreground transition group-hover:translate-x-1" /></Link>)}</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6"><div className="overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-12 text-white sm:px-12 lg:flex lg:items-center lg:justify-between"><div><Terminal className="size-7 text-sky-400" /><h2 className="mt-4 text-3xl font-semibold tracking-tight">A setup plan you can inspect.</h2><p className="mt-3 max-w-2xl text-slate-400">Choose a workflow, review each suggested command and manual step, then copy or download your plan.</p></div><Link href="/setup" className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-slate-950 transition hover:bg-sky-100 lg:mt-0">Start setup wizard <ArrowRight className="size-4" /></Link></div></section>
    </div>
  )
}
