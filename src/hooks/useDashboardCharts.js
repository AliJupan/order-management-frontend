import { useState, useEffect, useCallback } from "react";
import dashboardApi from "../api/dashboardApi";

export default function useDashboardCharts() {
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCharts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardApi.getCharts();
      setCharts(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCharts();
  }, [fetchCharts]);

  return { charts, loading, error };
}
