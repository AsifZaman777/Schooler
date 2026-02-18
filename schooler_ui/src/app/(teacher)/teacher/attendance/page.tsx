"use client";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/datatable/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/lib/toast";
import { useAttendance } from "@/hooks/useAttendance";
import { Attendance } from "@/types";
import { formatDate } from "@/lib/utils";
import { PlusCircle } from "lucide-react";

type TF = { studentId: string; classRoomId: string; date: string; status: string; remarks: string };
const blank: TF = { studentId: "", classRoomId: "", date: new Date().toISOString().slice(0, 10), status: "present", remarks: "" };

export default function TeacherAttendancePage() {
    const { attendances, loading, createAttendance } = useAttendance();
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<TF>(blank);
    const [busy, setBusy] = useState(false);
    const f = (k: keyof TF, v: string) => setForm((p) => ({ ...p, [k]: v }));

    const handleSubmit = async () => {
        setBusy(true);
        try {
            await createAttendance(form);
            toast.success("Attendance marked successfully");
            setOpen(false);
            setForm(blank);
        } catch {
            toast.error("Failed to mark attendance");
        } finally {
            setBusy(false);
        }
    };

    const columns: ColumnDef<Attendance, unknown>[] = [
        { id: "student", header: "Student", accessorFn: (r) => { const s = r.studentId as { firstName?: string; lastName?: string }; return s?.firstName ? `${s.firstName} ${s.lastName ?? ""}`.trim() : String(r.studentId); } },
        { id: "class", header: "Class", accessorFn: (r) => (r.classRoomId as { name?: string })?.name ?? String(r.classRoomId) },
        { id: "date", header: "Date", accessorFn: (r) => formatDate(r.date) },
        { id: "status", header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge status={String(getValue())} /> },
        { id: "remarks", accessorKey: "remarks", header: "Remarks" },
    ];

    return (
        <>
            <Header title="Attendance" userName="Teacher" />
            <main className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-[--foreground]">Attendance Records</h2>
                    <Button onClick={() => setOpen(true)}><PlusCircle size={16} className="mr-2" />Mark Attendance</Button>
                </div>
                {loading ? (
                    <div className="card p-10 text-center text-[--muted-foreground] text-sm">Loading…</div>
                ) : (
                    <DataTable data={attendances} columns={columns} title="Attendance" exportFilename="teacher-attendance" />
                )}
            </main>
            <DialogRoot open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogClose onClose={() => setOpen(false)} />
                    <DialogHeader><DialogTitle>Mark Attendance</DialogTitle></DialogHeader>
                    <div className="px-6 py-5 grid grid-cols-2 gap-4">
                        <div><Label>Student ID</Label><Input value={form.studentId} onChange={(e) => f("studentId", e.target.value)} /></div>
                        <div><Label>Class ID</Label><Input value={form.classRoomId} onChange={(e) => f("classRoomId", e.target.value)} /></div>
                        <div><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => f("date", e.target.value)} /></div>
                        <div>
                            <Label>Status</Label>
                            <Select value={form.status} onValueChange={(v) => f("status", v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {["present", "absent", "late", "excused"].map((s) => (
                                        <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-2"><Label>Remarks</Label><Input value={form.remarks} onChange={(e) => f("remarks", e.target.value)} /></div>
                    </div>
                    <div className="px-6 pb-5 flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
                    </div>
                </DialogContent>
            </DialogRoot>
        </>
    );
}
