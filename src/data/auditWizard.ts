export type WizardFieldType = "select" | "text" | "email" | "textarea";

export interface WizardOption {
  value: string;
  label: string;
  hint?: string;
  score?: number; // contribution to the internal lead-fit score
}

export interface WizardStep {
  id: string;
  type: WizardFieldType;
  question: string;
  subtext?: string;
  placeholder?: string;
  optional?: boolean;
  options?: WizardOption[];
}

/**
 * The audit intake wizard — one question per screen. Select steps auto-advance;
 * text/email/textarea steps advance on Enter or the Continue button. Answers are
 * composed into the Contact `Message` field on submit (see composeMessage) so the
 * existing Airtable schema needs no new columns.
 */
export const wizardSteps: WizardStep[] = [
  {
    id: "focus",
    type: "select",
    question: "Where's the most time leaking right now?",
    subtext: "Pick the area that eats the most hours each week.",
    options: [
      { value: "Lead follow-up & sales", label: "Lead follow-up & sales", hint: "Chasing leads, quotes, pipeline", score: 20 },
      { value: "CRM & data entry", label: "CRM & data entry", hint: "Updating records, copy-paste work", score: 20 },
      { value: "Customer support", label: "Customer support", hint: "Repetitive questions, busy inboxes", score: 18 },
      { value: "Reporting & admin", label: "Reporting & admin", hint: "Weekly reports, invoicing", score: 18 },
      { value: "Scheduling & operations", label: "Scheduling & operations", hint: "Booking, dispatch, coordination", score: 16 },
      { value: "Something else", label: "Something else", hint: "Tell us in the next step", score: 10 },
    ],
  },
  {
    id: "detail",
    type: "textarea",
    question: "Walk us through it.",
    subtext:
      "What does that work look like today? The messier the better — that's exactly where an AI worker earns its keep.",
    placeholder:
      "e.g. Every morning I copy new leads from email into the CRM, then send the same 3 follow-ups by hand…",
  },
  {
    id: "team",
    type: "select",
    question: "How big is your team?",
    options: [
      { value: "Just me", label: "Just me", score: 10 },
      { value: "2–10", label: "2–10 people", score: 20 },
      { value: "11–50", label: "11–50 people", score: 20 },
      { value: "50+", label: "50+ people", score: 14 },
    ],
  },
  {
    id: "timeline",
    type: "select",
    question: "When do you want this handled?",
    options: [
      { value: "ASAP", label: "Yesterday — it's costing me now", score: 25 },
      { value: "This quarter", label: "This quarter", score: 18 },
      { value: "Exploring", label: "Just exploring for now", score: 8 },
    ],
  },
  {
    id: "tried",
    type: "select",
    question: "Tried to automate any of it before?",
    subtext: "No wrong answer — it just helps us pitch you the right next step.",
    optional: true,
    options: [
      { value: "Not yet", label: "Not yet", score: 8 },
      { value: "DIY tools", label: "DIY tools (Zapier, Make, etc.)", score: 12 },
      { value: "Hired help", label: "Hired a freelancer or agency", score: 14 },
      { value: "Other", label: "Other", score: 8 },
    ],
  },
  {
    id: "name",
    type: "text",
    question: "Who are we sending the audit to?",
    placeholder: "Jane Smith",
  },
  {
    id: "email",
    type: "email",
    question: "Where should the audit land?",
    subtext:
      "We'll email your 1–3 highest-impact opportunities within one business day. No call required, no spam.",
    placeholder: "jane@company.com",
  },
];

export function leadScore(answers: Record<string, string>): number {
  let score = 0;
  for (const step of wizardSteps) {
    if (!step.options) continue;
    const opt = step.options.find((o) => o.value === answers[step.id]);
    if (opt?.score) score += opt.score;
  }
  return Math.min(100, score);
}

/** Fold every wizard answer + the lead-fit score into a single Message string. */
export function composeMessage(answers: Record<string, string>): string {
  return [
    `Primary time-sink: ${answers.focus || "—"}`,
    ``,
    `Details: ${answers.detail || "—"}`,
    ``,
    `Team size: ${answers.team || "—"}`,
    `Timeline: ${answers.timeline || "—"}`,
    `Tried before: ${answers.tried || "—"}`,
    ``,
    `Lead-fit score: ${leadScore(answers)}/100`,
  ].join("\n");
}
