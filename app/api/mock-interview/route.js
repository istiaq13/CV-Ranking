import { NextResponse } from "next/server";
import { getGeminiModel, parseGeminiJsonResponse } from "@/lib/gemini";
import { buildMockInterviewPrompt, buildAnswerEvaluationPrompt } from "@/lib/prompts";
import { db } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      action,
      resumeText,
      jdText,
      targetRole = "",
      missingSkills = [],
      question,
      userAnswer,
      analysisId,
      apiKey,
      modelName = "gemini-2.0-flash",
    } = body;

    // Sub-feature: Live Answer Evaluation & AI Coaching
    if (action === "evaluate-answer") {
      if (!question || !userAnswer) {
        return NextResponse.json(
          { success: false, error: "Both question and candidate answer are required for evaluation." },
          { status: 400 }
        );
      }

      const model = getGeminiModel({
        apiKey,
        modelName,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      });

      const prompt = buildAnswerEvaluationPrompt(question, userAnswer, jdText || "");
      const result = await model.generateContent(prompt);
      const feedback = parseGeminiJsonResponse(result.response.text());

      return NextResponse.json({
        success: true,
        data: feedback,
      });
    }

    // Default action: Generate 5 Tailored Interview Questions
    if (!resumeText || !jdText) {
      return NextResponse.json(
        { success: false, error: "Both resume text and job description are required to create interview questions." },
        { status: 400 }
      );
    }

    const model = getGeminiModel({
      apiKey,
      modelName,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4,
      },
    });

    const prompt = buildMockInterviewPrompt(resumeText, jdText, targetRole, missingSkills);
    const result = await model.generateContent(prompt);
    const parsed = parseGeminiJsonResponse(result.response.text());

    const interviewQuestions = Array.isArray(parsed.interviewQuestions)
      ? parsed.interviewQuestions
      : Array.isArray(parsed)
      ? parsed
      : [];

    if (analysisId) {
      try {
        await db.analysis.update({
          where: { id: analysisId },
          data: { interviewQuestions: JSON.stringify(interviewQuestions) },
        });
      } catch (dbErr) {
        console.warn("Failed to attach interview questions to DB record:", dbErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      data: interviewQuestions,
    });
  } catch (error) {
    console.error("Mock interview API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate mock interview questions.",
      },
      { status: 500 }
    );
  }
}
