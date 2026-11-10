import { cn } from "@/lib/utils"

const palettes = [
  "from-sky-500 to-indigo-600", "from-fuchsia-500 to-rose-500", "from-emerald-400 to-cyan-600",
  "from-amber-400 to-orange-600", "from-violet-500 to-purple-700", "from-blue-500 to-cyan-400",
]

export function BrandMark({ name, className }: { name: string; className?: string }) {
  const index = [...name].reduce((sum, character) => sum + character.charCodeAt(0), 0) % palettes.length
  const initials = name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()

  return (
    <span className={cn("grid shrink-0 place-items-center rounded-2xl bg-gradient-to-br font-semibold text-white shadow-inner", palettes[index], className)} aria-hidden="true">
      {initials}
    </span>
  )
}
