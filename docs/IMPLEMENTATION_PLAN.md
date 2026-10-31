# Continuity — Technical Implementation Plan

**Source:** SetFlow Product Requirements Document v1.0 (31 Oct 2026). The product is renamed **Continuity**. Every PRD reference to "SetFlow" maps to Continuity.
**Plan date:** 31 October 2026
**Scope of this plan:** A fully interactive, mock-data-only product: the PRD's Phase 0 prototype, plus mocked versions of the MVP workflows it lists, so the whole product experience can be built and validated with users.

---

## 0. Ground rule: mock data only, in every phase

This rule applies to **every phase** below. No phase may break it.

| Allowed                                                                  | Not allowed                                                                         |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| Typed TypeScript/JSON fixtures in the repo                               | Any real database (Postgres, Supabase, Firebase, etc.)                              |
| Deterministic, seeded fake-data generators                               | Any real authentication provider                                                    |
| `localStorage` (records) and IndexedDB (local file blobs)                | Real HTTP APIs, serverless functions that persist data                              |
| Mock repositories and mock services with simulated latency/errors        | Email, SMS, WhatsApp or push providers                                              |
| Mock Service Worker (MSW) to intercept requests in the browser (Phase 8) | Payment gateways, accounting, weather, maps, calendar or cloud storage integrations |
| Browser print / client-side PDF generation                               | AI services                                                                         |
| Placeholder images stored in `/public`                                   | Real personal data of real people                                                   |

Rules every phase must follow:

1. **All data access goes through a repository interface** (`lib/data/repositories`). UI components never touch `localStorage` or fixtures directly. Today every repository has only a mock implementation. This is what lets a real backend be added later without rewriting the UI, but building that backend is outside this plan.
2. **All side effects go through mock services** (`lib/services`): `authService`, `notificationService`, `fileService`, `exportService`, `clock`. Each one logs/simulates instead of calling anything external.
3. **Fixtures are synthetic and labelled.** A persistent "Demo data, stored only in this browser" banner is visible on every screen. No fixture uses a real person's name, phone number or email (use the reserved `example.com` domain and `+91 90000 0XXXX`-style numbers).
4. **Fixed demo clock.** "Today" comes from `clock.now()`, which defaults to a fixed demo date (proposed: **2026-11-15, Asia/Kolkata**), so countdowns, "next shoot day" and overdue states look the same for every viewer and in every test.
5. **Metrics are derived, never hardcoded.** Dashboard numbers come from selectors over the stored records.
6. **Reset is always possible.** Workspace settings has "Reset demo data", which re-seeds the store from fixtures.
7. **Each phase ships with fixtures for its own entities**, plus integrity tests for referential consistency.

---

## 1. Technology stack

As recommended in PRD §13 (prototype architecture). Use the latest stable version of each at setup time and pin it in `package.json`.

| Concern                                 | Choice                                                                   | Notes                                                                                                               |
| --------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| Framework                               | **Next.js (App Router)** + **TypeScript** (strict)                       | Data is client-side, so data-driven pages are client components. Static/marketing pages can stay server components. |
| Styling                                 | **Tailwind CSS** + **shadcn/ui** (Radix primitives)                      | Dark cinematic theme through CSS variables (PRD §11).                                                               |
| State / mock persistence                | **Zustand** with `persist` middleware → `localStorage`                   | Versioned store with `migrate` so fixture changes don't break saved demo state.                                     |
| Forms & validation                      | **React Hook Form** + **Zod**                                            | Zod schemas are the single source for types, form validation and fixture validation.                                |
| Dates & time zones                      | **date-fns** + **date-fns-tz**                                           | Timestamps stored as UTC ISO strings and rendered in the project time zone.                                         |
| Money                                   | Integer **paise** (minor units) + `Intl.NumberFormat('en-IN')`           | Never floats (PRD §12). Lakh/crore formatting helper.                                                               |
| Charts                                  | **Recharts**                                                             | Budget and progress visualisations.                                                                                 |
| Drag & drop                             | **dnd-kit**                                                              | Reordering scenes, shots, storyboard frames and day-plan scenes.                                                    |
| Fake data                               | **@faker-js/faker** (seeded, `en_IN` locale)                             | Deterministic. The same seed always produces the same data.                                                         |
| Local files                             | **idb-keyval** (IndexedDB)                                               | Mock uploads only, capped size/type (see Phase 7).                                                                  |
| Mock API (Phase 8)                      | **MSW**                                                                  | Browser-only request interception.                                                                                  |
| Unit / component tests                  | **Vitest** + **React Testing Library**                                   |                                                                                                                     |
| E2E tests                               | **Playwright**                                                           | Runs the PRD's core user journeys.                                                                                  |
| A11y checks                             | **@axe-core/playwright**, `eslint-plugin-jsx-a11y`                       |                                                                                                                     |
| Quality                                 | ESLint, Prettier, Husky + lint-staged, Commitlint (conventional commits) |                                                                                                                     |
| CI                                      | **GitHub Actions**                                                       | Lint, typecheck, unit tests, build, E2E on every PR.                                                                |
| Scroll storytelling (landing page only) | **GSAP** + **ScrollTrigger**                                             | Pinned, scrubbed scroll timelines. Loaded only on the marketing route.                                              |
| Component motion                        | **Framer Motion**                                                        | Micro-interactions, enter/exit, route transitions. Also used lightly in the app.                                    |
| Smooth scrolling (landing page only)    | **Lenis**                                                                | Synced to the GSAP ticker. Turned off when the user prefers reduced motion.                                         |
| Hosting (static demo)                   | Vercel preview/production deployments                                    | Only the static/client app is hosted. No backend resources.                                                         |

