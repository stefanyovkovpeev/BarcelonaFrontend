<template>
  <div class="register-container">
    <div class="register-box">
      <h1>Register</h1>
      <form @submit.prevent="handleRegister">
        <div class="input-group">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="input-group">
          <label for="first_name">First Name</label>
          <input type="text" id="first_name" v-model="first_name" required />
        </div>
        <div class="input-group">
          <label for="last_name">Last Name</label>
          <input type="text" id="last_name" v-model="last_name" required />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div class="input-group">
          <label for="passwordConfirm">Confirm Password</label>
          <input type="password" id="passwordConfirm" v-model="passwordConfirm" required />
        </div>
        <button type="submit" class="register-button">Register</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const username = ref('')
const email = ref('')
const first_name = ref('')
const last_name = ref('')
const password = ref('')
const passwordConfirm = ref('')
const router = useRouter()

const handleRegister = async () => {
  if (password.value !== passwordConfirm.value) {
    alert('Passwords do not match!')
    return
  }

  const registrationData = {
    username: username.value,
    email: email.value,
    first_name: first_name.value,
    last_name: last_name.value,
    password: password.value,
    password2: passwordConfirm.value,
  }

  try {
    const response = await $fetch('/api/register', {
      method: 'POST',
      body: registrationData,
    })

    if (response.success) {
      alert('Registration successful!')
      router.push('/login')
    } else {
      alert(`Registration failed: ${response.message}`)
    }
  } catch (error) {
    console.error('Registration failed:', error)
  }
}

definePageMeta({
  auth: { unauthenticatedOnly: true }
})
</script>
<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5dc;
}

.register-box {
  background-color: #fefefe;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

h1 {
  color: #4682b4; 
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  color: #5f6368; 
  margin-bottom: 5px;
  display: block;
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
}

input:focus {
  border-color: #4682b4; 
  outline: none;
}

.register-button {
  background-color: #4682b4;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  font-size: 18px;
  margin-top: 10px;
}

.register-button:hover {
  background-color: #5a9bd5; 
}

.register-button:focus {
  outline: none;
}
</style>