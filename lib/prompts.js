/**
 * Prompt orchestration templates for Gemini NLP analysis
 */

/**
 * Builds the Match Score and Gap Analysis prompt.
 */
export function buildAnalysisPrompt(resumeText, jdText) {
  return `You are an elite Executive Tech Recruiter and AI Talent Assessment expert.
Analyze the provided Candidate Resume against the target Job Description with extreme precision, objectivity, and actionable depth.

### Candidate Resume:
"""
${resumeText}
"""

### Target Job Description:
"""
${jdText}
"""

### Instructions:
1. Objectively evaluate the degree of alignment across Hard Skills, Experience Level, Domain Expertise, and ATS (Applicant Tracking System) compatibility.
2. Determine an Overall Match Score (0 to 100), calibrated realistically:
   - 90-100: Exceptional match, meets or exceeds nearly all requirements.
   - 75-89: Strong candidate, minor gaps easily bridgeable.
   - 55-74: Moderate match, notable missing requirements or experience gap.
   - Below 55: Significant misalignment in core competencies.
3. Identify matched skills with context from the resume, and missing/gap skills with strategic advice on how to address them.
4. Provide structured, executive-grade analysis in pure JSON format conforming EXACTLY to the schema below.

### Output JSON Schema:
{
  "candidateName": "Extracted or inferred candidate name (or 'Candidate' if unspecified)",
  "targetRole": "Extracted or inferred target job title from JD",
  "companyName": "Company name if mentioned in JD, else null",
  "matchScore": 82,
  "hardSkillsScore": 85,
  "experienceScore": 78,
  "softSkillsScore": 90,
  "atsScore": 88,
  "summary": "2-3 sentences concise executive evaluation of the candidate's fit for this role, highlighting top pros and biggest hurdles.",
  "keyStrengths": [
    "Specific strength 1 with proof from resume",
    "Specific strength 2 with proof from resume",
    "Specific strength 3 with proof from resume"
  ],
  "matchedSkills": [
    {
      "skill": "Python",
      "category": "Technical",
      "matchStrength": "High",
      "context": "Demonstrated across multiple backend and data processing projects."
    }
  ],
  "missingSkills": [
    {
      "skill": "Kubernetes",
      "category": "DevOps",
      "importance": "Critical",
      "recommendation": "Highlight any container orchestration or Docker experience, or complete a fast-track certification/project.",
      "fastTrackLearningPath": "Deploy a containerized microservice on Minikube or GKE within 2 days."
    }
  ],
  "improvementSuggestions": [
    "Actionable, high-impact suggestion 1 to optimize the resume for this specific role.",
    "Actionable suggestion 2.",
    "Actionable suggestion 3."
  ],
  "atsOptimization": {
    "keywordMatchRate": "82%",
    "formattingRisk": "Low",
    "criticalMissingKeywords": ["keyword1", "keyword2", "keyword3"],
    "recommendations": [
      "Include the exact term '...' in your Technical Skills section.",
      "Quantify metrics under the ... project."
    ]
  }
}

Return ONLY the JSON object. Do not include markdown codeblocks or conversational filler.`;
}

/**
 * Builds the Tailored Bullet Points prompt.
 */
