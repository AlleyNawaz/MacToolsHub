"use client"

import { useEffect, useState } from "react"
import { Check, Copy } from "lucide-react"
import { copyText } from "@/lib/clipboard"

export function CommandCopy({ command, kind = "command" }: { command: string; kind?: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle")

  useEffect(() => {
    if (status === "idle") return
    const timer = window.setTimeout(() => setStatus("idle"), 2500)
    return () => window.clearTimeout(timer)
  }, [status])

  if (kind === "manual") {
    return (
      <div className="rounded-xl border border-white/15 bg-slate-900 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-300">Manual step</p>
        <p className="mt-2 text-sm leading-6 text-slate-100">{command}</p>
      </div>
    )
  }

  async function handleCopy() {
    setStatus((await copyText(command)) ? "copied" : "error")
  }

  return (
    <div className="rounded-xl border border-white/15 bg-slate-900 p-3 text-slate-100">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-sky-300">Suggested command</span>
        <button type="button" onClick={handleCopy} className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg border border-white/20 px-3 text-xs font-semibold text-white transition hover:bg-white/10" aria-label="Copy suggested command">
          {status === "copied" ? <Check className="size-4" /> : <Copy className="size-4" />}
          {status === "copied" ? "Copied" : "Copy"}
        </button>
      </div>
      <code className="block overflow-x-auto whitespace-pre-wrap break-all font-mono text-sm leading-6">{command}</code>
      {status === "error" && <p role="status" className="mt-2 text-xs text-rose-300">Clipboard unavailable. Select the command to copy it.</p>}
    </div>
  )
}
