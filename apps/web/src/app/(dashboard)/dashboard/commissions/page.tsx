"use client";

import * as React from "react";
import {
  BadgeDollarSign, TrendingUp, Calendar, CheckCircle2,
  Lock, User, DollarSign, Trophy
} from "lucide-react";
import type { CommissionSlabDto, StaffMonthlyCommissionProgressDto } from "@next-digital-crm/shared-types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuthStore } from "@/stores/auth.store";
import { apiClient } from "@/lib/api-client";

// Fixed reference slabs data (matching Next Media Monthly Sales Commission Slabs)
const DEFAULT_SLABS: CommissionSlabDto[] = [
  {
    id: "slab-01",
    slabNumber: 1,
    name: "Slab 1",
    monthlySalesTarget: 15000,
    commissionRate: 10,
    commissionAtTarget: 1500,
    achievementBonus: 1000,
    basicSalary: 1500,
    active: true,
  },
  {
    id: "slab-02",
    slabNumber: 2,
    name: "Slab 2",
    monthlySalesTarget: 30000,
    commissionRate: 15,
    commissionAtTarget: 4500,
    achievementBonus: 1500,
    basicSalary: 1500,
    active: true,
  },
  {
    id: "slab-03",
    slabNumber: 3,
    name: "Slab 3",
    monthlySalesTarget: 50000,
    commissionRate: 20,
    commissionAtTarget: 10000,
    achievementBonus: 2000,
    basicSalary: 1500,
    active: true,
  },
];

