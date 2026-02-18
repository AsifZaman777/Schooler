"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import type { Notice, Pagination } from "@/types";

export function useNotices(initialParams = {}) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotices = useCallback(
    async (params: Record<string, unknown> = initialParams) => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/notices", {
          params: { page: 1, limit: 20, ...params },
        });
        setNotices(res.data.data);
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
    fetchNotices();
  }, [fetchNotices]);

  const createNotice = async (payload: Partial<Notice>) => {
    const res = await api.post("/notices", payload);
    await fetchNotices();
    return res.data.data;
  };

  const updateNotice = async (id: string, payload: Partial<Notice>) => {
    const res = await api.put(`/notices/${id}`, payload);
    await fetchNotices();
    return res.data.data;
  };

  const deleteNotice = async (id: string) => {
    await api.delete(`/notices/${id}`);
    await fetchNotices();
  };

  return {
    notices,
    pagination,
    loading,
    error,
    fetchNotices,
    createNotice,
    updateNotice,
    deleteNotice,
  };
}
