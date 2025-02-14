<template>
  <div class="chat-input-container">
    <div class="chat-input">
      <select v-model="selectedModel" class="model-selector">
        <option value="qwen-plus">qwen-plus</option>
        <option value="qwen-max">qwen-max</option>
        <option value="deepseek-v3">deepseek-v3</option>
      </select>
      <textarea v-model="message" @keydown.enter.prevent="handleEnter" @input="adjustHeight" ref="textarea"
        placeholder="输入消息..." rows="1"></textarea>
      <button @click="send" :disabled="!message.trim()">
        <svg viewBox="0 0 24 24">
          <path fill="currentColor" d="M2 21l21-9L2 3v7l15 2l-15 2v7Z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, ref } from "vue";

const message = ref("");
const selectedModel = ref("qwen-plus");
const textarea = ref(null);
const emit = defineEmits(["sendMessage"]);

const adjustHeight = () => {
  const el = textarea.value;
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
};

const handleEnter = (e) => {
  if (e.shiftKey) {
    return;
  }
  send();
};

const send = () => {
  if (message.value.trim()) {
    emit("sendMessage", { message: message.value, model: selectedModel.value });
    message.value = "";
    if (textarea.value) {
      textarea.value.style.height = 'auto';
    }
  }
};
</script>

<style scoped>
.chat-input-container {
  padding: 20px;
  background: var(--background-color);
  border-top: 1px solid var(--border-color);
  flex-shrink: 0;
}

.chat-input {
  display: flex;
  max-width: 768px;
  margin: 0 auto;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  align-items: flex-end;
}

.model-selector {
  padding: 8px;
  border: none;
  background: var(--background-color);
  color: var(--text-color);
  font-size: 14px;
  border-radius: 6px;
  outline: none;
  margin: 6px;
  cursor: pointer;
}

textarea {
  flex: 1;
  padding: 12px 16px;
  border: none;
  outline: none;
  background: transparent;
  color: var(--text-color);
  font-size: 16px;
  line-height: 1.5;
  max-height: 200px;
  resize: none;
  font-family: inherit;
  overflow-y: auto;
}

textarea::placeholder {
  color: #999;
}

button {
  padding: 8px 12px;
  margin: 4px;
  background: var(--primary-color);
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background: #1557b0;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

button svg {
  width: 20px;
  height: 20px;
}
</style>
