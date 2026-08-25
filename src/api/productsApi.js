import axiosClient from "./axiosClient";

const productsApi = {
    getAll: () => axiosClient.get("/products"),
    getPaged: (pageNumber, pageSize, searchTerm) =>
        axiosClient.get("/products/paged", { params: { pageNumber, pageSize, searchTerm } }),
    getById: (id) => axiosClient.get(`/products/${id}`),
    getByBarcode: (barcode) => axiosClient.get(`/products/${barcode}/barcode`),

    create: (formData) =>
        axiosClient.post("/products", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    update: (id, formData) =>
        axiosClient.put(`/products/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    remove: (id) => axiosClient.delete(`/products/${id}`),
};

export default productsApi;