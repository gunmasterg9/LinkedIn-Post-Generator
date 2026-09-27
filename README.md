# LinkedIn Post Generator (EventPulse)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-API%20v2-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Deployment](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white)](https://linked-in-post-generator-rqdj.vercel.app/)

> **EventPulse** is an AI-powered content platform designed to transform conference highlights, attendee takeaways, and executive insights into authentic, high-impact, and viral LinkedIn posts in seconds.

---

## 🖥️ Demo

Experience the live application:

🔗 **[Live Demo: EventPulse LinkedIn Post Generator](https://linked-in-post-generator-rqdj.vercel.app/)**

---

## 🎯 Why This Project

Consistently writing high-impact, engaging LinkedIn posts after attending conferences, summits, or workshops is challenging. Attendees often struggle to structure their raw notes into engaging narratives, choose the right hooks, balance hashtags, and maintain authentic executive tone.

**EventPulse** solves this by streamlining the entire workflow:

$$\text{Event Context} \longrightarrow \text{Attendee Takeaways} \longrightarrow \text{Gemini AI Synthesis} \longrightarrow \text{Ready-to-Publish LinkedIn Post}$$

- **Zero Blank Page Syndrome**: Turn raw notes and uploaded photos into 3 distinct post variations in seconds.
- **Zero AI Hallucinations**: Strict prompt guardrails ensure facts, numbers, and mentions come directly from your input.
- **Brand Guardrails for Organizers**: Organizers can provide default hashtags, talking points, and verified `@mentions` across all delegate posts without messaging drift.

---

## ✨ Features

### 🤖 AI Post Generation
- **Simplified 3-Step Experience**: `STEP 1: Your Event` → `STEP 2: Your Experience` → `STEP 3: Generate`.
- **Quick Generate Mode**: Generate posts using only event details, photo context, takeaways, and style (`Ctrl+Enter` shortcut).
- **3 Simultaneous Post Variations**: Generates 3 distinct post variations (Storytelling, Direct Insight, Reflective Question) with differing hooks and structures while preserving factual fidelity.
- **10 Post Style Presets**:
  - `Storytelling` • `Professional` • `Technical` • `Short & Punchy` • `Grateful`
  - `Educational` • `Founder` • `Developer` • `Career / Learning` • `Personal`
- **Configurable Length Targets**:
  - `Short` (~600 characters)
  - `Standard` (~1,300 characters)
  - `Long` (~2,500 characters)
- **Personal Voice Cloning**: Provide past post writing samples to train AI on personal rhythm, formatting, and formality.

### 🛠️ Content & Refinement Tools
- **Hook Laboratory**: Generates 3 alternative opening lines across categories (*Curiosity, Personal, Result, Question, Learning, Story*) with 1-click replacement without modifying the post body.
- **AI Post Improvement Suite**: 10 non-hallucinating refinement actions:
  - *Make more human* • *Make shorter* • *Make professional* • *Make engaging* • *Improve hook*
  - *Improve readability* • *Reduce emojis* • *Stronger CTA* • *Improve storytelling* • *Make technical*
- **1-Click Shorten Post**: AI-powered intelligent condensation.
- **Smart Hashtags**: Categorized hashtag intelligence (*Event, Technology, Industry, Community*) with add/remove/regenerate controls.
- **Undo / Redo Stack**: Revert or replay edits across post iterations (`Ctrl+Z` / `Ctrl+Y`).
- **Counters**: Live character target progress and word counters.

### 📊 EventPulse Content Quality Score
- **Quality Scorecard (0–100)**: Evaluates posts across 7 metrics:
  - `Hook Strength` • `Clarity` • `Specificity` • `Readability` • `Authenticity` • `Call-to-Action` • `Hashtag Balance`
- **Actionable Tips**: Suggests mobile spacing improvements, takeaway structuring, and formatting tips.
- **AI Fact-Checking**: Audits generated claims against input notes with options to remove, edit, or keep flagged items.

### 📸 Media & Photo Intelligence
- **Multiple Photo Support**: Upload PNG, JPEG, or WebP images (up to 5MB) with drag-and-drop.
- **Sample Photos Pool**: Pre-loaded conference stage, badge, panel, and auditorium photos for instant testing.
- **Featured Photo Selection**: Star any photo to feature it as the primary preview asset.
- **Safe Supporting Context**: Analyzes visual environment tags (e.g. stage, panel, badge) without inferring private attendee data.

### 🏛️ Event Organizer Workbench & Campaign Management
- **"My Events" Portfolio**: Manage multiple events with search and status filtering (*Active, Upcoming, Past, Draft, Archived*).
- **Event Blueprints & Templates**: Pre-configured templates for *Tech Conference, Hackathon, Workshop, Executive Mixer, and Webinar*.
- **Mention Management (@)**: Configure verified LinkedIn handles and URLs for Companies, Speakers, Events, and Communities.
- **Vector QR Code Generator**: Download high-resolution `.SVG` QR codes for presentation slides, print badges, and check-in desks.
- **Access Security**: Unpredictable secure random event IDs (e.g., `gts-9f2a41d8`) and optional access codes (*Public, Link-only, Password*).
- **Telemetry & Analytics**: Real-time tracking of attendee link visits, generated posts, photo uploads, and generation velocity charts.

### 🎨 User Experience & Sharing
- **Interactive LinkedIn Preview**: Toggle between Desktop and Mobile feed preview layouts with realistic reaction counters.
- **Multi-Channel Sharing**: One-click share via LinkedIn, WhatsApp, X (Twitter), and Email.
- **Copy & Export Options**: Copy formatted post, plain text, or Markdown; export to `.TXT`, `.MD`, or `.JSON`.
- **Autosave & Privacy**: Local storage draft persistence with 1-click privacy controls to purge local photos and cached drafts.
- **Keyboard Shortcuts**: `Ctrl/Cmd + Enter` (Generate), `Ctrl/Cmd + C` (Copy preview), `Esc` (Close modals).

---

## 📸 Screenshots

> Screenshots can be added here.

---

## 🏗️ Architecture

EventPulse is built on a modern decoupled architecture where client-side state connects to a secure backend proxy layer that protects API secrets and enforces rate limits.

```text
┌─────────────────────────────────────────────────────────────┐
│                          USER                               │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Interacts via UI / Shortcuts)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (REACT 19)                     │
│  - 3-Step Attendee Flow & Quick Generate                     │
│  - Style Presets, Length Targets & Hook Lab                 │
│  - Realistic LinkedIn Feed Preview (Desktop & Mobile)       │
│  - Organizer Workbench, Template Engine & My Events         │
│  - Content Quality Scoring & Fact Checking UI               │
│  - Local Draft Persistence & Privacy Controls               │
└──────────────────────────────┬──────────────────────────────┘
                               │ (JSON API Requests)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 BACKEND SERVICE (EXPRESS + TSX)             │
│  - Security Headers (CSP, X-Content-Type, Referrer-Policy)  │
│  - Sliding Window Rate Limiting (60 req / 5 min per IP)     │
│  - Request Validation & Prompt Injection Sanitization       │
│  - Telemetry Logger & Event Storage                         │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Secure Server-Side API Call)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               AI ENGINE (GOOGLE GEMINI API)                 │
│  - Model: Gemini 3.8 Flash                                  │
│  - Strict System Guardrails (Zero Hallucination)            │
│  - 3 Parallel Variations & Content Quality Analysis         │
│  - Deterministic Fallback Engine (Offline Resilience)       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) | Component-driven UI and responsive state management |
| **Language** | [TypeScript 7](https://www.typescriptlang.org/) | End-to-end type safety across client and server |
| **Bundler / Tooling** | [Vite 8](https://vitejs.dev/) | Fast development server and optimized production bundling |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) | Modern utility-first styling with custom design tokens |
| **Backend Framework** | [Express 4](https://expressjs.com/) | REST API server, security headers, and rate limiting |
| **Runtime & Execution** | [Node.js](https://nodejs.org/) / [tsx](https://github.com/privatenumber/tsx) | Fast TypeScript execution for server runtime |
| **AI Integration** | [@google/genai](https://www.npmjs.com/package/@google/genai) | Gemini 3.8 Flash API integration for post generation |
| **Icons & Typography** | Google Fonts (Manrope, DM Sans, Material Symbols) | Clean typography and iconography |
| **Animation** | [Motion](https://motion.dev/) | Micro-interactions and smooth UI transitions |
| **Deployment** | [Vercel](https://vercel.com/) | Cloud hosting and continuous deployment |

---

## 📁 Project Structure

```text
LinkedIn-Post-Generator/
├── src/
│   ├── components/
│   │   ├── AttendeeView.tsx        # 3-step attendee experience, hook lab, & LinkedIn preview
│   │   ├── CampaignsView.tsx       # "My Events" portfolio manager with search & status filters
│   │   ├── Header.tsx              # Brand navigation, persona switcher, and utility shortcuts
│   │   ├── Modals.tsx              # Share, QR code, telemetry, privacy, drafts, & admin modals
│   │   └── OrganizerWorkbench.tsx  # Campaign parameters, event templates, and mentions (@)
│   ├── App.tsx                     # Main application layout, state orchestration, and routing
│   ├── index.css                   # Tailwind CSS imports, color tokens, and font setup
│   ├── main.tsx                    # React application root mount
│   └── types.ts                    # Core TypeScript interfaces, presets, and constants
├── dist/                           # Production build output directory
├── index.html                      # HTML entry point with font preconnects and meta tags
├── metadata.json                   # Project capabilities and description
├── package.json                    # Dependencies, scripts, and package configuration
├── package-lock.json               # Deterministic dependency lockfile
├── server.ts                       # Secure Express backend, Gemini API routes, and rate limiter
├── tsconfig.json                   # TypeScript compiler configuration
├── vite.config.ts                  # Vite build and plugin configuration
├── .env.example                    # Environment variable template
└── README.md                       # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher (`v24.x` recommended)
- **npm**: `v10.x` or higher
- **Google Gemini API Key** (optional for AI generation; intelligent fallback engine operates offline)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/gunmasterg9/LinkedIn-Post-Generator.git
   cd LinkedIn-Post-Generator
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (or copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key:
   ```env
   GEMINI_API_KEY="your_google_gemini_api_key_here"
   PORT=3000
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   ```

6. **Run TypeScript Check**:
   ```bash
   npm run lint
   ```

---

## 🔒 Security & Privacy

- **Server-Side API Key Isolation**: Gemini API credentials remain strictly on the backend server. The client bundle contains zero secret tokens.
- **Rate Limiting**: Built-in sliding window rate limiter protects endpoints against abuse (60 requests per 5 minutes per IP).
- **Strict Input Sanitization**: Strips HTML injection, enforces character length boundaries, and guards against prompt injection.
- **Safe Observability**: Backend request logger redacts secrets, tokens, and raw image binaries.
- **Data Privacy**: Uploaded photos and draft posts are saved only in client `localStorage` with a 1-click purge option in the Privacy modal.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) (or repository standard).
