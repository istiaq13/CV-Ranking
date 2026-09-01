import { NextResponse } from "next/server";
import { extractTextFromFile } from "@/lib/pdfParser";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, error: "No file was provided in the upload request." },
        { status: 400 }
      );
    }

    const fileName = file.name || "resume.pdf";
    const mimeType = file.type || "";
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length === 0) {
      return NextResponse.json(
        { success: false, error: "Uploaded file is empty (0 bytes)." },
        { status: 400 }
      );
    }

    // Limit to 10MB
    if (buffer.length > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "File size exceeds the 10MB limit." },
        { status: 400 }
      );
    }

    const extractedText = await extractTextFromFile(buffer, fileName, mimeType);
    const wordCount = extractedText.split(/\s+/).filter(Boolean).length;
    const charCount = extractedText.length;

    return NextResponse.json({
      success: true,
      fileName,
      mimeType,
      fileSizeBytes: buffer.length,
      wordCount,
      charCount,
      text: extractedText,
    });
  } catch (error) {
    console.error("Resume extraction failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process and parse uploaded resume file.",
      },
      { status: 500 }
    );
  }
}
