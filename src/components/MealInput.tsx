import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Utensils, Sparkles } from "lucide-react";
import { analyzeFoodWithGemini } from "@/services/geminiService";

interface MealInputProps {
  onMealAnalyzed: (mealData: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    category: "cutting" | "bulking" | "general";
    reasoning?: string;
  }) => void;
}

const MealInput = ({ onMealAnalyzed }: MealInputProps) => {
  const [mealInput, setMealInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzeMeal = async () => {
    if (!mealInput.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Call Gemini API for food analysis
      const geminiResult = await analyzeFoodWithGemini(mealInput);

      // Pass the analyzed data to parent component
      onMealAnalyzed({
        name: geminiResult.name,
        calories: geminiResult.calories,
        protein: geminiResult.protein,
        carbs: geminiResult.carbs,
        fat: geminiResult.fat,
        category: geminiResult.category,
        reasoning: geminiResult.reasoning,
      });

      // Clear the input after successful analysis
      setMealInput("");
    } catch (error) {
      console.error("Error analyzing meal:", error);
      setError("Failed to analyze meal. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Utensils className="h-5 w-5" />
          Quick Meal Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter a dish name or ingredients..."
              value={mealInput}
              onChange={(e) => setMealInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyzeMeal()}
              className="flex-1"
            />
            <Button
              onClick={handleAnalyzeMeal}
              disabled={isAnalyzing || !mealInput.trim()}
              className="flex items-center gap-1"
            >
              {isAnalyzing ? (
                "Analyzing..."
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Enter any dish or list of ingredients to get instant AI-powered
            nutritional analysis
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MealInput;
