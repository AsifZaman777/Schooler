"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/datatable/DataTable";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/hooks/useApi";
import { Payment } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";

const columns: ColumnDef<Payment, unknown>[] = [
    { id: "student", header: "Student", accessorFn: (r) => (r.student as { firstName?: string; lastName?: string })?.firstName ? `${(r.student as { firstName: string; lastName: string }).firstName} ${(r.student as { firstName: string; lastName: string }).lastName}` : String(r.student) },
    { id: "paymentType", accessorKey: "paymentType", header: "Type" },
    { id: "amount", header: "Amount", accessorFn: (r) => formatCurrency(r.amount) },
    { id: "paymentMethod", accessorKey: "paymentMethod", header: "Method" },
    { id: "transactionId", accessorKey: "transactionId", header: "Transaction ID" },
    { id: "paymentDate", header: "Date", accessorFn: (r) => formatDate(r.paymentDate) },
    {
        id: "status",
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => <Badge status={String(getValue())} />,
    },
];

export default function PaymentsPage() {
    const { data, loading } = useApi<{ data: Payment[]; pagination: { total: number } }>("/payments");
    return (
        <>
            <Header title="Payments" />
            <main className="p-5 space-y-4">
                <div>
                    <h2 className="text-base font-semibold text-[--foreground]">All Payments</h2>
                    <p className="text-sm text-[--muted-foreground]">{data?.pagination?.total ?? 0} total records</p>
                </div>
                {loading ? (
                    <div className="card p-10 text-center text-[--muted-foreground] text-sm">Loading…</div>
                ) : (
                    <DataTable data={data?.data ?? []} columns={columns} title="Payments" exportFilename="payments" />
                )}
            </main>
        </>
    );
}
