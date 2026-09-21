# VoxFlow — AI Speech Studio 🎙️✨

[![Live App](https://img.shields.io/badge/Live%20Demo-Vercel-success?style=for-the-badge&logo=vercel)](https://voxflow-frontend-eight.vercel.app/)
[![Backend API](https://img.shields.io/badge/API%20Server-Render-informational?style=for-the-badge&logo=render)](https://voxflow-backend.onrender.com)
[![Database](https://img.shields.io/badge/Database-Neon%20PostgreSQL-blueviolet?style=for-the-badge&logo=postgresql)](https://neon.tech)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **VoxFlow** is a modern, high-performance web platform that converts written text into lifelike, emotive speech across 17+ neural voices in global and Indic languages. Built with a dual-mode design system featuring a morning fairytale light theme and a cybernetic oceanic dark mode.

---

## 🔗 Quick Links

- 🌐 **Live Web Application**: [https://voxflow-frontend-eight.vercel.app/](https://voxflow-frontend-eight.vercel.app/)
- ⚡ **Backend API Server**: [https://voxflow-backend.onrender.com](https://voxflow-backend.onrender.com)
- 💻 **Frontend Repository**: [https://github.com/Saumya-01git/voxflow-frontend](https://github.com/Saumya-01git/voxflow-frontend)
- 💻 **Backend Repository**: [https://github.com/Saumya-01git/voxflow-backend](https://github.com/Saumya-01git/voxflow-backend)

---

## 📸 App Preview & Design Showcase

### 1. Speech Studio — Light Theme (Morning Fairytale)
![VoxFlow Speech Studio Light Theme](./screenshots/light_mode_studio.png)

### 2. Speech Studio — Dark Theme (Cybernetic Oceanic)
![VoxFlow Speech Studio Dark Theme](./screenshots/dark_mode_studio.png)

### 3. Fairy Tale Realm & Story Cards (with Translucent Soundwave Art)
![VoxFlow Fairy Tale Realm Dark Theme](./screenshots/dark_mode_fairytale.png)

---

## ✨ Key Features

- **🎙️ Multilingual Speech Synthesis**: Convert up to 2,000 characters into natural, human-grade voice across English (`en-US`), Hindi (`hi-IN`), Gujarati (`gu-IN`), Marathi (`mr-IN`), Spanish (`es-ES`), French (`fr-FR`), and German (`de-DE`).
- **🎛️ Acoustic Modulation**: Fine-tune speech dynamics with real-time **Speaking Speed** (0.5x to 2.0x) and **Voice Pitch** (-50% to +50%) range scrubbers.
- **🧚 Fairy Tale Realm**: Curated ambient bedtime stories, soothing lullabies, and mindfulness narrations with tailored vocal persona presets.
- **🎧 Audio Deck & Player**: Seekable audio playback, live waveform equalizer animations, speed presets, volume controls, and timestamp display.
- **📥 Direct MP3 Download**: Secure, instant audio file download for authenticated users.
- **📚 Audio Vault & History**: Persistent cloud history of synthesized speech clips with favorite bookmarking and one-click deletion.
- **🔒 Enterprise Authentication & Security**:
  - Secure JWT-based authentication with bcrypt password hashing.
  - Interactive **Password Visibility Toggle (Eye icon)** on all password inputs.
  - Dynamic **4-tier Password Strength Meter** with live color progression (Weak &rarr; Fair &rarr; Good &rarr; Strong).
- **⚙️ User Profile Management**: In-app profile modal allowing authenticated users to review account metadata and update their password securely.
- **🎨 Bespoke Cybernetic Dark Theme**: Built around a curated 4-color palette (`#0099CC`, `#CCFFCC`, `#66CCFF`, `#003399`), glowing glassmorphic borders, and an ethereal acoustic soundwave wallpaper.

---

## 🛠️ Tech Stack

### Frontend Architecture
- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: Vanilla Modern CSS (Design System Tokens, Backdrop Filters, Specular Trims)
- **State Management**: React Context API (`AuthContext`)
- **HTTP Client**: [Axios](https://axios-http.com/) with global auth interceptors and production domain URL resolvers
- **Deployment**: [Vercel](https://vercel.com/) with single-page app route rewrites

### Backend Architecture
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: [Neon](https://neon.tech/) Serverless PostgreSQL with automatic schema provisioning
- **Speech Engine**: Microsoft Edge Neural TTS + Google TTS provider fallback
- **Authentication**: JSON Web Tokens (JWT) + `bcryptjs`
- **Security**: Helmet, dynamic CORS whitelist, rate limiting
- **Deployment**: [Render](https://render.com/) Web Service

---

## 🚀 Getting Started (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/Saumya-01git/voxflow-frontend.git
cd voxflow-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the `frontend` root:
```env
# Point to your local backend server or live cloud API
VITE_API_URL=http://localhost:5000/api
```

### 4. Run development server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 5. Build for production
```bash
npm run build
```

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
