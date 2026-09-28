"use client";

import * as React from "react";
import {
  Building2, Search, Globe,
  CheckCircle2, DollarSign
} from "lucide-react";
import type { ClientDto } from "@next-digital-crm/shared-types";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { apiClient } from "@/lib/api-client";

const MOCK_CLIENTS: ClientDto[] = [
  {
    id: "clt-01",
    customClientId: "CLT-1001",
    leadId: "lead-02",
    companyName: "Nexus Tech Solutions",
    industry: "Technology & Software",
    location: "Business Bay, Dubai",
    googleMapsLink: "https://maps.google.com",
    contactPerson: "Amira Hassan",
    designation: "Head of Marketing",
    email: "amira@nexustech.io",
    phone: "+971 55 987 6543",
    whatsapp: "+971 55 987 6543",
    billingAddress: "Level 14, Vision Tower, Business Bay, Dubai",
    clientStatus: "ACTIVE",
    conversionValue: 40000,
    notes: "Converted from prospect lead after contract signing and deposit",
    convertedAt: "2026-09-24T14:00:00Z",
    createdAt: "2026-09-24T14:00:00Z",
    updatedAt: "2026-09-24T14:00:00Z",
    lead: {
      id: "lead-02",
      customLeadId: "LED-1002",
      date: "2026-09-22T11:30:00Z",
      companyName: "Nexus Tech Solutions",
      contactPerson: "Amira Hassan",
      status: "CLIENT",
      conversionStatus: "CONVERTED",
      hasWebsite: true,
      websiteUrl: "https://nexustech.io",
      websiteScore: 9,
      instagramUrl: "https://instagram.com/nexustech",
      instagramFollowers: 12000,
      instagramScore: 6,
      hasGoogleBusiness: true,
      googleRating: 4.8,
      googleReviews: 120,
      createdById: "usr-admin-01",
      createdAt: "2026-09-22T11:30:00Z",
      updatedAt: "2026-09-24T14:00:00Z",
    },
    contacts: [
      {
        id: "c-01",
        clientId: "clt-01",
        name: "Amira Hassan",
        designation: "Head of Marketing",
        email: "amira@nexustech.io",
        phone: "+971 55 987 6543",
        whatsapp: "+971 55 987 6543",
        isPrimary: true,
        createdAt: "2026-09-24T14:00:00Z",
      },
    ],
  },
];

