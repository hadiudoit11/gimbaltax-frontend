"use client";

import { useState } from "react";
import { ChevronDown, Check, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLangchainStates } from "@/hooks/api/use-sales-tax-chat";

// States without sales tax
const NO_SALES_TAX_STATES = ["AK", "DE", "MT", "NH", "OR"];

// Full state names
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

interface StateSelectorProps {
  value: string | null;
  onChange: (state: string | null) => void;
}

export function StateSelector({ value, onChange }: StateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: statesData } = useLangchainStates();

  // Get researched states sorted by document count
  const researchedStates = statesData?.states || [];
  const researchedStateCodes = new Set(researchedStates.map(s => s.code));

  // Get all states that have sales tax and are researched
  const availableStates = Object.entries(STATE_NAMES)
    .filter(([code]) => !NO_SALES_TAX_STATES.includes(code))
    .filter(([code]) => researchedStateCodes.has(code))
    .sort((a, b) => a[1].localeCompare(b[1]));

  const selectedName = value ? STATE_NAMES[value] || value : "All States";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          state-selector h-9 min-w-[150px] px-3 rounded-xl
          flex items-center justify-between gap-2
          text-sm font-medium transition-all duration-200
          ${isOpen ? 'ring-2 ring-primary/20 border-primary/40' : ''}
        `}
      >
        <span className="flex items-center gap-2">
          {value ? (
            <MapPin size={14} className="text-primary" />
          ) : (
            <Globe size={14} className="text-muted-foreground" />
          )}
          <span className="truncate">{selectedName}</span>
        </span>
        <ChevronDown
          size={14}
          className={`text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-2 w-72 max-h-96 overflow-y-auto bg-popover border border-border rounded-2xl shadow-xl z-50 animate-message-slide chat-scroll">
            <div className="p-2">
              {/* All States option */}
              <button
                onClick={() => {
                  onChange(null);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  !value ? "bg-primary/10 text-primary" : "hover:bg-muted"
                }`}
              >
                <Globe size={15} className={!value ? "text-primary" : "text-muted-foreground"} />
                <span className="flex-1 text-left">All States</span>
                {!value && <Check size={15} className="text-primary" />}
              </button>
            </div>

            <div className="h-px bg-border/50 mx-3" />

            {/* States with sales tax */}
            <div className="p-2">
              <p className="px-3 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                States with Coverage ({availableStates.length})
              </p>
              {availableStates.map(([code, name]) => {
                const stateInfo = researchedStates.find(s => s.code === code);
                const isSelected = value === code;
                return (
                  <button
                    key={code}
                    onClick={() => {
                      onChange(code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    }`}
                  >
                    <MapPin size={15} className={isSelected ? "text-primary" : "text-primary/60"} />
                    <span className="flex-1 text-left">{name}</span>
                    {stateInfo && (
                      <span className="text-[11px] text-muted-foreground font-normal px-2 py-0.5 bg-muted rounded-full">
                        {stateInfo.document_count.toLocaleString()}
                      </span>
                    )}
                    {isSelected && <Check size={15} className="text-primary" />}
                  </button>
                );
              })}
            </div>

            <div className="h-px bg-border/50 mx-3" />

            {/* States without sales tax */}
            <div className="p-2">
              <p className="px-3 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                No State Sales Tax
              </p>
              {NO_SALES_TAX_STATES.map((code) => {
                const isSelected = value === code;
                return (
                  <button
                    key={code}
                    onClick={() => {
                      onChange(code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      isSelected ? "bg-muted" : "hover:bg-muted/50"
                    }`}
                  >
                    <MapPin size={15} className="text-muted-foreground/50" />
                    <span className="flex-1 text-left text-muted-foreground">
                      {STATE_NAMES[code]}
                    </span>
                    <span className="text-[10px] text-muted-foreground/70 italic">
                      {code === "AK" ? "local only" : "no tax"}
                    </span>
                    {isSelected && <Check size={15} className="text-foreground" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default StateSelector;
