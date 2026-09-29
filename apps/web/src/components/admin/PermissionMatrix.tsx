"use client";

import * as React from "react";
import type { Role, CrmModule, CrmAction } from "@next-digital-crm/shared-types";
import { Check, CheckSquare, Square, RotateCcw } from "lucide-react";
import {
  MODULE_DEFINITIONS,
  ROLE_DEFAULT_TEMPLATES,
  ALL_ACTION_PERMISSIONS,
} from "@/config/permissions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface PermissionMatrixProps {
  selectedPermissions: string[];
  onChange: (permissions: string[]) => void;
  role?: Role;
  disabled?: boolean;
}

const ACTION_LABELS: Record<CrmAction, string> = {
  list: "View",
  create: "Create",
  edit: "Edit",
  delete: "Delete",
  export: "Export",
  approve: "Approve",
  analytics: "Analytics",
};

export function PermissionMatrix({
  selectedPermissions,
  onChange,
  role = "SALES_STAFF",
  disabled = false,
}: PermissionMatrixProps) {
  const isSuperAdmin = role === "SUPER_ADMIN";

  const isPermissionSelected = (module: CrmModule, action: CrmAction): boolean => {
    if (isSuperAdmin) return true;
    return selectedPermissions.includes(`${module}:${action}`);
  };

  const togglePermission = (module: CrmModule, action: CrmAction) => {
    if (disabled || isSuperAdmin) return;
    const permission = `${module}:${action}`;
    if (selectedPermissions.includes(permission)) {
      onChange(selectedPermissions.filter((p) => p !== permission));
    } else {
      onChange([...selectedPermissions, permission]);
    }
  };

  const isModuleFullySelected = (module: typeof MODULE_DEFINITIONS[number]): boolean => {
    if (isSuperAdmin) return true;
    return module.actions.every((action) => selectedPermissions.includes(`${module.id}:${action}`));
  };

  const toggleModuleAll = (module: typeof MODULE_DEFINITIONS[number]) => {
    if (disabled || isSuperAdmin) return;
    const modulePerms = module.actions.map((action) => `${module.id}:${action}`);
    const isAllSelected = isModuleFullySelected(module);

    if (isAllSelected) {
      onChange(selectedPermissions.filter((p) => !modulePerms.includes(p)));
    } else {
      const newPerms = Array.from(new Set([...selectedPermissions, ...modulePerms]));
      onChange(newPerms);
    }
  };

  const selectAll = () => {
    if (disabled || isSuperAdmin) return;
    onChange([...ALL_ACTION_PERMISSIONS]);
  };

  const deselectAll = () => {
    if (disabled || isSuperAdmin) return;
    onChange([]);
  };

  const resetToRoleDefaults = () => {
    if (disabled || isSuperAdmin) return;
    const defaults = ROLE_DEFAULT_TEMPLATES[role] ?? [];
    onChange([...defaults]);
  };

  return (
    <div className="space-y-4">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-surface-950/60 border border-surface-800/80">
        <div>
          <h4 className="text-xs font-semibold text-surface-200 tracking-wide uppercase">
            Module Action Permissions Matrix
          </h4>
          <p className="text-[11px] text-surface-400">
            {isSuperAdmin
              ? "Super Admin inherently possesses unrestricted authority across all modules."
              : `Customize individual module actions. Currently active: ${selectedPermissions.length} permissions`}
          </p>
        </div>

        {!isSuperAdmin && !disabled && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetToRoleDefaults}
              className="text-[11px] h-7 px-2.5 gap-1.5"
            >
              <RotateCcw className="w-3 h-3" />
              Role Preset
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={selectAll}
              className="text-[11px] h-7 px-2.5"
            >
              Select All
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={deselectAll}
              className="text-[11px] h-7 px-2"
            >
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Grid of Modules */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {MODULE_DEFINITIONS.map((module) => {
          const allSelected = isModuleFullySelected(module);

          return (
            <div
              key={module.id}
              className={cn(
                "p-3 rounded-xl border transition-all",
                allSelected
                  ? "bg-surface-900/80 border-surface-700/70"
                  : "bg-surface-950/50 border-surface-800/60 hover:border-surface-700/50",
              )}
            >
              <div className="flex items-center justify-between gap-4 mb-2.5">
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-surface-100 flex items-center gap-2">
                    {module.label}
                    <span className="text-[10px] font-mono text-surface-500 font-normal">
                      ({module.id})
                    </span>
                  </span>
                  <p className="text-[11px] text-surface-400 truncate">{module.description}</p>
                </div>

                {!isSuperAdmin && !disabled && (
                  <button
                    type="button"
                    onClick={() => toggleModuleAll(module)}
                    className="flex items-center gap-1 text-[11px] text-brand-400 hover:text-brand-300 font-medium shrink-0 px-2 py-0.5 rounded hover:bg-brand-950/40"
                  >
                    {allSelected ? (
                      <>
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span>All</span>
                      </>
                    ) : (
                      <>
                        <Square className="w-3.5 h-3.5 text-surface-500" />
                        <span>All</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Actions row */}
              <div className="flex flex-wrap gap-2">
                {module.actions.map((action) => {
                  const selected = isPermissionSelected(module.id, action);

                  return (
                    <button
                      key={action}
                      type="button"
                      disabled={disabled || isSuperAdmin}
                      onClick={() => togglePermission(module.id, action)}
                      className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all",
                        selected
                          ? "bg-brand-600/20 text-brand-300 border-brand-500/40 shadow-sm"
                          : "bg-surface-900 text-surface-400 border-surface-800 hover:border-surface-700 hover:text-surface-200",
                        (disabled || isSuperAdmin) && "cursor-default opacity-80",
                      )}
                    >
                      <div
                        className={cn(
                          "w-3 h-3 rounded flex items-center justify-center border",
                          selected
                            ? "bg-brand-600 border-brand-500 text-white"
                            : "border-surface-700 bg-surface-950",
                        )}
                      >
                        {selected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span>{ACTION_LABELS[action]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
