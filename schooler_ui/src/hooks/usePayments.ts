"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import type { Payment, Pagination } from "@/types/viewModels";

export function usePayments(initialParams = {}) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(
    async (params: Record<string, unknown> = initialParams) => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/payments", {
          params: { page: 1, limit: 20, ...params },
        });
        setPayments(res.data.data);
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
    fetchPayments();
  }, [fetchPayments]);

  const createPayment = async (payload: Partial<Payment>) => {
    const res = await api.post("/payments", payload);
    await fetchPayments();
    return res.data.data;
  };

  const updatePayment = async (id: string, payload: Partial<Payment>) => {
    const res = await api.put(`/payments/${id}`, payload);
    await fetchPayments();
    return res.data.data;
  };

  const deletePayment = async (id: string) => {
    await api.delete(`/payments/${id}`);
    await fetchPayments();
  };

  return {
    payments,
    pagination,
    loading,
    error,
    fetchPayments,
    createPayment,
    updatePayment,
    deletePayment,
  };
}
