"use client";

import { useState } from "react";
import { results, type ResultType } from "@/lib/results";

const REGISTER_URL =
  "https://calendarlink.com/event/LWrqw?utm_source=quiz&utm_content=save_my_seat";
const SKOOL_URL =
  "https://www.skool.com/entrepreneuranonymous/about?utm_source=quiz&utm_content=join_community";

type Props = {
  resultType: ResultType;
  onRetake: () => void;
};

export default function Result({ resultType, onRetake }: Props) {
  const result = results[resultType];

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, resultType }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage("Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <main className="result-page">

      {/* ── Dark hero header ── */}
      <div className="result-hero">
        <div className="result-hero-content">
          <span className="result-eyebrow">Your result</span>
          <h1 className="result-name">{result.name}</h1>
          <p className="result-tagline">{result.tagline}</p>
        </div>
      </div>

      {/* ── White content ── */}
      <div className="result-content">

        <p className="result-body">{result.diagnosis}</p>

        <blockquote className="result-quote">
          <p>&ldquo;{result.quote}&rdquo;</p>
          <cite>{result.quoteAttribution}</cite>
        </blockquote>

        {/* CTA 1 — Primary: Save my seat */}
        <section className="cta-section cta-featured">
          <p>
            Join us live.{" "}
            <strong>Entrepreneurs Anonymous relaunches this August.</strong> The
            first session is all about Busy.
          </p>
          <a
            href={REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Save my seat
          </a>
        </section>

        {/* CTA 2 — Secondary: Join the community */}
        <section className="cta-section">
          <p>
            Want more than one session?{" "}
            <strong>Join the EA Skool community</strong> for monthly gatherings
            and everything in between.
          </p>
          <a
            href={SKOOL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            Join the community
          </a>
        </section>

        {/* CTA 3 — Email fallback */}
        <section className="cta-section">
          <p>Not ready yet? Drop your email and we&rsquo;ll keep you in the loop.</p>

          {status === "success" ? (
            <p className="email-success">You&rsquo;re in. We&rsquo;ll be in touch.</p>
          ) : (
            <form onSubmit={handleEmailSubmit} className="email-form">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="email-input"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="btn btn-secondary"
                style={{ opacity: status === "loading" ? 0.6 : 1 }}
              >
                {status === "loading" ? "Sending…" : "Keep me posted"}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="email-error">{errorMessage}</p>
          )}
        </section>

        <button onClick={onRetake} className="btn-ghost">
          Retake the test
        </button>

      </div>
    </main>
  );
}
