"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, imperialToMetric } from "@/lib/utils";
import {
  SetMeasurement,
  setMeasurement,
} from "../data/progress/progress.service";
import { useUserContext } from "../context";
import { z } from "zod";

const heightSchema = z.object({
  metric: z.string().regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
  imperialFeet: z.string().regex(/^\d+$/, "Feet must be a whole number"),
  imperialInches: z.string().regex(/^\d+$/, "Inches must be a whole number"),
});

export default function HeightWeight() {
  const user = useUserContext();
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [height, setHeight] = useState("");
  const [heightInches, setHeightInches] = useState("");

  const handleUnitChange = (value: "metric" | "imperial") => {
    setUnit(value);
    setHeight("");
    setHeightInches("");
  };

  const submit = () => {
    let metricHeight = Number(height);
    if (unit === "metric") {
      heightSchema.parse({
        metric: height,
        imperialFeet: "0",
        imperialInches: "0",
      });
      metricHeight = Number(height);
    } else {
      heightSchema.parse({
        metric: "0",
        imperialFeet: height,
        imperialInches: heightInches,
      });

      const converted = imperialToMetric(Number(height), Number(heightInches));
      metricHeight = converted.meters * 100; // Convert meters to cm
    }
    const data: SetMeasurement = { type: "height", value: metricHeight };
    setMeasurement(data, user);
  };
  return (
    <Card className={cn("relative")}>
      <CardHeader>
        <CardTitle>Height</CardTitle>
        <CardDescription>Enter your height</CardDescription>
        <div className="flex items-center space-x-2 pt-2">
          <Tabs
            value={unit}
            onValueChange={handleUnitChange as (value: string) => void}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="metric">Metric</TabsTrigger>
              <TabsTrigger value="imperial">Imperial</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {unit === "metric" ? (
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              placeholder="Enter height in centimeters"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              min="0"
              step="0.1"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height-feet">Height (ft)</Label>
              <Input
                id="height-feet"
                type="number"
                placeholder="Feet"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                min="0"
                max="8"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height-inches">Height (in)</Label>
              <Input
                id="height-inches"
                type="number"
                placeholder="Inches"
                value={heightInches}
                onChange={(e) => setHeightInches(e.target.value)}
                min="0"
                max="11"
              />
            </div>
          </div>
        )}

        <Button variant="outline" className="w-full mt-4" onClick={submit}>
          Submit
        </Button>
      </CardContent>
    </Card>
  );
}