---

## 2. Architecture

### 2.1 Layering

```
UI (app/ routes, components/)
   │  uses hooks only
   ▼
Feature hooks (features/*/hooks)       e.g. useScenes(projectId), useCreateScene()
   │
   ▼
Repositories (lib/data/repositories)   interface  ──►  MockXRepository (Zustand store + localStorage)
   │
   ▼
Domain logic (lib/domain)              pure functions: metrics, conflicts, budget math, call-sheet snapshots
Mock services (lib/services)           auth, notifications, files, export, clock
```

- **Repository interface example:**
  `SceneRepository { list(projectId, filter), get(id), create(input), update(id, patch), remove(id), reorder(projectId, ids) }`
  Every method is `async` and returns `Promise`, even though the mock resolves locally, so the call signatures already match a future network implementation.
- **Simulated latency & failures:** the mock adapter adds a configurable delay (default 150–400 ms) and an optional failure rate (dev toolbar toggle). This keeps loading, error and retry states real and testable.
- **Domain logic is pure and framework-free** (`lib/domain`). Conflict detection, budget calculations, overview metrics and call-sheet snapshot building take plain data and return plain data. These are the most heavily unit-tested parts.
- **Permissions:** a single `can(role, action, resource)` matrix in `lib/permissions`, used by UI guards and mock repositories alike. Mock repositories reject unauthorised calls, so the UI must handle "forbidden" properly. This is a simulation of access control, not a security boundary. That limitation is stated in the README and the demo banner tooltip.

### 2.2 Folder structure

Extends PRD §13:

```text
src/
  app/
    (marketing)/                 # landing page (/), "about this demo"
    (auth)/demo-login/           # role selector
    (workspace)/
      layout.tsx                 # app shell: sidebar, top context bar, mobile bottom nav
      home/
      projects/
        page.tsx                 # project dashboard
        [projectId]/
          layout.tsx             # project header + project nav
          overview/ scenes/ breakdown/ storyboards/ shots/ schedule/
          people/ locations/ budget/ call-sheets/ reports/ files/ activity/
      people/ locations/ settings/
    share/call-sheets/[callSheetId]/   # read-only "public" view (still mock data)
  components/
    ui/                          # shadcn primitives
    layout/ shared/              # StatusBadge, EmptyState, ConfirmDialog, FilterBar, DemoBanner...
    marketing/                   # landing sections, product mockups, film-frame transitions
    motion/                      # shared motion primitives (TextReveal, FilmFrame, Magnetic, Grain)
    projects/ scenes/ schedule/ people/ locations/ shots/ storyboards/ budget/ call-sheets/ reports/ activity/
  features/
    <module>/hooks/  <module>/forms/  <module>/components/
  lib/
    data/
      repositories/              # interfaces + mock implementations
      store/                     # Zustand store, persist config, migrations
    mock-data/
      fixtures/                  # hand-authored anchor records (4 demo projects)
      generators/                # seeded faker generators that fill volume
      seed.ts                    # builds the full dataset, deterministic
    domain/                      # metrics, conflicts, budget, callSheet, scheduling
    services/                    # mock auth, notifications, files, export, clock
    permissions/
    validation/                  # Zod schemas (one per entity)
    formatters/                  # money (INR/lakh), dates, durations
    motion/                      # Lenis + GSAP setup, reduced-motion hook, easing/duration tokens
  types/                         # inferred from Zod schemas
tests/
  e2e/                           # Playwright journeys A–F
docs/
```

