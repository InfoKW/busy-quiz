# BusyQuiz — Lovable Integration Handover (v2)

This document responds directly to Lovable's integration plan and provides corrections, confirmations, and decisions needed before build begins.

**Quiz URL:** `https://quiz.entrepreneuranonymous.net`
All entry point links, navbar links, blog CTAs, and footer links on the main site should point here.

---

## Response to Lovable's Plan — Point by Point

---

### 1. Entry Points

**Confirmed.** All of Lovable's suggested entry points are approved:

- `/quiz` dedicated route
- Homepage band above "Signature Offer"
- Navbar link or CTA next to "Book a Call"
- Inline CTA card inside Blog post 4 ("I Know You're Busy…") and Blog post 7 ("I Relapsed")
- Footer link under a "Start Here" column

**Suggested copy for entry points:**
> "Are you productive or just addicted to busy? 12 questions. 3 minutes. Nobody sees your results but you."

---

### 2. Quiz Page Structure

**Confirmed** on design tokens, progress bar, and Framer Motion transitions.

**Correction — quiz time:**
The quiz is **3 minutes**, not 2. Update all copy that references the time.

**Confirmed — no email required to see result.** Email capture is optional and comes after the result is shown. Use this on the entry point to reduce friction:
> "Confidential. No email required to see your result."

---

### 3. Result Page — CORRECTION: There Are 4 Archetypes, Not 3

**Lovable listed 3 archetypes. There are 4.** "The Operator" does not exist in this quiz. The correct four are:

| Result ID | Display Name | Tagline |
|---|---|---|
| `firefighter` | The Firefighter | Everything is urgent. You run on crisis. |
| `bottleneck` | The Bottleneck | Nothing moves without you because you can't let go. |
| `badge_wearer` | The Badge Wearer | Busy is your identity. Exhaustion is your trophy. |
| `recovering_workaholic` | The Recovering Workaholic | You've started setting boundaries. |

All four result pages must be built. All copy is final and approved — do not rewrite it.

#### Full result copy for each archetype

**The Firefighter**
- Tagline: Everything is urgent. You run on crisis.
- Diagnosis: You don't manage your business, you rescue it. Every day starts with a fire and ends with three more. The adrenaline feels like productivity, but crisis mode isn't a strategy, it's a habit. And the longer you run on it, the harder it gets to tell a real emergency from a Tuesday. The good news: fires can be prevented, not just fought. That starts with systems and people you trust to hold the hose.
- Quote: "Most business owners get stuck here, spending their days putting out fires instead of preventing them."
- Attribution: Chapter 1, The Ownership Trap, Entrepreneurs Anonymous by Kelli Lewis

**The Bottleneck**
- Tagline: Nothing moves without you because you can't let go.
- Diagnosis: Your business has one point of failure and it's you. Every decision, every approval, every task routes through your desk, and you tell yourself that's quality control. It's actually a ceiling. Your team can't grow, your business can't scale, and you can't rest, all for the same reason. Delegation isn't losing control, it's building a business that doesn't collapse when you close your laptop.
- Quote: "Your business has become dependent on you, and you've become dependent on being needed."
- Attribution: Chapter 1, The Ownership Trap, Entrepreneurs Anonymous by Kelli Lewis

**The Badge Wearer**
- Tagline: Busy is your identity. Exhaustion is your trophy.
- Diagnosis: Somewhere along the way, busy stopped being a season and became who you are. You answer "how are you" with your workload. You feel guilty resting even when nothing needs you. The hustle got applause for so long that slowing down feels like failing. But busy isn't the same as valuable, and you don't have to earn your right to rest. You already have it.
- Quote: "I wore my 80-hour workweeks like a badge of honor until my body and mind gave me a wake-up call that changed everything."
- Attribution: The Mindset of Success, Entrepreneurs Anonymous by Kelli Lewis

