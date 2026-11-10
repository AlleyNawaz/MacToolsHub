# MacTools Hub

A macOS developer tool catalog with search, categories, comparisons, guides, favorites, and a setup script builder.

## Run locally

```bash
npm ci
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The catalog and browser-based favorites work without a database. `npm run db:setup` is only needed for the optional local Prisma seed workflow; its SQLite file is generated at `prisma/dev.db` and is intentionally not committed.

## Deploy to Vercel

Import this repository into Vercel and keep the detected Next.js framework, root directory, and default build settings. Vercel will install dependencies and run `npm run build`; no database or custom `vercel.json` is required for the deployed catalog.

After the first deployment, set `NEXT_PUBLIC_SITE_URL` in the Vercel project’s Production environment to the public site origin (for example, `https://your-project.vercel.app`) and redeploy. This sets the canonical metadata, robots.txt, and sitemap.xml URLs.

## Check the project

```bash
npm run lint
npm test
npm run build
```

The build uses webpack because this project’s Tailwind/PostCSS setup currently triggers a Turbopack process binding error in restricted environments.

Set `NEXT_PUBLIC_SITE_URL` to the public origin before deploying so metadata, robots.txt, and sitemap.xml use the correct URLs.

Tool commands are starting points. Review generated scripts and confirm installation steps with each tool’s official documentation before running them.

See [the UI and UX audit](docs/UI_UX_AUDIT.md) for the detailed findings and changes.
