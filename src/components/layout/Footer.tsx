import Link from "next/link"
import { Command } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-card/50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div><div className="flex items-center gap-2 font-semibold"><Command className="size-5" /> MacTools Hub</div><p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">A practical command center for building a faster, cleaner, and more capable developer Mac.</p></div>
        <div><p className="text-sm font-semibold">Explore</p><div className="mt-3 grid gap-2 text-sm text-muted-foreground"><Link href="/tools">All tools</Link><Link href="/categories">Categories</Link><Link href="/setup">Setup wizard</Link></div></div>
        <div><p className="text-sm font-semibold">Learn</p><div className="mt-3 grid gap-2 text-sm text-muted-foreground"><Link href="/guides">Setup guides</Link><Link href="/compare">Comparisons</Link><Link href="/favorites">My favorites</Link></div></div>
      </div>
      <div className="border-t py-5 text-center text-xs text-muted-foreground">Curated for macOS developers. Verify third-party commands before installation.</div>
    </footer>
  )
}
