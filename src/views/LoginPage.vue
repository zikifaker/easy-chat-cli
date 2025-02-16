<template>
  <div class="login-container">
    <h2>登录</h2>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="用户名" required />
      <input v-model="password" type="password" placeholder="密码" required />
      <button type="submit">登录</button>
    </form>
    <p>还没有账号？
      <router-link to="/register">去注册</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const userStore = useUserStore();
const router = useRouter();

const login = async () => {
  const success = await userStore.login(username.value, password.value);
  if (success) {
    router.push("/chat");
  } else {
    alert("登录失败");
  }
};
</script>

<style scoped>
.login-container {
  max-width: 300px;
  margin: 100px auto;
  text-align: center;
}

input {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
}
</style>
