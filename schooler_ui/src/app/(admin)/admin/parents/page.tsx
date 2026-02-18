"use client";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/datatable/DataTable";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { FormDialog } from "@/components/reusable/FormDialog";
import { ConfirmDialog } from "@/components/reusable/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useParents } from "@/hooks/useParents";
import { Parent } from "@/types";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/lib/toast";

type TF = { firstName: string; lastName: string; email: string; phone: string; occupation: string; relationship: string };
const blank: TF = { firstName: "", lastName: "", email: "", phone: "", occupation: "", relationship: "father" };

export default function ParentsPage() {
    const { parents, loading, pagination, createParent, updateParent, deleteParent } = useParents();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Parent | null>(null);
    const [form, setForm] = useState<TF>(blank);
    const [confirm, setConfirm] = useState<Parent | null>(null);
    const [busy, setBusy] = useState(false);
    const f = (k: keyof TF, v: string) => setForm(p => ({ ...p, [k]: v }));

    function openAdd() { setEditing(null); setForm(blank); setOpen(true); }
    function openEdit(p: Parent) {
        setEditing(p);
        setForm({ firstName: p.firstName, lastName: p.lastName, email: p.email, phone: p.phone, occupation: p.occupation ?? "", relationship: p.relationship });
        setOpen(true);
    }
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); setBusy(true);
        try {
            if (editing) { await updateParent(editing._id, form); toast.success("Parent updated"); }
            else { await createParent(form); toast.success("Parent added"); }
            setOpen(false);
        } catch { toast.error("Failed to save"); } finally { setBusy(false); }
    }
    async function handleDelete() {
        if (!confirm) return; setBusy(true);
        try { await deleteParent(confirm._id); toast.success("Parent deleted"); setConfirm(null); }
        catch { toast.error("Failed to delete"); } finally { setBusy(false); }
    }

    const columns: ColumnDef<Parent, unknown>[] = [
        {
            id: "name", header: "Parent", accessorFn: r => `${r.firstName} ${r.lastName}`,
            cell: ({ row: { original: r } }) => (<div className="flex items-center gap-2"><Avatar name={`${r.firstName} ${r.lastName}`} size="sm" /><div><p className="font-medium text-sm">{r.firstName} {r.lastName}</p><p className="text-xs text-[--muted-foreground]">{r.email}</p></div></div>)
        },
        { id: "phone", accessorKey: "phone", header: "Phone" },
        { id: "relationship", accessorKey: "relationship", header: "Relationship" },
        { id: "occupation", accessorKey: "occupation", header: "Occupation" },
        { id: "actions", header: "", cell: ({ row: { original: r } }) => (<div className="flex items-center gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Pencil size={13} /></Button><Button variant="ghost" size="icon" className="text-[--danger]" onClick={() => setConfirm(r)}><Trash2 size={13} /></Button></div>) },
    ];

    return (
        <>
            <Header title="Parents" />
            <main className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div><h2 className="text-base font-semibold">All Parents</h2><p className="text-sm text-[--muted-foreground]">{pagination?.totalItems ?? 0} total</p></div>
                    <Button onClick={openAdd}><Plus size={15} className="mr-1" />Add Parent</Button>
                </div>
                {loading ? <div className="card p-10 text-center text-sm text-[--muted-foreground]">Loading…</div>
                    : <DataTable data={parents} columns={columns} title="Parents" exportFilename="parents" />}
            </main>
            <FormDialog open={open} onClose={() => setOpen(false)} title={editing ? "Edit Parent" : "Add Parent"}>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div><Label>First Name</Label><Input value={form.firstName} onChange={e => f("firstName", e.target.value)} required /></div>
                        <div><Label>Last Name</Label><Input value={form.lastName} onChange={e => f("lastName", e.target.value)} required /></div>
                        <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => f("email", e.target.value)} required /></div>
                        <div><Label>Phone</Label><Input value={form.phone} onChange={e => f("phone", e.target.value)} /></div>
                        <div><Label>Occupation</Label><Input value={form.occupation} onChange={e => f("occupation", e.target.value)} /></div>
                        <div><Label>Relationship</Label><Select value={form.relationship} onChange={e => f("relationship", e.target.value)} options={[{ value: "father", label: "Father" }, { value: "mother", label: "Mother" }, { value: "guardian", label: "Guardian" }]} /></div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" size="sm" type="button" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button size="sm" type="submit" disabled={busy}>{busy ? "Saving…" : editing ? "Update" : "Create"}</Button>
                    </div>
                </form>
            </FormDialog>
            <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={handleDelete} loading={busy}
                message={`Delete ${confirm?.firstName} ${confirm?.lastName}? This cannot be undone.`} />
        </>
    );
}
