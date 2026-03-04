"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  MapPin,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Edit2,
  Trash2,
} from "lucide-react";
import { cn } from '@/lib/utils';
import type { ComplianceEvent } from "@/types/compliance-events";
import { useEventActions } from "@/hooks/use-compliance-events";

interface EventsListProps {
  events: ComplianceEvent[];
  loading: boolean;
  onEventUpdate: () => void;
}

export function EventsList({ events, loading, onEventUpdate }: EventsListProps) {
  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
  const { loading: actionLoading } = useEventActions();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-400 bg-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'high': return 'text-orange-400 bg-orange-400/20';
      case 'critical': return 'text-red-400 bg-red-400/20';
      default: return 'text-slate-400 bg-slate-400/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-slate-400 bg-slate-400/20';
      case 'approved': return 'text-green-400 bg-green-400/20';
      case 'rejected': return 'text-red-400 bg-red-400/20';
      case 'completed': return 'text-blue-400 bg-blue-400/20';
      case 'cancelled': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-slate-400 bg-slate-400/20';
    }
  };

  const getTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'tax_filing': return Calendar;
      case 'payment_due': return AlertTriangle;
      case 'deadline': return Clock;
      default: return Calendar;
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
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
            <span className="text-slate-400">Loading events...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card className="gradient-card border-slate-600/50">
        <CardContent className="p-8 text-center">
          <Calendar className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No events found</h3>
          <p className="text-slate-500">Try adjusting your filters or create a new event.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedEvents.length > 0 && (
        <Card className="gradient-card border-slate-600/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">
                {selectedEvents.length} event(s) selected
              </span>
              <div className="flex space-x-2">
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
                  className="gradient-button"
                  disabled={actionLoading}
                >
                  Bulk Actions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Events Grid */}
      <div className="grid gap-4">
        {events.map((event) => {
          const TypeIcon = getTypeIcon(event.event_type);
          const isSelected = selectedEvents.includes(event.id);
          const isOverdue = event.is_overdue;
          
          return (
            <Card 
              key={event.id}
              className={cn(
                "gradient-card border-slate-600/50 transition-all duration-200 hover:shadow-lg",
                isSelected && "ring-2 ring-purple-500/50",
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
                      className="mt-1 rounded border-slate-600 bg-slate-700 text-purple-600 focus:ring-purple-500"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <TypeIcon className="h-4 w-4 text-purple-400" />
                        <h3 className="font-semibold text-slate-200">{event.title}</h3>
                        {isOverdue && (
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                            OVERDUE
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                        {event.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={getPriorityColor(event.priority)}>
                          {event.priority.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <div className="flex items-center text-xs text-slate-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          {event.jurisdiction.name}
                        </div>
                        {event.source === 'ai_generated' && (
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                            AI Generated
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
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
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-slate-600 text-slate-400 hover:border-purple-500 hover:text-purple-400"
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    {event.status === 'draft' && (
                      <Button 
                        size="sm" 
                        className="gradient-button"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                    )}
                  </div>
                </div>
                
                {event.notes && (
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <p className="text-xs text-slate-500">{event.notes}</p>
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