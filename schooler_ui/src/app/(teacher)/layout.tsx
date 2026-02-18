import { TeacherSidebar } from "@/components/layout/TeacherSidebar";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-[--background]">
            <TeacherSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                {children}
            </div>
        </div>
    );
}
