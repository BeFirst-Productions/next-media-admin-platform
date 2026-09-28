"use client";

import * as React from "react";
import {
  Users,
  UserPlus,
  UserCheck,
  CheckCircle2,
  UserX,
  User,
  Lock,
  Wallet,
  Clock,
  TrendingUp,
  Target,
  Coins,
  ChevronDown,
  Monitor,
  Megaphone,
  Video,
  LayoutGrid,
  FileText,
  FileCheck,
  AlertCircle,
  FileSignature,
  DollarSign,
  RefreshCw,
  Send,
} from "lucide-react";
import Link from "next/link";

export function BlankDashboard() {
  return (
    <div className="space-y-3.5 sm:space-y-4 animate-fade-in select-none pb-6 w-full max-w-full min-w-0 overflow-x-hidden">
      {/* ==================================================================== */}
      {/* ROW 1: TOP 6 LEADS & CLIENTS METRIC CARDS                            */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-3 w-full">
        {/* 1. Total Leads */}
        <div className="bg-[#091326] border border-[#132347] rounded-xl p-2.5 sm:p-3.5 flex flex-col justify-between hover:border-[#1e386e] transition-all min-w-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1d4ed8] text-white flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(29,78,216,0.4)]">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 truncate">Total Leads</span>
          </div>
          <div className="flex items-baseline justify-between mt-2.5 sm:mt-3">
            <span className="text-base sm:text-xl font-bold text-white tracking-tight">1,248</span>
            <span className="text-[10.5px] sm:text-xs font-semibold text-emerald-400 flex items-center">
              &uarr; 18.5%
            </span>
          </div>
          <div className="mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-[#132347]/60">
            <span className="text-[9.5px] sm:text-[10px] text-slate-400 hover:text-slate-200 cursor-pointer transition-colors">
              View Details
            </span>
          </div>
        </div>

        {/* 2. New Leads */}
        <div className="bg-[#091326] border border-[#132347] rounded-xl p-2.5 sm:p-3.5 flex flex-col justify-between hover:border-[#1e386e] transition-all min-w-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0284c7] text-white flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(2,132,199,0.4)]">
              <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 truncate">New Leads</span>
          </div>
          <div className="flex items-baseline justify-between mt-2.5 sm:mt-3">
            <span className="text-base sm:text-xl font-bold text-white tracking-tight">246</span>
            <span className="text-[10.5px] sm:text-xs font-semibold text-emerald-400 flex items-center">
              &uarr; 12.3%
            </span>
          </div>
          <div className="mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-[#132347]/60">
            <span className="text-[9.5px] sm:text-[10px] text-slate-400 hover:text-slate-200 cursor-pointer transition-colors">
              View Details
            </span>
          </div>
        </div>

        {/* 3. Active Leads */}
        <div className="bg-[#091326] border border-[#132347] rounded-xl p-2.5 sm:p-3.5 flex flex-col justify-between hover:border-[#1e386e] transition-all min-w-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#7e22ce] text-white flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(126,34,206,0.4)]">
              <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 truncate">Active Leads</span>
          </div>
          <div className="flex items-baseline justify-between mt-2.5 sm:mt-3">
            <span className="text-base sm:text-xl font-bold text-white tracking-tight">620</span>
            <span className="text-[10.5px] sm:text-xs font-semibold text-emerald-400 flex items-center">
              &uarr; 8.4%
            </span>
          </div>
          <div className="mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-[#132347]/60">
            <span className="text-[9.5px] sm:text-[10px] text-slate-400 hover:text-slate-200 cursor-pointer transition-colors">
              View Details
            </span>
          </div>
        </div>

        {/* 4. Converted Leads */}
        <div className="bg-[#091326] border border-[#132347] rounded-xl p-2.5 sm:p-3.5 flex flex-col justify-between hover:border-[#1e386e] transition-all min-w-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#15803d] text-white flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(21,128,61,0.4)]">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 truncate">Converted Leads</span>
          </div>
          <div className="flex items-baseline justify-between mt-2.5 sm:mt-3">
            <span className="text-base sm:text-xl font-bold text-white tracking-tight">302</span>
            <span className="text-[10.5px] sm:text-xs font-semibold text-emerald-400 flex items-center">
              &uarr; 24.6%
            </span>
          </div>
          <div className="mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-[#132347]/60">
            <span className="text-[9.5px] sm:text-[10px] text-slate-400 hover:text-slate-200 cursor-pointer transition-colors">
              View Details
            </span>
          </div>
        </div>

        {/* 5. Lost Leads */}
        <div className="bg-[#091326] border border-[#132347] rounded-xl p-2.5 sm:p-3.5 flex flex-col justify-between hover:border-[#1e386e] transition-all min-w-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#b91c1c] text-white flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(185,28,28,0.4)]">
              <UserX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 truncate">Lost Leads</span>
          </div>
          <div className="flex items-baseline justify-between mt-2.5 sm:mt-3">
            <span className="text-base sm:text-xl font-bold text-white tracking-tight">80</span>
            <span className="text-[10.5px] sm:text-xs font-semibold text-rose-400 flex items-center">
              &darr; 6.1%
            </span>
          </div>
          <div className="mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-[#132347]/60">
            <span className="text-[9.5px] sm:text-[10px] text-slate-400 hover:text-slate-200 cursor-pointer transition-colors">
              View Details
            </span>
          </div>
        </div>

        {/* 6. Total Clients */}
        <div className="bg-[#091326] border border-[#132347] rounded-xl p-2.5 sm:p-3.5 flex flex-col justify-between hover:border-[#1e386e] transition-all min-w-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1d4ed8] text-white flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(29,78,216,0.4)]">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 truncate">Total Clients</span>
          </div>
          <div className="flex items-baseline justify-between mt-2.5 sm:mt-3">
            <span className="text-base sm:text-xl font-bold text-white tracking-tight">548</span>
            <span className="text-[10.5px] sm:text-xs font-semibold text-emerald-400 flex items-center">
              &uarr; 14.5%
            </span>
          </div>
          <div className="mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-[#132347]/60">
            <span className="text-[9.5px] sm:text-[10px] text-slate-400 hover:text-slate-200 cursor-pointer transition-colors">
              View Details
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* ROW 2: FINANCIAL & SALES SUMMARY CARDS                               */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-3 w-full">
        {/* Total Sales */}
        <div className="bg-[#091326] border border-[#132347] rounded-xl p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3 hover:border-[#1e386e] transition-all min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#022b44] border border-[#00608e] text-[#00c5ff] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,197,255,0.2)]">
            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9.5px] sm:text-[10.5px] text-slate-400 font-medium truncate">Total Sales</p>
            <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
              <span className="text-[11px] sm:text-sm font-bold text-white tracking-tight whitespace-nowrap">
                AED 456,890
              </span>
              <span className="text-[9px] sm:text-[10px] text-emerald-400 font-semibold whitespace-nowrap">&uarr; 16.2%</span>
            </div>
          </div>
        </div>

        {/* Total Payments Received */}
        <div className="bg-[#091326] border border-[#132347] rounded-xl p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3 hover:border-[#1e386e] transition-all min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#042d1f] border border-[#086345] text-[#10b981] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9.5px] sm:text-[10.5px] text-slate-400 font-medium truncate">Payments Received</p>
            <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
              <span className="text-[11px] sm:text-sm font-bold text-white tracking-tight whitespace-nowrap">
                AED 312,450
              </span>
              <span className="text-[9px] sm:text-[10px] text-emerald-400 font-semibold whitespace-nowrap">&uarr; 14.8%</span>
            </div>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-[#091326] border border-[#132347] rounded-xl p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3 hover:border-[#1e386e] transition-all min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#332205] border border-[#6b480b] text-[#f59e0b] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9.5px] sm:text-[10.5px] text-slate-400 font-medium truncate">Pending Payments</p>
            <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
              <span className="text-[11px] sm:text-sm font-bold text-white tracking-tight whitespace-nowrap">
                AED 144,440
              </span>
              <span className="text-[9px] sm:text-[10px] text-emerald-400 font-semibold whitespace-nowrap">&uarr; 9.4%</span>
            </div>
          </div>
        </div>

        {/* Monthly Sales */}
        <div className="bg-[#091326] border border-[#132347] rounded-xl p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3 hover:border-[#1e386e] transition-all min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#250f41] border border-[#532490] text-[#a855f7] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9.5px] sm:text-[10.5px] text-slate-400 font-medium truncate">Monthly Sales</p>
            <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
              <span className="text-[11px] sm:text-sm font-bold text-white tracking-tight whitespace-nowrap">
                AED 78,450
              </span>
              <span className="text-[9px] sm:text-[10px] text-emerald-400 font-semibold whitespace-nowrap">&uarr; 18.7%</span>
            </div>
          </div>
        </div>

        {/* Monthly Target */}
        <div className="bg-[#091326] border border-[#132347] rounded-xl p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3 hover:border-[#1e386e] transition-all min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#05263d] border border-[#09578c] text-[#38bdf8] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
            <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9.5px] sm:text-[10.5px] text-slate-400 font-medium truncate">Monthly Target</p>
            <span className="text-[11px] sm:text-sm font-bold text-white tracking-tight block whitespace-nowrap">
              AED 100,000
            </span>
          </div>
        </div>

        {/* Commission Payable */}
        <div className="bg-[#091326] border border-[#132347] rounded-xl p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3 hover:border-[#1e386e] transition-all min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#03314f] border border-[#0066a3] text-[#00c5ff] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,197,255,0.2)]">
            <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9.5px] sm:text-[10.5px] text-slate-400 font-medium truncate">Commission Payable</p>
            <span className="text-[11px] sm:text-sm font-bold text-white tracking-tight block whitespace-nowrap">
              AED 28,760
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* ROW 3: THREE VISUAL BREAKDOWNS (SALES OVERVIEW, PACKAGES, STAFF)     */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5 w-full">
        {/* Column 1: Sales Overview (Line Graph) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-5 bg-[#091326] border border-[#132347] rounded-xl p-3 sm:p-4 flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-white">Sales Overview</h3>
              <div className="flex items-center gap-1 text-[10.5px] sm:text-[11px] text-slate-400 bg-[#0c1833] border border-[#17274c] px-2 py-1 rounded-lg cursor-pointer">
                <span>This Month</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
            </div>

            {/* Wave Chart Container */}
            <div className="relative mt-2 sm:mt-3 h-36 sm:h-44 w-full overflow-hidden">
              <svg
                viewBox="0 0 500 170"
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="cyanArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00c5ff" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#00c5ff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference lines & Y-axis */}
                <line x1="45" y1="20" x2="485" y2="20" stroke="#16274e" strokeDasharray="3 3" />
                <line x1="45" y1="50" x2="485" y2="50" stroke="#16274e" strokeDasharray="3 3" />
                <line x1="45" y1="80" x2="485" y2="80" stroke="#16274e" strokeDasharray="3 3" />
                <line x1="45" y1="110" x2="485" y2="110" stroke="#16274e" strokeDasharray="3 3" />
                <line x1="45" y1="140" x2="485" y2="140" stroke="#16274e" />

                <text x="35" y="24" textAnchor="end" fill="#64748b" fontSize="10">100K</text>
                <text x="35" y="54" textAnchor="end" fill="#64748b" fontSize="10">80K</text>
                <text x="35" y="84" textAnchor="end" fill="#64748b" fontSize="10">60K</text>
                <text x="35" y="114" textAnchor="end" fill="#64748b" fontSize="10">40K</text>
                <text x="35" y="144" textAnchor="end" fill="#64748b" fontSize="10">20K</text>
                <text x="45" y="160" textAnchor="middle" fill="#64748b" fontSize="9">0</text>

                {/* Area fill */}
                <path
                  d="M 50,140 L 50,130 C 85,130 115,85 145,85 C 175,85 205,120 235,105 C 265,90 280,35 315,35 C 345,35 375,100 405,105 C 435,110 460,60 480,50 L 480,140 Z"
                  fill="url(#cyanArea)"
                />

                {/* Glowing curve line */}
                <path
                  d="M 50,130 C 85,130 115,85 145,85 C 175,85 205,120 235,105 C 265,90 280,35 315,35 C 345,35 375,100 405,105 C 435,110 460,60 480,50"
                  fill="none"
                  stroke="#00c5ff"
                  strokeWidth="2.5"
                  className="drop-shadow-[0_0_8px_rgba(0,197,255,0.7)]"
                />

                {/* Peak point on 15 May */}
                <circle cx="315" cy="35" r="4" fill="#00c5ff" className="drop-shadow-[0_0_8px_#00c5ff]" />
                <circle cx="315" cy="35" r="7" fill="none" stroke="#00c5ff" strokeWidth="1.5" opacity="0.6" />

                {/* Tooltip Card over 15 May */}
                <g transform="translate(265, -8)">
                  <rect
                    x="0"
                    y="0"
                    width="100"
                    height="34"
                    rx="6"
                    fill="#04263b"
                    stroke="#0080b3"
                    strokeWidth="1"
                    className="shadow-lg"
                  />
                  <text x="50" y="14" textAnchor="middle" fill="#94a3b8" fontSize="8.5">
                    15 May 2026
                  </text>
                  <text x="50" y="27" textAnchor="middle" fill="#00e5ff" fontSize="10" fontWeight="bold">
                    AED 78,450
                  </text>
                </g>

                {/* X Axis Date labels */}
                <text x="60" y="160" textAnchor="middle" fill="#64748b" fontSize="9">01 May</text>
                <text x="160" y="160" textAnchor="middle" fill="#64748b" fontSize="9">08 May</text>
                <text x="260" y="160" textAnchor="middle" fill="#64748b" fontSize="9">15 May</text>
                <text x="370" y="160" textAnchor="middle" fill="#64748b" fontSize="9">22 May</text>
                <text x="470" y="160" textAnchor="middle" fill="#64748b" fontSize="9">31 May</text>
              </svg>
            </div>
          </div>

          {/* Footer metrics */}
          <div className="pt-3 border-t border-[#132347] grid grid-cols-3 gap-1.5 sm:gap-2 text-xs mt-2">
            <div>
              <p className="text-[9.5px] sm:text-[10px] text-slate-400 truncate">Total Sales</p>
              <p className="font-bold text-white flex items-center gap-1 text-[10.5px] sm:text-xs">
                AED 78,450 <span className="text-[8.5px] sm:text-[9px] text-emerald-400 font-semibold">&uarr; 16.2%</span>
              </p>
            </div>
            <div>
              <p className="text-[9.5px] sm:text-[10px] text-slate-400 truncate">Total Target</p>
              <p className="font-bold text-white text-[10.5px] sm:text-xs">AED 100,000</p>
            </div>
            <div>
              <div className="flex items-center justify-between gap-1">
                <span className="text-[9.5px] sm:text-[10px] text-slate-400 truncate">Achievement</span>
                <span className="text-[10px] sm:text-[10.5px] font-bold text-white">78.45%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#132347] overflow-hidden mt-1">
                <div className="h-full bg-cyan-400 rounded-full w-[78.45%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Sales by Package / Service */}
        <div className="col-span-1 md:col-span-1 lg:col-span-4 xl:col-span-4 bg-[#091326] border border-[#132347] rounded-xl p-3 sm:p-4 flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-white truncate pr-1">
                Sales by Package / Service
              </h3>
              <div className="flex items-center gap-1 text-[10.5px] sm:text-[11px] text-slate-400 bg-[#0c1833] border border-[#17274c] px-2 py-1 rounded-lg cursor-pointer shrink-0">
                <span>This Month</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
            </div>

            {/* List of 4 Services */}
            <div className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
              {/* 1. Website Development */}
              <div>
                <div className="flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#0a2e50] text-[#38bdf8] flex items-center justify-center shrink-0">
                      <Monitor className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-200 text-xs truncate">Website Development</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <span className="text-slate-400 text-[11px] sm:text-xs whitespace-nowrap">AED 191,890</span>
                    <span className="font-bold text-white text-[11px] sm:text-xs w-7 text-right">42%</span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#132347] overflow-hidden mt-1.5 sm:mt-2">
                  <div className="h-full bg-[#00c5ff] rounded-full w-[42%]" />
                </div>
              </div>

              {/* 2. Digital Marketing */}
              <div>
                <div className="flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#063325] text-[#34d399] flex items-center justify-center shrink-0">
                      <Megaphone className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-200 text-xs truncate">Digital Marketing</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <span className="text-slate-400 text-[11px] sm:text-xs whitespace-nowrap">AED 128,450</span>
                    <span className="font-bold text-white text-[11px] sm:text-xs w-7 text-right">28%</span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#132347] overflow-hidden mt-1.5 sm:mt-2">
                  <div className="h-full bg-[#10b981] rounded-full w-[28%]" />
                </div>
              </div>

              {/* 3. Video Production */}
              <div>
                <div className="flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#2a1147] text-[#c084fc] flex items-center justify-center shrink-0">
                      <Video className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-200 text-xs truncate">Video Production</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <span className="text-slate-400 text-[11px] sm:text-xs whitespace-nowrap">AED 72,500</span>
                    <span className="font-bold text-white text-[11px] sm:text-xs w-7 text-right">16%</span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#132347] overflow-hidden mt-1.5 sm:mt-2">
                  <div className="h-full bg-[#a855f7] rounded-full w-[16%]" />
                </div>
              </div>

              {/* 4. Other Services */}
              <div>
                <div className="flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#362404] text-[#fbbf24] flex items-center justify-center shrink-0">
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-200 text-xs truncate">Other Services</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <span className="text-slate-400 text-[11px] sm:text-xs whitespace-nowrap">AED 63,050</span>
                    <span className="font-bold text-white text-[11px] sm:text-xs w-7 text-right">14%</span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#132347] overflow-hidden mt-1.5 sm:mt-2">
                  <div className="h-full bg-[#f59e0b] rounded-full w-[14%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Sales by Staff */}
        <div className="col-span-1 md:col-span-1 lg:col-span-4 xl:col-span-3 bg-[#091326] border border-[#132347] rounded-xl p-3 sm:p-4 flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-white">Sales by Staff</h3>
              <button className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors">
                View All
              </button>
            </div>

            {/* Staff list */}
            <div className="space-y-3 mt-3">
              {/* 1. Ahmed Khan */}
              <div className="flex items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-400 w-3 text-center shrink-0">1</span>
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-700 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
                      alt="Ahmed Khan"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-100 text-xs truncate">Ahmed Khan</p>
                    <div className="w-full max-w-[80px] sm:max-w-[110px] h-1 rounded-full bg-[#132347] overflow-hidden mt-1">
                      <div className="h-full bg-[#00c5ff] rounded-full w-[85%]" />
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-white whitespace-nowrap shrink-0">
                  AED 98,450
                </span>
              </div>

              {/* 2. Rahul Sharma */}
              <div className="flex items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-400 w-3 text-center shrink-0">2</span>
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-700 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face"
                      alt="Rahul Sharma"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-100 text-xs truncate">Rahul Sharma</p>
                    <div className="w-full max-w-[80px] sm:max-w-[110px] h-1 rounded-full bg-[#132347] overflow-hidden mt-1">
                      <div className="h-full bg-[#2563eb] rounded-full w-[70%]" />
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-white whitespace-nowrap shrink-0">
                  AED 76,800
                </span>
              </div>

              {/* 3. Fatima Ali */}
              <div className="flex items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-400 w-3 text-center shrink-0">3</span>
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-700 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face"
                      alt="Fatima Ali"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-100 text-xs truncate">Fatima Ali</p>
                    <div className="w-full max-w-[80px] sm:max-w-[110px] h-1 rounded-full bg-[#132347] overflow-hidden mt-1">
                      <div className="h-full bg-[#00c5ff] rounded-full w-[58%]" />
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-white whitespace-nowrap shrink-0">
                  AED 63,750
                </span>
              </div>

              {/* 4. Jason D'souza */}
              <div className="flex items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-400 w-3 text-center shrink-0">4</span>
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-700 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face"
                      alt="Jason D'souza"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-100 text-xs truncate">Jason D&apos;souza</p>
                    <div className="w-full max-w-[80px] sm:max-w-[110px] h-1 rounded-full bg-[#132347] overflow-hidden mt-1">
                      <div className="h-full bg-[#2563eb] rounded-full w-[42%]" />
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-white whitespace-nowrap shrink-0">
                  AED 42,900
                </span>
              </div>

              {/* 5. Neha Patel */}
              <div className="flex items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-400 w-3 text-center shrink-0">5</span>
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-700 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face"
                      alt="Neha Patel"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-100 text-xs truncate">Neha Patel</p>
                    <div className="w-full max-w-[80px] sm:max-w-[110px] h-1 rounded-full bg-[#132347] overflow-hidden mt-1">
                      <div className="h-full bg-[#00c5ff] rounded-full w-[36%]" />
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-white whitespace-nowrap shrink-0">
                  AED 38,450
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* ROW 4: LEAD STATUS PIPELINE & TABLE (LEFT) + RECENT ACTIVITY (RIGHT) */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3.5 w-full">
        {/* Left: Lead Status Pipeline & Leads Table (8 cols) */}
        <div className="xl:col-span-8 bg-[#091326] border border-[#132347] rounded-xl p-3 sm:p-4 flex flex-col justify-between overflow-hidden min-w-0 w-full max-w-full">
          <div className="w-full min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-white">Lead Status Pipeline</h3>

            {/* Horizontal Chevron Steps Funnel with Scroll Container */}
            <div className="w-full overflow-x-auto pb-2 scrollbar-thin mt-3">
              <div className="flex items-center min-w-[560px] gap-1">
                {/* New */}
                <div className="chevron-step-first flex-1 min-w-[74px] bg-[#0f3b75] hover:bg-[#13498f] transition-colors py-2 px-1 text-center flex flex-col items-center justify-center">
                  <span className="text-[10px] text-blue-200 uppercase font-medium">New</span>
                  <span className="text-xs sm:text-sm font-bold text-white">246</span>
                </div>
                {/* Contacted */}
                <div className="chevron-step flex-1 min-w-[74px] bg-[#07456d] hover:bg-[#0a5585] transition-colors py-2 px-1 text-center flex flex-col items-center justify-center">
                  <span className="text-[10px] text-sky-200 uppercase font-medium">Contacted</span>
                  <span className="text-xs sm:text-sm font-bold text-white">312</span>
                </div>
                {/* Interested */}
                <div className="chevron-step flex-1 min-w-[74px] bg-[#09547d] hover:bg-[#0c689a] transition-colors py-2 px-1 text-center flex flex-col items-center justify-center">
                  <span className="text-[10px] text-cyan-200 uppercase font-medium">Interested</span>
                  <span className="text-xs sm:text-sm font-bold text-white">220</span>
                </div>
                {/* Proposal Sent */}
                <div className="chevron-step flex-1 min-w-[74px] bg-[#522b7d] hover:bg-[#643499] transition-colors py-2 px-1 text-center flex flex-col items-center justify-center">
                  <span className="text-[10px] text-purple-200 uppercase font-medium">Proposal Sent</span>
                  <span className="text-xs sm:text-sm font-bold text-white">156</span>
                </div>
                {/* Negotiation */}
                <div className="chevron-step flex-1 min-w-[74px] bg-[#7a4b08] hover:bg-[#995e0a] transition-colors py-2 px-1 text-center flex flex-col items-center justify-center">
                  <span className="text-[10px] text-amber-200 uppercase font-medium">Negotiation</span>
                  <span className="text-xs sm:text-sm font-bold text-white">98</span>
                </div>
                {/* Won */}
                <div className="chevron-step flex-1 min-w-[74px] bg-[#0e6338] hover:bg-[#127a45] transition-colors py-2 px-1 text-center flex flex-col items-center justify-center">
                  <span className="text-[10px] text-emerald-200 uppercase font-medium">Won</span>
                  <span className="text-xs sm:text-sm font-bold text-white">142</span>
                </div>
                {/* Lost */}
                <div className="chevron-step-last flex-1 min-w-[74px] bg-[#7d1822] hover:bg-[#9c1e2b] transition-colors py-2 px-1 text-center flex flex-col items-center justify-center">
                  <span className="text-[10px] text-rose-200 uppercase font-medium">Lost</span>
                  <span className="text-xs sm:text-sm font-bold text-white">80</span>
                </div>
              </div>
            </div>

            {/* Leads Table with Horizontal Scroll Container & Unbreakable Columns */}
            <div className="mt-3 sm:mt-4 overflow-x-auto scrollbar-thin pb-2 w-full max-w-full">
              <table className="w-full min-w-[620px] text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b border-[#132347] text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    <th className="pb-2.5 font-medium px-2">LEAD ID</th>
                    <th className="pb-2.5 font-medium px-2">CUSTOMER / COMPANY</th>
                    <th className="pb-2.5 font-medium px-2">ASSIGNED TO</th>
                    <th className="pb-2.5 font-medium px-2">STATUS</th>
                    <th className="pb-2.5 font-medium px-2">PRIORITY</th>
                    <th className="pb-2.5 font-medium px-2 text-right">NEXT FOLLOW-UP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#132347]/50 text-slate-300">
                  {/* Row 1: LD-1250 */}
                  <tr className="hover:bg-[#0c1933]/40 transition-colors">
                    <td className="py-2.5 px-2 font-medium text-cyan-400 hover:underline cursor-pointer">
                      LD-1250
                    </td>
                    <td className="py-2.5 px-2 font-medium text-white">Bright Solutions LLC</td>
                    <td className="py-2.5 px-2 text-slate-300">Ahmed Khan</td>
                    <td className="py-2.5 px-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-500/30">
                        Interested
                      </span>
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-950/70 text-rose-400 border border-rose-500/30">
                        High <ChevronDown className="w-2.5 h-2.5" />
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-right text-slate-400">20 May 2026</td>
                  </tr>

                  {/* Row 2: LD-1249 */}
                  <tr className="hover:bg-[#0c1933]/40 transition-colors">
                    <td className="py-2.5 px-2 font-medium text-cyan-400 hover:underline cursor-pointer">
                      LD-1249
                    </td>
                    <td className="py-2.5 px-2 font-medium text-white">Future Tech</td>
                    <td className="py-2.5 px-2 text-slate-300">Rahul Sharma</td>
                    <td className="py-2.5 px-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-950/70 text-purple-400 border border-purple-500/30">
                        Proposal Sent
                      </span>
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950/70 text-amber-400 border border-amber-500/30">
                        Medium
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-right text-slate-400">19 May 2026</td>
                  </tr>

                  {/* Row 3: LD-1248 */}
                  <tr className="hover:bg-[#0c1933]/40 transition-colors">
                    <td className="py-2.5 px-2 font-medium text-cyan-400 hover:underline cursor-pointer">
                      LD-1248
                    </td>
                    <td className="py-2.5 px-2 font-medium text-white">Oceanic Group</td>
                    <td className="py-2.5 px-2 text-slate-300">Fatima Ali</td>
                    <td className="py-2.5 px-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-950/70 text-indigo-400 border border-indigo-500/30">
                        Negotiation
                      </span>
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-950/70 text-rose-400 border border-rose-500/30">
                        High <ChevronDown className="w-2.5 h-2.5" />
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-right text-slate-400">18 May 2026</td>
                  </tr>

                  {/* Row 4: LD-1247 */}
                  <tr className="hover:bg-[#0c1933]/40 transition-colors">
                    <td className="py-2.5 px-2 font-medium text-cyan-400 hover:underline cursor-pointer">
                      LD-1247
                    </td>
                    <td className="py-2.5 px-2 font-medium text-white">Vision Marketing</td>
                    <td className="py-2.5 px-2 text-slate-300">Jason D&apos;souza</td>
                    <td className="py-2.5 px-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950/70 text-amber-400 border border-amber-500/30">
                        Contacted
                      </span>
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-500/30">
                        Low <ChevronDown className="w-2.5 h-2.5" />
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-right text-slate-400">21 May 2026</td>
                  </tr>

                  {/* Row 5: LD-1246 */}
                  <tr className="hover:bg-[#0c1933]/40 transition-colors">
                    <td className="py-2.5 px-2 font-medium text-cyan-400 hover:underline cursor-pointer">
                      LD-1246
                    </td>
                    <td className="py-2.5 px-2 font-medium text-white">Creative Minds</td>
                    <td className="py-2.5 px-2 text-slate-300">Neha Patel</td>
                    <td className="py-2.5 px-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-950/70 text-sky-400 border border-sky-500/30">
                        New <ChevronDown className="w-2.5 h-2.5" />
                      </span>
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950/70 text-amber-400 border border-amber-500/30">
                        Medium
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-right text-slate-400">22 May 2026</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Centered View All Leads Button */}
          <div className="pt-3 mt-2 text-center border-t border-[#132347]">
            <Link href="/leads">
              <button className="px-4 py-1.5 rounded-lg border border-[#16274e] bg-[#091426] text-xs font-semibold text-slate-300 hover:text-white hover:border-[#00c5ff]/50 transition-colors">
                View All Leads
              </button>
            </Link>
          </div>
        </div>

        {/* Right: Recent Activity (4 cols) */}
        <div className="xl:col-span-4 bg-[#091326] border border-[#132347] rounded-xl p-3 sm:p-4 flex flex-col justify-between overflow-hidden min-w-0 w-full max-w-full">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-white">Recent Activity</h3>
              <button className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors">
                View All
              </button>
            </div>

            {/* List of 7 activity items */}
            <div className="space-y-3 mt-3.5">
              {/* Item 1 */}
              <div className="flex items-start gap-2.5 text-xs">
                <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-xs leading-snug">
                    Lead LD-1250 assigned to Ahmed Khan
                  </p>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">2 min ago</span>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-2.5 text-xs">
                <div className="w-6 h-6 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-xs leading-snug">
                    Invoice INV-2026-1587 created for Bright Solutions LLC
                  </p>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">15 min ago</span>
              </div>

              {/* Item 3 */}
              <div className="flex items-start gap-2.5 text-xs">
                <div className="w-6 h-6 rounded-full bg-sky-600/20 text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <DollarSign className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-xs leading-snug">
                    Payment received AED 18,500 from Future Tech
                  </p>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">45 min ago</span>
              </div>

              {/* Item 4 */}
              <div className="flex items-start gap-2.5 text-xs">
                <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <RefreshCw className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-xs leading-snug">
                    Lead LD-1248 status changed to Proposal Sent
                  </p>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">1 hr ago</span>
              </div>

              {/* Item 5 */}
              <div className="flex items-start gap-2.5 text-xs">
                <div className="w-6 h-6 rounded-full bg-teal-600/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <UserPlus className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-xs leading-snug">
                    New lead LD-1251 added by Rahul Sharma
                  </p>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">2 hr ago</span>
              </div>

              {/* Item 6 */}
              <div className="flex items-start gap-2.5 text-xs">
                <div className="w-6 h-6 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <FileSignature className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-xs leading-snug">
                    Contract signed with Oceanic Group
                  </p>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">3 hr ago</span>
              </div>

              {/* Item 7 */}
              <div className="flex items-start gap-2.5 text-xs">
                <div className="w-6 h-6 rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Send className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-xs leading-snug">
                    Invoice INV-2026-1586 sent to Vision Marketing
                  </p>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">4 hr ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* ROW 5: 7 BOTTOM INVOICE SUMMARY CARDS                                */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-2 sm:gap-3 w-full">
        {/* 1. Total Invoices */}
        <div className="bg-[#091326] border border-[#132347] rounded-xl p-2.5 sm:p-3 flex flex-col justify-between hover:border-[#1e386e] transition-all min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#042842] border border-[#005e8e] text-[#00c2ff] flex items-center justify-center shrink-0">
              <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
            <span className="text-[9.5px] sm:text-[10px] text-slate-400 font-medium truncate">Total Invoices</span>
          </div>
          <div className="mt-2">
            <span className="text-sm sm:text-lg font-bold text-white tracking-tight">356</span>
          </div>
          <div className="mt-1 pt-1.5 border-t border-[#132347]/50">
            <span className="text-[9px] sm:text-[9.5px] text-slate-400 hover:text-slate-200 cursor-pointer transition-colors">
              View Details
            </span>
          </div>
        </div>

        {/* 2. Paid Invoices */}
        <div className="bg-[#091326] border border-[#132347] rounded-xl p-2.5 sm:p-3 flex flex-col justify-between hover:border-[#1e386e] transition-all min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#042b1e] border border-[#086144] text-[#10b981] flex items-center justify-center shrink-0">
              <FileCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
            <span className="text-[9.5px] sm:text-[10px] text-slate-400 font-medium truncate">Paid Invoices</span>
          </div>
          <div className="mt-2">
            <span className="text-sm sm:text-lg font-bold text-white tracking-tight">210</span>
          </div>
          <div className="mt-1 pt-1.5 border-t border-[#132347]/50">
            <span className="text-[9px] sm:text-[9.5px] text-slate-400 hover:text-slate-200 cursor-pointer transition-colors">
              View Details
            </span>
          </div>
        </div>

        {/* 3. Pending Invoices */}
        <div className="bg-[#091326] border border-[#132347] rounded-xl p-2.5 sm:p-3 flex flex-col justify-between hover:border-[#1e386e] transition-all min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#332205] border border-[#6b480b] text-[#f59e0b] flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9.5px] sm:text-[10px] text-slate-400 font-medium truncate">Pending Invoices</span>
          </div>
          <div className="mt-2">
            <span className="text-sm sm:text-lg font-bold text-white tracking-tight">128</span>
          </div>
          <div className="mt-1 pt-1.5 border-t border-[#132347]/50">
            <span className="text-[9px] sm:text-[9.5px] text-slate-400 hover:text-slate-200 cursor-pointer transition-colors">
              View Details
            </span>
          </div>
        </div>

        {/* 4. Overdue Invoices */}
        <div className="bg-[#091326] border border-[#132347] rounded-xl p-2.5 sm:p-3 flex flex-col justify-between hover:border-[#1e386e] transition-all min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#380e14] border border-[#781824] text-[#f43f5e] flex items-center justify-center shrink-0">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9.5px] sm:text-[10px] text-slate-400 font-medium truncate">Overdue Invoices</span>
          </div>
          <div className="mt-2">
            <span className="text-sm sm:text-lg font-bold text-white tracking-tight">18</span>
          </div>
          <div className="mt-1 pt-1.5 border-t border-[#132347]/50">
            <span className="text-[9px] sm:text-[9.5px] text-slate-400 hover:text-slate-200 cursor-pointer transition-colors">
              View Details
            </span>
          </div>
        </div>

        {/* 5. Total Amount Invoiced */}
        <div className="bg-[#091326] border border-[#132347] rounded-xl p-2.5 sm:p-3 flex flex-col justify-between hover:border-[#1e386e] transition-all min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#0e223c] border border-[#1d3d66] text-[#38bdf8] flex items-center justify-center shrink-0">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9.5px] sm:text-[10px] text-slate-400 font-medium truncate">Amount Invoiced</span>
          </div>
          <div className="mt-2">
            <span className="text-xs sm:text-sm font-bold text-white tracking-tight whitespace-nowrap">
              AED 456,890
            </span>
          </div>
          <div className="mt-1 pt-1.5 border-t border-[#132347]/50">
            <span className="text-[9px] sm:text-[9.5px] text-slate-400 hover:text-slate-200 cursor-pointer transition-colors">
              View Details
            </span>
          </div>
        </div>

        {/* 6. Total Amount Received */}
        <div className="bg-[#091326] border border-[#132347] rounded-xl p-2.5 sm:p-3 flex flex-col justify-between hover:border-[#1e386e] transition-all min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#042b1e] border border-[#086144] text-[#10b981] flex items-center justify-center shrink-0">
              <Wallet className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9.5px] sm:text-[10px] text-slate-400 font-medium truncate">Amount Received</span>
          </div>
          <div className="mt-2">
            <span className="text-xs sm:text-sm font-bold text-white tracking-tight whitespace-nowrap">
              AED 312,450
            </span>
          </div>
          <div className="mt-1 pt-1.5 border-t border-[#132347]/50">
            <span className="text-[9px] sm:text-[9.5px] text-slate-400 hover:text-slate-200 cursor-pointer transition-colors">
              View Details
            </span>
          </div>
        </div>

        {/* 7. Total Pending Amount */}
        <div className="bg-[#091326] border border-[#132347] rounded-xl p-2.5 sm:p-3 flex flex-col justify-between hover:border-[#1e386e] transition-all min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#332205] border border-[#6b480b] text-[#f59e0b] flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9.5px] sm:text-[10px] text-slate-400 font-medium truncate">Pending Amount</span>
          </div>
          <div className="mt-2">
            <span className="text-xs sm:text-sm font-bold text-white tracking-tight whitespace-nowrap">
              AED 144,440
            </span>
          </div>
          <div className="mt-1 pt-1.5 border-t border-[#132347]/50">
            <span className="text-[9px] sm:text-[9.5px] text-slate-400 hover:text-slate-200 cursor-pointer transition-colors">
              View Details
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
