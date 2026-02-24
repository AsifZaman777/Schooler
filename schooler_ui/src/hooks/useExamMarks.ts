"use client";
import { useState, useCallback } from "react";
import api from "@/lib/axios";
import type { ExamMark } from "@/types/viewModels";

export function useExamMarks() {
  const [marks, setMarks] = useState<ExamMark[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMarks = useCallback(async (examId: string) => {
    setLoading(true);
    try {
      const res = await api.get("/exams/marks", {
        params: { examId, limit: 200 },
      });
      setMarks(res.data.data ?? []);
    } catch {
      setMarks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createMark = async (payload: {
    examId: string;
    studentId: string;
    marksObtained: number;
    grade?: string;
    remarks?: string;
    status?: string;
  }) => {
    const res = await api.post("/exams/marks", payload);
    return res.data.data as ExamMark;
  };

  const updateMark = async (
    id: string,
    payload: Partial<{
      marksObtained: number;
      grade: string;
      remarks: string;
      status: string;
    }>,
  ) => {
    const res = await api.put(`/exams/marks/${id}`, payload);
    return res.data.data as ExamMark;
  };

  const deleteMark = async (id: string) => {
    await api.delete(`/exams/marks/${id}`);
  };

  return { marks, loading, fetchMarks, createMark, updateMark, deleteMark };
}
