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

## Donation links and compact dog galleries
- Donation CTAs now use normal /donate URLs; mobile header always shows donation button. Hover/active shadows no longer move the clickable hit box.
- Public route changes scroll to top without affecting hash navigation.
- Dog cards open native modal dialogs (max 880px, 90dvh), retaining direct hrefs for modified clicks. Close button, Escape, backdrop, native focus trapping and restoration; background scroll locked.
- Shared DogDetails/DogGallery preserve bilingual stories, traits, health and adoption CTA on popup + direct profile pages.
- Uncropped main photo, arrows, thumbnail selection, counter, keyboard arrows and touch swipe. Single-photo dogs show one photo with no fake extra items.
- Build passed. Playwright local tests passed: 15 cards, thumbnails/arrows/keyboard, focus/close/Escape/backdrop, repeated donation edge clicks, 390px/320px mobile no overflow, deep links and single-photo fallback.
- Live deploy 6af34a08dfa537040a9ff435 ready at https://shelterdogsk.netlify.app. Complete UI test suite passed on the live site, including repeated donation navigation and desktop/mobile galleries. Additional live touch-swipe and selected-dog adoption CTA tests passed.
- GitHub main updated with UI changes (13051a0). No database records or administrator credentials were changed.

## Shelter rebrand and requested .gr domain
- User approved replacing all visible Amores Perros branding with Κυνοκομείο Δήμου Μετεώρων, retaining the original dog illustration.
- Updated bilingual wordmark/header/footer/forms/login, document title/social metadata, notification sender name/footer and sharing image. Added downloadable Greek logo lockup.
- Public footer displays requested kinokomeiodimoumeteoron.gr as text only until DNS/domain configuration is active.
- Preserved existing storage/token keys, accounts and dog records. Removed only obsolete placeholder beneficiary from live settings; did not substitute an unverified bank-account name or alter IBAN.
- Updated first-install contact snapshot to confirmed public email/phone and blank placeholder beneficiary.
- Domain DNS Google resolver returned NXDOMAIN for apex/www and no NS records. Netlify connected inventory has no custom-domain write action; browser Netlify dashboard is not logged in. Registrar/Netlify domain configuration requires owner input.
- Kept WEBSITE_URL on working Netlify hostname; custom-domain auth/origin switch pending domain activation, to avoid breaking live forms/admin.
- Local build and mobile header overflow tests passed. Live rebrand deploy 6af443319f88bc53f2c1a569 is ready at https://shelterdogsk.netlify.app.
- Live verification passed: Greek title/branding across home, adoption, volunteer, donation and admin login; no old name in rendered page text; original dog illustration retained. Contact mailto/tel unchanged; logo lockup and sharing image served successfully.
- Full live gallery regression passed: 15 cards, arrows/thumbnails/keyboard, close/backdrop/Escape/focus restoration, repeated donation links, 390px/320px mobile, direct profiles and single-photo fallback.
- Rechecked apex/www DNS: NXDOMAIN (status 3), no NS answers. Custom domain remains unconnected; registrar and exact purchased spelling needed from owner.

## Per-dog official adoption references
- User selected individual official listing URLs with an editable field in each dog's admin form. No individual listing URLs were provided, so all existing fields remain blank.
- Added petGovUrl storage, a repeatable additive migration and production build migration hook. Existing dogs, photos, accounts and application data are preserved.
- Admin field validates HTTPS individual listings on pet.gov.gr/adoptastray.gov.gr with a numeric details?id value. Blank values can be saved; unrelated updates preserve existing URLs.
- Every popup/direct profile shows the individual link when supplied. Missing links are explicitly labeled with a separate general platform browse link; no listing IDs, registration status or legal-compliance claims invented.
- Build passed. Isolated API tests passed: additive migration/idempotence, URL allowlist, authorization, create/update/read/clear and preservation. Browser tests passed for all 15 missing-link references; browser-only mocked individual URLs and admin field validation/save/clear passed without real dog data changes.
- Live deploy 6af44b4548b86a783edbd377 ready on the existing https://shelterdogsk.netlify.app site. All 15 blank fields/public references verified. Full live gallery/donation regression passed; Greek/English references, 320px layout and unauthorized mutation rejection verified. Browser-only mocked populated links/admin inputs passed against the deployed frontend; actual persistence/validation tested in isolated SQLite, not by assigning fake URLs to real dogs.
- Source pushed to existing GitHub main (aa2945b). Individual official listing URLs still need to be entered by staff; adding this feature does not publish dogs to the government platform or establish legal compliance.

