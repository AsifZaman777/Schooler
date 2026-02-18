"use client";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/datatable/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStudents } from "@/hooks/useStudents";
import { Student } from "@/types";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

const columns: ColumnDef<Student, unknown>[] = [
    {
        id: "name",
        header: "Student",
        accessorFn: (r) => `${r.firstName} ${r.lastName}`,
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Avatar name={`${row.original.firstName} ${row.original.lastName}`} size="sm" />
                <div>
                    <p className="font-medium text-sm">{row.original.firstName} {row.original.lastName}</p>
                    <p className="text-xs text-[--muted-foreground]">{row.original.studentId}</p>
                </div>
            </div>
        ),
    },
    { id: "class", accessorKey: "className", header: "Class" },
    { id: "section", accessorKey: "section", header: "Section" },
    { id: "gender", accessorKey: "gender", header: "Gender" },
    {
        id: "dob",
        header: "Date of Birth",
        accessorFn: (r) => formatDate(r.dateOfBirth),
    },
    {
        id: "status",
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => <Badge status={String(getValue())} />,
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => <RowActions student={row.original} />,
    },
];

function RowActions({ student }: { student: Student }) {
    const { deleteStudent } = useStudents();
    return (
        <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" disabled><Pencil size={13} /></Button>
            <Button variant="ghost" size="icon" className="text-[--danger] hover:text-[--danger]" onClick={() => deleteStudent(student._id)}>
                <Trash2 size={13} />
            </Button>
        </div>
    );
}

export default function StudentsPage() {
    const { students, loading, createStudent, pagination, fetchStudents } = useStudents();
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", gender: "male", dateOfBirth: "", className: "", section: "", rollNumber: "" });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await createStudent(form);
        setOpen(false);
        setForm({ firstName: "", lastName: "", email: "", phone: "", gender: "male", dateOfBirth: "", className: "", section: "", rollNumber: "" });
    }

    return (
        <>
            <Header title="Students" />
            <main className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-[--foreground]">All Students</h2>
                        <p className="text-sm text-[--muted-foreground]">{pagination?.total ?? 0} total students</p>
                    </div>
                    <Button onClick={() => setOpen(true)}><Plus size={15} /> Add Student</Button>
                </div>

                {loading ? (
                    <div className="card p-10 text-center text-[--muted-foreground] text-sm">Loading…</div>
                ) : (
                    <DataTable data={students} columns={columns} title="Students List" exportFilename="students" />
                )}

                <Dialog open={open} onClose={() => setOpen(false)} title="Add New Student">
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { name: "firstName", label: "First Name" }, { name: "lastName", label: "Last Name" },
                                { name: "email", label: "Email" }, { name: "phone", label: "Phone" },
                                { name: "dateOfBirth", label: "Date of Birth", type: "date" },
                                { name: "className", label: "Class" }, { name: "section", label: "Section" },
                                { name: "rollNumber", label: "Roll Number" },
                            ].map((f) => (
                                <div key={f.name}>
                                    <Label>{f.label}</Label>
                                    <Input type={f.type ?? "text"} value={(form as Record<string, string>)[f.name]} onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))} className="mt-1" required />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                </Dialog>
            </main>
        </>
    );
}
