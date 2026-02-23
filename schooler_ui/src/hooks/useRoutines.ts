"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import type { Routine, Pagination } from "@/types/viewModels";

export function useRoutines(initialParams = {}) {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutines = useCallback(
    async (params: Record<string, unknown> = initialParams) => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/routines", {
          params: { page: 1, limit: 50, ...params },
        });
        setRoutines(res.data.data);
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
    fetchRoutines();
  }, [fetchRoutines]);

  const createRoutine = async (payload: Partial<Routine>) => {
    const res = await api.post("/routines", payload);
    await fetchRoutines();
    return res.data.data;
  };

  const updateRoutine = async (id: string, payload: Partial<Routine>) => {
    const res = await api.put(`/routines/${id}`, payload);
    await fetchRoutines();
    return res.data.data;
  };

  const deleteRoutine = async (id: string) => {
    await api.delete(`/routines/${id}`);
    await fetchRoutines();
  };

  return {
    routines,
    pagination,
    loading,
    error,
    fetchRoutines,
    createRoutine,
    updateRoutine,
    deleteRoutine,
  };
}
