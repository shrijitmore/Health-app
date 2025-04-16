import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProgressChartsProps {
  calorieData?: {
    dates: string[];
    values: number[];
  };
  macroData?: {
    protein: number[];
    carbs: number[];
    fat: number[];
    dates: string[];
  };
  goalProgress?: {
    current: number;
    target: number;
    type: "cutting" | "bulking" | "maintaining";
  };
}

const ProgressCharts = ({
  calorieData = {
    dates: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [1800, 2100, 1950, 2200, 1700, 2300, 2000],
  },
  macroData = {
    protein: [120, 130, 125, 140, 110, 150, 135],
    carbs: [180, 210, 195, 220, 170, 230, 200],
    fat: [60, 70, 65, 75, 55, 80, 70],
    dates: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  goalProgress = {
    current: 75,
    target: 100,
    type: "cutting",
  },
}: ProgressChartsProps) => {
  const [timeRange, setTimeRange] = useState("week");

  // Mock chart rendering with divs for demonstration
  const renderCalorieChart = () => {
    const maxCalorie = Math.max(...calorieData.values);
    return (
      <div className="mt-4 h-48 w-full bg-background">
        <div className="flex h-full items-end justify-between gap-1 px-2">
          {calorieData.values.map((value, index) => {
            const height = `${(value / maxCalorie) * 100}%`;
            return (
              <div
                key={index}
                className="group relative flex w-full flex-col items-center"
              >
                <div className="tooltip absolute -top-8 hidden rounded bg-primary px-2 py-1 text-xs text-primary-foreground group-hover:block">
                  {value} cal
                </div>
                <div
                  className="w-full rounded-t bg-primary hover:bg-primary/80 transition-all"
                  style={{ height }}
                ></div>
                <span className="mt-1 text-xs text-muted-foreground">
                  {calorieData.dates[index]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMacroChart = () => {
    return (
      <div className="mt-4 h-48 w-full bg-background">
        <div className="flex h-full flex-col justify-between gap-2">
          {macroData.dates.map((date, index) => (
            <div key={index} className="flex h-8 items-center gap-2">
              <span className="w-8 text-xs text-muted-foreground">{date}</span>
              <div className="flex h-6 w-full overflow-hidden rounded-full">
                <div
                  className="bg-blue-500 h-full"
                  style={{
                    width: `${(macroData.protein[index] / (macroData.protein[index] + macroData.carbs[index] + macroData.fat[index])) * 100}%`,
                  }}
                  title={`Protein: ${macroData.protein[index]}g`}
                ></div>
                <div
                  className="bg-green-500 h-full"
                  style={{
                    width: `${(macroData.carbs[index] / (macroData.protein[index] + macroData.carbs[index] + macroData.fat[index])) * 100}%`,
                  }}
                  title={`Carbs: ${macroData.carbs[index]}g`}
                ></div>
                <div
                  className="bg-yellow-500 h-full"
                  style={{
                    width: `${(macroData.fat[index] / (macroData.protein[index] + macroData.carbs[index] + macroData.fat[index])) * 100}%`,
                  }}
                  title={`Fat: ${macroData.fat[index]}g`}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-center gap-4">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
            <span className="text-xs">Protein</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="text-xs">Carbs</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs">Fat</span>
          </div>
        </div>
      </div>
    );
  };

  const renderGoalProgress = () => {
    const progressPercentage =
      (goalProgress.current / goalProgress.target) * 100;
    let progressColor = "bg-blue-500";

    if (goalProgress.type === "cutting") {
      progressColor = "bg-green-500";
    } else if (goalProgress.type === "bulking") {
      progressColor = "bg-orange-500";
    }

    return (
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {goalProgress.type.charAt(0).toUpperCase() +
              goalProgress.type.slice(1)}{" "}
            Progress
          </span>
          <span className="text-sm text-muted-foreground">
            {goalProgress.current}/{goalProgress.target}
          </span>
        </div>
        <div className="h-4 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full ${progressColor} transition-all`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-muted-foreground">
          {progressPercentage >= 100
            ? "Goal achieved! 🎉"
            : `${Math.round(progressPercentage)}% of your ${goalProgress.type} goal completed`}
        </p>
      </div>
    );
  };

  return (
    <Card className="w-full bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Progress Tracking</CardTitle>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="calories">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calories">Calories</TabsTrigger>
            <TabsTrigger value="macros">Macros</TabsTrigger>
            <TabsTrigger value="goals">Goal Progress</TabsTrigger>
          </TabsList>
          <TabsContent value="calories">
            <h3 className="text-md font-medium">Daily Calorie Intake</h3>
            {renderCalorieChart()}
          </TabsContent>
          <TabsContent value="macros">
            <h3 className="text-md font-medium">Macronutrient Distribution</h3>
            {renderMacroChart()}
          </TabsContent>
          <TabsContent value="goals">
            <h3 className="text-md font-medium">Fitness Goal Progress</h3>
            {renderGoalProgress()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProgressCharts;