export default function ClientsDirectoryPage() {
  const [clients, setClients] = React.useState<ClientDto[]>(MOCK_CLIENTS);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [selectedClient, setSelectedClient] = React.useState<ClientDto | null>(null);

  const fetchClients = async () => {
    try {
      const res = await apiClient<{ items: ClientDto[] }>("/clients");
      if (res.data?.items && Array.isArray(res.data.items) && res.data.items.length > 0) {
        setClients(res.data.items);
      }
    } catch {
      // Use seeded fallback if offline
    }
  };

  React.useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter((c) => {
    const matchesStatus = statusFilter === "ALL" || c.clientStatus === statusFilter;
    const matchesSearch =
      !searchQuery ||
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.customClientId && c.customClientId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.contactPerson && c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.industry && c.industry.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.clientStatus === "ACTIVE").length;
  const totalRevenueConverted = clients.reduce((acc, c) => acc + (Number(c.conversionValue) || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
              Registered Accounts
            </span>
            <span className="text-xs text-surface-400">• Post-Conversion Client Directory</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-50 flex items-center gap-2.5 mt-1">
            <Building2 className="w-6 h-6 text-emerald-400" />
            Client Directory & Accounts
          </h1>
          <p className="text-xs text-surface-400 mt-1">
            Manage active client relationships, master service agreements, and original lead research history.
          </p>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-surface-900/60 border-surface-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-surface-400 font-medium">Total Registered Clients</p>
              <h3 className="text-2xl font-bold text-surface-50 mt-1">{totalClients}</h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Building2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-900/60 border-surface-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-surface-400 font-medium">Active Retainer Accounts</p>
              <h3 className="text-2xl font-bold text-emerald-400 mt-1">{activeClients}</h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-900/60 border-surface-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-surface-400 font-medium">Total Converted Value (AED)</p>
              <h3 className="text-2xl font-bold text-surface-50 mt-1">
                AED {totalRevenueConverted.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-surface-900/80 border border-surface-800 rounded-2xl">
        <div className="flex items-center gap-2">
          {["ALL", "ACTIVE", "ONBOARDING", "INACTIVE"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                statusFilter === status
                  ? "bg-emerald-600 text-white font-semibold"
                  : "text-surface-400 hover:text-surface-100 hover:bg-surface-800"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Search client, ID, industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-950 border border-surface-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-surface-100 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Client Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.length === 0 ? (
          <div className="col-span-full py-12 text-center text-surface-400 bg-surface-900/50 border border-surface-800 rounded-2xl">
            No active clients registered yet. Convert leads from the <strong>Leads Management</strong> tab to automatically populate this client directory.
          </div>
        ) : (
          filteredClients.map((client) => (
            <div
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className="p-5 bg-surface-900 border border-surface-800 rounded-2xl hover:border-emerald-500/40 transition-all shadow-xl cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                    {client.customClientId || "CLT-1000"}
                  </span>
                  <Badge variant="success">{client.clientStatus}</Badge>
                </div>

                <h3 className="text-lg font-bold text-surface-50 group-hover:text-emerald-300 transition-colors mt-2">
                  {client.companyName}
                </h3>
                <p className="text-xs text-surface-400">{client.industry || "General Industry"}</p>

                <div className="mt-4 pt-3 border-t border-surface-800 space-y-2 text-xs text-surface-300">
                  <div className="flex items-center justify-between">
                    <span className="text-surface-400">Primary Contact</span>
                    <span className="font-semibold text-surface-100">{client.contactPerson || "N/A"}</span>
                  </div>
                  {client.email && (
                    <div className="flex items-center justify-between">
                      <span className="text-surface-400">Email</span>
                      <span className="text-emerald-400">{client.email}</span>
                    </div>
                  )}
                  {client.location && (
                    <div className="flex items-center justify-between">
                      <span className="text-surface-400">Location</span>
                      <span>{client.location}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-surface-400">Contract Value</span>
                    <span className="font-bold text-emerald-400 text-sm">
                      AED {client.conversionValue ? Number(client.conversionValue).toLocaleString() : "0"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Linked Lead Research Metadata snippet */}
              {client.lead && (
                <div className="p-3 bg-surface-950 rounded-xl border border-surface-800/80 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-surface-400 font-medium">
                    <span>Origin Lead Audit</span>
                    <span className="text-brand-400">{client.lead.customLeadId}</span>
                  </div>
                  <div className="flex items-center gap-3 text-surface-300 pt-0.5">
                    {client.lead.hasWebsite && (
                      <span className="text-sky-400 font-bold">Web Score: {client.lead.websiteScore}/10</span>
                    )}
                    {client.lead.instagramFollowers && (
                      <span className="text-pink-400 font-bold">{client.lead.instagramFollowers.toLocaleString()} IG Followers</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Inspect Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
          <div className="bg-surface-900 border border-surface-700 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 bg-gradient-to-r from-surface-950 to-surface-900 border-b border-surface-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {selectedClient.customClientId}
                  </span>
                  <Badge variant="success">{selectedClient.clientStatus}</Badge>
                </div>
                <h2 className="text-xl font-bold text-surface-50 mt-1">{selectedClient.companyName}</h2>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="p-1.5 text-surface-400 hover:text-surface-100 rounded-lg hover:bg-surface-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-surface-300">
              <div className="grid grid-cols-2 gap-4 p-4 bg-surface-950 rounded-xl border border-surface-800">
                <div>
                  <span className="text-surface-400 block mb-1">Billing Address</span>
                  <p className="font-medium text-surface-100">{selectedClient.billingAddress || selectedClient.location || "N/A"}</p>
                </div>
                <div>
                  <span className="text-surface-400 block mb-1">Contracted Revenue</span>
                  <p className="font-bold text-emerald-400 text-sm">
                    AED {selectedClient.conversionValue ? Number(selectedClient.conversionValue).toLocaleString() : "0"}
                  </p>
                </div>
              </div>

              {selectedClient.lead && (
                <div className="p-4 bg-surface-950 rounded-xl border border-surface-800 space-y-2">
                  <h4 className="font-bold text-surface-100 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-sky-400" /> Linked Lead Research History
                  </h4>
                  <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                    <div>Website Score: <strong>{selectedClient.lead.websiteScore || "N/A"}/10</strong></div>
                    <div>Instagram Score: <strong>{selectedClient.lead.instagramScore || "N/A"}/10</strong></div>
                    <div>Google Rating: <strong>{selectedClient.lead.googleRating || "N/A"}/5</strong></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
