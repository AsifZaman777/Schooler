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
import { useStudents } from "@/hooks/useStudents";
import { Student } from "@/types";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "@/components/ui/toast";

type TF = {
    firstName: string; lastName: string; email: string; phone: string; gender: string; dateOfBirth: string; status: string;
    street: string; city: string; state: string; zipCode: string; country: string;
    emergencyName: string; emergencyRelationship: string; emergencyPhone: string;
};
const blank: TF = {
    firstName: "", lastName: "", email: "", phone: "", gender: "male", dateOfBirth: "", status: "active",
    street: "", city: "", state: "", zipCode: "", country: "",
    emergencyName: "", emergencyRelationship: "", emergencyPhone: ""
};

export default function StudentsPage() {
    const { students, loading, pagination, createStudent, updateStudent, deleteStudent } = useStudents();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Student | null>(null);
    const [form, setForm] = useState<TF>(blank);
    const [confirm, setConfirm] = useState<Student | null>(null);
    const [busy, setBusy] = useState(false);
    const f = (k: keyof TF, v: string) => setForm(p => ({ ...p, [k]: v }));

    function openAdd() { setEditing(null); setForm(blank); setOpen(true); }
    function openEdit(s: Student) {
        setEditing(s);
        setForm({
            firstName: s.firstName, lastName: s.lastName, email: s.email, phone: s.phone,
            gender: s.gender, dateOfBirth: s.dateOfBirth?.slice(0, 10) ?? "", status: s.status,
            street: s.address?.street ?? "", city: s.address?.city ?? "", state: s.address?.state ?? "",
            zipCode: s.address?.zipCode ?? "", country: s.address?.country ?? "",
            emergencyName: s.emergencyContact?.name ?? "", emergencyRelationship: s.emergencyContact?.relationship ?? "",
            emergencyPhone: s.emergencyContact?.phone ?? ""
        });
        setOpen(true);
    }
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); setBusy(true);
        try {
            const payload = {
                firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone,
                gender: form.gender, dateOfBirth: form.dateOfBirth, status: form.status, enrollmentDate: new Date().toISOString(),
                address: { street: form.street, city: form.city, state: form.state, zipCode: form.zipCode, country: form.country },
                emergencyContact: { name: form.emergencyName, relationship: form.emergencyRelationship, phone: form.emergencyPhone }
            };
            if (editing) { await updateStudent(editing._id, payload as any); toast.success("Student updated"); }
            else { await createStudent(payload as any); toast.success("Student added"); }
            setOpen(false);
        } catch { toast.error("Failed to save"); } finally { setBusy(false); }
    }
    async function handleDelete() {
        if (!confirm) return; setBusy(true);
        try { await deleteStudent(confirm._id); toast.success("Student deleted"); setConfirm(null); }
        catch { toast.error("Failed to delete"); } finally { setBusy(false); }
    }

    const columns: ColumnDef<Student, unknown>[] = [
        {
            id: "name", header: "Student", accessorFn: r => `${r.firstName} ${r.lastName}`,
            cell: ({ row: { original: r } }) => (<div className="flex items-center gap-2"><Avatar name={`${r.firstName} ${r.lastName}`} size="sm" /><div><p className="font-medium text-sm">{r.firstName} {r.lastName}</p><p className="text-xs text-[--muted-foreground]">{r.email}</p></div></div>)
        },
        { id: "class", header: "Class", accessorFn: r => (r.classRoomId as { name?: string })?.name ?? "—" },
        { id: "gender", accessorKey: "gender", header: "Gender" },
        { id: "dob", header: "Date of Birth", accessorFn: r => formatDate(r.dateOfBirth) },
        { id: "status", header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge status={String(getValue())} /> },
        { id: "actions", header: "", cell: ({ row: { original: r } }) => (<div className="flex items-center gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Pencil size={13} /></Button><Button variant="ghost" size="icon" className="text-[--danger]" onClick={() => setConfirm(r)}><Trash2 size={13} /></Button></div>) },
    ];

    return (
        <>
            <Header title="Students" />
            <main className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div><h2 className="text-base font-semibold">All Students</h2><p className="text-sm text-[--muted-foreground]">{pagination?.totalItems ?? 0} total</p></div>
                    <Button onClick={openAdd}><Plus size={15} className="mr-1" />Add Student</Button>
                </div>
                {loading ? <div className="card p-10 text-center text-sm text-[--muted-foreground]">Loading…</div>
                    : <DataTable data={students} columns={columns} title="Students" exportFilename="students" />}
            </main>
            <Dialog open={open} onClose={() => setOpen(false)} title={editing ? "Edit Student" : "Add Student"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div><Label>First Name*</Label><Input value={form.firstName} onChange={e => f("firstName", e.target.value)} required /></div>
                        <div><Label>Last Name*</Label><Input value={form.lastName} onChange={e => f("lastName", e.target.value)} required /></div>
                        <div><Label>Email*</Label><Input type="email" value={form.email} onChange={e => f("email", e.target.value)} required /></div>
                        <div><Label>Phone*</Label><Input value={form.phone} onChange={e => f("phone", e.target.value)} required /></div>
                        <div><Label>Date of Birth*</Label><Input type="date" value={form.dateOfBirth} onChange={e => f("dateOfBirth", e.target.value)} required /></div>
                        <div><Label>Gender*</Label><Select value={form.gender} onChange={e => f("gender", e.target.value)} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }, { value: "other", label: "Other" }]} /></div>
                        <div className="col-span-2"><p className="text-xs font-semibold text-[--muted-foreground] uppercase tracking-wide mt-2">Address</p></div>
                        <div><Label>Street*</Label><Input value={form.street} onChange={e => f("street", e.target.value)} required /></div>
                        <div><Label>City*</Label><Input value={form.city} onChange={e => f("city", e.target.value)} required /></div>
                        <div><Label>State*</Label><Input value={form.state} onChange={e => f("state", e.target.value)} required /></div>
                        <div><Label>Zip Code*</Label><Input value={form.zipCode} onChange={e => f("zipCode", e.target.value)} required /></div>
                        <div><Label>Country*</Label><Input value={form.country} onChange={e => f("country", e.target.value)} required /></div>
                        <div><Label>Status</Label><Select value={form.status} onChange={e => f("status", e.target.value)} options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }, { value: "graduated", label: "Graduated" }, { value: "suspended", label: "Suspended" }]} /></div>
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

