"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/lib/toast";
import api from "@/lib/axios";

interface TokenPayload {
    email: string;
    role: string;
    referenceId: string;
    name: string;
    exp: number;
}

function decodeToken(token: string): TokenPayload | null {
    try {
        const decoded = JSON.parse(atob(token));
        return decoded as TokenPayload;
    } catch {
        return null;
    }
}

const ROLE_COLORS: Record<string, string> = {
    admin: "bg-purple-100 text-purple-700",
    teacher: "bg-blue-100 text-blue-700",
    student: "bg-green-100 text-green-700",
    parent: "bg-orange-100 text-orange-700",
    employee: "bg-yellow-100 text-yellow-700",
};

export default function RegisterPage() {
    const { token } = useParams<{ token: string }>();
    const router = useRouter();

    const [payload, setPayload] = useState<TokenPayload | null>(null);
    const [expired, setExpired] = useState(false);
    const [invalid, setInvalid] = useState(false);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (!token) { setInvalid(true); return; }
        const data = decodeToken(token);
        if (!data) { setInvalid(true); return; }
        if (data.exp && Date.now() > data.exp) { setExpired(true); return; }
        setPayload(data);
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        setIsLoading(true);
        try {
            await api.post("/auth/register", {
                email: payload!.email,
                password,
                role: payload!.role,
                referenceId: payload!.referenceId,
            });
            toast.success("Account created! You can now sign in.");
            setDone(true);
        } catch (err: any) {
            toast.error(err.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    if (invalid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[--background] p-4">
                <div className="card p-8 w-full max-w-md text-center space-y-4">
                    <div className="text-5xl">⚠️</div>
                    <h2 className="text-xl font-bold text-[--foreground]">Invalid Link</h2>
                    <p className="text-[--muted-foreground] text-sm">
                        This registration link is not valid. Please ask your administrator for a new one.
                    </p>
                    <Button onClick={() => router.push("/login")} className="w-full">Go to Login</Button>
                </div>
            </div>
        );
    }

    if (expired) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[--background] p-4">
                <div className="card p-8 w-full max-w-md text-center space-y-4">
                    <div className="text-5xl">⏰</div>
                    <h2 className="text-xl font-bold text-[--foreground]">Link Expired</h2>
                    <p className="text-[--muted-foreground] text-sm">
                        This registration link has expired. Please ask your administrator to generate a new one.
                    </p>
                    <Button onClick={() => router.push("/login")} className="w-full">Go to Login</Button>
                </div>
            </div>
        );
    }

    if (done) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[--background] p-4">
                <div className="card p-8 w-full max-w-md text-center space-y-4">
                    <div className="text-5xl">🎉</div>
                    <h2 className="text-xl font-bold text-[--foreground]">Account Created!</h2>
                    <p className="text-[--muted-foreground] text-sm">
                        Your account has been set up successfully. You can now sign in with your email and password.
                    </p>
                    <Button onClick={() => router.push("/login")} className="w-full">Go to Login</Button>
                </div>
            </div>
        );
    }

    if (!payload) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[--background]">
                <div className="text-[--muted-foreground] text-sm">Loading…</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[--background] p-4">
            <div className="w-full max-w-md">
                <div className="card p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold mb-1">Set Up Your Account</h1>
                        <p className="text-[--muted-foreground] text-sm">
                            Create a password to complete your registration
                        </p>
                    </div>

                    {/* Pre-filled info banner */}
                    <div className="rounded-lg border border-[--border] bg-[--muted] p-4 mb-6 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-[--muted-foreground]">Name</span>
                            <span className="text-sm font-medium text-[--foreground]">{payload.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-[--muted-foreground]">Email</span>
                            <span className="text-sm font-medium text-[--foreground]">{payload.email}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-[--muted-foreground]">Role</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${ROLE_COLORS[payload.role] ?? "bg-gray-100 text-gray-700"}`}>
                                {payload.role}
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="At least 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Re-enter your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Creating account…" : "Create Account"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
