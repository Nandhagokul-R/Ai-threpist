"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Brain, Heart } from "lucide-react";

// Quiz questions for anxiety and depression assessment
const quizQuestions = [
  // Anxiety questions (GAD-7 based)
  {
    id: "a1",
    question: "Feeling nervous, anxious, or on edge",
    type: "anxiety",
  },
  {
    id: "a2",
    question: "Not being able to stop or control worrying",
    type: "anxiety",
  },
  {
    id: "a3",
    question: "Worrying too much about different things",
    type: "anxiety",
  },
  {
    id: "a4",
    question: "Trouble relaxing",
    type: "anxiety",
  },
  {
    id: "a5",
    question: "Being so restless that it's hard to sit still",
    type: "anxiety",
  },
  {
    id: "a6",
    question: "Becoming easily annoyed or irritable",
    type: "anxiety",
  },
  {
    id: "a7",
    question: "Feeling afraid as if something awful might happen",
    type: "anxiety",
  },
  
  // Depression questions (PHQ-9 based)
  {
    id: "d1",
    question: "Little interest or pleasure in doing things",
    type: "depression",
  },
  {
    id: "d2",
    question: "Feeling down, depressed, or hopeless",
    type: "depression",
  },
  {
    id: "d3",
    question: "Trouble falling or staying asleep, or sleeping too much",
    type: "depression",
  },
  {
    id: "d4",
    question: "Feeling tired or having little energy",
    type: "depression",
  },
  {
    id: "d5",
    question: "Poor appetite or overeating",
    type: "depression",
  },
  {
    id: "d6",
    question: "Feeling bad about yourself or that you are a failure",
    type: "depression",
  },
  {
    id: "d7",
    question: "Trouble concentrating on things",
    type: "depression",
  },
  {
    id: "d8",
    question: "Moving or speaking so slowly that other people could have noticed",
    type: "depression",
  },
  {
    id: "d9",
    question: "Thoughts that you would be better off dead or of hurting yourself",
    type: "depression",
  },
];

// Answer options
const answerOptions = [
  { value: "0", label: "Not at all" },
  { value: "1", label: "Several days" },
  { value: "2", label: "More than half the days" },
  { value: "3", label: "Nearly every day" },
];

// Suggestions based on severity
const getAnxietySuggestions = (score: number) => {
  if (score <= 4) {
    return [
      "Your anxiety levels appear to be minimal.",
      "Continue practicing mindfulness and self-care.",
      "Try our breathing exercises in the app to maintain calm.",
    ];
  } else if (score <= 9) {
    return [
      "You're showing mild anxiety symptoms.",
      "Consider adding regular meditation to your routine.",
      "Try to identify specific triggers and practice stress management techniques.",
      "Our guided meditation sessions may help reduce your anxiety.",
    ];
  } else if (score <= 14) {
    return [
      "You're experiencing moderate anxiety symptoms.",
      "Consider speaking with a mental health professional.",
      "Practice daily relaxation techniques and breathing exercises.",
      "Try our anxiety-focused games and exercises in the app.",
      "Limit caffeine and alcohol which can worsen anxiety.",
    ];
  } else {
    return [
      "Your anxiety symptoms appear to be severe.",
      "We strongly recommend consulting with a healthcare provider or therapist.",
      "Consider using our therapy chat feature for immediate support.",
      "Practice grounding techniques when feeling overwhelmed.",
      "Establish a consistent sleep schedule and self-care routine.",
      "Remember that help is available and recovery is possible.",
    ];
  }
};

