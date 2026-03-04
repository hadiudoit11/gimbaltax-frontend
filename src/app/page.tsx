"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { USStatesMap } from "@/components/dashboard/us-states-map";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { 
  Building2, 
  FileText, 
  Bot, 
  Calculator,
  AlertCircle,
  Plus,
  Loader2
} from "lucide-react";

export default function Dashboard() {
  const stats = useDashboardStats();
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-slate-400 mt-2 text-sm sm:text-base lg:text-lg">
              Welcome back to the Payroll Tax Engine
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button className="gradient-button shadow-lg shadow-purple-600/25 justify-center" asChild>
              <a href="/tax-configs?tab=create">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden xs:inline">New Tax Config</span>
                <span className="xs:hidden">New Config</span>
              </a>
            </Button>
            <Button variant="outline" asChild className="justify-center">
              <a href="/tax-configs?tab=research">
                <Bot className="h-4 w-4 mr-2" />
                <span className="hidden xs:inline">Start AI Research</span>
                <span className="xs:hidden">AI Research</span>
              </a>
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="stat-card-blue border-none shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Active Tax Configs
              </CardTitle>
              <FileText className="h-4 w-4 text-white/90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.loading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  stats.activeTaxConfigs.toLocaleString()
                )}
              </div>
              <p className="text-xs text-white/70">
                {stats.error ? (
                  <span className="text-white/90">Fallback data</span>
                ) : (
                  <>↑2 from last month</>
                )}
              </p>
            </CardContent>
          </Card>
          
          <Card className="stat-card-purple border-none shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Jurisdictions
              </CardTitle>
              <Building2 className="h-4 w-4 text-white/90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.loading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  stats.jurisdictions.toLocaleString()
                )}
              </div>
              <p className="text-xs text-white/70">
                Federal, state & local
              </p>
            </CardContent>
          </Card>
          
          <Card className="stat-card-orange border-none shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Pending Reviews
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-white/90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.loading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  stats.pendingReviews.toLocaleString()
                )}
              </div>
              <p className="text-xs text-white/70">
                Awaiting approval
              </p>
            </CardContent>
          </Card>
          
          <Card className="stat-card-green border-none shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Calculations Today
              </CardTitle>
              <Calculator className="h-4 w-4 text-white/90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.loading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  stats.calculationsToday.toLocaleString()
                )}
              </div>
              <p className="text-xs text-white/70">
                ↗24% from yesterday
              </p>
            </CardContent>
          </Card>
        </div>

        {/* US States Map */}
        <USStatesMap />

        {/* Recent Activity & Quick Actions */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          <Card className="gradient-card border-gray-200 dark:border-slate-600/50">
            <CardHeader>
              <CardTitle className="text-gray-800 dark:text-slate-200">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-slate-200">NY SUI rate updated</p>
                  <p className="text-xs text-gray-600 dark:text-slate-400">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-slate-200">Agent research completed</p>
                  <p className="text-xs text-gray-600 dark:text-slate-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-slate-200">California taxes pending review</p>
                  <p className="text-xs text-gray-600 dark:text-slate-400">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-slate-200">New jurisdiction added: Austin, TX</p>
                  <p className="text-xs text-gray-600 dark:text-slate-400">1 day ago</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-gray-200 dark:border-slate-600/50">
            <CardHeader>
              <CardTitle className="text-gray-800 dark:text-slate-200">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full stat-card-blue border-none text-white hover:opacity-90" size="lg">
                <Calculator className="h-4 w-4 mr-2" />
                Run Tax Calculation
              </Button>
              <Button className="w-full stat-card-purple border-none text-white hover:opacity-90" size="lg" asChild>
                <a href="/tax-configs?tab=research">
                  <Bot className="h-4 w-4 mr-2" />
                  Start AI Research
                </a>
              </Button>
              <Button className="w-full stat-card-orange border-none text-white hover:opacity-90" size="lg">
                <Building2 className="h-4 w-4 mr-2" />
                Add New Jurisdiction
              </Button>
              <Button className="w-full stat-card-green border-none text-white hover:opacity-90" size="lg" asChild>
                <a href="/tax-configs?tab=create">
                  <FileText className="h-4 w-4 mr-2" />
                  Create Tax Configuration
                </a>
              </Button>
              <Button className="w-full border-2 border-purple-500 bg-transparent text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/20" size="lg" asChild>
                <a href="/tax-configs?tab=pending">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Review Pending Items
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Tax Categories Overview */}
        <Card className="gradient-card border-gray-200 dark:border-slate-600/50">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-slate-200">Tax Categories Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-gray-100 shadow-lg dark:bg-slate-800/30 dark:border-slate-600/50 dark:backdrop-blur-sm">
                <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-blue-500">
                  {stats.loading ? (
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  ) : (
                    stats.taxCategories.income_tax.toLocaleString()
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Income Tax</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-gray-100 shadow-lg dark:bg-slate-800/30 dark:border-slate-600/50 dark:backdrop-blur-sm">
                <Building2 className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-purple-500">
                  {stats.loading ? (
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  ) : (
                    stats.taxCategories.social_insurance.toLocaleString()
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Social Insurance</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white border-2 border-gray-100 shadow-lg dark:bg-slate-800/30 dark:border-slate-600/50 dark:backdrop-blur-sm">
                <AlertCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-orange-500">
                  {stats.loading ? (
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  ) : (
                    stats.taxCategories.unemployment.toLocaleString()
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Unemployment</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}