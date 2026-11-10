"use client"

import { useMemo, useState } from "react"
import { Check, ChevronRight, Copy, Download, RotateCcw, Sparkles } from "lucide-react"
import { BrandMark } from "@/components/BrandMark"
import { copyText } from "@/lib/clipboard"
import { buildSetupScript, type SetupTool } from "@/lib/setup-script"

type Tool = SetupTool & { description: string }

const profiles: Record<string, { label: string; description: string; slugs: string[] }> = {
  web: { label: "Web developer", description: "Modern full-stack JavaScript and API work.", slugs: ["homebrew", "git", "nodejs", "pnpm", "visual-studio-code", "orbstack", "postman", "raycast"] },
  ai: { label: "AI engineer", description: "Local models, Python, notebooks, and containers.", slugs: ["homebrew", "git", "python", "miniconda", "jupyterlab", "ollama", "visual-studio-code", "docker-desktop"] },
  mobile: { label: "Mobile developer", description: "A clean native app development foundation.", slugs: ["homebrew", "git", "visual-studio-code", "nodejs", "postman", "orbstack", "raycast", "rectangle"] },
  devops: { label: "DevOps engineer", description: "Containers, clusters, IaC, and network tooling.", slugs: ["homebrew", "git", "orbstack", "kubernetes", "helm", "terraform", "ansible", "tailscale"] },
  design: { label: "Designer", description: "Interface craft, prototyping, and productive handoff.", slugs: ["homebrew", "figma", "sketch", "blender", "raycast", "rectangle", "notion", "daisydisk"] },
  student: { label: "Student", description: "Friendly essentials for learning and shipping projects.", slugs: ["homebrew", "git", "visual-studio-code", "nodejs", "python", "github-cli", "rectangle", "obsidian"] },
}

export function SetupWizard({ tools }: { tools: Tool[] }) {
  const [profile, setProfile] = useState<string | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle")

  const recommendations = useMemo(() => profile
    ? profiles[profile].slugs.flatMap((slug) => {
      const tool = tools.find((item) => item.slug === slug)
      return tool ? [tool] : []
    })
    : [], [profile, tools])
  const active = recommendations.filter((tool) => selected.includes(tool.slug))
  const script = useMemo(() => buildSetupScript(active), [active])

  function choose(key: string) {
    setProfile(key)
    setSelected(profiles[key].slugs)
    setCopyStatus("idle")
  }

  function toggle(slug: string) {
    setSelected((values) => values.includes(slug) ? values.filter((value) => value !== slug) : [...values, slug])
    setCopyStatus("idle")
  }

  async function copyScript() {
    setCopyStatus((await copyText(script)) ? "copied" : "error")
  }

  function download() {
    const url = URL.createObjectURL(new Blob([script], { type: "text/x-shellscript" }))
    const link = document.createElement("a")
    link.href = url
    link.download = `mactools-${profile}-setup.sh`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  if (!profile) {
    return <div>
      <div className="mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground"><span className="grid size-6 place-items-center rounded-full bg-sky-500 text-xs text-white">1</span> Choose your workflow</div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(profiles).map(([key, item]) => (
        <button key={key} type="button" onClick={() => choose(key)} className="group rounded-3xl border bg-card p-6 text-left transition hover:-translate-y-1 hover:border-sky-500/40 hover:shadow-xl">
          <div className="flex items-start justify-between"><Sparkles className="size-5 text-sky-500" /><ChevronRight className="size-5 text-muted-foreground transition group-hover:translate-x-1" /></div>
          <h2 className="mt-8 text-xl font-semibold">{item.label}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
          <p className="mt-4 text-xs font-medium text-sky-500">{item.slugs.filter((slug) => tools.some((tool) => tool.slug === slug)).length} recommended tools</p>
        </button>
      ))}</div>
    </div>
  }

  return <div>
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div><p className="text-sm font-semibold text-sky-500">YOUR STARTER STACK</p><h2 className="mt-1 text-2xl font-semibold">{profiles[profile].label}</h2></div>
      <button type="button" onClick={() => { setProfile(null); setSelected([]); setCopyStatus("idle") }} className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium hover:bg-muted"><RotateCcw className="size-4" /> Start over</button>
    </div>
    <div className="grid gap-8 lg:grid-cols-[1fr_.9fr]">
      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">{active.length} of {recommendations.length} selected</p>
          <div className="flex gap-3 text-sm font-medium"><button type="button" onClick={() => { setSelected(recommendations.map((tool) => tool.slug)); setCopyStatus("idle") }} disabled={active.length === recommendations.length} className="text-sky-600 disabled:opacity-40 dark:text-sky-400">Select all</button><button type="button" onClick={() => { setSelected([]); setCopyStatus("idle") }} disabled={!active.length} className="text-sky-600 disabled:opacity-40 dark:text-sky-400">Clear</button></div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">{recommendations.map((tool) => {
          const checked = selected.includes(tool.slug)
          return <button key={tool.slug} type="button" aria-pressed={checked} onClick={() => toggle(tool.slug)} className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${checked ? "border-sky-500/50 bg-sky-500/5" : "opacity-65 hover:opacity-100"}`}>
            <BrandMark name={tool.name} className="size-11 rounded-xl text-xs" />
            <span className="min-w-0 flex-1"><strong className="block text-sm">{tool.name}</strong><span className="mt-1 line-clamp-2 block text-xs leading-5 text-muted-foreground">{tool.description}</span>{tool.installKind === "manual" && <span className="mt-2 block text-xs font-semibold text-amber-600 dark:text-amber-400">Manual step</span>}</span>
            <span className={`grid size-5 shrink-0 place-items-center rounded-md border ${checked ? "border-sky-500 bg-sky-500 text-white" : "border-muted-foreground/50"}`}>{checked && <Check className="size-3" />}</span>
          </button>
        })}</div>
      </div>
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="overflow-hidden rounded-3xl border bg-slate-950 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 text-sm text-slate-300"><span>{active.length} tools selected</span><span className="font-mono text-xs text-slate-500">setup.sh</span></div>
          <pre className="max-h-[28rem] overflow-auto p-5 text-xs leading-6 text-slate-300"><code>{script}</code></pre>
          <div className="grid gap-2 border-t border-white/10 p-3 sm:grid-cols-2">
            <button type="button" disabled={!active.length} onClick={copyScript} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"><Copy className="size-4" /> {copyStatus === "copied" ? "Copied" : "Copy script"}</button>
            <button type="button" disabled={!active.length} onClick={download} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/15 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"><Download className="size-4" /> Download</button>
          </div>
        </div>
        {copyStatus === "error" && <p role="status" className="mt-3 text-sm text-rose-500">Clipboard unavailable. Download the script or select its text.</p>}
        <p className="mt-3 text-xs leading-5 text-muted-foreground">Review every command before running the script. Suggested package names and manual steps should be checked against vendor instructions.</p>
      </div>
    </div>
  </div>
}
