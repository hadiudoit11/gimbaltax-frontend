'use client';

import { useState, useMemo } from 'react';
import { NY_TAX_CATEGORIES, getCategoryById } from '@/data/ny-taxability';
import { NY_JURISDICTIONS, getAllCounties } from '@/data/ny-jurisdictions';
import { calculateTax, formatCurrency, formatPercentage, cn } from '@/lib/utils';
import type { TaxCategory, TaxabilityRule, Jurisdiction, RateCalculation } from '@/types/sales-tax';

type Step = 'category' | 'item' | 'price' | 'county' | 'result';

interface Selection {
  category: TaxCategory | null;
  item: TaxabilityRule | null;
  price: number;
  county: Jurisdiction | null;
}

export function InteractiveTaxCalculator() {
  const [step, setStep] = useState<Step>('category');
  const [selection, setSelection] = useState<Selection>({
    category: null,
    item: null,
    price: 100,
    county: null,
  });
  const [priceInput, setPriceInput] = useState('100');

  const counties = useMemo(() => getAllCounties(), []);

  // Check if this is a clothing threshold item under the threshold
  const isClothingExemptItem = useMemo(() => {
    if (!selection.item) return false;
    if (selection.item.exemptionType !== 'threshold' || !selection.item.threshold) return false;
    return selection.price < selection.item.threshold;
  }, [selection.item, selection.price]);

  // Calculate tax with special handling for clothing exemptions
  const calculation = useMemo<RateCalculation | null>(() => {
    if (!selection.county) return null;

    // For clothing items under threshold, calculate based on county's clothing exemption status
    if (isClothingExemptItem) {
      const county = selection.county;
      const price = selection.price;

      // State tax is ALWAYS exempt for clothing under $110
      const stateAmount = 0;

      // Local and MCTD tax depends on whether county provides the exemption
      const localAmount = county.clothingExemption ? 0 : (price * county.localRate) / 100;
      const mctdAmount = county.clothingExemption ? 0 : (price * county.mctdRate) / 100;

      const totalTax = stateAmount + localAmount + mctdAmount;

      return {
        jurisdiction: county,
        subtotal: price,
        stateAmount,
        localAmount,
        mctdAmount,
        totalTax,
        effectiveRate: (totalTax / price) * 100,
      };
    }

    return calculateTax(selection.county, selection.price);
  }, [selection.county, selection.price, isClothingExemptItem]);

  // Determine if any tax applies (for display purposes)
  const isTaxable = useMemo(() => {
    if (!selection.item) return false;

    // Handle threshold-based items (like clothing under $110)
    if (selection.item.exemptionType === 'threshold' && selection.item.threshold) {
      // If price is at or above threshold, fully taxable
      if (selection.price >= selection.item.threshold) return true;
      // If under threshold, check if county provides exemption
      // If county doesn't provide exemption, local tax still applies
      if (selection.county && !selection.county.clothingExemption) return true;
      return false;
    }

    return selection.item.taxable;
  }, [selection.item, selection.price, selection.county]);

  const handleCategorySelect = (category: TaxCategory) => {
    setSelection({ ...selection, category, item: null });
    setStep('item');
  };

  const handleItemSelect = (item: TaxabilityRule) => {
    setSelection({ ...selection, item });
    // If item has threshold, go to price step first
    if (item.exemptionType === 'threshold') {
      setStep('price');
    } else {
      setStep('county');
    }
  };

  const handlePriceSubmit = () => {
    const price = parseFloat(priceInput) || 0;
    setSelection({ ...selection, price });
    setStep('county');
  };

  const handleCountySelect = (county: Jurisdiction) => {
    const price = parseFloat(priceInput) || 100;
    setSelection({ ...selection, county, price });
    setStep('result');
  };

  const handleBack = () => {
    switch (step) {
      case 'item':
        setStep('category');
        break;
      case 'price':
        setStep('item');
        break;
      case 'county':
        if (selection.item?.exemptionType === 'threshold') {
          setStep('price');
        } else {
          setStep('item');
        }
        break;
      case 'result':
        setStep('county');
        break;
    }
  };

  const handleReset = () => {
    setSelection({ category: null, item: null, price: 100, county: null });
    setPriceInput('100');
    setStep('category');
  };

  const stepNumber = {
    category: 1,
    item: 2,
    price: 3,
    county: selection.item?.exemptionType === 'threshold' ? 4 : 3,
    result: selection.item?.exemptionType === 'threshold' ? 5 : 4,
  };

  const totalSteps = selection.item?.exemptionType === 'threshold' ? 5 : 4;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span>🛒</span> Interactive Tax Calculator
        </h2>
        <p className="text-emerald-100 text-sm mt-1">
          Select an item and your county to calculate sales tax instantly
        </p>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {stepNumber[step]} of {totalSteps}
          </span>
          {step !== 'category' && (
            <button
              onClick={handleReset}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Start Over
            </button>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(stepNumber[step] / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-6">
        {/* Step 1: Category Selection */}
        {step === 'category' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              What type of item are you purchasing?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {NY_TAX_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  className="p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left group"
                >
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <div className="font-medium text-gray-900 group-hover:text-emerald-700">
                    {category.name}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {category.rules.length} rules
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Item Selection */}
        {step === 'item' && selection.category && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="text-2xl">{selection.category.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900">
                {selection.category.name}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">Select the specific item:</p>
            <div className="space-y-2">
              {selection.category.rules.map((rule) => (
                <button
                  key={rule.id}
                  onClick={() => handleItemSelect(rule)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 group-hover:text-emerald-700">
                        {rule.description}
                      </div>
                      {rule.subcategory && (
                        <div className="text-sm text-gray-500 mt-1">
                          {rule.subcategory}
                        </div>
                      )}
                    </div>
                    <span
                      className={cn(
                        'ml-3 px-3 py-1 rounded-full text-sm font-medium',
                        rule.taxable
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      )}
                    >
                      {rule.taxable ? 'Taxable' : 'Exempt'}
                      {rule.exemptionType === 'threshold' && '*'}
                    </span>
                  </div>
                  {rule.notes && (
                    <div className="text-sm text-gray-500 mt-2 italic">
                      {rule.notes}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Price Input (for threshold items) */}
        {step === 'price' && selection.item && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h3 className="text-lg font-semibold text-gray-900">
                Enter the item price
              </h3>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="font-medium text-amber-800">
                    This item has a price threshold
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    {selection.item.description} - Items under ${selection.item.threshold} are exempt from NY State tax. Local taxes may still apply depending on your county.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Item Price
              </label>
              <div className="relative max-w-xs">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">$</span>
                <input
                  type="number"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-gray-900"
                  min="0"
                  step="0.01"
                  autoFocus
                />
              </div>

              {/* Quick price buttons */}
              <div className="flex gap-2 flex-wrap">
                {[50, 99, 110, 150, 200].map((price) => (
                  <button
                    key={price}
                    onClick={() => setPriceInput(price.toString())}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      parseFloat(priceInput) === price
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    ${price}
                  </button>
                ))}
              </div>

              {/* Live taxability indicator */}
              <div className={cn(
                'p-4 rounded-lg mt-4',
                parseFloat(priceInput) >= (selection.item.threshold || 0)
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-green-50 border border-green-200'
              )}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {parseFloat(priceInput) >= (selection.item.threshold || 0) ? '💸' : '✨'}
                  </span>
                  <div>
                    <p className={cn(
                      'font-medium',
                      parseFloat(priceInput) >= (selection.item.threshold || 0)
                        ? 'text-red-700'
                        : 'text-green-700'
                    )}>
                      {parseFloat(priceInput) >= (selection.item.threshold || 0)
                        ? 'This item is TAXABLE'
                        : 'Exempt from NY State tax (local taxes may vary)'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Threshold: ${selection.item.threshold}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handlePriceSubmit}
              className="w-full py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
            >
              Continue to Select County
            </button>
          </div>
        )}

        {/* Step 4: County Selection */}
        {step === 'county' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h3 className="text-lg font-semibold text-gray-900">
                Where are you located?
              </h3>
            </div>

            {/* Selected item summary */}
            {selection.item && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-500">Selected item:</span>
                    <p className="font-medium text-gray-900">{selection.item.description}</p>
                  </div>
                  <span
                    className={cn(
                      'px-3 py-1 rounded-full text-sm font-medium',
                      isTaxable
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    )}
                  >
                    {isTaxable ? 'Taxable' : 'Exempt'}
                  </span>
                </div>
                {selection.item.exemptionType === 'threshold' && (
                  <p className="text-sm text-gray-600 mt-2">
                    Price: {formatCurrency(selection.price)}
                  </p>
                )}
              </div>
            )}

            <p className="text-gray-600">Select your county to see the applicable tax rate:</p>

            {/* NYC Option (highlighted) */}
            <button
              onClick={() => handleCountySelect(NY_JURISDICTIONS.find(j => j.code === 'NY-NYC')!)}
              className="w-full p-4 border-2 border-purple-200 bg-purple-50 rounded-xl hover:border-purple-500 transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-purple-900">New York City</div>
                  <div className="text-sm text-purple-600">Includes all 5 boroughs</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-purple-700">8.875%</div>
                  <div className="text-xs text-purple-500">Combined Rate</div>
                </div>
              </div>
            </button>

            {/* MCTD Counties */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">MCTD Counties (Metro Area)</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {counties.filter(c => c.inMCTD && c.code !== 'NY-NYC').map((county) => (
                  <button
                    key={county.code}
                    onClick={() => handleCountySelect(county)}
                    className="p-3 border-2 border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left"
                  >
                    <div className="font-medium text-gray-900 text-sm">{county.name}</div>
                    <div className="text-xs text-gray-500">{formatPercentage(county.combinedRate)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Other Counties */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Other Counties</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {counties.filter(c => !c.inMCTD).map((county) => (
                  <button
                    key={county.code}
                    onClick={() => handleCountySelect(county)}
                    className="p-3 border-2 border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left"
                  >
                    <div className="font-medium text-gray-900 text-sm">{county.name}</div>
                    <div className="text-xs text-gray-500">{formatPercentage(county.combinedRate)}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Results */}
        {step === 'result' && selection.item && selection.county && calculation && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-4">{isTaxable ? '🧾' : '🎉'}</div>
              <h3 className="text-2xl font-bold text-gray-900">
                {isTaxable ? 'Your Tax Calculation' : 'Great News - No Tax!'}
              </h3>
            </div>

            {/* Item & Location Summary */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-sm text-gray-500">Item</span>
                  <p className="font-medium text-gray-900">{selection.item.description}</p>
                </div>
                <span className="text-2xl">{selection.category?.icon}</span>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-sm text-gray-500">Location</span>
                  <p className="font-medium text-gray-900">{selection.county.name}</p>
                </div>
                <span className="text-xl">📍</span>
              </div>
            </div>

            {/* Tax Calculation */}
            {isTaxable ? (
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Item Price:</span>
                  <span className="font-medium">{formatCurrency(selection.price)}</span>
                </div>

                {/* Show notice for clothing items with partial exemption */}
                {isClothingExemptItem && !selection.county.clothingExemption && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
                    <p className="text-amber-800">
                      <strong>Note:</strong> {selection.county.name} does not provide the clothing exemption.
                      State tax is exempt, but local tax applies.
                    </p>
                  </div>
                )}

                <hr className="border-gray-200" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">State Tax ({formatPercentage(selection.county.stateRate)}):</span>
                    {isClothingExemptItem ? (
                      <span className="text-green-600 font-medium">EXEMPT</span>
                    ) : (
                      <span className="text-gray-900">{formatCurrency(calculation.stateAmount)}</span>
                    )}
                  </div>
                  {selection.county.localRate > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Local Tax ({formatPercentage(selection.county.localRate)}):</span>
                      <span className="text-gray-900">{formatCurrency(calculation.localAmount)}</span>
                    </div>
                  )}
                  {selection.county.mctdRate > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">MCTD ({formatPercentage(selection.county.mctdRate)}):</span>
                      <span className="text-gray-900">{formatCurrency(calculation.mctdAmount)}</span>
                    </div>
                  )}
                </div>

                <hr className="border-gray-200" />

                <div className="flex justify-between text-lg">
                  <span className="font-medium text-gray-700">Total Tax:</span>
                  <span className="font-bold text-red-600">{formatCurrency(calculation.totalTax)}</span>
                </div>

                <div className="flex justify-between text-xl bg-emerald-50 -mx-6 -mb-6 p-6 rounded-b-xl">
                  <span className="font-bold text-gray-900">You Pay:</span>
                  <span className="font-bold text-emerald-600 text-2xl">
                    {formatCurrency(selection.price + calculation.totalTax)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
                <p className="text-green-800 font-medium text-lg mb-2">
                  {selection.item.exemptionType === 'threshold'
                    ? 'Fully exempt - no sales tax!'
                    : 'This item is exempt from NY sales tax!'}
                </p>
                <p className="text-green-600 text-sm">
                  {selection.county.clothingExemption
                    ? `${selection.county.name} provides the clothing exemption for items under $110.`
                    : selection.item.notes}
                </p>
                <div className="mt-4 text-3xl font-bold text-green-700">
                  You Pay: {formatCurrency(selection.price)}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Calculate Another
              </button>
              <button
                onClick={() => setStep('county')}
                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
              >
                Try Different County
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
