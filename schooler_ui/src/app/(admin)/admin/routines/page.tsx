"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/datatable/DataTable";
import { useApi } from "@/hooks/useApi";
import { Routine } from "@/types";

const columns: ColumnDef<Routine, unknown>[] = [
    { id: "class", header: "Class", accessorFn: (r) => (r.class as { name?: string })?.name ?? String(r.class) },
    { id: "subject", accessorKey: "subject", header: "Subject" },
    { id: "teacher", header: "Teacher", accessorFn: (r) => (r.teacher as { firstName?: string; lastName?: string })?.firstName ? `${(r.teacher as { firstName: string; lastName: string }).firstName} ${(r.teacher as { firstName: string; lastName: string }).lastName}` : String(r.teacher) },
    { id: "day", accessorKey: "day", header: "Day" },
    { id: "startTime", accessorKey: "startTime", header: "Start Time" },
    { id: "endTime", accessorKey: "endTime", header: "End Time" },
    { id: "room", accessorKey: "room", header: "Room" },
];

export default function RoutinesPage() {
    const { data, loading } = useApi<{ data: Routine[] }>("/routines");
    return (
        <>
            <Header title="Routines" />
            <main className="p-5 space-y-4">
                <h2 className="text-base font-semibold text-[--foreground]">Class Routines</h2>
                {loading ? (
                    <div className="card p-10 text-center text-[--muted-foreground] text-sm">Loading…</div>
                ) : (
                    <DataTable data={data?.data ?? []} columns={columns} title="Routines" exportFilename="routines" />
                )}
            </main>
        </>
    );
}
