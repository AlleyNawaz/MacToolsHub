import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, GitCompareArrows } from "lucide-react"
import { comparisons } from "@/data/editorial"

export const metadata: Metadata = { title: "Tool comparisons", description: "Practical, opinionated comparisons of popular Mac developer tools." }
export default function CompareIndex() { return <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6"><div className="max-w-3xl"><p className="text-sm font-semibold text-sky-500">HEAD TO HEAD</p><h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Choose tools with confidence.</h1><p className="mt-4 text-lg leading-8 text-muted-foreground">Clear tradeoffs, sensible recommendations, and no manufactured winners.</p></div><div className="mt-12 grid gap-5 md:grid-cols-2">{comparisons.map((item) => <Link key={item.slug} href={`/compare/${item.slug}`} className="group rounded-3xl border bg-card p-7 transition hover:-translate-y-1 hover:border-sky-500/40 hover:shadow-xl"><GitCompareArrows className="size-6 text-sky-500" /><h2 className="mt-8 text-2xl font-semibold">{item.title}</h2><p className="mt-3 leading-7 text-muted-foreground">{item.summary}</p><span className="mt-7 flex items-center gap-2 text-sm font-semibold">Read comparison <ArrowRight className="size-4 transition group-hover:translate-x-1" /></span></Link>)}</div></div> }