export default function CommissionsPage() {
  const user = useAuthStore((s) => s.user);
  const isSuperAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

  const now = new Date();
  const [selectedYear, setSelectedYear] = React.useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = React.useState<number>(now.getMonth() + 1);

  const [slabs, setSlabs] = React.useState<CommissionSlabDto[]>(DEFAULT_SLABS);
  const [myProgress, setMyProgress] = React.useState<StaffMonthlyCommissionProgressDto | null>(null);
  const [adminOverview, setAdminOverview] = React.useState<StaffMonthlyCommissionProgressDto[]>([]);

  const fetchCommissionsData = async () => {
    try {
      // 1. Fetch Slabs
      const slabsRes = await apiClient<CommissionSlabDto[]>("/commissions/slabs");
      if (slabsRes.data && Array.isArray(slabsRes.data) && slabsRes.data.length > 0) {
        setSlabs(slabsRes.data);
      }

      // 2. Fetch Personal Progress
      const progressRes = await apiClient<{ progress: StaffMonthlyCommissionProgressDto; slabs: CommissionSlabDto[] }>(
        `/commissions/my-progress?year=${selectedYear}&month=${selectedMonth}`
      );
      if (progressRes.data?.progress) {
        setMyProgress(progressRes.data.progress);
      }

      // 3. If Admin, fetch overview
      if (isSuperAdmin) {
        const overviewRes = await apiClient<{ staffProgressList: StaffMonthlyCommissionProgressDto[] }>(
          `/commissions/monthly-overview?year=${selectedYear}&month=${selectedMonth}`
        );
        if (overviewRes.data?.staffProgressList) {
          setAdminOverview(overviewRes.data.staffProgressList);
        }
      }
    } catch {
      // Offline fallback handling if DB server initializing
    }
  };

  React.useEffect(() => {
    fetchCommissionsData();
  }, [selectedYear, selectedMonth, isSuperAdmin]);

  // Current personal achieved sales calculation
  const totalSalesAchieved = myProgress ? Number(myProgress.totalAchievedSales) : 25000;
  const currentSlabNum = totalSalesAchieved >= 50000 ? 3 : totalSalesAchieved >= 30000 ? 3 : totalSalesAchieved >= 15000 ? 2 : 1;

  // Earnings Math
  const basicSalary = 1500;
  const earnedCommission = myProgress ? Number(myProgress.earnedCommission) : 3000;
  const earnedBonus = myProgress ? Number(myProgress.earnedBonus) : 1000;
  const totalEstimatedPayout = basicSalary + earnedCommission + earnedBonus;

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Header & Month Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-md border border-brand-500/20">
              Deals & Revenue Engine
            </span>
            <span className="text-xs text-surface-400">• Monthly Commission Slabs & Progression</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-50 flex items-center gap-2.5 mt-1">
            <BadgeDollarSign className="w-6 h-6 text-brand-400" />
            Monthly Sales Commission & Incentives
          </h1>
          <p className="text-xs text-surface-400 mt-1">
            Track tier progression across Slab 1, Slab 2, and Slab 3. Unlock achievement bonuses as monthly sales milestones are hit.
          </p>
        </div>

        {/* Date Filter Bar */}
        <div className="flex items-center gap-2 bg-surface-900 border border-surface-800 rounded-xl p-1.5 shadow-md">
          <Calendar className="w-4 h-4 text-brand-400 ml-2" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="bg-surface-950 border border-surface-800 text-xs font-semibold text-surface-100 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            {monthNames.map((m, idx) => (
              <option key={idx + 1} value={idx + 1}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="bg-surface-950 border border-surface-800 text-xs font-semibold text-surface-100 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value={2026}>2026</option>
            <option value={2025}>2025</option>
          </select>
        </div>
      </div>

      {/* Next Media Monthly Sales Commission Slabs Standard Table Banner */}
      <Card className="bg-surface-900/80 border-surface-800 overflow-hidden shadow-2xl">
        <div className="p-4 bg-gradient-to-r from-surface-950 via-surface-900 to-surface-900 border-b border-surface-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-surface-50">Next Media Monthly Sales Commission Slabs</h2>
              <p className="text-xs text-surface-400">
                Individual monthly targets and earnings at each achieved slab tier. Achievement bonus payable when full slab target is reached.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="border-brand-500/30 text-brand-400 font-mono text-xs">
            Basic Salary: AED 1,500 / Month
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-surface-200">
            <thead className="bg-surface-950/80 border-b border-surface-800 text-surface-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Slab Phase</th>
                <th className="px-5 py-3">Monthly Sales Target</th>
                <th className="px-5 py-3">Commission Rate</th>
                <th className="px-5 py-3">Commission at Target</th>
                <th className="px-5 py-3 text-emerald-400">Achievement Bonus</th>
                <th className="px-5 py-3">Basic Salary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800/60">
              {slabs.map((slab) => {
                const isCurrent = currentSlabNum === slab.slabNumber;
                return (
                  <tr
                    key={slab.id}
                    className={`transition-colors ${
                      isCurrent ? "bg-brand-500/10 font-semibold text-surface-50" : "hover:bg-surface-800/40"
                    }`}
                  >
                    <td className="px-5 py-3.5 flex items-center gap-2">
                      <span className="font-bold text-brand-400">{slab.name}</span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded border border-brand-500/30">
                          Active Phase
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-surface-100">
                      AED {Number(slab.monthlySalesTarget).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-sky-400">
                      {Number(slab.commissionRate)}%
                    </td>
                    <td className="px-5 py-3.5 text-surface-200">
                      AED {Number(slab.commissionAtTarget).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-emerald-400">
                      + AED {Number(slab.achievementBonus).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-surface-300">
                      AED {Number(slab.basicSalary).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Visual Progression Stepper & Live Performance Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Stepper Progress Cards for Slab 1, Slab 2, Slab 3 */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-400" />
              {monthNames[selectedMonth - 1]} {selectedYear} Slab Progression & Thresholds
            </h3>
            <span className="text-xs text-surface-400">
              Assigned: <strong>{myProgress?.assignedAt ? new Date(myProgress.assignedAt).toLocaleDateString() : "Month Start"}</strong>
            </span>
          </div>

          <div className="space-y-4">
            {slabs.map((slab) => {
              const target = Number(slab.monthlySalesTarget);
              const progressPct = Math.min(100, Math.round((totalSalesAchieved / target) * 100));
              const isAchieved = totalSalesAchieved >= target;

              let statusBadge = "Locked";
              let statusVariant: "secondary" | "success" | "warning" = "secondary";

              if (slab.slabNumber === 1) {
                statusBadge = isAchieved ? "Slab 1 Achieved ✓" : "In Progress (Phase 1)";
                statusVariant = isAchieved ? "success" : "warning";
              } else if (slab.slabNumber === 2) {
                statusBadge = isAchieved ? "Slab 2 Achieved ✓" : totalSalesAchieved >= 15000 ? "Phase 2 Unlocked" : "Locked (Complete Slab 1)";
                statusVariant = isAchieved ? "success" : totalSalesAchieved >= 15000 ? "warning" : "secondary";
              } else if (slab.slabNumber === 3) {
                statusBadge = isAchieved ? "Slab 3 Achieved ✓" : totalSalesAchieved >= 30000 ? "Phase 3 Unlocked" : "Locked (Complete Slab 2)";
                statusVariant = isAchieved ? "success" : totalSalesAchieved >= 30000 ? "warning" : "secondary";
              }

              return (
                <div
                  key={slab.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isAchieved
                      ? "bg-emerald-950/20 border-emerald-500/30 shadow-lg"
                      : currentSlabNum === slab.slabNumber
                      ? "bg-surface-900 border-brand-500/40 shadow-xl"
                      : "bg-surface-950/60 border-surface-800 opacity-80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-xl border ${
                          isAchieved
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-surface-800 border-surface-700 text-surface-300"
                        }`}
                      >
                        {isAchieved ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-surface-50">{slab.name} Phase</h4>
                          <Badge variant={statusVariant}>{statusBadge}</Badge>
                        </div>
                        <p className="text-xs text-surface-400 mt-0.5">
                          Target Sales: <strong>AED {target.toLocaleString()}</strong> • Commission Rate:{" "}
                          <strong className="text-sky-400">{Number(slab.commissionRate)}%</strong>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-400">
                        Bonus: +AED {Number(slab.achievementBonus).toLocaleString()}
                      </div>
                      <div className="text-[11px] text-surface-400">
                        Total at Target: AED {(Number(slab.commissionAtTarget) + Number(slab.achievementBonus)).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-surface-400">Progression to Target</span>
                      <span className="font-bold text-surface-200">
                        AED {Math.min(totalSalesAchieved, target).toLocaleString()} / AED {target.toLocaleString()} ({progressPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-surface-950 rounded-full h-2.5 overflow-hidden border border-surface-800">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isAchieved ? "bg-emerald-500" : "bg-gradient-to-r from-brand-600 to-brand-400"
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Payout Breakdown Card */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-surface-100 uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Estimated Earnings Breakdown
          </h3>

          <Card className="bg-surface-900 border-surface-800 shadow-2xl p-6 space-y-6">
            <div className="p-4 bg-surface-950 border border-surface-800 rounded-xl text-center space-y-1">
              <span className="text-xs text-surface-400 uppercase tracking-wider font-semibold">
                Total Estimated Payout
              </span>
              <div className="text-3xl font-extrabold text-emerald-400">
                AED {totalEstimatedPayout.toLocaleString()}
              </div>
              <p className="text-[11px] text-surface-400">
                Includes Basic Salary + Slab Commission + Unlocked Bonuses
              </p>
            </div>

            <div className="space-y-3 text-xs text-surface-200 divide-y divide-surface-800/60">
              <div className="flex items-center justify-between pt-2">
                <span className="text-surface-400">Monthly Sales Achieved</span>
                <span className="font-bold text-surface-50 text-sm">
                  AED {totalSalesAchieved.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-surface-400">Basic Monthly Salary</span>
                <span className="font-semibold text-surface-100">AED {basicSalary.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-surface-400">Earned Commission</span>
                <span className="font-semibold text-sky-400">AED {earnedCommission.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-surface-400">Achievement Bonuses</span>
                <span className="font-bold text-emerald-400">AED {earnedBonus.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3 bg-brand-500/10 border border-brand-500/20 rounded-xl text-xs text-brand-300 leading-relaxed">
              💡 <strong>System Note:</strong> Progress resets at the start of each month while preserving complete historical payout logs for compliance and reporting.
            </div>
          </Card>
        </div>
      </div>

      {/* Super Admin Staff Overview Table */}
      {isSuperAdmin && (
        <Card className="bg-surface-900/80 border-surface-800 overflow-hidden shadow-2xl mt-8">
          <div className="p-4 bg-surface-950 border-b border-surface-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-surface-50 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-brand-400" />
              Sales Team Monthly Commission Ledger ({monthNames[selectedMonth - 1]} {selectedYear})
            </h3>
            <span className="text-xs text-surface-400">Super Admin / Admin Control</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-surface-300">
              <thead className="bg-surface-950/80 border-b border-surface-800 text-surface-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">Sales Staff</th>
                  <th className="px-4 py-3">Active Slab</th>
                  <th className="px-4 py-3">Sales Achieved (AED)</th>
                  <th className="px-4 py-3">Earned Commission</th>
                  <th className="px-4 py-3">Achievement Bonus</th>
                  <th className="px-4 py-3">Basic Salary</th>
                  <th className="px-4 py-3 text-right">Total Payout (AED)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-800/60">
                {adminOverview.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-surface-500">
                      No staff sales progress records logged for this month yet.
                    </td>
                  </tr>
                ) : (
                  adminOverview.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-800/40 transition-colors">
                      <td className="px-4 py-3.5 font-semibold text-surface-100">
                        {item.staff?.name || "Sales Staff"}
                        <span className="text-[11px] text-surface-400 block">{item.staff?.email}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant="warning">{item.currentSlab?.name || "Slab 1"}</Badge>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-surface-100">
                        AED {Number(item.totalAchievedSales).toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-sky-400">
                        AED {Number(item.earnedCommission).toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-emerald-400">
                        AED {Number(item.earnedBonus).toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-surface-300">
                        AED {Number(item.basicSalary).toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-right font-extrabold text-emerald-400 text-sm">
                        AED {Number(item.totalPayout).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
