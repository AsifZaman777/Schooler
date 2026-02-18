"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/datatable/DataTable";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/hooks/useApi";
import { Expense } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";

const columns: ColumnDef<Expense, unknown>[] = [
    { id: "title", accessorKey: "title", header: "Title" },
    { id: "category", accessorKey: "category", header: "Category" },
    { id: "amount", header: "Amount", accessorFn: (r) => formatCurrency(r.amount) },
    { id: "paymentMethod", accessorKey: "paymentMethod", header: "Method" },
    { id: "paidTo", accessorKey: "paidTo", header: "Paid To" },
    { id: "expenseDate", header: "Date", accessorFn: (r) => formatDate(r.expenseDate) },
    {
        id: "status",
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => <Badge status={String(getValue())} />,
    },
];

export default function ExpensesPage() {
    const { data, loading } = useApi<{ data: Expense[]; pagination: { total: number } }>("/expenses");
    return (
        <>
            <Header title="Expenses" />
            <main className="p-5 space-y-4">
                <div>
                    <h2 className="text-base font-semibold text-[--foreground]">All Expenses</h2>
                    <p className="text-sm text-[--muted-foreground]">{data?.pagination?.total ?? 0} total records</p>
                </div>
                {loading ? (
                    <div className="card p-10 text-center text-[--muted-foreground] text-sm">Loading…</div>
                ) : (
                    <DataTable data={data?.data ?? []} columns={columns} title="Expenses" exportFilename="expenses" />
                )}
            </main>
        </>
    );
}
