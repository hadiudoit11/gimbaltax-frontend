"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock,
  Calendar,
  MapPin,
  Bot,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { cn } from '@/lib/utils';
import type { PendingComplianceEvent } from "@/types/compliance-events";
import { useEventActions } from "@/hooks/use-compliance-events";

interface PendingEventsListProps {
  events: PendingComplianceEvent[];
  loading: boolean;
  onEventUpdate: () => void;
}

export function PendingEventsList({ events, loading, onEventUpdate }: PendingEventsListProps) {
  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
  const [rejectionReason, setRejectionReason] = useState<{[key: number]: string}>({});
  const [showRejectionForm, setShowRejectionForm] = useState<number | null>(null);
  
  const { 
    loading: actionLoading, 
    error: actionError,
    approve, 
    reject, 
    bulkApprove 
  } = useEventActions();

  const handleApprove = async (eventId: number) => {
    try {
      await approve(eventId, { notes: 'Approved via pending events list' });
      onEventUpdate();
    } catch (error) {
      console.error('Failed to approve event:', error);
    }
  };

  const handleReject = async (eventId: number) => {
    const reason = rejectionReason[eventId];
    if (!reason?.trim()) {
      return;
    }
    
    try {
      await reject(eventId, { reason });
      setRejectionReason(prev => ({ ...prev, [eventId]: '' }));
      setShowRejectionForm(null);
      onEventUpdate();
    } catch (error) {
      console.error('Failed to reject event:', error);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedEvents.length === 0) return;
    
    try {
      await bulkApprove({
        event_ids: selectedEvents,
        notes: 'Bulk approved via pending events list'
      });
      setSelectedEvents([]);
      onEventUpdate();
    } catch (error) {
      console.error('Failed to bulk approve events:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'high': return 'text-orange-400 bg-orange-400/20 border-orange-400/30';
      case 'critical': return 'text-red-400 bg-red-400/20 border-red-400/30';
      default: return 'text-slate-400 bg-slate-400/20 border-slate-400/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Card className="gradient-card border-slate-600/50">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
            <span className="text-slate-400">Loading pending events...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card className="gradient-card border-slate-600/50">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No pending events</h3>
          <p className="text-slate-500">All AI-generated events have been reviewed.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with bulk actions */}
      <Card className="gradient-card border-slate-600/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-slate-200">
                <Clock className="h-5 w-5 mr-2 text-orange-400" />
                Pending AI-Generated Events
                <Badge className="ml-2 bg-orange-400/20 text-orange-400">
                  {events.length} awaiting review
                </Badge>
              </CardTitle>
              <p className="text-sm text-slate-400 mt-1">
                Review and approve or reject events discovered by AI research
              </p>
            </div>
            
            {selectedEvents.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-400">
                  {selectedEvents.length} selected
                </span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setSelectedEvents([])}
                  className="border-slate-600 text-slate-400"
                >
                  Clear
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleBulkApprove}
                  disabled={actionLoading || selectedEvents.length === 0}
                  className="gradient-button"
                >
                  {actionLoading ? (
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  )}
                  Approve All Selected
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Error Display */}
      {actionError && (
        <Card className="gradient-card border-red-500/50 bg-red-900/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-400">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{actionError}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Events List */}
      <div className="grid gap-4">
        {events.map((event) => {
          const isSelected = selectedEvents.includes(event.id);
          const isOverdue = event.is_overdue;
          const showRejectForm = showRejectionForm === event.id;
          
          return (
            <Card 
              key={event.id}
              className={cn(
                "gradient-card border-slate-600/50 transition-all duration-200 hover:shadow-lg",
                isSelected && "ring-2 ring-orange-500/50",
                isOverdue && "border-l-4 border-l-red-500"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEvents(prev => [...prev, event.id]);
                        } else {
                          setSelectedEvents(prev => prev.filter(id => id !== event.id));
                        }
                      }}
                      className="mt-1 rounded border-slate-600 bg-slate-700 text-orange-600 focus:ring-orange-500"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Bot className="h-4 w-4 text-purple-400" />
                        <h3 className="font-semibold text-slate-200">{event.title}</h3>
                        {isOverdue && (
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                            OVERDUE
                          </Badge>
                        )}
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                          AI Generated
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                        {event.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge className={getPriorityColor(event.priority)}>
                          {event.priority.toUpperCase()}
                        </Badge>
                        <Badge className="bg-slate-600/50 text-slate-300">
                          {event.event_type.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <div className="flex items-center text-xs text-slate-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          {event.jurisdiction.name}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-slate-400">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Due: {formatDate(event.due_date)}
                        </div>
                        {event.days_until_due >= 0 && (
                          <div className={cn(
                            "flex items-center",
                            event.days_until_due <= 7 ? "text-red-400" : 
                            event.days_until_due <= 30 ? "text-yellow-400" : "text-slate-400"
                          )}>
                            <Clock className="h-4 w-4 mr-1" />
                            {event.days_until_due} days
                          </div>
                        )}
                        {event.created_by_name && (
                          <span className="text-xs">
                            Created by: {event.created_by_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {showRejectForm ? (
                  <div className="space-y-3 p-3 bg-slate-800/50 rounded-lg border border-red-500/30">
                    <label className="block text-sm font-medium text-slate-300">
                      Rejection Reason
                    </label>
                    <textarea
                      value={rejectionReason[event.id] || ''}
                      onChange={(e) => setRejectionReason(prev => ({
                        ...prev,
                        [event.id]: e.target.value
                      }))}
                      placeholder="Explain why this event should be rejected..."
                      className="w-full rounded-md border border-slate-600/50 bg-slate-800/50 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                      rows={3}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setShowRejectionForm(null)}
                        className="border-slate-600 text-slate-400"
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleReject(event.id)}
                        disabled={actionLoading || !rejectionReason[event.id]?.trim()}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {actionLoading ? (
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        Confirm Rejection
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setShowRejectionForm(event.id)}
                      disabled={actionLoading}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      Reject
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleApprove(event.id)}
                      disabled={actionLoading}
                      className="gradient-button"
                    >
                      {actionLoading ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      )}
                      Approve
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}