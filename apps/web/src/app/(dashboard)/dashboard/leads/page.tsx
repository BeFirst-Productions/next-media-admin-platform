"use client";

import * as React from "react";
import {
  UserCheck, Plus, Search, LayoutGrid, List,
  Building2, DollarSign, CheckCircle2,
  Eye, Edit, Trash2, TrendingUp
} from "lucide-react";
import type { LeadDto, CreateLeadPayload } from "@next-digital-crm/shared-types";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LeadFormModal } from "@/components/leads/LeadFormModal";
import { LeadDetailModal } from "@/components/leads/LeadDetailModal";
import { ConvertLeadModal } from "@/components/leads/ConvertLeadModal";
import { apiClient } from "@/lib/api-client";

// Fallback mock leads data to ensure the UI renders gracefully even if API is empty/offline
const MOCK_LEADS: LeadDto[] = [
  {
    id: "lead-01",
    customLeadId: "LED-1001",
    date: "2026-09-20T10:00:00Z",
    companyName: "Al Hamra Real Estate LLC",
    contactPerson: "Rashid Al Mansoori",
    designation: "Managing Director",
    email: "rashid@alhamra-realestate.ae",
    phone: "+971 50 123 4567",
    whatsapp: "+971 50 123 4567",
    location: "Downtown Dubai",
    googleMapsLink: "https://maps.google.com",
    industry: "Real Estate",
    decisionMakerAvailable: true,
    hasWebsite: true,
    websiteUrl: "https://alhamra-realestate.ae",
    websiteScore: 8,
    websiteIssues: "Needs SEO optimization and mobile redesign",
    instagramUrl: "https://instagram.com/alhamraredubai",
    instagramFollowers: 24500,
    instagramPosts: 310,
    instagramScore: 7,
    hasGoogleBusiness: true,
    googleRating: 4.6,
    googleReviews: 89,
    servicesRequired: "SEO, Social Media Marketing & Web Audit",
    value: 25000,
    status: "PROPOSAL_SENT",
    conversionStatus: "PENDING",
    firstContactDate: "2026-09-21T00:00:00Z",
    contactMethod: "IN_PERSON_MEETING",
    response: "Interested in monthly digital retainer package",
    proposalSent: true,
    proposalValue: 25000,
    remarks: "High priority lead with budget approved for Q4",
    createdById: "usr-admin-01",
    createdAt: "2026-09-20T10:00:00Z",
    updatedAt: "2026-09-24T12:00:00Z",
  },
  {
    id: "lead-02",
    customLeadId: "LED-1002",
    date: "2026-09-22T11:30:00Z",
    companyName: "Nexus Tech Solutions",
    contactPerson: "Amira Hassan",
    designation: "Head of Marketing",
    email: "amira@nexustech.io",
    phone: "+971 55 987 6543",
    whatsapp: "+971 55 987 6543",
    location: "Business Bay, Dubai",
    industry: "Technology & Software",
    decisionMakerAvailable: true,
    hasWebsite: true,
    websiteUrl: "https://nexustech.io",
    websiteScore: 9,
    instagramUrl: "https://instagram.com/nexustech",
    instagramFollowers: 12000,
    instagramScore: 6,
    hasGoogleBusiness: true,
    googleRating: 4.8,
    googleReviews: 120,
    servicesRequired: "Performance Ads & Lead Generation",
    value: 40000,
    status: "CLIENT",
    conversionStatus: "CONVERTED",
    proposalSent: true,
    proposalValue: 40000,
    convertedAt: "2026-09-24T14:00:00Z",
    client: {
      id: "clt-02",
      customClientId: "CLT-1002",
      companyName: "Nexus Tech Solutions",
      clientStatus: "ACTIVE",
      createdAt: "2026-09-24T14:00:00Z",
      updatedAt: "2026-09-24T14:00:00Z",
    },
    remarks: "Converted after proposal acceptance and deposit paid",
    createdById: "usr-admin-01",
    createdAt: "2026-09-22T11:30:00Z",
    updatedAt: "2026-09-24T14:00:00Z",
  },
];

