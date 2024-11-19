<template>
  <div class="register-container">
    <div class="background">
      <div class="overlay">
        <h1>3 Days In Barcelona</h1>
        <nuxt-link to="/login" class="back-button">Back</nuxt-link>
        <div class="register-box">
          <h2>Register</h2>
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
    </div>
  </div>
</template>

<script setup>

const username = ref('')
const email = ref('')
const first_name = ref('')
const last_name = ref('')
const password = ref('')
const passwordConfirm = ref('')

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
    const response = await $fetch('http://localhost:8000//api/register/', {
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
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('/media/barcelona.png') no-repeat center center;
  background-size: cover;
  background-color: rgb(255, 254, 254); 
}

.overlay {
  background-color: rgba(0, 0, 0, 0.6); 
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

h1 {
  font-size: 3rem;
  color: orange;
  margin-bottom: 20px;
}

.back-button {
  background-color: transparent;
  color: white;
  border: 1px solid orange;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
}

.back-button:hover {
  background-color: rgba(255, 140, 0, 0.5); 
}

.register-box {
  background-color: black;
  padding: 30px;
  border-radius: 8px;
  width: 85%;
  max-width: 400px;
  margin-top: -20px; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

h2 {
  color: orange;
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
  border: 1px solid orange;
  font-size: 16px;
  background-color: beige;
}

input:focus {
  border-color: #ff8c00; 
  outline: none;
}

.register-button {
  background-color: orange;
  color: black;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  font-size: 18px;
  margin-top: 10px;
}

.register-button:hover {
  background-color: #ff8c00; 
}

.register-button:focus {
  outline: none;
}
</style>