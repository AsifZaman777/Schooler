"use client";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/datatable/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useTeachers } from "@/hooks/useTeachers";
import { Teacher } from "@/types";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/toast";

type TF = {
    firstName: string; lastName: string; email: string; phone: string; dateOfBirth: string; gender: string;
    qualification: string; specialization: string; experience: string; joiningDate: string; salary: string; status: string;
    street: string; city: string; state: string; zipCode: string; country: string;
    emergencyName: string; emergencyRelationship: string; emergencyPhone: string;
};
const blank: TF = {
    firstName: "", lastName: "", email: "", phone: "", dateOfBirth: "", gender: "male",
    qualification: "", specialization: "", experience: "", joiningDate: "", salary: "", status: "active",
    street: "", city: "", state: "", zipCode: "", country: "",
    emergencyName: "", emergencyRelationship: "", emergencyPhone: ""
};

export default function TeachersPage() {
    const { teachers, loading, pagination, createTeacher, updateTeacher, deleteTeacher } = useTeachers();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Teacher | null>(null);
    const [form, setForm] = useState<TF>(blank);
    const [confirm, setConfirm] = useState<Teacher | null>(null);
    const [busy, setBusy] = useState(false);
    const f = (k: keyof TF, v: string) => setForm(p => ({ ...p, [k]: v }));

    function openAdd() { setEditing(null); setForm(blank); setOpen(true); }
    function openEdit(t: Teacher) {
        setEditing(t);
        setForm({
            firstName: t.firstName, lastName: t.lastName, email: t.email, phone: t.phone,
            dateOfBirth: t.dateOfBirth?.slice(0, 10) ?? "", gender: t.gender,
            qualification: t.qualification, specialization: (t.specialization ?? []).join(", "),
            experience: String(t.experience ?? ""), joiningDate: t.joiningDate?.slice(0, 10) ?? "",
            salary: String(t.salary ?? ""), status: t.status,
            street: t.address?.street ?? "", city: t.address?.city ?? "", state: t.address?.state ?? "",
            zipCode: t.address?.zipCode ?? "", country: t.address?.country ?? "",
            emergencyName: t.emergencyContact?.name ?? "", emergencyRelationship: t.emergencyContact?.relationship ?? "",
            emergencyPhone: t.emergencyContact?.phone ?? ""
        });
        setOpen(true);
    }
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); setBusy(true);
        try {
            const payload = {
                firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone,
                dateOfBirth: form.dateOfBirth, gender: form.gender, qualification: form.qualification,
                specialization: form.specialization.split(",").map(s => s.trim()).filter(Boolean),
                experience: Number(form.experience), joiningDate: form.joiningDate, salary: Number(form.salary), status: form.status,
                address: { street: form.street, city: form.city, state: form.state, zipCode: form.zipCode, country: form.country },
                emergencyContact: { name: form.emergencyName, relationship: form.emergencyRelationship, phone: form.emergencyPhone }
            };
            if (editing) { await updateTeacher(editing._id, payload as any); toast.success("Teacher updated"); }
            else { await createTeacher(payload as any); toast.success("Teacher added"); }
            setOpen(false);
        } catch { toast.error("Failed to save"); } finally { setBusy(false); }
    }
    async function handleDelete() {
        if (!confirm) return; setBusy(true);
        try { await deleteTeacher(confirm._id); toast.success("Teacher deleted"); setConfirm(null); }
        catch { toast.error("Failed to delete"); } finally { setBusy(false); }
    }

    const columns: ColumnDef<Teacher, unknown>[] = [
        {
            id: "name", header: "Teacher", accessorFn: r => `${r.firstName} ${r.lastName}`,
            cell: ({ row: { original: r } }) => (<div className="flex items-center gap-2"><Avatar name={`${r.firstName} ${r.lastName}`} size="sm" /><div><p className="font-medium text-sm">{r.firstName} {r.lastName}</p><p className="text-xs text-[--muted-foreground]">{r.email}</p></div></div>)
        },
        { id: "phone", accessorKey: "phone", header: "Phone" },
        { id: "qualification", accessorKey: "qualification", header: "Qualification" },
        { id: "gender", accessorKey: "gender", header: "Gender" },
        { id: "salary", header: "Salary", accessorFn: r => `৳${(r.salary ?? 0).toLocaleString()}` },
        { id: "status", header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge status={String(getValue())} /> },
        { id: "actions", header: "", cell: ({ row: { original: r } }) => (<div className="flex items-center gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Pencil size={13} /></Button><Button variant="ghost" size="icon" className="text-[--danger]" onClick={() => setConfirm(r)}><Trash2 size={13} /></Button></div>) },
    ];

    return (
        <>
            <Header title="Teachers" />
            <main className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div><h2 className="text-base font-semibold">All Teachers</h2><p className="text-sm text-[--muted-foreground]">{pagination?.totalItems ?? 0} total</p></div>
                    <Button onClick={openAdd}><Plus size={15} className="mr-1" />Add Teacher</Button>
                </div>
                {loading ? <div className="card p-10 text-center text-sm text-[--muted-foreground]">Loading…</div>
                    : <DataTable data={teachers} columns={columns} title="Teachers" exportFilename="teachers" />}
            </main>
            <Dialog open={open} onClose={() => setOpen(false)} title={editing ? "Edit Teacher" : "Add Teacher"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div><Label>First Name*</Label><Input value={form.firstName} onChange={e => f("firstName", e.target.value)} required /></div>
                        <div><Label>Last Name*</Label><Input value={form.lastName} onChange={e => f("lastName", e.target.value)} required /></div>
                        <div><Label>Email*</Label><Input type="email" value={form.email} onChange={e => f("email", e.target.value)} required /></div>
                        <div><Label>Phone*</Label><Input value={form.phone} onChange={e => f("phone", e.target.value)} required /></div>
                        <div><Label>Date of Birth*</Label><Input type="date" value={form.dateOfBirth} onChange={e => f("dateOfBirth", e.target.value)} required /></div>
                        <div><Label>Gender*</Label><Select value={form.gender} onChange={e => f("gender", e.target.value)} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }, { value: "other", label: "Other" }]} /></div>
                        <div><Label>Qualification*</Label><Input value={form.qualification} onChange={e => f("qualification", e.target.value)} required /></div>
                        <div><Label>Specialization (comma-separated)</Label><Input value={form.specialization} onChange={e => f("specialization", e.target.value)} placeholder="Math, Science" /></div>
                        <div><Label>Experience (years)*</Label><Input type="number" value={form.experience} onChange={e => f("experience", e.target.value)} required /></div>
                        <div><Label>Joining Date</Label><Input type="date" value={form.joiningDate} onChange={e => f("joiningDate", e.target.value)} /></div>
                        <div><Label>Salary*</Label><Input type="number" value={form.salary} onChange={e => f("salary", e.target.value)} required /></div>
                        <div><Label>Status</Label><Select value={form.status} onChange={e => f("status", e.target.value)} options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }, { value: "on-leave", label: "On Leave" }]} /></div>
                        <div className="col-span-2"><p className="text-xs font-semibold text-[--muted-foreground] uppercase tracking-wide mt-2">Address</p></div>
                        <div><Label>Street*</Label><Input value={form.street} onChange={e => f("street", e.target.value)} required /></div>
                        <div><Label>City*</Label><Input value={form.city} onChange={e => f("city", e.target.value)} required /></div>
                        <div><Label>State*</Label><Input value={form.state} onChange={e => f("state", e.target.value)} required /></div>
                        <div><Label>Zip Code*</Label><Input value={form.zipCode} onChange={e => f("zipCode", e.target.value)} required /></div>
                        <div><Label>Country*</Label><Input value={form.country} onChange={e => f("country", e.target.value)} required /></div>
                        <div className="col-span-2"><p className="text-xs font-semibold text-[--muted-foreground] uppercase tracking-wide mt-2">Emergency Contact</p></div>
                        <div><Label>Name*</Label><Input value={form.emergencyName} onChange={e => f("emergencyName", e.target.value)} required /></div>
                        <div><Label>Relationship*</Label><Input value={form.emergencyRelationship} onChange={e => f("emergencyRelationship", e.target.value)} required /></div>
                        <div><Label>Phone*</Label><Input value={form.emergencyPhone} onChange={e => f("emergencyPhone", e.target.value)} required /></div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" size="sm" type="button" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button size="sm" type="submit" disabled={busy}>{busy ? "Saving…" : editing ? "Update" : "Create"}</Button>
                    </div>
                </form>
            </Dialog>
            <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={handleDelete} loading={busy}
                message={`Delete ${confirm?.firstName} ${confirm?.lastName}? This cannot be undone.`} />
        </>
    );
}
