# Amores Perros — ΠΡΩΤΗ ΕΓΚΑΤΑΣΤΑΣΗ στο Netlify

Αυτό είναι το νέο πακέτο **πρώτης εγκατάστασης**, όχι το προηγούμενο πακέτο σύνδεσης στην παλιά βάση.

Περιλαμβάνει ολόκληρη την εφαρμογή (frontend + Netlify Function), admin, φόρμες υιοθεσίας/εθελοντισμού και **στιγμιότυπο των σημερινών δημόσιων στοιχείων**. Στην πρώτη εγκατάσταση σε **νέα, άδεια βάση Turso** δημιουργεί τους πίνακες και εισάγει τα δεδομένα αυτόματα.

## Τι θα εμφανιστεί

- Τα σημερινά **15 προφίλ σκύλων**, με την ίδια σειρά, ελληνικά/αγγλικά βιογραφικά, ηλικίες, χαρακτηριστικά και κατάσταση υιοθεσίας.
- Οι σημερινές φωτογραφίες και gallery: έχουν αντιγραφεί στο πακέτο, ώστε η αρχική εμφάνιση να μην εξαρτάται από το παλιό storage.
- Τα σημερινά δημόσια στοιχεία επικοινωνίας, δωρεάς και social links, με διεύθυνση **Καλαμπάκα**. Όσα πεδία είναι κενά σήμερα παραμένουν κενά.
- Νίκη & Μαίρη σε κοινό προφίλ, Νίκος, Νταρντάνα και χωριστά Ρίτσι/Σκούμπυ. Οι maximos/elpida/flokos δεν εισάγονται.
- **Κενό προσωπικό και κενές αιτήσεις**. Δεν περιλαμβάνονται παλιοί λογαριασμοί, κωδικοί, sessions ή προσωπικά δεδομένα αιτούντων.

Το στιγμιότυπο είναι στο `netlify-install/current-public-data.json` και οι αντίστοιχες φωτογραφίες στο `packages/web/public/images/first-install/`. Το αρχείο καταγράφει και τον χρόνο λήψης· μεταγενέστερες αλλαγές στο παλιό site δεν μεταφέρονται αυτόματα στη νέα ανεξάρτητη βάση.

## 1. Προετοιμασία υπηρεσιών

Χρειάζονται δικοί σας λογαριασμοί Netlify, Turso και S3-compatible storage. Το ZIP **δεν δημιουργεί λογαριασμούς παρόχων και δεν περιέχει μυστικά**.

1. Δημιουργήστε **νέα, άδεια απομακρυσμένη βάση Turso/libSQL** και token με δικαιώματα ανάγνωσης/εγγραφής. Αν θέλετε ανεξάρτητη πρώτη εγκατάσταση, μη χρησιμοποιήσετε τη βάση του παλιού site.
2. Δημιουργήστε S3-compatible bucket και κλειδιά με δικαιώματα GET/PUT σε αυτό. Οι αρχικές φωτογραφίες είναι στο ZIP· το bucket χρειάζεται για τις **νέες φωτογραφίες που ανεβάζετε από το admin**.
3. Επιλέξτε τελικό Netlify URL ή custom domain. Θα το χρησιμοποιήσετε ακριβώς στο `WEBSITE_URL` και στο CORS του bucket.

## 2. Εγκατάσταση μέσω Git — προτεινόμενη

1. Αποσυμπιέστε το ZIP και ανεβάστε το περιεχόμενο του φακέλου `amores-perros-netlify-first-install` σε ιδιωτικό Git repository. Στη ρίζα πρέπει να βρίσκονται `netlify.toml`, `package.json`, `bun.lock`, `netlify-install/` και `packages/`.
2. Στο Netlify εισάγετε αυτό το repository ως νέο project. Διατηρήστε τις ρυθμίσεις του `netlify.toml`:

| Ρύθμιση | Τιμή |
| --- | --- |
| Base directory | Κενό — ρίζα repository |
| Build command | `bun run build:netlify` |
| Publish directory | `packages/web/dist` |
| Functions directory | `packages/web/netlify/functions` |
| Node build version | `24` |
| Bun version | `1.3.14` |

3. Πριν από το επιτυχές production deploy, συμπληρώστε τις Environment variables του επόμενου πίνακα. Αν το πρώτο αυτόματο build ξεκινήσει πριν τις βάλετε, θα σταματήσει χωρίς να κάνει εγκατάσταση· προσθέστε τις τιμές και κάντε νέο deploy.
4. Κάντε production deploy. Το build εκτελεί την αρχικοποίηση της νέας βάσης και μετά χτίζει το frontend και το backend.
5. Στα build logs πρέπει να εμφανιστεί: `[first-install] Installed 15 current dogs...`. Επιβεβαιώστε ότι υπάρχει Function με όνομα `api`.

