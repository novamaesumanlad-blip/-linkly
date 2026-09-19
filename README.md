# Linkly

A React prototype — social feed, anonymous inbox, stranger chat, reels, live
streaming, group chats, and a coin/ads system. Built with Vite + React,
inline styles (no CSS framework), and [lucide-react](https://lucide.dev)
for icons.

## What this is (and isn't)

This is a **front-end prototype**. Everything runs on in-memory React
state — there is no real backend, no database, no auth, and no real ad
network. Refreshing the page resets everything. If you want it to persist
data for real, you'll need to add a backend (Supabase is a common,
low-effort choice for a project like this) — see "Next steps" below.

## Run it locally

You'll need [Node.js](https://nodejs.org) 18 or later installed.

```bash
npm install
npm run dev
```

This starts a local dev server (usually at `http://localhost:5173`) with
hot reload.

## Put it online

Any of these work — pick whichever you're most comfortable with. All of
them build the project on their own servers, so you don't need anything
installed beyond a browser and a GitHub account (for the first two).

### Option A — Vercel (easiest)
1. Push this folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com), "Add New Project," import that repo.
3. Vercel auto-detects Vite. Leave the defaults and click Deploy.
4. You'll get a live `https://your-project.vercel.app` URL.

### Option B — Netlify
1. Push this folder to a GitHub repository.
2. Go to [netlify.com](https://netlify.com), "Add new site" → "Import an existing project."
3. Build command: `npm run build` — Publish directory: `dist`.
4. Deploy — you'll get a live `https://your-project.netlify.app` URL.

### Option C — Manual upload (no GitHub needed)
1. Run `npm install` then `npm run build` on your own machine.
2. This creates a `dist/` folder — that's the whole site, static files only.
3. Drag that `dist/` folder onto [app.netlify.com/drop](https://app.netlify.com/drop),
   or upload it to any static host (GitHub Pages, Cloudflare Pages, S3, etc).

## Project structure

```
index.html        entry HTML — loads src/main.jsx
src/main.jsx       mounts the app into #root
src/App.jsx         the entire app (all components, single file)
public/favicon.ico  browser tab icon
```

## Setting up ads

This app has two different ad surfaces, and they need two different real
ad networks — don't mix them up:

- **The "Sponsored" posts in the Home feed and the ad slot in the right
  sidebar** are display/banner ads → these use **Google AdSense**, which
  is for *websites*.
- **The "Watch an ad, earn coins" flow on the Earn page** is a rewarded
  video ad → that format essentially only exists on **Google AdMob**,
  which is for *native mobile apps* (Android/iOS), not websites. There's
  no good web equivalent with the same fill rates and payouts.

That's why the setup below is split into "now" (website) and "later"
(once there's a mobile app).

### Part 1 — AdSense, for the website (do this now)

1. Deploy the site for real first (see "Put it online" above) — AdSense
   won't review a site that isn't live on a real domain.
2. Go to [adsense.google.com](https://adsense.google.com) and sign up
   with the same Google account you want payouts to go to.
3. Add your site's domain and wait for review. **Be realistic about
   this step**: AdSense wants to see genuine content and some real
   traffic — a brand-new prototype with seed/demo data will likely get
   rejected on the first pass. It typically goes faster once there are
   real users and real posts.
4. Once approved, AdSense gives you two things you need:
   - A **Publisher ID** (`pub-XXXXXXXXXXXXXXXX`)
   - An **ads.txt** entry to verify you own the site
5. In this project, replace the placeholders in exactly two files:
   - `index.html` — the `ca-pub-YOUR_PUBLISHER_ID` in the `<script>` tag
   - `public/ads.txt` — replace the whole line with what AdSense shows you
6. Create an **ad unit** in the AdSense dashboard (Display ads → Responsive
   is the easiest starting point) and copy its **slot ID**.
7. In `src/App.jsx`, find the `AdSlot` component and pass your slot ID
   where it's used: `<AdSlot dark={dark} slot="1234567890" />`.
8. Redeploy. Ads can take a few hours to actually start showing after
   everything's wired up correctly — that delay is normal.

### Part 2 — AdMob, for the mobile app (once it exists)

The rewarded-ad-for-coins flow (`WatchAdModal` in `src/App.jsx`) is
currently a **simulated timer** — no real ad network is called. To make
it real:

1. Wrap this React app into an actual mobile app. The most direct path
   from an existing React web app is [Capacitor](https://capacitorjs.com)
   (`npm install @capacitor/core @capacitor/cli`, then `npx cap init`,
   `npx cap add android` / `npx cap add ios`) — it packages this same
   codebase into a real Android/iOS app shell.
2. Create an [AdMob](https://admob.google.com) account and register the
   app (you'll get an **App ID** for Android and one for iOS).
3. Create a **Rewarded ad unit** — this is what pays users for watching.
4. Install a Capacitor AdMob plugin, e.g.
   `@capacitor-community/admob`, and follow its setup for adding your
   App ID into `AndroidManifest.xml` / `Info.plist`.
5. In `WatchAdModal`, replace the `setTimeout` countdown logic with a
   real call to the plugin's rewarded-ad method, and only call
   `onReward(...)` inside the plugin's "user earned reward" callback —
   not on a timer. This matters: if you grant coins before the network
   confirms the view, you can end up paying out coins for ads that never
   actually played (or that you were never paid for).

### Getting paid

Both networks pay *you*, the publisher — never the other way around.
Roughly: link a bank account in the network's dashboard, submit tax
forms (a W-9 if you're US-based, a W-8 form otherwise), and once you
cross their minimum payout threshold (commonly **$100**), you get paid
on their schedule (AdSense: monthly, ~NET-30). I'm not a tax or
financial advisor — for anything specific to your country or situation,
that's worth checking with an accountant or the network's own docs
directly.

## Next steps if you want this to be a real product

- **Backend**: add Supabase (or similar) for auth, a real database, and
  file storage — this is the biggest gap between "prototype" and "product."
- **Video/live streaming**: camera access already works (via the browser's
  real `getUserMedia` API), but there's no real second participant or
  streaming server — that needs a service like Agora, Daily, or LiveKit.
- **Group/stranger chat matching**: currently simulated locally. Real
  matching and real-time sync between users needs a backend with
  WebSockets or a realtime database (Supabase Realtime works well here).

If you want help wiring any of this up, **Claude Code** is a better fit
than this chat interface — it has real file persistence and network
access to actually install and configure a backend.
