"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useStudents } from "@/hooks/useStudents";
import { useTeachers } from "@/hooks/useTeachers";
import { useEmployees } from "@/hooks/useEmployees";
import { useParents } from "@/hooks/useParents";
import { Copy, Download, RefreshCw } from "lucide-react";
import { toast } from "@/lib/toast";

interface Props {
    open: boolean;
    onClose: () => void;
}

type Role = "student" | "teacher" | "employee" | "parent" | "admin";

interface PersonOption {
    id: string;
    name: string;
    email: string;
}

/** Encode registration payload as a base64 token (expires in 24 h) */
function buildToken(payload: {
    email: string;
    role: string;
    referenceId: string;
    name: string;
}) {
    const exp = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    return btoa(JSON.stringify({ ...payload, exp }));
}

const ROLES: { value: Role; label: string }[] = [
    { value: "student", label: "Student" },
    { value: "teacher", label: "Teacher" },
    { value: "employee", label: "Employee" },
    { value: "parent", label: "Parent" },
    { value: "admin", label: "Admin (Employee)" },
];

export function RegisterUserModal({ open, onClose }: Props) {
    const [role, setRole] = useState<Role>("student");
    const [personId, setPersonId] = useState("");
    const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
    const [registrationUrl, setRegistrationUrl] = useState<string | null>(null);
    const [generating, setGenerating] = useState(false);

    const { students } = useStudents();
    const { teachers } = useTeachers();
    const { employees } = useEmployees();
    const { parents } = useParents();

    // Reset when role changes
    useEffect(() => {
        setPersonId("");
        setQrDataUrl(null);
        setRegistrationUrl(null);
    }, [role]);

    // Reset fully on close
    useEffect(() => {
        if (!open) {
            setRole("student");
            setPersonId("");
            setQrDataUrl(null);
            setRegistrationUrl(null);
        }
    }, [open]);

    const personOptions: PersonOption[] = (() => {
        const map = (arr: any[]): PersonOption[] =>
            arr.map((p) => ({
                id: p._id,
                name: `${p.firstName} ${p.lastName}`,
                email: p.email,
            }));
        switch (role) {
            case "student":
                return map(students);
            case "teacher":
                return map(teachers);
            case "employee":
            case "admin":
                return map(employees);
            case "parent":
                return map(parents);
            default:
                return [];
        }
    })();

    const selectedPerson = personOptions.find((p) => p.id === personId);

    const handleGenerate = async () => {
        if (!selectedPerson) {
            toast.error("Please select a person");
            return;
        }
        setGenerating(true);
        try {
            const token = buildToken({
                email: selectedPerson.email,
                role,
                referenceId: selectedPerson.id,
                name: selectedPerson.name,
            });

            const baseUrl =
                process.env.NEXT_PUBLIC_APP_URL ||
                (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

            const url = `${baseUrl}/register/${token}`;
            setRegistrationUrl(url);

            const dataUrl = await QRCode.toDataURL(url, {
                width: 256,
                margin: 2,
                color: { dark: "#1e293b", light: "#ffffff" },
            });
            setQrDataUrl(dataUrl);
        } catch (err) {
            toast.error("Failed to generate QR code");
        } finally {
            setGenerating(false);
        }
    };

    const handleCopyLink = () => {
        if (!registrationUrl) return;
        navigator.clipboard.writeText(registrationUrl);
        toast.success("Registration link copied!");
    };

    const handleDownloadQR = () => {
        if (!qrDataUrl || !selectedPerson) return;
        const link = document.createElement("a");
        link.download = `register-${selectedPerson.name.replace(/\s+/g, "-").toLowerCase()}.png`;
        link.href = qrDataUrl;
        link.click();
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Register New User</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 pt-1">
                    {/* Step 1 — Pick role */}
                    <div>
                        <Label>Role</Label>
                        <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {ROLES.map((r) => (
                                    <SelectItem key={r.value} value={r.value}>
                                        {r.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Step 2 — Pick person */}
                    <div>
                        <Label>Person</Label>
                        <Select
                            value={personId}
                            onValueChange={(v) => {
                                setPersonId(v);
                                setQrDataUrl(null);
                                setRegistrationUrl(null);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a person…" />
                            </SelectTrigger>
                            <SelectContent>
                                {personOptions.length === 0 ? (
                                    <div className="px-3 py-2 text-sm text-[--muted-foreground]">
                                        No profiles found
                                    </div>
                                ) : (
                                    personOptions.map((p) => (
                                        <SelectItem key={p.id} value={p.id}>
                                            <span className="font-medium">{p.name}</span>
                                            <span className="ml-2 text-xs text-[--muted-foreground]">
                                                {p.email}
                                            </span>
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        {selectedPerson && (
                            <p className="text-xs text-[--muted-foreground] mt-1">
                                {selectedPerson.email}
                            </p>
                        )}
                    </div>

                    {/* Generate button */}
                    {!qrDataUrl && (
                        <Button
                            className="w-full"
                            onClick={handleGenerate}
                            disabled={!personId || generating}
                        >
                            {generating ? (
                                <>
                                    <RefreshCw size={14} className="mr-2 animate-spin" />
                                    Generating…
                                </>
                            ) : (
                                "Generate QR Code"
                            )}
                        </Button>
                    )}

                    {/* QR Code display */}
                    {qrDataUrl && (
                        <div className="space-y-4">
                            <div className="rounded-xl border border-[--border] p-4 flex flex-col items-center gap-3 bg-white">
                                <img
                                    src={qrDataUrl}
                                    alt="Registration QR Code"
                                    className="w-52 h-52"
                                />
                                <p className="text-xs text-center text-[--muted-foreground]">
                                    Share this QR code with{" "}
                                    <strong>{selectedPerson?.name}</strong>. It expires in{" "}
                                    <strong>24 hours</strong>.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={handleCopyLink}
                                >
                                    <Copy size={13} className="mr-1.5" />
                                    Copy Link
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={handleDownloadQR}
                                >
                                    <Download size={13} className="mr-1.5" />
                                    Download QR
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setQrDataUrl(null);
                                        setRegistrationUrl(null);
                                        setPersonId("");
                                    }}
                                    title="Generate for another person"
                                >
                                    <RefreshCw size={13} />
                                </Button>
                            </div>
                        </div>
                    )}

                    <p className="text-xs text-[--muted-foreground] pt-1 border-t border-[--border]">
                        The person will scan the QR code (or open the link) and only needs to set a password — all other details are pre-filled automatically.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
