"use client";

import { useState } from "react";
import { ExternalLink, ChevronDown, ChevronUp, FileText } from "lucide-react";
import type { Source } from "@/hooks/api/use-sales-tax-chat";

interface SourceCitationProps {
  sources: Source[];
}

export function SourceCitation({ sources }: SourceCitationProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group"
      >
        <FileText size={13} className="text-primary/60 group-hover:text-primary transition-colors" />
        <span>{sources.length} source{sources.length !== 1 ? "s" : ""} cited</span>
        {isExpanded ? (
          <ChevronUp size={13} className="text-muted-foreground/60" />
        ) : (
          <ChevronDown size={13} className="text-muted-foreground/60" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-2 animate-message-slide">
          {sources.map((source, index) => (
            <a
              key={index}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="source-citation flex items-start gap-3 text-xs p-3 rounded-xl transition-all duration-200 group hover:border-primary/30"
            >
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <ExternalLink size={13} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="font-medium text-foreground/90 truncate group-hover:text-primary transition-colors">
                  {source.title}
                </p>
                <p className="text-muted-foreground/70 truncate text-[11px] mt-0.5">
                  {source.url}
                </p>
                {source.snippet && (
                  <p className="text-muted-foreground/80 mt-1.5 line-clamp-2 leading-relaxed">
                    {source.snippet}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default SourceCitation;
