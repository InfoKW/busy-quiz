"use client";

import { useState } from "react";
import Intro from "./components/Intro";
import Question from "./components/Question";
import Result from "./components/Result";
import { questions } from "@/lib/questions";
import { getResult, toCounts } from "@/lib/scoring";
import type { ResultType } from "@/lib/results";

type Screen = "intro" | "question" | "result";

export default function QuizPage() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | undefined)[]>(
    Array(questions.length).fill(undefined)
  );
  const [resultType, setResultType] = useState<ResultType | null>(null);

  function handleStart() {
    setScreen("question");
    setCurrentQ(0);
    setAnswers(Array(questions.length).fill(undefined));
    setResultType(null);
  }

  function handleSelect(optionIndex: number) {
    const newAnswers = [...answers];
    newAnswers[currentQ] = optionIndex;
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      const counts = toCounts(newAnswers as number[]);
      const result = getResult(counts);
      setResultType(result);
      setScreen("result");
    }
  }

  function handleBack() {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
    } else {
      setScreen("intro");
    }
  }

  function handleRetake() {
    setScreen("intro");
    setCurrentQ(0);
    setAnswers(Array(questions.length).fill(undefined));
    setResultType(null);
  }

  if (screen === "intro") {
    return <Intro onStart={handleStart} />;
  }

  if (screen === "question") {
    return (
      <Question
        question={questions[currentQ]}
        questionNumber={currentQ + 1}
        total={questions.length}
        selectedAnswer={answers[currentQ]}
        onSelect={handleSelect}
        onBack={handleBack}
      />
    );
  }

  if (screen === "result" && resultType) {
    return <Result resultType={resultType} onRetake={handleRetake} />;
  }

  return null;
}
