# Beyza & Batuhan Nikah Davetiyesi

Premium cinematic Turkish nikah invitation built with Next.js 16.2.6, TypeScript, Tailwind CSS, Framer Motion, shadcn/ui-style primitives, Lucide Icons, and a Google Apps Script RSVP backend.

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and set:

```bash
GOOGLE_APPS_SCRIPT_WEBHOOK_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
NEXT_PUBLIC_SITE_URL="https://your-domain.vercel.app"
```

The music control uses an embedded YouTube player for `Dolu Kadehi Ters Tut - Dilerim Ki`. It does not download or rehost copyrighted audio.

## Google Sheets RSVP Setup

1. Create a Google Sheet.
2. Go to `Extensions > Apps Script`.
3. Paste the code from `docs/google-apps-script.js`.
4. Run the `setup` function once and authorize it. This creates:
   - `LCV Yanıtları` for every submission.
   - `Özet` for total responses, total guests, after-party yes/no response counts, and after-party guest totals.
5. Click `Deploy > New deployment`.
6. Select `Web app`.
7. Set `Execute as` to `Me`.
8. Set access to `Anyone`.
9. Deploy and authorize.
10. Copy the `/exec` URL into `GOOGLE_APPS_SCRIPT_WEBHOOK_URL`.

The script writes:

`Timestamp | Ad | Soyad | Telefon | Kişi Sayısı | After Party | Not | Kaynak | Kullanıcı Aracı`

## Vercel Deployment

1. Push the project to GitHub.
2. Import it in Vercel.
3. Add the environment variables from `.env.example`.
4. Deploy.

The app uses the local photos in `public/photos`. Replace those files with final optimized couple photos while keeping the same filenames, or update `lib/event.ts`.