### 2.3 Data model (mock)

The entities in PRD §12 are implemented as Zod schemas with inferred TypeScript types: User, Workspace, WorkspaceMember, Project, ProjectMember, Scene, Person, ProjectPerson, Location, SceneBreakdownItem, Shot, StoryboardFrame, ShootDay, ShootDayScene, ShootDayPerson, BudgetLineItem, Expense, CallSheet, DailyReport, ActivityEvent, plus a FileRecord entity for Phase 7.

- IDs are stable and prefixed (`prj_`, `scn_`, `per_`, `loc_`, `sd_`, …) so fixtures are readable and relationships are easy to check.
- The store is normalised (records keyed by ID per entity, like database tables). Relationships are stored by ID only, never as embedded copies, which follows the PRD's "one source of truth" principle.
- The exception is published call sheets, which store an immutable `content_snapshot` (PRD §12).

---

## 3. Phases

Each phase lists **Goal → Scope → Mock data → Deliverables → Exit criteria.** A phase is done only when its exit criteria pass in CI.

### Phase 0 — Boilerplate & foundations

**Goal:** A clean, production-quality skeleton that every later phase builds on. No product features yet, but the mock-data layer, app shell and design system are in place.

**Scope**

1. **Repository setup**
   - Connect the local repo to the existing empty GitHub repository. Default branch `main`, with protected-branch rules (PR required, CI must pass).
   - `README.md` (what Continuity is, how to run it, the mock-data disclaimer), `LICENSE` (to be decided), `.editorconfig`, `.nvmrc` (Node LTS), `.gitignore`.
   - Issue/PR templates and a `CONTRIBUTING.md` that covers the mock-only rule.
2. **Project scaffold**
   - `create-next-app` with TypeScript strict, App Router, `src/` directory, Tailwind and ESLint.
   - Package manager: **npm** (pnpm needed admin rights to install on the dev machine).
   - Path aliases (`@/…`).
   - shadcn/ui initialised. Base components added: Button, Input, Select, Dialog, Sheet, DropdownMenu, Tabs, Table, Badge, Card, Tooltip, Toast/Sonner, Form, Calendar, Popover, Command, Skeleton.
3. **Tooling**
   - Prettier (+ Tailwind class-sorting plugin), ESLint (Next, TypeScript, jsx-a11y, import order).
   - Husky + lint-staged, Commitlint.
   - Vitest + RTL configured with one sample test. Playwright configured with one smoke test.
   - GitHub Actions workflow: `install → lint → typecheck → test → build → e2e (smoke)`.
4. **Design system foundations** (PRD §11)
   - Tokens as CSS variables: near-black charcoal surfaces, warm off-white text, **one** accent colour, semantic status colours that always come with an icon/label (never colour alone).
   - Typography scale: an editorial display face for titles and a highly legible sans for UI and data.
   - Spacing, radius, shadow and motion tokens. Respect `prefers-reduced-motion`.
   - High-contrast on-set mode toggle (token override). It is cheap to add now and important for outdoor phone use.
5. **App shell**
   - Desktop: left global/project sidebar, top project context bar, main content, optional right contextual panel slot.
   - Mobile: compact top bar plus bottom navigation (Overview, Schedule, Call Sheet, Reports).
   - Breadcrumb component.
   - Placeholder pages for every route in the folder structure, each showing an `EmptyState`.
   - Global `DemoBanner`.
   - Error boundary, `not-found` and loading skeleton conventions.
6. **Mock data infrastructure**
   - Zod schemas for **all** PRD §12 entities.
   - Zustand root store with `persist` (`localStorage` key `continuity-demo-v1`), schema `version` and a `migrate` stub.
   - Generic `createMockRepository<T>()` helper: CRUD, filtering, sorting, simulated latency and simulated failure.
   - `clock` service (fixed demo date), `id` helper, money and date formatters (with tests).
   - Seed pipeline skeleton: deterministic `seed.ts` (seeded faker generators are added in Phase 3, when sample volume is needed), and a **fixture integrity test** that checks every foreign key resolves and every record passes its Zod schema.
   - "Reset demo data" utility.
   - Dev-only toolbar: latency slider, failure toggle, reset, change demo date.
