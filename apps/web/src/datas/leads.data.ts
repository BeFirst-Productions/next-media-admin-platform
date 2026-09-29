export type LeadStatus =
  | "New"
  | "Contacted"
  | "Interested"
  | "Follow-up"
  | "Proposal Sent"
  | "Negotiation"
  | "Won"
  | "Lost"
  | "Not Interested";

export type LeadPriority = "High" | "Medium" | "Low";

export type LeadSource =
  | "Website"
  | "Referral"
  | "Social Media"
  | "Google Ads"
  | "Walk-in"
  | "Exhibition";

export interface LeadStaff {
  name: string;
  avatar: string;
}

export interface LeadItem {
  id: string;
  index: number;
  company: string;
  contactPerson: string;
  phone: string;
  email: string;
  source: LeadSource;
  assignedTo: LeadStaff;
  status: LeadStatus;
  priority: LeadPriority;
  lastFollowUp: string;
  nextFollowUp: string;
  notes?: string;
  dealValue?: string;
  createdDate?: string;
}

export interface PipelineStageConfig {
  id: LeadStatus;
  name: string;
  count: number;
  percentage: string;
  bgHex: string;
  borderHex: string;
  textHex: string;
  accentClass: string;
}

export const PIPELINE_STAGES: PipelineStageConfig[] = [
  {
    id: "New",
    name: "New",
    count: 246,
    percentage: "19.7%",
    bgHex: "#0c2847",
    borderHex: "#0284c7",
    textHex: "#38bdf8",
    accentClass: "from-[#0c2847] to-[#0f345c]",
  },
  {
    id: "Contacted",
    name: "Contacted",
    count: 312,
    percentage: "25.0%",
    bgHex: "#034b75",
    borderHex: "#0284c7",
    textHex: "#38bdf8",
    accentClass: "from-[#034b75] to-[#02669e]",
  },
  {
    id: "Interested",
    name: "Interested",
    count: 220,
    percentage: "17.6%",
    bgHex: "#084d5a",
    borderHex: "#06b6d4",
    textHex: "#22d3ee",
    accentClass: "from-[#084d5a] to-[#0e6374]",
  },
  {
    id: "Follow-up",
    name: "Follow-up",
    count: 156,
    percentage: "12.5%",
    bgHex: "#372763",
    borderHex: "#6366f1",
    textHex: "#a5b4fc",
    accentClass: "from-[#372763] to-[#483380]",
  },
  {
    id: "Proposal Sent",
    name: "Proposal Sent",
    count: 98,
    percentage: "7.8%",
    bgHex: "#482375",
    borderHex: "#8b5cf6",
    textHex: "#c084fc",
    accentClass: "from-[#482375] to-[#5d2e96]",
  },
  {
    id: "Negotiation",
    name: "Negotiation",
    count: 98,
    percentage: "7.8%",
    bgHex: "#713f12",
    borderHex: "#d97706",
    textHex: "#fbbf24",
    accentClass: "from-[#713f12] to-[#8d4f17]",
  },
  {
    id: "Won",
    name: "Won",
    count: 142,
    percentage: "11.4%",
    bgHex: "#064e3b",
    borderHex: "#059669",
    textHex: "#34d399",
    accentClass: "from-[#064e3b] to-[#065f46]",
  },
  {
    id: "Lost",
    name: "Lost",
    count: 80,
    percentage: "6.4%",
    bgHex: "#7f1d1d",
    borderHex: "#dc2626",
    textHex: "#f87171",
    accentClass: "from-[#7f1d1d] to-[#991b1b]",
  },
  {
    id: "Not Interested",
    name: "Not Interested",
    count: 68,
    percentage: "5.4%",
    bgHex: "#1e293b",
    borderHex: "#475569",
    textHex: "#94a3b8",
    accentClass: "from-[#1e293b] to-[#334155]",
  },
];

export const LEAD_STATS = {
  totalLeads: { count: "1,248", change: "↑ 18.5% vs last month", isPositive: true },
  newLeads: { count: "246", change: "↑ 12.3% vs last month", isPositive: true },
  interestedLeads: { count: "312", change: "↑ 15.6% vs last month", isPositive: true },
  wonDeals: { count: "142", change: "↑ 24.8% vs last month", isPositive: true },
  lostLeads: { count: "80", change: "↓ 6.1% vs last month", isPositive: false },
  notInterested: { count: "68", change: "↓ 3.2% vs last month", isPositive: false },
};