## Municipality donation banking details
- User supplied bank account certificate and explicitly approved publishing only the bank name, beneficiary and IBAN. Certificate image and handwritten tax number remain private and are not included in website assets or Git.
- Confirmed transcription: Τράπεζα Πειραιώς; ΔΗΜΟΣ ΜΕΤΕΩΡΩΝ; GR33 0172 6150 0056 1505 1178 648. IBAN has 27 characters and passes mod-97 checksum (this is format validation, not independent bank-account verification).
- Saved these three fields through the existing live administrator settings API and verified readback. Other contact/social/reference settings preserved exactly; local preview and initial-install snapshot synchronized.
- Live bank details already visible with no horizontal overflow at 1280/390/320px. Updated donation note to avoid saying the now-published account is still awaiting publication. Build passed.
- Deployment 6af44db904b5e5969b715c34 ready on the existing site. Live Greek/English details and corrected note verified, along with 1280/390/320px layout and exact clipboard copying of the IBAN. Source pushed to existing GitHub main (042687e).

## New public contact and in-kind donation offers
- User approved replacing public contact email with info@kinokomeiodimoumeteoron.gr and an in-page /donate form: name, phone, email, goods, quantity, proposed date, optional time/notes and contact consent.
- Live settings email saved and read back through existing admin API; all bank/contact/social/reference fields otherwise preserved. Local preview, fallback contact and installer snapshot aligned.
- Added private in_kind_donations table and additive/idempotent migration to production installer; no existing data replaced. Submissions are stored before optional notification, and are visible in Admin → Applications → In-kind donations with review status, internal notes and CSV export.
- Date/time validated server-side, with Greece-local minimum date and required contact consent. Public copy explicitly says delivery requires confirmation, not an automatic appointment. Success/error/reset states preserve the surrounding donation page.
- Notifications use the maintained public contact address when email delivery is configured. User text escaped in HTML notifications. No mailbox or email credentials created. DNS MX check returned NXDOMAIN/no records; domain/mailbox setup and Resend delivery remain pending.
- Build passed. Isolated API tests passed for new submissions, validation, consent, private access/review/notes/deletion, migration preservation and missing-email-provider persistence. Browser-only mocked UI tests passed at 1280/390/320px, including email link, error/retry/success/reset, English labels and admin details.
- Live deploy 6af45242e13ec1609fb0c854 ready on the existing site; source pushed to GitHub main (ccac309).
- Actual live browser submission saved all contact/goods/quantity/proposed date/time/consent fields, displayed success, and was visible in authenticated Admin → Applications → In-kind donations. Notification reported emailed:false. Synthetic submission removed afterward; all preexisting applications verified unchanged.
- Live responsive/localized/error/success/admin UI tests and the full gallery/donation regression passed. Public new mailto link verified. Automatic email delivery and Papaki mailbox/DNS activation are not configured; offers remain available in admin.

## Remove Instagram
- Removed public Instagram icons/links and all Greek/English references in contact text, help/error copy and volunteering suggestions. Home contact CTA now opens the maintained email; footer social heading changed to participation.
- Removed Instagram input from admin settings, cleared its live/local stored URL and installer/default values, retaining only the legacy API key for compatibility. All other contact/bank settings preserved.
- Build and local Greek/English public-page checks passed. Live removal deployment pending verification.
