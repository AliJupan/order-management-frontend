import { useState, useEffect, useCallback } from "react";
import ordersApi from "../api/ordersApi";

export default function useOrder(id) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState(null);

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await ordersApi.getById(id);
      setOrder(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const recordPayment = async (amount) => {
    setPaymentLoading(true);
    setPaymentError(null);
    try {
      await ordersApi.recordPayment(id, amount);
      await fetchOrder();
    } catch (err) {
      setPaymentError(err);
      throw err; // let the dialog know it failed
    } finally {
      setPaymentLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    setStatusLoading(true);
    setStatusError(null);
    try {
      await ordersApi.updateStatus(id, newStatus);
      await fetchOrder();
    } catch (err) {
      setStatusError(err);
      throw err; // let the select know it failed
    } finally {
      setStatusLoading(false);
    }
  };

  return {
    order,
    loading,
    error,
    recordPayment,
    paymentLoading,
    paymentError,
    updateStatus,
    statusLoading,
    statusError,
  };
}
