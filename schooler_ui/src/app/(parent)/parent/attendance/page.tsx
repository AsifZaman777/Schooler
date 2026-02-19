"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/datatable/DataTable";
import { Badge } from "@/components/ui/badge";
import { useAttendance } from "@/hooks/useAttendance";
import { Attendance } from "@/types/viewModels";
import { formatDate } from "@/lib/utils";

export default function ParentAttendancePage() {
    const { attendances, loading } = useAttendance();

    const columns: ColumnDef<Attendance, unknown>[] = [
        { id: "student", header: "Student", accessorFn: (r) => { const s = r.studentId as { firstName?: string; lastName?: string }; return s?.firstName ? `${s.firstName} ${s.lastName ?? ""}`.trim() : String(r.studentId); } },
        { id: "class", header: "Class", accessorFn: (r) => (r.classRoomId as { name?: string })?.name ?? String(r.classRoomId) },
        { id: "date", header: "Date", accessorFn: (r) => formatDate(r.date) },
        { id: "status", header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge variant={String(getValue()) === "present" ? "default" : "destructive"}>{String(getValue())}</Badge> },
        { id: "remarks", accessorKey: "remarks", header: "Remarks" },
    ];

    return (
        <>
            <Header title="Child Attendance" userName="Parent" />
            <main className="p-5 space-y-4">
                <h2 className="text-base font-semibold text-[--foreground]">Attendance Records</h2>
                {loading ? (
                    <div className="card p-10 text-center text-[--muted-foreground] text-sm">Loading…</div>
                ) : (
                    <DataTable data={attendances} columns={columns} title="Attendance" exportFilename="parent-attendance" />
                )}
            </main>
        </>
    );
}
