"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Grid,
  List,
} from "lucide-react";
import { cn } from '@/lib/utils';
import type { ComplianceEvent } from "@/types/compliance-events";

interface UpcomingEventsCalendarProps {
  events: ComplianceEvent[];
  loading: boolean;
  onEventUpdate: () => void;
}

export function UpcomingEventsCalendar({ events, loading, onEventUpdate }: UpcomingEventsCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedEvent, setSelectedEvent] = useState<ComplianceEvent | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get calendar data
  const getCalendarData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of the month and adjust for Sunday start
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Generate calendar days (6 weeks = 42 days)
    const days = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return { days, firstDay, lastDay };
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toDateString();
    return events.filter(event => {
      const eventDate = new Date(event.due_date);
      return eventDate.toDateString() === dateStr;
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const formatEventTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getPriorityColor = (priority: string, isSmall = false) => {
    const colors = {
      low: isSmall ? 'bg-green-400' : 'bg-green-500/20 text-green-400 border-green-500/30',
      medium: isSmall ? 'bg-yellow-400' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      high: isSmall ? 'bg-orange-400' : 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      critical: isSmall ? 'bg-red-400' : 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  if (loading) {
    return (
      <Card className="gradient-card border-slate-600/50">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
            <span className="text-slate-400">Loading calendar...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (viewMode === 'week') {
    const weekDays = getWeekDays();
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <Card className="gradient-card border-slate-600/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-slate-200">
                <Calendar className="h-5 w-5 mr-2 text-yellow-400" />
                Week View
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setViewMode('month')}
                  className="border-slate-600 text-slate-400"
                >
                  <Grid className="h-4 w-4 mr-1" />
                  Month
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigateWeek('prev')}
                  className="border-slate-600 text-slate-400"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-slate-300 min-w-[140px] text-center">
                  {currentDate.toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric',
                    day: 'numeric'
                  })}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigateWeek('next')}
                  className="border-slate-600 text-slate-400"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Week Calendar */}
        <Card className="gradient-card border-slate-600/50">
          <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-slate-400 p-2">
                  {day}
                </div>
              ))}
              
              {weekDays.map(date => {
                const dayEvents = getEventsForDate(date);
                const isToday = date.toDateString() === today.toDateString();
                
                return (
                  <div 
                    key={date.toDateString()}
                    className={cn(
                      "min-h-[120px] p-2 border border-slate-700/50 rounded-lg",
                      isToday && "bg-purple-900/20 border-purple-500/50"
                    )}
                  >
                    <div className={cn(
                      "text-sm font-medium mb-2",
                      isToday ? "text-purple-400" : "text-slate-300"
                    )}>
                      {date.getDate()}
                    </div>
                    
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map(event => (
                        <div
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className="text-xs p-1 rounded bg-slate-800/50 cursor-pointer hover:bg-slate-700/50 transition-colors"
                        >
                          <div className="flex items-center space-x-1">
                            <div className={cn("w-2 h-2 rounded-full", getPriorityColor(event.priority, true))} />
                            <span className="truncate text-slate-300">{event.title}</span>
                          </div>
                          <div className="text-slate-500">
                            {formatEventTime(event.due_date)}
                          </div>
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-slate-500 text-center">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Month View
  const { days } = getCalendarData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="gradient-card border-slate-600/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-slate-200">
              <Calendar className="h-5 w-5 mr-2 text-yellow-400" />
              Events Calendar
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setViewMode('week')}
                className="border-slate-600 text-slate-400"
              >
                <List className="h-4 w-4 mr-1" />
                Week
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigateMonth('prev')}
                className="border-slate-600 text-slate-400"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-lg font-semibold text-slate-200 min-w-[160px] text-center">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigateMonth('next')}
                className="border-slate-600 text-slate-400"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentDate(new Date())}
                className="border-slate-600 text-slate-400"
              >
                Today
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Grid */}
      <Card className="gradient-card border-slate-600/50">
        <CardContent className="p-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-slate-300 p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map(date => {
              const dayEvents = getEventsForDate(date);
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              const isToday = date.toDateString() === today.toDateString();
              const isPast = date < today;
              
              return (
                <div 
                  key={date.toDateString()}
                  className={cn(
                    "min-h-[100px] p-2 border border-slate-700/30 rounded-lg transition-all duration-200",
                    !isCurrentMonth && "opacity-50",
                    isToday && "bg-gradient-to-br from-purple-900/30 to-cyan-900/20 border-purple-500/50 shadow-lg",
                    isPast && isCurrentMonth && "bg-slate-800/20",
                    !isPast && isCurrentMonth && "hover:bg-slate-800/30 cursor-pointer"
                  )}
                >
                  <div className={cn(
                    "text-sm font-medium mb-2",
                    isToday ? "text-purple-400 font-bold" : 
                    isCurrentMonth ? "text-slate-300" : "text-slate-500"
                  )}>
                    {date.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className={cn(
                          "text-xs p-1 rounded cursor-pointer transition-all duration-200 hover:scale-105",
                          getPriorityColor(event.priority)
                        )}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="text-xs opacity-80">
                          {formatEventTime(event.due_date)}
                        </div>
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-slate-500 text-center py-1">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="gradient-card border-slate-600/50 shadow-2xl max-w-md w-full">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-slate-200 mb-2">{selectedEvent.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(selectedEvent.priority)}>
                      {selectedEvent.priority.toUpperCase()}
                    </Badge>
                    <Badge className="bg-slate-600/50 text-slate-300">
                      {selectedEvent.event_type.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedEvent(null)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-slate-300">{selectedEvent.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-slate-400" />
                    <span className="text-slate-400">Due:</span>
                    <span className="text-slate-200 ml-2">
                      {new Date(selectedEvent.due_date).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                    <span className="text-slate-400">Jurisdiction:</span>
                    <span className="text-slate-200 ml-2">{selectedEvent.jurisdiction.name}</span>
                  </div>
                  
                  {selectedEvent.days_until_due >= 0 ? (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                      <span className="text-slate-400">Time remaining:</span>
                      <span className={cn(
                        "ml-2 font-medium",
                        selectedEvent.days_until_due <= 7 ? "text-red-400" : 
                        selectedEvent.days_until_due <= 30 ? "text-yellow-400" : "text-green-400"
                      )}>
                        {selectedEvent.days_until_due === 0 ? 'Due today' : `${selectedEvent.days_until_due} days`}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-red-400" />
                      <span className="text-red-400 font-medium">
                        {Math.abs(selectedEvent.days_until_due)} days overdue
                      </span>
                    </div>
                  )}
                </div>

                {selectedEvent.notes && (
                  <div className="pt-3 border-t border-slate-700">
                    <p className="text-xs text-slate-400">{selectedEvent.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}