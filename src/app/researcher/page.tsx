"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, format } from "date-fns";
import { 
  Search,
  Brain,
  Plus,
  Calendar,
  BookOpen,
  FileText,
  Clock,
  Eye,
  Download,
  Share2,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Loader2
} from "lucide-react";
import { 
  useLangchainResearch, 
  useComplianceAnalysis,
  useLangchainStatus,
  useComplianceStatus,
  useVectorStoreStatus,
  type ResearchRequest,
  type ComplianceRequest
} from "@/hooks/api/use-researcher";
import { 
  useResearchResultsList, 
  useResearchResultDetail,
  type ResearchResult,
  type RelatedConfig,
  type ResearchResultsFilters 
} from "@/hooks/api/use-research-results";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const statusColors = {
  draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  published: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  archived: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
};

export default function ResearcherPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'new-research' | 'browse-results'>('new-research');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  
  // Research state
  const [query, setQuery] = useState('');
  const [modelName, setModelName] = useState<'gpt-4o' | 'gpt-4o-mini' | 'gpt-3.5-turbo'>('gpt-4o');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [showExamples, setShowExamples] = useState(false);

  // Hooks
  const langchainResearch = useLangchainResearch();
  
  // Status hooks
  const { data: langchainStatus } = useLangchainStatus();
  const { data: complianceStatus } = useComplianceStatus();
  const { data: vectorStoreStatus } = useVectorStoreStatus();

  // Research results API integration
  const filters: ResearchResultsFilters = {
    ...(searchQuery && { search: searchQuery }),
    ...(selectedStatus !== "all" && { status: selectedStatus as any }),
    page: 1,
    per_page: 20,
  };

  const { data: researchResults, isLoading: isLoadingResults, error: resultsError } = useResearchResultsList(filters);

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    langchainResearch.mutate({
      query: effectiveDate ? `${query} (effective date: ${effectiveDate})` : query,
      model_name: modelName,
      temperature: 0.1
    });
  };

  const handleViewResearch = (id: string) => {
    router.push(`/researcher/${id}`);
  };

  // Filter results from API
  const allResults = researchResults?.results || [];
  const filteredResults = allResults
    .filter(item => selectedJurisdiction === "all" || item.jurisdiction.name === selectedJurisdiction)
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "jurisdiction":
          return a.jurisdiction.name.localeCompare(b.jurisdiction.name);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  // Extract unique jurisdictions for filter
  const uniqueJurisdictions = [...new Set(allResults.map(item => item.jurisdiction.name))];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Tax Research
            </h1>
            <p className="text-gray-600 dark:text-slate-400 mt-2 text-sm sm:text-base">
              Conduct AI-powered tax research and browse historical results
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 rounded-lg bg-white/20 dark:bg-slate-800/50 p-1 backdrop-blur-sm">
          <button
            onClick={() => setActiveTab('new-research')}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
              activeTab === 'new-research' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 dark:from-purple-600 dark:to-cyan-600 text-white shadow-lg' 
                : 'text-gray-700 hover:text-gray-900 hover:bg-white/50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700/50'
            }`}
          >
            <Search className="mr-2 h-4 w-4 inline" />
            New Research
          </button>
          <button
            onClick={() => setActiveTab('browse-results')}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
              activeTab === 'browse-results' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 dark:from-purple-600 dark:to-cyan-600 text-white shadow-lg' 
                : 'text-gray-700 hover:text-gray-900 hover:bg-white/50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700/50'
            }`}
          >
            <BookOpen className="mr-2 h-4 w-4 inline" />
            Browse Results ({researchResults?.pagination.total || 0})
          </button>
        </div>

        {/* New Research Tab */}
        {activeTab === 'new-research' && (
          <div className="space-y-6">
            {/* Research Form */}
            <Card className="gradient-card border-gray-200 dark:border-slate-600/50">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800 dark:text-slate-200">
                  <Search className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Tax Research Agent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleResearch} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-800 dark:text-slate-200">
                        Research Query
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowExamples(!showExamples)}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {showExamples ? 'Hide' : 'Show'} Examples
                      </button>
                    </div>
                    
                    {showExamples && (
                      <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md text-xs max-h-64 overflow-y-auto">
                        <div className="text-blue-800 dark:text-blue-200 font-medium mb-2">Example Queries (22 States Researched):</div>
                        <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                          {/* Top researched states */}
                          <li>• "Georgia sales tax rate and local county taxes"</li>
                          <li>• "Texas sales tax nexus rules for e-commerce businesses"</li>
                          <li>• "Nevada sales tax exemptions for manufacturing equipment"</li>
                          <li>• "South Dakota sales tax on digital products and SaaS"</li>
                          <li>• "New York clothing exemption threshold - is it per item or per transaction?"</li>
                          <li>• "California sales tax rates by district and city"</li>
                          <li>• "New Jersey sales tax on prepared food vs groceries"</li>
                          <li>• "Illinois sales tax for remote sellers and marketplace facilitators"</li>
                          <li>• "North Dakota sales tax exemptions for agricultural equipment"</li>
                          <li>• "Virginia sales tax on digital goods and software"</li>
                          <li>• "Pennsylvania sales tax exemption for clothing"</li>
                          <li>• "North Carolina sales tax on food for home consumption"</li>
                          <li>• "Colorado state vs home rule city sales tax collection"</li>
                          <li>• "Florida sales tax holidays and exemptions"</li>
                          <li>• "Nebraska sales tax on services"</li>
                          <li>• "Minnesota sales tax on clothing and footwear"</li>
                          <li>• "Alabama state and local sales tax combined rates"</li>
                          <li>• "Connecticut luxury tax and sales tax rates"</li>
                          <li>• "Wyoming sales tax exemptions for small businesses"</li>
                          <li>• "Alaska local sales tax jurisdictions (no state tax)"</li>
                          <li>• "Oregon - does it have sales tax?"</li>
                          <li>• "Massachusetts sales tax on meals and prepared food"</li>
                        </ul>
                      </div>
                    )}
                    
                    <textarea
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Enter your tax research query in natural language..."
                      required
                      rows={3}
                      className="w-full rounded-md border border-gray-300 bg-white dark:border-slate-600 dark:bg-slate-800 px-3 py-2 text-sm text-gray-900 dark:text-slate-200 placeholder:text-gray-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent"
                      disabled={langchainResearch.isPending}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-slate-200">
                      Effective Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={effectiveDate}
                      onChange={(e) => setEffectiveDate(e.target.value)}
                      className="w-full rounded-md border border-gray-300 bg-white dark:border-slate-600 dark:bg-slate-800 px-3 py-2 text-sm text-gray-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent"
                      disabled={langchainResearch.isPending}
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                      Specify when the tax rules should be effective (e.g., for future tax years)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-slate-200">
                      AI Model
                    </label>
                    <select
                      value={modelName}
                      onChange={(e) => setModelName(e.target.value as 'gpt-4o' | 'gpt-4o-mini' | 'gpt-3.5-turbo')}
                      className="w-full rounded-md border border-gray-300 bg-white dark:border-slate-600 dark:bg-slate-800 px-3 py-2 text-sm text-gray-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-transparent"
                      disabled={langchainResearch.isPending}
                    >
                      <option value="gpt-4o">GPT-4o (Best Quality)</option>
                      <option value="gpt-4o-mini">GPT-4o Mini (Faster)</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Budget)</option>
                    </select>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={langchainResearch.isPending || !query}
                    className="w-full stat-card-blue border-none text-white hover:opacity-90"
                  >
                    {langchainResearch.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Researching...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Start Research
                      </>
                    )}
                  </Button>
                </form>

                {langchainResearch.error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 dark:bg-red-950/20 dark:border-red-800/50 rounded-md">
                    <p className="text-red-600 dark:text-red-400">{langchainResearch.error.message}</p>
                  </div>
                )}

                {langchainResearch.data && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 dark:bg-green-950/20 dark:border-green-800/50 rounded-md">
                    <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Research Completed</h4>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {langchainResearch.data.agent_response || 'Research completed successfully.'}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Browse Results Tab */}
        {activeTab === 'browse-results' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <Card className="gradient-card border-gray-200 dark:border-slate-600/50">
              <CardContent className="p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {/* Search */}
                  <div className="lg:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search research content, queries, or tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600"
                      />
                    </div>
                  </div>
                  
                  {/* Status Filter */}
                  <div>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full rounded-md border border-gray-300 bg-white dark:border-slate-600 dark:bg-slate-800 px-3 py-2 text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  
                  {/* Jurisdiction Filter */}
                  <div>
                    <select
                      value={selectedJurisdiction}
                      onChange={(e) => setSelectedJurisdiction(e.target.value)}
                      className="w-full rounded-md border border-gray-300 bg-white dark:border-slate-600 dark:bg-slate-800 px-3 py-2 text-sm"
                    >
                      <option value="all">All Jurisdictions</option>
                      {uniqueJurisdictions.map(jurisdiction => (
                        <option key={jurisdiction} value={jurisdiction}>{jurisdiction}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Secondary Filters */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600 dark:text-slate-400">Sort by:</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1 text-xs"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="jurisdiction">Jurisdiction</option>
                        <option value="status">Status</option>
                      </select>
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-slate-400">
                      {researchResults?.pagination.total || 0} result{(researchResults?.pagination.total || 0) !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loading State */}
            {isLoadingResults && (
              <Card className="gradient-card border-gray-200 dark:border-slate-600/50">
                <CardContent className="flex items-center justify-center h-64">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
                    <span className="text-gray-600 dark:text-slate-400">Loading research results...</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Error State */}
            {resultsError && (
              <Card className="gradient-card border-red-200 dark:border-red-600/50">
                <CardContent className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="text-red-600 dark:text-red-400 mb-4">
                    Failed to load research results
                  </div>
                  <Button onClick={() => window.location.reload()} variant="outline" className="border-red-500 text-red-600">
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Research Results */}
            {!isLoadingResults && !resultsError && (
              <div className="space-y-4">
                {filteredResults.map((item) => (
                  <Card key={item.id} className="gradient-card border-gray-200 dark:border-slate-600/50 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={statusColors[item.status]}>
                            {item.status}
                          </Badge>
                          <Badge variant="outline">{item.jurisdiction.name}</Badge>
                        </div>
                        <CardTitle className="text-lg leading-tight text-gray-800 dark:text-slate-200">
                          {item.title}
                        </CardTitle>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Excerpt */}
                    <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-2">
                      {item.excerpt}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-600 dark:text-slate-400">
                        <Clock className="h-3 w-3" />
                        <span>{item.reading_time} min read</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-slate-400">
                        <FileText className="h-3 w-3" />
                        <span>{item.related_configs_count} configs</span>
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-slate-600">
                      <div className="text-xs text-gray-500 dark:text-slate-400">
                        {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewResearch(item.id)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-3 w-3 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredResults.length === 0 && (
                <Card className="gradient-card border-gray-200 dark:border-slate-600/50">
                  <CardContent className="flex flex-col items-center justify-center h-64 text-center">
                    <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 dark:text-slate-200 mb-2">
                      No research results found
                    </h3>
                    <p className="text-gray-600 dark:text-slate-400 mb-4">
                      Try adjusting your search criteria or create new research.
                    </p>
                    <Button 
                      onClick={() => setActiveTab('new-research')}
                      className="stat-card-blue border-none text-white"
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Start New Research
                    </Button>
                  </CardContent>
                </Card>
              )}
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}