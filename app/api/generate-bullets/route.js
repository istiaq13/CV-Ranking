import { NextResponse } from "next/server";
import { getGeminiModel, parseGeminiJsonResponse } from "@/lib/gemini";
import { buildBulletSuggestionsPrompt } from "@/lib/prompts";
import { db } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      resumeText,
      jdText,
      targetRole = "",
      analysisId,
      apiKey,
      modelName = "gemini-2.0-flash",
    } = body;

    if (!resumeText || !resumeText.trim()) {
      return NextResponse.json(
        { success: false, error: "Resume text is required to generate tailored bullets." },
        { status: 400 }
      );
    }

    if (!jdText || !jdText.trim()) {
      return NextResponse.json(
        { success: false, error: "Job description is required to tailor bullet points." },
        { status: 400 }
      );
    }

    const model = getGeminiModel({
      apiKey,
      modelName,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.6,
      },
    });

    const prompt = buildBulletSuggestionsPrompt(resumeText, jdText, targetRole);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsed = parseGeminiJsonResponse(responseText);

    const tailoredBullets = Array.isArray(parsed.tailoredBullets)
      ? parsed.tailoredBullets
      : Array.isArray(parsed)
      ? parsed
      : [];

    if (analysisId) {
      try {
        await db.analysis.update({
          where: { id: analysisId },
          data: { tailoredBullets: JSON.stringify(tailoredBullets) },
        });
      } catch (dbErr) {
        console.warn("Failed to attach bullets to DB record:", dbErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      data: tailoredBullets,
    });
  } catch (error) {
    console.error("Generate bullets error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate tailored bullet points.",
      },
      { status: 500 }
    );
  }
}
