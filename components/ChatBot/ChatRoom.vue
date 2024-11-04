<template>
  <div class="chatroom-container">
    <div ref="chatMessagesRef" class="chat-messages">
      <div
        v-for="(msg, index) in chatroomMessages"
        :key="index"
        :class="['chat-message', msg.sender === currentUser ? 'user-message' : 'room-message']"
      >
        <span v-if="msg.sender !== currentUser" class="sender-info">
          <NuxtLink 
            :to="`/Profile/${msg.user}`"
            @mouseover="showPreview(msg.user, $event)"
            @mouseleave="hidePreview"
            class="sender-name"
          >
            {{ msg.sender }}
          </NuxtLink>
          <span class="separator">|</span>
          <span class="message-content">{{ msg.content }}</span>
        </span>
        
        <span v-else class="message-content">{{ msg.content }}</span>
      </div>
    </div>

    <div v-if="showingPreview" class="user-preview">
      <img :src="previewUser.profilePicture" alt="Profile Picture" class="preview-picture" />
      <p><strong>{{ previewUser.name }}</strong></p>
      <p>{{ previewUser.bio }}</p>
      <p>Location: {{ previewUser.location }}</p>
      <p>Interests: {{ previewUser.interests.join(', ') }}</p>
      <p>Last online: {{ previewUser.lastOnline }}</p>
    </div>

    <div class="chat-input-container">
      <textarea
        class="chat-input"
        v-model="currentMessage"
        @keydown.enter.prevent="sendMessage"
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


const currentUser = data.value.username;
const currentUserId = data.value.id;
const chatroomMessages = ref([]);
const currentMessage = ref('');
const chatMessagesRef = ref(null);
const showingPreview = ref(false);
const previewUser = ref({});
const previewPosition = ref();


const scrollToBottom = () => {
  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight;
  }
};

onMounted(() => {
  scrollToBottom();
});

watch(chatroomMessages, () => {
  scrollToBottom();
}, { deep: true });

const { data: fetchedChatMessages, error } = await useAsyncData('chatmessages', async () => {
  const response = await fetch('http://localhost:8000/api/chatroom/messages/', {
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

if (fetchedChatMessages.value) {
  chatroomMessages.value = fetchedChatMessages.value;
  console.log('respo with messages',chatroomMessages)
}
  
  const sendMessage = async () => {
  if (currentMessage.value.trim() === '') return;

  const userMessage = { user:currentUserId,content: currentMessage.value.trim(), sender: currentUser };
  chatroomMessages.value.push(userMessage); 

  try {
    const response = await fetch('http://localhost:8000/api/chatroom/messages/', {
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
    scrollToBottom()

  } catch (error) {
    console.error(error);
  }

  currentMessage.value = ''
};

const showPreview = async (userId, event) => {
  // const response = await fetch(`http://localhost:8000/api/user/${userId}/`, {
  //   headers: { 'Authorization': token.value }
  // });
  // const data = await response.json();
  console.log("Hovering over ID:", userId);  

  previewUser.value = {
    id: userId,
    name: "Jane Doe",
    bio: "Lover of travel and food",
    profilePicture: "https://via.placeholder.com/150",
    location: "Barcelona, Spain",
    interests: ["Photography", "Hiking", "Music"],
    lastOnline: "2 hours ago",
  };
  showingPreview.value = true;
  console.log("Preview Data:", previewUser.value); 
};


const hidePreview = () => {
  showingPreview.value = false;
};
  </script>
  
  <style scoped>

.user-preview {
  position: fixed;
  top: 233px; 
  left: 796px; 
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  width: 200px;
  z-index: 1000;
  text-align: left;
  font-size: 14px;
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
}

.user-preview.visible {
  transform: translateX(0);
}

.preview-picture {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.separator {
  font-size: 12px;
  color: #666;
  margin: 0 4px;
}
.sender-name {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  align-self: flex-end;
  padding-right: 4px;
}
  .chatroom-container {
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
  word-break: break-word; 
}
  .user-message {
    background-color: #d1e7ff;
    margin-left: auto;
    text-align: right;
  }
  
  .room-message {
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
  