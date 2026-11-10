import type { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"
import { comparisons, guides } from "@/data/editorial"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "")
  const [tools, categories] = await Promise.all([
    prisma.tool.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
  ])

  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    ...["tools", "categories", "setup", "compare", "guides"].map((path) => ({
      url: `${base}/${path}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...tools.map((tool) => ({
      url: `${base}/tool/${tool.slug}`,
      lastModified: tool.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...categories.map((category) => ({
      url: `${base}/category/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...comparisons.map((item) => ({
      url: `${base}/compare/${item.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...guides.map((guide) => ({
      url: `${base}/guides/${guide.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ]
}
