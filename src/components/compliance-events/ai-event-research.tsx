"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bot,
  Send,
  Loader2,
  Search,
  Calendar,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { cn } from '@/lib/utils';
import { useEventResearch } from "@/hooks/use-compliance-events";
import type { EventResearchRequest } from "@/types/compliance-events";

interface AIEventResearchProps {
  onResearchComplete: () => void;
}

export function AIEventResearch({ onResearchComplete }: AIEventResearchProps) {
  const [query, setQuery] = useState('');
  const [jurisdictionCode, setJurisdictionCode] = useState('');
  const [eventType, setEventType] = useState('');
  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');

  const { 
    isResearching, 
    results, 
    error, 
    startResearch, 
    resetResearch 
  } = useEventResearch();

  const handleResearch = async () => {
    if (!query.trim()) return;

    const request: EventResearchRequest = {
      query: query.trim(),
    };

    if (jurisdictionCode) request.jurisdiction_code = jurisdictionCode;
    if (eventType) request.event_type = eventType as any;
    if (dateRangeStart) request.date_range_start = dateRangeStart;
    if (dateRangeEnd) request.date_range_end = dateRangeEnd;

    try {
      await startResearch(request);
      // Results will be updated automatically by the hook
    } catch (error) {
      console.error('Research failed:', error);
    }
  };

  const handleNewResearch = () => {
    resetResearch();
    setQuery('');
    setJurisdictionCode('');
    setEventType('');
    setDateRangeStart('');
    setDateRangeEnd('');
  };

  const exampleQueries = [
    "Pennsylvania quarterly tax filing deadlines for 2024",
    "New York unemployment insurance payment due dates",
    "Federal payroll tax compliance deadlines",
    "California disability insurance renewal requirements",
    "Upcoming audit deadlines for small businesses"
  ];

  return (
    <div className="space-y-6">
      {/* Research Form */}
      <Card className="gradient-card border-slate-600/50 shadow-2xl shadow-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-200">
            <Bot className="h-6 w-6 mr-3 bg-gradient-to-r from-purple-500 to-cyan-500 p-1 rounded-lg text-white" />
            AI Event Research
          </CardTitle>
          <p className="text-slate-400">
            Discover compliance events using natural language queries. Our AI will analyze your query and generate relevant compliance events.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Main Query Input */}
          <div className="space-y-2">
            <label htmlFor="query" className="block text-sm font-medium text-slate-300">
              Research Query *
            </label>
            <textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., 'Pennsylvania quarterly tax filing deadlines for 2024'"
              rows={3}
              disabled={isResearching}
              className="w-full rounded-lg border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
            />
          </div>

          {/* Optional Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label htmlFor="jurisdiction" className="block text-sm font-medium text-slate-300">
                Jurisdiction Code
              </label>
              <input
                type="text"
                id="jurisdiction"
                value={jurisdictionCode}
                onChange={(e) => setJurisdictionCode(e.target.value)}
                placeholder="e.g., US-PA"
                disabled={isResearching}
                className="w-full rounded-lg border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="eventType" className="block text-sm font-medium text-slate-300">
                Event Type
              </label>
              <select
                id="eventType"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                disabled={isResearching}
                className="w-full rounded-lg border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                <option value="">All Types</option>
                <option value="tax_filing">Tax Filing</option>
                <option value="payment_due">Payment Due</option>
                <option value="registration">Registration</option>
                <option value="renewal">Renewal</option>
                <option value="audit">Audit</option>
                <option value="deadline">Compliance Deadline</option>
                <option value="rate_change">Rate Change</option>
                <option value="law_change">Law Change</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="startDate" className="block text-sm font-medium text-slate-300">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={dateRangeStart}
                onChange={(e) => setDateRangeStart(e.target.value)}
                disabled={isResearching}
                className="w-full rounded-lg border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="endDate" className="block text-sm font-medium text-slate-300">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={dateRangeEnd}
                onChange={(e) => setDateRangeEnd(e.target.value)}
                disabled={isResearching}
                className="w-full rounded-lg border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                onClick={handleResearch}
                disabled={!query.trim() || isResearching}
                className="gradient-button shadow-lg shadow-purple-600/25"
              >
                {isResearching ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                {isResearching ? 'Researching...' : 'Start AI Research'}
              </Button>
              
              {(results || error) && (
                <Button
                  onClick={handleNewResearch}
                  variant="outline"
                  className="border-slate-600/50 text-slate-400 hover:border-purple-500/50 hover:text-purple-400"
                >
                  New Research
                </Button>
              )}
            </div>

            {isResearching && (
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <div className="animate-pulse flex space-x-1">
                  <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span>AI analyzing compliance requirements...</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Example Queries */}
      {!results && !error && !isResearching && (
        <Card className="gradient-card border-slate-600/50">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-200">
              <Lightbulb className="h-5 w-5 mr-2 text-yellow-400" />
              Example Queries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(example)}
                  className="text-left p-3 rounded-lg bg-slate-800/30 hover:bg-slate-700/50 transition-colors border border-slate-700/50 hover:border-purple-500/30"
                >
                  <span className="text-sm text-slate-300">{example}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="gradient-card border-red-500/50 bg-red-900/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-400">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <h4 className="font-medium">Research Failed</h4>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Research Results */}
      {results && (
        <Card className="gradient-card border-slate-600/50 shadow-2xl shadow-green-900/20">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-200">
              <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
              Research Results
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Results Summary */}
            <div className="p-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg border border-green-500/30">
              <h4 className="font-semibold mb-2 text-slate-200">Research Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Query:</span>
                  <p className="text-slate-200 font-medium">{results.query}</p>
                </div>
                <div>
                  <span className="text-slate-400">Events Found:</span>
                  <p className="text-green-400 font-bold text-lg">{results.events_found}</p>
                </div>
                <div>
                  <span className="text-slate-400">Events Created:</span>
                  <p className="text-green-400 font-bold text-lg">{results.events_converted}</p>
                </div>
                <div>
                  <span className="text-slate-400">Success:</span>
                  <p className={results.success ? 'text-green-400' : 'text-red-400'}>
                    {results.success ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Session: {results.session_id}
              </p>
            </div>

            {/* Generated Events Preview */}
            {results.pending_events && results.pending_events.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-slate-200">
                    Generated Events ({results.pending_events.length})
                  </h4>
                  <Button
                    onClick={onResearchComplete}
                    className="gradient-button"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Review Pending Events
                  </Button>
                </div>

                <div className="grid gap-3">
                  {results.pending_events.map((event) => (
                    <div 
                      key={event.id}
                      className="p-4 rounded-lg bg-slate-800/50 border border-slate-600/50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-slate-200 mb-1">{event.title}</h5>
                          <p className="text-sm text-slate-400 mb-2">{event.description}</p>
                          
                          <div className="flex items-center space-x-4 text-xs text-slate-500">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(event.due_date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {event.jurisdiction.name}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Badge className="bg-purple-500/20 text-purple-400">
                            {event.event_type.replace('_', ' ')}
                          </Badge>
                          <Badge className={cn(
                            event.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                            event.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                            event.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          )}>
                            {event.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Validation Errors */}
            {results.validation_errors && results.validation_errors.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-red-400 mb-3">Validation Errors</h4>
                <div className="space-y-2">
                  {results.validation_errors.map((error, index) => (
                    <div key={index} className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                      <p className="text-sm text-red-300">{error}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Events Found */}
            {results.events_found === 0 && (
              <div className="text-center p-6 text-slate-500">
                <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <h4 className="text-lg font-medium mb-2">No Events Found</h4>
                <p className="text-sm">
                  The AI couldn't find any compliance events matching your query. 
                  Try adjusting your search terms or broadening the scope.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}