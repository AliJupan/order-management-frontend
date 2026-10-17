import axiosClient from "./axiosClient.js";

const ordersApi = {
  getAll: () => axiosClient.get("/orders"),
  getById: (id) => axiosClient.get(`/orders/${id}`),
  getPaged: (
    pageNumber,
    pageSize,
    searchTerm,
    orderStatus,
    paidStatus,
    orderType,
  ) =>
    axiosClient.get("/orders/paged", {
      params: {
        pageNumber,
        pageSize,
        searchTerm,
        orderStatus,
        paidStatus,
        orderType,
      },
    }),

  createOrder: async (order) => {
    const response = await axiosClient.post("/orders", order);
    return response.data;
  },

  update: (id, formData) =>
    axiosClient.put(`/orders/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateStatus: (orderId, status) =>
    axiosClient.put(`/orders/${orderId}/status`, status, {
      headers: { "Content-Type": "application/json" },
    }),

  recordPayment: (orderId, amount) =>
    axiosClient.put(`/orders/${orderId}/payments`, { amount }),

  remove: (id) => axiosClient.delete(`/orders/${id}`),
  export: (id) => axiosClient.get(`/orders/${id}/export`, { responseType: "blob" }),
};

export default ordersApi;
