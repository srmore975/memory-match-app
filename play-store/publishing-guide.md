# Publishing Guide — Memory Match! Cartoon Fun (with AdMob)

This is an HTML5/PWA game wrapped in a WebView Android app (package `com.legacy.memorymatchgame`). It monetizes with **AdMob** ads. Below is the full end-to-end path to production.

> **Prereq:** an AdMob account and a Play Console developer account, both using the same Google account (srmore975@gmail.com). A .aab build (`MemoryMatchApp\dist\MemoryMatch-Game-v1.0-ads.aab`) is already produced for you.

---

## Part 0 — One-time AdMob setup (do this FIRST)

1. Go to **admob.google.com** and sign in with **srmore975@gmail.com**.
2. **Apps → Add app → Android →** enter package **`com.legacy.memorymatchgame`** → link it to the Play listing when prompted.
3. **App settings →** complete the **"Apps with children"** questionnaire → this makes Google only allow **family-safe ad networks**.
4. Create **two ad units**:
   - **Banner** (320×50 adaptive) — name "Game Banner"
   - **Interstitial** — name "Game Interstitial"
5. Copy the two **real ad unit IDs** (`ca-app-pub-.../...`) into `MemoryMatchApp\app\src\main\java\com\legacy\memorymatchgame\AdsManager.java` (`BANNER_ID`, `INTERSTITIAL_ID`).
6. Copy your real **App ID** (`ca-app-pub-...~...`) into `MemoryMatchApp\app\src\main\AndroidManifest.xml` (`com.google.android.gms.ads.APPLICATION_ID`).
7. Rebuild:
   ```powershell
   .\gradlew.bat assembleRelease bundleRelease
   ```
   Outputs land in `app\build\outputs\...`. 

> Tip: keep the current **test** ad unit IDs while testing — real IDs serve no ads on unapproved apps anyway.

---

## Part 1 — Developer account

1. Go to **play.google.com/console** and sign in with srmore975@gmail.com.
2. Pay the **one-time $25 USD** registration fee and complete identity/tax verification.
3. Developer name: **Legacy Co.**

## Part 2 — Create the app

1. **Create app →** Name **Memory Match! Cartoon Fun**, English (US), **Game**, **Free**, all countries. → **Create**.

## Part 3 — Store presence

1. **Main store listing →** paste text from `store-listing.md` (English US).
2. Graphics: high-res icon (`app-icons/icon-512.png`), feature graphic (`play-store/feature-graphic-1024x500.png`), and **2–4 phone screenshots** (capture from the running game — still your job).
3. Contact: website + support email + **privacy policy URL** (host `play-store/privacy-policy.html` publicly).

## Part 4 — App content

1. **Privacy policy:** paste the public URL.
2. **Ads:** tick "This app contains ads".
3. **Content rating:** answer IARC per `content-rating.md`.
4. **Target audience:** mark as aimed at children/families.
5. **Data safety:** fill per `data-safety.md` — now discloses the **AdMob SDK**, advertising identifier, and ad impressions.
6. **Permissions:** none declared (only INTERNET is implicit for ads; AdMob doesn't add runtime permissions).

## Part 5 — Production release

1. **Release overview → Production → Create release.**
2. Upload **`MemoryMatchApp\dist\MemoryMatch-Game-v1.0-ads.aab`**.
3. "What's new": text from `whats-new.md`.
4. Enable **Google Play App Signing**; keep `release-keystore.jks` + `keystore.properties` safe (password `MemoryMatch2026`).
5. **Review** every section, resolve warnings, then **Roll out (100%)**.

## Part 6 — AdMob final steps (before revenue)

1. AdMob **enter phone verification** + **complete payments profile** (tax/bank).
2. AdMob → Signing your ad requests (Optional, recommended for validity signals) if you enable user metrics on Android.
3. Within a few days Google will send an **"Apps with children" review** confirmation; make sure non-personalized ads remain forced (already done in code).

---

## First-release cheat list

- ☐ Real AdMob App ID in manifest + real unit IDs in AdsManager.java, rebuilt
- ☐ `.aab` uploaded (Ads build), signed
- ☐ Developer account + $25 fee
- ☐ Privacy policy hosted at a public URL
- ☐ Feature graphic + high-res icon + screenshots
- ☐ Store text pasted
- ☐ Ads = Yes, content rating, target audience, data safety (ads disclosure) filled
- ☐ Play Families "Apps with children" setup done in AdMob
- ☐ AdMob payments profile completed