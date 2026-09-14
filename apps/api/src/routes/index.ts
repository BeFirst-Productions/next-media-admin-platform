import { Router } from "express";

import authRoutes from "@/modules/auth/auth.routes";
import usersRoutes from "@/modules/users/users.routes";
import leadsRoutes from "@/modules/leads/leads.routes";
import clientsRoutes from "@/modules/clients/clients.routes";
import { categoryRouter, packageRouter, addonRouter } from "@/modules/services/services.routes";
import proposalsRoutes from "@/modules/proposals/proposals.routes";
import contractsRoutes from "@/modules/contracts/contracts.routes";
import invoicesRoutes from "@/modules/invoices/invoices.routes";
import paymentsRoutes from "@/modules/payments/payments.routes";
import commissionsRoutes from "@/modules/commissions/commissions.routes";
import targetsRoutes from "@/modules/targets/targets.routes";
import reportsRoutes from "@/modules/reports/reports.routes";
import notificationsRoutes from "@/modules/notifications/notifications.routes";
import auditRoutes from "@/modules/audit/audit.routes";
import systemLogsRoutes from "@/modules/system-logs/system-logs.routes";
import settingsRoutes from "@/modules/settings/settings.routes";
import backupsRoutes from "@/modules/backups/backups.routes";

const router = Router();

// Phase 1 — Foundation
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);

// Phase 2 — Package engine (dynamic pricing, no hard-coded plans)
router.use("/service-categories", categoryRouter);
router.use("/packages", packageRouter);
router.use("/addons", addonRouter);

// Phase 3 — CRM
router.use("/leads", leadsRoutes);
router.use("/clients", clientsRoutes);

// Phase 4 — Proposal engine (core business workflow)
router.use("/proposals", proposalsRoutes);

// Phase 5-7 — Contract -> Invoice -> Payment -> Commission (scaffolded)
router.use("/contracts", contractsRoutes);
router.use("/invoices", invoicesRoutes);
router.use("/payments", paymentsRoutes);
router.use("/commissions", commissionsRoutes);
router.use("/sales-targets", targetsRoutes);

// Phase 8-9 — Reporting & system administration
router.use("/reports", reportsRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/audit-logs", auditRoutes);
router.use("/system-logs", systemLogsRoutes);
router.use("/settings", settingsRoutes);
router.use("/backups", backupsRoutes);

export default router;
