"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, Heart, ArrowRight, RefreshCw } from "lucide-react";

interface QuizResultsProps {
  results: {
    anxietyScore: number;
    depressionScore: number;
    suggestions: string[];
  } | null;
  onRetake: () => void;
}

export function QuizResults({ results, onRetake }: QuizResultsProps) {
  if (!results) return null;

  const { anxietyScore, depressionScore, suggestions } = results;

  // Calculate severity levels
  const getAnxietySeverity = (score: number) => {
    if (score <= 4) return { level: "Minimal", color: "text-green-500" };
    if (score <= 9) return { level: "Mild", color: "text-yellow-500" };
    if (score <= 14) return { level: "Moderate", color: "text-orange-500" };
    return { level: "Severe", color: "text-red-500" };
  };

  const getDepressionSeverity = (score: number) => {
    if (score <= 4) return { level: "Minimal", color: "text-green-500" };
    if (score <= 9) return { level: "Mild", color: "text-yellow-500" };
    if (score <= 14) return { level: "Moderate", color: "text-orange-500" };
    if (score <= 19) return { level: "Moderately Severe", color: "text-orange-600" };
    return { level: "Severe", color: "text-red-500" };
  };

  const anxietySeverity = getAnxietySeverity(anxietyScore);
  const depressionSeverity = getDepressionSeverity(depressionScore);

  // Calculate percentages for visual representation
  const anxietyPercentage = (anxietyScore / 21) * 100; // GAD-7 max score is 21
  const depressionPercentage = (depressionScore / 27) * 100; // PHQ-9 max score is 27

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Your Assessment Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Anxiety Score */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium text-lg">Anxiety Assessment</h3>
              </div>
              <p className={`font-semibold ${anxietySeverity.color}`}>
                {anxietySeverity.level}
              </p>
            </div>
            <Progress value={anxietyPercentage} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Score: {anxietyScore}/21</span>
              <span>Based on GAD-7 scale</span>
            </div>
          </div>

          {/* Depression Score */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-rose-500" />
                <h3 className="font-medium text-lg">Depression Assessment</h3>
              </div>
              <p className={`font-semibold ${depressionSeverity.color}`}>
                {depressionSeverity.level}
              </p>
            </div>
            <Progress value={depressionPercentage} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Score: {depressionScore}/27</span>
              <span>Based on PHQ-9 scale</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Personalized Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <ArrowRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={onRetake} variant="outline" className="flex-1">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retake Assessment
        </Button>
        <Button className="flex-1" asChild>
          <a href="/therapy">
            Talk to a Therapist
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>

      <p className="text-sm text-muted-foreground text-center">
        Note: These results are for informational purposes only and do not constitute a medical diagnosis.
        If you're experiencing severe symptoms, please consult with a healthcare professional.
      </p>
    </div>
  );
}