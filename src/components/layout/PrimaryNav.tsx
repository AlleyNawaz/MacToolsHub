"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { href: "/tools", label: "Tools", mobileLabel: "Tools", routes: ["/tools", "/tool/"] },
  { href: "/categories", label: "Categories", mobileLabel: "Categories", routes: ["/categories", "/category/"] },
  { href: "/setup", label: "Setup wizard", mobileLabel: "Setup", routes: ["/setup"] },
  { href: "/compare", label: "Compare", mobileLabel: "Compare", routes: ["/compare"] },
  { href: "/guides", label: "Guides", mobileLabel: "Guides", routes: ["/guides"] },
  { href: "/favorites", label: "Favorites", mobileLabel: "Saved", routes: ["/favorites"] },
]

export function PrimaryNav({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname()
  return (
    <nav className={mobile ? "flex h-10 items-center gap-5 overflow-x-auto whitespace-nowrap border-t px-4 text-xs font-medium text-muted-foreground lg:hidden" : "hidden items-center gap-5 whitespace-nowrap text-sm font-medium text-muted-foreground lg:flex"} aria-label={mobile ? "Mobile navigation" : "Main navigation"}>
      {links.map((link) => {
        const active = link.routes.some((route) => pathname === route || (route.endsWith("/") && pathname.startsWith(route)) || (!route.endsWith("/") && pathname.startsWith(`${route}/`)))
        return <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={`shrink-0 border-b-2 py-2 transition hover:text-foreground ${active ? "border-sky-500 text-foreground" : "border-transparent"}`}>{mobile ? link.mobileLabel : link.label}</Link>
      })}
    </nav>
  )
}
