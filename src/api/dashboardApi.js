import axiosClient from "./axiosClient.js";

const dashboardApi = {
  getSummary: () => axiosClient.get("/dashboard/summary"),
  getCharts: () => axiosClient.get("/dashboard/charts"),
};

export default dashboardApi;
