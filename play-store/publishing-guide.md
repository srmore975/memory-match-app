# Publishing Guide — Memory Match! Cartoon Fun

This app is an HTML5/PWA game. To list it on the Google Play Store you must wrap it in a real Android app. Below are the two supported routes, then the full Play Console checklist.

> **Prereq for both routes:** the app files (`memory-game.html`, `manifest.json`, `app-icons/`) must be hosted over **HTTPS**. Free options: GitHub Pages, Netlify Drop, Cloudflare Pages, or your own host. The privacy policy (`privacy-policy.html`) can be hosted on the same site.

---

## Option A — Recommended: Trusted Web Activity via Bubblewrap (official Google tool)

Keeps your PWA behavior (manifest, icons, standalone).

1. Install Node.js and JDK 17+. Then:
   ```bash
   npx @bubblewrap/cli init
   ```
2. Answer the wizard:
   - **Web app manifest:** `https://your-hosted-url/manifest.json` (or local path)
   - **Application name:** Memory Match! Cartoon Fun
   - **Package name:** e.g. `com.yourstudio.memorymatch`
   - **Signing key:** generate a new one; keep the keystore file + passwords safe — you need them for every future release.
3. Build:
   ```bash
   npx @bubblewrap/cli build
   ```
4. Output: a signed `.apk`/`.aab` in `app-release-signed` / `bundle`. Upload the **`.aab`** to Play Console.

**Note:** Bubblewrap requires a hosted HTTPS manifest URL at build time. If you can't host yet, use Option B.

---

## Option B — Simple WebView wrapper (no hosting needed)

1. Open Android Studio → New Project → **Empty Views Activity** (Java) or **Empty Activity** (Kotlin).
2. Set:
   - `minSdk 21`, `targetSdk` = latest stable.
   - App name (`strings.xml`): **Memory Match! Cartoon Fun**
   - App icon: use `app-icons/icon-512.png` (add as mipmap/webp).
3. Replace the layout with a single `WebView` filling the screen:
   ```kotlin
   val web = WebView(this)
   web.settings.javaScriptEnabled = true
   web.settings.domStorageEnabled = true       // needed for localStorage (coins, stickers, score)
   web.settings.mediaPlaybackRequiresUserGesture = false
   web.loadUrl("file:///android_asset/memory-game.html")
   setContentView(web)
   ```
   Copy `memory-game.html`, `manifest.json`, and `app-icons/` into `src/main/assets/`.
4. In the manifest add:
   ```xml
   <uses-permission android:name="android.permission.INTERNET"/>
   ```
   (Omit it if you strip the Google-Fonts import and run fully offline.)
5. Enable `Back` to exit cleanly (optional `.goBack()` handling). Build → **Generate Signed Bundle (.aab)** → upload to Play Console.

> Package name suggestion: make it unique, e.g. `com.yourstudio.memorymatch`. Names cannot be changed after publishing.

---

## Google Play Console checklist (final publishing steps)

### 1. Create the developer account
- Sign in at play.google.com/console and pay the **one-time $25 USD** registration fee.
- Complete identity verification and tax details.

### 2. Create the app
- Console → **Create app** → Name: **Memory Match! Cartoon Fun**, Language: English (US), App or Game: **Game**, Free, all default countries. → Create.

### 3. Complete the launch checklist (left sidebar, top to bottom)

**Store presence**
- Main store listing → paste texts from `store-listing.md`. Upload **English (US)** strings.
- Graphic assets: high-res icon (512 PNG), **feature graphic 1024×500** (create it), **2–4 phone screenshots** (create from the game).
- Contact: website, support email, and the **hosted privacy-policy URL**.

**App content**
- **Privacy policy:** paste the public URL of `privacy-policy.html`.
- **Ads / purchases:** No ads, No purchases (`permissions-and-monetization.md`).
- **Content rating:** answer IARC per `content-rating.md` → expect "Everyone / PEGI 3".
- **Target audience:** Kids/Families.
- **Data safety:** per `data-safety.md` — No data collected/shared.
- **Permissions:** none declared (+ optionally INTERNET only).

**Production**
- **Release overview → Production → Create release.**
  - Upload your **`.aab`** (from Option A or B).
  - "What's new" text from `whats-new.md`.
  - Signing: enable **Google Play App Signing** (recommended) and store your upload key safely.

### 4. Review & publish
- Run **Review** on each section; fix any warnings (usually: missing features graphic, missing screenshots, or privacy-policy URL required).
- Roll out 100%. Within a few hours the app goes live (or is rejected for review — in which case address the listed reason and resubmit).

---

## First-release cheat list (must not be missing)

- ☐ Hosted `memory-game.html` over HTTPS
- ☐ Hosted `privacy-policy.html` at a public URL
- ☐ Developer account + $25 fee
- ☐ `.aab` built (Option A or B), signed
- ☐ Feature graphic 1024×500
- ☐ 2–4 phone screenshots
- ☐ Store text pasted
- ☐ IARC content rating answered
- ☐ Data safety answered ("no data")
- ☐ "What's new" for first release added