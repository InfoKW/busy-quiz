"use client";

import { ShaderBackground } from "./ShaderBackground";

type Props = { onStart: () => void };

export default function Intro({ onStart }: Props) {
  return (
    <main className="quiz-hero">
      {/* WebGL shader animation — same as Budget tool login, amber-tinted */}
      <ShaderBackground />

      {/* Subtle dark overlay so text stays readable */}
      <div className="hero-overlay" aria-hidden="true" />

      <div className="quiz-hero-content">
        <span className="quiz-hero-rule" aria-hidden="true" />
        <span className="quiz-eyebrow">Entrepreneur Anonymous</span>
        <h1 className="quiz-title">The Busy Test</h1>
        <p className="quiz-subtitle">
          Are you productive — or just addicted to busy?
          <br />
          12 questions. 3 minutes. Be honest.
        </p>
        <button onClick={onStart} className="btn btn-primary btn-hero">
          Start the test
        </button>
      </div>
    </main>
  );
}