**Δεν εγκαθίσταται με απλό Netlify Drop / drag-and-drop.** Το Drop μόνο του δεν εγκαθιστά το backend, τη βάση ή τις φόρμες.

## 3. Environment variables

Βάλτε τις πραγματικές τιμές **στο Netlify UI**, όχι στον κώδικα ή στο Git. Χρησιμοποιήστε production context και τα παρακάτω scopes. Αν το πλάνο δεν προσφέρει ξεχωριστά scopes, επιλέξτε όλα τα scopes.

| Μεταβλητή | Τιμή | Scope |
| --- | --- | --- |
| `DATABASE_URL` | Το `libsql://…` URL της νέας, άδειας βάσης | **Builds + Functions** |
| `DATABASE_AUTH_TOKEN` | Token ανάγνωσης/εγγραφής της ίδιας βάσης | **Builds + Functions** |
| `WEBSITE_URL` | Το τελικό HTTPS URL, χωρίς `/admin` ή `/api` | Functions |
| `BETTER_AUTH_SECRET` | Νέο ισχυρό τυχαίο secret τουλάχιστον 32 χαρακτήρων | Functions |
| `STAFF_INVITE_CODE` | Νέος ιδιωτικός κωδικός πρόσκλησης έως 120 χαρακτήρες | Functions |
| `S3_ENDPOINT` | Το endpoint του δικού σας storage | Functions |
| `S3_BUCKET` | Το όνομα του νέου bucket | Functions |
| `S3_ACCESS_KEY_ID` | Κλειδί πρόσβασης του bucket | Functions |
| `S3_SECRET_ACCESS_KEY` | Το αντίστοιχο μυστικό κλειδί | Functions |
| `AWS_LAMBDA_JS_RUNTIME` | `nodejs24.x` | Builds + Functions |
| `APPLICATION_ID` | Προαιρετικά, το υπάρχον application ID για συνέχεια στα analytics | Builds |
| `RESEND_API_KEY` | Προαιρετικά, Resend key για ειδοποιήσεις email | Functions |
| `NOTIFY_EMAIL` | Παραλήπτης ειδοποιήσεων· προεπιλογή `sarantiath@gmail.com` | Functions |
| `NOTIFY_FROM` | Προαιρετικά, αποστολέας από verified domain στη Resend | Functions |

Παράδειγμα μόνο για τη μορφή του URL: `https://YOUR-SITE.netlify.app`. Τα μυστικά δεν έχουν πρόθεμα `VITE_` — διαφορετικά μπορεί να εκτεθούν στον browser.

Χωρίς Resend, οι φόρμες αποθηκεύονται κανονικά στη νέα βάση και εμφανίζονται στο admin, αλλά δεν στέλνουν email. Για πραγματικές ειδοποιήσεις χρησιμοποιήστε verified sender, όχι τον δοκιμαστικό αποστολέα της Resend. Τα AI/payment keys του template και το παλιό `ADMIN_PASSCODE` δεν χρειάζονται.

**Μην ενεργοποιήσετε deploy previews με production credentials.** Η αρχικοποίηση σταματά σε preview/branch contexts. Για staging απαιτείται ξεχωριστή βάση και bucket και κατάλληλη ξεχωριστή διαδικασία εγκατάστασης.

## 4. Δημιουργία πρώτου admin

1. Μόλις ολοκληρωθεί το deploy, ανοίξτε `/admin/login`.
2. Επιλέξτε εγγραφή και συμπληρώστε όνομα, email, δικό σας ισχυρό password και το ιδιωτικό `STAFF_INVITE_CODE` που βάλατε στο Netlify.
3. Ο **πρώτος λογαριασμός** που δημιουργείται γίνεται admin. Δημιουργήστε τον ελεγχόμενα, πριν κοινοποιήσετε κωδικό πρόσκλησης σε άλλους.
4. Συνδεθείτε με email/password. Οι επόμενοι λογαριασμοί παίρνουν ρόλο staff και ο admin διαχειρίζεται τους ρόλους.

Δεν υπάρχει έτοιμος κοινός κωδικός admin μέσα στο ZIP. Η απευθείας δημόσια HTTP εγγραφή του Better Auth μπλοκάρεται ώστε να μην παρακάμπτεται ο κωδικός πρόσκλησης. Δεν έχει προστεθεί CAPTCHA ή κατανεμημένο rate limiting· εξετάστε προστασία κατά spam πριν από μεγάλη δημόσια προβολή.

## 5. CORS του bucket για νέες φωτογραφίες

Στον storage provider επιτρέψτε το ακριβές τελικό origin του site. Ενδεικτικός κανόνας S3 — αντικαταστήστε το URL με το δικό σας και προσαρμόστε τη μορφή στον πάροχο:

```json
[
  {
    "AllowedOrigins": ["https://YOUR-SITE.netlify.app"],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

Οι νέες φωτογραφίες ανεβαίνουν με signed PUT και διαβάζονται μέσω `/api/media/*`. Μην κάνετε δημόσια τα credentials. Οι αρχικές φωτογραφίες δεν χρειάζονται πρόσβαση στο παλιό bucket.

## 6. Εναλλακτικά με Netlify CLI

Με Node 24 και Bun εγκατεστημένα, από τη ρίζα του αποσυμπιεσμένου project:

```bash
bun install --frozen-lockfile
npm install -g netlify-cli
netlify login
netlify init
```

Ρυθμίστε τις μεταβλητές στο Netlify UI και μετά:

```bash
netlify deploy --build --prod
```

Για υπάρχον Netlify project χρησιμοποιήστε `netlify link` αντί για `netlify init`. Η εντολή κάνει build και δημοσιεύει frontend και Functions — μην ανεβάσετε μόνο το `dist`.

Αν θέλετε να κάνετε την αρχικοποίηση τοπικά, οι μεταβλητές μπαίνουν μόνο σε root `.env` (ποτέ Git), και εκτελείτε `bun run setup:netlify`. Η εντολή γράφει στη βάση του `DATABASE_URL`: ελέγξτε ότι είναι η νέα βάση πριν την εκτελέσετε.

## 7. Έλεγχος και επόμενα updates

- `/api/health` επιστρέφει JSON `{"status":"ok"}`, όχι HTML.
- Η αρχική δείχνει τα 15 σημερινά προφίλ. Απευθείας άνοιγμα/refresh στα `/dogs/niki-mary`, `/dogs/nikos`, `/dogs/dardana`, `/dogs/ritsi`, `/dogs/scooby` και `/admin/login` λειτουργεί.
- Ελέγξτε ελληνικά/αγγλικά, galleries, διεύθυνση Καλαμπάκα, στοιχεία δωρεάς και σύνδεση admin.
- Υποβάλετε ελεγχόμενη δοκιμαστική αίτηση και επιβεβαιώστε ότι φαίνεται στο admin. Δοκιμάστε νέα φωτογραφία για επιβεβαίωση S3/CORS. Οι production δοκιμές γράφονται στην πραγματική **νέα** βάση.

Η αρχικοποίηση είναι συναλλαγή: είτε εισάγεται ολόκληρο το στιγμιότυπο είτε γίνεται rollback. Αν βρει οποιαδήποτε υπάρχοντα δεδομένα, **δεν τα επανεισάγει και δεν τα αντικαθιστά**. Σε μελλοντικά builds θα εμφανίζει `Existing database detected...`.

Έτσι, οι νέοι σκύλοι, οι αλλαγές, οι λογαριασμοί και οι αιτήσεις που θα καταχωρίσετε μετά την πρώτη εγκατάσταση δεν χάνονται στα updates. Ακόμη κι αν διαγράψετε όλους τους σκύλους, το αποθηκευμένο flag αποτρέπει την επαναφορά τους. Διατηρείτε τα ίδια credentials της νέας βάσης/storage, τα αρχικά assets και backup από τους παρόχους. Το πακέτο δεν κάνει schema migration μελλοντικών εκδόσεων.

Αν δείτε `Existing database detected...` στο **πρώτο** deploy και θέλατε ακριβώς το παρεχόμενο στιγμιότυπο, συνδέσατε μη άδεια βάση: χρησιμοποιήστε νέα, άδεια βάση, χωρίς να διαγράψετε την παλιά.

## Κατάσταση ελέγχων

Στις 4 Νοεμβρίου 2026 ολοκληρώθηκε ζωντανό deploy στο https://shelterdogsk.netlify.app και αρχικοποίηση της νέας βάσης Turso. Επιβεβαιώθηκαν τα 15 προφίλ, όλες οι φωτογραφίες των καρτών, σύνδεση διαχειριστή και αποθήκευση/εμφάνιση των δύο φορμών στο admin. Τα δοκιμαστικά στοιχεία αιτήσεων αφαιρέθηκαν. Ο λογαριασμός ιδιοκτήτη έχει δημιουργηθεί· τα στοιχεία πρόσβασης παρέχονται ιδιωτικά, όχι στο repository.

Τα νέα uploads απαιτούν ακόμη S3-compatible storage credentials και οι ειδοποιήσεις email απαιτούν Resend. Τα στοιχεία τράπεζας/επικοινωνίας που ήταν placeholders χρειάζονται ενημέρωση από τον ιδιοκτήτη. Τα κόστη και η διαθεσιμότητα εξαρτώνται από τους αντίστοιχους λογαριασμούς.

Τεχνικές πηγές:
- https://docs.netlify.com/build/functions/configuration/
- https://docs.netlify.com/build/functions/environment-variables/
- https://docs.netlify.com/build/configure-builds/manage-dependencies/
