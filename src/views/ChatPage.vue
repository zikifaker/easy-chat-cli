<template>
  <div class="chat-container">
    <Sidebar @selectSession="loadChatSession" />
    <div class="chat-main">
      <ChatHeader @updateModel="setModel" />
      <ChatMessages :messages="messages" />
      <ChatInput @sendMessage="sendMessage" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useChatStore } from "@/store/chatStore";
import Sidebar from "@/components/SideBar.vue";
import ChatHeader from "@/components/ChatHeader.vue";
import ChatMessages from "@/components/ChatMessages.vue";
import ChatInput from "@/components/ChatInput.vue";
import { useUserStore } from "@/store/userStore";

const route = useRoute();
const router = useRouter();
const chatStore = useChatStore();
const userStore = useUserStore();
const messages = ref([]);
const selectedModel = ref('qwen-plus');

watch(
  () => route.params.session_id,
  async (sessionID) => {
    if (sessionID) {
      messages.value = await chatStore.getChatHistory(sessionID);
    } else {
      messages.value = [];
    }
  },
  { immediate: true }
);

onMounted(async () => {
  if (!localStorage.getItem("token")) {
    await router.push("/login");
    return;
  }
  await chatStore.getSessions(userStore.username);
});

const sendMessage = async (message) => {
  try {
    if (!route.params.session_id) {
      const session = await chatStore.createSession(userStore.username);
      await router.push(`/chat/${session.session_id}`);
    }

    const chatRequest = {
      username: userStore.username,
      sessionID: route.params.session_id,
      message: message,
      model: selectedModel.value,
    };

    await chatStore.sendChatRequest(chatRequest);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

const setModel = (model) => {
  selectedModel.value = model;
};
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100%;
  background: var(--background-color);
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--background-color);
  color: var(--text-color);
  height: 100%;
  overflow: hidden;
}
</style>
