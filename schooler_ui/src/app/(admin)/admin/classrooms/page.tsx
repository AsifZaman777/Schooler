"use client";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/datatable/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormDialog } from "@/components/reusable/FormDialog";
import { ConfirmDialog } from "@/components/reusable/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useClassRooms } from "@/hooks/useClassRooms";
import { ClassRoom } from "@/types";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/lib/toast";

type TF = { name: string; roomNumber: string; capacity: string; academicYear: string; semester: string; status: string };
const blank: TF = { name: "", roomNumber: "", capacity: "", academicYear: "", semester: "", status: "active" };

export default function ClassRoomsPage() {
    const { classRooms, loading, pagination, createClassRoom, updateClassRoom, deleteClassRoom } = useClassRooms();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<ClassRoom | null>(null);
    const [form, setForm] = useState<TF>(blank);
    const [confirm, setConfirm] = useState<ClassRoom | null>(null);
    const [busy, setBusy] = useState(false);
    const f = (k: keyof TF, v: string) => setForm(p => ({ ...p, [k]: v }));

    function openAdd() { setEditing(null); setForm(blank); setOpen(true); }
    function openEdit(c: ClassRoom) {
        setEditing(c);
        setForm({ name: c.name, roomNumber: c.roomNumber, capacity: String(c.capacity), academicYear: c.academicYear, semester: c.semester, status: c.status });
        setOpen(true);
    }
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); setBusy(true);
        try {
            const payload = { ...form, capacity: Number(form.capacity) };
            if (editing) { await updateClassRoom(editing._id, payload); toast.success("Classroom updated"); }
            else { await createClassRoom(payload); toast.success("Classroom added"); }
            setOpen(false);
        } catch { toast.error("Failed to save"); } finally { setBusy(false); }
    }
    async function handleDelete() {
        if (!confirm) return; setBusy(true);
        try { await deleteClassRoom(confirm._id); toast.success("Classroom deleted"); setConfirm(null); }
        catch { toast.error("Failed to delete"); } finally { setBusy(false); }
    }

    const columns: ColumnDef<ClassRoom, unknown>[] = [
        { id: "name", accessorKey: "name", header: "Class Name" },
        { id: "roomNumber", accessorKey: "roomNumber", header: "Room No." },
        { id: "course", header: "Course", accessorFn: r => (r.courseId as { name?: string })?.name ?? "—" },
        { id: "department", header: "Department", accessorFn: r => (r.departmentId as { name?: string })?.name ?? "—" },
        { id: "capacity", accessorKey: "capacity", header: "Capacity" },
        { id: "enrolled", accessorKey: "currentEnrollment", header: "Enrolled" },
        { id: "academicYear", accessorKey: "academicYear", header: "Academic Year" },
        { id: "semester", accessorKey: "semester", header: "Semester" },
        { id: "status", header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge variant={String(getValue()) === "active" ? "default" : String(getValue()) === "completed" ? "secondary" : "secondary"}>{String(getValue())}</Badge> },
        { id: "actions", header: "", cell: ({ row: { original: r } }) => (<div className="flex items-center gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Pencil size={13} /></Button><Button variant="ghost" size="icon" className="text-[--danger]" onClick={() => setConfirm(r)}><Trash2 size={13} /></Button></div>) },
    ];

    return (
        <>
            <Header title="Classrooms" />
            <main className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div><h2 className="text-base font-semibold">All Classrooms</h2><p className="text-sm text-[--muted-foreground]">{pagination?.totalItems ?? 0} total</p></div>
                    <Button onClick={openAdd}><Plus size={15} className="mr-1" />Add Classroom</Button>
                </div>
                {loading ? <div className="card p-10 text-center text-sm text-[--muted-foreground]">Loading…</div>
                    : <DataTable data={classRooms} columns={columns} title="Classrooms" exportFilename="classrooms" />}
            </main>
            <FormDialog open={open} onClose={() => setOpen(false)} title={editing ? "Edit Classroom" : "Add Classroom"}>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div><Label>Class Name</Label><Input value={form.name} onChange={e => f("name", e.target.value)} required /></div>
                        <div><Label>Room Number</Label><Input value={form.roomNumber} onChange={e => f("roomNumber", e.target.value)} /></div>
                        <div><Label>Capacity</Label><Input type="number" value={form.capacity} onChange={e => f("capacity", e.target.value)} /></div>
                        <div><Label>Academic Year</Label><Input value={form.academicYear} placeholder="2024-25" onChange={e => f("academicYear", e.target.value)} /></div>
                        <div><Label>Semester</Label><Input value={form.semester} placeholder="Spring" onChange={e => f("semester", e.target.value)} /></div>
                        <div><Label>Status</Label><Select value={form.status} onChange={e => f("status", e.target.value)} options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }, { value: "completed", label: "Completed" }]} /></div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" size="sm" type="button" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button size="sm" type="submit" disabled={busy}>{busy ? "Saving…" : editing ? "Update" : "Create"}</Button>
                    </div>
                </form>
            </FormDialog>
            <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={handleDelete} loading={busy}
                message={`Delete classroom "${confirm?.name}"? This cannot be undone.`} />
        </>
    );
}
