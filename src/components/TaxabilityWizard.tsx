'use client';

import { useState } from 'react';
import { NY_TAX_CATEGORIES, searchRules } from '@/data/ny-taxability';
import { cn, getStatusColor } from '@/lib/utils';
import type { TaxCategory, TaxabilityRule } from '@/types/sales-tax';

export function TaxabilityWizard() {
  const [selectedCategory, setSelectedCategory] = useState<TaxCategory | null>(null);
  const [selectedRule, setSelectedRule] = useState<TaxabilityRule | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TaxabilityRule[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      setSearchResults(searchRules(query));
      setSelectedCategory(null);
      setSelectedRule(null);
    } else {
      setSearchResults([]);
    }
  };

  const handleCategorySelect = (category: TaxCategory) => {
    setSelectedCategory(category);
    setSelectedRule(null);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleRuleSelect = (rule: TaxabilityRule) => {
    setSelectedRule(rule);
  };

  const handleBack = () => {
    if (selectedRule) {
      setSelectedRule(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span>📋</span> Taxability Wizard
        </h2>
        <p className="text-purple-100 text-sm mt-1">Determine if products/services are taxable in NY</p>
      </div>

      <div className="p-6">
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search products or services..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-900"
          />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Search Results ({searchResults.length})</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {searchResults.map((rule) => (
                <button
                  key={rule.id}
                  onClick={() => handleRuleSelect(rule)}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{rule.description}</span>
                    <span className={cn(
                      'px-2 py-0.5 rounded-full text-xs font-medium',
                      getStatusColor(rule.taxable)
                    )}>
                      {rule.taxable ? 'TAXABLE' : 'EXEMPT'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{rule.category}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        {(selectedCategory || selectedRule) && (
          <button
            onClick={handleBack}
            className="mb-4 text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
          >
            ← Back
          </button>
        )}

        {/* Category Grid */}
        {!selectedCategory && !selectedRule && searchResults.length === 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {NY_TAX_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category)}
                className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-center"
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="font-medium text-gray-900">{category.name}</div>
                <div className="text-xs text-gray-500 mt-1">{category.rules.length} rules</div>
              </button>
            ))}
          </div>
        )}

        {/* Rules List */}
        {selectedCategory && !selectedRule && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>{selectedCategory.icon}</span>
              {selectedCategory.name}
            </h3>
            <p className="text-gray-600 mb-4">{selectedCategory.description}</p>
            <div className="space-y-2">
              {selectedCategory.rules.map((rule) => (
                <button
                  key={rule.id}
                  onClick={() => handleRuleSelect(rule)}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium text-gray-900">{rule.description}</div>
                      {rule.subcategory && (
                        <div className="text-sm text-gray-500">{rule.subcategory}</div>
                      )}
                    </div>
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap',
                      getStatusColor(rule.taxable)
                    )}>
                      {rule.taxable ? 'TAXABLE' : 'EXEMPT'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Rule Detail */}
        {selectedRule && (
          <div className="space-y-6">
            <div className={cn(
              'p-4 rounded-lg border-2',
              selectedRule.taxable
                ? 'bg-red-50 border-red-200'
                : 'bg-green-50 border-green-200'
            )}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedRule.description}
                </h3>
                <span className={cn(
                  'px-3 py-1 rounded-full text-sm font-bold',
                  getStatusColor(selectedRule.taxable)
                )}>
                  {selectedRule.taxable ? 'TAXABLE' : 'EXEMPT'}
                </span>
              </div>
              <p className="text-gray-600">
                {selectedRule.category}
                {selectedRule.subcategory && ` > ${selectedRule.subcategory}`}
              </p>
            </div>

            {/* Exemption Details */}
            {selectedRule.exemptionType && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Exemption Type</h4>
                <p className="text-blue-800 capitalize">{selectedRule.exemptionType}</p>
                {selectedRule.threshold && (
                  <p className="text-blue-700 mt-1">
                    Threshold: ${selectedRule.threshold.toLocaleString()} per item
                  </p>
                )}
              </div>
            )}

            {/* Conditions */}
            {selectedRule.conditions && selectedRule.conditions.length > 0 && (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-900 mb-2">Conditions</h4>
                <ul className="list-disc list-inside text-yellow-800 space-y-1">
                  {selectedRule.conditions.map((condition, index) => (
                    <li key={index}>{condition}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Notes */}
            {selectedRule.notes && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                <p className="text-gray-700">{selectedRule.notes}</p>
              </div>
            )}

            {/* Source */}
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-900 mb-2">Official Source</h4>
              <p className="text-purple-800 mb-2">Technical Bulletin: {selectedRule.tbReference}</p>
              <a
                href={selectedRule.tbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 underline"
              >
                View on tax.ny.gov →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
