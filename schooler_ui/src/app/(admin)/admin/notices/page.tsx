"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/datatable/DataTable";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/hooks/useApi";
import { Notice } from "@/types";
import { formatDate } from "@/lib/utils";

const columns: ColumnDef<Notice, unknown>[] = [
    { id: "title", accessorKey: "title", header: "Title" },
    { id: "audience", accessorKey: "audience", header: "Audience" },
    {
        id: "priority",
        header: "Priority",
        accessorKey: "priority",
        cell: ({ getValue }) => <Badge status={String(getValue())} />,
    },
    { id: "publishDate", header: "Publish Date", accessorFn: (r) => formatDate(r.publishDate) },
    { id: "expiryDate", header: "Expiry Date", accessorFn: (r) => r.expiryDate ? formatDate(r.expiryDate) : "—" },
    {
        id: "status",
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => <Badge status={String(getValue())} />,
    },
];

export default function NoticesPage() {
    const { data, loading } = useApi<{ data: Notice[]; pagination: { total: number } }>("/notices");
    return (
        <>
            <Header title="Notices" />
            <main className="p-5 space-y-4">
                <div>
                    <h2 className="text-base font-semibold text-[--foreground]">All Notices</h2>
                    <p className="text-sm text-[--muted-foreground]">{data?.pagination?.total ?? 0} total notices</p>
                </div>
                {loading ? (
                    <div className="card p-10 text-center text-[--muted-foreground] text-sm">Loading…</div>
                ) : (
                    <DataTable data={data?.data ?? []} columns={columns} title="Notices" exportFilename="notices" />
                )}
            </main>
        </>
    );
}
