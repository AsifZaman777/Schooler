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
import { useDepartments } from "@/hooks/useDepartments";
import { Department } from "@/types";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/lib/toast";

type TF = { name: string; code: string; description: string; status: string };
const blank: TF = { name: "", code: "", description: "", status: "active" };

export default function DepartmentsPage() {
    const { departments, loading, createDepartment, updateDepartment, deleteDepartment } = useDepartments();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Department | null>(null);
    const [form, setForm] = useState<TF>(blank);
    const [confirm, setConfirm] = useState<Department | null>(null);
    const [busy, setBusy] = useState(false);
    const f = (k: keyof TF, v: string) => setForm(p => ({ ...p, [k]: v }));

    function openAdd() { setEditing(null); setForm(blank); setOpen(true); }
    function openEdit(d: Department) {
        setEditing(d);
        setForm({ name: d.name, code: d.code, description: d.description ?? "", status: d.status });
        setOpen(true);
    }
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); setBusy(true);
        try {
            if (editing) { await updateDepartment(editing._id, form); toast.success("Department updated"); }
            else { await createDepartment(form); toast.success("Department added"); }
            setOpen(false);
        } catch { toast.error("Failed to save"); } finally { setBusy(false); }
    }
    async function handleDelete() {
        if (!confirm) return; setBusy(true);
        try { await deleteDepartment(confirm._id); toast.success("Department deleted"); setConfirm(null); }
        catch { toast.error("Failed to delete"); } finally { setBusy(false); }
    }

    const columns: ColumnDef<Department, unknown>[] = [
        { id: "name", accessorKey: "name", header: "Name" },
        { id: "code", accessorKey: "code", header: "Code" },
        { id: "head", header: "Head", accessorFn: r => (r.headOfDepartment as { firstName?: string; lastName?: string })?.firstName ? `${(r.headOfDepartment as { firstName: string; lastName: string }).firstName} ${(r.headOfDepartment as { firstName: string; lastName: string }).lastName}` : "—" },
        { id: "description", accessorKey: "description", header: "Description" },
        { id: "status", header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge status={String(getValue())} /> },
        { id: "actions", header: "", cell: ({ row: { original: r } }) => (<div className="flex items-center gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Pencil size={13} /></Button><Button variant="ghost" size="icon" className="text-[--danger]" onClick={() => setConfirm(r)}><Trash2 size={13} /></Button></div>) },
    ];

    return (
        <>
            <Header title="Departments" />
            <main className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div><h2 className="text-base font-semibold">All Departments</h2><p className="text-sm text-[--muted-foreground]">{departments.length} total</p></div>
                    <Button onClick={openAdd}><Plus size={15} className="mr-1" />Add Department</Button>
                </div>
                {loading ? <div className="card p-10 text-center text-sm text-[--muted-foreground]">Loading…</div>
                    : <DataTable data={departments} columns={columns} title="Departments" exportFilename="departments" />}
            </main>
            <FormDialog open={open} onClose={() => setOpen(false)} title={editing ? "Edit Department" : "Add Department"}>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div><Label>Name</Label><Input value={form.name} onChange={e => f("name", e.target.value)} required /></div>
                        <div><Label>Code</Label><Input value={form.code} onChange={e => f("code", e.target.value)} required /></div>
                        <div className="col-span-2"><Label>Description</Label><Input value={form.description} onChange={e => f("description", e.target.value)} /></div>
                        <div><Label>Status</Label><Select value={form.status} onChange={e => f("status", e.target.value)} options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]} /></div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" size="sm" type="button" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button size="sm" type="submit" disabled={busy}>{busy ? "Saving…" : editing ? "Update" : "Create"}</Button>
                    </div>
                </form>
            </FormDialog>
            <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={handleDelete} loading={busy}
                message={`Delete department "${confirm?.name}"? This cannot be undone.`} />
        </>
    );
}
