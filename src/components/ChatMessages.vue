<template>
  <div class="chat-messages">
    <div class="messages-container" ref="messagesContainer">
      <div v-for="(msg, index) in formattedMessages" :key="index" :class="msgClass(msg.message_type)">
        <div class="message-content">
          <span class="message-text" v-html="msg.content"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, ref, watch, nextTick } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const props = defineProps({ messages: Array });
const messagesContainer = ref(null);
const msgClass = (msgType) => (msgType === 'user' ? 'message user' : 'message ai');

marked.setOptions({
  breaks: true,
  mangle: false,
  headerIds: false,
  gfm: true,
});

const parseMarkdown = (content) => {
  return DOMPurify.sanitize(marked.parse(content));
};

const formattedMessages = computed(() => {
  return props.messages.map(msg => ({
    ...msg,
    content: parseMarkdown(msg.content)
  }));
});

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

watch(() => props.messages, () => {
  nextTick(() => {
    scrollToBottom();
  });
}, { deep: true });
</script>

<style scoped>
.chat-messages {
  flex: 1;
  overflow-y: auto;
  background: var(--background-color);
  padding: 10px;
  margin: 0;
}

.messages-container {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  padding: 0;
  margin: 0;
}

.message {
  display: flex;
  margin-bottom: 20px;
}

.message-content {
  max-width: 80%;
  padding: 0 16px;
  border-radius: 12px;
  font-size: 16px;
  line-height: 1.5;
}

.user {
  justify-content: flex-end;
}

.user .message-content {
  background: var(--primary-color);
  color: white;
}

.ai .message-content {
  background: #f1f1f1;
  color: var(--text-color);
}
</style>