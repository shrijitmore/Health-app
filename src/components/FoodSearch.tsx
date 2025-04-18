import React, { useState } from "react";
import { Search, Plus, Info, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  analyzeFoodWithGemini,
  GeminiFoodAnalysisResult,
} from "@/services/geminiService";

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category?: "cutting" | "bulking" | "general";
}

interface FoodSearchProps {
  onAddFood?: (food: FoodItem) => void;
}

const FoodSearch = ({ onAddFood = () => {} }: FoodSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<
    (FoodItem & { reasoning?: string }) | null
  >(null);
  const [aiAnalysisError, setAiAnalysisError] = useState<string | null>(null);

  // Mock food database
  const mockFoodDatabase: FoodItem[] = [
    {
      id: "1",
      name: "Chicken Breast",
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      category: "cutting",
    },
    {
      id: "2",
      name: "Brown Rice",
      calories: 216,
      protein: 5,
      carbs: 45,
      fat: 1.8,
      category: "general",
    },
    {
      id: "3",
      name: "Salmon",
      calories: 208,
      protein: 20,
      carbs: 0,
      fat: 13,
      category: "bulking",
    },
    {
      id: "4",
      name: "Avocado",
      calories: 240,
      protein: 3,
      carbs: 12,
      fat: 22,
      category: "bulking",
    },
    {
      id: "5",
      name: "Broccoli",
      calories: 55,
      protein: 3.7,
      carbs: 11,
      fat: 0.6,
      category: "cutting",
    },
    {
      id: "6",
      name: "Greek Yogurt",
      calories: 100,
      protein: 17,
      carbs: 6,
      fat: 0.4,
      category: "cutting",
    },
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const results = mockFoodDatabase.filter((food) =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      setSearchResults(results);
      setIsLoading(false);

      // If no results found, show AI analysis option
      if (results.length === 0) {
        setShowAIAnalysis(true);
      }
    }, 500);
  };

  const handleAIAnalysis = async () => {
    setIsLoading(true);
    setAiAnalysisError(null);

    try {
      // Call Gemini API for food analysis
      const geminiResult = await analyzeFoodWithGemini(searchQuery);

      // Check if we got a valid result with calories
      if (
        geminiResult.calories === 0 &&
        geminiResult.protein === 0 &&
        geminiResult.carbs === 0 &&
        geminiResult.fat === 0
      ) {
        // This is likely our fallback response
        throw new Error(
          geminiResult.reasoning || "Failed to analyze food properly",
        );
      }

      // Convert Gemini result to FoodItem format
      const aiResult: FoodItem & { reasoning?: string } = {
        id: `ai-${Date.now()}`,
        name: geminiResult.name,
        calories: geminiResult.calories,
        protein: geminiResult.protein,
        carbs: geminiResult.carbs,
        fat: geminiResult.fat,
        category: geminiResult.category,
        reasoning: geminiResult.reasoning,
      };

      setAiAnalysisResult(aiResult);
      setShowAIAnalysis(false);
    } catch (error) {
      console.error("Error during AI analysis:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to analyze food. Please try again.";
      setAiAnalysisError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFoodSelect = (food: FoodItem) => {
    setSelectedFood(food);
  };

  const handleAddFood = () => {
    if (selectedFood) {
      onAddFood(selectedFood);
      setSelectedFood(null);
    } else if (aiAnalysisResult) {
      onAddFood(aiAnalysisResult);
      setAiAnalysisResult(null);
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "cutting":
        return "bg-green-100 text-green-800";
      case "bulking":
        return "bg-blue-100 text-blue-800";
      case "general":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryDescription = (category?: string) => {
    switch (category) {
      case "cutting":
        return "Good for weight loss - high protein, low calorie";
      case "bulking":
        return "Good for muscle gain - calorie dense, high protein";
      case "general":
        return "Good for general health and maintenance";
      default:
        return "Nutritional information";
    }
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Food Search</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search for a food item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? "Searching..." : <Search className="h-4 w-4" />}
          </Button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Search Results</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {searchResults.map((food) => (
                <div
                  key={food.id}
                  className="p-3 border rounded-md cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                  onClick={() => handleFoodSelect(food)}
                >
                  <div>
                    <div className="font-medium">{food.name}</div>
                    <div className="text-sm text-gray-500">
                      {food.calories} kcal
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(food.category)}>
                      {food.category || "general"}
                    </Badge>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            P: {food.protein}g | C: {food.carbs}g | F:{" "}
                            {food.fat}g
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Analysis Result */}
        {aiAnalysisResult && (
          <div className="mt-4 p-4 border rounded-md bg-blue-50">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-amber-500" /> Gemini AI Analysis
            </h3>
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{aiAnalysisResult.name}</div>
                <div className="text-sm">{aiAnalysisResult.calories} kcal</div>
                <div className="text-xs text-gray-600 mt-1">
                  Protein: {aiAnalysisResult.protein}g | Carbs:{" "}
                  {aiAnalysisResult.carbs}g | Fat: {aiAnalysisResult.fat}g
                </div>
                {aiAnalysisResult.reasoning && (
                  <div className="text-xs text-gray-600 mt-2 max-w-xs">
                    <span className="font-medium">
                      Why {aiAnalysisResult.category}:
                    </span>{" "}
                    {aiAnalysisResult.reasoning}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Badge className={getCategoryColor(aiAnalysisResult.category)}>
                  {aiAnalysisResult.category || "general"}
                </Badge>
                <Button size="sm" onClick={handleAddFood}>
                  <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* AI Analysis Error */}
        {aiAnalysisError && (
          <div className="mt-4 p-4 border rounded-md bg-red-50 text-red-800">
            <p className="text-sm">{aiAnalysisError}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => {
                setAiAnalysisError(null);
                setShowAIAnalysis(true);
              }}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* No Results Found */}
        {searchResults.length === 0 &&
          !isLoading &&
          searchQuery &&
          !aiAnalysisResult && (
            <div className="mt-4 p-4 border rounded-md bg-gray-50 text-center">
              <p className="text-gray-600 mb-2">No food found with that name</p>
              {showAIAnalysis && (
                <Button
                  onClick={handleAIAnalysis}
                  variant="outline"
                  disabled={isLoading}
                  className="flex items-center gap-1"
                >
                  {isLoading ? (
                    "Analyzing..."
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      Analyze with Gemini AI
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
      </CardContent>

      {/* Food Details Dialog */}
      {selectedFood && (
        <Dialog
          open={!!selectedFood}
          onOpenChange={(open) => !open && setSelectedFood(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedFood.name}</DialogTitle>
              <DialogDescription>
                {getCategoryDescription(selectedFood.category)}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium">Calories</span>
                <span className="text-2xl font-bold">
                  {selectedFood.calories}
                </span>
                <span className="text-xs text-gray-500">kcal</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col">
                  <span className="text-xs font-medium">Protein</span>
                  <span className="text-lg font-bold">
                    {selectedFood.protein}g
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium">Carbs</span>
                  <span className="text-lg font-bold">
                    {selectedFood.carbs}g
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium">Fat</span>
                  <span className="text-lg font-bold">{selectedFood.fat}g</span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleAddFood}>
                <Plus className="h-4 w-4 mr-2" /> Add to Daily Log
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default FoodSearch;
