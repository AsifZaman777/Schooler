"use client";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/datatable/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { usePayments } from "@/hooks/usePayments";
import { Payment } from "@/types";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { formatDate, formatCurrency } from "@/lib/utils";

type TF = { studentId: string; amount: string; paymentType: string; paymentMethod: string; transactionId: string; dueDate: string; paidDate: string; status: string; academicYear: string; semester: string; remarks: string };
const blank: TF = { studentId: "", amount: "", paymentType: "tuition", paymentMethod: "cash", transactionId: "", dueDate: "", paidDate: "", status: "pending", academicYear: "", semester: "", remarks: "" };

export default function PaymentsPage() {
    const { payments, loading, pagination, createPayment, updatePayment, deletePayment } = usePayments();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Payment | null>(null);
    const [form, setForm] = useState<TF>(blank);
    const [confirm, setConfirm] = useState<Payment | null>(null);
    const [busy, setBusy] = useState(false);
    const f = (k: keyof TF, v: string) => setForm(p => ({ ...p, [k]: v }));

    function openAdd() { setEditing(null); setForm(blank); setOpen(true); }
    function openEdit(p: Payment) {
        setEditing(p);
        setForm({
            studentId: String(typeof p.studentId === "object" ? (p.studentId as { _id: string })._id : p.studentId),
            amount: String(p.amount), paymentType: p.paymentType, paymentMethod: p.paymentMethod ?? "cash",
            transactionId: p.transactionId ?? "", dueDate: p.dueDate?.slice(0, 10) ?? "",
            paidDate: p.paidDate?.slice(0, 10) ?? "", status: p.status,
            academicYear: p.academicYear, semester: p.semester, remarks: p.remarks ?? ""
        });
        setOpen(true);
    }
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); setBusy(true);
        try {
            const payload = { ...form, amount: Number(form.amount) };
            if (editing) { await updatePayment(editing._id, payload); toast.success("Payment updated"); }
            else { await createPayment(payload); toast.success("Payment added"); }
            setOpen(false);
        } catch { toast.error("Failed to save"); } finally { setBusy(false); }
    }
    async function handleDelete() {
        if (!confirm) return; setBusy(true);
        try { await deletePayment(confirm._id); toast.success("Payment deleted"); setConfirm(null); }
        catch { toast.error("Failed to delete"); } finally { setBusy(false); }
    }

    const columns: ColumnDef<Payment, unknown>[] = [
        { id: "student", header: "Student", accessorFn: r => { const s = r.studentId; return typeof s === "object" ? `${(s as { firstName: string; lastName: string }).firstName} ${(s as { firstName: string; lastName: string }).lastName}` : String(s); } },
        { id: "paymentType", accessorKey: "paymentType", header: "Type" },
        { id: "amount", header: "Amount", accessorFn: r => formatCurrency(r.amount) },
        { id: "paymentMethod", accessorKey: "paymentMethod", header: "Method" },
        { id: "transactionId", accessorKey: "transactionId", header: "Txn ID" },
        { id: "dueDate", header: "Due Date", accessorFn: r => formatDate(r.dueDate) },
        { id: "status", header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge status={String(getValue())} /> },
        { id: "actions", header: "", cell: ({ row: { original: r } }) => (<div className="flex items-center gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Pencil size={13} /></Button><Button variant="ghost" size="icon" className="text-[--danger]" onClick={() => setConfirm(r)}><Trash2 size={13} /></Button></div>) },
    ];

    return (
        <>
            <Header title="Payments" />
            <main className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div><h2 className="text-base font-semibold">All Payments</h2><p className="text-sm text-[--muted-foreground]">{pagination?.totalItems ?? 0} total</p></div>
                    <Button onClick={openAdd}><Plus size={15} className="mr-1" />Add Payment</Button>
                </div>
                {loading ? <div className="card p-10 text-center text-sm text-[--muted-foreground]">Loading…</div>
                    : <DataTable data={payments} columns={columns} title="Payments" exportFilename="payments" />}
            </main>
            <Dialog open={open} onClose={() => setOpen(false)} title={editing ? "Edit Payment" : "Add Payment"}>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div><Label>Student ID</Label><Input value={form.studentId} onChange={e => f("studentId", e.target.value)} required /></div>
                        <div><Label>Amount</Label><Input type="number" value={form.amount} onChange={e => f("amount", e.target.value)} required /></div>
                        <div><Label>Payment Type</Label><Select value={form.paymentType} onChange={e => f("paymentType", e.target.value)} options={[{ value: "tuition", label: "Tuition" }, { value: "exam", label: "Exam" }, { value: "library", label: "Library" }, { value: "transport", label: "Transport" }, { value: "hostel", label: "Hostel" }, { value: "other", label: "Other" }]} /></div>
                        <div><Label>Payment Method</Label><Select value={form.paymentMethod} onChange={e => f("paymentMethod", e.target.value)} options={[{ value: "cash", label: "Cash" }, { value: "card", label: "Card" }, { value: "bank-transfer", label: "Bank Transfer" }, { value: "online", label: "Online" }]} /></div>
                        <div><Label>Transaction ID</Label><Input value={form.transactionId} onChange={e => f("transactionId", e.target.value)} /></div>
                        <div><Label>Due Date</Label><Input type="date" value={form.dueDate} onChange={e => f("dueDate", e.target.value)} /></div>
                        <div><Label>Paid Date</Label><Input type="date" value={form.paidDate} onChange={e => f("paidDate", e.target.value)} /></div>
                        <div><Label>Status</Label><Select value={form.status} onChange={e => f("status", e.target.value)} options={[{ value: "pending", label: "Pending" }, { value: "paid", label: "Paid" }, { value: "overdue", label: "Overdue" }, { value: "cancelled", label: "Cancelled" }]} /></div>
                        <div><Label>Academic Year</Label><Input value={form.academicYear} onChange={e => f("academicYear", e.target.value)} /></div>
                        <div><Label>Semester</Label><Input value={form.semester} onChange={e => f("semester", e.target.value)} /></div>
                        <div className="col-span-2"><Label>Remarks</Label><Input value={form.remarks} onChange={e => f("remarks", e.target.value)} /></div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" size="sm" type="button" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button size="sm" type="submit" disabled={busy}>{busy ? "Saving…" : editing ? "Update" : "Create"}</Button>
                    </div>
                </form>
            </Dialog>
            <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={handleDelete} loading={busy}
                message="Delete this payment record? This cannot be undone." />
        </>
    );
}
