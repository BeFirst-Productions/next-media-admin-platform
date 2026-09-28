"use client";

import * as React from "react";
import { ChevronDown, ArrowUpDown, Download, ArrowUp, ArrowDown } from "lucide-react";

export interface DataTableColumn<T> {
  id: string;
  header: React.ReactNode;
  accessorKey?: keyof T;
  cell?: (info: { row: T; index: number }) => React.ReactNode;
  sortable?: boolean;
  sortKey?: keyof T;
  align?: "left" | "center" | "right";
  width?: string;
  headerClassName?: string;
  cellClassName?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  
  // Selection
  selectable?: boolean;
  selectedIds?: string[];
  onSelectRow?: (id: string) => void;
  onSelectAll?: () => void;
  isAllSelected?: boolean;

  // Sorting
  sortField?: keyof T | null;
  sortAsc?: boolean;
  onSort?: (field: keyof T) => void;

  // Controls (Show entries + Export)
  showControls?: boolean;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  onExport?: () => void;
  exportLabel?: string;

  // Pagination
  pagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;

  // States
  isLoading?: boolean;
  emptyMessage?: string;
  minWidth?: string;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  getRowId,
  selectable = false,
  selectedIds = [],
  onSelectRow,
  onSelectAll,
  isAllSelected = false,
  sortField,
  sortAsc = true,
  onSort,
  showControls = true,
  pageSize = 10,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  onExport,
  exportLabel = "Export",
  pagination = true,
  currentPage = 1,
  totalPages = 1,
  totalCount,
  onPageChange,
  isLoading = false,
  emptyMessage = "No records found matching your criteria.",
  minWidth = "1040px",
  className = "",
}: DataTableProps<T>) {
  const count = totalCount !== undefined ? totalCount : data.length;
  const startEntry = count === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(currentPage * pageSize, count);

  return (
    <div className={`space-y-3 w-full max-w-full ${className}`}>
      {/* 1. TOP CONTROLS: SHOW ENTRIES & EXPORT BUTTON */}
      {showControls && (
        <div className="flex items-center justify-between text-sm sm:text-base 2xl:text-lg text-slate-300 px-0.5 font-medium">
          {onPageSizeChange && (
            <div className="flex items-center gap-2">
              <span>Show</span>
              <div className="relative">
                <select
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  className="bg-[#091326] border border-[#142344] rounded-lg px-2.5 py-1 text-sm sm:text-base 2xl:text-lg text-slate-100 appearance-none pr-6 focus:outline-none focus:border-cyan-500 cursor-pointer font-medium"
                >
                  {pageSizeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <span>entries</span>
            </div>
          )}

          {onExport && (
            <button
              onClick={onExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#091326] border border-[#142344] text-slate-200 hover:text-white hover:border-[#1d356c] text-sm sm:text-base 2xl:text-lg font-medium transition-colors shadow-sm ml-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{exportLabel}</span>
            </button>
          )}
        </div>
      )}

      {/* 2. TABLE WRAPPER */}
      <div className="bg-[#091326] border border-[#132347] rounded-xl overflow-hidden w-full max-w-full shadow-lg">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left whitespace-nowrap" style={{ minWidth }}>
            {/* TABLE HEADER */}
            <thead>
              <tr className="border-b border-[#132347] text-xs sm:text-sm 2xl:text-sm font-bold uppercase tracking-wider text-center text-slate-300 bg-[#070e1c]/70">
                {selectable && (
                  <th className="py-3 px-3.5 w-11 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={onSelectAll}
                      className="w-3.5 h-3.5 rounded bg-[#091426] border-[#16274e] text-cyan-500 focus:ring-0 cursor-pointer accent-[#0092e0]"
                      aria-label="Select all rows"
                    />
                  </th>
                )}

                {columns.map((col) => {
                  const isSorted = sortField && (col.sortKey || col.accessorKey) === sortField;
                  const alignClass =
                    col.align === "center"
                      ? "text-center"
                      : col.align === "right"
                      ? "text-right"
                      : "text-left";

                  return (
                    <th
                      key={col.id}
                      style={{ width: col.width }}
                      onClick={() => {
                        if (col.sortable && onSort) {
                          const targetKey = col.sortKey || (col.accessorKey as keyof T);
                          if (targetKey) onSort(targetKey);
                        }
                      }}
                      className={`py-3 px-3.5 ${alignClass} ${
                        col.sortable ? "cursor-pointer hover:text-white transition-colors select-none" : ""
                      } ${col.headerClassName || ""}`}
                    >
                      <div
                        className={`inline-flex items-center gap-1.5 justify-center`}
                      >
                        <span>{col.header}</span>
                        {col.sortable && (
                          <span className="text-slate-400">
                            {isSorted ? (
                              sortAsc ? (
                                <ArrowUp className="w-3 h-3 text-cyan-400" />
                              ) : (
                                <ArrowDown className="w-3 h-3 text-cyan-400" />
                              )
                            ) : (
                              <ArrowUpDown className="w-3 h-3 text-slate-500" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody className="divide-y divide-[#132347]/50 text-slate-200 text-sm sm:text-base 2xl:text-lg">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="py-12 text-center text-slate-400 font-medium"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      <span>Loading data...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="py-12 text-center text-slate-400 font-medium"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => {
                  const rowId = getRowId(row);
                  const isSelected = selectedIds.includes(rowId);

                  return (
                    <tr
                      key={rowId}
                      className={`hover:bg-[#0c1933]/60 transition-colors ${
                        isSelected ? "bg-[#0b1f3f]/50" : ""
                      }`}
                    >
                      {selectable && (
                        <td className="py-2.5 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onSelectRow && onSelectRow(rowId)}
                            className="w-3.5 h-3.5 rounded bg-[#091426] border-[#16274e] text-cyan-500 focus:ring-0 cursor-pointer accent-[#0092e0]"
                            aria-label={`Select row ${rowId}`}
                          />
                        </td>
                      )}

                      {columns.map((col) => {
                        const alignClass =
                          col.align === "center"
                            ? "text-center"
                            : col.align === "right"
                            ? "text-right"
                            : "text-left";

                        let cellValue: React.ReactNode = null;
                        if (col.cell) {
                          cellValue = col.cell({ row, index: idx });
                        } else if (col.accessorKey) {
                          cellValue = String(row[col.accessorKey] ?? "");
                        }

                        return (
                          <td
                            key={col.id}
                            className={`py-2.5 px-3.5 ${alignClass} ${col.cellClassName || ""}`}
                          >
                            {cellValue}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. PAGINATION BAR */}
      {pagination && onPageChange && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-sm sm:text-base 2xl:text-lg text-slate-300 pt-1 px-1 font-medium">
          <div>
            Showing {startEntry} to {endEntry} of {count} entries
          </div>

          <div className="flex items-center gap-1">
            {/* Previous Page */}
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg border border-[#142344] bg-[#091326] text-slate-300 hover:text-white hover:border-[#1d356c] disabled:opacity-40 disabled:pointer-events-none transition-colors text-sm font-semibold"
              aria-label="Previous page"
            >
              &laquo;
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                  currentPage === pageNum
                    ? "bg-[#0092e0] text-white border border-[#0092e0] shadow-[0_0_8px_rgba(0,146,224,0.35)]"
                    : "bg-[#091326] border border-[#142344] text-slate-300 hover:text-white hover:border-[#1d356c]"
                }`}
              >
                {pageNum}
              </button>
            ))}

            {/* Next Page */}
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg border border-[#142344] bg-[#091326] text-slate-300 hover:text-white hover:border-[#1d356c] disabled:opacity-40 disabled:pointer-events-none transition-colors text-sm font-semibold"
              aria-label="Next page"
            >
              &raquo;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