7. **Documentation:** `docs/ARCHITECTURE.md` (layering, the repository pattern, the mock-only rule) and this plan.

**Mock data:** Only a minimal seed (1 workspace, 1 user) to prove the persistence and reset loop works.

**Exit criteria**

- `npm run dev` runs. Every planned route renders inside the shell on desktop and mobile widths.
- CI is green: lint, typecheck, unit tests (formatters, mock repository, fixture integrity) and Playwright smoke test.
- Reloading the browser keeps state. "Reset demo data" restores the seed.
- There are no network calls to any external service (checked by a Playwright test that fails on any non-local request).

---

### Phase 1 — Cinematic landing page

**Goal:** A premium, story-led landing page at `/` that explains Continuity and sends visitors into the demo. Visual direction: **A24 meets an Apple product page.** Dark and cinematic, editorial typography, large immersive visuals, subtle film grain. It should tell a story, not look like a SaaS template, and the motion should always serve that story.

**Why it comes this early:** It sets the brand and motion language that the product UI inherits. It doesn't depend on any product data. It's also what design partners and interviewees see first (PRD §17). The product mockups in it are static compositions fed by fixtures, so they don't wait for later phases. They are refreshed against the real screens in Phase 8.

**Scope**

1. **Motion foundation** (`lib/motion`, `components/motion`)
   - Lenis smooth scrolling, driven by the GSAP ticker (`lenis.on('scroll', ScrollTrigger.update)`), so ScrollTrigger and Lenis never drift apart. Mounted only in the `(marketing)` layout.
   - Clear split of responsibilities: **GSAP + ScrollTrigger** for scroll-scrubbed and pinned timelines; **Framer Motion** for component state, hover/press micro-interactions and route transitions. The two never animate the same element.
   - `useReducedMotion` is the single switch for everything. With reduced motion on: Lenis off, no pinning or scrubbing, reveals become short opacity fades, no parallax.
   - Shared easing and duration tokens (slow and confident, never bouncy). Contexts are created with `gsap.context()`/`useGSAP` and cleaned up on unmount, with no leaked triggers between routes.
2. **Sections** (the narrative runs from script to screen)
   1. **Hero:** cinematic text reveal (line-by-line mask/clip reveal, letterbox bars opening), a large still or slow ambient loop, and two CTAs: **"Enter the demo"** → `/demo-login` and **"Join early access"**. The headline is in the server-rendered HTML and visible without JavaScript; the reveal is added on top, so it never delays LCP.
   2. **The problem:** the chaos of spreadsheets, chat threads and scattered PDFs. Fragments drift and then snap into one workspace as you scroll.
   3. **Film-frame transitions between chapters:** sprocket-hole frame edges, gate weave, a brief exposure flash, and a frame-counter or slate that ticks as you scroll. Built with CSS/SVG masks and transforms, not heavy video.
   4. **"From script to screen" workflow:** a pinned, horizontally scrubbed sequence through the PRD §22 workflow: Project → Scenes → Cast & Crew → Locations → Schedule → Call Sheet → Daily Report → Budget. Each step shows a small animated product vignette.
   5. **Feature storytelling chapters** (scroll-triggered): scene breakdown cards, the shooting schedule with conflict warnings appearing, the call sheet arriving on a phone ("Fast on set"), planned-vs-actual budget.
   6. **Floating product UI mockups:** layered, slightly parallaxed panels (scene card, day plan, call sheet, budget chart), built as real React/HTML components styled with the design tokens, not screenshots. They stay crisp, themeable and accessible, and are filled from fixture data.
   7. **Built for independent productions:** India-first details (₹ in lakh, real crew departments, monsoon-proof planning) without overclaiming.
   8. **Closing CTA + footer:** demo entry, early-access form, and a link to "About this demo".
3. **Texture & visual craft**
   - Film grain as a lightweight animated SVG `feTurbulence` or tiny tiled noise texture, `pointer-events: none`, low opacity, frozen with reduced motion.
   - Subtle vignette, letterbox ratios (2.39:1 crops) and editorial type pairing (display serif plus a neutral sans), with large type sizes set via `clamp()`.
   - Imagery: synthetic or properly licensed stills (generated, or royalty-free with licences recorded in `docs/ASSETS.md`), served as AVIF/WebP through `next/image` with fixed dimensions so nothing shifts while loading.