export default function LeadsManagementPage() {
  const [leads, setLeads] = React.useState<LeadDto[]>(MOCK_LEADS);
  const [staffList, setStaffList] = React.useState<Array<{ id: string; name: string }>>([]);
  // Filters & Search
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [viewMode, setViewMode] = React.useState<"table" | "kanban">("table");

  // Modal states
  const [isFormOpen, setIsFormOpen] = React.useState<boolean>(false);
  const [selectedLeadForEdit, setSelectedLeadForEdit] = React.useState<LeadDto | null>(null);

  const [isDetailOpen, setIsDetailOpen] = React.useState<boolean>(false);
  const [selectedLeadForInspect, setSelectedLeadForInspect] = React.useState<LeadDto | null>(null);

  const [isConvertOpen, setIsConvertOpen] = React.useState<boolean>(false);
  const [selectedLeadForConvert, setSelectedLeadForConvert] = React.useState<LeadDto | null>(null);

  const fetchLeads = async () => {
    try {
      const res = await apiClient<{ items: LeadDto[] }>("/leads");
      if (res.data?.items && Array.isArray(res.data.items) && res.data.items.length > 0) {
        setLeads(res.data.items);
      }
    } catch {
      // Keep mock fallback if database server is initializing
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await apiClient<Array<{ id: string; name: string }>>("/users");
      if (res.data && Array.isArray(res.data)) {
        setStaffList(res.data.map((u: any) => ({ id: u.id, name: u.name })));
      }
    } catch {}
  };

  React.useEffect(() => {
    fetchLeads();
    fetchUsers();
  }, []);

  // Filtering
  const filteredLeads = leads.filter((lead) => {
    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "CONVERTED"
        ? lead.conversionStatus === "CONVERTED" || lead.status === "CLIENT"
        : lead.status === statusFilter;

    const matchesSearch =
      !searchQuery ||
      lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.customLeadId && lead.customLeadId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lead.industry && lead.industry.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  // KPI Computations
  const totalLeads = leads.length;
  const convertedCount = leads.filter((l) => l.conversionStatus === "CONVERTED" || l.status === "CLIENT").length;
  const conversionRate = totalLeads > 0 ? Math.round((convertedCount / totalLeads) * 100) : 0;
  const totalPipelineValue = leads.reduce((acc, l) => acc + (Number(l.proposalValue) || Number(l.value) || 0), 0);

  // Handlers
  const handleSaveLead = async (payload: Partial<CreateLeadPayload>) => {
    if (selectedLeadForEdit) {
      // Update
      const res = await apiClient<LeadDto>(`/leads/${selectedLeadForEdit.id}`, {
        method: "PATCH",
        body: payload,
      });
      if (res.data) {
        setLeads((prev) => prev.map((l) => (l.id === selectedLeadForEdit.id ? { ...l, ...res.data } : l)));
      } else {
        await fetchLeads();
      }
    } else {
      // Create
      const res = await apiClient<LeadDto>("/leads", {
        method: "POST",
        body: payload,
      });
      if (res.data) {
        setLeads((prev) => [res.data, ...prev]);
      } else {
        await fetchLeads();
      }
    }
  };

  const handleExecuteConvert = async (
    leadId: string,
    payload: { billingAddress?: string; conversionValue?: number; notes?: string }
  ) => {
    const res = await apiClient<any>(`/leads/${leadId}/convert`, {
      method: "POST",
      body: payload,
    });
    if (res.success) {
      alert("Success! Lead converted and registered into Client Directory.");
      await fetchLeads();
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      await apiClient(`/leads/${id}`, { method: "DELETE" });
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete lead");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-md border border-brand-500/20">
              Growth & Acquisition
            </span>
            <span className="text-xs text-surface-400">• Full Prospecting Lifecycle</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-50 flex items-center gap-2.5 mt-1">
            <UserCheck className="w-6 h-6 text-brand-400" />
            Leads Management & Research
          </h1>
          <p className="text-xs text-surface-400 mt-1">
            Profile leads, perform digital audit scoring, track outreach, and convert confirmed deals into clients.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="default"
            onClick={() => {
              setSelectedLeadForEdit(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Lead
          </Button>
        </div>
      </div>

      {/* KPI Metrics Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-surface-900/60 border-surface-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-surface-400 font-medium">Total Prospect Leads</p>
              <h3 className="text-2xl font-bold text-surface-50 mt-1">{totalLeads}</h3>
            </div>
            <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <UserCheck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-900/60 border-surface-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-surface-400 font-medium">Converted Clients</p>
              <h3 className="text-2xl font-bold text-emerald-400 mt-1">
                {convertedCount} <span className="text-xs font-normal text-surface-400">({conversionRate}%)</span>
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-900/60 border-surface-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-surface-400 font-medium">Pipeline Value (AED)</p>
              <h3 className="text-2xl font-bold text-surface-50 mt-1">
                AED {totalPipelineValue.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-900/60 border-surface-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-surface-400 font-medium">Proposal Sent Ratio</p>
              <h3 className="text-2xl font-bold text-amber-400 mt-1">
                {leads.filter((l) => l.proposalSent).length} <span className="text-xs font-normal text-surface-400">sent</span>
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar & Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 bg-surface-900/80 border border-surface-800 rounded-2xl">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {[
            { id: "ALL", label: "All Leads" },
            { id: "NEW", label: "New" },
            { id: "CONTACTED", label: "Contacted" },
            { id: "QUALIFIED", label: "Qualified" },
            { id: "PROPOSAL_SENT", label: "Proposal Sent" },
            { id: "NEGOTIATION", label: "Negotiation" },
            { id: "CONVERTED", label: "Converted Clients" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20 font-semibold"
                  : "text-surface-400 hover:text-surface-100 hover:bg-surface-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & View Toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              placeholder="Search company, ID, contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-950 border border-surface-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-surface-100 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex items-center border border-surface-800 rounded-xl bg-surface-950 p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === "table" ? "bg-surface-800 text-surface-50" : "text-surface-400 hover:text-surface-200"
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === "kanban" ? "bg-surface-800 text-surface-50" : "text-surface-400 hover:text-surface-200"
              }`}
              title="Kanban Pipeline"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content View */}
      {viewMode === "table" ? (
        <div className="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-surface-300">
              <thead className="bg-surface-950 border-b border-surface-800 text-surface-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">Lead ID & Company</th>
                  <th className="px-4 py-3">Contact Person</th>
                  <th className="px-4 py-3">Industry / Location</th>
                  <th className="px-4 py-3">Digital Scores</th>
                  <th className="px-4 py-3">Status / Conversion</th>
                  <th className="px-4 py-3">Proposal (AED)</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-800/60">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-surface-500">
                      No matching leads found. Click <strong>Add New Lead</strong> to create one.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const isConverted = lead.conversionStatus === "CONVERTED" || lead.status === "CLIENT";

                    return (
                      <tr key={lead.id} className="hover:bg-surface-800/40 transition-colors">
                        {/* Company & ID */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-surface-950 border border-surface-800 text-brand-400">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[11px] font-bold text-brand-400">
                                  {lead.customLeadId || "LED"}
                                </span>
                                <span className="font-semibold text-surface-100 text-xs">
                                  {lead.companyName}
                                </span>
                              </div>
                              <span className="text-[11px] text-surface-400 block">
                                Created: {new Date(lead.date || lead.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Contact Person */}
                        <td className="px-4 py-3.5">
                          <div className="font-medium text-surface-200">{lead.contactPerson}</div>
                          {lead.email && <div className="text-[11px] text-surface-400">{lead.email}</div>}
                          {lead.phone && <div className="text-[11px] text-emerald-400">{lead.phone}</div>}
                        </td>

                        {/* Industry & Location */}
                        <td className="px-4 py-3.5">
                          <div className="text-surface-200 font-medium">{lead.industry || "General"}</div>
                          <div className="text-[11px] text-surface-400">{lead.location || "Dubai, UAE"}</div>
                        </td>

                        {/* Digital Audit Scores */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            {lead.hasWebsite ? (
                              <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] font-bold">
                                Web {lead.websiteScore ? `${lead.websiteScore}/10` : "✓"}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-surface-800 text-surface-400 text-[10px]">
                                No Web
                              </span>
                            )}
                            {lead.instagramScore && (
                              <span className="px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20 text-[10px] font-bold">
                                IG {lead.instagramScore}/10
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status & Conversion */}
                        <td className="px-4 py-3.5">
                          <div className="space-y-1">
                            <Badge variant={isConverted ? "success" : "warning"}>
                              {isConverted ? "REGISTERED CLIENT" : lead.status}
                            </Badge>
                            {isConverted && lead.client && (
                              <span className="text-[10px] font-mono text-emerald-400 block">
                                {lead.client.customClientId}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Proposal Value */}
                        <td className="px-4 py-3.5 font-semibold text-surface-100">
                          {lead.proposalValue ? (
                            <span className="text-emerald-400">AED {Number(lead.proposalValue).toLocaleString()}</span>
                          ) : (
                            <span className="text-surface-400 font-normal text-[11px]">Pending</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {!isConverted && (
                              <button
                                onClick={() => {
                                  setSelectedLeadForConvert(lead);
                                  setIsConvertOpen(true);
                                }}
                                className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-lg transition-colors flex items-center gap-1"
                                title="Convert to Client Table"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                Convert
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setSelectedLeadForInspect(lead);
                                setIsDetailOpen(true);
                              }}
                              className="p-1.5 text-surface-400 hover:text-surface-100 hover:bg-surface-800 rounded-lg transition-colors"
                              title="Inspect Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => {
                                setSelectedLeadForEdit(lead);
                                setIsFormOpen(true);
                              }}
                              className="p-1.5 text-surface-400 hover:text-surface-100 hover:bg-surface-800 rounded-lg transition-colors"
                              title="Edit Lead"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              disabled={isConverted}
                              onClick={() => handleDeleteLead(lead.id)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isConverted
                                  ? "text-surface-600 opacity-40 cursor-not-allowed"
                                  : "text-surface-400 hover:text-red-400 hover:bg-surface-800"
                              }`}
                              title={
                                isConverted
                                  ? "Converted leads cannot be deleted to preserve client record history"
                                  : "Delete Lead"
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto pb-4">
          {[
            { id: "NEW", title: "New Prospects", bg: "border-blue-500/30" },
            { id: "CONTACTED", title: "Contacted / Approached", bg: "border-amber-500/30" },
            { id: "PROPOSAL_SENT", title: "Proposal Sent", bg: "border-purple-500/30" },
            { id: "CLIENT", title: "Converted Clients", bg: "border-emerald-500/30" },
          ].map((col) => {
            const colLeads = leads.filter((l) =>
              col.id === "CLIENT" ? l.conversionStatus === "CONVERTED" || l.status === "CLIENT" : l.status === col.id
            );

            return (
              <div key={col.id} className={`bg-surface-900/70 border ${col.bg} rounded-2xl p-4 flex flex-col space-y-3 min-h-[450px]`}>
                <div className="flex items-center justify-between pb-2 border-b border-surface-800">
                  <h3 className="text-xs font-bold text-surface-100 uppercase tracking-wider">{col.title}</h3>
                  <span className="text-xs font-bold text-surface-400 bg-surface-950 px-2 py-0.5 rounded-full border border-surface-800">
                    {colLeads.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => {
                        setSelectedLeadForInspect(lead);
                        setIsDetailOpen(true);
                      }}
                      className="p-3.5 bg-surface-950 border border-surface-800/80 rounded-xl hover:border-brand-500/50 cursor-pointer transition-all shadow-md group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono font-bold text-brand-400">{lead.customLeadId || "LED"}</span>
                        {lead.proposalValue && (
                          <span className="text-[11px] font-bold text-emerald-400">
                            AED {Number(lead.proposalValue).toLocaleString()}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-surface-50 group-hover:text-brand-300 transition-colors">
                        {lead.companyName}
                      </h4>
                      <p className="text-[11px] text-surface-400 mt-1">{lead.contactPerson}</p>

                      <div className="mt-3 pt-2 border-t border-surface-800/60 flex items-center justify-between text-[10px] text-surface-400">
                        <span>{lead.industry || "General"}</span>
                        {lead.conversionStatus === "CONVERTED" ? (
                          <span className="text-emerald-400 font-bold">CLIENT</span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLeadForConvert(lead);
                              setIsConvertOpen(true);
                            }}
                            className="text-emerald-400 hover:underline font-semibold"
                          >
                            Convert →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <LeadFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSaveLead}
        initialData={selectedLeadForEdit}
        staffList={staffList}
      />

      <LeadDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        lead={selectedLeadForInspect}
        onEdit={(lead) => {
          setIsDetailOpen(false);
          setSelectedLeadForEdit(lead);
          setIsFormOpen(true);
        }}
        onConvert={(lead) => {
          setIsDetailOpen(false);
          setSelectedLeadForConvert(lead);
          setIsConvertOpen(true);
        }}
      />

      <ConvertLeadModal
        isOpen={isConvertOpen}
        onClose={() => setIsConvertOpen(false)}
        lead={selectedLeadForConvert}
        onConvert={handleExecuteConvert}
      />
    </div>
  );
}
