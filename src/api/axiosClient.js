import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "https://localhost:5001/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach auth token if present
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Centralized error handling
axiosClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error("API error:", error.response?.data || error.message);

        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;