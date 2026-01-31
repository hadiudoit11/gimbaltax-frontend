'use client';

import { useState, useMemo } from 'react';
import { generateComplianceCalendar, NY_FILING_REQUIREMENTS, NY_NEXUS } from '@/data/ny-compliance';
import { formatDate, formatShortDate, formatCurrency, getDaysUntil, getPriorityColor, cn } from '@/lib/utils';
import type { ComplianceEvent } from '@/types/sales-tax';

export function ComplianceDashboard() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'nexus' | 'filing'>('calendar');
  const [annualSales, setAnnualSales] = useState('');
  const [transactions, setTransactions] = useState('');

  const currentYear = new Date().getFullYear();
  const events = useMemo(() => generateComplianceCalendar(currentYear), [currentYear]);

  // Get upcoming events (next 90 days)
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    const ninetyDaysFromNow = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
    return events.filter(e => {
      const eventDate = new Date(e.dueDate);
      return eventDate >= today && eventDate <= ninetyDaysFromNow;
    }).slice(0, 10);
  }, [events]);

  // Nexus check
  const nexusStatus = useMemo(() => {
    const sales = parseFloat(annualSales) || 0;
    const txns = parseInt(transactions) || 0;

    if (sales === 0 && txns === 0) return null;

    const salesMet = sales > NY_NEXUS.salesThreshold;
    const txnsMet = txns > NY_NEXUS.transactionThreshold;
    const hasNexus = NY_NEXUS.logic === 'AND' ? (salesMet && txnsMet) : (salesMet || txnsMet);

    return { salesMet, txnsMet, hasNexus };
  }, [annualSales, transactions]);

  // Filing frequency determination
  const filingFrequency = useMemo(() => {
    const sales = parseFloat(annualSales) || 0;
    return NY_FILING_REQUIREMENTS.find(r =>
      sales >= r.threshold.min && (!r.threshold.max || sales < r.threshold.max)
    );
  }, [annualSales]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span>📅</span> Compliance Dashboard
        </h2>
        <p className="text-green-100 text-sm mt-1">Filing calendar, nexus monitoring, and compliance tracking</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {[
            { id: 'calendar', label: 'Filing Calendar', icon: '📅' },
            { id: 'nexus', label: 'Nexus Check', icon: '🎯' },
            { id: 'filing', label: 'Filing Requirements', icon: '📝' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'flex-1 px-4 py-3 text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'border-b-2 border-green-600 text-green-600 bg-green-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
            <div className="space-y-3">
              {upcomingEvents.map((event) => {
                const daysUntil = getDaysUntil(event.dueDate);
                const isUrgent = daysUntil <= 7;
                const isPast = daysUntil < 0;

                return (
                  <div
                    key={event.id}
                    className={cn(
                      'p-4 rounded-lg border',
                      isPast ? 'bg-red-50 border-red-200' :
                      isUrgent ? 'bg-orange-50 border-orange-200' :
                      'bg-gray-50 border-gray-200'
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            'px-2 py-0.5 rounded-full text-xs font-medium',
                            getPriorityColor(event.priority)
                          )}>
                            {event.priority.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">{event.type}</span>
                        </div>
                        <h4 className="font-medium text-gray-900 mt-1">{event.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        {event.form && (
                          <p className="text-sm text-gray-500 mt-1">Form: {event.form}</p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-semibold text-gray-900">
                          {formatShortDate(event.dueDate)}
                        </div>
                        <div className={cn(
                          'text-sm',
                          isPast ? 'text-red-600 font-semibold' :
                          isUrgent ? 'text-orange-600 font-semibold' :
                          'text-gray-500'
                        )}>
                          {isPast ? `${Math.abs(daysUntil)} days overdue` :
                           daysUntil === 0 ? 'Due today!' :
                           daysUntil === 1 ? 'Due tomorrow' :
                           `${daysUntil} days`}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-sm text-gray-500 mt-4">
              * Sales tax quarters in NY run: Mar-May (Q1), Jun-Aug (Q2), Sep-Nov (Q3), Dec-Feb (Q4)
            </p>
          </div>
        )}

        {/* Nexus Tab */}
        {activeTab === 'nexus' && (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">NY Economic Nexus Thresholds</h4>
              <p className="text-blue-800 text-sm">{NY_NEXUS.description}</p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-white p-3 rounded border border-blue-200">
                  <div className="text-2xl font-bold text-blue-700">
                    {formatCurrency(NY_NEXUS.salesThreshold)}
                  </div>
                  <div className="text-sm text-blue-600">Sales Threshold</div>
                </div>
                <div className="bg-white p-3 rounded border border-blue-200">
                  <div className="text-2xl font-bold text-blue-700">
                    {NY_NEXUS.transactionThreshold}
                  </div>
                  <div className="text-sm text-blue-600">Transaction Threshold</div>
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Logic: {NY_NEXUS.logic} (both thresholds must be met)
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Check Your Nexus Status</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NY Sales (Last 4 Quarters)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={annualSales}
                      onChange={(e) => setAnnualSales(e.target.value)}
                      placeholder="0"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NY Transactions (Last 4 Quarters)
                  </label>
                  <input
                    type="number"
                    value={transactions}
                    onChange={(e) => setTransactions(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900"
                  />
                </div>
              </div>

              {nexusStatus && (
                <div className={cn(
                  'p-4 rounded-lg border-2',
                  nexusStatus.hasNexus
                    ? 'bg-red-50 border-red-300'
                    : 'bg-green-50 border-green-300'
                )}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">
                      {nexusStatus.hasNexus ? '⚠️' : '✅'}
                    </span>
                    <div>
                      <h4 className={cn(
                        'font-bold text-lg',
                        nexusStatus.hasNexus ? 'text-red-900' : 'text-green-900'
                      )}>
                        {nexusStatus.hasNexus
                          ? 'You Have NY Sales Tax Nexus'
                          : 'No NY Sales Tax Nexus'}
                      </h4>
                      <p className={cn(
                        'text-sm',
                        nexusStatus.hasNexus ? 'text-red-700' : 'text-green-700'
                      )}>
                        {nexusStatus.hasNexus
                          ? 'You are required to register, collect, and remit NY sales tax.'
                          : 'Based on current thresholds, you do not have economic nexus in NY.'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className={cn(
                      'p-2 rounded',
                      nexusStatus.salesMet ? 'bg-red-100' : 'bg-green-100'
                    )}>
                      <span className="text-sm">
                        Sales: {nexusStatus.salesMet ? '✗ Exceeds' : '✓ Below'} threshold
                      </span>
                    </div>
                    <div className={cn(
                      'p-2 rounded',
                      nexusStatus.txnsMet ? 'bg-red-100' : 'bg-green-100'
                    )}>
                      <span className="text-sm">
                        Transactions: {nexusStatus.txnsMet ? '✗ Exceeds' : '✓ Below'} threshold
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Filing Requirements Tab */}
        {activeTab === 'filing' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Enter your annual taxable sales to determine filing frequency:
              </label>
              <div className="relative max-w-xs">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={annualSales}
                  onChange={(e) => setAnnualSales(e.target.value)}
                  placeholder="Annual taxable sales"
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900"
                />
              </div>
            </div>

            {filingFrequency && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📝</span>
                  <h4 className="font-bold text-green-900 text-lg">
                    {filingFrequency.frequency.charAt(0).toUpperCase() + filingFrequency.frequency.slice(1)} Filer
                  </h4>
                </div>
                <p className="text-green-800">{filingFrequency.description}</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-white p-3 rounded border border-green-200">
                    <div className="font-semibold text-green-700">{filingFrequency.form}</div>
                    <div className="text-sm text-green-600">Form Number</div>
                  </div>
                  <div className="bg-white p-3 rounded border border-green-200">
                    <div className="font-semibold text-green-700">{filingFrequency.dueDay}th of month</div>
                    <div className="text-sm text-green-600">Due Date</div>
                  </div>
                </div>
                {filingFrequency.electronicRequired && (
                  <p className="text-sm text-green-700 mt-3">
                    ⚡ Electronic filing required
                  </p>
                )}
              </div>
            )}

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">All Filing Frequencies</h4>
              {NY_FILING_REQUIREMENTS.map((req) => (
                <div
                  key={req.id}
                  className={cn(
                    'p-4 rounded-lg border',
                    filingFrequency?.id === req.id
                      ? 'bg-green-50 border-green-300'
                      : 'bg-gray-50 border-gray-200'
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium text-gray-900 capitalize">{req.frequency}</h5>
                      <p className="text-sm text-gray-600 mt-1">{req.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-700">{req.form}</div>
                      <div className="text-sm text-gray-500">
                        {req.threshold.max
                          ? `${formatCurrency(req.threshold.min)} - ${formatCurrency(req.threshold.max)}`
                          : `Over ${formatCurrency(req.threshold.min)}`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
