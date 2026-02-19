"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import type { Student, Pagination } from "@/types/viewModels";

export function useStudents(initialParams = {}) {
  const [students, setStudents] = useState<Student[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(
    async (params: Record<string, unknown> = initialParams) => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/students", {
          params: { page: 1, limit: 20, ...params },
        });
        setStudents(res.data.data);
        setPagination(res.data.pagination ?? null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const createStudent = async (payload: Partial<Student>) => {
    const res = await api.post("/students", payload);
    await fetchStudents();
    return res.data.data;
  };

  const updateStudent = async (id: string, payload: Partial<Student>) => {
    const res = await api.put(`/students/${id}`, payload);
    await fetchStudents();
    return res.data.data;
  };

  const deleteStudent = async (id: string) => {
    await api.delete(`/students/${id}`);
    await fetchStudents();
  };

  return {
    students,
    pagination,
    loading,
    error,
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
  };
}
