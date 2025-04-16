import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Utensils, Dumbbell, Leaf, ChevronRight } from "lucide-react";

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: "cutting" | "bulking" | "health";
  imageUrl: string;
}

interface FoodRecommendationsProps {
  remainingCalories?: number;
  fitnessGoal?: "cutting" | "bulking" | "health";
  onSelectFood?: (food: FoodItem) => void;
}

const FoodRecommendations: React.FC<FoodRecommendationsProps> = ({
  remainingCalories = 800,
  fitnessGoal = "cutting",
  onSelectFood = () => {},
}) => {
  const [activeTab, setActiveTab] = useState<string>(fitnessGoal);

  // Mock data for food recommendations
  const mockRecommendations: Record<string, FoodItem[]> = {
    cutting: [
      {
        id: "1",
        name: "Grilled Chicken Salad",
        calories: 320,
        protein: 35,
        carbs: 12,
        fat: 14,
        category: "cutting",
        imageUrl:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80",
      },
      {
        id: "2",
        name: "Salmon with Steamed Vegetables",
        calories: 380,
        protein: 32,
        carbs: 15,
        fat: 18,
        category: "cutting",
        imageUrl:
          "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&q=80",
      },
      {
        id: "3",
        name: "Greek Yogurt with Berries",
        calories: 220,
        protein: 18,
        carbs: 24,
        fat: 5,
        category: "cutting",
        imageUrl:
          "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&q=80",
      },
    ],
    bulking: [
      {
        id: "4",
        name: "Protein Smoothie with Banana",
        calories: 450,
        protein: 30,
        carbs: 55,
        fat: 10,
        category: "bulking",
        imageUrl:
          "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=300&q=80",
      },
      {
        id: "5",
        name: "Steak with Sweet Potato",
        calories: 580,
        protein: 40,
        carbs: 45,
        fat: 22,
        category: "bulking",
        imageUrl:
          "https://images.unsplash.com/photo-1544025162-d76694265947?w=300&q=80",
      },
      {
        id: "6",
        name: "Peanut Butter Oatmeal",
        calories: 520,
        protein: 20,
        carbs: 65,
        fat: 18,
        category: "bulking",
        imageUrl:
          "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=300&q=80",
      },
    ],
    health: [
      {
        id: "7",
        name: "Quinoa Bowl with Avocado",
        calories: 380,
        protein: 15,
        carbs: 45,
        fat: 16,
        category: "health",
        imageUrl:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80",
      },
      {
        id: "8",
        name: "Mediterranean Salad",
        calories: 310,
        protein: 12,
        carbs: 30,
        fat: 15,
        category: "health",
        imageUrl:
          "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&q=80",
      },
      {
        id: "9",
        name: "Vegetable Soup with Lentils",
        calories: 250,
        protein: 14,
        carbs: 35,
        fat: 5,
        category: "health",
        imageUrl:
          "https://images.unsplash.com/photo-1547592180-85f173990554?w=300&q=80",
      },
    ],
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "cutting":
        return <Leaf className="h-4 w-4" />;
      case "bulking":
        return <Dumbbell className="h-4 w-4" />;
      case "health":
        return <Utensils className="h-4 w-4" />;
      default:
        return <Utensils className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "cutting":
        return "bg-green-100 text-green-800";
      case "bulking":
        return "bg-blue-100 text-blue-800";
      case "health":
        return "bg-purple-100 text-purple-800";
      default:
        return "";
    }
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Utensils className="h-5 w-5" />
          Food Recommendations
        </CardTitle>
        <CardDescription>
          Based on your remaining {remainingCalories} calories and {fitnessGoal}{" "}
          goal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cutting" className="flex items-center gap-1">
              <Leaf className="h-4 w-4" /> Cutting
            </TabsTrigger>
            <TabsTrigger value="bulking" className="flex items-center gap-1">
              <Dumbbell className="h-4 w-4" /> Bulking
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center gap-1">
              <Utensils className="h-4 w-4" /> Health
            </TabsTrigger>
          </TabsList>

          {Object.keys(mockRecommendations).map((category) => (
            <TabsContent key={category} value={category} className="mt-4">
              <ScrollArea className="h-[320px] pr-4">
                <div className="space-y-4">
                  {mockRecommendations[category].map((food) => (
                    <div
                      key={food.id}
                      className="flex items-start gap-3 p-3 rounded-lg border hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => onSelectFood(food)}
                    >
                      <img
                        src={food.imageUrl}
                        alt={food.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{food.name}</h3>
                          <Badge
                            variant="outline"
                            className={getCategoryColor(food.category)}
                          >
                            {food.category}
                          </Badge>
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          <div className="flex justify-between">
                            <span>{food.calories} kcal</span>
                          </div>
                          <div className="grid grid-cols-3 gap-1 mt-1">
                            <span>P: {food.protein}g</span>
                            <span>C: {food.carbs}g</span>
                            <span>F: {food.fat}g</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-sm text-gray-500">AI-powered recommendations</p>
        <Button variant="ghost" size="sm" className="gap-1">
          View all <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FoodRecommendations;
