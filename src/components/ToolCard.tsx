import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { BrandMark } from "@/components/BrandMark"
import { FavoriteButton } from "@/components/FavoriteButton"

interface ToolCardProps { tool: { name: string; slug: string; description: string; difficulty?: string; category: { name: string } } }

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <article className="group relative flex min-h-64 flex-col rounded-3xl border bg-card/70 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-sky-500/5">
      <div className="flex items-start justify-between gap-3"><BrandMark name={tool.name} className="size-13 text-sm" /><FavoriteButton slug={tool.slug} compact /></div>
      <div className="mt-5 flex flex-1 flex-col">
        <div className="text-xs font-medium text-muted-foreground">{tool.category.name}</div>
        <h3 className="mt-2 text-xl font-semibold tracking-tight"><Link href={`/tool/${tool.slug}`} className="after:absolute after:inset-0">{tool.name}</Link></h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{tool.description}</p>
      </div>
      <div className="mt-5 flex items-center justify-between border-t pt-4 text-sm font-medium"><span className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">{tool.difficulty?.toLowerCase() ?? "beginner"}</span><span className="flex items-center gap-1 text-primary">View details <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span></div>
    </article>
  )
}
