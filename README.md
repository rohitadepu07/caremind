# 🌸 CareMind (CareMind) — AI Dementia Cognitive Companion

CareMind (codename: *CareMind*) is a warm, loving, and gentle AI-driven cognitive companion designed to support elderly individuals living with dementia (such as Alzheimer's) while providing valuable insights and status updates to their caregivers.

The application offers two distinct modes:
*   **Elder Mode:** A simplified, high-accessibility interface with large elements, voice assistant integration, gentle games, and memory journals.
*   **Caregiver Mode:** A dashboard for tracking cognitive progress, safety alerts, activity logs, and managing daily reminders.

---

## 🌟 Key Features

### 👴 Elder Interface (Accessibility First)
*   **CareMind Voice Companion:** A conversational assistant powered by Google Gemini AI, offering comforting, patient, and respectful audio interactions.
*   **Play (Games Hub):** Simple, science-backed cognitive exercises like *Memory Match*, *Pattern Match*, and *Word Association*.
*   **Memory Garden:** A visual, interactive representation of cognitive milestones where completed tasks grow flowers in a virtual garden.
*   **Memory Journal:** An easy way for seniors to document memories, upload pictures, and store family stories.

### 🧑‍⚕️ Caregiver Dashboard (Insights & Oversight)
*   **Cognitive Analytics:** Graphic reports summarizing memory game scores, cognitive active duration, and engagement.
*   **Real-time Alerts & Logs:** Activity logs displaying what games were played and any alerts flagged during AI companion conversations.
*   **Reminders Manager:** Manage schedule times for medications, doctor appointments, or social calls.

---

## 🛠️ Tech Stack

### **Frontend**
*   **React 19** — User interface components and state management.
*   **TypeScript** — Strongly typed safety for solid codebase structures.
*   **Vite 6** — Modern build tooling and optimized asset pipeline.
*   **Tailwind CSS v4** — Utility-first, responsive interface styling.
*   **Motion (Framer)** — Smooth micro-animations for senior-friendly visual feedback.
*   **Recharts** — Elegant caregiver analytics graphs.
*   **Lucide React** — Clean SVG iconography.

### **Backend**
*   **Node.js & Express** — Back-end server handling API routing and static asset delivery.
*   **Google Gemini SDK (`@google/genai`)** — Orchestrates patient-centric prompts using the **Gemini 2.5 Flash** AI model.
*   **TSX** — Fast TypeScript execution wrapper for running the Node backend.
*   **Dotenv** — Environment variable management.

---

## 🚀 Running Locally

### Prerequisites
*   **Node.js** (v20+ recommended)
*   An active **Gemini API Key** from Google AI Studio.

### Step 1: Install Dependencies
Clone the repository and install packages:
```bash
npm install
```

### Step 2: Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 3: Run the Application
Start the development server (runs both frontend and backend):
*   To run the frontend dev environment:
    ```bash
    npm run dev
    ```
*   To start the backend server:
    ```bash
    npm run start
    ```

---

## 📦 Project Structure

```
├── .github/workflows/   # CI/CD deployment pipelines
├── dist/                # Production build output folder
├── src/
│   ├── assets/          # Static assets (App Logo, etc.)
│   ├── components/      # React components (Caregiver, Elder, Shared)
│   ├── context/         # App Context state management
│   ├── App.tsx          # Main entry layout with Boot Splash Screen
│   ├── main.tsx         # Mounts React DOM
│   ├── index.css        # Tailwind styles & custom animations
│   ├── mockData.ts      # Patient cognitive metrics & logs mockup data
│   └── types.ts         # TypeScript structural definitions
├── index.html           # Root HTML template
├── server.ts            # Express server (Gemini AI Companion API integration)
└── vite.config.ts       # Vite project configuration
```

---

## ✈️ Production Hosting & Deployment

The repository is pre-configured with a GitHub Actions deployment workflow:
*   Every push to the `main` branch compiles the frontend and automatically deploys the static files in `dist/` directly to **GitHub Pages**.
*   **To enable it:** Go to your repository settings on GitHub -> **Pages** -> under **Source**, select **GitHub Actions**.
