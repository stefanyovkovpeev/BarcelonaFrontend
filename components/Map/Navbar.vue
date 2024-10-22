<template>
    <!-- Top Navbar Component -->
    <transition name="slide-down" mode="out-in">
      <div v-if="isTopMenuOpen" class="top-navbar">
        <div class="time-profile-container">
            <NuxtLink to="profile" class="profile-icon-container">
            <img src="https://img.icons8.com/ios-filled/50/ffffff/user-male-circle.png" alt="Profile Icon" />
          </NuxtLink>
          <div class="clock">{{ time }}</div>
        </div>
        <div class="date-container">
          <div class="date">{{ date }}</div>
          <div class="weekday">{{ weekday }}</div>
        </div>
        <div class="weather">Weather: {{ weather }}</div>
        <button @click="logoutHandle" class="navbar-button exit-button">Exit</button>
      </div>
    </transition>
    <div class="toggle-arrow-top" @click="toggleTopMenu">
      <div class="arrow-top">{{ isTopMenuOpen ? '▲' : '▼' }}</div>
    </div>
  </template>
  
  <script setup>
  
  const { signOut,token } = useAuth()
  const isTopMenuOpen = ref(true)
  const time = ref('')
  const date = ref('')
  const weekday = ref('')
  const weather = ref("")
  
  const updateClock = () => {
    const dateObj = new Date()
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' }
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    const weekdayOptions = { weekday: 'long' }
  
    time.value = dateObj.toLocaleTimeString(undefined, timeOptions)
    date.value = dateObj.toLocaleDateString(undefined, dateOptions)
    weekday.value = dateObj.toLocaleDateString(undefined, weekdayOptions)
  }
  

  const fetchWeather = async () => {
  try {
    const response = await $fetch('http://localhost:8000/api/weather/', {
      method: 'GET',
      headers: {
        'Authorization': token.value,
        'Content-Type': 'application/json',
      },
    })

    console.log(response.weather)
    let roundedTemp = Math.round(response.main.temp);
    weather.value = `${response.weather[0].main}, ${roundedTemp}°C`
  } catch (error) {
    console.error('Error fetching weather:', error)
    weather.value = 'Failed to fetch weather data'
  }
}


  const toggleTopMenu = () => {
    isTopMenuOpen.value = !isTopMenuOpen.value
  }
  
  const logoutHandle = async () => {
    try {
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }
  
  
  onMounted(() => {
    updateClock()
    setInterval(updateClock, 1000)
    fetchWeather()
  })
  </script>
  
  <style scoped>
  .top-navbar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background-color: rgba(50, 50, 50, 0.9);
    color: white;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1000;
  }
  
  .time-profile-container {
    display: flex;
    align-items: center;
  }
  
  .clock {
    font-size: 24px;
    border: 2px solid white;
    padding: 5px 10px;
    border-radius: 5px;
    margin-right: 10px;
  }
  
  .date-container {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .date, .weekday {
    font-size: 18px;
  }
  
  .weather {
    font-size: 18px;
    margin-left: auto;
    margin-right: 240px;
  }
  
  .navbar-button {
    background-color: #fff;
    color: #007BFF;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .navbar-button:hover {
    background-color: #0056b3;
    color: white;
  }
  
  .exit-button {
    background-color: #ff6600;
    color: white;
    margin-left: 20px;
  }
  
  .exit-button:hover {
    background-color: #cc5200;
  }
  
  .toggle-arrow-top {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    background-color: #ff6600;
    color: white;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    z-index: 1001;
  }
  
  .arrow-top {
    font-size: 24px;
    transition: transform 0.3s ease;
  }
  .toggle-arrow-top:hover {
  background-color: #cc5200;
}
  

  .profile-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-right: 200px;
  }
  
  .profile-icon-container img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 5px;
  }
  
  .profile-icon-container:hover img {
    background-color: #ff6600;
  }


.slide-down-enter-active, .slide-down-leave-active {
  transition: transform 0.5s ease, opacity 1s ease;
}

.slide-down-enter, .slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
  </style>