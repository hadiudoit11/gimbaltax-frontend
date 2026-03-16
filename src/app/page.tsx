"use client";

import { useState } from "react";
import { Trash2, Info, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  GimbalAvatar,
  MessageList,
  ChatInput,
  StateSelector,
  SuggestedQuestions,
} from "@/components/chat";
import { useSalesTaxChat, useLangchainStatus } from "@/hooks/api/use-sales-tax-chat";

export default function Home() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [showStatus, setShowStatus] = useState(false);

  const {
    messages,
    isLoading,
    thinkingMessage,
    error,
    sendMessage,
    clearHistory,
    cancelRequest,
  } = useSalesTaxChat();

  const { data: status } = useLangchainStatus();

  const handleSend = (message: string) => {
    sendMessage(message, selectedState || undefined);
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question, selectedState || undefined);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-sky-100 to-emerald-100 dark:from-slate-950 dark:via-violet-950/50 dark:to-slate-900" />

      {/* Animated mesh blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/40 to-pink-400/40 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 -right-40 w-96 h-96 bg-gradient-to-br from-cyan-400/40 to-blue-400/40 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-gradient-to-br from-emerald-400/30 to-teal-400/30 rounded-full blur-3xl animate-blob animation-delay-4000" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-orange-300/30 to-amber-300/30 rounded-full blur-3xl animate-blob-slow" />
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />

      {/* Chat container */}
      <div className="relative flex flex-col h-screen max-w-3xl mx-auto bg-background/80 backdrop-blur-xl shadow-2xl border-x border-white/20 dark:border-white/5">
        {/* Header */}
        <header className="flex items-center justify-between px-5 py-4 border-b border-border/50 bg-background/95 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <GimbalAvatar size="md" />
            <div>
              <h1 className="font-semibold text-lg tracking-tight">Gimbal</h1>
              <p className="text-xs text-muted-foreground font-medium">Sales Tax Assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StateSelector value={selectedState} onChange={setSelectedState} />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowStatus(!showStatus)}
              className={`h-9 w-9 rounded-xl transition-colors ${showStatus ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              title="Show status"
            >
              <Info size={17} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={clearHistory}
              disabled={!hasMessages}
              className="h-9 w-9 rounded-xl text-muted-foreground hover:text-destructive disabled:opacity-40"
              title="Clear conversation"
            >
              <Trash2 size={17} />
            </Button>
          </div>
        </header>

        {/* Status panel */}
        {showStatus && status && (
          <div className="px-5 py-3 border-b border-border/50 bg-muted/30 animate-message-slide">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${status.status === "operational" ? "bg-emerald-500 shadow-sm shadow-emerald-500/50" : "bg-amber-500"}`} />
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium capitalize">{status.status}</span>
              </div>
              <div className="text-muted-foreground">
                <span className="font-semibold text-foreground">{status.vector_store.document_count.toLocaleString()}</span> government docs
              </div>
              <div className="text-muted-foreground">
                Model: <span className="font-medium text-foreground">{status.agent.llm_provider}</span>
              </div>
            </div>
          </div>
        )}

        {/* Chat area */}
        {!hasMessages ? (
          /* Welcome screen */
          <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
            <div className="text-center max-w-lg space-y-8">
              {/* Avatar with glow */}
              <div className="relative inline-block">
                <div className="absolute inset-0 blur-2xl opacity-30 bg-primary rounded-full scale-150" />
                <GimbalAvatar size="xl" className="relative" />
              </div>

              {/* Welcome text */}
              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  Hey, I'm Gimbal
                </h2>
                <p className="text-muted-foreground text-[15px] leading-relaxed max-w-md mx-auto">
                  Your sales tax expert, powered by 45,000+ official government documents across all 50 states. Ask me anything — from nexus thresholds to SaaS taxability.
                </p>
              </div>

              {/* Suggestions card */}
              <div className="welcome-card rounded-2xl p-5 text-left">
                <SuggestedQuestions
                  stateCode={selectedState}
                  onSelect={handleSuggestedQuestion}
                />
              </div>

              {/* Trust badge */}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/80">
                <Zap size={12} className="text-primary" />
                <span>Only cites official .gov sources</span>
              </div>
            </div>
          </div>
        ) : (
          /* Message list */
          <MessageList
            messages={messages}
            isLoading={isLoading}
            thinkingMessage={thinkingMessage}
          />
        )}

        {/* Error display */}
        {error && (
          <div className="px-5 py-3 bg-destructive/5 border-y border-destructive/10 text-destructive text-sm text-center font-medium animate-message-slide">
            {error}
          </div>
        )}

        {/* Suggested questions after messages */}
        {hasMessages && !isLoading && (
          <div className="px-5 py-4 border-t border-border/50 bg-muted/20">
            <SuggestedQuestions
              stateCode={selectedState}
              onSelect={handleSuggestedQuestion}
            />
          </div>
        )}

        {/* Input */}
        <ChatInput
          onSend={handleSend}
          onCancel={cancelRequest}
          isLoading={isLoading}
          disabled={false}
          placeholder={
            selectedState
              ? `Ask about ${selectedState} sales tax...`
              : "Ask me anything about sales tax..."
          }
        />

        {/* Footer */}
        <footer className="text-center py-2.5 text-[11px] text-muted-foreground/60 border-t border-border/30 bg-background/60 backdrop-blur-sm">
          <span className="font-medium">Gimbal</span> • AI-powered sales tax research
        </footer>
      </div>
    </div>
  );
}

/* ============================================================
 * COMMENTED OUT: Original Dashboard component
 * Preserved for future use - can be moved to /dashboard route
 * ============================================================
 *
 * import { AppShell } from "@/components/layout/app-shell";
 * import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 * import { Button } from "@/components/ui/button";
 * import { USStatesMap } from "@/components/dashboard/us-states-map";
 * import { useDashboardStats } from "@/hooks/use-dashboard-stats";
 * import { Building2, FileText, Bot, Calculator, AlertCircle, Plus, Loader2 } from "lucide-react";
 *
 * export default function Dashboard() {
 *   const stats = useDashboardStats();
 *   return (
 *     <AppShell>
 *       <div className="space-y-6">
 *         ... (full dashboard JSX preserved)
 *       </div>
 *     </AppShell>
 *   );
 * }
 */
