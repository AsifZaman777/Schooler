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
import { useExpenses } from "@/hooks/useExpenses";
import { Expense } from "@/types";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/lib/toast";
import { formatDate, formatCurrency } from "@/lib/utils";

type TF = { category: string; subcategory: string; amount: string; description: string; date: string; paymentMethod: string; transactionId: string; status: string; remarks: string };
const blank: TF = { category: "other", subcategory: "", amount: "", description: "", date: "", paymentMethod: "cash", transactionId: "", status: "pending", remarks: "" };

export default function ExpensesPage() {
    const { expenses, loading, pagination, createExpense, updateExpense, deleteExpense } = useExpenses();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Expense | null>(null);
    const [form, setForm] = useState<TF>(blank);
    const [confirm, setConfirm] = useState<Expense | null>(null);
    const [busy, setBusy] = useState(false);
    const f = (k: keyof TF, v: string) => setForm(p => ({ ...p, [k]: v }));

    function openAdd() { setEditing(null); setForm(blank); setOpen(true); }
    function openEdit(ex: Expense) {
        setEditing(ex);
        setForm({
            category: ex.category, subcategory: ex.subcategory, amount: String(ex.amount),
            description: ex.description, date: ex.date?.slice(0, 10) ?? "",
            paymentMethod: ex.paymentMethod, transactionId: ex.transactionId ?? "",
            status: ex.status, remarks: ex.remarks ?? ""
        });
        setOpen(true);
    }
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); setBusy(true);
        try {
            const payload = { ...form, amount: Number(form.amount) };
            if (editing) { await updateExpense(editing._id, payload); toast.success("Expense updated"); }
            else { await createExpense(payload); toast.success("Expense added"); }
            setOpen(false);
        } catch { toast.error("Failed to save"); } finally { setBusy(false); }
    }
    async function handleDelete() {
        if (!confirm) return; setBusy(true);
        try { await deleteExpense(confirm._id); toast.success("Expense deleted"); setConfirm(null); }
        catch { toast.error("Failed to delete"); } finally { setBusy(false); }
    }

    const columns: ColumnDef<Expense, unknown>[] = [
        { id: "category", accessorKey: "category", header: "Category" },
        { id: "subcategory", accessorKey: "subcategory", header: "Subcategory" },
        { id: "amount", header: "Amount", accessorFn: r => formatCurrency(r.amount) },
        { id: "paymentMethod", accessorKey: "paymentMethod", header: "Method" },
        { id: "date", header: "Date", accessorFn: r => formatDate(r.date) },
        { id: "status", header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge variant={String(getValue()) === "approved" ? "default" : "secondary"}>{String(getValue())}</Badge> },
        { id: "actions", header: "", cell: ({ row: { original: r } }) => (<div className="flex items-center gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Pencil size={13} /></Button><Button variant="ghost" size="icon" className="text-[--danger]" onClick={() => setConfirm(r)}><Trash2 size={13} /></Button></div>) },
    ];

    return (
        <>
            <Header title="Expenses" />
            <main className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div><h2 className="text-base font-semibold">All Expenses</h2><p className="text-sm text-[--muted-foreground]">{pagination?.totalItems ?? 0} total</p></div>
                    <Button onClick={openAdd}><Plus size={15} className="mr-1" />Add Expense</Button>
                </div>
                {loading ? <div className="card p-10 text-center text-sm text-[--muted-foreground]">Loading…</div>
                    : <DataTable data={expenses} columns={columns} title="Expenses" exportFilename="expenses" />}
            </main>
            <FormDialog open={open} onClose={() => setOpen(false)} title={editing ? "Edit Expense" : "Add Expense"}>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div><Label>Category</Label><Select value={form.category} onChange={e => f("category", e.target.value)} options={[{ value: "salary", label: "Salary" }, { value: "fixed", label: "Fixed" }, { value: "other", label: "Other" }]} /></div>
                        <div><Label>Subcategory</Label><Input value={form.subcategory} onChange={e => f("subcategory", e.target.value)} /></div>
                        <div><Label>Amount</Label><Input type="number" value={form.amount} onChange={e => f("amount", e.target.value)} required /></div>
                        <div><Label>Date</Label><Input type="date" value={form.date} onChange={e => f("date", e.target.value)} /></div>
                        <div><Label>Payment Method</Label><Select value={form.paymentMethod} onChange={e => f("paymentMethod", e.target.value)} options={[{ value: "cash", label: "Cash" }, { value: "card", label: "Card" }, { value: "bank-transfer", label: "Bank Transfer" }, { value: "cheque", label: "Cheque" }]} /></div>
                        <div><Label>Transaction ID</Label><Input value={form.transactionId} onChange={e => f("transactionId", e.target.value)} /></div>
                        <div><Label>Status</Label><Select value={form.status} onChange={e => f("status", e.target.value)} options={[{ value: "pending", label: "Pending" }, { value: "approved", label: "Approved" }, { value: "paid", label: "Paid" }, { value: "rejected", label: "Rejected" }]} /></div>
                        <div className="col-span-2"><Label>Description</Label><Input value={form.description} onChange={e => f("description", e.target.value)} /></div>
                        <div className="col-span-2"><Label>Remarks</Label><Input value={form.remarks} onChange={e => f("remarks", e.target.value)} /></div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" size="sm" type="button" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button size="sm" type="submit" disabled={busy}>{busy ? "Saving…" : editing ? "Update" : "Create"}</Button>
                    </div>
                </form>
            </FormDialog>
            <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={handleDelete} loading={busy}
                message="Delete this expense record? This cannot be undone." />
        </>
    );
}
