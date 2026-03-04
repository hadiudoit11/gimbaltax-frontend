"use client";

import { Sparkles } from "lucide-react";

interface SuggestedQuestionsProps {
  stateCode?: string | null;
  onSelect: (question: string) => void;
}

// General questions (no state selected)
const GENERAL_QUESTIONS = [
  "I sell software online — which states require me to collect sales tax?",
  "My company hit $100K in sales in Texas. Do I need to register?",
  "Is shipping and handling taxable or exempt?",
  "What's the difference between origin-based and destination-based sourcing?",
];

// State-specific question templates
const STATE_QUESTIONS: Record<string, string[]> = {
  default: [
    "What's the combined state + local tax rate in {state}?",
    "I'm selling to customers in {state} — when do I need to register?",
    "Are software subscriptions taxable in {state}?",
    "What items are exempt from sales tax in {state}?",
  ],
  NY: [
    "I sell $95 t-shirts online — is clothing under $110 really tax-free in NY?",
    "What's the total sales tax rate in NYC vs. upstate New York?",
    "Is my SaaS product taxable in New York if it's 100% cloud-based?",
    "I hit $500K in NY sales — what are my registration deadlines?",
  ],
  CA: [
    "Is my cloud software taxable in California or is SaaS exempt?",
    "How do California district taxes work for e-commerce sellers?",
    "I'm shipping from Nevada to California customers — what rate do I charge?",
    "Are digital downloads like ebooks and music taxable in CA?",
  ],
  TX: [
    "I sell IT consulting services — are professional services taxable in Texas?",
    "What's the combined tax rate in Houston vs. Dallas?",
    "Does Texas tax data processing and information services?",
    "I have $400K in Texas sales — have I triggered economic nexus?",
  ],
  FL: [
    "Florida just started taxing digital goods — what's covered?",
    "Is shipping taxable in Florida if I itemize it separately?",
    "I rent equipment to FL customers — is that taxable?",
    "What's the sales tax rate in Miami-Dade County?",
  ],
  WA: [
    "Washington has no income tax but has B&O tax — does sales tax stack on top?",
    "Are digital products like streaming services taxable in WA?",
    "What's the economic nexus threshold for Washington state?",
    "Is software customization labor taxable in Washington?",
  ],
  IL: [
    "What's the total tax rate in Chicago with all the local taxes?",
    "Is my SaaS product taxable in Illinois?",
    "Are food items taxed at a lower rate in Illinois?",
    "How does Illinois tax manufacturing equipment purchases?",
  ],
  OH: [
    "Does Ohio tax cloud computing and SaaS products?",
    "What's the difference between Ohio's sales tax and CAT tax?",
    "Are employment staffing services taxable in Ohio?",
    "I sell to Ohio school districts — do they get an exemption?",
  ],
};

// State name mapping
const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "Washington D.C.",
};

export function SuggestedQuestions({ stateCode, onSelect }: SuggestedQuestionsProps) {
  // Get questions based on state
  let questions: string[];

  if (!stateCode) {
    questions = GENERAL_QUESTIONS;
  } else if (STATE_QUESTIONS[stateCode]) {
    questions = STATE_QUESTIONS[stateCode];
  } else {
    // Use default template with state name
    const stateName = STATE_NAMES[stateCode] || stateCode;
    questions = STATE_QUESTIONS.default.map(q => q.replace("{state}", stateName));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
        <Sparkles size={12} className="text-primary/70" />
        <span>Try asking</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelect(question)}
            className="
              suggestion-pill
              px-4 py-2 text-[13px] rounded-xl font-medium
              text-foreground/80 hover:text-foreground
              active:scale-[0.98]
            "
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SuggestedQuestions;
