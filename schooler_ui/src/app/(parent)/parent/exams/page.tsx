"use client";
import { useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/datatable/DataTable";
import { Badge } from "@/components/ui/badge";
import { useExams } from "@/hooks/useExams";
import { useParents } from "@/hooks/useParents";
import { useAuth } from "@/hooks/useAuth";
import { Exam } from "@/types/viewModels";
import { formatDate } from "@/lib/utils";

const statusVariant = (s: string) =>
    s === "completed" ? "default" : s === "ongoing" ? "destructive" : "secondary";

export default function ParentExamsPage() {
    const { referenceId } = useAuth();
    const { fetchChildren } = useParents({}, false);
    const { exams, loading, fetchExamsByClassRooms } = useExams({}, false);

    useEffect(() => {
        if (!referenceId) return;
        fetchChildren(referenceId).then((kids) => {
            if (kids.length === 0) return;
            const classRoomId = typeof kids[0].classRoomId === "string"
                ? kids[0].classRoomId
                : kids[0].classRoomId?._id;
            if (classRoomId) fetchExamsByClassRooms([classRoomId]);
        });
    }, [referenceId, fetchChildren, fetchExamsByClassRooms]);

    const columns: ColumnDef<Exam, unknown>[] = [
        { id: "name", accessorKey: "name", header: "Exam" },
        { id: "examType", accessorKey: "examType", header: "Type" },
        { id: "date", header: "Date", accessorFn: (r) => formatDate(r.date) },
        { id: "startTime", accessorKey: "startTime", header: "Start" },
        { id: "endTime", accessorKey: "endTime", header: "End" },
        { id: "totalMarks", accessorKey: "totalMarks", header: "Total Marks" },
        { id: "passingMarks", accessorKey: "passingMarks", header: "Passing Marks" },
        {
            id: "status", header: "Status", accessorKey: "status",
            cell: ({ getValue }) => <Badge variant={statusVariant(String(getValue()))}>{String(getValue())}</Badge>,
        },
    ];

    return (
        <>
            <Header title="Exams" />
            <main className="p-5 space-y-4">
                <h2 className="text-base font-semibold text-[--foreground]">Upcoming &amp; Past Exams</h2>
                {loading ? (
                    <div className="card p-10 text-center text-[--muted-foreground] text-sm">Loading…</div>
                ) : (
                    <DataTable data={exams} columns={columns} title="Exams" exportFilename="parent-exams" />
                )}
            </main>
        </>
    );
}
