import mammoth from "mammoth";

/**
 * Extracts clean text from an uploaded file buffer based on MIME type or extension.
 * Supports PDF, DOCX, and plain text formats.
 *
 * @param {Buffer} buffer
 * @param {string} fileName
 * @param {string} mimeType
 * @returns {Promise<string>}
 */
export async function extractTextFromFile(buffer, fileName = "", mimeType = "") {
  const extension = fileName.toLowerCase().split(".").pop();

  if (extension === "pdf" || mimeType.includes("pdf")) {
    try {
      // Dynamic require to prevent bundling quirks with pdf-parse in Next.js edge/server
      const pdfParse = require("pdf-parse");
      const pdfData = await pdfParse(buffer);
      const cleaned = cleanExtractedText(pdfData.text || "");
      if (!cleaned.trim()) {
        throw new Error("The PDF file appears to be empty or contains scanned images without selectable text.");
      }
      return cleaned;
    } catch (err) {
      console.error("PDF Parsing error:", err);
      throw new Error(`Failed to parse PDF: ${err.message || "Unknown error"}`);
    }
  }

  if (extension === "docx" || mimeType.includes("wordprocessingml") || mimeType.includes("docx")) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      const cleaned = cleanExtractedText(result.value || "");
      if (!cleaned.trim()) {
        throw new Error("The DOCX file contains no extractable text.");
      }
      return cleaned;
    } catch (err) {
      console.error("DOCX Parsing error:", err);
      throw new Error(`Failed to parse DOCX: ${err.message || "Unknown error"}`);
    }
  }

  if (extension === "doc" || mimeType.includes("msword")) {
    throw new Error("Old binary .doc format is not supported. Please save or export your resume as .docx or .pdf.");
  }

  // Fallback for TXT, MD, or raw text files
  try {
    const raw = buffer.toString("utf-8");
    return cleanExtractedText(raw);
  } catch (err) {
    throw new Error("Unable to read file as plain text.");
  }
}

/**
 * Cleans and normalizes extracted resume text.
 */
export function cleanExtractedText(text) {
  if (!text) return "";
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[ \u00A0]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
