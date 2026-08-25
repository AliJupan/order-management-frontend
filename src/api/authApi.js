import axiosClient from "./axiosClient";

const authApi = {
    login: (credentials) => axiosClient.post("/auth/login", credentials),
};

export default authApi;