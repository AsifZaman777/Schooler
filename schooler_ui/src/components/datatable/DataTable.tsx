"use client";
import React, { useState, useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef,
    SortingState,
} from "@tanstack/react-table";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ChevronUp, ChevronDown, ChevronsUpDown, FileText, Download, Copy, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T, unknown>[];
    title?: string;
    searchable?: boolean;
    pageSize?: number;
    exportFilename?: string;
}

function exportCSV<T>(data: T[], columns: ColumnDef<T, unknown>[], filename: string) {
    const headers = columns
        .filter((c) => c.id !== "actions")
        .map((c) => (typeof c.header === "string" ? c.header : c.id ?? ""));
    const rows = data.map((row) =>
        columns
            .filter((c) => c.id !== "actions")
            .map((c) => {
                const key = (c as { accessorKey?: string }).accessorKey;
                if (!key) return "";
                const val = (row as Record<string, unknown>)[key];
                return typeof val === "object" ? JSON.stringify(val) : String(val ?? "");
            })
    );
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

function exportPDF<T>(data: T[], columns: ColumnDef<T, unknown>[], filename: string, title: string) {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(14);
    doc.text(title, 14, 15);
    const head = columns
        .filter((c) => c.id !== "actions")
        .map((c) => (typeof c.header === "string" ? c.header : c.id ?? ""));
    const body = data.map((row) =>
        columns
            .filter((c) => c.id !== "actions")
            .map((c) => {
                const key = (c as { accessorKey?: string }).accessorKey;
                if (!key) return "";
                const val = (row as Record<string, unknown>)[key];
                return typeof val === "object" ? JSON.stringify(val) : String(val ?? "");
            })
    );
    autoTable(doc, { head: [head], body, startY: 22, styles: { fontSize: 9 }, headStyles: { fillColor: [59, 110, 248] } });
    doc.save(`${filename}.pdf`);
}

async function copyToClipboard<T>(data: T[], columns: ColumnDef<T, unknown>[], onDone: () => void) {
    const headers = columns
        .filter((c) => c.id !== "actions")
        .map((c) => (typeof c.header === "string" ? c.header : c.id ?? ""));
    const rows = data.map((row) =>
        columns
            .filter((c) => c.id !== "actions")
            .map((c) => {
                const key = (c as { accessorKey?: string }).accessorKey;
                if (!key) return "";
                const val = (row as Record<string, unknown>)[key];
                return typeof val === "object" ? JSON.stringify(val) : String(val ?? "");
            })
    );
    const text = [headers, ...rows].map((r) => r.join("\t")).join("\n");
    await navigator.clipboard.writeText(text);
    onDone();
}

export function DataTable<T>({
    data,
    columns,
    title = "Table",
    searchable = true,
    pageSize = 10,
    exportFilename = "export",
}: DataTableProps<T>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [copied, setCopied] = useState(false);

    const table = useReactTable({
        data,
        columns,
        state: { sorting, globalFilter },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize } },
    });

    const allRows = useMemo(() => table.getFilteredRowModel().rows.map((r) => r.original), [table]);

    return (
        <div className="card p-0 overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 py-3 border-b border-[--border]">
                <h3 className="text-sm font-semibold text-[--foreground]">{title}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                    {searchable && (
                        <div className="relative">
                            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[--muted-foreground]" />
                            <Input
                                placeholder="Search…"
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                className="pl-8 h-8 w-44 text-xs"
                            />
                        </div>
                    )}
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(allRows, columns, () => { setCopied(true); setTimeout(() => setCopied(false), 1500); })}>
                        <Copy size={13} /> {copied ? "Copied!" : "Copy"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportCSV(allRows, columns, exportFilename)}>
                        <Download size={13} /> CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportPDF(allRows, columns, exportFilename, title)}>
                        <FileText size={13} /> PDF
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="dt-table">
                    <thead>
                        {table.getHeaderGroups().map((hg) => (
                            <tr key={hg.id}>
                                {hg.headers.map((header) => (
                                    <th key={header.id} onClick={header.column.getToggleSortingHandler()} className={cn(header.column.getCanSort() && "cursor-pointer select-none")}>
                                        <span className="inline-flex items-center gap-1">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getCanSort() && (
                                                header.column.getIsSorted() === "asc" ? <ChevronUp size={13} /> :
                                                    header.column.getIsSorted() === "desc" ? <ChevronDown size={13} /> :
                                                        <ChevronsUpDown size={13} className="opacity-40" />
                                            )}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-8 text-[--muted-foreground] text-sm">
                                    No records found
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-[--border] text-sm text-[--muted-foreground]">
                <span>
                    {table.getFilteredRowModel().rows.length} record{table.getFilteredRowModel().rows.length !== 1 && "s"}
                    {" · "}Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        <ChevronLeft size={15} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        <ChevronRight size={15} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
