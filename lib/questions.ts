// Verbatim from the approved spec (Appendix A).
// Option order is FIXED — index 0 = a, 1 = b, 2 = c, 3 = d.
// Do NOT reorder options; scoring depends on position.

export type Question = {
  id: number;
  text: string;
  options: [string, string, string, string]; // exactly 4, order preserved
};

export const questions: Question[] = [
  {
    id: 1,
    text: "It's 9pm and a client emails. You:",
    options: [
      "reply instantly",
      "reply but hate yourself for it",
      "draft a reply then delete it",
      "let it wait till morning",
    ],
  },
  {
    id: 2,
    text: "Someone offers to take a task off your plate. Your first thought:",
    options: [
      "they'll mess it up",
      "it's faster if I do it",
      "yes, but I'll check their work anyway",
      "thank God",
    ],
  },
  {
    id: 3,
    text: "When did you last take a full day off with zero work check-ins?",
    options: [
      "what's a day off",
      "I tried but kept checking",
      "I took one and felt guilty the whole time",
      "recently, and I actually unplugged",
    ],
  },
  {
    id: 4,
    text: 'How do you answer "how are you?"',
    options: [
      '"Busy!"',
      '"Surviving"',
      '"Slammed but good"',
      "an actual answer",
    ],
  },
  {
    id: 5,
    text: "Your to-do list at end of day:",
    options: [
      "longer than it started",
      "untouched because fires",
      "done, but you added more",
      "mostly done, the rest can wait",
    ],
  },
  {
    id: 6,
    text: "Delegating feels like:",
    options: [
      "losing control",
      "more work than doing it myself",
      "something other people can afford",
      "the only way I've grown",
    ],
  },
  {
    id: 7,
    text: "Your phone is:",
    options: [
      "never on silent, ever",
      'full of unread messages you\'re "getting to"',
      "the first thing you touch in the morning",
      "on do not disturb after a set hour",
    ],
  },
  {
    id: 8,
    text: "When you finally sit down to relax, you feel:",
    options: [
      "restless, like something's on fire somewhere",
      "guilty about what's not done",
      "like you haven't earned it yet",
      "actually relaxed, most days",
    ],
  },
  {
    id: 9,
    text: "Your team or clients would describe you as:",
    options: [
      "always available",
      "hard to get decisions from because everything waits on you",
      "impressive but exhausted",
      "clear about when you're reachable",
    ],
  },
  {
    id: 10,
    text: "The last time you missed something personal (dinner, event, bedtime) because of work was:",
    options: [
      "this week",
      "I can't remember, they blur together",
      "recently, but it was worth it",
      "rare, and I felt the cost when it happened",
    ],
  },
  {
    id: 11,
    text: "Honest answer: is your busyness producing results or just motion?",
    options: [
      "motion, if I'm real with myself",
      "results, but at a cost I don't want to look at",
      "results, and I wear the cost proudly",
      "I've learned the difference the hard way",
    ],
  },
  {
    id: 12,
    text: "If your business ran for one week without you, what would happen?",
    options: [
      "total chaos",
      "everything would stall waiting on my approval",
      "it might survive but I'd check in constantly",
      "it would mostly run fine",
    ],
  },
];