export const STAFF_MEMBERS: LeadStaff[] = [
  { name: "Rahul Sharma", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face" },
  { name: "Fatima Ali", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face" },
  { name: "Jason D'souza", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face" },
  { name: "Neha Patel", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face" },
  { name: "Vikram Singh", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" },
  { name: "Priya Nair", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face" },
  { name: "Arjun Mehta", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face" },
];

export const INITIAL_LEADS: LeadItem[] = [
  {
    id: "LD-1250",
    index: 1,
    company: "Bright Solutions LLC",
    contactPerson: "Ahmed Khan",
    phone: "+971 50 123 4567",
    email: "ahmed@brightsolutions.ae",
    source: "Website",
    assignedTo: STAFF_MEMBERS[0],
    status: "Interested",
    priority: "High",
    lastFollowUp: "20 May 2026 (Called)",
    nextFollowUp: "24 May 2026",
    dealValue: "AED 35,000",
    notes: "Client interested in full SEO + Branding package for Q3 expansion.",
    createdDate: "02 May 2026",
  },
  {
    id: "LD-1249",
    index: 2,
    company: "Future Tech",
    contactPerson: "Fatima Ali",
    phone: "+971 55 987 6543",
    email: "info@futuretech.ae",
    source: "Referral",
    assignedTo: STAFF_MEMBERS[1],
    status: "Proposal Sent",
    priority: "Medium",
    lastFollowUp: "19 May 2026 (Meeting)",
    nextFollowUp: "22 May 2026",
    dealValue: "AED 48,000",
    notes: "Custom CRM integration proposal sent. Awaiting feedback from CTO.",
    createdDate: "03 May 2026",
  },
  {
    id: "LD-1248",
    index: 3,
    company: "Oceanic Group",
    contactPerson: "Jason D'souza",
    phone: "+971 52 456 7890",
    email: "contact@oceanic.ae",
    source: "Social Media",
    assignedTo: STAFF_MEMBERS[2],
    status: "Negotiation",
    priority: "High",
    lastFollowUp: "18 May 2026 (Email)",
    nextFollowUp: "21 May 2026",
    dealValue: "AED 75,000",
    notes: "Reviewing final contract discount terms for annual retainer.",
    createdDate: "05 May 2026",
  },
  {
    id: "LD-1247",
    index: 4,
    company: "Vision Marketing",
    contactPerson: "Jason D'souza",
    phone: "+971 54 321 6789",
    email: "hello@visionmkt.ae",
    source: "Google Ads",
    assignedTo: STAFF_MEMBERS[3],
    status: "Contacted",
    priority: "Low",
    lastFollowUp: "17 May 2026 (Called)",
    nextFollowUp: "20 May 2026",
    dealValue: "AED 18,000",
    notes: "Initial discovery call completed. Needs social media audit.",
    createdDate: "06 May 2026",
  },
  {
    id: "LD-1246",
    index: 5,
    company: "Creative Minds",
    contactPerson: "Neha Patel",
    phone: "+971 58 654 1237",
    email: "info@creativeminds.ae",
    source: "Website",
    assignedTo: STAFF_MEMBERS[0],
    status: "Interested",
    priority: "Medium",
    lastFollowUp: "16 May 2026 (WhatsApp)",
    nextFollowUp: "19 May 2026",
    dealValue: "AED 28,000",
    notes: "Followed up on WhatsApp with portfolio case studies.",
    createdDate: "08 May 2026",
  },
  {
    id: "LD-1245",
    index: 6,
    company: "Digital Wave",
    contactPerson: "Vikram Singh",
    phone: "+971 56 789 4561",
    email: "contact@digitalwave.ae",
    source: "Referral",
    assignedTo: STAFF_MEMBERS[4],
    status: "Follow-up",
    priority: "Medium",
    lastFollowUp: "15 May 2026 (Email)",
    nextFollowUp: "18 May 2026",
    dealValue: "AED 22,500",
    notes: "Scheduled product demo for next Tuesday morning.",
    createdDate: "09 May 2026",
  },
  {
    id: "LD-1244",
    index: 7,
    company: "Alpha Industries",
    contactPerson: "Priya Nair",
    phone: "+971 55 147 2580",
    email: "info@alphaind.ae",
    source: "Walk-in",
    assignedTo: STAFF_MEMBERS[5],
    status: "New",
    priority: "High",
    lastFollowUp: "14 May 2026 (New Lead)",
    nextFollowUp: "17 May 2026",
    dealValue: "AED 52,000",
    notes: "Met at Trade Center exhibition. High budget prospective.",
    createdDate: "14 May 2026",
  },
  {
    id: "LD-1243",
    index: 8,
    company: "Business Boosters",
    contactPerson: "Arjun Mehta",
    phone: "+971 50 369 8521",
    email: "hello@boosters.ae",
    source: "Exhibition",
    assignedTo: STAFF_MEMBERS[6],
    status: "Not Interested",
    priority: "Low",
    lastFollowUp: "13 May 2026 (Called)",
    nextFollowUp: "-",
    dealValue: "AED 12,000",
    notes: "Current vendor contract active until 2027.",
    createdDate: "10 May 2026",
  },
  {
    id: "LD-1242",
    index: 9,
    company: "Secure IT Solutions",
    contactPerson: "Sneha Verma",
    phone: "+971 52 741 9630",
    email: "contact@secureit.ae",
    source: "Website",
    assignedTo: STAFF_MEMBERS[1],
    status: "Lost",
    priority: "Medium",
    lastFollowUp: "12 May 2026 (Declined)",
    nextFollowUp: "-",
    dealValue: "AED 30,000",
    notes: "Went with internal developer team instead.",
    createdDate: "04 May 2026",
  },
  {
    id: "LD-1241",
    index: 10,
    company: "Global Traders",
    contactPerson: "Daniel George",
    phone: "+971 54 852 7410",
    email: "info@globaltraders.ae",
    source: "Referral",
    assignedTo: STAFF_MEMBERS[2],
    status: "New",
    priority: "Low",
    lastFollowUp: "11 May 2026 (New Lead)",
    nextFollowUp: "14 May 2026",
    dealValue: "AED 15,000",
    notes: "Inbound inquiry via partner referral network.",
    createdDate: "11 May 2026",
  },
  {
    id: "LD-1240",
    index: 11,
    company: "Apex Media Holdings",
    contactPerson: "Tariq Mansoor",
    phone: "+971 50 443 2190",
    email: "tariq@apexmedia.ae",
    source: "Google Ads",
    assignedTo: STAFF_MEMBERS[0],
    status: "Won",
    priority: "High",
    lastFollowUp: "10 May 2026 (Contract Signed)",
    nextFollowUp: "01 Jun 2026",
    dealValue: "AED 95,000",
    notes: "Annual digital marketing & PR retainer signed.",
    createdDate: "28 Apr 2026",
  },
  {
    id: "LD-1239",
    index: 12,
    company: "Elite Real Estate",
    contactPerson: "Sarah Jenkins",
    phone: "+971 55 667 8901",
    email: "sarah@eliterealty.ae",
    source: "Website",
    assignedTo: STAFF_MEMBERS[3],
    status: "Negotiation",
    priority: "High",
    lastFollowUp: "09 May 2026 (Meeting)",
    nextFollowUp: "16 May 2026",
    dealValue: "AED 62,000",
    notes: "Lead generation campaign for luxury villa launch.",
    createdDate: "01 May 2026",
  },
  {
    id: "LD-1238",
    index: 13,
    company: "Sunrise Logistics",
    contactPerson: "Kareem Qasim",
    phone: "+971 52 334 1122",
    email: "kareem@sunriselog.ae",
    source: "Exhibition",
    assignedTo: STAFF_MEMBERS[4],
    status: "Won",
    priority: "Medium",
    lastFollowUp: "08 May 2026 (Payment Received)",
    nextFollowUp: "25 May 2026",
    dealValue: "AED 44,000",
    notes: "Deposit received. Onboarding call scheduled.",
    createdDate: "22 Apr 2026",
  },
  {
    id: "LD-1237",
    index: 14,
    company: "Nova Retail Hub",
    contactPerson: "Zainab Rashid",
    phone: "+971 58 998 7766",
    email: "zainab@novahub.ae",
    source: "Social Media",
    assignedTo: STAFF_MEMBERS[5],
    status: "Proposal Sent",
    priority: "High",
    lastFollowUp: "07 May 2026 (Email)",
    nextFollowUp: "15 May 2026",
    dealValue: "AED 38,000",
    notes: "Sent proposal for multi-channel influencer campaign.",
    createdDate: "29 Apr 2026",
  },
  {
    id: "LD-1236",
    index: 15,
    company: "Metro Financials",
    contactPerson: "Omar Farooq",
    phone: "+971 50 771 8829",
    email: "omar@metrofin.ae",
    source: "Referral",
    assignedTo: STAFF_MEMBERS[1],
    status: "Contacted",
    priority: "Low",
    lastFollowUp: "06 May 2026 (Called)",
    nextFollowUp: "13 May 2026",
    dealValue: "AED 25,000",
    notes: "Requested quote for corporate website revamp.",
    createdDate: "30 Apr 2026",
  },
];
