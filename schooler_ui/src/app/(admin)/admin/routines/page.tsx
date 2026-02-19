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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRoutines } from "@/hooks/useRoutines";
import { Routine } from "@/types/viewModels";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/lib/toast";

const DAY_OPTIONS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map(d => ({ value: d, label: d.charAt(0).toUpperCase() + d.slice(1) }));

type TF = { classRoomId: string; teacherId: string; subject: string; dayOfWeek: string; startTime: string; endTime: string; roomNumber: string; status: string };
const blank: TF = { classRoomId: "", teacherId: "", subject: "", dayOfWeek: "monday", startTime: "", endTime: "", roomNumber: "", status: "active" };

const basicFields: { key: keyof TF; label: string; type: string; required: boolean }[] = [
    { key: "classRoomId", label: "Classroom ID", type: "text", required: true },
    { key: "teacherId", label: "Teacher ID", type: "text", required: true },
    { key: "subject", label: "Subject", type: "text", required: true },
];

const timeFields: { key: keyof TF; label: string; type: string; required: boolean }[] = [
    { key: "startTime", label: "Start Time", type: "time", required: false },
    { key: "endTime", label: "End Time", type: "time", required: false },
    { key: "roomNumber", label: "Room Number", type: "text", required: false },
];

const statusOptions = [{ value: "active", label: "Active" }, { value: "cancelled", label: "Cancelled" }, { value: "rescheduled", label: "Rescheduled" }];

export default function RoutinesPage() {
    const { routines, loading, createRoutine, updateRoutine, deleteRoutine } = useRoutines();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Routine | null>(null);
    const [form, setForm] = useState<TF>(blank);
    const [confirm, setConfirm] = useState<Routine | null>(null);
    const [busy, setBusy] = useState(false);
    const f = (k: keyof TF, v: string) => setForm(p => ({ ...p, [k]: v }));

    function openAdd() { setEditing(null); setForm(blank); setOpen(true); }
    function openEdit(r: Routine) {
        setEditing(r);
        setForm({
            classRoomId: String(typeof r.classRoomId === "object" ? (r.classRoomId as { _id: string })._id : r.classRoomId),
            teacherId: String(typeof r.teacherId === "object" ? (r.teacherId as { _id: string })._id : r.teacherId),
            subject: r.subject, dayOfWeek: r.dayOfWeek, startTime: r.startTime, endTime: r.endTime,
            roomNumber: r.roomNumber, status: r.status
        });
        setOpen(true);
    }
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); setBusy(true);
        try {
            const payload = { ...form, status: form.status as "active" | "cancelled" | "rescheduled" };
            if (editing) { await updateRoutine(editing._id, payload); toast.success("Routine updated"); }
            else { await createRoutine(payload); toast.success("Routine added"); }
            setOpen(false);
        } catch { toast.error("Failed to save"); } finally { setBusy(false); }
    }
    async function handleDelete() {
        if (!confirm) return; setBusy(true);
        try { await deleteRoutine(confirm._id); toast.success("Routine deleted"); setConfirm(null); }
        catch { toast.error("Failed to delete"); } finally { setBusy(false); }
    }

    const columns: ColumnDef<Routine, unknown>[] = [
        { id: "subject", accessorKey: "subject", header: "Subject" },
        { id: "class", header: "Classroom", accessorFn: r => { const c = r.classRoomId; return typeof c === "object" ? (c as { name: string }).name : String(c); } },
        { id: "teacher", header: "Teacher", accessorFn: r => { const t = r.teacherId; return typeof t === "object" ? `${(t as { firstName: string; lastName: string }).firstName} ${(t as { firstName: string; lastName: string }).lastName}` : String(t); } },
        { id: "dayOfWeek", accessorKey: "dayOfWeek", header: "Day" },
        { id: "startTime", accessorKey: "startTime", header: "Start" },
        { id: "endTime", accessorKey: "endTime", header: "End" },
        { id: "roomNumber", accessorKey: "roomNumber", header: "Room" },
        { id: "status", header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge variant={String(getValue()) === "active" ? "default" : "secondary"}>{String(getValue())}</Badge> },
        { id: "actions", header: "", cell: ({ row: { original: r } }) => (<div className="flex items-center gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Pencil size={13} /></Button><Button variant="ghost" size="icon" className="text-[--danger]" onClick={() => setConfirm(r)}><Trash2 size={13} /></Button></div>) },
    ];

    return (
        <>
            <Header title="Routines" />
            <main className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div><h2 className="text-base font-semibold">Class Routines</h2><p className="text-sm text-[--muted-foreground]">{routines.length} entries</p></div>
                    <Button onClick={openAdd}><Plus size={15} className="mr-1" />Add Routine</Button>
                </div>
                {loading ? <div className="card p-10 text-center text-sm text-[--muted-foreground]">Loading…</div>
                    : <DataTable data={routines} columns={columns} title="Routines" exportFilename="routines" />}
            </main>
            <FormDialog open={open} onClose={() => setOpen(false)} title={editing ? "Edit Routine" : "Add Routine"}>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        {basicFields.map(field => (
                            <div key={field.key}>
                                <Label>{field.label}{field.required && " *"}</Label>
                                <Input type={field.type} value={form[field.key] as string} onChange={e => f(field.key, e.target.value)} required={field.required} />
                            </div>
                        ))}
                        <div>
                            <Label>Day</Label>
                            <Select value={form.dayOfWeek} onValueChange={v => f("dayOfWeek", v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{DAY_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        {timeFields.map(field => (
                            <div key={field.key}>
                                <Label>{field.label}</Label>
                                <Input type={field.type} value={form[field.key] as string} onChange={e => f(field.key, e.target.value)} />
                            </div>
                        ))}
                        <div>
                            <Label>Status</Label>
                            <Select value={form.status} onValueChange={v => f("status", v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{statusOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" size="sm" type="button" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button size="sm" type="submit" disabled={busy}>{busy ? "Saving…" : editing ? "Update" : "Create"}</Button>
                    </div>
                </form>
            </FormDialog>
            <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={handleDelete} loading={busy}
                message="Delete this routine entry? This cannot be undone." />
        </>
    );
}
