import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface MacroNutrient {
  name: string;
  consumed: number;
  goal: number;
  color: string;
}

interface DashboardSummaryProps {
  caloriesConsumed?: number;
  caloriesGoal?: number;
  macros?: MacroNutrient[];
  fitnessGoal?: "cutting" | "bulking" | "maintenance";
}

const DashboardSummary = ({
  caloriesConsumed = 1250,
  caloriesGoal = 2000,
  macros = [
    { name: "Protein", consumed: 75, goal: 120, color: "bg-blue-500" },
    { name: "Carbs", consumed: 150, goal: 200, color: "bg-green-500" },
    { name: "Fat", consumed: 40, goal: 65, color: "bg-yellow-500" },
  ],
  fitnessGoal = "cutting",
}: DashboardSummaryProps) => {
  const caloriesRemaining = caloriesGoal - caloriesConsumed;
  const caloriesPercentage = Math.min(
    Math.round((caloriesConsumed / caloriesGoal) * 100),
    100,
  );

  const goalColorMap = {
    cutting: "bg-purple-100 text-purple-800",
    bulking: "bg-blue-100 text-blue-800",
    maintenance: "bg-green-100 text-green-800",
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Daily Summary</h2>
          <p className="text-gray-500">Today's nutrition progress</p>
        </div>
        <Badge
          className={`${goalColorMap[fitnessGoal]} mt-2 md:mt-0 px-3 py-1 text-sm font-medium`}
        >
          Goal: {fitnessGoal.charAt(0).toUpperCase() + fitnessGoal.slice(1)}
        </Badge>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h3 className="text-lg font-medium text-gray-700">Calories</h3>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                <span className="text-3xl font-bold text-gray-900">
                  {caloriesConsumed}
                </span>
                <span className="text-gray-500">/ {caloriesGoal}</span>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-700">Remaining</h3>
              <span
                className={`text-3xl font-bold ${caloriesRemaining >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {caloriesRemaining}
              </span>
            </div>
          </div>

          <Progress value={caloriesPercentage} className="h-3 mt-2" />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>0%</span>
            <span>{caloriesPercentage}%</span>
            <span>100%</span>
          </div>
        </CardContent>
      </Card>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Macronutrients
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {macros.map((macro, index) => {
          const percentage = Math.min(
            Math.round((macro.consumed / macro.goal) * 100),
            100,
          );
          return (
            <Card key={index} className="overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-700">{macro.name}</h4>
                  <span className="text-sm text-gray-500">{percentage}%</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold">{macro.consumed}g</span>
                  <span className="text-gray-500 text-sm">/ {macro.goal}g</span>
                </div>
                <Progress value={percentage} className={`h-2 ${macro.color}`} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardSummary;
