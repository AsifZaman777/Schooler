"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/lib/toast";
import api from "@/lib/axios";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const [mode, setMode] = useState<"login" | "register">("login");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        role: "student",
        referenceId: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                toast.error(result.error);
            } else if (result?.ok) {
                toast.success("Login successful!");
                router.push(callbackUrl);
                router.refresh();
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred during login");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (formData.password !== formData.confirmPassword) {
                toast.error("Passwords do not match");
                setIsLoading(false);
                return;
            }

            if (formData.password.length < 6) {
                toast.error("Password must be at least 6 characters");
                setIsLoading(false);
                return;
            }

            const response = await api.post("/auth/register", {
                email: formData.email,
                password: formData.password,
                role: formData.role,
                referenceId: formData.referenceId,
            });

            if (response.data.success) {
                toast.success("Registration successful! Please login.");
                setMode("login");
                setFormData({
                    email: formData.email,
                    password: "",
                    confirmPassword: "",
                    role: "student",
                    referenceId: "",
                });
            }
        } catch (error: any) {
            toast.error(error.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[--background] p-4">
            <div className="w-full max-w-md">
                <div className="card p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">
                            {mode === "login" ? "Welcome Back" : "Create Account"}
                        </h1>
                        <p className="text-[--muted-foreground]">
                            {mode === "login"
                                ? "Sign in to your Schooler account"
                                : "Register for a new Schooler account"}
                        </p>
                    </div>

                    {mode === "login" ? (
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegisterSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="reg-email">Email</Label>
                                <Input
                                    id="reg-email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <Label htmlFor="reg-password">Password</Label>
                                <Input
                                    id="reg-password"
                                    type="password"
                                    placeholder="Enter your password (min 6 characters)"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={(e) =>
                                        setFormData({ ...formData, confirmPassword: e.target.value })
                                    }
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, role: value })
                                    }
                                    disabled={isLoading}
                                >
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="Select your role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="student">Student</SelectItem>
                                        <SelectItem value="teacher">Teacher</SelectItem>
                                        <SelectItem value="parent">Parent</SelectItem>
                                        <SelectItem value="employee">Employee</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="referenceId">Reference ID</Label>
                                <Input
                                    id="referenceId"
                                    type="text"
                                    placeholder="Enter your profile ID"
                                    value={formData.referenceId}
                                    onChange={(e) =>
                                        setFormData({ ...formData, referenceId: e.target.value })
                                    }
                                    required
                                    disabled={isLoading}
                                />
                                <p className="text-xs text-[--muted-foreground] mt-1">
                                    Your profile must be created by an admin first
                                </p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? "Registering..." : "Register"}
                            </Button>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => {
                                setMode(mode === "login" ? "register" : "login");
                                setFormData({
                                    email: "",
                                    password: "",
                                    confirmPassword: "",
                                    role: "student",
                                    referenceId: "",
                                });
                            }}
                            className="text-sm text-[--primary] hover:underline"
                            disabled={isLoading}
                        >
                            {mode === "login"
                                ? "Don't have an account? Register here"
                                : "Already have an account? Sign in"}
                        </button>
                    </div>

                    <div className="mt-6 text-center text-sm text-[--muted-foreground]">
                        <p>Schooler Management System v1.0</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
