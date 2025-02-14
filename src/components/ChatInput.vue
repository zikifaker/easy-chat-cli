<template>
  <div class="chat-input-container">
    <div class="chat-input">
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
    emit("sendMessage", message.value);
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
  border-top: none;
  flex-shrink: 0;
}

.chat-input {
  display: flex;
  max-width: 768px;
  margin: 0 auto;
  background: #F9F9F9; 
  border: 1px solid #E0E0E0; 
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  align-items: center;
  padding: 12px 20px;
}

.model-selector {
  padding: 8px 12px;
  border: 1px solid #D1D1D1;
  background: transparent;
  color: var(--text-color);
  font-size: 14px;
  border-radius: 20px;
  outline: none;
  margin-right: 10px;
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
  max-height: 150px;
  resize: none;
  font-family: inherit;
  overflow-y: auto;
  border-radius: 20px;
}

textarea::placeholder {
  color: #B0B0B0; 
}

button {
  padding: 8px 12px;
  background: var(--primary-color);
  border: none;
  border-radius: 20px; 
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-left: 10px;
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
