import axiosClient from "./axiosClient";

const customersApi = {
    // GET /api/customers
    getAll: () => axiosClient.get("/customers"),
};

export default customersApi;