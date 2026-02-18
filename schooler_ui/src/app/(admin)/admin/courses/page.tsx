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
import { useCourses } from "@/hooks/useCourses";
import { Course } from "@/types";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/lib/toast";

type TF = { name: string; code: string; description: string; credits: string; duration: string; status: string };
const blank: TF = { name: "", code: "", description: "", credits: "", duration: "", status: "active" };

export default function CoursesPage() {
    const { courses, loading, pagination, createCourse, updateCourse, deleteCourse } = useCourses();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Course | null>(null);
    const [form, setForm] = useState<TF>(blank);
    const [confirm, setConfirm] = useState<Course | null>(null);
    const [busy, setBusy] = useState(false);
    const f = (k: keyof TF, v: string) => setForm(p => ({ ...p, [k]: v }));

    function openAdd() { setEditing(null); setForm(blank); setOpen(true); }
    function openEdit(c: Course) {
        setEditing(c);
        setForm({ name: c.name, code: c.code, description: c.description ?? "", credits: String(c.credits ?? ""), duration: String(c.duration ?? ""), status: c.status });
        setOpen(true);
    }
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); setBusy(true);
        try {
            const payload = { ...form, credits: Number(form.credits), duration: Number(form.duration) };
            if (editing) { await updateCourse(editing._id, payload); toast.success("Course updated"); }
            else { await createCourse(payload); toast.success("Course added"); }
            setOpen(false);
        } catch { toast.error("Failed to save"); } finally { setBusy(false); }
    }
    async function handleDelete() {
        if (!confirm) return; setBusy(true);
        try { await deleteCourse(confirm._id); toast.success("Course deleted"); setConfirm(null); }
        catch { toast.error("Failed to delete"); } finally { setBusy(false); }
    }

    const columns: ColumnDef<Course, unknown>[] = [
        { id: "name", accessorKey: "name", header: "Course Name" },
        { id: "code", accessorKey: "code", header: "Code" },
        { id: "department", header: "Department", accessorFn: r => (r.departmentId as { name?: string })?.name ?? String(r.departmentId) },
        { id: "credits", accessorKey: "credits", header: "Credits" },
        { id: "duration", accessorKey: "duration", header: "Duration" },
        { id: "status", header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge variant={String(getValue()) === "active" ? "default" : "secondary"}>{String(getValue())}</Badge> },
        { id: "actions", header: "", cell: ({ row: { original: r } }) => (<div className="flex items-center gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Pencil size={13} /></Button><Button variant="ghost" size="icon" className="text-[--danger]" onClick={() => setConfirm(r)}><Trash2 size={13} /></Button></div>) },
    ];

    return (
        <>
            <Header title="Courses" />
            <main className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div><h2 className="text-base font-semibold">All Courses</h2><p className="text-sm text-[--muted-foreground]">{pagination?.totalItems ?? 0} total</p></div>
                    <Button onClick={openAdd}><Plus size={15} className="mr-1" />Add Course</Button>
                </div>
                {loading ? <div className="card p-10 text-center text-sm text-[--muted-foreground]">Loading…</div>
                    : <DataTable data={courses} columns={columns} title="Courses" exportFilename="courses" />}
            </main>
            <FormDialog open={open} onClose={() => setOpen(false)} title={editing ? "Edit Course" : "Add Course"}>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div><Label>Course Name</Label><Input value={form.name} onChange={e => f("name", e.target.value)} required /></div>
                        <div><Label>Code</Label><Input value={form.code} onChange={e => f("code", e.target.value)} required /></div>
                        <div className="col-span-2"><Label>Description</Label><Input value={form.description} onChange={e => f("description", e.target.value)} /></div>
                        <div><Label>Credits</Label><Input type="number" value={form.credits} onChange={e => f("credits", e.target.value)} /></div>
                        <div><Label>Duration (months)</Label><Input type="number" value={form.duration} onChange={e => f("duration", e.target.value)} /></div>
                        <div><Label>Status</Label><Select value={form.status} onChange={e => f("status", e.target.value)} options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]} /></div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" size="sm" type="button" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button size="sm" type="submit" disabled={busy}>{busy ? "Saving…" : editing ? "Update" : "Create"}</Button>
                    </div>
                </form>
            </FormDialog>
            <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={handleDelete} loading={busy}
                message={`Delete course "${confirm?.name}"? This cannot be undone.`} />
        </>
    );
}
