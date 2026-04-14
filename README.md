# Quran Ayah Finder — Landing Page

A fully responsive, production-ready landing page for the **Quran Ayah Finder** app. Built from the Figma TypeScript design export.

---

## Directory Structure

```
website/
├── index.html                  ← Main page
├── robots.txt                  ← SEO: search engine crawl rules
├── sitemap.xml                 ← SEO: page index for Google
├── README.md                   ← This file
├── data/
│   └── content.json            ← ⭐ Edit your content here
├── assets/
│   ├── css/
│   │   └── style.css           ← All styles (design system)
│   ├── js/
│   │   └── main.js             ← All interactivity
│   └── images/
│       └── screenshots/
│           ├── screen-01.png   ← Hero section phone screen
│           ├── screen-03.png   ← Quran reading section
│           ├── screen-04.png   ← Mushaf mode section
│           ├── screen-05.png   ← Settings section
│           ├── screen-06.png   ← Duas section
│           ├── screen-07.png   ← Streak section
│           ├── screen-08.png   ← Bookmarks section
│           ├── screen-09.png   ← Activity section
│           └── screen-XX.png   ← Other available screenshots
```

---

## How to Edit Content

### All user-facing text, links, and data lives in **`data/content.json`**.

Open `data/content.json` and edit:

| Section | JSON Key | What to change |
|---------|----------|----------------|
| App name & tagline | `app.name`, `app.tagline` | App title and slogan |
| Download links | `app.playStoreUrl`, `app.appStoreUrl` | Update with real store URLs |
| Contact email | `app.email` | Support email address |
| App stats | `stats[]` | Numbers shown in grid (Surahs, Verses, etc.) |
| Feature cards | `features[]` | Icon, title, description for each feature card |
| Top searches | `topSearches[]` | Search query examples with dates |
| Testimonials | `testimonials[]` | User reviews |
| Donation goal | `donation.monthlyGoal`, `donation.raised` | Current fundraising progress |
| Donation URL | `donation.donateUrl` | Link to payment page |
| Footer links | `footer.appLinks`, `footer.resourceLinks` | Navigation links |
| Social media | `footer.social[].url` | Social media profile URLs |
| SEO | `seo.title`, `seo.description`, `seo.siteUrl` | Search engine metadata |

> **Note:** After editing `content.json`, the JavaScript (`main.js`) reads it and updates the page. If opening `index.html` directly as a `file://` URL, some browsers may block the JSON fetch — in that case, serve it with a local web server (see below).

---

## How to Change Colors

All colors are CSS custom properties defined at the top of **`assets/css/style.css`**:

```css
/* Light Mode */
:root {
  --primary: #0D5C46;    /* Deep Emerald Green — buttons, headers */
  --gold: #D4AF37;        /* Soft Gold — accents, CTAs */
  --bg: #FDF8F0;          /* Cream — main background */
  --card-bg: #FFFFFF;     /* White — cards */
  --text-dark: #1A2F3E;   /* Dark Navy — headings */
  --text-light: #6B7A8A;  /* Gray-Blue — body text */
  --border: #E5E7EB;      /* Light gray — borders */
  --footer-bg: #1A2F3E;   /* Dark Navy — footer */
}

/* Dark Mode */
[data-theme="dark"] {
  --primary: #1A6B55;     /* Lighter Emerald Green */
  --gold: #E8C547;        /* Brighter Gold */
  --bg: #0F1A1A;          /* Deep Dark Teal */
  --card-bg: #1A2828;     /* Dark Card */
  --text-dark: #E5E5E5;   /* Light Gray */
  --text-light: #A0AABA;  /* Muted Gray-Blue */
  --border: #2A3A3A;      /* Dark border */
  --footer-bg: #0A0F0F;   /* Near Black */
}
```

---

## How to Replace Screenshots

Phone mockup screenshots are in `assets/images/screenshots/`. Each section uses:

| File | Section |
|------|---------|
| `screen-01.png` | Hero section (Explore / AI search screen) |
| `screen-03.png` | Quran reading feature section |
| `screen-04.png` | Mushaf mode section |
| `screen-05.png` | Settings section |
| `screen-06.png` | Duas categories section |
| `screen-07.png` | Streak tracking section |
| `screen-08.png` | Bookmarks section |
| `screen-09.png` | Recent activity section |

To replace: simply overwrite the file with the same filename keeping `.png` format.

To use different screenshot files, edit the `src` attributes in `index.html` — search for `screen-XX.png`.

---

## How to Deploy

### Option 1: Static Hosting (Recommended)
Upload the entire `website/` folder to any static hosting service:
- **Netlify**: Drag-and-drop the folder at [app.netlify.com](https://app.netlify.com/drop)
- **Vercel**: `vercel deploy` from the `website/` directory
- **GitHub Pages**: Push to a `gh-pages` branch
- **Any web server**: Upload files via FTP/SFTP

### Option 2: Local Development
Run a simple local server to preview the site:

```bash
# Python 3
cd website && python3 -m http.server 8080

# Node.js (npx)
cd website && npx serve .

# PHP
cd website && php -S localhost:8080
```

Then open `http://localhost:8080` in your browser.

### Option 3: Direct File Opening
Open `index.html` directly in a browser. Most features work, but the `content.json` fetch may fail in some browsers due to CORS restrictions on `file://` URLs. The page will still display with hardcoded fallback content in `main.js`.

---

## SEO Setup

1. Edit `seo.siteUrl` in `content.json` to your real domain
2. Update `sitemap.xml` — replace `https://quranayahfinder.com/` with your actual URL
3. Update `robots.txt` Sitemap URL
4. Add an `og:image` meta tag in `index.html` with a 1200×630px screenshot URL
5. Submit your sitemap to [Google Search Console](https://search.google.com/search-console)

---

## Features

- ✅ Light / Dark mode toggle (persisted in localStorage)
- ✅ Mobile responsive (375px → 1440px+)
- ✅ Hamburger mobile menu
- ✅ Scroll-triggered fade-in animations
- ✅ Floating phone mockup animation
- ✅ Count-up number animation
- ✅ Donation amount selector
- ✅ Progress bar animation
- ✅ Smooth scroll navigation
- ✅ Sticky navbar with scroll shadow
- ✅ Real app screenshots in phone mockups
- ✅ Islamic decorative elements (mosque silhouette, geometric patterns, ornamental dividers)
- ✅ Arabic calligraphy (Bismillah, decorative watermarks)
- ✅ SEO meta tags (Open Graph, Twitter Card)
- ✅ Google Fonts: Poppins, Inter, Amiri
- ✅ No JavaScript frameworks — pure vanilla JS
- ✅ No external dependencies (except Google Fonts CDN)
