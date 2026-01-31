'use client';

import { useState, useMemo } from 'react';
import { NY_TECHNICAL_BULLETINS, searchBulletins, getBulletinsByCategory } from '@/data/ny-compliance';
import { formatDate, cn } from '@/lib/utils';
import type { TechnicalBulletin } from '@/types/sales-tax';

export function ResearchDatabase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBulletin, setSelectedBulletin] = useState<TechnicalBulletin | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(NY_TECHNICAL_BULLETINS.map(tb => tb.category));
    return Array.from(cats).sort();
  }, []);

  const filteredBulletins = useMemo(() => {
    let results = NY_TECHNICAL_BULLETINS;

    if (searchQuery.length >= 2) {
      results = searchBulletins(searchQuery);
    }

    if (selectedCategory) {
      results = results.filter(tb => tb.category === selectedCategory);
    }

    return results;
  }, [searchQuery, selectedCategory]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span>📚</span> Research Database
        </h2>
        <p className="text-orange-100 text-sm mt-1">NY Technical Bulletins and official tax guidance</p>
      </div>

      <div className="p-6">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bulletins by topic, number, or keyword..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-600 mb-4">
          {filteredBulletins.length} bulletin{filteredBulletins.length !== 1 ? 's' : ''} found
        </p>

        {/* Selected Bulletin Detail */}
        {selectedBulletin && (
          <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="inline-block px-2 py-1 bg-orange-200 text-orange-800 rounded text-sm font-medium">
                  {selectedBulletin.number}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mt-2">
                  {selectedBulletin.title}
                </h3>
                <p className="text-sm text-gray-600">{selectedBulletin.category}</p>
              </div>
              <button
                onClick={() => setSelectedBulletin(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-700 mb-4">{selectedBulletin.summary}</p>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-gray-500">Published:</span>
                <span className="ml-2 text-gray-900">{formatDate(selectedBulletin.publishedDate)}</span>
              </div>
              <div>
                <span className="text-gray-500">Last Updated:</span>
                <span className="ml-2 text-gray-900">{formatDate(selectedBulletin.lastUpdated)}</span>
              </div>
            </div>

            <div className="mb-4">
              <span className="text-sm text-gray-500">Related Topics:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedBulletin.relatedTopics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <a
              href={selectedBulletin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              View on tax.ny.gov →
            </a>
          </div>
        )}

        {/* Bulletin List */}
        <div className="space-y-3">
          {filteredBulletins.map((bulletin) => (
            <button
              key={bulletin.id}
              onClick={() => setSelectedBulletin(bulletin)}
              className={cn(
                'w-full text-left p-4 rounded-lg border transition-colors',
                selectedBulletin?.id === bulletin.id
                  ? 'border-orange-300 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm text-orange-600 font-medium">
                      {bulletin.number}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                      {bulletin.category}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900">{bulletin.title}</h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{bulletin.summary}</p>
                </div>
                <div className="text-right ml-4 text-xs text-gray-500">
                  <div>Updated</div>
                  <div>{formatDate(bulletin.lastUpdated).split(',')[0]}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filteredBulletins.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl block mb-2">🔍</span>
            No bulletins found matching your search.
          </div>
        )}

        {/* Official Source Note */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">📋 Official Sources</h4>
          <p className="text-sm text-gray-600 mb-3">
            All information is sourced from the NY Department of Taxation and Finance.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="https://www.tax.ny.gov/pubs_and_bulls/tg_bulletins/st/sales_tax_index.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-orange-600 hover:text-orange-800 underline"
            >
              All Technical Bulletins →
            </a>
            <a
              href="https://www.tax.ny.gov/bus/st/stidx.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-orange-600 hover:text-orange-800 underline"
            >
              Sales Tax Home →
            </a>
            <a
              href="https://www.tax.ny.gov/pdf/publications/sales/pub750.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-orange-600 hover:text-orange-800 underline"
            >
              Publication 750 (Rates) →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
