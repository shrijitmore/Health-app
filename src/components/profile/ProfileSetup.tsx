import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, updateUserProfile } from "@/services/firebaseService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ProfileSetup = () => {
  const [fitnessGoal, setFitnessGoal] = useState<
    "cutting" | "bulking" | "maintenance"
  >("maintenance");
  const [caloriesGoal, setCaloriesGoal] = useState(2000);
  const [protein, setProtein] = useState(120);
  const [carbs, setCarbs] = useState(200);
  const [fat, setFat] = useState(65);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No user is signed in");
      }

      await updateUserProfile(user.uid, {
        fitnessGoal,
        caloriesGoal,
        macros: {
          protein,
          carbs,
          fat,
        },
        setupCompleted: true,
      });

      navigate("/");
    } catch (err: any) {
      console.error("Profile setup error:", err);
      setError(err.message || "Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Preset macros based on fitness goal
  const handleFitnessGoalChange = (
    value: "cutting" | "bulking" | "maintenance",
  ) => {
    setFitnessGoal(value);

    // Set default values based on goal
    switch (value) {
      case "cutting":
        setCaloriesGoal(1800);
        setProtein(150);
        setCarbs(150);
        setFat(50);
        break;
      case "bulking":
        setCaloriesGoal(2500);
        setProtein(180);
        setCarbs(300);
        setFat(70);
        break;
      case "maintenance":
        setCaloriesGoal(2000);
        setProtein(120);
        setCarbs(200);
        setFat(65);
        break;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Set Your Fitness Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label>What is your fitness goal?</Label>
              <RadioGroup
                value={fitnessGoal}
                onValueChange={(value) =>
                  handleFitnessGoalChange(
                    value as "cutting" | "bulking" | "maintenance",
                  )
                }
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cutting" id="cutting" />
                  <Label htmlFor="cutting" className="font-normal">
                    Cutting (Weight Loss)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bulking" id="bulking" />
                  <Label htmlFor="bulking" className="font-normal">
                    Bulking (Muscle Gain)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="maintenance" id="maintenance" />
                  <Label htmlFor="maintenance" className="font-normal">
                    Maintenance
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="caloriesGoal">Daily Calorie Goal</Label>
              <Input
                id="caloriesGoal"
                type="number"
                value={caloriesGoal}
                onChange={(e) => setCaloriesGoal(parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Macronutrient Goals (grams)</Label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="protein" className="text-sm">
                    Protein
                  </Label>
                  <Input
                    id="protein"
                    type="number"
                    value={protein}
                    onChange={(e) => setProtein(parseInt(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="carbs" className="text-sm">
                    Carbs
                  </Label>
                  <Input
                    id="carbs"
                    type="number"
                    value={carbs}
                    onChange={(e) => setCarbs(parseInt(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="fat" className="text-sm">
                    Fat
                  </Label>
                  <Input
                    id="fat"
                    type="number"
                    value={fat}
                    onChange={(e) => setFat(parseInt(e.target.value))}
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save and Continue"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            You can always change these settings later
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileSetup;
