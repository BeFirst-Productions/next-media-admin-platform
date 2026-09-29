"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  UserCheck,
  UserMinus,
  Trophy,
  PhoneOff,
  Search,
  Filter,
  RotateCcw,
  Plus,
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
  Phone,
  Mail,
  Calendar,
  Building2,
  DollarSign,
  ArrowLeft,
  X,
  FileText,
  Sparkles,
} from "lucide-react";
import {
  LeadItem,
  LeadStatus,
  LeadPriority,
  LeadSource,
  PIPELINE_STAGES,
  LEAD_STATS,
  STAFF_MEMBERS,
  INITIAL_LEADS,
} from "@/datas/leads.data";
import { useToast } from "@/hooks/useToast";
import { DataTable, DataTableColumn } from "@/components/ui/DataTable";

export default function LeadManagementPage() {
  const { toast } = useToast();

  // Leads Data State
  const [leads, setLeads] = React.useState<LeadItem[]>(INITIAL_LEADS);
  const [selectedLeadIds, setSelectedLeadIds] = React.useState<string[]>([]);

  // Filter States
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = React.useState<string>("ALL");
  const [sourceFilter, setSourceFilter] = React.useState<string>("ALL");
  const [staffFilter, setStaffFilter] = React.useState<string>("ALL");

  // Sorting State
  const [sortField, setSortField] = React.useState<keyof LeadItem>("id");
  const [sortAsc, setSortAsc] = React.useState(true);

  // Pagination States
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  // Active chevron pipeline filter
  const [activePipelineStage, setActivePipelineStage] = React.useState<string | null>(null);

  // In-Page Form View State (Replaces popup modal as in User Management)
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingLead, setEditingLead] = React.useState<LeadItem | null>(null);
  const [viewingLead, setViewingLead] = React.useState<LeadItem | null>(null);
  const formRef = React.useRef<HTMLDivElement>(null);

  // Form State
  interface LeadFormState {
    company: string;
    contactPerson: string;
    phone: string;
    email: string;
    source: LeadSource;
    assignedStaff: string;
    status: LeadStatus;
    priority: LeadPriority;
    dealValue: string;
    nextFollowUp: string;
    notes: string;
  }

  const initialFormValues: LeadFormState = {
    company: "",
    contactPerson: "",
    phone: "+971 50 ",
    email: "",
    source: "Website",
    assignedStaff: STAFF_MEMBERS[0].name,
    status: "New",
    priority: "Medium",
    dealValue: "AED 25,000",
    nextFollowUp: "24 May 2026",
    notes: "",
  };

  const [formData, setFormData] = React.useState<LeadFormState>(initialFormValues);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = React.useState<Record<string, boolean>>({});

  // Open In-Page Create Form
  const handleOpenCreateForm = () => {
    setEditingLead(null);
    setFormData(initialFormValues);
    setFormErrors({});
    setTouchedFields({});
    setIsFormOpen(true);
    setViewingLead(null);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  // Open In-Page Edit Form
  const handleOpenEditForm = (lead: LeadItem) => {
    setEditingLead(lead);
    setFormData({
      company: lead.company,
      contactPerson: lead.contactPerson,
      phone: lead.phone,
      email: lead.email,
      source: lead.source,
      assignedStaff: lead.assignedTo.name,
      status: lead.status,
      priority: lead.priority,
      dealValue: lead.dealValue || "AED 25,000",
      nextFollowUp: lead.nextFollowUp !== "-" ? lead.nextFollowUp : "24 May 2026",
      notes: lead.notes || "",
    });
    setFormErrors({});
    setTouchedFields({});
    setIsFormOpen(true);
    setViewingLead(null);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  // Handle Pipeline Chevron Click
  const handlePipelineClick = (stageName: string) => {
    if (activePipelineStage === stageName) {
      setActivePipelineStage(null);
      setStatusFilter("ALL");
    } else {
      setActivePipelineStage(stageName);
      setStatusFilter(stageName);
      setCurrentPage(1);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
    setSourceFilter("ALL");
    setStaffFilter("ALL");
    setActivePipelineStage(null);
    setCurrentPage(1);
    toast({
      type: "info",
      title: "Filters Reset",
      description: "Showing all lead records.",
    });
  };

  // Filter & Search Logic
  const filteredLeads = React.useMemo(() => {
    return leads
      .filter((lead) => {
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          lead.id.toLowerCase().includes(q) ||
          lead.company.toLowerCase().includes(q) ||
          lead.contactPerson.toLowerCase().includes(q) ||
          lead.email.toLowerCase().includes(q) ||
          lead.phone.toLowerCase().includes(q);

        const matchesStatus =
          statusFilter === "ALL" || lead.status === statusFilter;

        const matchesPriority =
          priorityFilter === "ALL" || lead.priority === priorityFilter;

        const matchesSource =
          sourceFilter === "ALL" || lead.source === sourceFilter;

        const matchesStaff =
          staffFilter === "ALL" || lead.assignedTo.name === staffFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesPriority &&
          matchesSource &&
          matchesStaff
        );
      })
      .sort((a, b) => {
        const aVal = a[sortField] ?? "";
        const bVal = b[sortField] ?? "";
        if (aVal < bVal) return sortAsc ? -1 : 1;
        if (aVal > bVal) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [leads, searchQuery, statusFilter, priorityFilter, sourceFilter, staffFilter, sortField, sortAsc]);

  // Paginated Leads
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const paginatedLeads = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage, pageSize]);

  // Keep page within bounds
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Form Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.company.trim()) errors.company = "Company name is required";
    if (!formData.contactPerson.trim()) errors.contactPerson = "Contact person name is required";
    if (!formData.email.trim() || !formData.email.includes("@")) errors.email = "Valid email address is required";
    if (!formData.phone.trim() || formData.phone.trim().length < 8) errors.phone = "Valid phone number is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save Lead (In-Page Form Submit)
  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        type: "error",
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
      });
      return;
    }

    const assignedStaffObj =
      STAFF_MEMBERS.find((s) => s.name === formData.assignedStaff) ||
      STAFF_MEMBERS[0];

    if (editingLead) {
      // Update
      const updated: LeadItem = {
        ...editingLead,
        company: formData.company,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        source: formData.source,
        assignedTo: assignedStaffObj,
        status: formData.status,
        priority: formData.priority,
        dealValue: formData.dealValue,
        nextFollowUp: formData.nextFollowUp,
        notes: formData.notes,
      };
      setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      toast({
        type: "success",
        title: "Lead Updated",
        description: `${updated.company} details updated successfully.`,
      });
    } else {
      // Create new
      const nextIdNum =
        Math.max(...leads.map((l) => parseInt(l.id.replace("LD-", ""), 10) || 1200)) + 1;
      const newLead: LeadItem = {
        id: `LD-${nextIdNum}`,
        index: leads.length + 1,
        company: formData.company,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        source: formData.source,
        assignedTo: assignedStaffObj,
        status: formData.status,
        priority: formData.priority,
        lastFollowUp: "Today (Created)",
        nextFollowUp: formData.nextFollowUp,
        dealValue: formData.dealValue,
        notes: formData.notes,
        createdDate: "Today",
      };
      setLeads((prev) => [newLead, ...prev]);
      toast({
        type: "success",
        title: "Lead Created",
        description: `${newLead.company} (${newLead.id}) has been added.`,
      });
    }

    setIsFormOpen(false);
  };

  // Delete Lead
  const handleDeleteLead = (id: string) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setSelectedLeadIds((prev) => prev.filter((item) => item !== id));
    toast({
      type: "info",
      title: "Lead Removed",
      description: `${lead.company} (${lead.id}) has been deleted.`,
    });
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Lead ID",
      "Company",
      "Contact Person",
      "Phone",
      "Email",
      "Source",
      "Assigned To",
      "Status",
      "Priority",
      "Last Follow-up",
      "Next Follow-up",
    ];
    const rows = filteredLeads.map((l) => [
      l.id,
      `"${l.company}"`,
      `"${l.contactPerson}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      l.source,
      `"${l.assignedTo.name}"`,
      l.status,
      l.priority,
      `"${l.lastFollowUp}"`,
      `"${l.nextFollowUp}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `next_crm_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      type: "success",
      title: "Export Complete",
      description: `Exported ${filteredLeads.length} leads to CSV.`,
    });
  };

  // DataTable Columns Configuration matching User Management table
  const columns = React.useMemo<DataTableColumn<LeadItem>[]>(() => [
    {
      id: "index",
      header: "#",
      width: "48px",
      align: "center",
      cell: ({ index }) => (
        <span className="text-slate-400 font-mono text-xs">
          {(currentPage - 1) * pageSize + index + 1}
        </span>
      ),
    },
    {
      id: "id",
      header: "LEAD ID",
      sortable: true,
      sortKey: "id",
      cell: ({ row }) => (
        <button
          onClick={() => setViewingLead(row)}
          className="font-bold text-sky-400 hover:text-sky-300 font-mono transition-colors text-xs"
        >
          {row.id}
        </button>
      ),
    },
    {
      id: "company",
      header: "CUSTOMER / COMPANY",
      sortable: true,
      sortKey: "company",
      cell: ({ row }) => (
        <div className="min-w-0">
          <p className="font-semibold text-white tracking-tight text-xs sm:text-sm">{row.company}</p>
          <p className="text-slate-400 text-[11px]">{row.contactPerson}</p>
        </div>
      ),
    },
    {
      id: "contact",
      header: "CONTACT",
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <a
            href={`tel:${row.phone}`}
            className="flex items-center gap-1.5 text-slate-300 hover:text-sky-400 transition-colors font-mono text-[11px]"
          >
            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{row.phone}</span>
          </a>
          <a
            href={`mailto:${row.email}`}
            className="flex items-center gap-1.5 text-slate-400 hover:text-sky-400 transition-colors text-[11px] truncate max-w-[180px] block"
          >
            <Mail className="w-3 h-3 text-slate-400 inline shrink-0" />
            <span className="truncate">{row.email}</span>
          </a>
        </div>
      ),
    },
    {
      id: "source",
      header: "SOURCE",
      sortable: true,
      sortKey: "source",
      cell: ({ row }) => {
        const sourceStyles: Record<LeadSource, string> = {
          Website: "bg-sky-500/15 text-sky-400 border-sky-500/30",
          Referral: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
          "Social Media": "bg-pink-500/15 text-pink-400 border-pink-500/30",
          "Google Ads": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
          "Walk-in": "bg-amber-500/15 text-amber-400 border-amber-500/30",
          Exhibition: "bg-teal-500/15 text-teal-400 border-teal-500/30",
        };
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
              sourceStyles[row.source] || "bg-slate-800 text-slate-300"
            }`}
          >
            {row.source}
          </span>
        );
      },
    },
    {
      id: "assignedTo",
      header: "ASSIGNED TO",
      sortable: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={row.assignedTo.avatar}
            alt={row.assignedTo.name}
            className="w-6 h-6 rounded-full object-cover border border-[#1d3568] shrink-0"
          />
          <span className="text-slate-200 font-medium text-xs truncate">
            {row.assignedTo.name}
          </span>
        </div>
      ),
    },
    {
      id: "status",
      header: "STATUS",
      sortable: true,
      sortKey: "status",
      align: "center",
      cell: ({ row }) => {
        const statusStyles: Record<LeadStatus, string> = {
          New: "bg-blue-600/20 text-blue-400 border-blue-500/30",
          Contacted: "bg-sky-600/20 text-sky-300 border-sky-500/30",
          Interested: "bg-cyan-600/20 text-cyan-300 border-cyan-500/30",
          "Follow-up": "bg-purple-600/20 text-purple-300 border-purple-500/30",
          "Proposal Sent": "bg-indigo-600/20 text-indigo-300 border-indigo-500/30",
          Negotiation: "bg-amber-600/20 text-amber-300 border-amber-500/30",
          Won: "bg-emerald-600/20 text-emerald-300 border-emerald-500/30",
          Lost: "bg-rose-600/20 text-rose-300 border-rose-500/30",
          "Not Interested": "bg-slate-700/30 text-slate-400 border-slate-600/30",
        };
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${
              statusStyles[row.status] || "bg-slate-800 text-slate-300"
            }`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      id: "priority",
      header: "PRIORITY",
      sortable: true,
      sortKey: "priority",
      align: "center",
      cell: ({ row }) => {
        const priorityStyles: Record<LeadPriority, string> = {
          High: "bg-rose-500/15 text-rose-400 border-rose-500/30",
          Medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
          Low: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        };
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${
              priorityStyles[row.priority] || "bg-slate-800 text-slate-300"
            }`}
          >
            {row.priority}
          </span>
        );
      },
    },
    {
      id: "lastFollowUp",
      header: "LAST FOLLOW-UP",
      sortable: true,
      sortKey: "lastFollowUp",
      cellClassName: "text-slate-300 text-[11px]",
      accessorKey: "lastFollowUp",
    },
    {
      id: "nextFollowUp",
      header: "NEXT FOLLOW UP",
      sortable: true,
      sortKey: "nextFollowUp",
      cellClassName: "text-slate-300 text-[11px] font-mono",
      accessorKey: "nextFollowUp",
    },
    {
      id: "actions",
      header: "ACTIONS",
      align: "center",
      cell: ({ row }) => (
        <div className="inline-flex items-center gap-1.5">
          <button
            onClick={() => setViewingLead(row)}
            className="p-1.5 rounded-md hover:bg-cyan-950/40 text-slate-400 hover:text-cyan-400 transition-colors"
            title="View Lead Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenEditForm(row)}
            className="p-1.5 rounded-md hover:bg-[#0c1a36] text-slate-300 hover:text-white transition-colors"
            title="Edit Lead"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteLead(row.id)}
            className="p-1.5 rounded-md hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors"
            title="Delete Lead"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ], [currentPage, pageSize]);

  return (
    <div className="space-y-5 animate-fade-in pb-12 w-full max-w-full">
      {/* ==================================================================== */}
      {/* 1. TOP HEADER & BREADCRUMBS                                          */}
      {/* ==================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {isFormOpen
              ? editingLead
                ? `Edit Lead: ${editingLead.company}`
                : "Create New Lead"
              : "Lead Management"}
          </h1>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mt-1">
            <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">
              Dashboard
            </Link>
            <span>›</span>
            <span
              className={isFormOpen ? "hover:text-cyan-400 cursor-pointer" : "text-white font-medium"}
              onClick={() => isFormOpen && setIsFormOpen(false)}
            >
              Lead Management
            </span>
            {isFormOpen && (
              <>
                <span>›</span>
                <span className="text-cyan-400 font-semibold">
                  {editingLead ? "Edit Lead" : "Create Lead"}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Button: Switches between "+ Add New Lead" and "Back to List" */}
        <button
          onClick={isFormOpen ? () => setIsFormOpen(false) : handleOpenCreateForm}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 active:scale-[0.98] ${
            isFormOpen
              ? "bg-[#0c1a36] border border-[#1e386e] text-slate-200 hover:text-white hover:border-[#2a4a85] shadow-sm"
              : "bg-[#0092e0] hover:bg-[#0081c7] text-white shadow-[0_0_20px_rgba(0,146,224,0.4)]"
          }`}
        >
          {isFormOpen ? (
            <>
              <ArrowLeft className="w-4 h-4" />
              <span>Back to List</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Add New Lead</span>
            </>
          )}
        </button>
      </div>

      {/* ==================================================================== */}
      {/* 2. IN-PAGE FORM VIEW (REPLACES POPUP MODAL AS IN USER MANAGEMENT)    */}
      {/* ==================================================================== */}
      {isFormOpen ? (
        <div ref={formRef} className="animate-fade-in bg-[#091326] border border-[#16274e] rounded-2xl shadow-2xl overflow-hidden">
          {/* Form Header Banner */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#132347] bg-gradient-to-r from-[#070e1c] via-[#091326] to-[#070e1c]">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#0092e0]/15 border border-[#0092e0]/30 flex items-center justify-center text-[#00c5ff]">
                {editingLead ? <Pencil className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {editingLead ? `Edit Lead Details: ${editingLead.id}` : "Create New Prospective Lead"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  {editingLead
                    ? `Updating requirements & contact details for ${editingLead.company}`
                    : "Fill in prospective client information, attribution source, and assign sales executive."}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsFormOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#0e1a33] transition-colors shrink-0"
              aria-label="Close form"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Main Body */}
          <form noValidate onSubmit={handleSaveLead} className="p-6 sm:p-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: Pipeline Stage & Lead Summary Card */}
              <div className="lg:col-span-4 xl:col-span-4 space-y-4">
                <div className="bg-[#070e1c] border border-[#16274e] rounded-2xl p-5 shadow-lg space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-[#132347]">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider">
                      Pipeline &amp; Status
                    </h3>
                  </div>

                  {/* Status Selection */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Pipeline Stage
                    </label>
                    <div className="relative">
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStatus })}
                        className="w-full appearance-none bg-[#091326] border border-[#142344] focus:border-cyan-500 rounded-xl px-3 py-2.5 text-slate-200 text-xs focus:outline-none cursor-pointer"
                      >
                        {PIPELINE_STAGES.map((s) => (
                          <option key={s.id} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Priority Selection */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Priority Level
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["High", "Medium", "Low"] as const).map((p) => {
                        const isSelected = formData.priority === p;
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setFormData({ ...formData, priority: p })}
                            className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                              isSelected
                                ? p === "High"
                                  ? "bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-sm"
                                  : p === "Medium"
                                  ? "bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-sm"
                                  : "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-sm"
                                : "bg-[#091326] border-[#142344] text-slate-400 hover:text-white"
                            }`}
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Estimated Deal Value */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Estimated Deal Value
                    </label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={formData.dealValue}
                        onChange={(e) => setFormData({ ...formData, dealValue: e.target.value })}
                        placeholder="e.g. AED 35,000"
                        className="w-full bg-[#091326] border border-[#142344] focus:border-cyan-500 rounded-xl pl-9 pr-3 py-2.5 text-slate-100 text-xs font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Inbound Source */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Inbound Source
                    </label>
                    <div className="relative">
                      <select
                        value={formData.source}
                        onChange={(e) => setFormData({ ...formData, source: e.target.value as LeadSource })}
                        className="w-full appearance-none bg-[#091326] border border-[#142344] focus:border-cyan-500 rounded-xl px-3 py-2.5 text-slate-200 text-xs focus:outline-none cursor-pointer"
                      >
                        <option value="Website">Website</option>
                        <option value="Referral">Referral</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Google Ads">Google Ads</option>
                        <option value="Walk-in">Walk-in</option>
                        <option value="Exhibition">Exhibition</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Assigned Account Executive */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Assigned Account Executive
                    </label>
                    <div className="relative">
                      <select
                        value={formData.assignedStaff}
                        onChange={(e) => setFormData({ ...formData, assignedStaff: e.target.value })}
                        className="w-full appearance-none bg-[#091326] border border-[#142344] focus:border-cyan-500 rounded-xl px-3 py-2.5 text-slate-200 text-xs focus:outline-none cursor-pointer"
                      >
                        {STAFF_MEMBERS.map((staff) => (
                          <option key={staff.name} value={staff.name}>
                            {staff.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Next Follow-up Date */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Next Follow-up Date
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={formData.nextFollowUp}
                        onChange={(e) => setFormData({ ...formData, nextFollowUp: e.target.value })}
                        placeholder="e.g. 24 May 2026"
                        className="w-full bg-[#091326] border border-[#142344] focus:border-cyan-500 rounded-xl pl-9 pr-3 py-2.5 text-slate-100 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Form Inputs Re-arranged */}
              <div className="lg:col-span-8 xl:col-span-8 space-y-6">
                {/* SECTION 1: Customer & Company Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#132347]">
                    <Building2 className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                      1. Customer &amp; Organization Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Company Name */}
                    <div>
                      <label className="text-xs sm:text-sm font-semibold text-slate-300 block mb-2">
                        Company Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => {
                          setFormData({ ...formData, company: e.target.value });
                          if (formErrors.company) setFormErrors({ ...formErrors, company: "" });
                        }}
                        onBlur={() => setTouchedFields({ ...touchedFields, company: true })}
                        placeholder="e.g. Bright Solutions LLC"
                        className={`w-full bg-[#070e1c] border rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors text-sm ${
                          formErrors.company
                            ? "border-rose-500/80 bg-rose-950/15 focus:border-rose-500"
                            : "border-[#142344] focus:border-cyan-500"
                        }`}
                      />
                      {formErrors.company && (
                        <p className="text-rose-400 text-xs mt-1">{formErrors.company}</p>
                      )}
                    </div>

                    {/* Contact Person */}
                    <div>
                      <label className="text-xs sm:text-sm font-semibold text-slate-300 block mb-2">
                        Contact Person Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.contactPerson}
                        onChange={(e) => {
                          setFormData({ ...formData, contactPerson: e.target.value });
                          if (formErrors.contactPerson) setFormErrors({ ...formErrors, contactPerson: "" });
                        }}
                        onBlur={() => setTouchedFields({ ...touchedFields, contactPerson: true })}
                        placeholder="e.g. Ahmed Khan"
                        className={`w-full bg-[#070e1c] border rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors text-sm ${
                          formErrors.contactPerson
                            ? "border-rose-500/80 bg-rose-950/15 focus:border-rose-500"
                            : "border-[#142344] focus:border-cyan-500"
                        }`}
                      />
                      {formErrors.contactPerson && (
                        <p className="text-rose-400 text-xs mt-1">{formErrors.contactPerson}</p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="text-xs sm:text-sm font-semibold text-slate-300 block mb-2">
                        Phone Number <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (formErrors.phone) setFormErrors({ ...formErrors, phone: "" });
                        }}
                        onBlur={() => setTouchedFields({ ...touchedFields, phone: true })}
                        placeholder="+971 50 123 4567"
                        className={`w-full bg-[#070e1c] border rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors text-sm font-mono ${
                          formErrors.phone
                            ? "border-rose-500/80 bg-rose-950/15 focus:border-rose-500"
                            : "border-[#142344] focus:border-cyan-500"
                        }`}
                      />
                      {formErrors.phone && (
                        <p className="text-rose-400 text-xs mt-1">{formErrors.phone}</p>
                      )}
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="text-xs sm:text-sm font-semibold text-slate-300 block mb-2">
                        Email Address <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (formErrors.email) setFormErrors({ ...formErrors, email: "" });
                        }}
                        onBlur={() => setTouchedFields({ ...touchedFields, email: true })}
                        placeholder="ahmed@brightsolutions.ae"
                        className={`w-full bg-[#070e1c] border rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors text-sm ${
                          formErrors.email
                            ? "border-rose-500/80 bg-rose-950/15 focus:border-rose-500"
                            : "border-[#142344] focus:border-cyan-500"
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-rose-400 text-xs mt-1">{formErrors.email}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* SECTION 2: Requirements & Notes */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#132347]">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                      2. Project Scope &amp; Discussion Notes
                    </h3>
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-semibold text-slate-300 block mb-2">
                      Client Requirements &amp; Follow-up Context
                    </label>
                    <textarea
                      rows={4}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Outline key services requested (branding, marketing, SEO, web development), estimated launch timeline, and decision-maker contact preferences..."
                      className="w-full bg-[#070e1c] border border-[#142344] focus:border-cyan-500 rounded-xl p-4 text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors text-sm leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Footer Action Bar */}
            <div className="pt-6 border-t border-[#132347] flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#1e386e] text-slate-300 hover:text-white hover:border-[#2a4a85] transition-colors text-sm font-semibold text-center"
              >
                Cancel &amp; Return to List
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setFormData(initialFormValues);
                    setFormErrors({});
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#142344] text-slate-400 hover:text-slate-200 hover:bg-[#0c1a36] transition-colors text-sm font-medium"
                >
                  Reset Form
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#0092e0] hover:bg-[#0081c7] text-white text-sm font-bold shadow-[0_0_20px_rgba(0,146,224,0.45)] transition-all active:scale-[0.98]"
                >
                  {editingLead ? "Save Lead Changes" : "Create & Provision Lead"}
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        /* ==================================================================== */
        /* 3. LIST VIEW (KPI STATS + CHEVRON FUNNEL + FILTER BAR + DATA TABLE)  */
        /* ==================================================================== */
        <>
          {/* STATS ROW (6 KPI CARDS) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 w-full">
            {/* Total Leads */}
            <div className="bg-[#091326] border border-[#132347] rounded-xl p-3.5 flex items-center gap-3.5 hover:border-[#1e386e] transition-all">
              <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-slate-400 truncate">Total Leads</p>
                <p className="text-xl font-bold text-white leading-tight">{LEAD_STATS.totalLeads.count}</p>
                <p className="text-[10px] font-semibold text-emerald-400 flex items-center gap-0.5 mt-0.5">
                  <span>{LEAD_STATS.totalLeads.change}</span>
                </p>
              </div>
            </div>

            {/* New Leads */}
            <div className="bg-[#091326] border border-[#132347] rounded-xl p-3.5 flex items-center gap-3.5 hover:border-[#1e386e] transition-all">
              <div className="w-10 h-10 rounded-full bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                <UserPlus className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-slate-400 truncate">New Leads</p>
                <p className="text-xl font-bold text-white leading-tight">{LEAD_STATS.newLeads.count}</p>
                <p className="text-[10px] font-semibold text-emerald-400 flex items-center gap-0.5 mt-0.5">
                  <span>{LEAD_STATS.newLeads.change}</span>
                </p>
              </div>
            </div>

            {/* Interested Leads */}
            <div className="bg-[#091326] border border-[#132347] rounded-xl p-3.5 flex items-center gap-3.5 hover:border-[#1e386e] transition-all">
              <div className="w-10 h-10 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-slate-400 truncate">Interested Leads</p>
                <p className="text-xl font-bold text-white leading-tight">{LEAD_STATS.interestedLeads.count}</p>
                <p className="text-[10px] font-semibold text-emerald-400 flex items-center gap-0.5 mt-0.5">
                  <span>{LEAD_STATS.interestedLeads.change}</span>
                </p>
              </div>
            </div>

            {/* Won Deals */}
            <div className="bg-[#091326] border border-[#132347] rounded-xl p-3.5 flex items-center gap-3.5 hover:border-[#1e386e] transition-all">
              <div className="w-10 h-10 rounded-full bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-slate-400 truncate">Won Deals</p>
                <p className="text-xl font-bold text-white leading-tight">{LEAD_STATS.wonDeals.count}</p>
                <p className="text-[10px] font-semibold text-emerald-400 flex items-center gap-0.5 mt-0.5">
                  <span>{LEAD_STATS.wonDeals.change}</span>
                </p>
              </div>
            </div>

            {/* Lost Leads */}
            <div className="bg-[#091326] border border-[#132347] rounded-xl p-3.5 flex items-center gap-3.5 hover:border-[#1e386e] transition-all">
              <div className="w-10 h-10 rounded-full bg-rose-600/20 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
                <UserMinus className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-slate-400 truncate">Lost Leads</p>
                <p className="text-xl font-bold text-white leading-tight">{LEAD_STATS.lostLeads.count}</p>
                <p className="text-[10px] font-semibold text-rose-400 flex items-center gap-0.5 mt-0.5">
                  <span>{LEAD_STATS.lostLeads.change}</span>
                </p>
              </div>
            </div>

            {/* Not Interested */}
            <div className="bg-[#091326] border border-[#132347] rounded-xl p-3.5 flex items-center gap-3.5 hover:border-[#1e386e] transition-all">
              <div className="w-10 h-10 rounded-full bg-slate-600/20 border border-slate-500/30 text-slate-400 flex items-center justify-center shrink-0">
                <PhoneOff className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-slate-400 truncate">Not Interested</p>
                <p className="text-xl font-bold text-white leading-tight">{LEAD_STATS.notInterested.count}</p>
                <p className="text-[10px] font-semibold text-rose-400 flex items-center gap-0.5 mt-0.5">
                  <span>{LEAD_STATS.notInterested.change}</span>
                </p>
              </div>
            </div>
          </div>

          {/* PIPELINE FUNNEL CHEVRON RIBBON */}
          <div className="w-full overflow-x-auto pb-1 scrollbar-none">
            <div className="flex items-stretch -space-x-3.5 min-w-[900px] select-none">
              {PIPELINE_STAGES.map((stage, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === PIPELINE_STAGES.length - 1;
                const isSelected = activePipelineStage === stage.name;

                const clipPathStyle = isFirst
                  ? "polygon(0% 0%, calc(100% - 15px) 0%, 100% 50%, calc(100% - 15px) 100%, 0% 100%)"
                  : isLast
                  ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 15px 50%)"
                  : "polygon(0% 0%, calc(100% - 15px) 0%, 100% 50%, calc(100% - 15px) 100%, 0% 100%, 15px 50%)";

                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => handlePipelineClick(stage.name)}
                    style={{
                      clipPath: clipPathStyle,
                      backgroundColor: stage.bgHex,
                    }}
                    className={`flex-1 relative py-2.5 px-6 transition-all group flex flex-col items-center justify-center text-center cursor-pointer ${
                      isSelected
                        ? "ring-2 ring-white/80 z-20 brightness-125 shadow-lg"
                        : "hover:brightness-110 z-10"
                    } ${isFirst ? "rounded-l-xl" : ""} ${isLast ? "rounded-r-xl" : ""}`}
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-[2px] opacity-80"
                      style={{ backgroundColor: stage.borderHex }}
                    />
                    <span className="text-[11px] font-semibold text-slate-200 group-hover:text-white transition-colors truncate block">
                      {stage.name}
                    </span>
                    <span className="text-base sm:text-lg font-black text-white font-mono leading-none my-0.5">
                      {stage.count}
                    </span>
                    <span className="text-[10px] font-medium text-slate-300/80">
                      {stage.percentage}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SEARCH & FILTERS BAR */}
          <div className="bg-[#091326] border border-[#132347] rounded-xl p-3 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
              {/* Search Box */}
              <div className="relative flex-1 min-w-[220px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by lead ID, name, company, email, phone..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#070e1c] border border-[#16274e] text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>

              {/* Status Dropdown */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setActivePipelineStage(e.target.value === "ALL" ? null : e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#070e1c] border border-[#16274e] text-slate-300 text-xs focus:outline-none focus:border-sky-400 cursor-pointer"
              >
                <option value="ALL">All Status</option>
                {PIPELINE_STAGES.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>

              {/* Priority Dropdown */}
              <select
                value={priorityFilter}
                onChange={(e) => {
                  setPriorityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#070e1c] border border-[#16274e] text-slate-300 text-xs focus:outline-none focus:border-sky-400 cursor-pointer"
              >
                <option value="ALL">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              {/* Source Dropdown */}
              <select
                value={sourceFilter}
                onChange={(e) => {
                  setSourceFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#070e1c] border border-[#16274e] text-slate-300 text-xs focus:outline-none focus:border-sky-400 cursor-pointer"
              >
                <option value="ALL">All Source</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Social Media">Social Media</option>
                <option value="Google Ads">Google Ads</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Exhibition">Exhibition</option>
              </select>

              {/* Staff Dropdown */}
              <select
                value={staffFilter}
                onChange={(e) => {
                  setStaffFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#070e1c] border border-[#16274e] text-slate-300 text-xs focus:outline-none focus:border-sky-400 cursor-pointer"
              >
                <option value="ALL">All Staff</option>
                {STAFF_MEMBERS.map((staff) => (
                  <option key={staff.name} value={staff.name}>
                    {staff.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Right Filter Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  toast({
                    type: "info",
                    title: "Filters Active",
                    description: `Showing ${filteredLeads.length} matching leads.`,
                  });
                }}
                className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filter</span>
              </button>
              <button
                onClick={handleResetFilters}
                className="px-3 py-1.5 rounded-lg bg-[#070e1c] hover:bg-white/5 text-slate-400 hover:text-white border border-[#16274e] text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* SHARED DATATABLE COMPONENT (IDENTICAL TO USER MANAGEMENT) */}
          <DataTable
            data={paginatedLeads}
            columns={columns}
            getRowId={(row) => row.id}
            selectable={true}
            selectedIds={selectedLeadIds}
            onSelectRow={(id) =>
              setSelectedLeadIds((prev) =>
                prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
              )
            }
            onSelectAll={() => {
              if (selectedLeadIds.length === paginatedLeads.length) {
                setSelectedLeadIds([]);
              } else {
                setSelectedLeadIds(paginatedLeads.map((l) => l.id));
              }
            }}
            isAllSelected={
              paginatedLeads.length > 0 &&
              selectedLeadIds.length === paginatedLeads.length
            }
            sortField={sortField}
            sortAsc={sortAsc}
            onSort={(field) => {
              if (sortField === field) {
                setSortAsc(!sortAsc);
              } else {
                setSortField(field);
                setSortAsc(true);
              }
            }}
            showControls={true}
            pageSize={pageSize}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            onExport={handleExportCSV}
            exportLabel="Export Leads"
            pagination={true}
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={filteredLeads.length}
            onPageChange={(page) => setCurrentPage(page)}
            emptyMessage="No leads found matching your filter criteria."
            minWidth="1080px"
          />
        </>
      )}

      {/* ==================================================================== */}
      {/* 4. VIEW LEAD DETAILS MODAL                                           */}
      {/* ==================================================================== */}
      {viewingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-lg rounded-2xl bg-[#091326] border border-[#16274e] shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-[#142347] flex items-center justify-between bg-[#060e1d]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center font-mono font-bold text-xs">
                  {viewingLead.id}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{viewingLead.company}</h3>
                  <p className="text-xs text-slate-400">Contact: {viewingLead.contactPerson}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingLead(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4 text-xs">
              {/* Status & Priority Row */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#060e1d] border border-[#142347]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Status</span>
                  <span className="font-bold text-sky-400">{viewingLead.status}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Priority</span>
                  <span className={`font-bold ${viewingLead.priority === "High" ? "text-rose-400" : viewingLead.priority === "Medium" ? "text-amber-400" : "text-emerald-400"}`}>
                    {viewingLead.priority}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Est. Value</span>
                  <span className="font-bold text-emerald-400 font-mono">{viewingLead.dealValue || "AED 25,000"}</span>
                </div>
              </div>

              {/* Contact Channels */}
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`tel:${viewingLead.phone}`}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-[#060e1d] border border-[#142347] hover:border-sky-500/40 text-slate-300 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-500">Phone</p>
                    <p className="font-semibold text-xs truncate">{viewingLead.phone}</p>
                  </div>
                </a>

                <a
                  href={`mailto:${viewingLead.email}`}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-[#060e1d] border border-[#142347] hover:border-sky-500/40 text-slate-300 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-500">Email</p>
                    <p className="font-semibold text-xs truncate">{viewingLead.email}</p>
                  </div>
                </a>
              </div>

              {/* Assignment & Source */}
              <div className="space-y-2 p-3 rounded-xl bg-[#060e1d] border border-[#142347]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Assigned Staff:</span>
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={viewingLead.assignedTo.avatar}
                      alt={viewingLead.assignedTo.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="font-semibold text-white">{viewingLead.assignedTo.name}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Source:</span>
                  <span className="font-semibold text-white">{viewingLead.source}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Last Follow-up:</span>
                  <span className="font-semibold text-slate-200">{viewingLead.lastFollowUp}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Next Follow-up:</span>
                  <span className="font-semibold text-sky-300 font-mono">{viewingLead.nextFollowUp}</span>
                </div>
              </div>

              {/* Notes */}
              {viewingLead.notes && (
                <div className="p-3 rounded-xl bg-[#060e1d] border border-[#142347]">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Notes</p>
                  <p className="text-slate-300 text-xs leading-relaxed">{viewingLead.notes}</p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-[#142347] bg-[#060e1d] flex items-center justify-between">
              <button
                onClick={() => {
                  handleDeleteLead(viewingLead.id);
                  setViewingLead(null);
                }}
                className="px-3.5 py-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs font-semibold transition-colors"
              >
                Delete Lead
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewingLead(null)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#16274e] text-slate-300 hover:text-white text-xs font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const l = viewingLead;
                    setViewingLead(null);
                    handleOpenEditForm(l);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-[#0092e0] hover:bg-[#0081c7] text-white text-xs font-bold transition-all shadow-md shadow-sky-500/25"
                >
                  Edit Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
