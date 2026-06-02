"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { MentalHealthQuiz } from "@/components/quiz/mental-health-quiz";
import { QuizResults } from "@/components/quiz/quiz-results";

export default function QuizPage() {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState<{
    anxietyScore: number;
    depressionScore: number;
    suggestions: string[];
  } | null>(null);

  const handleQuizComplete = (results: {
    anxietyScore: number;
    depressionScore: number;
    suggestions: string[];
  }) => {
    setQuizResults(results);
    setQuizCompleted(true);
  };

  const handleRetakeQuiz = () => {
    setQuizCompleted(false);
    setQuizResults(null);
  };

  return (
    <Container>
      <div className="pt-24 md:pt-28 pb-6 space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Mental Health Assessment
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            This quiz helps identify symptoms of anxiety and depression and provides personalized suggestions.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          {!quizCompleted ? (
            <MentalHealthQuiz onComplete={handleQuizComplete} />
          ) : (
            <QuizResults results={quizResults} onRetake={handleRetakeQuiz} />
          )}
        </div>
      </div>
    </Container>
  );
}