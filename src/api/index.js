import axios from "axios";
import { router } from "@/router";

const api = axios.create({
    baseURL: "http://localhost:8088/api",
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        if (config.url !== '/login' && config.url !== '/register') {
            const token = localStorage.getItem("token");
            if (!token) {
                return Promise.reject(new Error('No token found'));
            }
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            router.push("/login");
        }
        return Promise.reject(error);
    }
);

export default api;
