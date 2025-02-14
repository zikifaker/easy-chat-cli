import { defineStore } from "pinia";
import api from "@/api";

export const useUserStore = defineStore("user", {
    state: () => ({
        username: localStorage.getItem("username") || null,
        token: localStorage.getItem("token") || null,
    }),

    actions: {
        async login(username, password) {
            try {
                const res = await api.post("/login", { username, password });
                localStorage.setItem("username", username);
                localStorage.setItem("token", res.data.token);
                this.username = username;
                this.token = res.data.token;
                api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
                return true;
            } catch (error) {
                console.error("Failed to login:", error);
                return false;
            }
        },

        async register(username, password, email) {
            try {
                await api.post("/register", { username, password, email });
                return true;
            } catch (error) {
                console.error("Failed to register: ", error);
                return false;
            }
        },

        logout() {
            localStorage.removeItem("username");
            localStorage.removeItem("token");
            this.username = null;
            this.token = null;
            delete api.defaults.headers.common["Authorization"];
        },
    },
});
