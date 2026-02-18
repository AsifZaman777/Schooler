"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/datatable/DataTable";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/hooks/useApi";
import { Exam } from "@/types";
import { formatDate } from "@/lib/utils";

const columns: ColumnDef<Exam, unknown>[] = [
    { id: "name", accessorKey: "name", header: "Exam Name" },
    { id: "subject", accessorKey: "subject", header: "Subject" },
    { id: "class", header: "Class", accessorFn: (r) => (r.class as { name?: string })?.name ?? String(r.class) },
    { id: "examType", accessorKey: "examType", header: "Type" },
    { id: "date", header: "Date", accessorFn: (r) => formatDate(r.date) },
    { id: "startTime", accessorKey: "startTime", header: "Start Time" },
    { id: "totalMarks", accessorKey: "totalMarks", header: "Total Marks" },
    { id: "passingMarks", accessorKey: "passingMarks", header: "Pass Marks" },
    {
        id: "status",
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => <Badge status={String(getValue())} />,
    },
];

export default function ExamsPage() {
    const { data, loading } = useApi<{ data: Exam[]; pagination: { total: number } }>("/exams");
    return (
        <>
            <Header title="Exams" />
            <main className="p-5 space-y-4">
                <div>
                    <h2 className="text-base font-semibold text-[--foreground]">All Exams</h2>
                    <p className="text-sm text-[--muted-foreground]">{data?.pagination?.total ?? 0} total exams</p>
                </div>
                {loading ? (
                    <div className="card p-10 text-center text-[--muted-foreground] text-sm">Loading…</div>
                ) : (
                    <DataTable data={data?.data ?? []} columns={columns} title="Exams" exportFilename="exams" />
                )}
            </main>
        </>
    );
}
