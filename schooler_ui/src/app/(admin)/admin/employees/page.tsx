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
import { useEmployees } from "@/hooks/useEmployees";
import { Employee } from "@/types";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/toast";

type TF = { firstName: string; lastName: string; email: string; phone: string; dateOfBirth: string; gender: string; position: string; department: string; joiningDate: string; salary: string; status: string };
const blank: TF = { firstName: "", lastName: "", email: "", phone: "", dateOfBirth: "", gender: "male", position: "", department: "", joiningDate: "", salary: "", status: "active" };

export default function EmployeesPage() {
    const { employees, loading, pagination, createEmployee, updateEmployee, deleteEmployee } = useEmployees();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Employee | null>(null);
    const [form, setForm] = useState<TF>(blank);
    const [confirm, setConfirm] = useState<Employee | null>(null);
    const [busy, setBusy] = useState(false);
    const f = (k: keyof TF, v: string) => setForm(p => ({ ...p, [k]: v }));

    function openAdd() { setEditing(null); setForm(blank); setOpen(true); }
    function openEdit(emp: Employee) {
        setEditing(emp);
        setForm({
            firstName: emp.firstName, lastName: emp.lastName, email: emp.email, phone: emp.phone,
            dateOfBirth: emp.dateOfBirth?.slice(0, 10) ?? "", gender: emp.gender,
            position: emp.position, department: String(emp.department),
            joiningDate: emp.joiningDate?.slice(0, 10) ?? "", salary: String(emp.salary ?? ""), status: emp.status
        });
        setOpen(true);
    }
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); setBusy(true);
        try {
            const payload = { ...form, salary: Number(form.salary) };
            if (editing) { await updateEmployee(editing._id, payload); toast.success("Employee updated"); }
            else { await createEmployee(payload); toast.success("Employee added"); }
            setOpen(false);
        } catch { toast.error("Failed to save"); } finally { setBusy(false); }
    }
    async function handleDelete() {
        if (!confirm) return; setBusy(true);
        try { await deleteEmployee(confirm._id); toast.success("Employee deleted"); setConfirm(null); }
        catch { toast.error("Failed to delete"); } finally { setBusy(false); }
    }

    const columns: ColumnDef<Employee, unknown>[] = [
        {
            id: "name", header: "Employee", accessorFn: r => `${r.firstName} ${r.lastName}`,
            cell: ({ row: { original: r } }) => (<div className="flex items-center gap-2"><Avatar name={`${r.firstName} ${r.lastName}`} size="sm" /><div><p className="font-medium text-sm">{r.firstName} {r.lastName}</p><p className="text-xs text-[--muted-foreground]">{r.email}</p></div></div>)
        },
        { id: "position", accessorKey: "position", header: "Position" },
        { id: "department", header: "Department", accessorFn: r => (r.department as { name?: string })?.name ?? String(r.department) },
        { id: "phone", accessorKey: "phone", header: "Phone" },
        { id: "salary", header: "Salary", accessorFn: r => `৳${(r.salary ?? 0).toLocaleString()}` },
        { id: "status", header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge status={String(getValue())} /> },
        { id: "actions", header: "", cell: ({ row: { original: r } }) => (<div className="flex items-center gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Pencil size={13} /></Button><Button variant="ghost" size="icon" className="text-[--danger]" onClick={() => setConfirm(r)}><Trash2 size={13} /></Button></div>) },
    ];

    return (
        <>
            <Header title="Employees" />
            <main className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div><h2 className="text-base font-semibold">All Employees</h2><p className="text-sm text-[--muted-foreground]">{pagination?.totalItems ?? 0} total</p></div>
                    <Button onClick={openAdd}><Plus size={15} className="mr-1" />Add Employee</Button>
                </div>
                {loading ? <div className="card p-10 text-center text-sm text-[--muted-foreground]">Loading…</div>
                    : <DataTable data={employees} columns={columns} title="Employees" exportFilename="employees" />}
            </main>
            <Dialog open={open} onClose={() => setOpen(false)} title={editing ? "Edit Employee" : "Add Employee"}>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div><Label>First Name</Label><Input value={form.firstName} onChange={e => f("firstName", e.target.value)} required /></div>
                        <div><Label>Last Name</Label><Input value={form.lastName} onChange={e => f("lastName", e.target.value)} required /></div>
                        <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => f("email", e.target.value)} required /></div>
                        <div><Label>Phone</Label><Input value={form.phone} onChange={e => f("phone", e.target.value)} /></div>
                        <div><Label>Date of Birth</Label><Input type="date" value={form.dateOfBirth} onChange={e => f("dateOfBirth", e.target.value)} /></div>
                        <div><Label>Gender</Label><Select value={form.gender} onChange={e => f("gender", e.target.value)} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }, { value: "other", label: "Other" }]} /></div>
                        <div><Label>Position</Label><Input value={form.position} onChange={e => f("position", e.target.value)} required /></div>
                        <div><Label>Department</Label><Input value={form.department} onChange={e => f("department", e.target.value)} /></div>
                        <div><Label>Joining Date</Label><Input type="date" value={form.joiningDate} onChange={e => f("joiningDate", e.target.value)} /></div>
                        <div><Label>Salary</Label><Input type="number" value={form.salary} onChange={e => f("salary", e.target.value)} /></div>
                        <div><Label>Status</Label><Select value={form.status} onChange={e => f("status", e.target.value)} options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }, { value: "on-leave", label: "On Leave" }]} /></div>
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
