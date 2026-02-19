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
import { useNotices } from "@/hooks/useNotices";
import { Notice } from "@/types";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/lib/toast";
import { formatDate } from "@/lib/utils";

type TF = { title: string; content: string; category: string; targetAudience: string; publishDate: string; expiryDate: string; priority: string; status: string };
const blank: TF = { title: "", content: "", category: "general", targetAudience: "all", publishDate: "", expiryDate: "", priority: "medium", status: "draft" };

const dateFields: { key: keyof TF; label: string; type: string; required: boolean }[] = [
    { key: "publishDate", label: "Publish Date", type: "date", required: false },
    { key: "expiryDate", label: "Expiry Date", type: "date", required: false },
];

const categoryOptions = [{ value: "general", label: "General" }, { value: "academic", label: "Academic" }, { value: "exam", label: "Exam" }, { value: "event", label: "Event" }, { value: "holiday", label: "Holiday" }, { value: "urgent", label: "Urgent" }];
const priorityOptions = [{ value: "low", label: "Low" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }];
const statusOptions = [{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }, { value: "archived", label: "Archived" }];

export default function NoticesPage() {
    const { notices, loading, pagination, createNotice, updateNotice, deleteNotice } = useNotices();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Notice | null>(null);
    const [form, setForm] = useState<TF>(blank);
    const [confirm, setConfirm] = useState<Notice | null>(null);
    const [busy, setBusy] = useState(false);
    const f = (k: keyof TF, v: string) => setForm(p => ({ ...p, [k]: v }));

    function openAdd() { setEditing(null); setForm(blank); setOpen(true); }
    function openEdit(n: Notice) {
        setEditing(n);
        setForm({
            title: n.title, content: n.content, category: n.category,
            targetAudience: (Array.isArray(n.targetAudience) ? n.targetAudience.join(",") : String(n.targetAudience)),
            publishDate: n.publishDate?.slice(0, 10) ?? "", expiryDate: n.expiryDate?.slice(0, 10) ?? "",
            priority: n.priority, status: n.status
        });
        setOpen(true);
    }
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); setBusy(true);
        try {
            const payload = { ...form, targetAudience: form.targetAudience.split(",").map(s => s.trim()) };
            if (editing) { await updateNotice(editing._id, payload); toast.success("Notice updated"); }
            else { await createNotice(payload); toast.success("Notice published"); }
            setOpen(false);
        } catch { toast.error("Failed to save"); } finally { setBusy(false); }
    }
    async function handleDelete() {
        if (!confirm) return; setBusy(true);
        try { await deleteNotice(confirm._id); toast.success("Notice deleted"); setConfirm(null); }
        catch { toast.error("Failed to delete"); } finally { setBusy(false); }
    }

    const columns: ColumnDef<Notice, unknown>[] = [
        { id: "title", accessorKey: "title", header: "Title" },
        { id: "category", accessorKey: "category", header: "Category" },
        { id: "priority", header: "Priority", accessorKey: "priority", cell: ({ getValue }) => <Badge variant={String(getValue()) === "high" ? "destructive" : "default"}>{String(getValue())}</Badge> },
        { id: "publishDate", header: "Published", accessorFn: r => r.publishDate ? formatDate(r.publishDate) : "—" },
        { id: "expiryDate", header: "Expires", accessorFn: r => r.expiryDate ? formatDate(r.expiryDate) : "—" },
        { id: "status", header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge variant={String(getValue()) === "published" ? "default" : "secondary"}>{String(getValue())}</Badge> },
        { id: "actions", header: "", cell: ({ row: { original: r } }) => (<div className="flex items-center gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Pencil size={13} /></Button><Button variant="ghost" size="icon" className="text-[--danger]" onClick={() => setConfirm(r)}><Trash2 size={13} /></Button></div>) },
    ];

    return (
        <>
            <Header title="Notices" />
            <main className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div><h2 className="text-base font-semibold">All Notices</h2><p className="text-sm text-[--muted-foreground]">{pagination?.totalItems ?? 0} total</p></div>
                    <Button onClick={openAdd}><Plus size={15} className="mr-1" />Post Notice</Button>
                </div>
                {loading ? <div className="card p-10 text-center text-sm text-[--muted-foreground]">Loading…</div>
                    : <DataTable data={notices} columns={columns} title="Notices" exportFilename="notices" />}
            </main>
            <FormDialog open={open} onClose={() => setOpen(false)} title={editing ? "Edit Notice" : "Post Notice"}>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2"><Label>Title *</Label><Input value={form.title} onChange={e => f("title", e.target.value)} required /></div>
                        <div>
                            <Label>Category</Label>
                            <Select value={form.category} onValueChange={v => f("category", v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{categoryOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Priority</Label>
                            <Select value={form.priority} onValueChange={v => f("priority", v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{priorityOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div><Label>Target Audience (comma-separated)</Label><Input value={form.targetAudience} onChange={e => f("targetAudience", e.target.value)} placeholder="all, students, teachers" /></div>
                        <div>
                            <Label>Status</Label>
                            <Select value={form.status} onValueChange={v => f("status", v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{statusOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        {dateFields.map(field => (
                            <div key={field.key}>
                                <Label>{field.label}</Label>
                                <Input type={field.type} value={form[field.key] as string} onChange={e => f(field.key, e.target.value)} />
                            </div>
                        ))}
                        <div className="col-span-2"><Label>Content *</Label><textarea className="flex min-h-[80px] w-full rounded border border-[--border] bg-[--card] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[--ring]" value={form.content} onChange={e => f("content", e.target.value)} required /></div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" size="sm" type="button" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button size="sm" type="submit" disabled={busy}>{busy ? "Saving…" : editing ? "Update" : "Publish"}</Button>
                    </div>
                </form>
            </FormDialog>
            <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={handleDelete} loading={busy}
                message={`Delete notice "${confirm?.title}"? This cannot be undone.`} />
        </>
    );
}
