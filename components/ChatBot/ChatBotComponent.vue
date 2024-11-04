<template>
  <div class="chatbot-container">
    <div ref="chatMessagesRef" class="chat-messages">
      <div
        v-for="(msg, index) in chatbotMessages"
        :key="index"
        :class="['chat-message', msg.sender === currentUser ? 'user-message' : 'bot-message']"
        :title="msg.sender"
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
  </div>
</template>

<script setup>
const { data, token } = useAuth();
const currentUser = data.value.username
const currentUserId = data.value.id

const chatbotMessages = useState('chatbotMessages', () => []);
const currentMessage = ref('');

const chatMessagesRef = ref(null);


const scrollToBottom = () => {
  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight;
  }
};

onMounted(() => {
  scrollToBottom();
});

watch(chatbotMessages, () => {
  scrollToBottom();
}, { deep: true });


const { data: fetchedMessages, error } = await useAsyncData('messages', async () => {
  const response = await fetch(`http://localhost:8000/api/chatbot/messages/?user_id=${currentUserId}`, {
    headers: {
      'Authorization': token.value,
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

  const userMessage = {user:currentUserId, content: currentMessage.value.trim(), sender: currentUser };
  chatbotMessages.value.push(userMessage); 

  try {
    const response = await fetch('http://localhost:8000/api/chatbot/messages/', {
      method: 'POST',
      headers: {
        'Authorization': token.value,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userMessage),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const botResponse = await fetch('http://localhost:8000/api/chatbot/response/', {
      method: 'POST',
      headers: {
        'Authorization': token.value,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userMessage),
    });

    if (!botResponse.ok) {
      throw new Error('Failed to fetch bot response');
    }

    const botMessage = await botResponse.json();
    botMessage.user = currentUserId;
    chatbotMessages.value.push(botMessage);
    const postResponse = await fetch('http://localhost:8000/api/chatbot/messages/', {
      method: 'POST',
      headers: {
        'Authorization': token.value,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(botMessage),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    scrollToBottom()

  } catch (error) {
    console.error(error);
  }

  currentMessage.value = ''
};
</script>


<style scoped>
.chatbot-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
  max-height: 400px;
}

.chat-message {
  max-width: 80%;
  margin-bottom: 5px;
  padding: 8px 12px;
  border-radius: 8px;
  word-wrap: break-word;
  white-space: pre-wrap; 
  word-break: break-word; 
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
  max-height: 100px;
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