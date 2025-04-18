import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ThumbsUp, ThumbsDown, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MealEvaluationProps {
  mealData: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    category: "cutting" | "bulking" | "general";
    reasoning?: string;
  };
  userGoal?: "cutting" | "bulking" | "maintenance";
}

const MealEvaluation = ({
  mealData,
  userGoal = "maintenance",
}: MealEvaluationProps) => {
  const isAlignedWithGoal = () => {
    if (userGoal === "maintenance") return true;
    if (userGoal === "cutting" && mealData.category === "cutting") return true;
    if (userGoal === "bulking" && mealData.category === "bulking") return true;
    return false;
  };

  const getCategoryColor = (category: string) => {
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

  const getGoalMessage = () => {
    if (isAlignedWithGoal()) {
      return {
        icon: <ThumbsUp className="h-4 w-4 text-green-600" />,
        message: `Good for ${userGoal}!`,
        color: "text-green-600",
      };
    } else {
      return {
        icon: <ThumbsDown className="h-4 w-4 text-amber-600" />,
        message: `Not ideal for ${userGoal}`,
        color: "text-amber-600",
      };
    }
  };

  const goalFeedback = getGoalMessage();

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Meal Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg">{mealData.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getCategoryColor(mealData.category)}>
                  {mealData.category}
                </Badge>
                <span className="text-sm font-medium">
                  {mealData.calories} calories
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {goalFeedback.icon}
              <span className={`text-sm font-medium ${goalFeedback.color}`}>
                {goalFeedback.message}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 bg-gray-50 p-3 rounded-md">
            <div className="text-center">
              <p className="text-xs text-gray-500">Protein</p>
              <p className="font-medium">{mealData.protein}g</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Carbs</p>
              <p className="font-medium">{mealData.carbs}g</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Fat</p>
              <p className="font-medium">{mealData.fat}g</p>
            </div>
          </div>

          {mealData.reasoning && (
            <div className="text-sm">
              <div className="flex items-center gap-1 mb-1">
                <Info className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Analysis</span>
              </div>
              <p className="text-gray-600">{mealData.reasoning}</p>
            </div>
          )}

          {!isAlignedWithGoal() && (
            <div className="bg-amber-50 p-3 rounded-md">
              <p className="text-sm font-medium text-amber-800 mb-1">
                Recommendation
              </p>
              <p className="text-sm text-amber-700">
                {userGoal === "cutting"
                  ? "Consider options with fewer calories and carbs, but higher protein."
                  : "Consider options with more calories and protein to support muscle growth."}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MealEvaluation;
