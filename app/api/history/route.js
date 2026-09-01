import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const item = await db.analysis.findUnique({ where: { id } });
      if (!item) {
        return NextResponse.json({ success: false, error: "Analysis record not found." }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: {
          ...item,
          matchedSkills: JSON.parse(item.matchedSkills || "[]"),
          missingSkills: JSON.parse(item.missingSkills || "[]"),
          suggestions: JSON.parse(item.suggestions || "[]"),
          tailoredBullets: item.tailoredBullets ? JSON.parse(item.tailoredBullets) : null,
          interviewQuestions: item.interviewQuestions ? JSON.parse(item.interviewQuestions) : null,
        },
      });
    }

    const items = await db.analysis.findMany({
      orderBy: { createdAt: "desc" },
      take: 25,
      select: {
        id: true,
        candidateName: true,
        targetRole: true,
        companyName: true,
        matchScore: true,
        hardSkillsScore: true,
        experienceScore: true,
        softSkillsScore: true,
        atsScore: true,
        summary: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("History GET error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve history." },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      await db.analysis.delete({ where: { id } });
      return NextResponse.json({ success: true, message: `Record ${id} deleted.` });
    }

    // Clear all
    await db.analysis.deleteMany();
    return NextResponse.json({ success: true, message: "All history records cleared." });
  } catch (error) {
    console.error("History DELETE error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete history record." },
      { status: 500 }
    );
  }
}
