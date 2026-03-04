"use client";

import React, { useState } from "react";
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
  Building2, 
  Plus, 
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Loader2,
  Globe,
  Settings,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useJurisdictions, JurisdictionType } from "@/hooks/api/use-jurisdictions";
import type { Jurisdiction } from "@/hooks/api/use-jurisdictions";
import { ResearchSourcesManager } from "@/components/jurisdictions/research-sources-manager";

function getJurisdictionTypeColor(type: string) {
  switch (type) {
    case "federal":
      return "bg-blue-900/20 text-blue-400 border-blue-600/50";
    case "state":
      return "bg-green-900/20 text-green-400 border-green-600/50";
    case "territory":
      return "bg-purple-900/20 text-purple-400 border-purple-600/50";
    case "local":
      return "bg-orange-900/20 text-orange-400 border-orange-600/50";
    default:
      return "bg-slate-800/50 text-slate-400 border-slate-600/50";
  }
}

export default function JurisdictionsPage() {
  const [search, setSearch] = useState("");
  const [expandedJurisdictions, setExpandedJurisdictions] = useState<Set<string>>(new Set());
  const [filters] = useState<{
    jurisdictionType?: JurisdictionType;
    isActive?: boolean;
  }>({});

  const toggleExpanded = (jurisdictionId: string) => {
    const newExpanded = new Set(expandedJurisdictions);
    if (newExpanded.has(jurisdictionId)) {
      newExpanded.delete(jurisdictionId);
    } else {
      newExpanded.add(jurisdictionId);
    }
    setExpandedJurisdictions(newExpanded);
  };

  const { data: jurisdictionsData, isLoading, error } = useJurisdictions({
    search: search || undefined,
    ...filters,
  });

  const jurisdictions = jurisdictionsData?.results || [];

  // Calculate stats from real data
  const federalCount = jurisdictions.filter((j: Jurisdiction) => j.jurisdiction_type === 'federal').length;
  const stateCount = jurisdictions.filter((j: Jurisdiction) => j.jurisdiction_type === 'state').length;
  const territoryCount = jurisdictions.filter((j: Jurisdiction) => j.jurisdiction_type === 'territory').length;
  const localCount = jurisdictions.filter((j: Jurisdiction) => j.jurisdiction_type === 'local').length;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold flex items-center">
              <Building2 className="h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-4 bg-gradient-to-r from-purple-500 to-cyan-500 p-1.5 sm:p-2 rounded-lg text-white flex-shrink-0" />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Jurisdictions & Research Sources
              </span>
            </h1>
            <p className="text-slate-400 mt-2 text-sm sm:text-base lg:text-lg">
              Manage tax jurisdictions and configure AI research sources
            </p>
          </div>
          <Button className="gradient-button shadow-lg shadow-purple-600/25 justify-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Jurisdiction
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="gradient-card border-slate-600/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search jurisdictions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-md border border-slate-600 bg-slate-800 pl-9 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                />
              </div>
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:border-cyan-500 hover:text-cyan-300">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-red-600">
                Error loading jurisdictions: {error.message}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Jurisdictions Table */}
        <Card className="gradient-card border-slate-600/50">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-200">
              <Globe className="h-5 w-5 mr-2 text-cyan-400" />
              All Jurisdictions
              {isLoading && <Loader2 className="h-4 w-4 ml-2 animate-spin text-cyan-400" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                <span className="ml-2 text-slate-300">Loading jurisdictions...</span>
              </div>
            ) : jurisdictions.length === 0 ? (
              <div className="text-center p-8 text-slate-400">
                No jurisdictions found
              </div>
            ) : (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-slate-800/50">
                      <TableHead className="text-slate-300">Code</TableHead>
                      <TableHead className="text-slate-300">Name</TableHead>
                      <TableHead className="text-slate-300">Type</TableHead>
                      <TableHead className="text-slate-300">Research Sources</TableHead>
                      <TableHead className="text-slate-300">Tax Configs</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-right text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jurisdictions.map((jurisdiction) => (
                      <React.Fragment key={jurisdiction.id}>
                        <TableRow className="border-slate-700 hover:bg-slate-800/30">
                          <TableCell className="font-mono text-sm text-slate-300">
                            {jurisdiction.code}
                          </TableCell>
                          <TableCell className="font-medium text-slate-200">
                            {jurisdiction.name}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline"
                              className={getJurisdictionTypeColor(jurisdiction.jurisdiction_type)}
                            >
                              {jurisdiction.jurisdiction_type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-slate-300">
                                {jurisdiction.research_sources?.length || 0} direct
                              </span>
                              <span className="text-slate-500">•</span>
                              <span className="text-sm text-slate-400">
                                {jurisdiction.all_research_sources?.length || 0} total
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-medium text-slate-300">
                              {jurisdiction.tax_configs_count}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline"
                              className={jurisdiction.is_active ? "bg-green-900/20 text-green-400 border-green-600/50" : "bg-red-900/20 text-red-400 border-red-600/50"}
                            >
                              {jurisdiction.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => toggleExpanded(jurisdiction.id)}
                                className="text-slate-400 hover:text-cyan-400"
                              >
                                <Settings className="h-4 w-4 mr-1" />
                                {expandedJurisdictions.has(jurisdiction.id) ? (
                                  <ChevronDown className="h-3 w-3" />
                                ) : (
                                  <ChevronRight className="h-3 w-3" />
                                )}
                              </Button>
                              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-cyan-400">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-cyan-400">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        {expandedJurisdictions.has(jurisdiction.id) && (
                          <TableRow className="border-slate-700">
                            <TableCell colSpan={7} className="p-6 bg-slate-800/20">
                              <ResearchSourcesManager jurisdiction={jurisdiction} />
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Cards with Real Data */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="gradient-card border-slate-600/50 shadow-xl shadow-blue-900/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">
                Federal Jurisdictions
              </CardTitle>
              <Building2 className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{federalCount}</div>
              <p className="text-xs text-slate-400">
                Federal level jurisdictions
              </p>
            </CardContent>
          </Card>
          
          <Card className="gradient-card border-slate-600/50 shadow-xl shadow-green-900/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">
                State Jurisdictions
              </CardTitle>
              <Building2 className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{stateCount}</div>
              <p className="text-xs text-slate-400">
                State level jurisdictions
              </p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-slate-600/50 shadow-xl shadow-purple-900/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">
                Territory Jurisdictions
              </CardTitle>
              <Building2 className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{territoryCount}</div>
              <p className="text-xs text-slate-400">
                Territory level jurisdictions
              </p>
            </CardContent>
          </Card>
          
          <Card className="gradient-card border-slate-600/50 shadow-xl shadow-orange-900/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">
                Local Jurisdictions
              </CardTitle>
              <Building2 className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-400">{localCount}</div>
              <p className="text-xs text-slate-400">
                Cities, counties, districts
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}