4. **Page transitions & micro-interactions**
   - Route transition from the landing page into the demo (a short "fade to black / cut"). Use Framer Motion in a `template.tsx`, or the View Transitions API where available.
   - Magnetic/hover states on CTAs, cursor-aware highlights on mockups, focus styles that match hover quality.
5. **Mock-only rules for this phase**
   - The **early-access form is mocked**: it validates with Zod, stores the entry in `localStorage`, and shows a success state saying the entry was saved only in this browser. Nothing is sent.
   - **No fabricated social proof:** no fake customer logos, testimonials, user counts or press quotes (PRD §10: "do not display fabricated data as real"). If a quote-style element is used, it's clearly a product example, not a customer.
   - **No pricing figures.** The PRD says pricing must be tested first. Use "Early access" wording instead.
   - No analytics or tracking scripts. No third-party embeds (fonts are self-hosted with `next/font`).
6. **Responsive, accessible, performant**
   - Mobile gets its own choreography, not a scaled-down desktop: no horizontal pinning under 768 px (the workflow becomes a vertical stepped sequence), fewer layers, lighter parallax.
   - Semantic landmarks and headings, a skip link, decorative motion elements hidden from screen readers (`aria-hidden`), all content reachable and readable with keyboard and with JS disabled.
   - Performance budget: GSAP/Lenis code-split to the marketing route only (they never load in the app). Animate only `transform` and `opacity`. Lazy-load below-the-fold media. Pause off-screen loops with `IntersectionObserver`.

**Mock data:** A small, curated slice of the demo fixtures (one scene card, one shoot day, one call sheet, one budget summary from _City of Shadows_) used by the mockups, plus the local early-access entries.

**Exit criteria**

- Lighthouse mobile: Performance ≥ 90, Accessibility 100, CLS < 0.1, LCP < 2.5 s (enforced in CI with Lighthouse CI).
- Zero serious or critical axe violations. Full keyboard pass.
- With `prefers-reduced-motion: reduce`, the page has no scroll-jacking, pinning or parallax, and still tells the full story (Playwright test with reduced-motion emulation).
- Readable with JavaScript disabled (headline, sections and CTAs present in the HTML).
- Landing JS bundle stays within its budget, and the `(workspace)` bundle contains no GSAP or Lenis (checked with bundle analysis in CI).
- Verified on latest Chrome, Safari (including iOS), Firefox and Edge at 360 / 768 / 1280 / 1536 px.
- No outgoing network requests other than the app's own assets.

---

### Phase 2 — Demo auth, workspace & projects

**Goal:** A user can "sign in" as a demo role, see the project dashboard, create and edit projects, and land on a live project overview (PRD §8.1–8.3, Journey A).

**Scope**

- **Mock auth** (`authService`):
  - `/demo-login` role picker with all 8 PRD roles (Owner, Admin, Producer, Production Manager, Director, Department Lead, Crew Member, Client/Viewer).
  - Simulated sign-in and sign-out. Session persisted locally. Route guard redirects unauthenticated users to the role picker.
- **Workspace:** demo workspace with members. A workspace switcher UI with a second sample workspace, to prove the multi-workspace design. Settings page with demo member list and role labels (read-only for now).
- **Permissions matrix v1** in `lib/permissions`, including "crew members can't see financials".
- **Projects:**
  - Dashboard with project cards (cover image, type, status, dates), search, filters (status/type) and an archived toggle.
  - Create/edit project form with all PRD §8.2 fields, using Zod validation with accessible error messages.
  - Archive, duplicate (new title and dates, activity not copied) and change status.
  - Project switcher in the project header.
- **Project overview:**
  - Summary widgets derived from records: status, days to shoot, scenes total/scheduled/completed, next shoot day, budget used vs planned, crew count, recent activity.
  - Quick actions. They point to placeholder flows that are filled in by later phases.
  - Empty state for a new project.
- **Activity events v0:** every repository mutation writes an `ActivityEvent` (used fully in Phase 7).

**Mock data:** The 4 PRD demo projects (The Last Train, City of Shadows, Project Aurora, Between Monsoons) with correct types, statuses, budgets (₹8.5L / ₹35L / ₹12L / ₹5L stored in paise), cover images, and 1–2 demo users per role.

