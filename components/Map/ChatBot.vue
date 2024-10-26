<template>
  <div v-if="isChatOpen" class="chatbox-container">
    <div class="chatbox-header">
      <button class="minimize-button" @click="toggleChat">-</button>
    </div>

    <div class="tab-navigation">
      <button
        :class="{ active: activeTab === 'chatbot' }"
        @click="switchTab('chatbot')"
      >
        Chatbot
      </button>
      <button
        :class="{ active: activeTab === 'chatroom' }"
        @click="switchTab('chatroom')"
      >
        Chatroom
      </button>
    </div>

    <div v-if="activeTab === 'chatbot'">
      <ChatBotComponent />
    </div>
    <div v-else>
      <ChatBotChatRoom />
    </div>
  </div>

  <div v-else class="chat-icon-container" @click="toggleChat">
    <img src="https://img.icons8.com/ios-filled/50/ffffff/chat.png" alt="Chat Icon" />
  </div>
</template>

<script setup>
const isChatOpen = ref(true);
const activeTab = ref('chatbot');

const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value;
};

const switchTab = (tab) => {
  activeTab.value = tab;
};
</script>

<style scoped>
.chat-icon-container {
  position: absolute;
  bottom: 20px;
  right: 150px;
  z-index: 200;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  padding: 10px;
}

.chatbox-container {
  position: absolute;
  bottom: 60px;
  right: 190px;
  width: 550px;
  height: 600px;
  background-color: #f1f1f1;
  display: flex;
  flex-direction: column;
  z-index: 200;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.chatbox-header {
  background-color: rgba(50, 50, 50, 0.9);
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 10px;
}

.minimize-button {
  background: none;
  border: none;
  font-size: 20px;
  color: white;
  cursor: pointer;
  outline: none;
}

.tab-navigation {
  display: flex;
  margin-bottom: 10px;
}

.tab-navigation button {
  flex: 1;
  padding: 10px;
  background-color: #ccc;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 16px;
}

.tab-navigation button.active {
  background-color: #ff9d00;
  color: white;
}

.tab-navigation button:hover {
  background-color: #cc5200;
}
</style>