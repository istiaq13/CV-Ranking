# Resume–JD Matcher & Career Coach
### Tech Stack, Tools & Architecture Document (Next.js Full-Stack Version)

---

## 1. Project Overview

A full-stack web application built **entirely in Next.js** where a user uploads their resume and pastes a job description. The app uses the **Gemini API** to:
- Compute a match score between resume and JD
- Identify skill/experience gaps
- Suggest tailored resume bullet points
- Generate mock interview questions based on the JD

This is an **NLP application project** (not a training/dataset project) — all reasoning is offloaded to Gemini via prompt engineering. Next.js handles both the frontend (React UI) and backend (API routes), so there's a single codebase and a single deployment.

No dataset. No model training. Just a well-engineered pipeline around a pretrained LLM.

---

## 2. Tech Stack

### Framework (Frontend + Backend, unified)
| Tool | Purpose |
|---|---|
| **Next.js 14+ (App Router)** | Full-stack framework — React UI + API Route Handlers in one project |
| **Tailwind CSS** | Styling, fast UI building |
| **react-dropzone** | Drag-and-drop resume upload |
| **react-markdown** | Rendering Gemini's markdown-formatted responses (bullet points, tables) |

### Backend Logic (inside Next.js API Routes)
| Tool | Purpose |
|---|---|
| **Route Handlers** (`app/api/.../route.js`) | Replace what would've been a separate FastAPI backend |
| **@google/generative-ai** (Gemini JS SDK) | Calling Gemini API for all NLP tasks |
| **pdf-parse** | Extract text from uploaded PDF resumes |
| **mammoth** | Extract text if resume is uploaded as .docx |
| **zod** | Request/response validation |

### Database (optional but recommended for academic depth)
| Tool | Purpose |
|---|---|
| **Prisma ORM** | Type-safe database access from Next.js |
| **SQLite** (dev/simple) or **Postgres via Neon/Supabase/Vercel Postgres** (production) | Store past resume analyses, user history |

### Deployment
| Tool | Purpose |
|---|---|
| **Vercel** | Single deployment for the entire app (frontend + API routes) |
| **Vercel Postgres / Neon / Supabase** | Free-tier hosted DB if you add history/auth features |

### Dev Tools
| Tool | Purpose |
|---|---|
| **Postman / Thunder Client** | Testing API routes during development |
| **Git/GitHub** | Version control |
| **.env.local** | Storing Gemini API key securely (never exposed to client) |

---

## 3. System Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                     NEXT.JS APP (single project)               │
│                                                                  │
│   ┌───────────────────── CLIENT (React) ─────────────────────┐ │
│   │  ┌───────────────┐  ┌────────────────┐  ┌──────────────┐ │ │
│   │  │ Resume Upload │  │  JD Text Input  │  │ Results Tabs │ │ │
│   │  │  (dropzone)   │  │   (textarea)    │  │ Score/Gaps/  │ │ │
│   │  │               │  │                 │  │ Bullets/Quiz │ │ │
│   │  └───────┬───────┘  └────────┬────────┘  └──────▲───────┘ │ │
│   └──────────┼───────────────────┼──────────────────┼─────────┘ │
│              │  fetch("/api/..") │                  │            │
│              ▼                   ▼                  │            │
│   ┌───────────────────── API ROUTES (server) ───────┴─────────┐ │
│   │                                                             │ │
│   │  POST /api/upload-resume    ──► extract text (pdf-parse)   │ │
│   │  POST /api/analyze          ──► builds prompt(s) ──► Gemini│ │
│   │  POST /api/generate-bullets ──► Gemini                     │ │
│   │  POST /api/mock-interview   ──► Gemini                     │ │
│   │  GET  /api/history          ──► Prisma ──► DB              │ │
│   │                                                             │ │
│   │   ┌───────────────────────────────────────────────────┐   │ │
│   │   │  Prompt Orchestration Layer (lib/prompts.js)       │   │ │
│   │   │  - Prompt 1: Match score + gap analysis            │   │ │
│   │   │  - Prompt 2: Tailored resume bullets               │   │ │
│   │   │  - Prompt 3: Mock interview questions              │   │ │
│   │   └───────────────────────┬─────────────────────────┘   │ │
│   └───────────────────────────┼─────────────────────────────┘ │
└───────────────────────────────┼───────────────────────────────┘
                                 ▼
                       ┌──────────────────┐
                       │   Gemini API     │
                       │ (gemini-2.0-flash│
                       │  or -pro)        │
                       └──────────────────┘
                                 │
                                 ▼
                       ┌──────────────────┐
                       │  SQLite/Postgres │
                       │  (via Prisma)    │
                       └──────────────────┘
