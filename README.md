# ✨ Happy Diwali - Interactive 3D Greeting Card Web App 🪔

A premium, magical, and festive interactive Diwali greeting card web application built with **React**, **HTML5 Canvas**, **Web Audio API**, and **Tailwind CSS**.

Designed to feel like opening an ornate Diwali gift box filled with glowing diyas, sparkling fireworks, celestial Indian music, and heartfelt blessings.

---

## 🌟 Key Features

### 1. Opening Screen
- **Celestial Festive Ambiance**: Midnight purple to royal violet radial gradients, twinkling stars, and floating sky lanterns (*Kandils*).
- **Auspicious Callout**: *"A Little Spark of Happiness for You ✨"*
- **Grand Golden Diya**: Realistic multi-layer flame flickering animation with inner blue core and golden aura.
- **Pulsating CTA**: *"Open Your Diwali Surprise 🪔"* triggers a smooth 3D transition with sound effects, rocket fireworks, and golden petal confetti.

### 2. Interactive 3D Greeting Card
- **3D Unfolding Animation**: Opens with realistic perspective depth and gold foil borders.
- **The Core Greeting**:
  > *"✨ HAPPY DIWALI! ✨*
  > *May your life shine brighter than a thousand diyas, your heart be filled with happiness, and your home overflow with love, laughter and prosperity.*
  > *Wishing you and your family a beautiful, joyful and blessed Diwali!*
  > *🪔 With lots of love ❤️"*
- **Typography & Effects**: Shimmering gold leaf gradients, ornate filigree corner accents, and rotating sacred Rangoli mandalas.
- **Card Controls**: Easily fold back the card or open it again anytime.

### 3. Fun Interactive Features
- **7 Sacred Diyas of Prosperity**:
  - Arogya (Health & Vitality)
  - Lakshmi (Wealth & Abundance)
  - Saraswati (Wisdom & Knowledge)
  - Shanti (Peace & Serenity)
  - Ananda (Joy & Laughter)
  - Vijaya (Victory & Success)
  - Prema (Love & Family)
  - Touch any unlit diya to strike a flame with authentic chime!
  - When all 7 diyas are lit, an automatic **Grand Celebration** is triggered with golden confetti and fireworks.
- **"One More Surprise 🎁"**:
  - Reveals a random sweet Diwali blessing and fortune card from a curated collection of authentic wishes.
  - Option to draw more wishes, copy to clipboard, or share straight to WhatsApp.
- **"Burst Fireworks 🎆"**:
  - Launches multi-rocket fireworks spectacles across the night sky.
  - You can also click anywhere on the sky to launch fireworks at that exact coordinate!
- **Interactive Sparkler Mode (*Phuljhadi*) 🎇**:
  - Turn your mouse cursor or touch into a burning sparkler emitting golden sparks with real crackle sound effects!

### 4. Personalisation
- Enter your name as the **Sender** (`A special Diwali wish from [Name]`).
- Enter the **Recipient's Name** (`Dear [Recipient],`).
- Customize the festive message or pick from sweet presets.
- Live updates reflected directly onto the 3D card.

### 5. Sharing Functionality
- **"Share the Happiness ❤️"**:
  - **Native Web Share API**: Shares directly to apps on iOS and Android.
  - **WhatsApp Share**: Pre-formats joyful festive emojis, names, and link.
  - **Copy Link**: Copies the personalized shareable link with confirmation toast.
  - **URL Parameter Support**: Links preserve `?from=...&to=...&msg=...` so the recipient immediately sees who sent the gift.

### 6. Audio Engine (Web Audio API)
- Zero external MP3 dependencies! All sounds are generated via pure browser Web Audio synthesis:
  - **Ambient Sitar & Tanpura Drone**: Plays a soothing pentatonic festive melody (*Raag Bhupali*).
  - **Temple Bell (*Aarti Ghanti*)**: Pure metallic resonance.
  - **Fireworks Boom & Crackle**: Realistic sub-bass and filtered noise burst.
  - **Diya Ignition Chime**: Celestial harmonic sweep.
- Background music is **OFF by default** and only plays when user clicks the floating music button `🎵`.

---

## 🚀 How to Run Locally

You can launch the app locally using Python:

```bash
python start-server.py
```

Or run directly with Python's built-in HTTP server:
```bash
python -m http.server 3000
```
Then open: [http://localhost:3000](http://localhost:3000)

Alternatively, you can open `index.html` directly in any modern web browser!

---

---

## 🌐 Deploy to GitHub Pages (Step-by-Step)

The project includes `.github/workflows/deploy.yml` and `vite.config.js` with `base: './'` pre-configured for GitHub Pages.

### Method A: Push using Git (Recommended)

1. **Initialize Git & Commit**:
   ```bash
   cd diwali-greeting-card
   git init
   git add .
   git commit -m "Happy Diwali Interactive 3D Greeting Card"
   git branch -M main
   ```

2. **Create a GitHub Repository**:
   - Go to [github.com/new](https://github.com/new).
   - Name your repository (e.g. `diwali-card` or `happy-diwali`).
   - Leave it **Public** and do not add README or .gitignore (already created).

3. **Link & Push**:
   ```bash
   git remote add origin https://github.com/<YOUR-USERNAME>/<REPO-NAME>.git
   git push -u origin main
   ```

4. **Enable GitHub Pages via Actions**:
   - Go to your repository on GitHub.
   - Click **Settings** ⚙️ > **Pages** (under Code and automation).
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
   - Your site will automatically build and publish in ~30 seconds!
   - Your live link will be:
     `https://<YOUR-USERNAME>.github.io/<REPO-NAME>/`

---

### Method B: Upload via GitHub Web UI (No Git Required)

1. Create a new repository at [github.com/new](https://github.com/new).
2. Click **uploading an existing file**.
3. Drag all files from this folder (`index.html`, `app.js`, `styles.css`, `vite.config.js`, `package.json`, `.github/`, etc.) and commit.
4. Go to **Settings** > **Pages** > Select **GitHub Actions** as the source.

---

### 💌 Sharing Your Personalized Card on GitHub Pages

Once published, you can share the personalized greeting card with anyone:

```
https://<YOUR-USERNAME>.github.io/<REPO-NAME>/?view=card&from=Aarav&to=Priya%20%26%20Family
```

Recipients can also edit the sender & recipient names on the live site to pay it forward and send cards to their own friends!

---

## 🎨 Theme Palette
- **Midnight Purple**: `#090216`
- **Royal Purple**: `#2c0b56`
- **Warm Amber Gold**: `#f59e0b`
- **Bright Gold**: `#fbbf24`
- **Flame Orange**: `#ea580c`
- **Rose Pink Highlight**: `#f43f5e`
