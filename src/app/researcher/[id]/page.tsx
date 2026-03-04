"use client";

import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, format } from "date-fns";
import { 
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Download,
  Share2,
  Archive,
  Edit,
  MoreHorizontal,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  User,
  Building2,
  Tag
} from "lucide-react";
import { 
  useResearchResultDetail,
  usePublishResearchResult,
  useArchiveResearchResult,
  type ResearchResult
} from "@/hooks/api/use-research-results";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const statusColors = {
  draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  published: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  archived: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
};

const configStatusColors = {
  draft: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  pending_review: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  approved: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
};

const validationStatusIcons = {
  valid: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle
};

const validationStatusColors = {
  valid: "text-green-500",
  warning: "text-yellow-500",
  error: "text-red-500"
};

export default function ResearchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: research, isLoading, error } = useResearchResultDetail(id);
  const publishMutation = usePublishResearchResult();
  const archiveMutation = useArchiveResearchResult();

  const handleGoBack = () => {
    router.push('/researcher');
  };

  const handlePublish = async () => {
    if (research) {
      try {
        await publishMutation.mutateAsync(research.id);
      } catch (error) {
        console.error('Failed to publish research:', error);
      }
    }
  };

  const handleArchive = async () => {
    if (research) {
      try {
        await archiveMutation.mutateAsync(research.id);
      } catch (error) {
        console.error('Failed to archive research:', error);
      }
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  const handleDownload = () => {
    if (research) {
      const element = document.createElement('a');
      const file = new Blob([research.content_markdown], { type: 'text/markdown' });
      element.href = URL.createObjectURL(file);
      element.download = `${research.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
            <span className="text-gray-600 dark:text-slate-400">Loading research details...</span>
          </div>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">
            Failed to load research details
          </div>
          <Button onClick={() => window.location.reload()} variant="outline" className="border-red-500 text-red-600">
            Try Again
          </Button>
        </div>
      </AppShell>
    );
  }

  if (!research) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-gray-600 dark:text-slate-400 mb-4">
            Research not found
          </div>
          <Button onClick={handleGoBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Research
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleGoBack}
              variant="outline"
              size="sm"
              className="border-gray-300 dark:border-slate-600"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-slate-200">
                {research.title}
              </h1>
              <p className="text-gray-600 dark:text-slate-400 mt-1 text-sm sm:text-base">
                Research Details
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={statusColors[research.status]}>
              {research.status}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="border-purple-500 text-purple-600 dark:text-purple-400"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="border-blue-500 text-blue-600 dark:text-blue-400"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Research Metadata */}
        <Card className="gradient-card border-gray-200 dark:border-slate-600/50">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800 dark:text-slate-200">
              <FileText className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
              Research Metadata
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600 dark:text-slate-400">
                  <Building2 className="h-4 w-4 mr-2" />
                  Jurisdiction
                </div>
                <div className="font-medium text-gray-800 dark:text-slate-200">
                  {research.jurisdiction.name}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600 dark:text-slate-400">
                  <Clock className="h-4 w-4 mr-2" />
                  Reading Time
                </div>
                <div className="font-medium text-gray-800 dark:text-slate-200">
                  {research.reading_time} minute{research.reading_time !== 1 ? 's' : ''}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600 dark:text-slate-400">
                  <FileText className="h-4 w-4 mr-2" />
                  Word Count
                </div>
                <div className="font-medium text-gray-800 dark:text-slate-200">
                  {research.word_count.toLocaleString()} words
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600 dark:text-slate-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  Created
                </div>
                <div className="font-medium text-gray-800 dark:text-slate-200">
                  {formatDistanceToNow(new Date(research.created_at), { addSuffix: true })}
                </div>
              </div>
            </div>

            {/* Tags */}
            {research.tags.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center text-sm text-gray-600 dark:text-slate-400 mb-3">
                  <Tag className="h-4 w-4 mr-2" />
                  Tags
                </div>
                <div className="flex flex-wrap gap-2">
                  {research.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3">
              {research.status === 'draft' && (
                <Button
                  onClick={handlePublish}
                  disabled={publishMutation.isPending}
                  className="stat-card-green border-none text-white hover:opacity-90"
                  size="sm"
                >
                  {publishMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    'Publish'
                  )}
                </Button>
              )}
              
              {research.status !== 'archived' && (
                <Button
                  onClick={handleArchive}
                  disabled={archiveMutation.isPending}
                  variant="outline"
                  size="sm"
                >
                  {archiveMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Archiving...
                    </>
                  ) : (
                    <>
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Research Content */}
        <Card className="gradient-card border-gray-200 dark:border-slate-600/50">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-slate-200">
              Research Content
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Original Query: {research.query}
            </p>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {research.content_markdown}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        {/* Related Tax Configurations */}
        {research.related_configs && research.related_configs.length > 0 && (
          <Card className="gradient-card border-gray-200 dark:border-slate-600/50">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800 dark:text-slate-200">
                <FileText className="mr-2 h-5 w-5 text-green-600 dark:text-green-400" />
                Related Tax Configurations ({research.related_configs_count})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {research.related_configs.map((config, index) => {
                  const ValidationIcon = validationStatusIcons[config.validation_status];
                  
                  return (
                    <div
                      key={config.id || index}
                      className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-600"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-gray-800 dark:text-slate-200">
                              {config.name}
                            </h4>
                            <Badge className={configStatusColors[config.status]}>
                              {config.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-gray-600 dark:text-slate-400 mb-3">
                            <span className="font-medium">Code:</span> {config.code} • 
                            <span className="font-medium"> Category:</span> {config.tax_category}
                          </div>
                          
                          {config.validation_errors && config.validation_errors.length > 0 && (
                            <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-md">
                              <div className="text-sm text-red-700 dark:text-red-400 font-medium mb-2">
                                Validation Issues:
                              </div>
                              <ul className="text-sm text-red-600 dark:text-red-300 list-disc list-inside space-y-1">
                                {config.validation_errors.map((error, i) => (
                                  <li key={i}>{error}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        
                        <div className="ml-4">
                          <ValidationIcon className={`h-5 w-5 ${validationStatusColors[config.validation_status]}`} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}