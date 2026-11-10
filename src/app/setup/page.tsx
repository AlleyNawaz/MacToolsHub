import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { SetupWizard } from "@/components/SetupWizard"

export const metadata: Metadata = { title: "Mac setup wizard", description: "Generate a personalized macOS developer setup and installation script." }

export default async function SetupPage() {
  const tools = await prisma.tool.findMany({ select: { name: true, slug: true, description: true, installCommand: true, installKind: true } })
  return <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6"><div className="mx-auto mb-12 max-w-3xl text-center"><p className="text-sm font-semibold text-sky-500">PERSONAL SETUP BUILDER</p><h1 className="mt-2 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">Plan your next Mac setup.</h1><p className="mt-4 text-lg leading-8 text-muted-foreground">Pick a workflow, tune the recommendations, and review each step before copying or downloading a script.</p></div><SetupWizard tools={tools} /></div>
}