```

---

## 4. Data Flow (Step-by-Step)

1. **User uploads resume** (PDF/DOCX) via the dropzone component → sent as `FormData` to `/api/upload-resume`
2. **API route extracts raw text** from the file using `pdf-parse` (PDF) or `mammoth` (DOCX), running server-side in the Route Handler
3. **User pastes job description** into a textarea on the same page
4. **Frontend sends both texts** to `/api/analyze` via `fetch`
5. **API route builds a structured prompt** combining resume text + JD text, requesting Gemini to return **JSON** with:
   - `match_score` (0–100)
   - `matched_skills` (list)
   - `missing_skills` (list)
   - `improvement_suggestions` (list)
6. **API route calls Gemini API** (server-side, API key stays private in `.env.local`), parses the JSON response
7. **Frontend optionally calls two more routes**:
   - `/api/generate-bullets` → tailored resume bullet points
   - `/api/mock-interview` → 5 mock interview questions
8. **API route optionally saves the analysis** to the database via Prisma (for history feature)
9. **Frontend renders results** in tabs: Match Score / Gap Analysis / Resume Suggestions / Interview Prep

---

## 5. API Routes (App Router structure)

| Method | Route file | Description |
|---|---|---|
| `POST` | `app/api/upload-resume/route.js` | Accepts file, returns extracted text |
| `POST` | `app/api/analyze/route.js` | Accepts resume text + JD text, returns full analysis |
| `POST` | `app/api/generate-bullets/route.js` | Returns tailored resume bullet suggestions |
| `POST` | `app/api/mock-interview/route.js` | Returns generated interview questions |
| `GET` | `app/api/history/route.js` | Returns past analyses (if using DB) |

Each `route.js` exports named functions matching HTTP methods, e.g.:
```js
export async function POST(request) {
  const { resumeText, jdText } = await request.json();
  // call Gemini, return NextResponse.json(...)
}
```

---

## 6. Prompt Engineering Notes (for your report's "Methodology" section)

- Use **structured output prompting**: explicitly ask Gemini to respond only in valid JSON matching a defined schema — makes parsing reliable in the API route.
- Use **few-shot examples** in the prompt for consistent scoring behavior across different resumes.
- Keep resume + JD text within Gemini's context window; for very long resumes, consider a text-cleaning step (remove headers/footers, extra whitespace) before sending.
- Use **temperature ~0.2–0.4** for scoring tasks (more deterministic) vs. **~0.7** for creative tasks like bullet-point generation.
- Gemini's JS SDK supports a JSON response mode in the generation config — use this to enforce structured output directly instead of parsing free text.

---

## 7. Folder Structure

```
resume-jd-matcher/
├── app/
│   ├── page.jsx                      # Main UI page
│   ├── layout.jsx
│   ├── components/
│   │   ├── ResumeUpload.jsx
│   │   ├── JDInput.jsx
│   │   └── ResultsTabs.jsx
│   └── api/
│       ├── upload-resume/route.js
│       ├── analyze/route.js
│       ├── generate-bullets/route.js
│       ├── mock-interview/route.js
│       └── history/route.js
│
├── lib/
│   ├── gemini.js                     # Gemini client setup
│   ├── prompts.js                    # Prompt templates
│   ├── pdfParser.js                  # PDF/DOCX text extraction helpers
│   └── db.js                         # Prisma client instance
│
├── prisma/
│   └── schema.prisma                 # DB schema (if using history feature)
│
├── public/
├── .env.local                        # GEMINI_API_KEY (server-only, never exposed)
├── package.json
├── tailwind.config.js
└── README.md
```

---

## 8. Academic Report Angle (what to write about)

For your project report, you can frame this around:
- **Problem statement**: manual resume tailoring is time-consuming; automated NLP-based matching improves job-seeker efficiency
- **Literature review**: brief mention of ATS (Applicant Tracking Systems) and existing resume-matching tools
- **Methodology**: prompt design, structured JSON extraction, text preprocessing pipeline
- **System design**: unified full-stack architecture using Next.js Route Handlers instead of a separate backend service — worth explicitly justifying (simplicity, single deployment, serverless scalability)
- **Evaluation**: manually test with 10–15 resume/JD pairs and check consistency of scores, or survey a few users on suggestion usefulness
- **Limitations**: dependent on LLM output quality; no ground-truth dataset for validation; potential API rate limits/costs; serverless function time limits on free-tier Vercel

---

## 9. Model & Dataset Summary

| Component | Needed? |
|---|---|
| Pretrained LLM (Gemini) | ✅ Yes — via API, no training |
| Fine-tuning | ❌ No |
| Training dataset | ❌ No |
| Sample test inputs (optional, for evaluation section) | ✅ Nice to have |
| Vector DB / embeddings | ❌ Not needed for this project |

---

## 10. Stretch Features (if time permits)

- User authentication via **NextAuth.js** (Auth.js) — so history is per-user
- Compare resume against **multiple JDs at once** and rank fit
- **PDF export** of tailored resume suggestions (e.g., using `jsPDF` or `@react-pdf/renderer`)
- Highlight matched/missing keywords directly on the resume text (visual diff-style UI)
- Streaming Gemini responses to the UI using the Vercel AI SDK for a more responsive feel
