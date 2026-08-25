import { useState, useEffect, useCallback } from "react";

import productsApi from "../api/productsApi";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await productsApi.getPaged(
        pageNumber,
        pageSize,
        searchTerm || undefined,
      );

      setProducts(data.items);
      setTotalCount(data.totalCount);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [pageNumber, pageSize, searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = useCallback((value) => {
    setSearchTerm((currentSearchTerm) => {
      if (currentSearchTerm === value) {
        return currentSearchTerm;
      }

      setPageNumber(0);
      return value;
    });
  }, []);

  const handlePageSizeChange = useCallback((newPageSize) => {
    setPageNumber(0);
    setPageSize(newPageSize);
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    pageNumber,
    pageSize,
    totalCount,
    setPageNumber,
    setPageSize: handlePageSizeChange,
    searchTerm,
    setSearchTerm: handleSearch,
  };
}