export function buildBulletSuggestionsPrompt(resumeText, jdText, targetRole = "") {
  return `You are a world-class Resume Strategist who has helped candidates land offers at FAANG, top startups, and Fortune 500 companies.
Transform the candidate's existing experience into impactful, tailored, metric-driven resume bullet points engineered to match the Target Job Description.

### Candidate Resume:
"""
${resumeText}
"""

### Target Job Description:
"""
${jdText}
"""
${targetRole ? `### Target Role: ${targetRole}\n` : ""}

### Rules for Generating Bullets:
1. Apply the **Google XYZ Formula**: "Accomplished [X] as measured by [Y], by doing [Z]".
2. Begin every bullet with a powerful action verb (e.g., Architected, Spearheaded, Accelerated, Engineered, Streamlined).
3. Naturally integrate essential keywords and technologies from the Job Description.
4. Retain truthfulness to the candidate's actual projects/experience while elevating phrasing and impact.
5. Provide 6 to 8 tailored bullet points categorized by role/project.

### Output JSON Schema:
{
  "tailoredBullets": [
    {
      "id": 1,
      "category": "Experience / Project Area (e.g., Backend Engineering, NLP Pipeline, Cloud Infrastructure)",
      "originalContext": "Brief note on what experience in the resume this enhances",
      "suggestedBullet": "Architected and deployed an asynchronous NLP inference pipeline using FastAPI and Celery, reducing response latency by 42% while scaling to 15,000 daily queries.",
      "targetedKeywords": ["FastAPI", "NLP Pipeline", "Celery", "Latency Optimization"],
      "impactMetric": "42% latency reduction, 15k daily queries",
      "recruiterAppeal": "Demonstrates high-scale system design and concrete business metrics demanded in the JD."
    }
  ]
}

Return ONLY valid JSON.`;
}

/**
 * Builds the Mock Interview Questions & Prep Coach prompt.
 */
export function buildMockInterviewPrompt(resumeText, jdText, targetRole = "", missingSkills = []) {
  const missingContext = Array.isArray(missingSkills) && missingSkills.length > 0
    ? `Identified Skill Gaps to test candidate resilience: ${missingSkills.map(s => typeof s === 'string' ? s : s.skill).join(", ")}`
    : "";

  return `You are a Principal Hiring Manager and Technical Interviewer conducting a mock interview preparation session.
Generate 5 targeted, highly realistic interview questions tailored specifically to this candidate's resume and the job description.

### Candidate Resume:
"""
${resumeText}
"""

### Target Job Description:
"""
${jdText}
"""
${targetRole ? `### Target Role: ${targetRole}\n` : ""}
${missingContext}

### Structure of the 5 Questions:
1. **Technical Deep-Dive**: Tests primary core technology stack mentioned in the JD.
2. **Gap Defense / Learning Agility**: Challenges a specific missing skill or transition area in the candidate's background.
3. **Behavioral / STAR Question**: High-stakes scenario (conflict, failure, deadline pressure, or leadership).
4. **System Design / Architectural Problem**: End-to-end problem relevant to the company's domain.
5. **Impact & Prioritization / Situational**: How the candidate makes trade-offs between speed and quality.

### Output JSON Schema:
{
  "interviewQuestions": [
    {
      "id": 1,
      "type": "Technical Deep-Dive",
      "difficulty": "Medium-Hard",
      "question": "Can you walk through how you would architect...",
      "whyRecruiterAsks": "To evaluate your foundational understanding of...",
      "strategyGuide": "Start by stating requirements, discuss trade-offs between X and Y, and provide concrete numbers.",
      "starFramework": {
        "situation": "Define the challenge or business context.",
        "task": "Specify your exact responsibility.",
        "action": "Detail the technical steps taken (architecture, algorithms, tooling).",
        "result": "Quantifiable outcome and lessons learned."
      },
      "modelAnswer": "In my previous role at [Company/Project], we faced a challenge where... I resolved this by... resulting in...",
      "commonPitfalls": [
        "Being overly vague about individual contribution.",
        "Skipping discussion of alternative trade-offs."
      ]
    }
  ]
}

Return ONLY valid JSON.`;
}

/**
 * Builds the Practice Answer Evaluation prompt.
 */
export function buildAnswerEvaluationPrompt(question, userAnswer, jdText) {
  return `You are an executive interview coach. Evaluate the candidate's response to the interview question below.

### Job Context:
"""
${jdText.substring(0, 1000)}
"""

### Interview Question:
"${question}"

### Candidate's Answer:
"${userAnswer}"

### Output JSON Schema:
{
  "score": 85,
  "verdict": "Strong / Needs Improvement / Exceptional",
  "feedback": "2-3 sentences overview of how well the answer addressed the question.",
  "strengths": [
    "Clear mention of specific outcomes",
    "Good structured flow"
  ],
  "improvements": [
    "Could better emphasize the STAR 'Action' portion",
    "Include more domain metrics"
  ],
  "refinedAnswer": "An elevated, polished version of the candidate's answer retaining their authentic voice."
}

Return ONLY valid JSON.`;
}