**The Recovering Workaholic**
- Tagline: You've started setting boundaries.
- Diagnosis: You've done the hard part: you noticed. You've started protecting your evenings, letting your team own their work, and answering "how are you" with the truth. Recovery isn't a finish line though, it's a practice, and old habits love a busy season. Stay close to people who get it. That's exactly what Entrepreneurs Anonymous is for.
- Quote: "Your journey to business freedom isn't about achieving perfection. It's about progress."
- Attribution: Closing chapter, Entrepreneurs Anonymous by Kelli Lewis

---

### 4. CTA Priority by Archetype — CONFIRMED WITH CORRECTIONS

Lovable's concept of shifting the primary (amber) CTA by archetype severity is approved. Here is the correct mapping for all **4** archetypes:

| Archetype | Primary CTA | Secondary CTA | Tertiary CTA |
|---|---|---|---|
| Firefighter (most severe) | Save my seat (Live Session) | Join the EA Skool community | Email capture |
| Bottleneck (severe) | Save my seat (Live Session) | Join the EA Skool community | Email capture |
| Badge Wearer (moderate) | Join the EA Skool community | Save my seat (Live Session) | Email capture |
| Recovering Workaholic (early-stage) | Join the EA Skool community | Email capture | Save my seat (Live Session) |

All three CTAs appear on every result page. Only the order and button style (amber filled vs outlined) changes.

**CTA copy (do not rewrite):**

CTA 1 — Live Session:
> Join us live. **Entrepreneurs Anonymous relaunches this August.** The first session is all about Busy.
> Button: "Save my seat"
> URL: `https://calendarlink.com/event/LWrqw`

CTA 2 — Community:
> Want more than one session? **Join the EA Skool community** for monthly gatherings and everything in between.
> Button: "Join the community"
> URL: `https://www.skool.com/entrepreneuranonymous/about`

CTA 3 — Email:
> Not ready yet? Drop your email and we'll keep you in the loop.
> Button: "Keep me posted"

Secondary link on all results: "Retake the test"

---

### 5. Data & Email — DECISION NEEDED

This is the one area where Kelli needs to decide before Lovable builds.

**The existing quiz app** (Next.js) is already wired to **Kit (ConvertKit)** for email capture. It stores `quiz_result` as a custom field per subscriber and adds them to a Kit form so automations can fire per archetype.

**Lovable is proposing** to use **Resend + Lovable Cloud** (their own database) instead.

**These are two different systems. Pick one.**

**Option A — Keep Kit (existing setup)**
- Email capture stays wired to Kit as already built
- Kelli needs: Kit API key, Kit form ID, and a `quiz_result` custom field created in Kit
- Lovable Cloud table is optional/redundant for submissions
- Nurture sequences run inside Kit, tagged by archetype

**Option B — Switch to Resend + Lovable Cloud**
- Lovable rebuilds the email submission to go to Resend
- Quiz results stored in Lovable Cloud `quiz_results` table
- Kelli gets a dashboard inside Lovable to see archetype distribution
- Requires setting up new email sequences in Resend instead of Kit

**Recommendation:** If Kelli is already using Kit for her main email list, stick with Kit (Option A) so everything is in one place. If she wants the quiz data visible inside Lovable's dashboard, Option B is cleaner for her.

**Action required: Kelli to decide before Lovable builds the email/data layer.**

---

### 6. SEO — CONFIRMED

Lovable's SEO plan is approved as described:

- Quiz page title: "Are You Productive or Just Busy? - Entrepreneur Burnout Quiz"
- Each of the 4 result pages indexable at unique URLs (e.g. `/quiz/result/firefighter`)
- Unique meta description per result
- JSON-LD Quiz schema on the quiz page
- Internal links from blog posts 4 and 7

**Note:** The quiz lives at `https://quiz.entrepreneuranonymous.net` and is a single-page flow (no individual URLs per result). If Lovable wants indexable result pages, they should link to `https://quiz.entrepreneuranonymous.net` as the entry point and let the quiz handle the rest. Individual result URL routing would require changes to the quiz app itself.

