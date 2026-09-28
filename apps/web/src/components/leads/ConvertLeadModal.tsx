"use client";

import * as React from "react";
import { X, Building2, DollarSign, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import type { LeadDto } from "@next-digital-crm/shared-types";
import { Button } from "@/components/ui/Button";

interface ConvertLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadDto | null;
  onConvert: (leadId: string, payload: { billingAddress?: string; conversionValue?: number; notes?: string }) => Promise<void>;
}

export function ConvertLeadModal({ isOpen, onClose, lead, onConvert }: ConvertLeadModalProps) {
  const [conversionValue, setConversionValue] = React.useState<number>(0);
  const [billingAddress, setBillingAddress] = React.useState<string>("");
  const [notes, setNotes] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (lead) {
      const initialVal = lead.proposalValue ? Number(lead.proposalValue) : lead.value ? Number(lead.value) : 0;
      setConversionValue(initialVal);
      setBillingAddress(lead.location || "");
      setNotes(lead.remarks || "");
    }
  }, [lead, isOpen]);

  if (!isOpen || !lead) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConvert(lead.id, {
        billingAddress,
        conversionValue,
        notes,
      });
      onClose();
    } catch (err: any) {
      alert(err.message || "Failed to convert lead to client");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-surface-900 border border-brand-500/30 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-brand-950 via-surface-900 to-surface-900 border-b border-surface-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  Lead Conversion
                </span>
                <span className="text-xs text-surface-400">{lead.customLeadId || "LEAD"}</span>
              </div>
              <h2 className="text-lg font-bold text-surface-50 mt-1">
                Convert to Registered Client
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-surface-400 hover:text-surface-100 rounded-lg hover:bg-surface-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Target Company Banner */}
          <div className="p-4 bg-surface-950 border border-surface-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-surface-400">Company Name</span>
              <span className="text-xs font-semibold text-brand-400">{lead.industry || "General"}</span>
            </div>
            <p className="text-base font-bold text-surface-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-400" />
              {lead.companyName}
            </p>
            <div className="flex items-center gap-4 pt-1 text-xs text-surface-300">
              <span>Contact: <strong>{lead.contactPerson}</strong></span>
              {lead.phone && <span>Phone: {lead.phone}</span>}
            </div>
          </div>

          <p className="text-xs text-surface-300 leading-relaxed">
            Converting this lead will automatically register <strong>{lead.companyName}</strong> in the
            Client Directory table, create a primary contact profile, and transition the lead status to <strong>CLIENT (CONVERTED)</strong>.
          </p>

          {/* Form Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-surface-300 mb-1 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Agreed Conversion / Contract Value (AED)
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={conversionValue}
                onChange={(e) => setConversionValue(parseFloat(e.target.value) || 0)}
                className="w-full bg-surface-950 border border-surface-800 rounded-lg px-3 py-2 text-sm font-semibold text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-surface-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                Client Billing Address
              </label>
              <textarea
                rows={2}
                placeholder="Full billing address for invoices..."
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                className="w-full bg-surface-950 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-surface-300 mb-1">
                Conversion Remarks & Onboarding Notes
              </label>
              <textarea
                rows={2}
                placeholder="Payment confirmation details, initial project scope, onboarding notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-surface-950 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-800">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="default" className="bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2" disabled={isSubmitting}>
              {isSubmitting ? "Converting..." : "Confirm & Convert to Client"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
