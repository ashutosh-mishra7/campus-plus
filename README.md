# 🎓 CampusPulse — AI-Powered Campus Notice & Event Management Platform

> An intelligent, evidence-backed campus notice and event management platform with natural-language retrieval, revision discrepancy detection, automated event extraction, and administrative governance.

![CampusPulse Light Theme](https://img.shields.io/badge/Theme-Modern%20Light-4f46e5?style=for-the-badge)
![React 19](https://img.shields.io/badge/React-19.2-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8.3-646cff?style=for-the-badge&logo=vite)
![Zero Hallucination](https://img.shields.io/badge/AI-Grounded%20RAG-10b981?style=for-the-badge)

---

## 🌟 Key Features

### 1. 🔍 Evidence-First Natural Language Search
- Ask plain conversational questions (e.g. *"What is the revised venue for HackNova 2026?"*, *"What is the cutoff CGPA for Google placement?"*).
- System extracts exact supporting passages and highlights evidence without fabricating unsupported answers.

### 2. ⚡ Revision & Conflict Discrepancy Engine
- Automatically tracks modifications across notices, venues, dates, and deadlines.
- Features **Visual Version Diffs** (side-by-side & inline word-level diffs) highlighting added and removed instructions.
- Never permanently overwrites previous notice versions.

### 3. 🤖 AI Campus Assistant (Grounded Chatbot)
- Specialized conversational assistant strictly bound to published official circulars.
- Includes clickable citation badges, supporting passage cards, and follow-up prompts.

### 4. 📅 Automated Event Aggregation
- Automatically surfaces dates, venues, organizers, and deadlines from published notices into the **Events Hub**.
- Supports **Card Grid View** & **Calendar Timeline View** with one-click registration and ticket pass generation.

### 5. 🏷️ AI Automatic Category Classification
- Analyzes notice title and body text in real-time to suggest the most relevant classification among 12 university taxonomies.

### 6. 🛠️ Administrative Studio & Governance
- **Publication Studio**: Create and revise notices with simulated OCR document text extraction.
- **Search Analytics & Content Gaps**: Identify questions searched by students that lack official notice coverage.
- **Role-Based Access Control (RBAC)**: Distinct permissions for Students and Administrators.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ashutosh-mishra7/campus-plus.git

# 2. Navigate to project folder
cd campus-plus

# 3. Install dependencies
npm install

# 4. Launch local dev server
npm run dev
```

Open your browser at `http://localhost:5173/`.

---

## 🏗️ Tech Stack

- **Frontend Framework**: React 19 + TypeScript
- **Bundler & Tooling**: Vite 8.3
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti, Vanilla CSS Design System
- **State Management**: Reactive React Context with LocalStorage persistence

---

## 👥 Demo Profiles

- **Student Access**: `student@campus.edu` (Aarav Sharma — B.Tech CSE)
- **Admin Access**: `admin@campus.edu` (Dr. Sarah Jenkins — Dean of Academic Affairs)
- *Quick 1-click role switcher available in the top-right profile menu.*

---

## 📄 License

Distributed under the MIT License.