**Exit criteria:** Playwright passes Journey A on desktop and mobile. Overview metrics have unit tests. Archived projects are hidden by default. A newly created project shows empty states.

---

### Phase 3 — Production data: scenes, people, locations

**Goal:** A structured scene inventory linked to people and locations (PRD §8.4, 8.6, 8.7, Journey B).

**Scope**

- **Scenes:**
  - Full CRUD with every PRD field, duplicate, and delete with an impact-aware confirmation ("this scene is on Shoot Day 3").
  - Reorder with dnd-kit, plus an accessible keyboard alternative (move up/down).
  - Views: table (fast entry, virtualised), card, and grouped (by location/status/time of day).
  - Filters: location, time of day, character, status, plus text search.
  - Scene detail page with breadcrumbs, and a right-side panel preview on desktop.
  - A scene can exist without a location or cast.
- **People:**
  - Global directory (Cast / Crew tabs) and a project-level Cast & Crew page.
  - Person CRUD. Assign to a project with role/character, department and confirmation status.
  - Filters by department/status. Person detail shows their project assignments.
  - Contact details hidden for roles without permission. Emergency contact excluded from list views.
- **Locations:**
  - Global and project location directory, CRUD, permission-status tracking and filters.
  - Linked scenes. "Scenes by location" view.
  - A disclaimer that marking a location "Approved" does not mean it is legally permitted (PRD §8.7).
- **Relationships:** scene↔characters (ProjectPerson) and scene↔location, editable from either side.

**Mock data:** Scenes across the 4 projects matching the PRD counts (18 / 42 / 8 / 12 = 80 total). 35 people across all departments and statuses. 15 locations across all permission states. The generator makes sure every filter value has at least one match.

**Exit criteria:** Journey B passes in E2E. Deleting a linked scene shows its impact. Filters and grouped views are covered by component tests. Privacy rules are tested for the Crew Member and Client roles.

---

### Phase 4 — Planning: breakdown, shots, storyboards, schedule

**Goal:** Turn scenes into a practical shooting plan with transparent warnings (PRD §8.5, 8.8, 8.9, 8.10, Journey C).

**Scope**

- **Breakdown:**
  - Breakdown items per scene across all 13 PRD categories, with department, quantity, status (required/sourced/ready/unavailable) and notes.
  - One item can link to multiple scenes.
  - Department view and a consolidated requirements list.
- **Shot lists:**
  - Shots within a scene, with numbering unique per scene (validated).
  - All PRD fields and statuses (Planned/Ready/Shot/Retake).
  - Views: by scene, all shots, sequence view. Reorder with dnd-kit.
- **Storyboards:**
  - Sequences and frames linked to scene/shot, using placeholder images from `/public/mock/storyboards`.
  - Add, delete and reorder frames. Grid and sequence views. Read-only share view (mock route).
- **Shooting schedule:**
  - Shoot day CRUD and duplicate. Add/remove/reorder scenes. Per-scene planned start and duration, with a running day timeline.
  - Assign cast/crew with individual call times.
  - Calendar (month/week) view and day-plan view.
  - Status flow: Draft → Published → Completed / Cancelled.
- **Conflict & warning engine** (`lib/domain/scheduling`, pure, unit-tested). It warns and never blocks (PRD §5 "Human control"):
  - Person on overlapping shoot days.
  - Same location needed by two active days at the same time.
  - Scene location differs from the day's base location.
  - Scene scheduled twice without the "split / multiple setup" flag.
  - Incomplete breakdown requirements (warning only).
  - Day's planned scene time exceeds the call-to-wrap window.
- **Publishing a schedule** shows a pre-publish review of all warnings (each must be resolved or acknowledged), creates a new schedule version and writes an activity event.

**Mock data:** 12 shoot days spread across projects (mostly City of Shadows and The Last Train). 100 shots. 30 storyboard frames. Breakdown items. **Conflicts are seeded on purpose** (one double-booked actor, one location clash, one location mismatch) so the warning engine has something to show.

**Exit criteria:** Journey C passes in E2E. The conflict engine has unit tests covering every rule, including time-zone edge cases. Schedule changes show up on the overview.

---

### Phase 5 — Shoot execution: call sheets & daily reports

**Goal:** Go from a shoot day to a published call sheet and a submitted daily report (PRD §8.11, 8.13, Journeys D & F).

**Scope**

