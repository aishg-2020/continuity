# Architecture

Continuity is a client-side Next.js app running entirely on mock data. This document covers how the code is layered and why. Scope and sequencing are in [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md).

## Layers

```
app/ routes, components/          UI. Reads and writes data only through repositories.
        │
lib/data/repositories             Async Repository<E> per entity (list/get/create/update/remove).
        │                         Today: createMockRepository → Zustand store.
lib/data/store                    Normalised tables, persisted to localStorage ("continuity-demo-v1").
        │
lib/mock-data                     Fixtures + seed (deterministic) + integrity checker.
lib/validation                    Zod schemas: the single source for types, form and fixture validation.
lib/services                      Mock side effects (clock today; auth, notifications, files, export later).
```

### Why repositories

Every read and write goes through an async `Repository` interface, so the UI never depends on where data lives. The mock implementation:

- validates every write against the entity's Zod schema,
- generates prefixed IDs (`scn_…`, `prj_…`),
- returns copies so callers can't mutate stored records,
- adds simulated latency and an optional failure rate (dev toolbar), so loading and error states are real and testable.

A future backend would replace only the implementation. Building one is outside the current plan.

### Entity registry

`src/lib/data/entities.ts` lists every table with its schema, ID prefix and foreign keys. The store's empty shape, the repositories and the integrity checker are all generated from it, so adding an entity is one entry.

### Persistence and hydration

The store uses Zustand `persist` with `skipHydration`. `<StoreHydration />` (in the root layout) loads saved data on the client after the first render, which avoids server/client mismatches. Components that show stored data use `useHydrated()` and render a skeleton until it is true.

When `SEED_VERSION` changes, saved demo data from an older seed is discarded, not migrated: it is sample data, and mixing versions would break relationships.

### Time and money

- "Now" comes from `clock.now()`: fixed at 15 Nov 2026 10:00 IST, overridable in the dev toolbar.
- Timestamps are UTC ISO strings. Calendar dates (`YYYY-MM-DD`) and call times (`HH:MM`) are wall-clock values in the project time zone.
- Money is integer minor units (paise), formatted with `formatMoney` / `formatCompactINR` (lakh/crore).

## Routing

| Group         | Routes                                  | Shell                 |
| ------------- | --------------------------------------- | --------------------- |
| `(marketing)` | `/`                                     | Standalone            |
| `(auth)`      | `/demo-login`                           | Standalone            |
| `(workspace)` | `/home`, `/projects/…`, `/people`, etc. | `AppShell`            |
| `share`       | `/share/call-sheets/[id]`               | Standalone, read-only |

`cacheComponents` (partial prerendering) is on. Components that read the route (`usePathname`, `useParams`) sit inside `<Suspense>` so the static shell still prerenders.

## Design system

Tokens live in `src/app/globals.css`: a dark-first palette with a single tungsten-amber accent, status colours (`status-*`) that are always paired with an icon or label, and a `[data-contrast="high"]` on-set override. Display type is Instrument Serif; UI type is Geist. Motion respects `prefers-reduced-motion`.

## Testing

- **Vitest** (`src/**/*.test.ts`): formatters, repositories, seed integrity. Setup disables simulated latency and resets the store before each test.
- **Playwright** (`tests/e2e`): every route renders with the demo disclosure on desktop and mobile, and no page makes a request outside the app.
