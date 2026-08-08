# SpendSelf — cinematic pre-launch website

A single-page Next.js/Tailwind concept site designed to create curiosity before the actual travel experience launches.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Production notes

- The waitlist is frontend-only and needs a real backend/email provider.
- Replace temporary Unsplash and YouTube media with owned/licensed SpendSelf assets before launch.
- Add privacy policy, terms, cookie/analytics consent if required, and real social links.
- The first experience is intentionally described as “somewhere in the Himalayas” rather than positioning SpendSelf as Nepal-only.


## Cinematic Nepal journey

The concept site now uses the three provided 16:9 Nepal videos locally:

- `public/videos/01-manang-horses.mp4`
- `public/videos/02-wood-chopping.mp4`
- `public/videos/03-himalayan-valley.mp4`

They are presented as a sticky cinematic sequence with crossfade/overlay treatment. The first two clips advance automatically when each video ends; the final landscape holds as the visitor continues scrolling.
