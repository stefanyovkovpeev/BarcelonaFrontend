<template>
  <div class="login-container">
    <div class="background">
      <div class="overlay">
        <h1>3 Days In Barcelona</h1>
        <div class="login-box">
          <h2>Login Page</h2>
          <form @submit.prevent="handleLogin">
            <input v-model="username" type="text" placeholder="Username">
            <input v-model="password" type="password" placeholder="Password">
            <button type="submit">Sign In</button>
          </form>
          <div class="buttons">
            <nuxt-link to="/register" class="button">Register</nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { signIn  } = useAuth()

const username = ref('')
const password = ref('')

const handleLogin = async () => {
  console.log('initiated')
  try {
    await signIn({ username: username.value, password: password.value })
  } catch (error) {
    console.error('Login failed:', error)
  }
}

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/'
  }
})
</script>


<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('/media/barcelona.png') no-repeat center center;
  background-size: cover;
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

.login-box {
  background-color: black;
  padding: 30px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
}

h2 {
  color: orange;
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid orange;
  border-radius: 5px;
  background-color: #222;
  color: white;
}

button {
  width: 100%;
  padding: 10px;
  background-color: orange;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #ff8c00;
}

.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.buttons .button {
  width: 100%;
  text-align: center;
  padding: 10px;
  background-color: orange;
  color: black;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
}

.buttons .button:hover {
  background-color: #ff8c00;
}
</style>