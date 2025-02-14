<template>
  <div class="chat-header">
    <h2>Easy Chat</h2>
    <div class="user-menu">
      <div class="user-icon" @click="toggleDropdown">
        <img :src="userAvatar" alt="用户" />
      </div>
      <div v-if="showDropdown" class="dropdown-menu">
        <div class="user-info">
          <span>{{ userStore.username }}</span>
        </div>
        <div class="dropdown-item" @click="logout">
          <span>退出登录</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";

const router = useRouter();
const userStore = useUserStore();
const showDropdown = ref(false);
const userAvatar = "/default-avatar.png";

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const logout = () => {
  userStore.logout();
  router.push('/login');
};

const closeDropdown = (e) => {
  if (!e.target.closest('.user-menu')) {
    showDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});
</script>

<style scoped>
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: var(--background-color);
  color: var(--text-color);
  border-bottom: 1px solid var(--border-color);
  height: 40px;
}

h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.user-icon {
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s ease-in-out;
}

.user-icon img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-color);
  transition: border 0.2s ease-in-out;
}

.user-icon:hover {
  transform: scale(1.05);
}

.user-icon:hover img {
  border-color: var(--primary-color);
}

.user-menu {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 1000;
}

.user-info {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  font-weight: 500;
}

.dropdown-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: var(--hover-color);
  color: var(--primary-color);
}
</style>
