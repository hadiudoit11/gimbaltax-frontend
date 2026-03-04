"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Bot,
  Plus,
  Filter,
  Search,
  CalendarDays,
} from "lucide-react";
import { cn } from '@/lib/utils';
import { useComplianceEvents, usePendingEvents, useUpcomingEvents } from "@/hooks/use-compliance-events";
import { EventsList } from "@/components/compliance-events/events-list";
import { PendingEventsList } from "@/components/compliance-events/pending-events-list";
import { AIEventResearch } from "@/components/compliance-events/ai-event-research";
import { CreateEventForm } from "@/components/compliance-events/create-event-form";
import { UpcomingEventsCalendar } from "@/components/compliance-events/upcoming-events-calendar";
import { ComplianceCalendar } from "@/components/compliance/compliance-calendar";

type TabType = 'all' | 'pending' | 'upcoming' | 'calendar' | 'research' | 'create';

export default function ComplianceEventsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [filters, setFilters] = useState({
    search: '',
    event_type: '',
    priority: '',
    status: '',
  });

  const { events, loading: eventsLoading, refetch: refetchEvents } = useComplianceEvents(filters);
  const { pendingEvents, loading: pendingLoading, refetch: refetchPending } = usePendingEvents(true);
  const { upcomingEvents, loading: upcomingLoading, refetch: refetchUpcoming } = useUpcomingEvents(30);

  const handleEventUpdate = () => {
    refetchEvents();
    refetchPending();
    refetchUpcoming();
  };

  const handleResearchComplete = () => {
    refetchPending();
    setActiveTab('pending');
  };

  const tabs = [
    {
      id: 'all' as TabType,
      label: 'All Events',
      count: events.length,
      icon: Calendar,
      color: 'text-blue-400',
    },
    {
      id: 'pending' as TabType,
      label: 'Pending Approval',
      count: pendingEvents.length,
      icon: Clock,
      color: 'text-orange-400',
    },
    {
      id: 'upcoming' as TabType,
      label: 'Upcoming',
      count: upcomingEvents.filter(e => e.days_until_due <= 30).length,
      icon: AlertTriangle,
      color: 'text-yellow-400',
    },
    {
      id: 'calendar' as TabType,
      label: 'Calendar View',
      count: null,
      icon: CalendarDays,
      color: 'text-indigo-400',
    },
    {
      id: 'research' as TabType,
      label: 'AI Research',
      count: null,
      icon: Bot,
      color: 'text-purple-400',
    },
    {
      id: 'create' as TabType,
      label: 'Create Event',
      count: null,
      icon: Plus,
      color: 'text-green-400',
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold flex items-center">
              <Calendar className="h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-4 bg-gradient-to-r from-purple-500 to-cyan-500 p-1.5 sm:p-2 rounded-lg text-white flex-shrink-0" />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Compliance Events
              </span>
            </h1>
            <p className="text-slate-400 mt-2 text-sm sm:text-base lg:text-lg">
              Manage compliance deadlines and AI-powered event discovery
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <Card className="gradient-card border-slate-600/50 shadow-2xl shadow-purple-900/20">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <nav className="flex flex-wrap gap-1 bg-slate-800/50 rounded-lg p-1 w-full lg:w-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex items-center px-2 sm:px-3 md:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 flex-1 sm:flex-none justify-center sm:justify-start",
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg"
                          : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                      )}
                    >
                      <Icon className={cn("h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2", tab.color)} />
                      <span className="hidden xs:inline sm:inline">{tab.label}</span>
                      <span className="xs:hidden sm:hidden">{tab.label.split(' ')[0]}</span>
                      {tab.count !== null && (
                        <Badge 
                          className={cn(
                            "ml-1 sm:ml-2 text-xs",
                            activeTab === tab.id 
                              ? "bg-white/20 text-white" 
                              : "bg-slate-600 text-slate-300"
                          )}
                        >
                          {tab.count}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Quick Filters for All Events Tab */}
              {activeTab === 'all' && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="w-full sm:w-auto pl-10 pr-3 py-2 text-sm rounded-lg border border-slate-600/50 bg-slate-800/50 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-slate-600/50 text-slate-400 hover:border-purple-500/50 hover:text-purple-400 justify-center"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'all' && (
            <EventsList 
              events={events}
              loading={eventsLoading}
              onEventUpdate={handleEventUpdate}
            />
          )}
          
          {activeTab === 'pending' && (
            <PendingEventsList
              events={pendingEvents}
              loading={pendingLoading}
              onEventUpdate={handleEventUpdate}
            />
          )}
          
          {activeTab === 'upcoming' && (
            <UpcomingEventsCalendar
              events={upcomingEvents}
              loading={upcomingLoading}
              onEventUpdate={handleEventUpdate}
            />
          )}
          
          {activeTab === 'calendar' && (
            <ComplianceCalendar
              showAutoGenerated={true}
              className="w-full"
            />
          )}
          
          {activeTab === 'research' && (
            <AIEventResearch
              onResearchComplete={handleResearchComplete}
            />
          )}
          
          {activeTab === 'create' && (
            <CreateEventForm
              onEventCreated={handleEventUpdate}
            />
          )}
        </div>
      </div>
    </AppShell>
  );
}