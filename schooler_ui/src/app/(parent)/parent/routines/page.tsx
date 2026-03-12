"use client";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/datatable/DataTable";
import { Badge } from "@/components/ui/badge";
import { useRoutines } from "@/hooks/useRoutines";
import { useParents } from "@/hooks/useParents";
import { useAuth } from "@/hooks/useAuth";
import { Routine } from "@/types/viewModels";

export default function ParentRoutinesPage() {
    const { referenceId } = useAuth();
    const { fetchChildren } = useParents({}, false);
    const { fetchRoutinesByClassRoom } = useRoutines();
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!referenceId) return;
        setLoading(true);
        fetchChildren(referenceId)
            .then((kids) => {
                if (kids.length === 0) return;
                const classRoomId = typeof kids[0].classRoomId === "string"
                    ? kids[0].classRoomId
                    : kids[0].classRoomId?._id;
                if (!classRoomId) return;
                return fetchRoutinesByClassRoom(classRoomId);
            })
            .then((grouped) => {
                if (grouped) setRoutines(Object.values(grouped).flat());
            })
            .finally(() => setLoading(false));
    }, [referenceId, fetchChildren, fetchRoutinesByClassRoom]);

    const columns: ColumnDef<Routine, unknown>[] = [
        { id: "dayOfWeek", accessorKey: "dayOfWeek", header: "Day" },
        { id: "subject", accessorKey: "subject", header: "Subject" },
        { id: "startTime", accessorKey: "startTime", header: "Start" },
        { id: "endTime", accessorKey: "endTime", header: "End" },
        { id: "roomNumber", accessorKey: "roomNumber", header: "Room" },
        {
            id: "teacher", header: "Teacher",
            accessorFn: (r) => {
                const t = r.teacherId as { firstName?: string; lastName?: string };
                return t?.firstName ? `${t.firstName} ${t.lastName ?? ""}`.trim() : String(r.teacherId);
            },
        },
        {
            id: "status", header: "Status", accessorKey: "status",
            cell: ({ getValue }) => <Badge variant={String(getValue()) === "active" ? "default" : "secondary"}>{String(getValue())}</Badge>,
        },
    ];

    return (
        <>
            <Header title="My Routines" />
            <main className="p-5 space-y-4">
                <h2 className="text-base font-semibold text-[--foreground]">Class Schedule</h2>
                {loading ? (
                    <div className="card p-10 text-center text-[--muted-foreground] text-sm">Loading…</div>
                ) : (
                    <DataTable data={routines} columns={columns} title="Routines" exportFilename="parent-routines" />
                )}
            </main>
        </>
    );
}