- **Call sheet generator:**
  - Generated from a shoot day, including only that day's scenes and people.
  - Editable call-sheet-specific fields: weather (manual text), map link (plain URL), meals, transport/parking, wardrobe/makeup, safety notes.
  - Preview, then **simulated publish**, which freezes an immutable `content_snapshot` and assigns a revision number and timestamp.
  - Publishing a revision marks the previous one as **Superseded**. Revision history list.
  - Sensitive contacts hidden unless permitted. Emergency contact shown only if explicitly authorised.
- **Read-only share view** at `/share/call-sheets/[id]`. It is mobile-first, with call time and location visible without scrolling. Since there is no backend, the "share link" only works in the same browser, and the UI says so.
- **PDF export:** a print-optimised stylesheet with "Save as PDF" through the browser print dialog. (`@react-pdf/renderer` is a fallback if print fidelity isn't good enough. It still runs fully on the client.)
- **Daily reports:**
  - Created from a shoot day: actual call/wrap, scenes completed/incomplete, retakes/pickups, delays and reasons, weather/site conditions, incidents, equipment issues, notes.
  - Submitting a report updates scene and shot statuses (Shot / Needs Pickup / Retake). A completed scene can still have Retake shots.
  - Chronological report list and planned-vs-actual comparison.
- **Simulated notifications:** publishing a call sheet produces in-app "sent to N people" notifications through `notificationService`. Nothing is actually sent.

**Mock data:** 8 call sheets, at least 2 of them with multiple revisions (one superseded). 10 daily reports, including delays, pickups and an incident.

**Exit criteria:** Journeys D and F pass in E2E. Published snapshots are proven immutable (editing the shoot day after publishing doesn't change the published sheet). The print layout is checked visually with Playwright screenshots.

---

### Phase 6 — Budget, expenses & role-based access

**Goal:** A producer understands the production's financial position, and financial data is hidden from unauthorised roles (PRD §8.12, §8.1 roles, Journey E).

**Scope**

- **Budget:**
  - Line items across all 15 PRD categories, with vendor, planned/actual/paid amounts, due date and payment status (Pending / Partially Paid / Paid).
  - Expenses linked to line items.
  - Mock receipt attachment (uses the Phase 7 file service, or a placeholder until then).
- **Calculations** in `lib/domain/budget`, using integer paise math and exhaustive unit tests: variance, remaining, outstanding, percent utilised (exactly as defined in PRD §8.12).
- **Clear visual separation of planned, committed, actual and paid amounts.** Committed is simplified in this phase, as the PRD allows.
- **Budget dashboard:** planned vs actual by category (Recharts), utilisation meter, overdue payments. Filters by category and payment status.
- **Permissions hardening:**
  - Full `can()` matrix applied to every module.
  - Financial routes and widgets hidden for Crew Member and Client/Viewer, and mock repositories reject those reads.
  - Role switcher in the dev toolbar so a demo can show the same project from different roles.

**Mock data:** 60 budget line items/expenses across projects with a mix of payment statuses. At least one category over budget and one overdue payment.

**Exit criteria:** Journey E passes in E2E (except export, which is Phase 7). Budget math has 100% branch coverage. A permission test suite checks each of the 8 roles against each module.

---

### Phase 7 — Activity, notifications, files, search & exports

**Goal:** The cross-cutting features that make the workspace feel complete (PRD §8.14–8.16).

**Scope**

- **Activity feed:** per project and per workspace, filterable by entity type. Covers all PRD §8.15 event types.
- **Notification centre:** in-app bell with unread state, fed by `notificationService`. Notifications are simulated, and labelled as such.
- **Files (mock):**
  - "Upload" images and PDFs to **IndexedDB**, with enforced type limits (JPG/PNG/WebP/PDF) and size limits (for example 5 MB per file, 50 MB per demo workspace). Video files rejected.
  - Categorise by scene/department, tags, image/PDF preview, download, permission-aware visibility.
  - The UI says plainly that files stay in this browser.
- **Global project search:** command palette (⌘K) across scenes (number/slugline/character), people, locations and shots.
- **Exports** (`exportService`, client-side only): CSV for scene breakdown, schedule and budget. PDF through print views.
- **Unsaved-changes guard** on all forms. Toasts for success and failure on every mutation.

**Mock data:** 50 activity events across projects. Sample files (a placeholder script PDF, reference images).

**Exit criteria:** Exports open correctly in spreadsheet software (checked against fixtures with snapshot tests). File limits are enforced with clear errors. Search returns expected results for seeded queries.

---

### Phase 8 — Polish, quality & mock API contract

**Goal:** A demo-ready, accessible, responsive prototype that's ready for user interviews and design-partner testing (PRD §15, §17). The mock layer is also hardened so it behaves like a real API, still without any real backend.

**Scope**

- **Responsive QA:** every screen at 360 / 768 / 1280 / 1536 px. Wide tables become stacked cards on mobile. Touch targets at least 44 px.
- **Accessibility pass:** axe checks in Playwright on every route, a keyboard-only walkthrough of all journeys, visible focus, announced form errors, contrast checks for normal and high-contrast mode.
- **Performance:** virtualised long lists, optimised placeholder images (`next/image`), route-level code splitting, Lighthouse budget in CI.
- **State coverage audit:** every list and page has loading, empty, error and success states (simulated latency and failures make these testable).
- **Mock API contract (optional, recommended):**
  - Add **MSW** handlers that expose the repositories as REST-style endpoints (`/api/mock/projects/...`) inside the browser.
  - Add an `HttpRepository` implementation that calls them.
  - A feature flag picks `MockRepository` (direct) or `HttpRepository` + MSW (mock network).
  - This tests the API shapes, error handling and pagination without building a server. Both modes still run entirely on mock data.
- **Demo experience:**
  - Guided tour / onboarding checklist following the PRD §22 workflow (Project → Scenes → Cast & Crew → Locations → Schedule → Call Sheet → Daily Report → Budget).
  - "About this demo" page listing the prototype limitations from PRD §10.
  - Refresh the landing-page mockups (Phase 1) so they match the finished product screens.
- **Feedback instrumentation (mock):** a local event log of key actions (project created, shoot day published, call sheet generated) that can be viewed and exported as JSON for interview sessions. No analytics provider.

**Exit criteria:** All six PRD journeys (A–F) pass in E2E on desktop and mobile viewports. Zero serious or critical axe violations. Lighthouse targets met. The deployed static demo is shareable with design partners.

---

## 4. Testing strategy (all phases)

| Layer         | Tool                       | What it covers                                                                                                         |
| ------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Domain logic  | Vitest                     | Budget math, conflict engine, overview metrics, call-sheet snapshots, formatters. Highest coverage target (≥ 90%).     |
| Fixtures      | Vitest                     | Every record passes its Zod schema. All foreign keys resolve. Counts match PRD §10 volumes. The seed is deterministic. |
| Repositories  | Vitest                     | CRUD, filters, permission rejections, persistence and migration.                                                       |
| Components    | Vitest + RTL               | Forms (validation, error announcement), filters, status badges, empty states.                                          |
| Journeys      | Playwright                 | PRD Journeys A–F on desktop and mobile viewports. "No external network" guard.                                         |
| Accessibility | axe + Playwright           | Every route.                                                                                                           |
| Landing page  | Lighthouse CI + Playwright | Performance budget, reduced-motion emulation, JS-disabled rendering, visual snapshots of key scroll positions.         |

## 5. Mock-to-real migration notes (future work, not part of this plan)

These are recorded so mock-phase decisions don't block the PRD's real MVP later. **None of this is built in any phase above.**

- Repositories are async and interface-based, so a real backend replaces only the implementation.
- Zod schemas can be reused for server-side validation.
- The `can()` permission matrix moves to server-side enforcement. The client copy then only controls what the UI shows.
- Money in paise, UTC timestamps and immutable call-sheet snapshots already follow PRD §12 integrity rules.
- Mock services (`authService`, `notificationService`, `fileService`, `exportService`) each correspond to one future provider (managed auth, email, object storage, server-side PDF).

## 6. Decisions to confirm

1. **Demo date:** 2026-11-15 (Asia/Kolkata) as the fixed "today", so City of Shadows is mid-shoot and The Last Train is ~2 weeks from its first shoot day.
2. **Package manager:** ~~pnpm~~ npm (decided in Phase 0).
3. **Licence** for the GitHub repository.
4. **Accent colour and typefaces.** Proposed: warm amber/tungsten accent, editorial serif display, neutral sans for UI.
5. **Landing imagery source:** AI-generated stills, royalty-free stock, or commissioned photography (this affects licensing and how the hero looks).
6. **Trademark:** "Continuity" is a common film term, and name/trademark availability has not been checked (the PRD flagged the same issue for SetFlow).
