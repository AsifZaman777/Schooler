"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/datatable/DataTable";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/hooks/useApi";
import { Exam } from "@/types";
import { formatDate } from "@/lib/utils";

const columns: ColumnDef<Exam, unknown>[] = [
    { id: "name", accessorKey: "name", header: "Exam" },
    { id: "subject", accessorKey: "subject", header: "Subject" },
    { id: "examType", accessorKey: "examType", header: "Type" },
    { id: "date", header: "Date", accessorFn: (r) => formatDate(r.date) },
    { id: "totalMarks", accessorKey: "totalMarks", header: "Total Marks" },
    { id: "status", header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge status={String(getValue())} /> },
];

export default function TeacherExamsPage() {
    const { data, loading } = useApi<{ data: Exam[] }>("/exams");
    return (
        <>
            <Header title="Exams" userName="Teacher" />
            <main className="p-5 space-y-4">
                <h2 className="text-base font-semibold text-[--foreground]">Exams</h2>
                {loading ? (
                    <div className="card p-10 text-center text-[--muted-foreground] text-sm">Loading…</div>
                ) : (
                    <DataTable data={data?.data ?? []} columns={columns} title="Exams" exportFilename="teacher-exams" />
                )}
            </main>
        </>
    );
}
