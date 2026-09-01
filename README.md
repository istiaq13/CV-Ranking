# Resume–JD Matcher & AI Career Coach

A full-stack NLP web application built with **Next.js 14 (App Router)** and **Google Gemini (3.6 Flash / 2.0)** that evaluates candidate resumes against target job descriptions, computes multi-dimensional match scores, diagnoses skill gaps, generates tailored STAR resume bullet points, and powers an interactive mock interview preparation coach.

---

## Features

- **Document Ingestion & Multi-Format Parsing**:
  - Drag-and-drop parsing for **PDF** (`pdf-parse`), **DOCX** (`mammoth`), and plain text resumes.
  - Direct in-browser text editing drawer for quick resume tweaking.
- **Match Scoring Engine (0–100 Fit Score)**:
  - Multi-dimensional breakdown: *Hard Skills Match*, *Experience Level*, *Soft Skills & Culture Fit*, and *ATS Keyword Density*.
  - Circular animated match gauge with instant status assessment.
- **Skill & Gap Diagnostics**:
  - Categorized verified candidate strengths vs. missing prerequisites (Technical, Tool, Domain, Soft).
  - High-priority flag alerts and strategic fast-track learning recommendations for missing skills.
- **Tailored STAR Resume Bullet Points**:
  - Automatically transforms raw achievements into Google XYZ formula bullet points (*"Accomplished [X], measured by [Y], by doing [Z]"*).
  - 1-click clipboard copy per bullet or copy all.
- **Mock Interview Simulator & AI Coach**:
  - Generates 5 tailored technical and behavioral interview questions mapped to the job description and candidate gaps.
  - Includes interviewer intent, answer strategy guides, STAR blueprints, model exemplary answers, and a live practice simulator with AI evaluation feedback.
- **Export & History**:
  - 1-click full report export in formatted Markdown.
  - Optional local analysis history persistence via Prisma & SQLite.
- **Preloaded Demo Presets**:
  - 1-click instant demo profiles for *NLP / AI Systems Engineer*, *Full-Stack Software Engineer*, and *Technical Product Manager*.

---

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Backend**: Next.js Route Handlers (`app/api/*`)
- **LLM Engine**: Google Generative AI SDK (`@google/generative-ai`) targeting `gemini-3.6-flash`
- **File Parsing**: `pdf-parse`, `mammoth`
- **Database (Optional)**: Prisma ORM with SQLite

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/istiaq13/CV-Ranking.git
cd CV-Ranking
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
# Get a free Gemini API key from https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.6-flash
DATABASE_URL="file:./dev.db"
```
*(You can also input your API key directly in the web app's in-app Settings modal)*

### 4. Initialize Database
```bash
npx prisma db push
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## License
MIT License.
