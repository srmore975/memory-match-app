# Permissions & Monetization — Memory Match! Cartoon Fun

Answers for the Play Console **App content → Permissions** sections and pricing decisions.

---

## 1. Permissions declared

The app requests **zero sensitive permissions**.

If you wrap the web game with a WebView / Trusted Web Activity (see `publishing-guide.md`), your Android wrapper may add:

- `android.permission.INTERNET` — needed so the app can load its own HTML/CSS and the Google Fonts style sheets over HTTPS.

Declare only what the wrapper actually uses. **Do not** add camera, microphone, contacts, location, storage, or notification permissions. If the wrapper requires a fallback to load local files in a WebView without internet permission (fully offline copy of the game), you may omit INTERNET entirely — the game runs fully offline except for the optional Google Fonts fetch.

### Exact Play Console answer

- All permission toggles: **No permissions declared** (if you strip INTERNET from the wrapper) — or
- `android.permission.INTERNET` only (normal-level, shown to users as "Network access — full internet access").

---

## 2. Monetization

- **Payment model.** Announced: **Free**.
- **Does the app contain ads?** **Yes** — AdMob banner (top) + interstitial after each completed game.
- **Are there in-app purchases / subscriptions?** **No** — the app has no billing integration; stickers and coins are earned by playing.
- **Ad SDK used:** `com.google.android.gms:play-services-ads` (Google Mobile Ads / AdMob).
- **Ad targeting:** non-personalized, child-directed (`RequestConfiguration.TAG_FOR_CHILD_DIRECTED_TREATMENT_TRUE`, max content rating **T**).

### Play Console questions

| Question | Answer |
|---|---|
| Is your app monetized? | **Yes — ads (free)** |
| Does the app use ads? | **Yes — AdMob banner + interstitial** |
| Do you need to enable "Ads" content checkbox? | **Yes — tick it** |

> You must link your AdMob account to this Play app (**AdMob → Apps → Link to Play Console**) and complete the **"Apps with children"** setup in AdMob so only family-safe ad networks can fill.

---

## 3. Target audience & Play Families

- **Target audience:** Kids (toddlers/elementary school) — select **10-16 & under** / **"Designed for families"** option as presented.
- Choosing the families target applies **Play Families Policy** automatically. The app is compliant (no ads SDK, no data collection, no social features).
- **Recommended countries:** sell in all countries; the app is fully offline and language-independent (emoji-based).

### Marketing/ads declaration

Because you're targeting families and the app has no ads, no extra ads disclosure is needed. Do **not** tick "contains untargeted ads."

---

## 4. App signing & release notes

See `publishing-guide.md` for the full release checklist including app signing (App Signing by Google Play) and the first "*What's new*" text (`whats-new.md`).