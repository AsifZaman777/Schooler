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
import { useAttendance } from "@/hooks/useAttendance";
import { Attendance } from "@/types";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/lib/toast";
import { formatDate } from "@/lib/utils";

type TF = { studentId: string; classRoomId: string; date: string; status: string; remarks: string };
const blank: TF = { studentId: "", classRoomId: "", date: "", status: "present", remarks: "" };

export default function AttendancePage() {
    const { attendances, loading, pagination, createAttendance, updateAttendance, deleteAttendance } = useAttendance();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Attendance | null>(null);
    const [form, setForm] = useState<TF>(blank);
    const [confirm, setConfirm] = useState<Attendance | null>(null);
    const [busy, setBusy] = useState(false);
    const f = (k: keyof TF, v: string) => setForm(p => ({ ...p, [k]: v }));

    function openAdd() { setEditing(null); setForm(blank); setOpen(true); }
    function openEdit(a: Attendance) {
        setEditing(a);
        setForm({
            studentId: String(typeof a.studentId === "object" ? (a.studentId as { _id: string })._id : a.studentId),
            classRoomId: String(typeof a.classRoomId === "object" ? (a.classRoomId as { _id: string })._id : a.classRoomId),
            date: a.date?.slice(0, 10) ?? "", status: a.status, remarks: a.remarks ?? ""
        });
        setOpen(true);
    }
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); setBusy(true);
        try {
            if (editing) { await updateAttendance(editing._id, form); toast.success("Record updated"); }
            else { await createAttendance(form); toast.success("Record added"); }
            setOpen(false);
        } catch { toast.error("Failed to save"); } finally { setBusy(false); }
    }
    async function handleDelete() {
        if (!confirm) return; setBusy(true);
        try { await deleteAttendance(confirm._id); toast.success("Record deleted"); setConfirm(null); }
        catch { toast.error("Failed to delete"); } finally { setBusy(false); }
    }

    const columns: ColumnDef<Attendance, unknown>[] = [
        { id: "student", header: "Student", accessorFn: r => { const s = r.studentId; return typeof s === "object" ? `${(s as { firstName: string; lastName: string }).firstName} ${(s as { firstName: string; lastName: string }).lastName}` : String(s); } },
        { id: "class", header: "Classroom", accessorFn: r => { const c = r.classRoomId; return typeof c === "object" ? (c as { name: string }).name : String(c); } },
        { id: "date", header: "Date", accessorFn: r => formatDate(r.date) },
        { id: "status", header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge status={String(getValue())} /> },
        { id: "remarks", accessorKey: "remarks", header: "Remarks" },
        { id: "actions", header: "", cell: ({ row: { original: r } }) => (<div className="flex items-center gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Pencil size={13} /></Button><Button variant="ghost" size="icon" className="text-[--danger]" onClick={() => setConfirm(r)}><Trash2 size={13} /></Button></div>) },
    ];

    return (
        <>
            <Header title="Attendance" />
            <main className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div><h2 className="text-base font-semibold">Attendance Records</h2><p className="text-sm text-[--muted-foreground]">{pagination?.totalItems ?? 0} total</p></div>
                    <Button onClick={openAdd}><Plus size={15} className="mr-1" />Mark Attendance</Button>
                </div>
                {loading ? <div className="card p-10 text-center text-sm text-[--muted-foreground]">Loading…</div>
                    : <DataTable data={attendances} columns={columns} title="Attendance" exportFilename="attendance" />}
            </main>
            <FormDialog open={open} onClose={() => setOpen(false)} title={editing ? "Edit Attendance" : "Mark Attendance"}>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div><Label>Student ID</Label><Input value={form.studentId} onChange={e => f("studentId", e.target.value)} required /></div>
                        <div><Label>Classroom ID</Label><Input value={form.classRoomId} onChange={e => f("classRoomId", e.target.value)} required /></div>
                        <div><Label>Date</Label><Input type="date" value={form.date} onChange={e => f("date", e.target.value)} required /></div>
                        <div><Label>Status</Label><Select value={form.status} onChange={e => f("status", e.target.value)} options={[{ value: "present", label: "Present" }, { value: "absent", label: "Absent" }, { value: "late", label: "Late" }, { value: "excused", label: "Excused" }]} /></div>
                        <div className="col-span-2"><Label>Remarks</Label><Input value={form.remarks} onChange={e => f("remarks", e.target.value)} /></div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" size="sm" type="button" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button size="sm" type="submit" disabled={busy}>{busy ? "Saving…" : editing ? "Update" : "Save"}</Button>
                    </div>
                </form>
            </FormDialog>
            <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={handleDelete} loading={busy}
                message="Delete this attendance record? This cannot be undone." />
        </>
    );
}
