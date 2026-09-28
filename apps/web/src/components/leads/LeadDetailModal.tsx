"use client";

import * as React from "react";
import { X, Building2, User, Mail, Phone, MapPin, Globe, Instagram, Star, DollarSign, CheckCircle2, UserCheck } from "lucide-react";
import type { LeadDto } from "@next-digital-crm/shared-types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface LeadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadDto | null;
  onEdit: (lead: LeadDto) => void;
  onConvert: (lead: LeadDto) => void;
}

export function LeadDetailModal({ isOpen, onClose, lead, onEdit, onConvert }: LeadDetailModalProps) {
  if (!isOpen || !lead) return null;

  const isConverted = lead.conversionStatus === "CONVERTED" || lead.status === "CLIENT" || !!lead.client;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-surface-900 border border-surface-700/60 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-surface-950 via-surface-900 to-surface-900 border-b border-surface-800 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-md border border-brand-500/20">
                  {lead.customLeadId || "LED-NEW"}
                </span>
                <Badge variant={isConverted ? "success" : "warning"}>
                  {isConverted ? "REGISTERED CLIENT" : lead.status}
                </Badge>
                {lead.industry && (
                  <span className="text-xs text-surface-400 font-medium">
                    • {lead.industry}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-surface-50 mt-1">
                {lead.companyName}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isConverted && (
              <Button
                variant="default"
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5"
                onClick={() => onConvert(lead)}
              >
                <CheckCircle2 className="w-4 h-4" />
                Convert to Client
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => onEdit(lead)}>
              Edit Lead
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 text-surface-400 hover:text-surface-100 rounded-lg hover:bg-surface-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Conversion Alert Banner */}
          {isConverted ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-sm font-semibold text-emerald-300">Lead Converted to Active Client</h4>
                  <p className="text-xs text-emerald-400/80">
                    Client ID: {lead.client?.customClientId || "CLT-ACTIVE"} • Converted on{" "}
                    {lead.convertedAt ? new Date(lead.convertedAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-brand-400" />
                <div>
                  <h4 className="text-sm font-semibold text-surface-100">Prospecting Phase Active</h4>
                  <p className="text-xs text-surface-400">
                    When terms & payment are confirmed, convert this lead into the official Client table.
                  </p>
                </div>
              </div>
              <Button
                variant="default"
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5"
                onClick={() => onConvert(lead)}
              >
                Convert Now
              </Button>
            </div>
          )}

          {/* Grid 1: Primary Contact & Lead Core */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-surface-950 border border-surface-800 rounded-xl space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-400 flex items-center gap-2">
                <User className="w-4 h-4 text-brand-400" />
                Contact Information
              </h3>
              <div className="space-y-2 text-sm text-surface-200">
                <div className="flex items-center justify-between">
                  <span className="text-surface-400 text-xs">Contact Person</span>
                  <span className="font-semibold text-surface-100">{lead.contactPerson}</span>
                </div>
                {lead.designation && (
                  <div className="flex items-center justify-between">
                    <span className="text-surface-400 text-xs">Designation</span>
                    <span>{lead.designation}</span>
                  </div>
                )}
                {lead.email && (
                  <div className="flex items-center justify-between">
                    <span className="text-surface-400 text-xs">Email</span>
                    <a href={`mailto:${lead.email}`} className="text-brand-400 hover:underline flex items-center gap-1 text-xs">
                      <Mail className="w-3 h-3" /> {lead.email}
                    </a>
                  </div>
                )}
                {lead.phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-surface-400 text-xs">Phone</span>
                    <a href={`tel:${lead.phone}`} className="text-xs text-surface-200 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-400" /> {lead.phone}
                    </a>
                  </div>
                )}
                {lead.whatsapp && (
                  <div className="flex items-center justify-between">
                    <span className="text-surface-400 text-xs">WhatsApp</span>
                    <span className="text-xs text-emerald-400">{lead.whatsapp}</span>
                  </div>
                )}
                {lead.location && (
                  <div className="flex items-center justify-between">
                    <span className="text-surface-400 text-xs">Location</span>
                    <span className="text-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-sky-400" /> {lead.location}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-1 border-t border-surface-800/60">
                  <span className="text-surface-400 text-xs">Decision Maker Available</span>
                  <Badge variant={lead.decisionMakerAvailable ? "success" : "secondary"}>
                    {lead.decisionMakerAvailable ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-4 bg-surface-950 border border-surface-800 rounded-xl space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-400 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Sales & Prospecting Summary
              </h3>
              <div className="space-y-2 text-sm text-surface-200">
                <div className="flex items-center justify-between">
                  <span className="text-surface-400 text-xs">Proposal Value (AED)</span>
                  <span className="font-bold text-emerald-400 text-base">
                    {lead.proposalValue ? `AED ${Number(lead.proposalValue).toLocaleString()}` : "Not Sent"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-surface-400 text-xs">Services Required</span>
                  <span className="text-xs font-medium text-surface-100">{lead.servicesRequired || "General CRM / Marketing"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-surface-400 text-xs">First Contact Date</span>
                  <span className="text-xs">{lead.firstContactDate ? new Date(lead.firstContactDate).toLocaleDateString() : "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-surface-400 text-xs">Contact Method</span>
                  <span className="text-xs font-medium uppercase text-sky-400">{lead.contactMethod || "CALL"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-surface-400 text-xs">Follow-up Scheduled</span>
                  <span className="text-xs font-semibold text-amber-400">{lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : "None"}</span>
                </div>
                {lead.assignedStaff && (
                  <div className="flex items-center justify-between pt-1 border-t border-surface-800/60">
                    <span className="text-surface-400 text-xs">Assigned Staff</span>
                    <span className="text-xs font-medium text-brand-400">{lead.assignedStaff.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Grid 2: Digital Audit Scores */}
          <div className="p-5 bg-surface-950 border border-surface-800 rounded-xl space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-400 flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400" />
              Digital Audit & Social Research Data
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Website Score */}
              <div className="p-3 bg-surface-900 border border-surface-800 rounded-lg space-y-1">
                <div className="flex items-center justify-between text-xs text-surface-400">
                  <span>Website Status</span>
                  <Badge variant={lead.hasWebsite ? "success" : "danger"}>
                    {lead.hasWebsite ? "Has Website" : "No Website"}
                  </Badge>
                </div>
                {lead.hasWebsite && (
                  <>
                    <div className="text-lg font-bold text-sky-400 mt-1">
                      Score: {lead.websiteScore ? `${lead.websiteScore} / 10` : "N/A"}
                    </div>
                    {lead.websiteUrl && (
                      <a href={lead.websiteUrl} target="_blank" rel="noreferrer" className="text-xs text-brand-400 hover:underline truncate block">
                        {lead.websiteUrl}
                      </a>
                    )}
                    {lead.websiteIssues && (
                      <p className="text-xs text-surface-400 mt-1 line-clamp-2">Issues: {lead.websiteIssues}</p>
                    )}
                  </>
                )}
              </div>

              {/* Instagram Audit */}
              <div className="p-3 bg-surface-900 border border-surface-800 rounded-lg space-y-1">
                <div className="flex items-center justify-between text-xs text-surface-400">
                  <span className="flex items-center gap-1 text-pink-400">
                    <Instagram className="w-3.5 h-3.5" /> Instagram
                  </span>
                  <span className="font-bold text-pink-400">
                    {lead.instagramScore ? `${lead.instagramScore} / 10` : "N/A"}
                  </span>
                </div>
                <div className="text-sm font-semibold text-surface-100 mt-1">
                  {lead.instagramFollowers ? `${lead.instagramFollowers.toLocaleString()} Followers` : "Unspecified"}
                </div>
                <div className="text-xs text-surface-400">
                  Posts: {lead.instagramPosts || 0} • Last: {lead.instagramLastPostDate ? new Date(lead.instagramLastPostDate).toLocaleDateString() : "N/A"}
                </div>
                {lead.socialMediaIssues && (
                  <p className="text-xs text-surface-400 mt-1 line-clamp-2">Issues: {lead.socialMediaIssues}</p>
                )}
              </div>

              {/* Google Business Audit */}
              <div className="p-3 bg-surface-900 border border-surface-800 rounded-lg space-y-1">
                <div className="flex items-center justify-between text-xs text-surface-400">
                  <span>Google Business</span>
                  <Badge variant={lead.hasGoogleBusiness ? "success" : "secondary"}>
                    {lead.hasGoogleBusiness ? "Claimed" : "No Listing"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center text-amber-400 text-sm font-bold gap-1">
                    <Star className="w-4 h-4 fill-amber-400" />
                    {lead.googleRating ? `${lead.googleRating} / 5` : "N/A"}
                  </div>
                  <span className="text-xs text-surface-400">({lead.googleReviews || 0} reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Remarks & Notes */}
          {lead.remarks && (
            <div className="p-4 bg-surface-950 border border-surface-800 rounded-xl space-y-1">
              <h4 className="text-xs font-semibold text-surface-400">Remarks & Customer Feedback</h4>
              <p className="text-sm text-surface-200 leading-relaxed">{lead.remarks}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
