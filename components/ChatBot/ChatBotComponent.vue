<template>
    <div class="chat-messages">
      <div
        v-for="(msg, index) in chatbotMessages"
        :key="index"
        :class="['chat-message', msg.sender === 'user' ? 'user-message' : 'bot-message']"
      >
        {{ msg.content }}
      </div>
    </div>


    <div class="chat-input-container">
      <textarea
        class="chat-input"
        v-model="currentMessage"
        @keydown.enter.prevent="sendMessage(currentMessage)"
        placeholder="Type your message here..."
      ></textarea>
      <button class="send-button" @click="sendMessage">
        <img src="https://img.icons8.com/ios-filled/24/ffffff/filled-sent.png" alt="Send Icon" />
      </button>
    </div>
</template>

<script setup>
const { data, token } = useAuth();

const chatbotMessages = ref([]);
const currentMessage = ref('');

const { data: fetchedMessages, error } = await useAsyncData('messages', async () => {
  const response = await fetch('http://localhost:8000/api/chatbot/messages/', {
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }
  return await response.json();
});

if (fetchedMessages.value) {
  chatbotMessages.value = fetchedMessages.value;
}

const sendMessage = async () => {
  if (currentMessage.value.trim() === '') return;

  const message = { content: currentMessage.value.trim(), sender: 'user' }; 

  try {
    const response = await fetch('http://localhost:8000/api/chatbot/messages/', {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const data = await response.json();
    chatbotMessages.value.push(data);  
  } catch (error) {
    console.error(error);
  }

  // Simulation
  setTimeout(() => {
    chatbotMessages.value.push({ content: 'This is a bot response', sender: 'bot' });
  }, 1000);

  currentMessage.value = '';
};
</script>


<style scoped>
.chatbot-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
}

.chat-message {
  padding: 8px;
  border-radius: 5px;
  margin-bottom: 5px;
  max-width: 70%;
}

.user-message {
  background-color: #d1e7ff;
  margin-left: auto;
  text-align: right;
}

.bot-message {
  background-color: #ececec;
  margin-right: auto;
  text-align: left;
}

.chat-input-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #ccc;
  background-color: #f1f1f1;
}

.chat-input {
  flex-grow: 1;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  resize: none;
  height: 60px;
}

.send-button {
  background-color: #ff9d00;
  color: white;
  border: none;
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.send-button:hover {
  background-color: #cc5200;
}

.send-button img {
  width: 20px;
  height: 20px;
}
</style>