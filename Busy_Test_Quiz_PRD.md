# Product Requirements Document: The Busy Test

**Project:** Entrepreneurs Anonymous August Relaunch — Quiz Funnel
**Prepared by:** Ola (KelliWorks)
**Source spec:** Busy Test Quiz Spec (Charity Moses Obi, Marketing KW), approved by Kelli Lewis
**Document date:** July 10, 2026
**Status:** Draft for build — 4 open items pending (see Section 12)

---

## 1. Overview

"The Busy Test: Are You Productive or Just Addicted to Busy?" is a 12-question personality quiz that sorts takers into one of four result types, then routes them to one of three calls to action: register for the August Entrepreneurs Anonymous (EA) relaunch session, join the EA Skool community, or leave an email address for the contact list. Every completed quiz must produce at least one of those three outcomes.

This PRD covers a **custom-built** implementation (not a third-party quiz platform) so the team has full control over scoring logic, tracking, and the ConvertKit (Kit) integration. It replaces the earlier Typeform-based approach discussed for this project.

**Target launch:** live and tested before promotion begins mid-July 2026. Given today's date, this is a compressed timeline — see Section 14 for a realistic schedule.

---

## 2. Goals

- Ship a mobile-first quiz that takes ~3 minutes to complete, matching the intro screen's stated estimate.
- Correctly implement the letter-based scoring system, including the non-standard tie-break rule (Section 6.3) — this is the single most build-error-prone requirement in the spec.
- Capture every completion into ConvertKit automatically, tagged with which result type the person got, with zero manual export.
- Track completions and CTA clicks so the team can report quiz-driven signups during the promo period.
- Deploy on Vercel behind a short, clean URL suitable for Instagram/LinkedIn bios and captions.

## 3. Non-Goals

- No user accounts, login, or saved progress across sessions.
- No analytics beyond completion counts and CTA click tracking (no full funnel/heatmap tooling in v1).
- No dynamic, personalized share images in v1 (static result cards per type instead — see Section 10.4).

## 4. Users

Primary audience: entrepreneurs and small business owners following KelliWorks / Entrepreneurs Anonymous on Instagram and LinkedIn, taking the quiz on mobile. Secondary: existing email list / Skool members who see it as a re-engagement piece before the August relaunch.

---

## 5. Functional Requirements

### 5.1 Intro Screen

- Headline: "The Busy Test"
- Subhead: "Are you productive or just addicted to busy?"
- Body: "12 quick questions. 3 minutes. Answer honestly, nobody sees your results but you."
- Button: "Start the test"

### 5.2 Question Flow

- 12 questions, one per screen, single-select, four options each (no letters shown to the user — options display as plain text).
- Progress indicator visible on every question screen (e.g., "4 of 12").
- Answer order is fixed exactly as written in the source spec — scoring depends on option position, so the frontend must preserve array order (index 0 = a, 1 = b, 2 = c, 3 = d) for all 12 questions.
- Full question and option text: carried verbatim from the approved spec (Appendix A). Do not paraphrase — Kelli's team approved this exact wording.

### 5.3 Scoring Engine

Client-side, evaluated the instant the 12th answer is submitted (no need for a server round-trip to compute the result).

