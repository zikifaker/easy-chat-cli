<template>
  <div class="sidebar">
    <div class="new-chat" @click="createNewChat">
      <span>➕ 新建对话</span>
    </div>
    <div class="chat-list">
      <div v-for="session in chatSessions" :key="session.session_id"
        :class="['chat-item', { active: session.session_id === activeSessionID }]">
        <div class="chat-content" @click="selectSession(session.session_id)">
          <span class="chat-name">{{ session.session_name || "未命名会话" }}</span>
        </div>
        <div class="delete-icon" @click.stop="deleteSession(session.session_id)">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor"
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useChatStore } from "@/store/chatStore";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2"; // 引入 SweetAlert2

const chatStore = useChatStore();
const router = useRouter();
const route = useRoute();

const chatSessions = computed(() => chatStore.sessions);
const activeSessionID = computed(() => route.params.session_id);

const selectSession = (sessionID) => {
  router.push(`/chat/${sessionID}`);
};

const createNewChat = () => {
  router.push('/chat');
};

const deleteSession = async (sessionID) => {
  const result = await Swal.fire({
    title: "永久删除会话",
    text: "本条会话数据将被永久删除，确定要删除吗？",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    reverseButtons: true
  });

  if (result.isConfirmed) {
    try {
      await chatStore.deleteSession(sessionID);
      if (activeSessionID.value === sessionID) {
        router.push('/chat');
      }
      Swal.fire({
        title: "删除成功",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Failed to delete session:', error);
      Swal.fire({
        title: "删除失败",
        text: "请稍后再试",
        icon: "error",
        timer: 1500,
        showConfirmButton: false
      });
    }
  }
};
</script>

<style scoped>
.sidebar {
  width: 240px;
  height: 100%;
  background: var(--background-color);
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-right: 1px solid var(--border-color);
  box-sizing: border-box;
}

.new-chat {
  padding: 12px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  background: rgba(26, 115, 232, 0.1);
  color: var(--primary-color);
  border: 1px solid rgba(26, 115, 232, 0.2);
  transition: all 0.3s;
}

.new-chat:hover {
  background: rgba(26, 115, 232, 0.2);
  border-color: rgba(26, 115, 232, 0.3);
}

.chat-list {
  flex: 1;
  margin-top: 10px;
  overflow-y: auto;
  min-height: 0;
}

.chat-item {
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.chat-content {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 4px 0;
}

.delete-icon {
  opacity: 0;
  color: #666;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.chat-item:hover .delete-icon {
  opacity: 1;
}

.delete-icon:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: #d32f2f;
}

.active {
  background: var(--hover-color);
  border-left: 3px solid var(--primary-color);
}

.active .chat-name {
  color: var(--primary-color);
  font-weight: 500;
}

.chat-name {
  flex: 1;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
