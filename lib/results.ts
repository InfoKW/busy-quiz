// All copy is final and approved (Appendix B).
// Quote wording must NOT be edited — verified word for word against Entrepreneurs Anonymous.

export type ResultType =
  | "firefighter"
  | "bottleneck"
  | "badge_wearer"
  | "recovering_workaholic";

export type Result = {
  id: ResultType;
  name: string;
  tagline: string;
  diagnosis: string;
  quote: string;
  quoteAttribution: string;
};

export const results: Record<ResultType, Result> = {
  firefighter: {
    id: "firefighter",
    name: "The Firefighter",
    tagline: "Everything is urgent. You run on crisis.",
    diagnosis:
      "You don't manage your business, you rescue it. Every day starts with a fire and ends with three more. The adrenaline feels like productivity, but crisis mode isn't a strategy, it's a habit. And the longer you run on it, the harder it gets to tell a real emergency from a Tuesday. The good news: fires can be prevented, not just fought. That starts with systems and people you trust to hold the hose.",
    quote:
      "Most business owners get stuck here, spending their days putting out fires instead of preventing them.",
    quoteAttribution: "Chapter 1, The Ownership Trap — Entrepreneurs Anonymous by Kelli Lewis",
  },
  bottleneck: {
    id: "bottleneck",
    name: "The Bottleneck",
    tagline: "Nothing moves without you because you can't let go.",
    diagnosis:
      "Your business has one point of failure and it's you. Every decision, every approval, every task routes through your desk, and you tell yourself that's quality control. It's actually a ceiling. Your team can't grow, your business can't scale, and you can't rest, all for the same reason. Delegation isn't losing control, it's building a business that doesn't collapse when you close your laptop.",
    quote:
      "Your business has become dependent on you, and you've become dependent on being needed.",
    quoteAttribution: "Chapter 1, The Ownership Trap — Entrepreneurs Anonymous by Kelli Lewis",
  },
  badge_wearer: {
    id: "badge_wearer",
    name: "The Badge Wearer",
    tagline: "Busy is your identity. Exhaustion is your trophy.",
    diagnosis:
      "Somewhere along the way, busy stopped being a season and became who you are. You answer \"how are you\" with your workload. You feel guilty resting even when nothing needs you. The hustle got applause for so long that slowing down feels like failing. But busy isn't the same as valuable, and you don't have to earn your right to rest. You already have it.",
    quote:
      "I wore my 80-hour workweeks like a badge of honor until my body and mind gave me a wake-up call that changed everything.",
    quoteAttribution: "The Mindset of Success — Entrepreneurs Anonymous by Kelli Lewis",
  },
  recovering_workaholic: {
    id: "recovering_workaholic",
    name: "The Recovering Workaholic",
    tagline: "You've started setting boundaries.",
    diagnosis:
      "You've done the hard part: you noticed. You've started protecting your evenings, letting your team own their work, and answering \"how are you\" with the truth. Recovery isn't a finish line though, it's a practice, and old habits love a busy season. Stay close to people who get it. That's exactly what Entrepreneurs Anonymous is for.",
    quote:
      "Your journey to business freedom isn't about achieving perfection. It's about progress.",
    quoteAttribution: "Closing chapter — Entrepreneurs Anonymous by Kelli Lewis",
  },
};
