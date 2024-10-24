<template>
    <div v-if="isChatOpen" class="chatbox-container">
      <div class="chat-messages">
        <div v-for="(msg, index) in messages" :key="index" class="chat-message">
          {{ msg }}
        </div>
      </div>
      <textarea
        class="chat-input"
        v-model="currentMessage"
        @keydown.enter.prevent="sendMessage"
        placeholder="Type your message here..."
      ></textarea>
      <button class="minimize-button" @click="toggleChat">Minimize</button>
    </div>
  
    <div v-else class="chat-icon-container" @click="toggleChat">
      <img src="https://img.icons8.com/ios-filled/50/ffffff/chat.png" alt="Chat Icon" />
    </div>
  </template>
  
  <script setup>

  
  const isChatOpen = ref(false)
  const messages = ref([])
  const currentMessage = ref('')
  
  const toggleChat = () => {
    isChatOpen.value = !isChatOpen.value
  }
  
  const sendMessage = () => {
    if (currentMessage.value.trim() !== '') {
      messages.value.push(currentMessage.value.trim())
      currentMessage.value = ''
    }
  }
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
    height: 400px;
    background-color: #f1f1f1;
    display: flex;
    flex-direction: column;
    padding: 10px;
    z-index: 200;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }
  
  .chat-messages {
    flex-grow: 1;
    overflow-y: auto;
    margin-bottom: 10px;
  }
  
  .chat-message {
    background-color: #ececec;
    padding: 8px;
    border-radius: 5px;
    margin-bottom: 5px;
  }
  
  .chat-input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border-radius: 5px;
    border: 1px solid #ccc;
    resize: none;
  }
  
  .minimize-button {
    background-color: #ff9d00;
    color: white;
    border: none;
    font-size: 18px;
    cursor: pointer;
    border-radius: 5px;
    padding: 8px;
    margin-top: 10px;
  }
  
  .minimize-button:hover {
    background-color: #cc5200;
  }
  </style>