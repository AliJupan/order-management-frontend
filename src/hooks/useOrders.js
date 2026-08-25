import { useState, useEffect, useCallback } from "react";
import ordersApi from "../api/ordersApi";

export default function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderStatus, setOrderStatus] = useState(undefined);
  const [paidStatus, setPaidStatus] = useState(undefined);
  const [orderType, setOrderType] = useState(undefined);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ordersApi.getPaged(
        pageNumber,
        pageSize,
        searchTerm || undefined,
        orderStatus,
        paidStatus,
        orderType,
      );
      setOrders(data.items);
      setTotalCount(data.totalCount);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [pageNumber, pageSize, searchTerm, orderStatus, paidStatus, orderType]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    setPageNumber(0);
  }, [searchTerm, orderStatus, paidStatus, orderType]);

  const removeOrder = async (id) => {
    await ordersApi.remove(id);
    await fetchOrders();
  };

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    pageNumber,
    pageSize,
    totalCount,
    setPageNumber,
    setPageSize,
    searchTerm,
    setSearchTerm,
    orderStatus,
    setOrderStatus,
    paidStatus,
    setPaidStatus,
    orderType,
    setOrderType,
    removeOrder,
  };
}
