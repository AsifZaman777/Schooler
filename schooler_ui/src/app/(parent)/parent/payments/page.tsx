"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/datatable/DataTable";
import { Badge } from "@/components/ui/badge";
import { usePayments } from "@/hooks/usePayments";
import { Payment } from "@/types/viewModels";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function ParentPaymentsPage() {
    const { payments, loading } = usePayments();

    const columns: ColumnDef<Payment, unknown>[] = [
        { id: "paymentType", accessorKey: "paymentType", header: "Type" },
        { id: "amount", header: "Amount", accessorFn: (r) => formatCurrency(r.amount) },
        { id: "paymentMethod", accessorKey: "paymentMethod", header: "Method" },
        { id: "dueDate", header: "Due Date", accessorFn: (r) => formatDate(r.dueDate) },
        { id: "paidDate", header: "Paid Date", accessorFn: (r) => r.paidDate ? formatDate(r.paidDate) : "—" },
        { id: "academicYear", accessorKey: "academicYear", header: "Academic Year" },
        { id: "semester", accessorKey: "semester", header: "Semester" },
        { id: "status", header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge variant={String(getValue()) === "paid" ? "default" : "secondary"}>{String(getValue())}</Badge> },
    ];

    return (
        <>
            <Header title="Payments" />
            <main className="p-5 space-y-4">
                <h2 className="text-base font-semibold text-[--foreground]">Payment History</h2>
                {loading ? (
                    <div className="card p-10 text-center text-[--muted-foreground] text-sm">Loading…</div>
                ) : (
                    <DataTable data={payments} columns={columns} title="Payments" exportFilename="parent-payments" />
                )}
            </main>
        </>
    );
}
