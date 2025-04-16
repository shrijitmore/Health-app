import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with the API key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Create a client instance
const genAI = new GoogleGenerativeAI(API_KEY);

// Interface for food analysis results
export interface GeminiFoodAnalysisResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: "cutting" | "bulking" | "general";
  reasoning: string;
}

/**
 * Analyzes a food item using Gemini API
 * @param foodName The name of the food to analyze
 * @returns Promise with the analyzed food data
 */
export async function analyzeFoodWithGemini(
  foodName: string,
): Promise<GeminiFoodAnalysisResult> {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Construct the prompt for food analysis
    const prompt = `Analyze the nutritional content of ${foodName}. Provide the following information:
      1. Estimated calories per 100g
      2. Protein content in grams per 100g
      3. Carbohydrate content in grams per 100g
      4. Fat content in grams per 100g
      5. Categorize this food as either 'cutting' (good for weight loss), 'bulking' (good for muscle gain), or 'general' (balanced nutrition)
      6. Brief reasoning for the category assignment
      
      Format your response as a JSON object with the following structure:
      {
        "name": "${foodName}",
        "calories": number,
        "protein": number,
        "carbs": number,
        "fat": number,
        "category": "cutting" or "bulking" or "general",
        "reasoning": "brief explanation"
      }
      
      Only return the JSON object, nothing else.`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    try {
      const parsedResult = JSON.parse(text);
      return parsedResult as GeminiFoodAnalysisResult;
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", text);
      throw new Error("Failed to parse Gemini response");
    }
  } catch (error) {
    console.error("Error analyzing food with Gemini:", error);
    throw error;
  }
}
