"use client";
import { useState, useCallback, useEffect } from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
    id: number;
    message: string;
    type: ToastType;
}

let toastId = 0;
let globalSetToasts: React.Dispatch<React.SetStateAction<ToastItem[]>> | null = null;

export function toast(message: string, type: ToastType = "info") {
    if (globalSetToasts) {
        const id = ++toastId;
        globalSetToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            globalSetToasts?.((prev) => prev.filter((t) => t.id !== id));
        }, 3500);
    }
}

toast.success = (message: string) => toast(message, "success");
toast.error = (message: string) => toast(message, "error");
toast.info = (message: string) => toast(message, "info");

export function ToastProvider() {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    useEffect(() => {
        globalSetToasts = setToasts;
        return () => {
            globalSetToasts = null;
        };
    }, []);

    const remove = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={`flex items-center gap-3 min-w-[280px] max-w-[360px] px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${t.type === "success"
                            ? "bg-[--success] text-white"
                            : t.type === "error"
                                ? "bg-[--danger] text-white"
                                : "bg-[--primary] text-white"
                        }`}
                >
                    {t.type === "success" && <CheckCircle2 size={16} />}
                    {t.type === "error" && <AlertCircle size={16} />}
                    {t.type === "info" && <Info size={16} />}
                    <span className="flex-1">{t.message}</span>
                    <button onClick={() => remove(t.id)} className="opacity-70 hover:opacity-100">
                        <X size={14} />
                    </button>
                </div>
            ))}
        </div>
    );
}
