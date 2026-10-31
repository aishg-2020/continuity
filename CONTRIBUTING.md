# Contributing

## The one rule: mock data only

Continuity is currently a mock-data product. Do not add a database, auth provider, API, email/SMS service, payment gateway, analytics script or any other external call. Everything is stored in the browser. The full list of what is and isn't allowed is in [the implementation plan](docs/IMPLEMENTATION_PLAN.md#0-ground-rule-mock-data-only-in-every-phase). A Playwright test fails the build if any page makes a request outside the app.

## Workflow

1. Branch from `main`.
2. Make the change, with tests.
3. Commit using [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `test:`, `chore:` …). A commit hook checks the message and runs ESLint and Prettier on staged files.
4. Open a PR and work through the checklist in the template. CI must pass.

## Conventions

- **Data access:** UI code calls `repositories` from `@/lib/data/repositories`. Never read the store, `localStorage` or fixtures directly.
- **New entity:** add a Zod schema in `src/lib/validation`, register it in `src/lib/data/entities.ts` (prefix and foreign keys), and export its type from `src/types`.
- **Fixtures:** synthetic only. Use `example.com` emails and obviously fake phone numbers. Bump `SEED_VERSION` in `src/lib/mock-data/seed.ts` when fixtures change.
- **Money:** integer minor units (paise). Format only through `@/lib/formatters/money`.
- **Time:** store UTC timestamps; render in the project time zone. Read "now" from `clock`, never `new Date()`.
- **Status:** always pair a status colour with an icon or label.
- **Generated UI:** `src/components/ui` is shadcn output. Prefer composing it over editing it.
