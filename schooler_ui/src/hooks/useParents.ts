"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import type { Parent, Pagination } from "@/types";

export function useParents(initialParams = {}) {
  const [parents, setParents] = useState<Parent[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchParents = useCallback(
    async (params: Record<string, unknown> = initialParams) => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/parents", {
          params: { page: 1, limit: 20, ...params },
        });
        setParents(res.data.data);
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
    fetchParents();
  }, [fetchParents]);

  const createParent = async (payload: Partial<Parent>) => {
    const res = await api.post("/parents", payload);
    await fetchParents();
    return res.data.data;
  };

  const updateParent = async (id: string, payload: Partial<Parent>) => {
    const res = await api.put(`/parents/${id}`, payload);
    await fetchParents();
    return res.data.data;
  };

  const deleteParent = async (id: string) => {
    await api.delete(`/parents/${id}`);
    await fetchParents();
  };

  return {
    parents,
    pagination,
    loading,
    error,
    fetchParents,
    createParent,
    updateParent,
    deleteParent,
  };
}
