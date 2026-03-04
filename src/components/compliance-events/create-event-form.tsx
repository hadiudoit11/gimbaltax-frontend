"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus,
  Calendar,
  Loader2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useEventActions } from "@/hooks/use-compliance-events";
import type { ComplianceEventCreate } from "@/types/compliance-events";

interface CreateEventFormProps {
  onEventCreated: () => void;
}

export function CreateEventForm({ onEventCreated }: CreateEventFormProps) {
  const [formData, setFormData] = useState<ComplianceEventCreate>({
    title: '',
    description: '',
    event_type: 'tax_filing',
    priority: 'medium',
    jurisdiction_id: 1, // Default - should be replaced with jurisdiction selector
    due_date: '',
    reminder_date: '',
    notes: '',
  });

  const [success, setSuccess] = useState(false);
  const { loading, error, create } = useEventActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await create(formData);
      setSuccess(true);
      onEventCreated();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        event_type: 'tax_filing',
        priority: 'medium',
        jurisdiction_id: 1,
        due_date: '',
        reminder_date: '',
        notes: '',
      });

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to create event:', err);
    }
  };

  const handleChange = (field: keyof ComplianceEventCreate, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="gradient-card border-slate-600/50 shadow-2xl shadow-green-900/20">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-200">
            <Plus className="h-6 w-6 mr-3 bg-gradient-to-r from-green-500 to-emerald-500 p-1 rounded-lg text-white" />
            Create New Event
          </CardTitle>
          <p className="text-slate-400">
            Manually create a compliance event with deadlines and reminders.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {success && (
              <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Event created successfully!</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <div className="flex items-center space-x-2 text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-slate-300">
                Event Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g., Q1 2024 Pennsylvania Unemployment Tax Filing"
                required
                className="w-full rounded-lg border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-slate-300">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Detailed description of the compliance requirement..."
                rows={3}
                className="w-full rounded-lg border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
              />
            </div>

            {/* Event Type and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="eventType" className="block text-sm font-medium text-slate-300">
                  Event Type *
                </label>
                <select
                  id="eventType"
                  value={formData.event_type}
                  onChange={(e) => handleChange('event_type', e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                >
                  <option value="tax_filing">Tax Filing</option>
                  <option value="payment_due">Payment Due</option>
                  <option value="registration">Registration</option>
                  <option value="renewal">Renewal</option>
                  <option value="audit">Audit</option>
                  <option value="deadline">Compliance Deadline</option>
                  <option value="rate_change">Rate Change</option>
                  <option value="law_change">Law Change</option>
                  <option value="report">Report</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="priority" className="block text-sm font-medium text-slate-300">
                  Priority *
                </label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            {/* Due Date and Reminder Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="dueDate" className="block text-sm font-medium text-slate-300">
                  Due Date *
                </label>
                <input
                  type="datetime-local"
                  id="dueDate"
                  value={formData.due_date}
                  onChange={(e) => handleChange('due_date', e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="reminderDate" className="block text-sm font-medium text-slate-300">
                  Reminder Date
                </label>
                <input
                  type="datetime-local"
                  id="reminderDate"
                  value={formData.reminder_date}
                  onChange={(e) => handleChange('reminder_date', e.target.value)}
                  className="w-full rounded-lg border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                />
              </div>
            </div>

            {/* Jurisdiction Note */}
            <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <p className="text-xs text-blue-300">
                <strong>Note:</strong> Jurisdiction selection will be available once the jurisdictions API is integrated.
                Events are currently created with a default jurisdiction.
              </p>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label htmlFor="notes" className="block text-sm font-medium text-slate-300">
                Additional Notes
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Any additional information or special instructions..."
                rows={2}
                className="w-full rounded-lg border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                className="border-slate-600/50 text-slate-400 hover:border-slate-500"
                onClick={() => {
                  setFormData({
                    title: '',
                    description: '',
                    event_type: 'tax_filing',
                    priority: 'medium',
                    jurisdiction_id: 1,
                    due_date: '',
                    reminder_date: '',
                    notes: '',
                  });
                }}
              >
                Clear Form
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.title || !formData.due_date}
                className="gradient-button shadow-lg shadow-green-600/25"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Calendar className="h-4 w-4 mr-2" />
                )}
                {loading ? 'Creating...' : 'Create Event'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}