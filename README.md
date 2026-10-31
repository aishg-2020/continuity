# Continuity

Production planning and shoot-day coordination for independent filmmakers and small production teams: scenes, cast and crew, locations, schedules, call sheets, daily reports and budgets in one workspace.

> **This is a demo.** Everything runs in the browser on synthetic sample data stored in `localStorage`. There is no backend, no real authentication, and nothing is sent anywhere. See [the mock-only rule](docs/IMPLEMENTATION_PLAN.md#0-ground-rule-mock-data-only-in-every-phase).

## Getting started

Requires Node 24 (see `.nvmrc`).

```bash
npm install
npm run dev
```

Open http://localhost:3000.

| Command             | What it does                                 |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Start the dev server                         |
| `npm run build`     | Production build                             |
| `npm run lint`      | ESLint                                       |
| `npm run format`    | Format with Prettier                         |
| `npm run typecheck` | Generate route types and run TypeScript      |
| `npm test`          | Unit tests (Vitest)                          |
| `npm run e2e`       | End-to-end tests (Playwright, needs a build) |

## Demo data

- **Reset:** Settings → _Reset demo data_ restores the original sample.
- **Dev toolbar:** in development, the wrench button (bottom right) controls simulated latency, simulated failures and the demo "today" (fixed at 15 Nov 2026, Asia/Kolkata). Enable it in production builds with `NEXT_PUBLIC_DEV_TOOLBAR=1`.
- **On-set mode:** the sun button in the top bar switches to a high-contrast theme for outdoor use.

## Docs

- [Implementation plan](docs/IMPLEMENTATION_PLAN.md): phases, scope and exit criteria
- [Architecture](docs/ARCHITECTURE.md): layering, the repository pattern and mock services
- [Contributing](CONTRIBUTING.md)

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · shadcn/ui (Base UI) · Zustand · Zod · React Hook Form · date-fns · Vitest · Playwright
