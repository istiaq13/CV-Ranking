import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Initializes and returns a configured Gemini Generative Model instance.
 *
 * @param {Object} options
 * @param {string} [options.apiKey]
 * @param {string} [options.modelName]
 * @param {Object} [options.generationConfig]
 * @returns {import("@google/generative-ai").GenerativeModel}
 */
export function getGeminiModel({
  apiKey,
  modelName = "gemini-2.0-flash",
  generationConfig = {},
} = {}) {
  const key = apiKey?.trim() || process.env.GEMINI_API_KEY?.trim();

  if (!key) {
    throw new Error(
      "Missing Gemini API Key. Please provide your API key in the in-app Settings modal or set GEMINI_API_KEY in your .env.local file."
    );
  }

  const genAI = new GoogleGenerativeAI(key);
  const targetModel = modelName?.trim() || process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash";

  return genAI.getGenerativeModel({
    model: targetModel,
    generationConfig: {
      temperature: 0.2,
      ...generationConfig,
    },
  });
}

/**
 * Safely parses JSON string returned from Gemini (handles optional markdown code blocks).
 *
 * @param {string} text
 * @returns {any}
 */
export function parseGeminiJsonResponse(text) {
  if (!text) throw new Error("Empty response from AI model.");

  let clean = text.trim();

  // Strip markdown code fences if present: ```json ... ``` or ``` ... ```
  if (clean.startsWith("```")) {
    clean = clean.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }

  try {
    return JSON.parse(clean);
  } catch (err) {
    console.error("Failed to parse JSON response from Gemini. Raw text:", text);
    // Attempt relaxed regex extraction for json object or array
    const jsonMatch = clean.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (innerErr) {
        throw new Error("Could not parse AI response as valid JSON.");
      }
    }
    throw new Error("Model response was not valid JSON format.");
  }
}