---

### 7. Measurement — CONFIRMED

Lovable's tracking plan is approved:
- Quiz starts
- Completions
- Per-archetype distribution
- CTA click-through per archetype

Add UTM parameters to all CTA links so clicks are trackable in whatever analytics platform Kelli uses.

---

## Scoring Logic (for Lovable to implement)

Each question has 4 options. Option position maps to a letter:
- Position 1 (A) = most burned out / reactive response
- Position 2 (B) = struggling but aware
- Position 3 (C) = in-between / badge-wearing
- Position 4 (D) = healthiest response

Tally all 12 answers. The most-chosen letter wins. **Tiebreak order: B beats all ties, then A, then C, then D.**

| Winning letter | Result |
|---|---|
| A | Firefighter |
| B | Bottleneck |
| C | Badge Wearer |
| D | Recovering Workaholic |

---

## The 12 Questions (fixed, do not reorder)

Option order within each question is fixed. Scoring depends on position.

1. It's 9pm and a client emails. You:
   - A: reply instantly
   - B: reply but hate yourself for it
   - C: draft a reply then delete it
   - D: let it wait till morning

2. Someone offers to take a task off your plate. Your first thought:
   - A: they'll mess it up
   - B: it's faster if I do it
   - C: yes, but I'll check their work anyway
   - D: thank God

3. When did you last take a full day off with zero work check-ins?
   - A: what's a day off
   - B: I tried but kept checking
   - C: I took one and felt guilty the whole time
   - D: recently, and I actually unplugged

4. How do you answer "how are you?"
   - A: "Busy!"
   - B: "Surviving"
   - C: "Slammed but good"
   - D: an actual answer

5. Your to-do list at end of day:
   - A: longer than it started
   - B: untouched because fires
   - C: done, but you added more
   - D: mostly done, the rest can wait

6. Delegating feels like:
   - A: losing control
   - B: more work than doing it myself
   - C: something other people can afford
   - D: the only way I've grown

7. Your phone is:
   - A: never on silent, ever
   - B: full of unread messages you're "getting to"
   - C: the first thing you touch in the morning
   - D: on do not disturb after a set hour

8. When you finally sit down to relax, you feel:
   - A: restless, like something's on fire somewhere
   - B: guilty about what's not done
   - C: like you haven't earned it yet
   - D: actually relaxed, most days

9. Your team or clients would describe you as:
   - A: always available
   - B: hard to get decisions from because everything waits on you
   - C: impressive but exhausted
   - D: clear about when you're reachable

10. The last time you missed something personal (dinner, event, bedtime) because of work was:
    - A: this week
    - B: I can't remember, they blur together
    - C: recently, but it was worth it
    - D: rare, and I felt the cost when it happened

11. Honest answer: is your busyness producing results or just motion?
    - A: motion, if I'm real with myself
    - B: results, but at a cost I don't want to look at
    - C: results, and I wear the cost proudly
    - D: I've learned the difference the hard way

12. If your business ran for one week without you, what would happen?
    - A: total chaos
    - B: everything would stall waiting on my approval
    - C: it might survive but I'd check in constantly
    - D: it would mostly run fine

---

## Open Items Before Build Starts

- [ ] **Kelli:** Decide Kit vs. Resend for email capture (see Section 5)
- [x] **Kelli:** Provide real URL for "Save my seat" — `https://calendarlink.com/event/LWrqw`
- [x] **Kelli:** Provide real URL for "Join the EA Skool community" — `https://www.skool.com/entrepreneuranonymous/about`
- [ ] **Lovable:** Confirm they are rebuilding the quiz inside their platform (not embedding the Next.js app) — SEO and URL routing plan assumes this
- [ ] **Lovable:** Build all 4 result pages (not 3 — see correction in Section 3)
- [ ] **Lovable:** Use 3 minutes everywhere, not 2
