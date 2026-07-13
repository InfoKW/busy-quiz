"use client";

import type { Question as QuestionType } from "@/lib/questions";

const LABELS = ["A", "B", "C", "D", "E"];

type Props = {
  question: QuestionType;
  questionNumber: number;
  total: number;
  selectedAnswer: number | undefined;
  onSelect: (optionIndex: number) => void;
  onBack: () => void;
};

export default function Question({
  question,
  questionNumber,
  total,
  selectedAnswer,
  onSelect,
  onBack,
}: Props) {
  return (
    <main className="quiz-screen">
      {/* Progress row */}
      <div className="progress-row">
        <button className="back-btn" onClick={onBack} aria-label="Go back">
          ←
        </button>
        <div className="progress-track" aria-hidden="true">
          <div
            className="progress-fill"
            style={{ width: `${(questionNumber / total) * 100}%` }}
          />
        </div>
        <span
          className="progress-counter"
          aria-label={`Question ${questionNumber} of ${total}`}
        >
          {questionNumber} / {total}
        </span>
      </div>

      {/* Question text */}
      <h2 className="question-text">{question.text}</h2>

      {/* Options */}
      <ul role="list" className="options-list">
        {question.options.map((option, idx) => (
          <li key={idx}>
            <button
              className={`option-btn${selectedAnswer === idx ? " selected" : ""}`}
              onClick={() => onSelect(idx)}
            >
              <span className="option-label" aria-hidden="true">
                {LABELS[idx]}
              </span>
              <span className="option-text">{option}</span>
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
