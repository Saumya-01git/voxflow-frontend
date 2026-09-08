# Day 2: UI/UX Design System & Layout Wireframe 🎨

## 1. Visual Design Architecture
- **Theme**: Premium Neo-Glassmorphism with deep space dark mode (`#0a0e17` base).
- **Accent Palette**: Electric Indigo to Radiant Pink (`linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)`).
- **Surface Elevation**: Frosted glass panels with `backdrop-filter: blur(16px)`, translucent borders (`rgba(255, 255, 255, 0.08)`), and ambient soft shadows.
- **Typography**: Google Fonts pairing — *Outfit* for brand headings and *Inter* for legible body and form controls.
- **Sound Wave Visualizer**: Dynamic animated soundwave bars reflecting speech generation and playback.

---

## 2. Wireframe Specification (Aligned with PDF Section 32)
```
┌──────────────────────────────────────────────────────────────────┐
│  🎙️ VoxFlow  [Multilingual AI Text-to-Speech]            [v1.0]  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─ Text Input Section ────────────────────────────────────────┐ │
│  │ Enter or paste your text:         [📁 Upload] [🧹 Clear]     │ │
│  │ ┌─────────────────────────────────────────────────────────┐ │ │
│  │ │ Hello! Welcome to the VoxFlow Text-to-Speech App.       │ │ │
│  │ └─────────────────────────────────────────────────────────┘ │ │
│  │ Characters: 48 / 2000  •  Words: 7                          │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─ Voice & Language Configuration ────────────────────────────┐ │
│  │ [ Language: English (US) ▾ ]    [ Voice: Jenny (Female) ▾ ] │ │
│  │                                                             │ │
│  │ Speed: [ 1.0x ───────🔘──────── ]                           │ │
│  │ Pitch: [ Normal ─────🔘──────── ]                           │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│            [ ⚡ Generate Speech (Instant Audio) ]               │
│                                                                  │
│  ┌─ Generated Audio & Player ──────────────────────────────────┐ │
│  │ ▶  0:00 ━━━━━━━━━━━━━━●━━━━━━━━━━━━ 0:14  🔊 [1.0x]         │ │
│  │ [ ⬇ Download MP3 ]  [ ❤️ Add to Favorites ]                   │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─ Speech History ────────────────────────────────────────────┐ │
│  │ • "Hello! Welcome..." — English (Jenny) [▶ Play] [⬇ MP3]     │ │
│  │ • "नमस्ते भारत..." — Hindi (Swara) [▶ Play] [⬇ MP3]          │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. Micro-Interactions & States
- **Idle State**: Pristine frosted glass card with glowing focus ring on text entry.
- **Typing State**: Live character counter updates dynamically with color transitions (green -> amber -> red when nearing 2000 limit).
- **Generating State**: Button displays rotating spinner and pulsing soundwave bars.
- **Playing State**: Audio scrubber smoothly updates with real-time timestamp display.
- **Error State**: Non-blocking toast/banner alert with descriptive error resolution tips.
