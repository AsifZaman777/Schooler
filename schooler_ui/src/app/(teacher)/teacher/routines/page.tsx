"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/datatable/DataTable";
import { Badge } from "@/components/ui/badge";
import { useRoutines } from "@/hooks/useRoutines";
import { Routine } from "@/types/viewModels";

export default function TeacherRoutinesPage() {
    const { routines, loading } = useRoutines();

    const columns: ColumnDef<Routine, unknown>[] = [
        { id: "subject", accessorKey: "subject", header: "Subject" },
        { id: "class", header: "Class", accessorFn: (r) => (r.classRoomId as { name?: string })?.name ?? String(r.classRoomId) },
        { id: "dayOfWeek", accessorKey: "dayOfWeek", header: "Day" },
        { id: "startTime", accessorKey: "startTime", header: "Start" },
        { id: "endTime", accessorKey: "endTime", header: "End" },
        { id: "roomNumber", accessorKey: "roomNumber", header: "Room" },
        { id: "status", header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge variant={String(getValue()) === "active" ? "default" : "secondary"}>{String(getValue())}</Badge> },
    ];

    return (
        <>
            <Header title="My Routines" userName="Teacher" />
            <main className="p-5 space-y-4">
                <h2 className="text-base font-semibold text-[--foreground]">My Class Routines</h2>
                {loading ? (
                    <div className="card p-10 text-center text-[--muted-foreground] text-sm">Loading…</div>
                ) : (
                    <DataTable data={routines} columns={columns} title="My Routines" exportFilename="teacher-routines" />
                )}
            </main>
        </>
    );
}
