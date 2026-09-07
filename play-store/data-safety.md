# Data Safety Form — Memory Match! Cartoon Fun (with AdMob)

Answers for the Play Console **Data safety** section (App content → Data safety). Because the app **displays ads from AdMob**, you must now disclose ad-related data. This is mandatory — Play rejects apps that claim "no data" while serving ads.

---

## Section 1: Data collection and sharing

### 1. Does your app collect or share any of the required user data types?

**Yes** — but only the data that Google Mobile Ads (AdMob) handles for ad delivery.

| Category | Collected? | Shared? | Notes |
|---|---|---|---|
| Device or other IDs | **Yes** | **Yes** | Advertising ID (GAID) handled by the AdMob SDK for ad delivery |
| App activity — ad impressions | **Yes** | **Yes** | Ad views/impressions for billing and reporting |
| All other categories (location, personal info, financial, health, messages, photos, audio, files, contacts, calendar, web browsing) | **No** | **No** | — |

### 2. Data sharing (Policies)

- **Is data shared for advertising/personalization?** No — the app requests **non-personalized, child-directed ads** (`TAG_FOR_CHILD_DIRECTED_TREATMENT_TRUE` + max content rating T set globally).
- **Is the data encrypted in transit?** **Yes** — AdMob traffic is HTTPS.
- **Can users request data deletion?** **Yes** — in-app **Parents → Reset Data**, or uninstall/clear app data.

---

## Section 3: Ads declaration (required)

Play Console will ask separately (in App content → Ads):

- **Does your app contain ads?** **Yes**
- Platforms: ads are shown on **Google Play only** (Android native AdMob banner + interstitial).
- Ad types: banner (top of screen) and interstitial ad after a completed game. No rewarded video.
- The ad SDK is **Google Mobile Ads (AdMob)**.

---

## Section 4: Play Families impact (you are targeting kids)

- **Non-personalized ads** must be used for children (this app does).
- AdMob must be linked to the Play listing via **AdMob → Apps → Link to Play Console**, and the AdMob account must run ads under **"Apps with children"** / the Families policy review.
- No interest-based/behavioral ad targeting (already disabled in code via RequestConfiguration).
- The content rating **Everyone / PEGI 3** is unchanged by ads (ads are a data/monetization concern, not a rating category).