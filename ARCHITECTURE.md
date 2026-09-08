# VoxFlow Frontend Architecture Specification 🏗️

## 1. Directory Structure
```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── styles/
│   ├── components/
│   │   ├── TextInput.jsx
│   │   ├── LanguageSelector.jsx
│   │   ├── VoiceSelector.jsx
│   │   ├── AudioControls.jsx
│   │   ├── AudioPlayer.jsx
│   │   ├── FileUploader.jsx
│   │   ├── SpeechHistory.jsx
│   │   ├── ErrorMessage.jsx
│   │   └── Navbar.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 2. Component Hierarchy & Data Flow
- **`App.jsx`**: Global state management (text, language, voice, audioUrl, isGenerating, history, error).
  - **`Navbar`**: App branding, status badge, theme toggle.
  - **`TextInput`**: Text input area with live character counter, word counter, max limit indicator, clear button, and file upload trigger.
  - **`LanguageSelector`**: Dropdown of supported languages with flag icons.
  - **`VoiceSelector`**: Dropdown dynamically populated based on chosen language, showing voice name and gender.
  - **`AudioControls`**: Speed slider (0.5x - 2.0x), pitch, and volume adjustments.
  - **`AudioPlayer`**: Custom audio playback with Play/Pause, scrubber seek bar, time display, volume control, and download button.
  - **`SpeechHistory`**: List of previous speech generations with one-click re-listen and favorites.
  - **`ErrorMessage`**: User-friendly toast / banner displaying validation or API errors.

## 3. Communication Protocol
- All backend communication handled through standard HTTP REST API via Axios.
- Base URL configurable via `VITE_API_URL` environment variable.
