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
import { usePayments } from "@/hooks/usePayments";
import { Payment } from "@/types/viewModels";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/lib/toast";
import { formatDate, formatCurrency } from "@/lib/utils";

type TF = { studentId: string; amount: string; paymentType: string; paymentMethod: string; transactionId: string; dueDate: string; paidDate: string; status: string; academicYear: string; semester: string; remarks: string };
const blank: TF = { studentId: "", amount: "", paymentType: "tuition", paymentMethod: "cash", transactionId: "", dueDate: "", paidDate: "", status: "pending", academicYear: "", semester: "", remarks: "" };

const basicFields: { key: keyof TF; label: string; type: string; required: boolean }[] = [
    { key: "studentId", label: "Student ID", type: "text", required: true },
    { key: "amount", label: "Amount", type: "number", required: true },
];

const dateFields: { key: keyof TF; label: string; type: string; required: boolean }[] = [
    { key: "transactionId", label: "Transaction ID", type: "text", required: false },
    { key: "dueDate", label: "Due Date", type: "date", required: false },
    { key: "paidDate", label: "Paid Date", type: "date", required: false },
];

const academicFields: { key: keyof TF; label: string; type: string; required: boolean }[] = [
    { key: "academicYear", label: "Academic Year", type: "text", required: false },
    { key: "semester", label: "Semester", type: "text", required: false },
];

const paymentTypeOptions = [{ value: "tuition", label: "Tuition" }, { value: "exam", label: "Exam" }, { value: "library", label: "Library" }, { value: "transport", label: "Transport" }, { value: "hostel", label: "Hostel" }, { value: "other", label: "Other" }];
const paymentMethodOptions = [{ value: "cash", label: "Cash" }, { value: "card", label: "Card" }, { value: "bank-transfer", label: "Bank Transfer" }, { value: "online", label: "Online" }];
const statusOptions = [{ value: "pending", label: "Pending" }, { value: "paid", label: "Paid" }, { value: "overdue", label: "Overdue" }, { value: "cancelled", label: "Cancelled" }];

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
            const payload = {
                ...form,
                amount: Number(form.amount),
                paymentType: form.paymentType as "tuition" | "exam" | "library" | "transport" | "hostel" | "other", paymentMethod: form.paymentMethod as "cash" | "card" | "bank-transfer" | "online", status: form.status as "pending" | "paid" | "overdue" | "cancelled"
            };
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
        { id: "status", header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge variant={String(getValue()) === "paid" ? "default" : "secondary"}>{String(getValue())}</Badge> },
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
            <FormDialog open={open} onClose={() => setOpen(false)} title={editing ? "Edit Payment" : "Add Payment"}>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        {basicFields.map(field => (
                            <div key={field.key}>
                                <Label>{field.label}{field.required && " *"}</Label>
                                <Input type={field.type} value={form[field.key] as string} onChange={e => f(field.key, e.target.value)} required={field.required} />
                            </div>
                        ))}
                        <div>
                            <Label>Payment Type</Label>
                            <Select value={form.paymentType} onValueChange={v => f("paymentType", v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{paymentTypeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Payment Method</Label>
                            <Select value={form.paymentMethod} onValueChange={v => f("paymentMethod", v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{paymentMethodOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        {dateFields.map(field => (
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
                        {academicFields.map(field => (
                            <div key={field.key}>
                                <Label>{field.label}</Label>
                                <Input type={field.type} value={form[field.key] as string} onChange={e => f(field.key, e.target.value)} />
                            </div>
                        ))}
                        <div className="col-span-2"><Label>Remarks</Label><Input value={form.remarks} onChange={e => f("remarks", e.target.value)} /></div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" size="sm" type="button" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button size="sm" type="submit" disabled={busy}>{busy ? "Saving…" : editing ? "Update" : "Create"}</Button>
                    </div>
                </form>
            </FormDialog>
            <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={handleDelete} loading={busy}
                message="Delete this payment record? This cannot be undone." />
        </>
    );
}