const getDepressionSuggestions = (score: number) => {
  if (score <= 4) {
    return [
      "Your depression indicators are minimal.",
      "Continue engaging in activities you enjoy.",
      "Maintain social connections and regular exercise.",
    ];
  } else if (score <= 9) {
    return [
      "You're showing mild depression symptoms.",
      "Try to incorporate more physical activity into your routine.",
      "Practice gratitude journaling using our app's journaling feature.",
      "Ensure you're getting adequate sleep and nutrition.",
    ];
  } else if (score <= 14) {
    return [
      "You're experiencing moderate depression symptoms.",
      "Consider speaking with a mental health professional.",
      "Establish a daily routine with achievable goals.",
      "Try our mood-boosting activities in the app.",
      "Connect with supportive friends or family members.",
    ];
  } else if (score <= 19) {
    return [
      "Your depression symptoms appear to be moderately severe.",
      "We recommend consulting with a healthcare provider or therapist.",
      "Consider using our therapy chat feature for support.",
      "Focus on self-compassion and small daily achievements.",
      "Establish healthy sleep patterns and regular meals.",
    ];
  } else {
    return [
      "Your depression symptoms appear to be severe.",
      "Please seek professional help as soon as possible.",
      "Consider using our therapy chat feature for immediate support.",
      "Remember that depression is treatable and recovery is possible.",
      "Be gentle with yourself during this difficult time.",
      "If you have thoughts of harming yourself, please call a crisis hotline immediately.",
    ];
  }
};

interface MentalHealthQuizProps {
  onComplete: (results: {
    anxietyScore: number;
    depressionScore: number;
    suggestions: string[];
  }) => void;
}

export function MentalHealthQuiz({ onComplete }: MentalHealthQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState<string>("");

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  const handleNextQuestion = () => {
    if (currentAnswer) {
      // Save the current answer
      setAnswers({
        ...answers,
        [currentQuestion.id]: currentAnswer,
      });

      // Move to next question or complete quiz
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCurrentAnswer("");
      } else {
        // Calculate scores and complete quiz
        calculateResults();
      }
    }
  };

  const calculateResults = () => {
    // Include the final answer
    const finalAnswers = {
      ...answers,
      [currentQuestion.id]: currentAnswer,
    };

    // Calculate anxiety score
    const anxietyQuestions = quizQuestions.filter(q => q.type === "anxiety");
    const anxietyScore = anxietyQuestions.reduce((total, question) => {
      return total + (parseInt(finalAnswers[question.id] || "0"));
    }, 0);

    // Calculate depression score
    const depressionQuestions = quizQuestions.filter(q => q.type === "depression");
    const depressionScore = depressionQuestions.reduce((total, question) => {
      return total + (parseInt(finalAnswers[question.id] || "0"));
    }, 0);

    // Generate suggestions based on scores
    const anxietySuggestions = getAnxietySuggestions(anxietyScore);
    const depressionSuggestions = getDepressionSuggestions(depressionScore);

    // Combine unique suggestions
    const allSuggestions = [...new Set([...anxietySuggestions, ...depressionSuggestions])];

    // Complete the quiz
    onComplete({
      anxietyScore,
      depressionScore,
      suggestions: allSuggestions,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {quizQuestions.length}
          </p>
          <div className="flex items-center gap-2">
            {currentQuestion.type === "anxiety" ? (
              <Brain className="h-4 w-4 text-blue-500" />
            ) : (
              <Heart className="h-4 w-4 text-rose-500" />
            )}
            <p className="text-sm font-medium">
              {currentQuestion.type === "anxiety" ? "Anxiety" : "Depression"} Assessment
            </p>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <h3 className="text-lg font-medium">
              Over the last 2 weeks, how often have you been bothered by:
            </h3>
            <div className="space-y-4">
              <p className="font-medium">{currentQuestion.question}</p>

              <RadioGroup
                value={currentAnswer}
                onValueChange={setCurrentAnswer}
                className="grid gap-3"
              >
                {answerOptions.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted"
                  >
                    <RadioGroupItem value={option.value} id={`option-${option.value}`} />
                    <Label
                      htmlFor={`option-${option.value}`}
                      className="flex-1 cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <Button
              onClick={handleNextQuestion}
              disabled={!currentAnswer}
              className="w-full"
            >
              {currentQuestionIndex < quizQuestions.length - 1
                ? "Next Question"
                : "Complete Quiz"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground text-center">
        Note: This quiz is for informational purposes only and is not a diagnostic tool.
        Please consult with a healthcare professional for proper diagnosis and treatment.
      </p>
    </div>
  );
}