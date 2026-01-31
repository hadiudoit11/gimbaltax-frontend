'use client';

import { useState, useMemo } from 'react';
import { getJurisdictionByZip, getAllCounties, NY_JURISDICTIONS } from '@/data/ny-jurisdictions';
import { calculateTax, formatCurrency, formatPercentage, isValidZipCode, cn } from '@/lib/utils';
import type { Jurisdiction, RateCalculation } from '@/types/sales-tax';

export function RateCalculator() {
  const [zipCode, setZipCode] = useState('');
  const [amount, setAmount] = useState('100');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<Jurisdiction | null>(null);
  const [calculation, setCalculation] = useState<RateCalculation | null>(null);
  const [error, setError] = useState('');

  const counties = useMemo(() => getAllCounties(), []);

  const handleZipLookup = () => {
    if (!isValidZipCode(zipCode)) {
      setError('Please enter a valid 5-digit ZIP code');
      return;
    }
    setError('');
    const jurisdiction = getJurisdictionByZip(zipCode);
    if (jurisdiction) {
      setSelectedJurisdiction(jurisdiction);
      const amountNum = parseFloat(amount) || 0;
      setCalculation(calculateTax(jurisdiction, amountNum));
    } else {
      setError('ZIP code not found. Using state rate.');
      const stateJurisdiction = NY_JURISDICTIONS.find(j => j.code === 'NY')!;
      setSelectedJurisdiction(stateJurisdiction);
      const amountNum = parseFloat(amount) || 0;
      setCalculation(calculateTax(stateJurisdiction, amountNum));
    }
  };

  const handleJurisdictionChange = (code: string) => {
    const jurisdiction = NY_JURISDICTIONS.find(j => j.code === code);
    if (jurisdiction) {
      setSelectedJurisdiction(jurisdiction);
      const amountNum = parseFloat(amount) || 0;
      setCalculation(calculateTax(jurisdiction, amountNum));
    }
  };

  const handleAmountChange = (newAmount: string) => {
    setAmount(newAmount);
    if (selectedJurisdiction) {
      const amountNum = parseFloat(newAmount) || 0;
      setCalculation(calculateTax(selectedJurisdiction, amountNum));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span>🧮</span> Rate Calculator
        </h2>
        <p className="text-blue-100 text-sm mt-1">Look up NY sales tax rates by ZIP code or jurisdiction</p>
      </div>

      <div className="p-6 space-y-6">
        {/* ZIP Code Lookup */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">ZIP Code Lookup</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="Enter ZIP code"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              maxLength={5}
            />
            <button
              onClick={handleZipLookup}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Look Up
            </button>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>

        {/* Or select jurisdiction */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Or Select Jurisdiction</label>
          <select
            value={selectedJurisdiction?.code || ''}
            onChange={(e) => handleJurisdictionChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
          >
            <option value="">Select a jurisdiction...</option>
            <optgroup label="State">
              <option value="NY">New York State (Base Rate)</option>
            </optgroup>
            <optgroup label="NYC & MCTD Counties">
              {counties.filter(c => c.inMCTD).map(j => (
                <option key={j.code} value={j.code}>
                  {j.name} ({formatPercentage(j.combinedRate)})
                </option>
              ))}
            </optgroup>
            <optgroup label="Other Counties">
              {counties.filter(c => !c.inMCTD).map(j => (
                <option key={j.code} value={j.code}>
                  {j.name} ({formatPercentage(j.combinedRate)})
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Amount Input */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Sale Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Results */}
        {selectedJurisdiction && calculation && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">
              {selectedJurisdiction.name}
              {selectedJurisdiction.inMCTD && (
                <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                  MCTD
                </span>
              )}
            </h3>

            <div className="space-y-3">
              {/* Rate Breakdown */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">State Rate:</span>
                  <span className="font-medium">{formatPercentage(selectedJurisdiction.stateRate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">State Tax:</span>
                  <span className="font-medium">{formatCurrency(calculation.stateAmount)}</span>
                </div>

                {selectedJurisdiction.localRate > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Local Rate:</span>
                      <span className="font-medium">{formatPercentage(selectedJurisdiction.localRate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Local Tax:</span>
                      <span className="font-medium">{formatCurrency(calculation.localAmount)}</span>
                    </div>
                  </>
                )}

                {selectedJurisdiction.mctdRate > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">MCTD Rate:</span>
                      <span className="font-medium">{formatPercentage(selectedJurisdiction.mctdRate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">MCTD Tax:</span>
                      <span className="font-medium">{formatCurrency(calculation.mctdAmount)}</span>
                    </div>
                  </>
                )}
              </div>

              <hr className="border-gray-300" />

              {/* Totals */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-700">Combined Rate:</span>
                  <span className="text-blue-600">{formatPercentage(selectedJurisdiction.combinedRate)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-700">Total Tax:</span>
                  <span className="text-blue-600">{formatCurrency(calculation.totalTax)}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold pt-2 border-t border-gray-300">
                <span className="text-gray-900">Grand Total:</span>
                <span className="text-green-600">{formatCurrency(calculation.subtotal + calculation.totalTax)}</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              Effective {selectedJurisdiction.effectiveDate}. Rates subject to change.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
