import { createRouter, createWebHistory } from "vue-router";
import ChatPage from "@/views/ChatPage.vue";
import LoginPage from "@/views/LoginPage.vue";
import RegisterPage from "@/views/RegisterPage.vue";

const routes = [
    { path: "/", redirect: "/chat" },
    { path: "/chat", component: ChatPage, meta: { requiresAuth: true } },
    { path: "/chat/:session_id", component: ChatPage, meta: { requiresAuth: true } },
    { path: "/login", component: LoginPage },
    { path: "/register", component: RegisterPage }
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

// router guard
router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/register'];
    const authRequired = !publicPages.includes(to.path);
    const token = localStorage.getItem("token")

    if (authRequired && !token) {
        return next('/login');
    }

    if (!authRequired && token) {
        return next('/chat');
    }

    next();
});
