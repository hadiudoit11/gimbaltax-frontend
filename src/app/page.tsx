'use client';

import { useState } from 'react';
import { RateCalculator, TaxabilityWizard, ComplianceDashboard, ResearchDatabase, InteractiveTaxCalculator, SalesTaxChat } from '@/components';
import { cn } from '@/lib/utils';

type Tab = 'ai-chat' | 'interactive' | 'rates' | 'taxability' | 'compliance' | 'research';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('ai-chat');

  const tabs: { id: Tab; label: string; icon: string; description: string }[] = [
    { id: 'ai-chat', label: 'AI Chat', icon: '🤖', description: '22 States' },
    { id: 'interactive', label: 'Quick Calc', icon: '🛒', description: 'NY Only' },
    { id: 'rates', label: 'Rate Lookup', icon: '🧮', description: 'NY Only' },
    { id: 'taxability', label: 'Taxability', icon: '📋', description: 'NY Only' },
    { id: 'compliance', label: 'Compliance', icon: '📅', description: 'NY Only' },
    { id: 'research', label: 'Research', icon: '📚', description: 'NY Bulletins' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Gimbal</h1>
                <p className="text-xs text-slate-500">Sales Tax AI</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://www.tax.ny.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                tax.ny.gov →
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            AI-Powered Sales Tax Compliance
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Ask questions about sales tax across 22 researched states. Our AI agent uses
            RAG to retrieve answers from official government sources.
          </p>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'States Researched', value: '22', color: 'bg-blue-500' },
            { label: 'Documents Indexed', value: '37K+', color: 'bg-purple-500' },
            { label: 'States Pending', value: '26', color: 'bg-orange-500' },
            { label: 'Goal', value: '50', color: 'bg-green-500' },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-lg border border-slate-200 p-4 text-center">
              <div className={cn('inline-block w-2 h-2 rounded-full mb-2', stat.color)} />
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 overflow-hidden">
          <div className="grid grid-cols-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-4 py-4 text-center transition-all border-b-2',
                  activeTab === tab.id
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <div className="text-2xl mb-1">{tab.icon}</div>
                <div className="font-medium text-sm">{tab.label}</div>
                <div className="text-xs text-slate-500 hidden md:block">{tab.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Component */}
        <div className="transition-all">
          {activeTab === 'ai-chat' && <SalesTaxChat />}
          {activeTab === 'interactive' && <InteractiveTaxCalculator />}
          {activeTab === 'rates' && <RateCalculator />}
          {activeTab === 'taxability' && <TaxabilityWizard />}
          {activeTab === 'compliance' && <ComplianceDashboard />}
          {activeTab === 'research' && <ResearchDatabase />}
        </div>

        {/* Footer Info */}
        <div className="mt-8 p-6 bg-white rounded-xl border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">About This Demo</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-slate-600">
            <div>
              <h4 className="font-medium text-slate-900 mb-2">🤖 How It Works</h4>
              <p>
                Our AI agent crawled official state tax department websites and indexed
                37,500+ documents into a knowledge base. Ask any question and get answers
                with context from real government sources.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-2">⚠️ Disclaimer</h4>
              <p>
                This is a demonstration tool. Always verify tax rates and rules with
                official sources before making compliance decisions.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-2">📈 Progress</h4>
              <p>
                22 out of 50 states researched. Following the journey to cover all U.S.
                states with sales tax.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <span className="text-slate-600">Gimbal</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
