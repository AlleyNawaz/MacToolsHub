"use client"

import Link from "next/link"
import { AlertCircle, ArrowLeft, RotateCcw } from "lucide-react"

export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
    <AlertCircle className="size-12 text-sky-500" />
    <h1 className="mt-5 text-3xl font-semibold tracking-tight">This page could not load.</h1>
    <p className="mt-3 text-muted-foreground">The problem may be temporary. Try loading the page again.</p>
    <div className="mt-7 flex flex-wrap justify-center gap-3"><button type="button" onClick={retry} className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-semibold text-background"><RotateCcw className="size-4" /> Try again</button><Link href="/tools" className="inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-semibold"><ArrowLeft className="size-4" /> Browse tools</Link></div>
  </div>
}
