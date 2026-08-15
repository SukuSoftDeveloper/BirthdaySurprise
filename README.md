# ?? Birthday Surprise Website

A beautiful, multi-page animated birthday surprise website for your best friend!

## ?? Features

| Page | Experience |
|------|-----------|
| **Page 1** — Welcome | Animated gift box, floating particles, confetti burst |
| **Page 2** — Memories | Polaroid photo gallery with flip animations & lightbox |
| **Page 3** — Letter | Envelope opening, typewriter text, heartfelt messages |
| **Page 4** — Fun | Pop balloons for hidden messages, scratch-card gift reveal |
| **Page 5** — Finale | Fireworks, birthday song, countdown timer, grand wishes |

## ?? Quick Start

1. **Open the website** — Double-click `index.html` or run a local server:
   ```bash
   npx serve .
   ```
2. **Add your photos** — Place 6 photos in `assets/images/` named `photo1.jpg` through `photo6.jpg`
3. **Add birthday song** — Place an MP3 file at `assets/music/birthday-song.mp3`
4. **Personalize** — Edit `js/config.js` with her name and custom messages

## ?? Adding Photos

Copy your photos into `assets/images/` with these names:
- `photo1.jpg`, `photo2.jpg`, `photo3.jpg`
- `photo4.jpg`, `photo5.jpg`, `photo6.jpg`

Supported formats: JPG, PNG, WebP. Placeholder SVGs show until you add real photos.

## ?? Adding Music

Place any birthday song MP3 at:
```
assets/music/birthday-song.mp3
```

The play button appears on the final page (Page 5). Browsers require a user click before audio plays.

## ?? Personalization

Edit `js/config.js` to customize:
- **friendName** — Her name on the final page
- **Messages** — All greeting text, letter content, balloon secrets
- **Photo captions** — Text under each polaroid
- **Wishes** — Final page birthday wishes

## ?? Tech Stack

- HTML5, CSS3, Bootstrap 5
- JavaScript (ES6+)
- **GSAP** — Smooth animations
- **AOS** — Scroll animations
- **Canvas Confetti** — Confetti effects
- **tsParticles** — Floating particle background
- **Font Awesome** — Icons
- **Google Fonts** — Dancing Script + Poppins

## ?? Project Structure

```
BirthdaySurprise/
??? index.html          ? Page 1: Welcome
??? page2.html          ? Page 2: Photo Memories
??? page3.html          ? Page 3: Birthday Letter
??? page4.html          ? Page 4: Interactive Fun
??? page5.html          ? Page 5: Grand Finale
??? css/
?   ??? style.css       ? All styles
??? js/
?   ??? config.js       ? ? Personalize here!
?   ??? shared.js       ? Shared utilities
?   ??? page1.js - page5.js
??? assets/
?   ??? images/         ? Your photos go here
?   ??? music/          ? Birthday song MP3
??? README.md
```

## ?? Tips for Maximum Impact

1. Replace ALL placeholder photos with real memories together
2. Customize every message in `config.js` with inside jokes and personal memories
3. Choose her favorite song for the finale page
4. Open on a phone or tablet for a full-screen surprise experience
5. Share via a link (GitHub Pages, Netlify) or open locally on her device

Made with ?? for an unforgettable birthday surprise!
