"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/datatable/DataTable";
import { Badge } from "@/components/ui/badge";
import { useExams } from "@/hooks/useExams";
import { Exam } from "@/types/viewModels";
import { formatDate } from "@/lib/utils";

export default function TeacherExamsPage() {
    const { exams, loading } = useExams();

    const columns: ColumnDef<Exam, unknown>[] = [
        { id: "name", accessorKey: "name", header: "Exam" },
        { id: "examType", accessorKey: "examType", header: "Type" },
        { id: "course", header: "Course", accessorFn: (r) => (r.courseId as { name?: string })?.name ?? String(r.courseId) },
        { id: "class", header: "Class", accessorFn: (r) => (r.classRoomId as { name?: string })?.name ?? String(r.classRoomId) },
        { id: "date", header: "Date", accessorFn: (r) => formatDate(r.date) },
        { id: "startTime", accessorKey: "startTime", header: "Start" },
        { id: "endTime", accessorKey: "endTime", header: "End" },
        { id: "totalMarks", accessorKey: "totalMarks", header: "Total" },
        { id: "passingMarks", accessorKey: "passingMarks", header: "Passing" },
        { id: "status", header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge variant={String(getValue()) === "completed" ? "default" : "secondary"}>{String(getValue())}</Badge> },
    ];

    return (
        <>
            <Header title="Exams" userName="Teacher" />
            <main className="p-5 space-y-4">
                <h2 className="text-base font-semibold text-[--foreground]">Exams</h2>
                {loading ? (
                    <div className="card p-10 text-center text-[--muted-foreground] text-sm">Loading…</div>
                ) : (
                    <DataTable data={exams} columns={columns} title="Exams" exportFilename="teacher-exams" />
                )}
            </main>
        </>
    );
}
