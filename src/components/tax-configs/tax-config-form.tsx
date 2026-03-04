"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useJurisdictions } from "@/hooks/api/use-jurisdictions";
import { 
  TaxCategory, 
  TaxConfigStatus,
  CalculationMethod,
  CalculationPeriodEnum,
  TaxPayloadCollectedFromEnum,
  TaxPayloadRemittedByEnum,
  WageBaseTypeEnum,
  WageBaseCurrencyEnum,
  WageBaseResetFrequencyEnum,
  TaxPayloadRemittanceFilingFrequencyEnum
} from "@/api-client/types";
import type { TaxPayload, Calculation, WageBase, TaxBracket } from "@/api-client/types";
import type { TaxConfigCreate } from "@/api-client/types/tax-config-create";
import type { TaxConfigUpdate } from "@/api-client/types/tax-config-update";

interface TaxConfigFormProps {
  initialData?: Record<string, unknown>; // TaxConfig for edit mode
  onSubmit: (data: TaxConfigCreate | TaxConfigUpdate) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TaxConfigForm({ initialData, onSubmit, onCancel, isLoading }: TaxConfigFormProps) {
  const isEditMode = !!initialData;
  
  // Basic fields
  const [taxId, setTaxId] = useState(initialData?.tax_id || "");
  const [name, setName] = useState(initialData?.name || "");
  const [category, setCategory] = useState<TaxCategory | "">(initialData?.category || "");
  const [subCategory, setSubCategory] = useState(initialData?.sub_category || "");
  const [authority, setAuthority] = useState(initialData?.authority || "");
  const [jurisdictionId, setJurisdictionId] = useState(
    initialData?.jurisdiction ? (typeof initialData.jurisdiction === 'string' ? initialData.jurisdiction : initialData.jurisdiction.id) : ""
  );
  const [effectiveFrom, setEffectiveFrom] = useState(
    initialData?.effective_from ? new Date(initialData.effective_from).toISOString().split('T')[0] : ""
  );
  const [effectiveTo, setEffectiveTo] = useState(
    initialData?.effective_to ? new Date(initialData.effective_to).toISOString().split('T')[0] : ""
  );
  const [status, setStatus] = useState<TaxConfigStatus | "">(initialData?.status || "draft");
  const [notes, setNotes] = useState(initialData?.notes || "");

  // Payload fields
  const payload = initialData?.payload || {};
  const [collectedFrom, setCollectedFrom] = useState<string[]>(payload.collected_from || []);
  const [remittedBy, setRemittedBy] = useState<TaxPayloadRemittedByEnum | "">(payload.remitted_by || "employer");

  // Remittance fields
  const remittance = payload.remittance || {};
  const [formName, setFormName] = useState(remittance.form_name || "");
  const [filingFrequency, setFilingFrequency] = useState<TaxPayloadRemittanceFilingFrequencyEnum | "">(remittance.filing_frequency || "");

  // Calculation fields
  const calculation = payload.calculation || {};
  const [calcMethod, setCalcMethod] = useState<CalculationMethod | "">(calculation.method || "");
  const [percentage, setPercentage] = useState(calculation.percentage?.toString() || "");
  const [flatAmount, setFlatAmount] = useState(calculation.flat_amount?.toString() || "");
  const [period, setPeriod] = useState<CalculationPeriodEnum | "">(calculation.period || "");
  const [brackets, setBrackets] = useState<TaxBracket[]>(calculation.brackets || []);

  // Wage base fields
  const wageBase = payload.wage_base || {};
  const [wageBaseType, setWageBaseType] = useState<WageBaseTypeEnum | "">(wageBase.type || "");
  const [wageBasePerEmployee, setWageBasePerEmployee] = useState(wageBase.per_employee || false);
  const [wageBaseAmount, setWageBaseAmount] = useState(wageBase.amount?.toString() || "");
  const [wageBaseCurrency, setWageBaseCurrency] = useState<WageBaseCurrencyEnum | "">(wageBase.currency || "USD");
  const [wageBaseLinkedTo, setWageBaseLinkedTo] = useState(wageBase.linked_to || "");
  const [wageBaseResetFreq, setWageBaseResetFreq] = useState<WageBaseResetFrequencyEnum | "">(wageBase.reset_frequency || "");

  // Jurisdiction payload fields (for TaxPayload.jurisdiction)
  const payloadJurisdiction = payload.jurisdiction || {};
  const [payloadCountry, setPayloadCountry] = useState(payloadJurisdiction.country || "US");
  const [payloadState, setPayloadState] = useState(payloadJurisdiction.state || "");
  const [payloadLocality, setPayloadLocality] = useState(payloadJurisdiction.locality || "");
  const [payloadJurisdictionType, setPayloadJurisdictionType] = useState(payloadJurisdiction.jurisdiction_type || "");

  const { data: jurisdictionsData } = useJurisdictions();
  const jurisdictions = jurisdictionsData?.results || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Build calculation object
    const calculationObj: Calculation = {
      method: calcMethod as CalculationMethod,
    };
    if (percentage) calculationObj.percentage = parseFloat(percentage);
    if (flatAmount) calculationObj.flat_amount = parseFloat(flatAmount);
    if (period) calculationObj.period = period as CalculationPeriodEnum;
    if (brackets.length > 0) calculationObj.brackets = brackets;

    // Build wage base object
    const wageBaseObj: WageBase | undefined = wageBaseType ? {
      type: wageBaseType as WageBaseTypeEnum,
      per_employee: wageBasePerEmployee,
      currency: wageBaseCurrency as WageBaseCurrencyEnum,
    } : undefined;
    if (wageBaseAmount) wageBaseObj!.amount = parseFloat(wageBaseAmount);
    if (wageBaseLinkedTo) wageBaseObj!.linked_to = wageBaseLinkedTo;
    if (wageBaseResetFreq) wageBaseObj!.reset_frequency = wageBaseResetFreq as WageBaseResetFrequencyEnum;

    // Build payload
    const payloadObj: TaxPayload = {
      tax_id: taxId,
      name,
      category: category as TaxCategory,
      calculation: calculationObj,
      jurisdiction: {
        country: payloadCountry,
        jurisdiction_type: payloadJurisdictionType as any,
      },
    };
    if (subCategory) payloadObj.sub_category = subCategory;
    if (authority) payloadObj.authority = authority;
    if (payloadState) payloadObj.jurisdiction.state = payloadState;
    if (payloadLocality) payloadObj.jurisdiction.locality = payloadLocality;
    if (collectedFrom.length > 0) payloadObj.collected_from = collectedFrom as any[];
    if (remittedBy) payloadObj.remitted_by = remittedBy as TaxPayloadRemittedByEnum;
    if (wageBaseObj) payloadObj.wage_base = wageBaseObj;

    // Add remittance object if any remittance fields are filled
    if (formName || filingFrequency) {
      payloadObj.remittance = {};
      if (formName) payloadObj.remittance.form_name = formName;
      if (filingFrequency) payloadObj.remittance.filing_frequency = filingFrequency as TaxPayloadRemittanceFilingFrequencyEnum;
    }

    // Build request
    if (isEditMode) {
      const updateData: TaxConfigUpdate = {
        payload: payloadObj,
      };
      if (name) updateData.name = name;
      if (category) updateData.category = category as TaxCategory;
      if (subCategory) updateData.sub_category = subCategory;
      if (authority) updateData.authority = authority;
      if (effectiveTo) updateData.effective_to = effectiveTo;
      if (status) updateData.status = status as TaxConfigStatus;
      if (notes) updateData.notes = notes;
      await onSubmit(updateData);
    } else {
      const createData: TaxConfigCreate = {
        tax_id: taxId,
        name,
        category: category as TaxCategory,
        jurisdiction: jurisdictionId,
        effective_from: effectiveFrom,
        payload: payloadObj,
      };
      if (subCategory) createData.sub_category = subCategory;
      if (authority) createData.authority = authority;
      if (effectiveTo) createData.effective_to = effectiveTo;
      if (status) createData.status = status as TaxConfigStatus;
      if (notes) createData.notes = notes;
      await onSubmit(createData);
    }
  };