1. Maintain four counters: `a`, `b`, `c`, `d`. Each answer increments the counter matching its option position.
2. Determine the result using this **ordered, first-match-wins** check (this is the exact tie-break priority from the spec — b beats every tie it's part of, then a, then c, then d):

```js
function getResult(counts) {
  const { a, b, c, d } = counts;
  if (b >= a && b >= c && b >= d) return "bottleneck";
  if (a >= c && a >= d) return "firefighter";
  if (c >= d) return "badge_wearer";
  return "recovering_workaholic";
}
```

3. This must be unit tested against all-a / all-b / all-c / all-d inputs and at least one deliberate tie per branch before launch (see Section 14).

### 5.4 Result Pages

Four distinct pages, each rendering, in order: result name, tagline, full diagnosis copy, one italicized book quote with attribution, then the CTA flow (5.5). All copy is final and quote wording must not be edited (per spec, section 5). Full text for all four results is in Appendix B.

| Result | Triggered by | Tagline |
|---|---|---|
| The Firefighter | mostly (a) | "Everything is urgent. You run on crisis." |
| The Bottleneck | mostly (b), wins ties | "Nothing moves without you because you can't let go." |
| The Badge Wearer | mostly (c) | "Busy is your identity. Exhaustion is your trophy." |
| The Recovering Workaholic | mostly (d) | "You've started setting boundaries." |

### 5.5 End-of-Quiz CTA Flow

Displayed on every result page, directly under the quote, in this order:

1. **Primary CTA** — "Join us live. Entrepreneurs Anonymous relaunches this August and the first session is all about Busy." Button: "Save my seat" → links to the session registration URL (pending, Section 12).
2. **Secondary CTA** — "Want more than one session? Join the EA Skool community for the monthly gatherings and everything in between." Button: "Join the community" → links to the Skool community URL (pending, Section 12).
3. **Fallback email capture** — "Not ready yet? Drop your email and we'll keep you in the loop." Single email field + "Keep me posted" button → submits to ConvertKit (Section 8).

**Known platform constraint:** a single static page can render all three elements together with no issue (unlike the earlier Typeform approach, where the email field couldn't live on the same screen as the result). This is one advantage of the custom build.

---

## 6. Technical Architecture

**Stack:** Next.js (App Router), React, deployed on Vercel.

- **Frontend:** a single-page quiz flow (`/`) built as client components — intro screen, 12 question screens, result screen — all state held in React state (`useState`/`useReducer`), no backend calls until the final email submission.
- **Backend:** one Next.js API route, `/api/subscribe`, that proxies the ConvertKit call server-side. This keeps the ConvertKit API key off the client entirely.
- **No database required for v1.** Completion and CTA-click events are sent to an analytics tool (Section 9) rather than stored in app-owned storage.

```
[Browser: quiz UI, scoring logic, result render]
        |
        | POST /api/subscribe { email, resultType }
        v
[Vercel serverless function /api/subscribe]
        |
        | POST https://api.kit.com/v4/subscribers (create/upsert)
        | POST https://api.kit.com/v4/forms/{form_id}/subscribers/{id} (add to form)
        v
[ConvertKit / Kit account]
```

### 6.1 Suggested Project Structure

```
/app
  /page.tsx                 – quiz container, state machine
  /components/Intro.tsx
  /components/Question.tsx
  /components/Result.tsx
  /api/subscribe/route.ts   – ConvertKit proxy (POST)
/lib/scoring.ts             – getResult() + unit tests
/lib/questions.ts           – question/option data (Appendix A)
/lib/results.ts             – result copy + quotes (Appendix B)
/public/results/            – 4 static result-card share images
```

---

## 7. ConvertKit (Kit) Integration

### 7.1 Account Setup (one-time, in the Kit dashboard)

1. **Confirm the sending email address** — the account currently shows an unconfirmed sending address warning; this blocks any automation/broadcast tied to the form until resolved. Fix this before QA, not after.
2. **Create the custom field** `quiz_result` (Subscribers → click any subscriber → Custom Fields → `+`). Custom field keys must exist *before* the API sends them — unmatched keys are silently dropped with no error, so this step can't be skipped or done after the fact.
3. **Create one Form** dedicated to this quiz (Grow → Landing Pages & Forms) and note its form ID from the URL.
4. **Grab the API key** (Settings → Developer).
5. **Note the plan limitation:** the account is on Kit's Free plan, which caps automations at one. If the plan is to send a different follow-up sequence per result type, that requires either an upgrade or a single automation with conditional/if-else content blocks keyed off `quiz_result`. Decide this before building the post-signup email sequence — it doesn't block the quiz itself, only the follow-up automation.

### 7.2 API Route Implementation

`/app/api/subscribe/route.ts`:

```ts
export async function POST(req: Request) {
  const { email, resultType } = await req.json();
  const API_KEY = process.env.KIT_API_KEY;
  const FORM_ID = process.env.KIT_FORM_ID;

  // 1. Create or update the subscriber, storing the result as a custom field
  const createRes = await fetch("https://api.kit.com/v4/subscribers", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Kit-Api-Key": API_KEY },
    body: JSON.stringify({
      email_address: email,
      fields: { quiz_result: resultType },
    }),
  });

  if (!createRes.ok) {
    return Response.json({ ok: false, error: "subscriber_create_failed" }, { status: 502 });
  }
  const { subscriber } = await createRes.json();

  // 2. Add them to the quiz form so form-based automations fire
  const addRes = await fetch(
    `https://api.kit.com/v4/forms/${FORM_ID}/subscribers/${subscriber.id}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Kit-Api-Key": API_KEY },
      body: JSON.stringify({ referrer: "https://<quiz-domain>/" }),
    }
  );

  if (!addRes.ok) {
    return Response.json({ ok: false, error: "form_add_failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
```

### 7.3 Environment Variables

| Variable | Purpose | Where set |
|---|---|---|
| `KIT_API_KEY` | Server-side auth to Kit API | Vercel project → Environment Variables (Production + Preview) |
| `KIT_FORM_ID` | Target form for the quiz | Vercel project → Environment Variables |

Never expose these via `NEXT_PUBLIC_` prefixes — they must stay server-only.

### 7.4 Rate Limits

Kit's API is capped at 120 requests/minute per account key. Not a concern at expected quiz volume, but worth knowing if a promo post drives a traffic spike.

---

## 8. Tracking & Reporting

- **Completions:** fire a client-side event (e.g., to Vercel Analytics, Plausible, or GA4 — pick one) when a user reaches the result screen, regardless of which CTA they click next.
- **CTA clicks:** tag each outbound button URL with UTM parameters (`utm_source=quiz&utm_content=save_my_seat` / `utm_content=join_community`) so clicks are attributable in whatever analytics tool sits behind the registration and Skool pages. The app itself can't track what happens after the user leaves the page, so UTM tagging plus destination-side analytics is the mechanism.
- **Email captures:** visible directly in Kit's Subscribers list, filterable/segmentable by the `quiz_result` custom field.
- **Reporting during the promo period:** combine (a) completions from analytics, (b) CTA clicks from UTM data, (c) email captures from Kit, into one weekly number for Kelli/Charity.

---

## 9. Non-Functional Requirements

1. **Mobile-first:** primary traffic source is Instagram/LinkedIn on phones; design and test mobile viewport first, desktop second.
2. **One question per screen** with visible progress indicator (built into the React state machine, not a platform feature this time).
3. **Short, clean URL:** use a custom Vercel domain (e.g., a subdomain of the KelliWorks domain, or a short standalone domain) rather than the default `*.vercel.app` URL, for use in bios/captions.
4. **Shareable result:** minimum viable is a "share your result" text line on the result screen for screenshotting; target is a static branded result-card image per type (4 total, designed in Canva, stored in `/public/results/`).
5. **Performance:** keep the bundle lean — this is a short-lived promo funnel, not a full app; avoid heavy dependencies given mobile/cellular traffic.
6. **Accessibility basics:** sufficient color contrast, focus states on the answer buttons, and semantic HTML for screen readers, given this could be shared broadly.

---

## 10. Deployment Plan (Vercel)

1. Push the Next.js repo to GitHub (or GitLab/Bitbucket).
2. Import the repo into a new Vercel project.
3. Set `KIT_API_KEY` and `KIT_FORM_ID` in Vercel's Environment Variables for both Production and Preview environments.
4. Deploy to a Preview URL first; run the full QA pass (Section 14) against that preview before promoting to Production.
5. Add the custom domain in Vercel's Domains settings and point DNS accordingly; confirm HTTPS is active.
6. Promote to Production only after QA sign-off and after the sending-address confirmation and open items in Section 12 are resolved (the primary CTA needs a real URL and date before this goes live to real traffic).

---

## 11. Content & Asset Requirements

- All 12 questions, 4 result pages, and 4 quotes: final, verbatim from the approved spec (Appendix A/B) — no copywriting work needed, just correct implementation.
- 4 static result-card share images: need to be designed (Canva) — not yet started.
- CTA button destination URLs: pending (Section 12).

---

## 12. Open Items / Blockers

Carried forward from the original spec, updated with current status:

| Item | Owner | Status |
|---|---|---|
| August session registration URL | Kelli / Ola | **Open** — blocks primary CTA |
| EA Skool community join URL | Kelli | **Open** — blocks secondary CTA |
| Final August session date (for CTA copy) | Kelli | **Open** — blocks primary CTA copy |
| Email platform/CRM | Ola | **Resolved** — ConvertKit (Kit), Free plan |
| Kit sending address confirmation | Ola | **Open** — blocks any automation firing |
| Kit custom field `quiz_result` created | Ola | **Open** — must be done before first API call |
| Kit form created + form ID captured | Ola | **Open** |
| Decision: 1 automation vs. upgrade for per-result sequences | Ola / Kelli | **Open** |
| 4 result-card share images | Charity / design | **Open** |
| Custom short domain for the quiz | Ola | **Open** |

The three registration/date/URL items are the hard blockers for a real launch — the app itself can be fully built and QA'd with placeholder links in the meantime.

---

## 13. Risks

- **Scoring logic errors** are the highest-risk bug class here — the tie-break rule is non-obvious and easy to get backwards. Mitigate with the unit tests specified in 5.3 and 14.
- **Silent ConvertKit data loss** if the `quiz_result` custom field isn't created before the app goes live — the API won't error, it'll just drop the field. Mitigate by verifying in Kit's UI during QA, not just checking for a 200 response.
- **Automation cap on Free plan** could silently limit the planned follow-up sequence design — resolve the plan decision (Section 12) before building the automation, not after.
- **Compressed timeline** — target is live before mid-July promotion, and today is July 10. Recommend confirming with Kelli/Charity whether the promotion start date has flexibility, given three open items are still outside engineering's control.

---

## 14. Testing & QA Plan

1. **Scoring unit tests:** all-a, all-b, all-c, all-d, plus one deliberate tie scenario per branch (e.g., a=b=6 → should resolve to Bottleneck; a=c=6, b lower → should resolve to Firefighter, etc.).
2. **End-to-end pass:** complete the quiz 4 times (once per result), on both mobile and desktop viewports.
3. **ConvertKit integration test:** submit the fallback email form, then confirm in Kit's Subscribers list that (a) a new/updated subscriber appears, (b) `quiz_result` is populated correctly, (c) they're attached to the correct form.
4. **CTA link test:** click both primary and secondary buttons from a completed quiz, confirm UTM parameters arrive intact at the destination.
5. **Progress indicator test:** confirm "X of 12" updates correctly through the full flow, including back navigation if supported.
6. **Domain/HTTPS check:** confirm the custom short URL resolves correctly on the Production deployment.

## 15. Suggested Milestones

| Phase | Work |
|---|---|
| Day 1–2 | Build question flow, scoring engine + unit tests, result page rendering |
| Day 2–3 | Build `/api/subscribe`, wire ConvertKit (with placeholder form/field until Kit setup is done) |
| Day 3 | Complete Kit account setup (Section 7.1), swap in real form ID/API key |
| Day 4 | Design and drop in 4 result-card images; add UTM tracking + analytics event |
| Day 4–5 | Full QA pass (Section 14) on Vercel Preview |
| Day 5 | Swap in real CTA URLs and August date once received; promote to Production |

---

## Appendix A: Full Question Bank

Verbatim from the approved spec. Option order is fixed — index 0 = a, 1 = b, 2 = c, 3 = d — and must not be reordered, since scoring depends on position.

1. **It's 9pm and a client emails. You:** (a) reply instantly / (b) reply but hate yourself for it / (c) draft a reply then delete it / (d) let it wait till morning
2. **Someone offers to take a task off your plate. Your first thought:** (a) they'll mess it up / (b) it's faster if I do it / (c) yes, but I'll check their work anyway / (d) thank God
3. **When did you last take a full day off with zero work check-ins?** (a) what's a day off / (b) I tried but kept checking / (c) I took one and felt guilty the whole time / (d) recently, and I actually unplugged
4. **How do you answer "how are you?"** (a) "Busy!" / (b) "Surviving" / (c) "Slammed but good" / (d) an actual answer
5. **Your to-do list at end of day:** (a) longer than it started / (b) untouched because fires / (c) done, but you added more / (d) mostly done, the rest can wait
6. **Delegating feels like:** (a) losing control / (b) more work than doing it myself / (c) something other people can afford / (d) the only way I've grown
7. **Your phone is:** (a) never on silent, ever / (b) full of unread messages you're "getting to" / (c) the first thing you touch in the morning / (d) on do not disturb after a set hour
8. **When you finally sit down to relax, you feel:** (a) restless, like something's on fire somewhere / (b) guilty about what's not done / (c) like you haven't earned it yet / (d) actually relaxed, most days
9. **Your team or clients would describe you as:** (a) always available / (b) hard to get decisions from because everything waits on you / (c) impressive but exhausted / (d) clear about when you're reachable
10. **The last time you missed something personal (dinner, event, bedtime) because of work was:** (a) this week / (b) I can't remember, they blur together / (c) recently, but it was worth it / (d) rare, and I felt the cost when it happened
11. **Honest answer: is your busyness producing results or just motion?** (a) motion, if I'm real with myself / (b) results, but at a cost I don't want to look at / (c) results, and I wear the cost proudly / (d) I've learned the difference the hard way
12. **If your business ran for one week without you, what would happen?** (a) total chaos / (b) everything would stall waiting on my approval / (c) it might survive but I'd check in constantly / (d) it would mostly run fine

## Appendix B: Full Result Copy

All copy below is final and approved. Quote wording must not be edited — each is verified word for word against *Entrepreneurs Anonymous*.

### Mostly (a): The Firefighter

**Tagline:** "Everything is urgent. You run on crisis."

**Diagnosis:** You don't manage your business, you rescue it. Every day starts with a fire and ends with three more. The adrenaline feels like productivity, but crisis mode isn't a strategy, it's a habit. And the longer you run on it, the harder it gets to tell a real emergency from a Tuesday. The good news: fires can be prevented, not just fought. That starts with systems and people you trust to hold the hose.

**Quote:** *"Most business owners get stuck here, spending their days putting out fires instead of preventing them." (Chapter 1, The Ownership Trap)*
Attribution: From Entrepreneurs Anonymous by Kelli Lewis

### Mostly (b): The Bottleneck

**Tagline:** "Nothing moves without you because you can't let go."

**Diagnosis:** Your business has one point of failure and it's you. Every decision, every approval, every task routes through your desk, and you tell yourself that's quality control. It's actually a ceiling. Your team can't grow, your business can't scale, and you can't rest, all for the same reason. Delegation isn't losing control, it's building a business that doesn't collapse when you close your laptop.

**Quote:** *"Your business has become dependent on you, and you've become dependent on being needed." (Chapter 1, The Ownership Trap)*
Attribution: From Entrepreneurs Anonymous by Kelli Lewis

### Mostly (c): The Badge Wearer

**Tagline:** "Busy is your identity. Exhaustion is your trophy."

**Diagnosis:** Somewhere along the way, busy stopped being a season and became who you are. You answer "how are you" with your workload. You feel guilty resting even when nothing needs you. The hustle got applause for so long that slowing down feels like failing. But busy isn't the same as valuable, and you don't have to earn your right to rest. You already have it.

**Quote:** *"I wore my 80-hour workweeks like a badge of honor until my body and mind gave me a wake-up call that changed everything." (The Mindset of Success)*
Attribution: From Entrepreneurs Anonymous by Kelli Lewis

### Mostly (d): The Recovering Workaholic

**Tagline:** "You've started setting boundaries."

**Diagnosis:** You've done the hard part: you noticed. You've started protecting your evenings, letting your team own their work, and answering "how are you" with the truth. Recovery isn't a finish line though, it's a practice, and old habits love a busy season. Stay close to people who get it. That's exactly what Entrepreneurs Anonymous is for.

**Quote:** *"Your journey to business freedom isn't about achieving perfection. It's about progress." (closing chapter)*
Attribution: From Entrepreneurs Anonymous by Kelli Lewis
