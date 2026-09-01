import { NextResponse } from "next/server";
import { getGeminiModel, parseGeminiJsonResponse } from "@/lib/gemini";
import { buildAnalysisPrompt } from "@/lib/prompts";
import { db } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { resumeText, jdText, apiKey, modelName = "gemini-2.0-flash", saveToDb = true } = body;

    if (!resumeText || !resumeText.trim()) {
      return NextResponse.json(
        { success: false, error: "Candidate Resume text is required." },
        { status: 400 }
      );
    }

    if (!jdText || !jdText.trim()) {
      return NextResponse.json(
        { success: false, error: "Job Description text is required." },
        { status: 400 }
      );
    }

    // Call Gemini API with JSON enforcement
    const model = getGeminiModel({
      apiKey,
      modelName,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const prompt = buildAnalysisPrompt(resumeText, jdText);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const analysisData = parseGeminiJsonResponse(responseText);

    // Normalize analysis schema values
    const matchScore = Math.min(100, Math.max(0, Number(analysisData.matchScore) || 75));
    const hardSkillsScore = Math.min(100, Math.max(0, Number(analysisData.hardSkillsScore) || matchScore));
    const experienceScore = Math.min(100, Math.max(0, Number(analysisData.experienceScore) || matchScore));
    const softSkillsScore = Math.min(100, Math.max(0, Number(analysisData.softSkillsScore) || matchScore));
    const atsScore = Math.min(100, Math.max(0, Number(analysisData.atsScore) || matchScore));
    const candidateName = analysisData.candidateName || "Candidate";
    const targetRole = analysisData.targetRole || "Target Position";
    const companyName = analysisData.companyName || null;
    const summary = analysisData.summary || "Comprehensive analysis completed.";
    const matchedSkills = analysisData.matchedSkills || [];
    const missingSkills = analysisData.missingSkills || [];
    const improvementSuggestions = analysisData.improvementSuggestions || [];
    const keyStrengths = analysisData.keyStrengths || [];
    const atsOptimization = analysisData.atsOptimization || null;

    let savedRecord = null;
    if (saveToDb) {
      try {
        savedRecord = await db.analysis.create({
          data: {
            candidateName,
            targetRole,
            companyName,
            matchScore,
            hardSkillsScore,
            experienceScore,
            softSkillsScore,
            atsScore,
            summary,
            matchedSkills: JSON.stringify(matchedSkills),
            missingSkills: JSON.stringify(missingSkills),
            suggestions: JSON.stringify(improvementSuggestions),
            resumeText: resumeText.substring(0, 8000),
            jdText: jdText.substring(0, 8000),
          },
        });
      } catch (dbErr) {
        console.warn("Could not persist analysis to SQLite history:", dbErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: savedRecord ? savedRecord.id : undefined,
        candidateName,
        targetRole,
        companyName,
        matchScore,
        hardSkillsScore,
        experienceScore,
        softSkillsScore,
        atsScore,
        summary,
        keyStrengths,
        matchedSkills,
        missingSkills,
        improvementSuggestions,
        atsOptimization,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Analysis route error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process resume analysis.",
      },
      { status: 500 }
    );
  }
}
