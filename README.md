# MeetTheSickos.com

Official site for **Meet The Sickos** — a film by Raheem Roher.  
Produced by No Egos World Media & XLNZ Productions LLC.

---

## Pages

| File | Page |
|------|------|
| `index.html` | Landing page — logo, quote of the day, countdowns, buy |
| `watch.html` | Watch / purchase page |
| `photos.html` | Premiere night photo gallery with download |
| `game.html` | "Don't Get Caught" browser game |
| `merch.html` | Merchandise — links to Fourthwall |

---

## Setup Checklist

### 1. GitHub Pages
- Push this repo to GitHub
- Go to Settings → Pages → Deploy from `main` branch root
- Point MeetTheSickos.com GoDaddy DNS to GitHub Pages:
  - A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  - CNAME: `www` → `YOUR-USERNAME.github.io`
- Add `CNAME` file in repo root containing: `MeetTheSickos.com`

### 2. Logo / Images
- Copy `MTS_Cue_Card.png` to `/images/mts-logo.png`
- Add film poster to `/images/poster.jpg`
- Add production stills to `/images/still-1.jpg`, `/images/still-2.jpg`
- Add premiere photos to `/images/premiere/` folder

### 3. Stripe (Watch Page)
- Create a Payment Link at [dashboard.stripe.com](https://dashboard.stripe.com)
- Set price to $7
- Set success redirect URL to: `https://MeetTheSickos.com/watch-success.html`
- Replace `https://buy.stripe.com/YOUR_PAYMENT_LINK` in `watch.html`

### 4. Vimeo (Film Hosting)
- Upload film to Vimeo (Pro plan)
- Set privacy to "Password only" or "Private with review link"
- On `watch-success.html` (create this page), embed the Vimeo player
- Only accessible after Stripe payment redirect

### 5. Screening Dates
- Open `js/main.js`
- Update `AUG_SCREENING` and `HALLOWEEN_SCREENING` dates when confirmed

### 6. Fourthwall (Merch)
- Set up your shop at [fourthwall.com](https://fourthwall.com)
- Replace `https://YOUR-SHOP.fourthwall.com` in `merch.html`

### 7. Premiere Photos
- Add photo files to `/images/premiere/`
- Open `photos.html` and duplicate the `.gallery-item` template block for each photo
- Update `src` and `alt` attributes

---

## Quotes

Add or edit quotes in `js/main.js` under the `QUOTES` array.  
**Rule: no spoilers. Nothing that gives away plot or character fate.**

---

## File Structure

```
MeetTheSickos/
├── index.html
├── watch.html
├── photos.html
├── game.html
├── merch.html
├── CNAME                  ← create this: contains MeetTheSickos.com
├── README.md
├── css/
│   ├── style.css          ← shared base styles + tokens
│   ├── watch.css
│   ├── photos.css
│   ├── game.css
│   └── merch.css
├── js/
│   ├── main.js            ← quotes, countdowns, mobile nav
│   ├── photos.js          ← gallery, download, lightbox
│   └── game.js            ← game logic
└── images/
    ├── mts-logo.png       ← the cue card logo
    ├── poster.jpg
    ├── still-1.jpg
    ├── still-2.jpg
    └── premiere/
        └── *.jpg          ← premiere night photos
```

---

© 2026 XLNZ Productions LLC