  const addBracket = () => {
    setBrackets([...brackets, { min_wage: 0, rate_percent: 0, marginal: true }]);
  };

  const updateBracket = (index: number, field: keyof TaxBracket, value: any) => {
    const updated = [...brackets];
    updated[index] = { ...updated[index], [field]: value };
    setBrackets(updated);
  };

  const removeBracket = (index: number) => {
    setBrackets(brackets.filter((_, i) => i !== index));
  };

  const toggleCollectedFrom = (value: string) => {
    setCollectedFrom(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Tax ID *</label>
              <input
                type="text"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="e.g., NY_SUI_2025"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="e.g., New York State Unemployment Insurance"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaxCategory)}
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select category</option>
                {Object.values(TaxCategory).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Sub Category</label>
              <input
                type="text"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="e.g., SUI"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Authority</label>
              <input
                type="text"
                value={authority}
                onChange={(e) => setAuthority(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="e.g., New York State Department of Labor"
              />
            </div>
            {!isEditMode && (
              <div>
                <label className="text-sm font-medium mb-2 block">Jurisdiction *</label>
                <select
                  value={jurisdictionId}
                  onChange={(e) => setJurisdictionId(e.target.value)}
                  required
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select jurisdiction</option>
                  {jurisdictions.map((j: any) => (
                    <option key={j.id} value={j.id}>
                      {j.code} - {j.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="text-sm font-medium mb-2 block">Effective From *</label>
              <input
                type="date"
                value={effectiveFrom}
                onChange={(e) => setEffectiveFrom(e.target.value)}
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Effective To</label>
              <input
                type="date"
                value={effectiveTo}
                onChange={(e) => setEffectiveTo(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            {isEditMode && (
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaxConfigStatus)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {Object.values(TaxConfigStatus).map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Additional notes..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Payload Jurisdiction */}
      <Card>
        <CardHeader>
          <CardTitle>Payload Jurisdiction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Country *</label>
              <input
                type="text"
                value={payloadCountry}
                onChange={(e) => setPayloadCountry(e.target.value)}
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Jurisdiction Type *</label>
              <select
                value={payloadJurisdictionType}
                onChange={(e) => setPayloadJurisdictionType(e.target.value)}
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select type</option>
                <option value="federal">Federal</option>
                <option value="state">State</option>
                <option value="territory">Territory</option>
                <option value="local">Local</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">State (2-letter code)</label>
              <input
                type="text"
                value={payloadState}
                onChange={(e) => setPayloadState(e.target.value.toUpperCase())}
                maxLength={2}
                pattern="[A-Z]{2}"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="NY"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Locality</label>
              <input
                type="text"
                value={payloadLocality}
                onChange={(e) => setPayloadLocality(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="e.g., New York City"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Collection & Remittance */}
      <Card>
        <CardHeader>
          <CardTitle>Collection & Remittance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Collected From</label>
            <div className="flex gap-4">
              {Object.values(TaxPayloadCollectedFromEnum).map((value) => (
                <label key={value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={collectedFrom.includes(value)}
                    onChange={() => toggleCollectedFrom(value)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm capitalize">{value}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Remitted By</label>
            <select
              value={remittedBy}
              onChange={(e) => setRemittedBy(e.target.value as TaxPayloadRemittedByEnum)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {Object.values(TaxPayloadRemittedByEnum).map((value) => (
                <option key={value} value={value}>
                  {value.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Filing Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Filing Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Form Name</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="e.g., Form 941, UC-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Official form name or number for filing
              </p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Filing Frequency</label>
              <select
                value={filingFrequency}
                onChange={(e) => setFilingFrequency(e.target.value as TaxPayloadRemittanceFilingFrequencyEnum)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select frequency</option>
                {Object.values(TaxPayloadRemittanceFilingFrequencyEnum).map((freq) => (
                  <option key={freq} value={freq}>
                    {freq.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                How often this tax must be filed - compliance events will be auto-generated
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculation */}
      <Card>
        <CardHeader>
          <CardTitle>Calculation *</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Method *</label>
            <select
              value={calcMethod}
              onChange={(e) => setCalcMethod(e.target.value as CalculationMethod)}
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select method</option>
              {Object.values(CalculationMethod).map((method) => (
                <option key={method} value={method}>
                  {method.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </option>
              ))}
            </select>
          </div>

          {calcMethod === CalculationMethod.PercentageOfWages && (
            <div>
              <label className="text-sm font-medium mb-2 block">Percentage (%)</label>
              <input
                type="number"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                min="0"
                max="100"
                step="0.01"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          )}

          {calcMethod === CalculationMethod.FlatAmountPerPeriod && (
            <>
              <div>
                <label className="text-sm font-medium mb-2 block">Flat Amount</label>
                <input
                  type="number"
                  value={flatAmount}
                  onChange={(e) => setFlatAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Period</label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as CalculationPeriodEnum)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select period</option>
                  {Object.values(CalculationPeriodEnum).map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {calcMethod === CalculationMethod.ProgressiveTable && (
            <div>
              <label className="text-sm font-medium mb-2 block">Tax Brackets</label>
              <div className="space-y-2">
                {brackets.map((bracket, index) => (
                  <div key={index} className="flex gap-2 items-end p-3 border rounded-md">
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground">Min Wage</label>
                      <input
                        type="number"
                        value={bracket.min_wage}
                        onChange={(e) => updateBracket(index, 'min_wage', parseFloat(e.target.value))}
                        min="0"
                        className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground">Max Wage</label>
                      <input
                        type="number"
                        value={bracket.max_wage || ''}
                        onChange={(e) => updateBracket(index, 'max_wage', e.target.value ? parseFloat(e.target.value) : null)}
                        min="0"
                        className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground">Rate %</label>
                      <input
                        type="number"
                        value={bracket.rate_percent}
                        onChange={(e) => updateBracket(index, 'rate_percent', parseFloat(e.target.value))}
                        min="0"
                        max="100"
                        step="0.01"
                        className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center space-x-1 text-xs">
                        <input
                          type="checkbox"
                          checked={bracket.marginal ?? true}
                          onChange={(e) => updateBracket(index, 'marginal', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <span>Marginal</span>
                      </label>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBracket(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addBracket}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Bracket
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Wage Base */}
      <Card>
        <CardHeader>
          <CardTitle>Wage Base (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Type</label>
              <select
                value={wageBaseType}
                onChange={(e) => setWageBaseType(e.target.value as WageBaseTypeEnum)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">None</option>
                {Object.values(WageBaseTypeEnum).map((type) => (
                  <option key={type} value={type}>
                    {type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>
            {wageBaseType && (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block">Amount</label>
                  <input
                    type="number"
                    value={wageBaseAmount}
                    onChange={(e) => setWageBaseAmount(e.target.value)}
                    min="0"
                    step="0.01"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Currency</label>
                  <select
                    value={wageBaseCurrency}
                    onChange={(e) => setWageBaseCurrency(e.target.value as WageBaseCurrencyEnum)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {Object.values(WageBaseCurrencyEnum).map((curr) => (
                      <option key={curr} value={curr}>{curr}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={wageBasePerEmployee}
                      onChange={(e) => setWageBasePerEmployee(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Per Employee</span>
                  </label>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Reset Frequency</label>
                  <select
                    value={wageBaseResetFreq}
                    onChange={(e) => setWageBaseResetFreq(e.target.value as WageBaseResetFrequencyEnum)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select frequency</option>
                    {Object.values(WageBaseResetFrequencyEnum).map((freq) => (
                      <option key={freq} value={freq}>
                        {freq.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Linked To</label>
                  <input
                    type="text"
                    value={wageBaseLinkedTo}
                    onChange={(e) => setWageBaseLinkedTo(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Reference to another tax"
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {isEditMode ? "Update" : "Create"} Tax Configuration
        </Button>
      </div>
    </form>
  );
}

