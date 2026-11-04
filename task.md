# Amores Perros — Κυνοκομείο Δήμου Μετεώρων

## Requirements (from user)
A. Simple site
B. Photo grid of dogs + text; adopted dogs turn grayscale with an ADOPTED stamp
C. Donate button/section wired to a bank account (details TBD, deposit reference e.g. STRAYDOGS) — full transparency
D. Adoption form (modeled on their Google Form) — required before adoption
E. Volunteer form (modeled on heraklion.gr φιλόζωου αίτηση)
F. Social links (Instagram)
G. English version (full EL/EN bilingual)

## Decisions
- Style: white bg, pastel pink/yellow/mint/sky, black comic-style type, thick black outlines, chunky offset shadows
- Fonts: Comfortaa (display) + Commissioner (body) — both support Greek
- Forms → stored in Turso DB + emailed to sarantiath@gmail.com (Resend; needs RESEND_API_KEY)
- Placeholder dog photos (Unsplash) + generated comic logo
- Donation/contact details left as clearly-marked placeholders ("αργότερα")

## Progress
- [x] app_init, assets (12 dog photos, hero/about/volunteer/shelter, logo, favicon)
- [ ] design.md
- [ ] schema + seed
- [ ] api routes (dogs, applications, admin)
- [ ] i18n + layout
- [ ] pages: home, adopt, volunteer, donate, admin
- [ ] build + deliver

## Session 2 — frontend complete (verified)
- provider.tsx wraps LocaleProvider; app.tsx routes /, /adopt, /volunteer, /donate, /admin inside Layout
- pages/adopt.tsx, volunteer.tsx, donate.tsx, admin.tsx written
- `.dots` must be an ABSOLUTE overlay (opacity .08) — fixed on adopt/volunteer/donate
- bun run build OK, tsc --noEmit OK (root `bun run lint` fails on a pre-existing mobile template rule, untouched)
- dev server on 4200 (tmux session "ap")
- Verified: dogs grid + grayscale ADOPTED stamps, EL/EN toggle, adoption + volunteer POST (id returned, emailed:false — no RESEND_API_KEY), admin passcode gate + tables; test rows deleted from DB
## Still pending from user
- RESEND_API_KEY, real dog photos/texts, IBAN + bank + beneficiary, phone/email/address, Instagram URL

## Uniform dog cards + full profiles
- Matching 4:5 image frames and fixed-height summaries across available/adopted dogs.
- Whole card links to `/dogs/:slug`; full bilingual bio, traits, health and gallery on profile.
- Adoption CTA stays on available profiles only; selected dog passed into the form.
- Verified desktop (1280px) and mobile (390px): all 13 cards identical dimensions per viewport, no horizontal overflow; click-to-profile, adoption link, adopted state and not-found state pass.
- Restarted dev server to clear a stale Vite app.tsx transform; session `ap`, port 4200.

## Full Netlify export
- Added `netlify.toml` and `packages/web/netlify/functions/api.ts` (Hono adapter, modern custom /api paths, Node 24).
- Function kept under web package so Netlify's NFT bundler preserves workspace dependency resolution; root-level function failed and was removed.
- Explicit SPA rewrites preserve profile/admin deep links without swallowing API routes.
- Adapter blocks public Better Auth signup bypass and foreign Origin headers; invite registration remains internal via oRPC.
- Added Greek `NETLIFY-README.md` with Git/CLI deployment, env scopes, same-database/storage preservation, S3 CORS and checks.
- Build passed; official Netlify function packager produced Node 24 stream function with /api and /api/* routes.
- Node 24 packaged API verified: health, unknown API 404, unauthorized admin, foreign origins, direct signup block.
- Isolated SQLite cloned schema ONLY: invite registration/login/bearer, first admin, dog CRUD/gallery/adopt/reorder, upload URL generation, both forms saved/admin review; no production writes or email sends.
- Read-only production checks: 15 dogs, deleted maximos/elpida/flokos absent, address Καλαμπάκα.
- Clean export installed with frozen lockfile; production web build under Node 24 passed. Official Netlify packager + complete isolated API test suite passed again from clean export.
- ZIP `/home/user/exports/amores-perros-full-netlify.zip`: 167 files, 14.04 MiB. TOML routing, new galleries, credential scan and ZIP integrity passed; excludes env files, dependencies, generated output and operational import scripts.
- No live Netlify deployment performed; user must configure the existing database/storage credentials and deploy via Git/CLI.

## Live Netlify repair — verified 2026-11-04
- Site shelterdogsk, ID 07e82335-fadb-4d67-ba39-6cf407c1b394.
- Root cause: Turso credentials valid, but new database had no tables.
- Installed schema + exact 15 current dogs, 13 gallery rows and public settings transactionally into NEW database only.
- Initial photo paths mapped to identical optimized assets already on live deployment; all 28 verified.
- Deployed full first-install package via connected Netlify MCP. Deploy 6aea78c7b3c22f4a6fcd98f8 ready.
- New owner admin created using connected Netlify owner email, secure generated password delivered separately (never Git).
- Admin API login, protected dog list and browser dashboard verified; 15 dogs and zero test applications remaining.
- Adoption and volunteer forms saved/admin-visible; synthetic test records removed. Email not configured.
- Browser homepage: all 15 card images decoded; dog detail deep link verified.
- Netlify advanced secret flag/scopes returned403; standard server environment variables succeeded. No client-prefixed secrets used.
- Upload storage credentials and Resend notifications still pending. Public bank/contact settings include placeholders; owner must replace.
- Added idempotent first-install files/config/assets to source so future Git deploys preserve the installed data and admin.
