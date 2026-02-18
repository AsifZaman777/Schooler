"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/datatable/DataTable";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/hooks/useApi";
import { Payment } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";

const columns: ColumnDef<Payment, unknown>[] = [
    { id: "paymentType", accessorKey: "paymentType", header: "Type" },
    { id: "amount", header: "Amount", accessorFn: (r) => formatCurrency(r.amount) },
    { id: "paymentMethod", accessorKey: "paymentMethod", header: "Method" },
    { id: "paymentDate", header: "Date", accessorFn: (r) => formatDate(r.paymentDate) },
    { id: "status", header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge status={String(getValue())} /> },
];

export default function ParentPaymentsPage() {
    const { data, loading } = useApi<{ data: Payment[] }>("/payments");
    return (
        <>
            <Header title="Payments" userName="Parent" />
            <main className="p-5 space-y-4">
                <h2 className="text-base font-semibold text-[--foreground]">Payment History</h2>
                {loading ? (
                    <div className="card p-10 text-center text-[--muted-foreground] text-sm">Loading…</div>
                ) : (
                    <DataTable data={data?.data ?? []} columns={columns} title="Payments" exportFilename="parent-payments" />
                )}
            </main>
        </>
    );
}
