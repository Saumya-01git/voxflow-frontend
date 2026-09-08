# VoxFlow — Frontend Client 🎙️✨

> **VoxFlow** is a modern, high-performance web application that transforms written text into crystal-clear, natural-sounding speech across multiple languages and voices.

---

## 📌 Project Overview
- **Project Name**: VoxFlow (Client)
- **Tech Stack**: React.js, TailwindCSS / Modern Vanilla CSS, Axios, Lucide Icons, Vite
- **Architecture**: Decoupled Client-Server REST Architecture
- **Timeline**: 14-Day Structured Enterprise Development Plan

---

## 🎯 Day 1: Project Requirements & System Architecture

### 1. Functional Requirements
- **Text Input**: Multi-line text area with real-time character count, word count, character limits, and text cleanup.
- **Language Selection**: Broad multilingual support including English (`en-US`), Hindi (`hi-IN`), Gujarati (`gu-IN`), Marathi (`mr-IN`), Spanish (`es-ES`), French (`fr-FR`), German (`de-DE`).
- **Voice Selection**: Dynamic filtering by language, displaying voice name, gender (Male / Female), and accent characteristics.
- **Speech Synthesis**: Instant conversion via backend REST API (`POST /api/tts`).
- **Interactive Audio Player**: Seeking, play/pause, volume control, playback rate speed adjustment (0.5x, 1x, 1.25x, 1.5x, 2x).
- **Audio Download**: Download speech directly in MP3 format.
- **Document Text Extractor**: Upload text files (TXT, PDF) to auto-populate the text input.
- **Speech History & Favorites**: Local storage tracking of generated speech sessions with playback and favoriting.

### 2. High-Level Flow
```
User Text Input & Voice Selection
         │
         ▼
React Client (Validation & Character Count)
         │
         ▼ [HTTP POST /api/tts]
Express Backend API
         │
         ▼
Text-to-Speech Engine
         │
         ▼
Generated MP3 Audio Stream
         │
         ▼
Interactive Audio Player & Download
```

---

## 📅 14-Day Development Roadmap

| Day | Milestone | Status |
|---|---|---|
| **Day 1** | Understand project requirements, system architecture, and API contracts | Completed |
| **Day 2** | UI/UX design tokens, modern dark/light system, and wireframe layout | In Progress |
| **Day 3** | Create React frontend project scaffold and modular folder structure | Pending |
| **Day 4** | Implement `TextInput` component with live counter and client validation | Pending |
| **Day 5** | Implement `LanguageSelector` and `VoiceSelector` with dynamic filtering | Pending |
| **Day 6** | Frontend API service layer (`Axios`), error banners, and loading states | Pending |
| **Day 7** | Connect frontend with backend API contracts & state orchestration | Pending |
| **Day 8** | Initialize Express backend repository with MVC architecture | Pending |
| **Day 9** | Implement `/api/voices` and `/api/tts` with input validation middleware | Pending |
| **Day 10** | Integrate multi-language Text-to-Speech engine | Pending |
| **Day 11** | Audio generation pipeline, audio caching, and static streaming | Pending |
| **Day 12** | Implement seekable `AudioPlayer` with speed and waveform controls | Pending |
| **Day 13** | Implement audio download, file text extraction (TXT/PDF), and speech history | Pending |
| **Day 14** | End-to-end testing, error handling hardening, Postman collection & docs | Pending |
