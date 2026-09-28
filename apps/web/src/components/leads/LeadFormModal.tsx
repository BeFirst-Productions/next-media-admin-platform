"use client";

import * as React from "react";
import { X, Building2, UserCheck, Globe, Instagram, Share2, DollarSign } from "lucide-react";
import type { LeadDto, CreateLeadPayload, LeadStatus, ContactMethod } from "@next-digital-crm/shared-types";
import { Button } from "@/components/ui/Button";

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<CreateLeadPayload>) => Promise<void>;
  initialData?: LeadDto | null;
  staffList?: Array<{ id: string; name: string }>;
}

export function LeadFormModal({ isOpen, onClose, onSubmit, initialData, staffList = [] }: LeadFormModalProps) {
  const [activeTab, setActiveTab] = React.useState<"basic" | "digital" | "sales">("basic");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Form State covering all 41 fields
  const [formData, setFormData] = React.useState<Partial<CreateLeadPayload>>({});

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        customLeadId: initialData.customLeadId || "",
        companyName: initialData.companyName || "",
        contactPerson: initialData.contactPerson || "",
        designation: initialData.designation || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        whatsapp: initialData.whatsapp || "",
        location: initialData.location || "",
        googleMapsLink: initialData.googleMapsLink || "",
        industry: initialData.industry || "",
        decisionMakerAvailable: initialData.decisionMakerAvailable || false,
        hasWebsite: initialData.hasWebsite || false,
        websiteUrl: initialData.websiteUrl || "",
        websiteScore: initialData.websiteScore ?? undefined,
        websiteIssues: initialData.websiteIssues || "",
        instagramUrl: initialData.instagramUrl || "",
        instagramFollowers: initialData.instagramFollowers ?? undefined,
        instagramPosts: initialData.instagramPosts ?? undefined,
        instagramLastPostDate: initialData.instagramLastPostDate ? initialData.instagramLastPostDate.split("T")[0] : "",
        instagramScore: initialData.instagramScore ?? undefined,
        facebookUrl: initialData.facebookUrl || "",
        linkedInUrl: initialData.linkedInUrl || "",
        hasGoogleBusiness: initialData.hasGoogleBusiness || false,
        googleRating: initialData.googleRating ?? undefined,
        googleReviews: initialData.googleReviews ?? undefined,
        socialMediaIssues: initialData.socialMediaIssues || "",
        servicesRequired: initialData.servicesRequired || "",
        recommendedPackageId: initialData.recommendedPackageId || "",
        value: initialData.value ? Number(initialData.value) : undefined,
        status: initialData.status || "NEW",
        conversionStatus: initialData.conversionStatus || "PENDING",
        firstContactDate: initialData.firstContactDate ? initialData.firstContactDate.split("T")[0] : "",
        contactMethod: initialData.contactMethod || "CALL",
        response: initialData.response || "",
        followUpDate: initialData.followUpDate ? initialData.followUpDate.split("T")[0] : "",
        meetingDate: initialData.meetingDate ? initialData.meetingDate.split("T")[0] : "",
        proposalSent: initialData.proposalSent || false,
        proposalValue: initialData.proposalValue ? Number(initialData.proposalValue) : undefined,
        remarks: initialData.remarks || "",
        additionalNotes: initialData.additionalNotes || "",
        assignedStaffId: initialData.assignedStaffId || "",
        researchExecutiveId: initialData.researchExecutiveId || "",
      });
    } else {
      setFormData({
        status: "NEW",
        conversionStatus: "PENDING",
        contactMethod: "CALL",
        decisionMakerAvailable: false,
        hasWebsite: false,
        hasGoogleBusiness: false,
        proposalSent: false,
      });
    }
    setActiveTab("basic");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof CreateLeadPayload, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.contactPerson) {
      alert("Please fill in required fields: Company Name and Contact Person");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      alert(err.message || "Failed to save lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-surface-900 border border-surface-700/60 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-800 bg-surface-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-surface-50">
                {initialData ? `Edit Lead: ${initialData.companyName}` : "Create New Prospect Lead"}
              </h2>
              <p className="text-xs text-surface-400">
                Complete lead profiling & digital research parameters
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-surface-400 hover:text-surface-100 rounded-lg hover:bg-surface-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Nav Tabs */}
        <div className="flex border-b border-surface-800 bg-surface-950/40 px-6">
          <button
            type="button"
            onClick={() => setActiveTab("basic")}
            className={`py-3 px-4 text-xs font-medium border-b-2 flex items-center gap-2 transition-all ${
              activeTab === "basic"
                ? "border-brand-500 text-brand-400"
                : "border-transparent text-surface-400 hover:text-surface-200"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            1. Core Info & Contact
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("digital")}
            className={`py-3 px-4 text-xs font-medium border-b-2 flex items-center gap-2 transition-all ${
              activeTab === "digital"
                ? "border-brand-500 text-brand-400"
                : "border-transparent text-surface-400 hover:text-surface-200"
            }`}
          >
            <Globe className="w-4 h-4" />
            2. Digital Audit & Social Scores
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("sales")}
            className={`py-3 px-4 text-xs font-medium border-b-2 flex items-center gap-2 transition-all ${
              activeTab === "sales"
                ? "border-brand-500 text-brand-400"
                : "border-transparent text-surface-400 hover:text-surface-200"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            3. Prospecting & Sales Status
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: Core Info & Contact */}
          {activeTab === "basic" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
              <div>
                <label className="block text-xs font-medium text-surface-300 mb-1">Custom Lead ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. LED-1001"
                  value={formData.customLeadId || ""}
                  onChange={(e) => handleChange("customLeadId", e.target.value)}
                  className="w-full bg-surface-950 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-surface-300 mb-1">
                  Company Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Company / Brand Name"
                  value={formData.companyName || ""}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  className="w-full bg-surface-950 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-surface-300 mb-1">
                  Contact Person <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Primary Contact Name"
                  value={formData.contactPerson || ""}
                  onChange={(e) => handleChange("contactPerson", e.target.value)}
                  className="w-full bg-surface-950 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-surface-300 mb-1">Designation</label>
                <input
                  type="text"
                  placeholder="e.g. Founder, CEO, Marketing Manager"
                  value={formData.designation || ""}
                  onChange={(e) => handleChange("designation", e.target.value)}
                  className="w-full bg-surface-950 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-surface-300 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="contact@company.com"
                  value={formData.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full bg-surface-950 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-surface-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+971 50 000 0000"
                  value={formData.phone || ""}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full bg-surface-950 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-surface-300 mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  placeholder="+971 50 000 0000"
                  value={formData.whatsapp || ""}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                  className="w-full bg-surface-950 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-surface-300 mb-1">Industry Sector</label>
                <input
                  type="text"
                  placeholder="e.g. Real Estate, E-commerce, Hospitality"
                  value={formData.industry || ""}
                  onChange={(e) => handleChange("industry", e.target.value)}
                  className="w-full bg-surface-950 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-surface-300 mb-1">Location / Address</label>
                <input
                  type="text"
                  placeholder="Dubai, UAE"
                  value={formData.location || ""}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="w-full bg-surface-950 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-surface-300 mb-1">Google Maps Link</label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/..."
                  value={formData.googleMapsLink || ""}
                  onChange={(e) => handleChange("googleMapsLink", e.target.value)}
                  className="w-full bg-surface-950 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-surface-300 mb-1">Assigned Sales Staff</label>
                <select
                  value={formData.assignedStaffId || ""}
                  onChange={(e) => handleChange("assignedStaffId", e.target.value)}
                  className="w-full bg-surface-950 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="">-- Unassigned --</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="decisionMakerAvailable"
                  checked={formData.decisionMakerAvailable || false}
                  onChange={(e) => handleChange("decisionMakerAvailable", e.target.checked)}
                  className="w-4 h-4 rounded border-surface-700 text-brand-500 focus:ring-brand-500 bg-surface-950"
                />
                <label htmlFor="decisionMakerAvailable" className="text-xs font-medium text-surface-200 cursor-pointer">
                  Decision Maker Available (Y/N)
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: Digital Audit & Social Scores */}
          {activeTab === "digital" && (
            <div className="space-y-6 animate-fade-in">
              {/* Website Section */}
              <div className="p-4 bg-surface-950/60 border border-surface-800 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-surface-100">
                    <Globe className="w-4 h-4 text-sky-400" />
                    Website Audit & Score
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-surface-300">
                    <input
                      type="checkbox"
                      checked={formData.hasWebsite || false}
                      onChange={(e) => handleChange("hasWebsite", e.target.checked)}
                      className="w-4 h-4 rounded border-surface-700 text-brand-500 bg-surface-950"
                    />
                    Website Exists (Y/N)
                  </label>
                </div>

                {formData.hasWebsite && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-surface-300 mb-1">Website URL</label>
                      <input
                        type="url"
                        placeholder="https://example.com"
                        value={formData.websiteUrl || ""}
                        onChange={(e) => handleChange("websiteUrl", e.target.value)}
                        className="w-full bg-surface-900 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-surface-300 mb-1">Website Score (1-10)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        placeholder="e.g. 7"
                        value={formData.websiteScore ?? ""}
                        onChange={(e) => handleChange("websiteScore", e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full bg-surface-900 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-surface-300 mb-1">Website Audit Issues</label>
                      <textarea
                        rows={2}
                        placeholder="Slow page load, non-responsive, outdated UI..."
                        value={formData.websiteIssues || ""}
                        onChange={(e) => handleChange("websiteIssues", e.target.value)}
                        className="w-full bg-surface-900 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Instagram & Social Profiles Section */}
              <div className="p-4 bg-surface-950/60 border border-surface-800 rounded-xl space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-surface-100">
                  <Instagram className="w-4 h-4 text-pink-400" />
                  Instagram & Social Media Audit
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-surface-300 mb-1">Instagram URL</label>
                    <input
                      type="url"
                      placeholder="https://instagram.com/..."
                      value={formData.instagramUrl || ""}
                      onChange={(e) => handleChange("instagramUrl", e.target.value)}
                      className="w-full bg-surface-900 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-surface-300 mb-1">Instagram Followers</label>
                    <input
                      type="number"
                      placeholder="e.g. 15000"
                      value={formData.instagramFollowers ?? ""}
                      onChange={(e) => handleChange("instagramFollowers", e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full bg-surface-900 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-surface-300 mb-1">Total Posts</label>
                    <input
                      type="number"
                      placeholder="e.g. 240"
                      value={formData.instagramPosts ?? ""}
                      onChange={(e) => handleChange("instagramPosts", e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full bg-surface-900 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-surface-300 mb-1">Last Post Date</label>
                    <input
                      type="date"
                      value={formData.instagramLastPostDate || ""}
                      onChange={(e) => handleChange("instagramLastPostDate", e.target.value)}
                      className="w-full bg-surface-900 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-surface-300 mb-1">Instagram Score (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      placeholder="e.g. 5"
                      value={formData.instagramScore ?? ""}
                      onChange={(e) => handleChange("instagramScore", e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full bg-surface-900 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-surface-300 mb-1">Facebook URL</label>
                    <input
                      type="url"
                      placeholder="https://facebook.com/..."
                      value={formData.facebookUrl || ""}
                      onChange={(e) => handleChange("facebookUrl", e.target.value)}
                      className="w-full bg-surface-900 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-surface-300 mb-1">LinkedIn URL</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/company/..."
                      value={formData.linkedInUrl || ""}
                      onChange={(e) => handleChange("linkedInUrl", e.target.value)}
                      className="w-full bg-surface-900 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-surface-300 mb-1">Social Media Issues</label>
                    <textarea
                      rows={2}
                      placeholder="Inconsistent posting, low engagement, unoptimized bio..."
                      value={formData.socialMediaIssues || ""}
                      onChange={(e) => handleChange("socialMediaIssues", e.target.value)}
                      className="w-full bg-surface-900 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              {/* Google Business Section */}
              <div className="p-4 bg-surface-950/60 border border-surface-800 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-surface-100">
                    <Share2 className="w-4 h-4 text-emerald-400" />
                    Google Business Profile
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-surface-300">
                    <input
                      type="checkbox"
                      checked={formData.hasGoogleBusiness || false}
                      onChange={(e) => handleChange("hasGoogleBusiness", e.target.checked)}
                      className="w-4 h-4 rounded border-surface-700 text-brand-500 bg-surface-950"
                    />
                    Google Business Registered (Y/N)
                  </label>
                </div>

                {formData.hasGoogleBusiness && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-surface-300 mb-1">Google Rating (1-5)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        placeholder="e.g. 4.8"
                        value={formData.googleRating ?? ""}
                        onChange={(e) => handleChange("googleRating", e.target.value ? parseFloat(e.target.value) : undefined)}
                        className="w-full bg-surface-900 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-surface-300 mb-1">Total Google Reviews</label>
                      <input
                        type="number"
                        placeholder="e.g. 142"
                        value={formData.googleReviews ?? ""}
                        onChange={(e) => handleChange("googleReviews", e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full bg-surface-900 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Prospecting & Sales Status */}
          {activeTab === "sales" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
              <div>
                <label className="block text-xs font-medium text-surface-300 mb-1">Services Required</label>
                <input
                  type="text"
                  placeholder="e.g. SEO, Social Media Marketing, Web Redesign"
                  value={formData.servicesRequired || ""}
                  onChange={(e) => handleChange("servicesRequired", e.target.value)}
                  className="w-full bg-surface-950 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-surface-300 mb-1">Lead Pipeline Status</label>
                <select
                  value={formData.status || "NEW"}
                  onChange={(e) => handleChange("status", e.target.value as LeadStatus)}
                  className="w-full bg-surface-950 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="NEW">New Prospect</option>
                  <option value="CONTACTED">Contacted / Approached</option>
                  <option value="QUALIFIED">Qualified Lead</option>
                  <option value="PROPOSAL_SENT">Proposal Sent</option>
                  <option value="NEGOTIATION">Under Negotiation</option>
                  <option value="APPROVED">Approved / Deal Won</option>
                  <option value="CLIENT font-bold">Client Converted</option>
                  <option value="LOST">Lost / Uninterested</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-surface-300 mb-1">First Contact Date</label>
                <input
                  type="date"
                  value={formData.firstContactDate || ""}
                  onChange={(e) => handleChange("firstContactDate", e.target.value)}
                  className="w-full bg-surface-950 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-surface-300 mb-1">Contact Method</label>
                <select
                  value={formData.contactMethod || "CALL"}
                  onChange={(e) => handleChange("contactMethod", e.target.value as ContactMethod)}
                  className="w-full bg-surface-950 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="CALL">Phone Call</option>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="EMAIL">Email</option>
                  <option value="IN_PERSON_MEETING">In-Person Meeting</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-surface-300 mb-1">Follow-up Date</label>
                <input
                  type="date"
                  value={formData.followUpDate || ""}
                  onChange={(e) => handleChange("followUpDate", e.target.value)}
                  className="w-full bg-surface-950 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-surface-300 mb-1">Scheduled Meeting Date</label>
                <input
                  type="date"
                  value={formData.meetingDate || ""}
                  onChange={(e) => handleChange("meetingDate", e.target.value)}
                  className="w-full bg-surface-950 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-surface-300 mb-1">Proposal Value (AED)</label>
                <input
                  type="number"
                  placeholder="e.g. 15000"
                  value={formData.proposalValue ?? ""}
                  onChange={(e) => handleChange("proposalValue", e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full bg-surface-950 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="proposalSent"
                  checked={formData.proposalSent || false}
                  onChange={(e) => handleChange("proposalSent", e.target.checked)}
                  className="w-4 h-4 rounded border-surface-700 text-brand-500 bg-surface-950"
                />
                <label htmlFor="proposalSent" className="text-xs font-medium text-surface-200 cursor-pointer">
                  Proposal Sent to Client (Y/N)
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-surface-300 mb-1">Response / Meeting Notes</label>
                <textarea
                  rows={2}
                  placeholder="Summary of customer feedback and key discussion points..."
                  value={formData.response || ""}
                  onChange={(e) => handleChange("response", e.target.value)}
                  className="w-full bg-surface-950 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-surface-300 mb-1">Remarks & Additional Notes</label>
                <textarea
                  rows={2}
                  placeholder="Internal notes, payment terms requested, custom requirements..."
                  value={formData.remarks || ""}
                  onChange={(e) => handleChange("remarks", e.target.value)}
                  className="w-full bg-surface-950 border border-surface-800 rounded-lg px-3 py-2 text-sm text-surface-100 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-surface-800">
            <div className="text-xs text-surface-400">
              * Required fields must be completed
            </div>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="default" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : initialData ? "Update Lead" : "Create Lead"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
