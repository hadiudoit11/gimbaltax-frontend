"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  FileText, 
  Plus, 
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Bot,
  History
} from "lucide-react";
import { 
  useTaxConfigs, 
  usePendingTaxConfigs,
  useTaxConfig,
  useDeleteTaxConfig,
  useCreateTaxConfig,
  useUpdateTaxConfig,
  taxConfigKeys
} from "@/hooks/api/use-tax-configs";
import { 
  useApproveConfigurations,
  useRejectConfiguration,
  useAgentSessions, 
  useAgentSession,
  useStartAgentResearch, 
  useAgentStream, 
  useAgentResults,
  AgentStreamEvent,
  AgentResearchSession
} from "@/hooks/api/use-agent-research";
import { useAgentResearch } from '@/lib/useAgentResearch';
import { useQueryClient } from "@tanstack/react-query";
import { TaxCategory, TaxConfigStatus, TaxConfig } from "@/api-client/types";
import type { TaxConfigCreate } from "@/api-client/types/tax-config-create";
import type { TaxConfigUpdate } from "@/api-client/types/tax-config-update";
import type { PendingTaxConfig } from "@/api-client/types/pending-tax-config";
import { TaxConfigForm } from "@/components/tax-configs/tax-config-form";
import { cn } from "@/lib/utils";
import { FormEvent, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function getCategoryColor(category: string) {
  switch (category) {
    case "income_tax":
      return "bg-blue-100 text-blue-800";
    case "social_insurance":
      return "bg-green-100 text-green-800";
    case "unemployment_insurance":
      return "bg-yellow-100 text-yellow-800";
    case "disability_insurance":
      return "bg-purple-100 text-purple-800";
    case "paid_family_medical_leave":
      return "bg-pink-100 text-pink-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "inactive":
      return "bg-red-100 text-red-800";
    case "draft":
      return "bg-yellow-100 text-yellow-800";
    case "superseded":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "active":
      return <CheckCircle className="h-4 w-4" />;
    case "inactive":
      return <XCircle className="h-4 w-4" />;
    case "draft":
      return <Clock className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
}

function formatCategory(category: string) {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

type TabType = 'all' | 'pending' | 'research' | 'create';

function TaxConfigsPageContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TaxCategory | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<TaxConfigStatus | undefined>();
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [selectedConfigId, setSelectedConfigId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingConfigId, setEditingConfigId] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  // AI Research state
  const [query, setQuery] = useState("");
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [useSimpleStreaming, setUseSimpleStreaming] = useState(true);

  // Set initial tab from URL params
  useEffect(() => {
    const tabParam = searchParams.get('tab') as TabType;
    if (tabParam && ['all', 'pending', 'research', 'create'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Queries
  const { data: taxConfigsData, isLoading: isLoadingConfigs } = useTaxConfigs({
    search: search || undefined,
    category: selectedCategory,
    status: selectedStatus,
  });

  const { data: pendingConfigsData, isLoading: isLoadingPending, error: pendingError } = usePendingTaxConfigs();

  const { data: selectedConfig } = useTaxConfig(selectedConfigId || '');

  // AI Research hooks
  const {
    status: streamStatus,
    sessionId: streamSessionId,
    progress: streamProgress,
    events: streamEvents,
    result: streamResult,
    error: streamError,
    startResearch,
    reset
  } = useAgentResearch();

  // Complex API hooks for research
  const { data: sessionsData } = useAgentSessions();
  const { data: currentSessionData } = useAgentSession(currentSessionId || '');
  const { data: resultsData } = useAgentResults(currentSessionId || '');
  const { events, isConnected, error: complexStreamError, clearEvents } = useAgentStream(currentSessionId);
  const startResearchMutation = useStartAgentResearch();

  const queryClient = useQueryClient();
  const deleteConfigMutation = useDeleteTaxConfig();
  const createConfigMutation = useCreateTaxConfig();
  const updateConfigMutation = useUpdateTaxConfig();
  const approveConfigsMutation = useApproveConfigurations();
  const rejectConfigMutation = useRejectConfiguration();

  const { data: editingConfig } = useTaxConfig(editingConfigId || '');

  const taxConfigs = taxConfigsData?.results || [];
  const pendingConfigs = pendingConfigsData?.results || [];

  // AI Research calculated values
  const activeEvents = useSimpleStreaming ? streamEvents : events;
  const activeError = useSimpleStreaming ? streamError : complexStreamError;
  const activeSessionId = useSimpleStreaming ? streamSessionId : currentSessionId;
  const activeResults = useSimpleStreaming ? streamResult : resultsData;
  const isResearching = useSimpleStreaming ? 
    (streamStatus === 'starting' || streamStatus === 'streaming') :
    (currentSession?.status === 'running' || currentSession?.status === 'pending' || (currentSessionId && !currentSession));

  const sessions = Array.isArray(sessionsData?.results) ? sessionsData.results : [];
  const currentSession = currentSessionData || sessions.find((s: { id?: string; session_id?: string }) => 
    (s.id === currentSessionId) || (s.session_id === currentSessionId)
  );

  // Extract pending_configs from AgentResearchResult and filter out validation errors
  const rawConfigs = Array.isArray(activeResults?.pending_configs) ? activeResults.pending_configs : [];
  const configs: PendingTaxConfig[] = rawConfigs.filter((config: any) => {
    if (typeof config === 'object' && config !== null) {
      if (Array.isArray(config.tax_id) || Array.isArray(config.name) || Array.isArray(config.category)) {
        return false;
      }
      return config.id && typeof config.tax_id === 'string' && typeof config.name === 'string';
    }
    return false;
  });

  const showResults = activeSessionId && configs.length > 0;

  // Debug logging
  if (pendingConfigsData) {
    console.log('Pending configs data:', pendingConfigsData);
    console.log('Pending configs count:', pendingConfigs.length);
  }
  if (pendingError) {
    console.error('Error loading pending configs:', pendingError);
  }

  // Calculate stats
  const activeCount = taxConfigs.filter((c: TaxConfig) => c.status === 'active').length;
  const draftCount = taxConfigs.filter((c: TaxConfig) => c.status === 'draft').length;
  const pendingCount = pendingConfigs.length;

  const displayConfigs = activeTab === "pending" ? pendingConfigs : taxConfigs;
  const isLoading = activeTab === "pending" ? isLoadingPending : isLoadingConfigs;

  const handleViewDetails = (id: string) => {
    setSelectedConfigId(id);
  };

  const handleCloseDetails = () => {
    setSelectedConfigId(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this tax configuration?')) {
      try {
        await deleteConfigMutation.mutateAsync(id);
        if (selectedConfigId === id) {
          setSelectedConfigId(null);
        }
      } catch (error) {
        console.error('Failed to delete tax config:', error);
      }
    }
  };

  const handleCreate = async (data: TaxConfigCreate) => {
    try {
      await createConfigMutation.mutateAsync(data);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create tax config:', error);
      throw error;
    }
  };

  const handleUpdate = async (data: TaxConfigUpdate) => {
    if (!editingConfigId) return;
    try {
      await updateConfigMutation.mutateAsync({ id: editingConfigId, data });
      setEditingConfigId(null);
      if (selectedConfigId === editingConfigId) {
        setSelectedConfigId(null);
        // Refresh the detail view
        setTimeout(() => setSelectedConfigId(editingConfigId), 100);
      }
    } catch (error) {
      console.error('Failed to update tax config:', error);
      throw error;
    }
  };

  const handleEdit = (id: string) => {
    setEditingConfigId(id);
    setSelectedConfigId(null);
  };

  const handleApprovePending = async (id: string) => {
    try {
      await approveConfigsMutation.mutateAsync({ configIds: [id] });
      // Invalidate pending configs query to refresh the list
      queryClient.invalidateQueries({ queryKey: taxConfigKeys.pending() });
      queryClient.invalidateQueries({ queryKey: taxConfigKeys.lists() });
    } catch (error) {
      console.error('Failed to approve config:', error);
    }
  };

  const handleRejectPending = async (id: string, reason: string) => {
    try {
      await rejectConfigMutation.mutateAsync({ configId: id, reason });
      // Invalidate pending configs query to refresh the list
      queryClient.invalidateQueries({ queryKey: taxConfigKeys.pending() });
      queryClient.invalidateQueries({ queryKey: taxConfigKeys.lists() });
    } catch (error) {
      console.error('Failed to reject config:', error);
    }
  };

  const handleRefreshPending = () => {
    queryClient.invalidateQueries({ queryKey: taxConfigKeys.pending() });
  };

  // AI Research handlers
  const handleStartResearch = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    
    if (useSimpleStreaming) {
      await startResearch({
        query,
        auto_approve: false,
      });
    } else {
      try {
        clearEvents();
        const response = await startResearchMutation.mutateAsync({ query });
        const sessionId = response?.session_id || response?.id;
        if (sessionId) {
          setCurrentSessionId(sessionId);
        }
      } catch (error) {
        console.error('Failed to start research:', error);
      }
    }
  };

  const handleApproveConfig = async (configId: string) => {
    try {
      await approveConfigsMutation.mutateAsync({ configIds: [configId] });
    } catch (error) {
      console.error('Failed to approve configuration:', error);
    }
  };

  const handleRejectConfig = async (configId: string, reason: string) => {
    try {
      await rejectConfigMutation.mutateAsync({ configId, reason });
    } catch (error) {
      console.error('Failed to reject configuration:', error);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold flex items-center">
              <FileText className="h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-4 bg-gradient-to-r from-purple-500 to-cyan-500 p-1.5 sm:p-2 rounded-lg text-white flex-shrink-0" />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Tax Configurations
              </span>
            </h1>
            <p className="text-slate-400 mt-2 text-sm sm:text-base lg:text-lg">
              Manage payroll tax configurations and AI-powered research
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Configs
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCount}</div>
              <p className="text-xs text-muted-foreground">
                Currently active tax configurations
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Draft Configs
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{draftCount}</div>
              <p className="text-xs text-muted-foreground">
                Draft configurations pending activation
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Review
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">
                Configurations awaiting approval
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <Card className="gradient-card border-slate-600/50 shadow-2xl shadow-purple-900/20">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <nav className="flex flex-wrap gap-1 bg-slate-800/50 rounded-lg p-1 w-full lg:w-auto">
                {[
                  {
                    id: 'all' as TabType,
                    label: 'All Configs',
                    count: activeCount + draftCount,
                    icon: FileText,
                    color: 'text-blue-400',
                  },
                  {
                    id: 'pending' as TabType,
                    label: 'Pending Approval',
                    count: pendingCount,
                    icon: Clock,
                    color: 'text-orange-400',
                  },
                  {
                    id: 'research' as TabType,
                    label: 'AI Research',
                    count: activeEvents.length || null,
                    icon: Bot,
                    color: 'text-purple-400',
                  },
                  {
                    id: 'create' as TabType,
                    label: 'Create Config',
                    count: null,
                    icon: Plus,
                    color: 'text-green-400',
                  },
                ].map((tab) => {
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
            </div>
          </CardHeader>
        </Card>

        {/* Tab Content */}
        <div className="tab-content">
          {(activeTab === 'all' || activeTab === 'pending') && (
            <>
              {/* Search and Filters */}
              <Card>
                <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search tax configurations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <select
                      value={selectedCategory || ""}
                      onChange={(e) => setSelectedCategory(e.target.value as TaxCategory || undefined)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">All Categories</option>
                      {Object.values(TaxCategory).map((cat) => (
                        <option key={cat} value={cat}>
                          {formatCategory(cat)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <select
                      value={selectedStatus || ""}
                      onChange={(e) => setSelectedStatus(e.target.value as TaxConfigStatus || undefined)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">All Statuses</option>
                      {Object.values(TaxConfigStatus).map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {(selectedCategory || selectedStatus) && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCategory(undefined);
                        setSelectedStatus(undefined);
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tax Configs Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                {activeTab === "pending" ? "Pending Review" : "All Tax Configurations"}
                {isLoading && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
              </div>
              {activeTab === "pending" && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefreshPending}
                    disabled={isLoadingPending}
                    className="text-xs"
                  >
                    <Loader2 className={`h-3 w-3 mr-1 ${isLoadingPending ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDebug(!showDebug)}
                    className="text-xs"
                  >
                    {showDebug ? 'Hide' : 'Show'} Debug
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading tax configurations...</span>
              </div>
            ) : displayConfigs.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                {activeTab === "pending" 
                  ? "No pending tax configurations found. Pending configs are created when AI research completes."
                  : "No tax configurations found"}
                {pendingError && (
                  <div className="mt-2 text-sm text-red-600">
                    Error: {pendingError instanceof Error ? pendingError.message : String(pendingError)}
                  </div>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tax ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Jurisdiction</TableHead>
                    <TableHead>Effective From</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayConfigs.map((config: TaxConfig | any) => (
                    <TableRow key={config.id}>
                      <TableCell className="font-mono text-sm">
                        {config.tax_id || config.id?.slice(0, 8)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {config.name || "Unnamed Configuration"}
                      </TableCell>
                      <TableCell>
                        {config.category ? (
                          <Badge 
                            variant="secondary"
                            className={getCategoryColor(config.category)}
                          >
                            {formatCategory(config.category)}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {config.jurisdiction ? (
                          <div className="text-sm">
                            <div className="font-medium">
                              {typeof config.jurisdiction === 'object' 
                                ? config.jurisdiction.name 
                                : config.jurisdiction}
                            </div>
                            {typeof config.jurisdiction === 'object' && config.jurisdiction.code && (
                              <div className="text-xs text-muted-foreground font-mono">
                                {config.jurisdiction.code}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {config.effective_from ? (
                          <span className="text-sm">
                            {new Date(config.effective_from).toLocaleDateString()}
                          </span>
                        ) : config.created_at ? (
                          <span className="text-sm text-muted-foreground">
                            Created: {new Date(config.created_at).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge 
                            variant="secondary"
                            className={getStatusColor(config.status || 'draft')}
                          >
                            <span className="flex items-center gap-1">
                              {getStatusIcon(config.status || 'draft')}
                              {config.status ? config.status.charAt(0).toUpperCase() + config.status.slice(1) : "Draft"}
                            </span>
                          </Badge>
                          {activeTab === "pending" && config.validation_status && (
                            <Badge 
                              variant="outline"
                              className={
                                config.validation_status === 'valid' ? 'bg-green-50 text-green-700' :
                                config.validation_status === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                                'bg-red-50 text-red-700'
                              }
                            >
                              {config.validation_status}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewDetails(config.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {activeTab === "pending" ? (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleApprovePending(config.id)}
                                disabled={approveConfigsMutation.isPending || config.validation_status === 'invalid' || config.status === 'error'}
                                className="text-green-600 hover:text-green-700"
                              >
                                Approve
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleRejectPending(config.id, 'Rejected from tax configs page')}
                                disabled={rejectConfigMutation.isPending}
                                className="text-red-600 hover:text-red-700"
                              >
                                Reject
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEdit(config.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            
            {/* Debug Panel for Pending Configs */}
            {activeTab === "pending" && showDebug && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
                <p className="text-sm font-semibold mb-2">Debug Information:</p>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-medium">Pending Configs Count:</span> {pendingConfigs.length}
                  </div>
                  <div>
                    <span className="font-medium">Is Loading:</span> {isLoadingPending ? 'Yes' : 'No'}
                  </div>
                  {pendingError && (
                    <div>
                      <span className="font-medium text-red-600">Error:</span> {String(pendingError)}
                    </div>
                  )}
                  {pendingConfigsData && (
                    <div>
                      <span className="font-medium text-slate-300">Raw Data:</span>
                      <pre className="mt-1 text-xs bg-slate-900/50 text-slate-300 p-2 rounded border border-slate-600/50 overflow-auto max-h-64 font-mono">
                        {JSON.stringify(pendingConfigsData, null, 2)}
                      </pre>
                    </div>
                  )}
                  {pendingConfigs.length > 0 && (
                    <div>
                      <span className="font-medium text-slate-300">First Config:</span>
                      <pre className="mt-1 text-xs bg-slate-900/50 text-slate-300 p-2 rounded border border-slate-600/50 overflow-auto max-h-64 font-mono">
                        {JSON.stringify(pendingConfigs[0], null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
            </>
          )}

          {activeTab === 'research' && (
            <>
              {/* AI Research Content */}
              <Card className="gradient-card border-slate-600/50 shadow-2xl shadow-purple-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-200">
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full mr-2 animate-pulse" />
                      Start New Research
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleStartResearch} className="space-y-4">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-200">Research Query</label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="e.g., Pennsylvania unemployment insurance taxes for small business 2024"
                          className="flex-1 rounded-lg border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 disabled:opacity-50"
                          disabled={isResearching}
                        />
                        <div className="flex gap-2">
                          <Button 
                            type="submit"
                            disabled={!query.trim() || isResearching}
                            className="gradient-button px-4 sm:px-6 py-3 font-medium shadow-lg shadow-purple-600/25 disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none"
                          >
                            {isResearching ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Search className="h-4 w-4 mr-2" />
                            )}
                            <span className="hidden sm:inline">{isResearching ? "Researching..." : "Start Research"}</span>
                            <span className="sm:hidden">{isResearching ? "..." : "Start"}</span>
                          </Button>
                          {(streamStatus !== 'idle' || currentSessionId) && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={useSimpleStreaming ? reset : () => setCurrentSessionId(null)}
                              className="border-slate-600/50 text-slate-400 hover:border-red-500/50 hover:text-red-400 transition-all duration-300 px-3 sm:px-4"
                            >
                              Reset
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </form>
                  
                  <div className="text-sm text-slate-400">
                    <p className="font-medium mb-1 text-slate-300">Example queries:</p>
                    <ul className="space-y-1">
                      <li>• New York state unemployment insurance 2024</li>
                      <li>• California disability insurance rates and wage base</li>
                      <li>• Federal FUTA tax requirements for 2024</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Research Progress */}
              {activeSessionId && (
                <Card className="gradient-card border-slate-600/50 shadow-2xl shadow-purple-900/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-200">
                      <Clock className="h-5 w-5 mr-2 text-purple-400" />
                      Research Progress
                      {isResearching && (
                        <Badge className="ml-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white border-0">
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          In Progress
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activeEvents.length === 0 ? (
                      <div className="text-center p-8 text-slate-400">
                        {isResearching ? (
                          <div className="flex flex-col items-center space-y-2">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <p>Waiting for agent updates...</p>
                          </div>
                        ) : (
                          "No research events yet"
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {Array.isArray(activeEvents) && activeEvents.map((ev, idx) => (
                          <div key={idx} className="flex space-x-3 p-4 border border-slate-600/30 rounded-lg bg-gradient-to-r from-slate-800/50 to-slate-700/30 backdrop-blur-sm shadow-lg">
                            <span className="shrink-0 text-[10px] uppercase font-bold min-w-[4rem] px-2 py-1 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-center">
                              {ev.type}
                            </span>
                            <span className="flex-1 text-sm text-slate-200">
                              {ev.message}
                              {typeof ev.progress === 'number' && (
                                <span className="ml-2 text-xs text-purple-400 font-medium">
                                  ({ev.progress.toFixed(0)}%)
                                </span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Research Results */}
              {showResults && (
                <Card className="gradient-card border-slate-600/50 shadow-2xl shadow-green-900/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-200">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                      Research Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{configs.length}</div>
                        <p className="text-sm text-slate-300">Tax configurations generated</p>
                      </div>
                      
                      {configs.length > 0 && (
                        <div className="space-y-3">
                          {configs.map((config) => (
                            <div key={config.id} className="flex items-center justify-between p-3 border border-slate-600/30 rounded-lg bg-slate-800/50">
                              <div>
                                <p className="font-medium text-slate-200">{config.name || 'Unnamed Configuration'}</p>
                                <p className="text-sm text-slate-400">{config.tax_id}</p>
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => handleApproveConfig(config.id)}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  Approve
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleRejectConfig(config.id, 'Manual rejection')}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  Reject
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {activeTab === 'create' && (
            <Card className="gradient-card border-slate-600/50 shadow-2xl shadow-purple-900/20">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-200">
                  <Plus className="h-5 w-5 mr-2 text-green-400" />
                  Create Tax Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <TaxConfigForm
                  onSubmit={handleCreate}
                  onCancel={() => setActiveTab('all')}
                  isLoading={createConfigMutation.isPending}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Detail Modal */}
        {selectedConfigId && selectedConfig && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 z-40"
              onClick={handleCloseDetails}
            />
            {/* Modal */}
            <Card className="fixed inset-4 z-50 overflow-auto bg-background border-2 shadow-lg max-w-4xl mx-auto my-8">
              <CardHeader className="sticky top-0 bg-background border-b z-10">
                <div className="flex items-center justify-between">
                  <CardTitle>Tax Configuration Details</CardTitle>
                  <Button variant="ghost" size="sm" onClick={handleCloseDetails}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tax ID</label>
                    <p className="text-sm font-mono">{selectedConfig.tax_id || selectedConfig.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="text-sm">{selectedConfig.name || "Unnamed"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Category</label>
                    <p className="text-sm">
                      {selectedConfig.category ? formatCategory(selectedConfig.category) : "—"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Sub Category</label>
                    <p className="text-sm">{selectedConfig.sub_category || "—"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <Badge 
                      variant="secondary"
                      className={getStatusColor(selectedConfig.status || '')}
                    >
                      {selectedConfig.status || "Unknown"}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Authority</label>
                    <p className="text-sm">{selectedConfig.authority || "—"}</p>
                  </div>
                </div>
              </div>

              {/* Jurisdiction */}
              {selectedConfig.jurisdiction && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Jurisdiction</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {typeof selectedConfig.jurisdiction === 'object' ? (
                      <>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Name</label>
                          <p className="text-sm">{selectedConfig.jurisdiction.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Code</label>
                          <p className="text-sm font-mono">{selectedConfig.jurisdiction.code}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Type</label>
                          <p className="text-sm capitalize">{selectedConfig.jurisdiction.jurisdiction_type}</p>
                        </div>
                      </>
                    ) : (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Jurisdiction ID</label>
                        <p className="text-sm">{selectedConfig.jurisdiction}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Effective Dates */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Effective Dates</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Effective From</label>
                    <p className="text-sm">
                      {selectedConfig.effective_from 
                        ? new Date(selectedConfig.effective_from).toLocaleString()
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Effective To</label>
                    <p className="text-sm">
                      {selectedConfig.effective_to 
                        ? new Date(selectedConfig.effective_to).toLocaleString()
                        : "No expiration"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payload */}
              {selectedConfig.payload && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-slate-200">Tax Payload</h3>
                  <div className="bg-slate-800/50 p-4 rounded-md border border-slate-600/50">
                    <pre className="text-xs text-slate-300 overflow-auto max-h-96 font-mono">
                      {JSON.stringify(selectedConfig.payload, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedConfig.notes && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notes</h3>
                  <p className="text-sm whitespace-pre-wrap">{selectedConfig.notes}</p>
                </div>
              )}

              {/* Metadata */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Metadata</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Created At</label>
                    <p className="text-sm">
                      {selectedConfig.created_at 
                        ? new Date(selectedConfig.created_at).toLocaleString()
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Updated At</label>
                    <p className="text-sm">
                      {selectedConfig.updated_at 
                        ? new Date(selectedConfig.updated_at).toLocaleString()
                        : "—"}
                    </p>
                  </div>
                  {selectedConfig.created_by && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Created By</label>
                      <p className="text-sm">
                        {typeof selectedConfig.created_by === 'object'
                          ? selectedConfig.created_by.email || selectedConfig.created_by.username
                          : selectedConfig.created_by}
                      </p>
                    </div>
                  )}
                  {selectedConfig.schema_version && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Schema Version</label>
                      <p className="text-sm">{selectedConfig.schema_version}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={handleCloseDetails}>
                  Close
                </Button>
                <Button variant="outline" onClick={() => handleEdit(selectedConfig.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => handleDelete(selectedConfig.id)}
                  disabled={deleteConfigMutation.isPending}
                >
                  {deleteConfigMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
          </>
        )}


        {/* Edit Form Modal */}
        {editingConfigId && editingConfig && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setEditingConfigId(null)}
            />
            <Card className="fixed inset-4 z-50 overflow-auto bg-background border-2 shadow-lg max-w-4xl mx-auto my-8">
              <CardHeader className="sticky top-0 bg-background border-b z-10">
                <div className="flex items-center justify-between">
                  <CardTitle>Edit Tax Configuration</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setEditingConfigId(null)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <TaxConfigForm
                  initialData={editingConfig}
                  onSubmit={handleUpdate}
                  onCancel={() => setEditingConfigId(null)}
                  isLoading={updateConfigMutation.isPending}
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppShell>
  );
}

export default function TaxConfigsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TaxConfigsPageContent />
    </Suspense>
  );
}

