"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface FormDialogProps {
    open: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    className?: string
}

export function FormDialog({
    open,
    onClose,
    title,
    children,
    className,
}: FormDialogProps) {
    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className={className}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}
