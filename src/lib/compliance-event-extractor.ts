import { TaxConfigCreate, TaxConfigUpdate, ComplianceEventCreate, EventType, EventPriority } from '@/api-client/types';

interface ExtractedComplianceInfo {
  title: string;
  description: string;
  eventType: EventType;
  priority: EventPriority;
  dueDates: Date[];
  reminderDays?: number;
}

/**
 * Extract compliance events from tax configuration data
 */
export const extractComplianceEventsFromTaxConfig = (
  taxConfigData: TaxConfigCreate | TaxConfigUpdate & { id?: number },
  jurisdictionId?: number
): ComplianceEventCreate[] => {
  console.log('[extractComplianceEventsFromTaxConfig] Starting extraction:', {
    payload: taxConfigData.payload,
    jurisdictionId,
    hasRemittance: !!taxConfigData.payload?.remittance
  });

  const events: ComplianceEventCreate[] = [];
  const payload = taxConfigData.payload;
  
  if (!payload || !jurisdictionId) {
    console.log('[extractComplianceEventsFromTaxConfig] Early return - missing payload or jurisdictionId');
    return events;
  }

  const taxName = payload.name || 'Tax';
  const authority = payload.authority || 'Tax Authority';
  const category = payload.category;
  const remittance = payload.remittance;

  // Extract filing requirements from remittance data
  if (remittance?.filing_frequency) {
    console.log('[extractComplianceEventsFromTaxConfig] Found remittance data:', remittance);
    const filingInfo = extractFilingEvents(taxName, authority, remittance.filing_frequency, remittance.form_name);
    
    // Generate due dates for the next year based on filing frequency
    const dueDates = generateDueDatesForFrequency(remittance.filing_frequency, new Date());
    
    dueDates.forEach((dueDate, index) => {
      const event: ComplianceEventCreate = {
        title: `${filingInfo.title}${filingInfo.formSuffix}`,
        description: `${filingInfo.description}\n\nTax: ${taxName}\nAuthority: ${authority}\nCategory: ${category}`,
        event_type: filingInfo.eventType,
        priority: filingInfo.priority,
        jurisdiction_id: jurisdictionId,
        due_date: dueDate.toISOString(),
        reminder_date: new Date(dueDate.getTime() - (filingInfo.reminderDays || 7) * 24 * 60 * 60 * 1000).toISOString(),
        event_data: {
          tax_config_id: taxConfigData.id,
          tax_name: taxName,
          authority,
          category,
          form_name: remittance.form_name,
          filing_frequency: remittance.filing_frequency,
          auto_generated: true,
          source: 'tax_config_save'
        },
        related_tax_config_ids: taxConfigData.id ? [taxConfigData.id] : [],
        notes: `Auto-generated from tax configuration save. Filing frequency: ${remittance.filing_frequency}`
      };
      
      events.push(event);
    });
  }

  // Extract payment/remittance events if different from filing
  const remittedBy = payload.remitted_by;
  if (remittedBy === 'employer' && remittance?.filing_frequency) {
    // Generate payment events (typically due before filing)
    const paymentDates = generatePaymentDatesForFrequency(remittance.filing_frequency, new Date());
    
    paymentDates.forEach(paymentDate => {
      const event: ComplianceEventCreate = {
        title: `${taxName} Payment Due`,
        description: `Payment deadline for ${taxName}\n\nRemitted by: ${remittedBy}\nAuthority: ${authority}\nCategory: ${category}`,
        event_type: EventType.Payment,
        priority: EventPriority.High,
        jurisdiction_id: jurisdictionId,
        due_date: paymentDate.toISOString(),
        reminder_date: new Date(paymentDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days before
        event_data: {
          tax_config_id: taxConfigData.id,
          tax_name: taxName,
          authority,
          category,
          remitted_by: remittedBy,
          auto_generated: true,
          source: 'tax_config_save'
        },
        related_tax_config_ids: taxConfigData.id ? [taxConfigData.id] : [],
        notes: `Auto-generated payment reminder from tax configuration save.`
      };
      
      events.push(event);
    });
  }

  // Extract wage base reset events if applicable
  const wageBase = payload.wage_base;
  if (wageBase?.reset_frequency && wageBase.reset_frequency !== 'never') {
    const resetDates = generateResetDatesForFrequency(wageBase.reset_frequency, new Date());
    
    resetDates.forEach(resetDate => {
      const event: ComplianceEventCreate = {
        title: `${taxName} Wage Base Reset`,
        description: `Wage base limit resets for ${taxName}\n\nCurrent limit: ${wageBase.amount ? `$${wageBase.amount}` : 'See tax config'}\nReset frequency: ${wageBase.reset_frequency}`,
        event_type: EventType.WageBaseReset,
        priority: EventPriority.Medium,
        jurisdiction_id: jurisdictionId,
        due_date: resetDate.toISOString(),
        reminder_date: new Date(resetDate.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks before
        event_data: {
          tax_config_id: taxConfigData.id,
          tax_name: taxName,
          wage_base_amount: wageBase.amount,
          reset_frequency: wageBase.reset_frequency,
          auto_generated: true,
          source: 'tax_config_save'
        },
        related_tax_config_ids: taxConfigData.id ? [taxConfigData.id] : [],
        notes: `Auto-generated wage base reset reminder from tax configuration save.`
      };
      
      events.push(event);
    });
  }

  console.log('[extractComplianceEventsFromTaxConfig] Returning events:', events.length);
  return events;
};

const extractFilingEvents = (taxName: string, authority: string, frequency: string, formName?: string) => {
  const formSuffix = formName ? ` (${formName})` : '';
  
  switch (frequency) {
    case 'weekly':
      return {
        title: `${taxName} Weekly Filing`,
        formSuffix,
        description: `Weekly filing requirement for ${taxName}`,
        eventType: EventType.Filing as EventType,
        priority: EventPriority.High as EventPriority,
        reminderDays: 2
      };
    case 'monthly':
      return {
        title: `${taxName} Monthly Filing`,
        formSuffix,
        description: `Monthly filing requirement for ${taxName}`,
        eventType: EventType.Filing as EventType,
        priority: EventPriority.High as EventPriority,
        reminderDays: 5
      };
    case 'quarterly':
      return {
        title: `${taxName} Quarterly Filing`,
        formSuffix,
        description: `Quarterly filing requirement for ${taxName}`,
        eventType: EventType.Filing as EventType,
        priority: EventPriority.High as EventPriority,
        reminderDays: 7
      };
    case 'annually':
      return {
        title: `${taxName} Annual Filing`,
        formSuffix,
        description: `Annual filing requirement for ${taxName}`,
        eventType: EventType.Filing as EventType,
        priority: EventPriority.High as EventPriority,
        reminderDays: 14
      };
    case 'as_needed':
      return {
        title: `${taxName} Filing (As Needed)`,
        formSuffix,
        description: `Variable filing requirement for ${taxName}`,
        eventType: EventType.Filing as EventType,
        priority: EventPriority.Medium as EventPriority,
        reminderDays: 7
      };
    default:
      return {
        title: `${taxName} Filing`,
        formSuffix,
        description: `Filing requirement for ${taxName}`,
        eventType: EventType.Filing as EventType,
        priority: EventPriority.Medium as EventPriority,
        reminderDays: 7
      };
  }
};

const generateDueDatesForFrequency = (frequency: string, startDate: Date): Date[] => {
  const dates: Date[] = [];
  const currentYear = startDate.getFullYear();
  const nextYear = currentYear + 1;

  switch (frequency) {
    case 'weekly':
      // Generate weekly dates for next 12 weeks
      for (let i = 1; i <= 12; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + (i * 7));
        dates.push(date);
      }
      break;
      
    case 'monthly':
      // Generate monthly dates for next 12 months (last day of each month)
      for (let i = 1; i <= 12; i++) {
        const date = new Date(currentYear, startDate.getMonth() + i + 1, 0); // Last day of month
        dates.push(date);
      }
      break;
      
    case 'quarterly':
      // Generate quarterly dates (Mar 31, Jun 30, Sep 30, Dec 31)
      const quarterEndMonths = [2, 5, 8, 11]; // March, June, September, December (0-indexed)
      quarterEndMonths.forEach(month => {
        // Current year quarters
        if (month >= startDate.getMonth()) {
          const date = new Date(currentYear, month + 1, 0); // Last day of month
          dates.push(date);
        }
        // Next year quarters  
        const nextYearDate = new Date(nextYear, month + 1, 0);
        dates.push(nextYearDate);
      });
      break;
      
    case 'annually':
      // Generate annual date (December 31st of current and next year)
      dates.push(new Date(currentYear, 11, 31)); // Dec 31 current year
      dates.push(new Date(nextYear, 11, 31)); // Dec 31 next year
      break;
      
    case 'as_needed':
      // Generate a reminder for review in 6 months
      const reviewDate = new Date(startDate);
      reviewDate.setMonth(startDate.getMonth() + 6);
      dates.push(reviewDate);
      break;
      
    default:
      // Default to quarterly
      const defaultQuarterEndMonths = [2, 5, 8, 11];
      defaultQuarterEndMonths.forEach(month => {
        if (month >= startDate.getMonth()) {
          const date = new Date(currentYear, month + 1, 0);
          dates.push(date);
        }
        const nextYearDate = new Date(nextYear, month + 1, 0);
        dates.push(nextYearDate);
      });
      break;
  }

  // Filter out past dates and limit to next 2 years
  const now = new Date();
  const twoYearsFromNow = new Date();
  twoYearsFromNow.setFullYear(now.getFullYear() + 2);
  
  return dates.filter(date => date > now && date <= twoYearsFromNow);
};

const generatePaymentDatesForFrequency = (frequency: string, startDate: Date): Date[] => {
  // Payment dates are typically a few days before filing dates
  const filingDates = generateDueDatesForFrequency(frequency, startDate);
  
  return filingDates.map(filingDate => {
    const paymentDate = new Date(filingDate);
    
    // Payment typically due 1-3 days before filing depending on frequency
    switch (frequency) {
      case 'weekly':
        paymentDate.setDate(paymentDate.getDate() - 1); // 1 day before
        break;
      case 'monthly':
        paymentDate.setDate(paymentDate.getDate() - 1); // 1 day before
        break;
      case 'quarterly':
        paymentDate.setDate(paymentDate.getDate() - 1); // 1 day before
        break;
      case 'annually':
        paymentDate.setDate(paymentDate.getDate() - 3); // 3 days before
        break;
      default:
        paymentDate.setDate(paymentDate.getDate() - 1); // 1 day before
        break;
    }
    
    return paymentDate;
  });
};

const generateResetDatesForFrequency = (resetFreq: string, startDate: Date): Date[] => {
  const dates: Date[] = [];
  const currentYear = startDate.getFullYear();
  const nextYear = currentYear + 1;

  switch (resetFreq) {
    case 'yearly':
      // January 1st reset
      dates.push(new Date(nextYear, 0, 1));
      dates.push(new Date(nextYear + 1, 0, 1));
      break;
      
    case 'quarterly':
      // January 1, April 1, July 1, October 1
      const quarterStartMonths = [0, 3, 6, 9]; // Jan, Apr, Jul, Oct (0-indexed)
      quarterStartMonths.forEach(month => {
        if (month > startDate.getMonth()) {
          dates.push(new Date(currentYear, month, 1));
        }
        dates.push(new Date(nextYear, month, 1));
      });
      break;
      
    case 'monthly':
      // First day of each month
      for (let i = 1; i <= 12; i++) {
        if (startDate.getMonth() + i < 12) {
          dates.push(new Date(currentYear, startDate.getMonth() + i, 1));
        } else {
          dates.push(new Date(nextYear, (startDate.getMonth() + i) % 12, 1));
        }
      }
      break;
      
    default:
      // Default to yearly
      dates.push(new Date(nextYear, 0, 1));
      break;
  }

  // Filter future dates only
  const now = new Date();
  return dates.filter(date => date > now);
};