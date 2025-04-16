import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardSummary from "./DashboardSummary";
import FoodSearch from "./FoodSearch";
import FoodRecommendations from "./FoodRecommendations";
import ProgressCharts from "./ProgressCharts";
import { UserIcon, Settings2Icon } from "lucide-react";
import { Button } from "./ui/button";

const Home = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Calorie Counter</h1>
          <p className="text-muted-foreground">
            Track your nutrition with AI-powered insights
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <Settings2Icon className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <UserIcon className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Dashboard Summary */}
      <div className="mb-8">
        <DashboardSummary />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Food Search */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Food Search & Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <FoodSearch />
          </CardContent>
        </Card>

        {/* Right Column - Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <FoodRecommendations />
          </CardContent>
        </Card>
      </div>

      {/* Progress Charts */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Progress Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="calories">
              <TabsList className="mb-4">
                <TabsTrigger value="calories">Calories</TabsTrigger>
                <TabsTrigger value="macros">Macronutrients</TabsTrigger>
                <TabsTrigger value="weekly">Weekly Summary</TabsTrigger>
              </TabsList>
              <TabsContent value="calories">
                <ProgressCharts chartType="calories" />
              </TabsContent>
              <TabsContent value="macros">
                <ProgressCharts chartType="macros" />
              </TabsContent>
              <TabsContent value="weekly">
                <ProgressCharts chartType="weekly" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>Calorie Counter with AI Food Recommendations © 2023</p>
      </footer>
    </div>
  );
};

export default Home;
