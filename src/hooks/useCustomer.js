
import { useCallback, useEffect, useMemo, useState } from "react";
import customersApi from "../api/customersApi.js";

export default function useCustomers() {
  const [allCustomers, setAllCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTermState] = useState("");

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await customersApi.getAll();
      const data = response?.data ?? response;

      const customerList = Array.isArray(data)
        ? data
        : data?.items ?? [];

      setAllCustomers(customerList);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const setSearchTerm = useCallback((value) => {
    setSearchTermState(value);
    setPageNumber(0);
  }, []);

  const filteredCustomers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return allCustomers;
    }

    return allCustomers.filter((customer) =>
      [
        customer.name,
        customer.fullName,
        customer.email,
        customer.phone,
        customer.address,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(search)
      )
    );
  }, [allCustomers, searchTerm]);

  const totalCount = filteredCustomers.length;

  const customers = useMemo(() => {
    const startIndex = pageNumber * pageSize;

    return filteredCustomers.slice(
      startIndex,
      startIndex + pageSize
    );
  }, [filteredCustomers, pageNumber, pageSize]);

  const removeCustomer = useCallback(
    async (id) => {
      try {
        await customersApi.delete(id);

        setAllCustomers((previousCustomers) =>
          previousCustomers.filter((customer) => customer.id !== id)
        );

        return true;
      } catch (err) {
        console.error("Failed to delete customer:", err);
        throw err;
      }
    },
    []
  );

  return {
    customers,
    loading,
    error,
    refetch,

    pageNumber,
    pageSize,
    totalCount,
    setPageNumber,
    setPageSize,

    searchTerm,
    setSearchTerm,

    removeCustomer,
  };
}
