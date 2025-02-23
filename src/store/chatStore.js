import { defineStore } from "pinia";
import api from "@/api";

export const useChatStore = defineStore("chat", {
    state: () => ({
        sessions: [],
        messages: {}, // key: session id
    }),

    actions: {
        async getSessions(username) {
            try {
                const res = await api.get(`/chat-session/${username}`);
                this.sessions = res.data;
            } catch (error) {
                console.error('Failed to get sessions:', error);
                this.sessions = [];
            }
        },

        async createSession(username) {
            const res = await api.post("/chat-session", {
                username: username,
            });
            const newSession = res.data;
            this.sessions.unshift(newSession);
            this.messages[newSession.session_id] = [];
            return newSession;
        },

        async deleteSession(sessionID) {
            await api.delete(`/chat-session/${sessionID}`);
            this.sessions = this.sessions.filter(s => s.session_id !== sessionID);
            delete this.messages[sessionID];
        },

        async getChatHistory(sessionID) {
            if (!this.messages[sessionID]) {
                const res = await api.get(`/chat-history/${sessionID}`);
                this.messages[sessionID] = res.data;
            }
            return this.messages[sessionID];
        },

        async sendChatRequest({ username, sessionID, message, model, mode }) {
            if (!this.messages[sessionID]) {
                this.messages[sessionID] = [];
            }

            try {
                this.addUserMessage(sessionID, message);
                this.addAIMessage(sessionID);

                const response = await fetch(`http://localhost:8088/api/chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({
                        username: username,
                        session_id: sessionID,
                        query: message,
                        model: model,
                        mode: mode,
                    })
                });
                if (!response.ok) {
                    throw new Error(`HTTP request failed with status code: ${response.status}`);
                }

                await this.parseSSEStream(response.body, sessionID);
            } catch (error) {
                console.error('Send request Error:', error)
                this.addErrorMessage(sessionID);
            }
        },

        async parseSSEStream(stream, sessionID) {
            const reader = stream.getReader();
            const decoder = new TextDecoder();
            const flag = true;
            let buffer = '';

            while (flag) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                let eventEnd;
                while ((eventEnd = buffer.indexOf('\n\n')) >= 0) {
                    this.parseEventBlock(buffer.slice(0, eventEnd), sessionID);
                    buffer = buffer.slice(eventEnd + 2);
                }
            }

            if (buffer.trim()) {
                this.parseEventBlock(buffer, sessionID);
            }
        },

        parseEventBlock(rawBlock, sessionID) {
            let eventType = 'chunk';
            const dataLines = [];

            rawBlock.split(/\r?\n/).forEach(line => {
                if (line.startsWith('event:')) {
                    eventType = line.slice(6).trim();
                } else if (line.startsWith('data:')) {
                    dataLines.push(line.slice(5));
                }
            });

            this.processEvent(eventType, dataLines.join('\n'), sessionID);
        },

        processEvent(event, data, sessionID) {
            if (event === 'result') {
                this.$patch((state) => {
                    const sessionMessages = state.messages[sessionID];
                    const lastMessage = sessionMessages[sessionMessages.length - 1];
                    if (lastMessage?.message_type === 'ai') {
                        lastMessage.content += data;
                    }
                });
            } else if (event === 'error') {
                throw new Error(data);
            } else {
                console.warn('Unknown event type:', event);
            }
        },

        addUserMessage(sessionID, message) {
            this.messages[sessionID].push({
                message_type: 'user',
                content: message,
            });
        },

        addAIMessage(sessionID) {
            this.messages[sessionID].push({
                message_type: 'ai',
                content: '',
            });
        },

        addErrorMessage(sessionID) {
            this.messages[sessionID].push({
                message_type: 'ai',
                content: '服务器错误，请稍后重试',
            });
        },
    }
});
