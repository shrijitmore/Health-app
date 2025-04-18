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
    const prompt = `You're a fitness and nutrition expert. Given a dish or list of ingredients "${foodName}", respond with the estimated calories, macro-nutrient split, and whether this dish supports a person's goal: bulking, cutting, or general health maintenance.

    Please analyze the nutritional content and provide the following information:
      1. Estimated calories per serving
      2. Protein content in grams per serving
      3. Carbohydrate content in grams per serving
      4. Fat content in grams per serving
      5. Categorize this food as either 'cutting' (good for weight loss - high protein, low calorie, low carb), 'bulking' (good for muscle gain - high protein, calorie dense), or 'general' (balanced nutrition)
      6. Brief reasoning for the category assignment (2-3 sentences max)
      
      IMPORTANT: Format your response ONLY as a valid JSON object with the following structure and nothing else:
      {
        "name": "${foodName}",
        "calories": number,
        "protein": number,
        "carbs": number,
        "fat": number,
        "category": "cutting" or "bulking" or "general",
        "reasoning": "brief explanation"
      }
      
      Do not include any text before or after the JSON. Do not include markdown formatting, code blocks, or any other text. Only return the JSON object itself. Be accurate but reasonable with your nutritional estimates.`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    try {
      // Try to extract JSON from the response if it's not pure JSON
      let jsonText = text;

      // Look for JSON object pattern in the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }

      const parsedResult = JSON.parse(jsonText);

      // Validate and sanitize the parsed result
      const sanitizedResult: GeminiFoodAnalysisResult = {
        name: parsedResult.name || foodName,
        calories: Number(parsedResult.calories) || 0,
        protein: Number(parsedResult.protein) || 0,
        carbs: Number(parsedResult.carbs) || 0,
        fat: Number(parsedResult.fat) || 0,
        category: ["cutting", "bulking", "general"].includes(
          parsedResult.category,
        )
          ? (parsedResult.category as "cutting" | "bulking" | "general")
          : "general",
        reasoning: parsedResult.reasoning || "No reasoning provided",
      };

      return sanitizedResult;
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", text);

      // Create a fallback response instead of throwing
      return {
        name: foodName,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        category: "general",
        reasoning:
          "Unable to analyze this food item. The AI model couldn't provide accurate nutritional information.",
      };
    }
  } catch (error) {
    console.error("Error analyzing food with Gemini:", error);
    throw error;
  }
}
