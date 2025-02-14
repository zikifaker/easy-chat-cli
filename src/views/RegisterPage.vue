<template>
  <div class="register-container">
    <h2>注册</h2>
    <form @submit.prevent="register">
      <input v-model="username" placeholder="用户名" required />
      <input v-model="password" type="password" placeholder="密码" required />
      <input v-model="email" type="email" placeholder="邮箱" required />
      <button type="submit">注册</button>
    </form>
    <p>已有账号？
      <router-link to="/login">去登录</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

const username = ref("");
const password = ref("");
const email = ref("");
const userStore = useUserStore();
const router = useRouter();

const register = async () => {
  const success = await userStore.register(username.value, password.value, email.value);
  if (success) {
    Swal.fire({
      icon: "success",
      title: "注册成功",
      text: "请登录",
      confirmButtonText: "确定"
    }).then(() => {
      router.push("/login");
    });
  } else {
    await Swal.fire({
      icon: "error",
      title: "注册失败",
      text: "请重试",
      confirmButtonText: "确定"
    });
  }
};
</script>

<style scoped>
.register-container {
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