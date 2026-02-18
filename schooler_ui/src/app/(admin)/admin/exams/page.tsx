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
import { useExams } from "@/hooks/useExams";
import { Exam } from "@/types";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/lib/toast";
import { formatDate } from "@/lib/utils";

type TF = { name: string; examType: string; courseId: string; classRoomId: string; date: string; startTime: string; endTime: string; totalMarks: string; passingMarks: string; instructions: string; status: string };
const blank: TF = { name: "", examType: "midterm", courseId: "", classRoomId: "", date: "", startTime: "", endTime: "", totalMarks: "", passingMarks: "", instructions: "", status: "scheduled" };

export default function ExamsPage() {
    const { exams, loading, pagination, createExam, updateExam, deleteExam } = useExams();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Exam | null>(null);
    const [form, setForm] = useState<TF>(blank);
    const [confirm, setConfirm] = useState<Exam | null>(null);
    const [busy, setBusy] = useState(false);
    const f = (k: keyof TF, v: string) => setForm(p => ({ ...p, [k]: v }));

    function openAdd() { setEditing(null); setForm(blank); setOpen(true); }
    function openEdit(ex: Exam) {
        setEditing(ex);
        setForm({
            name: ex.name, examType: ex.examType,
            courseId: String(typeof ex.courseId === "object" ? (ex.courseId as { _id: string })._id : ex.courseId),
            classRoomId: String(typeof ex.classRoomId === "object" ? (ex.classRoomId as { _id: string })._id : ex.classRoomId),
            date: ex.date?.slice(0, 10) ?? "", startTime: ex.startTime, endTime: ex.endTime,
            totalMarks: String(ex.totalMarks), passingMarks: String(ex.passingMarks),
            instructions: ex.instructions ?? "", status: ex.status
        });
        setOpen(true);
    }
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); setBusy(true);
        try {
            const payload = { ...form, totalMarks: Number(form.totalMarks), passingMarks: Number(form.passingMarks) };
            if (editing) { await updateExam(editing._id, payload); toast.success("Exam updated"); }
            else { await createExam(payload); toast.success("Exam added"); }
            setOpen(false);
        } catch { toast.error("Failed to save"); } finally { setBusy(false); }
    }
    async function handleDelete() {
        if (!confirm) return; setBusy(true);
        try { await deleteExam(confirm._id); toast.success("Exam deleted"); setConfirm(null); }
        catch { toast.error("Failed to delete"); } finally { setBusy(false); }
    }

    const columns: ColumnDef<Exam, unknown>[] = [
        { id: "name", accessorKey: "name", header: "Exam Name" },
        { id: "examType", accessorKey: "examType", header: "Type" },
        { id: "class", header: "Classroom", accessorFn: r => { const c = r.classRoomId; return typeof c === "object" ? (c as { name: string }).name : String(c); } },
        { id: "date", header: "Date", accessorFn: r => formatDate(r.date) },
        { id: "startTime", accessorKey: "startTime", header: "Start" },
        { id: "totalMarks", accessorKey: "totalMarks", header: "Total Marks" },
        { id: "passingMarks", accessorKey: "passingMarks", header: "Pass Marks" },
        { id: "status", header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge status={String(getValue())} /> },
        { id: "actions", header: "", cell: ({ row: { original: r } }) => (<div className="flex items-center gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Pencil size={13} /></Button><Button variant="ghost" size="icon" className="text-[--danger]" onClick={() => setConfirm(r)}><Trash2 size={13} /></Button></div>) },
    ];

    return (
        <>
            <Header title="Exams" />
            <main className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div><h2 className="text-base font-semibold">All Exams</h2><p className="text-sm text-[--muted-foreground]">{pagination?.totalItems ?? 0} total</p></div>
                    <Button onClick={openAdd}><Plus size={15} className="mr-1" />Add Exam</Button>
                </div>
                {loading ? <div className="card p-10 text-center text-sm text-[--muted-foreground]">Loading…</div>
                    : <DataTable data={exams} columns={columns} title="Exams" exportFilename="exams" />}
            </main>
            <FormDialog open={open} onClose={() => setOpen(false)} title={editing ? "Edit Exam" : "Add Exam"}>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div><Label>Exam Name</Label><Input value={form.name} onChange={e => f("name", e.target.value)} required /></div>
                        <div><Label>Type</Label><Select value={form.examType} onChange={e => f("examType", e.target.value)} options={[{ value: "midterm", label: "Midterm" }, { value: "final", label: "Final" }, { value: "quiz", label: "Quiz" }, { value: "assignment", label: "Assignment" }, { value: "practical", label: "Practical" }]} /></div>
                        <div><Label>Course ID</Label><Input value={form.courseId} onChange={e => f("courseId", e.target.value)} required /></div>
                        <div><Label>Classroom ID</Label><Input value={form.classRoomId} onChange={e => f("classRoomId", e.target.value)} required /></div>
                        <div><Label>Date</Label><Input type="date" value={form.date} onChange={e => f("date", e.target.value)} /></div>
                        <div><Label>Start Time</Label><Input type="time" value={form.startTime} onChange={e => f("startTime", e.target.value)} /></div>
                        <div><Label>End Time</Label><Input type="time" value={form.endTime} onChange={e => f("endTime", e.target.value)} /></div>
                        <div><Label>Total Marks</Label><Input type="number" value={form.totalMarks} onChange={e => f("totalMarks", e.target.value)} /></div>
                        <div><Label>Passing Marks</Label><Input type="number" value={form.passingMarks} onChange={e => f("passingMarks", e.target.value)} /></div>
                        <div><Label>Status</Label><Select value={form.status} onChange={e => f("status", e.target.value)} options={[{ value: "scheduled", label: "Scheduled" }, { value: "ongoing", label: "Ongoing" }, { value: "completed", label: "Completed" }, { value: "cancelled", label: "Cancelled" }]} /></div>
                        <div className="col-span-2"><Label>Instructions</Label><Input value={form.instructions} onChange={e => f("instructions", e.target.value)} /></div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" size="sm" type="button" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button size="sm" type="submit" disabled={busy}>{busy ? "Saving…" : editing ? "Update" : "Create"}</Button>
                    </div>
                </form>
            </FormDialog>
            <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={handleDelete} loading={busy}
                message={`Delete exam "${confirm?.name}"? This cannot be undone.`} />
        </>
    );
}
