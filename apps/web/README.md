# apps/web (Next.js frontend) — Phase 2

This app is intentionally not scaffolded yet. Per the recommended development
order, the **backend business engine** (auth, RBAC, package engine, CRM,
proposal engine) should be built and stable first — the frontend is built
against a working, versioned API rather than in parallel guesswork.

When you're ready, scaffold it with:

```bash
cd apps
npx create-next-app@latest web --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

Recommended additions once created: `shadcn/ui`, `react-hook-form` + `zod`,
`@tanstack/react-query`, `recharts`. Point its API client at
`NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1`.
