import axiosClient from "./axiosClient.js";

const customerApi = {
  getAll: async () => {
    const response = await axiosClient.get("/customers");
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosClient.delete(`/customers/${id}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosClient.get(`/customers/${id}`);
    return response;
  },

  create: async (customer) => {
    return await axiosClient.post("/customers", customer);
  },
};

export default customerApi;
