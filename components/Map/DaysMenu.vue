<template>
    <!-- Right Days Menu Component -->
    <transition name="slide-right">
        <div v-if="isDaysMenuOpen" class="days-menu">
    <NuxtLink to="Days/DayOne" class="menu-link">Day 1</NuxtLink>
    <NuxtLink to="Days/DayTwo" class="menu-link">Day 2</NuxtLink>
    <NuxtLink to="Days/DayThree" class="menu-link">Day 3</NuxtLink>
    <NuxtLink to="Days/DayFour" class="menu-link">Day 4</NuxtLink>
  </div>
    </transition>
    <div class="toggle-arrow-right" @click="toggleDaysMenu">
      <div class="arrow-right">{{ isDaysMenuOpen ? '▶' : '◀' }}</div>
    </div>
  </template>
  
  <script setup>
  const isDaysMenuOpen = ref(false)
  
  const toggleDaysMenu = () => {
    isDaysMenuOpen.value = !isDaysMenuOpen.value
  }
  
  </script>
  
  <style scoped>
  .days-menu {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    width: 160px;
    background-color: rgba(50, 50, 50, 0.9);
    color: white;
    display: flex;
    flex-direction: column;
    padding: 10px;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
    z-index: 150;
  }

.menu-link {
  color: white;
  background-color: #ff9d00;
  padding: 10px 15px;
  margin: 5px 0;
  border-radius: 5px;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.menu-link:hover {
  background-color: #cc5200;
}
  
  .menu-button {
    background-color: #495057;
    color: white;
    border: none;
    padding: 8px;
    width: 100%;
    text-align: left;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;
  }
  
  .menu-button:hover {
    background-color: #ff6600;
    color: white;
  }
  
  .toggle-arrow-right {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    background-color: #ff6600;
    color: white;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    z-index: 150;
  }
  
  .arrow-right {
    font-size: 24px;
    transition: transform 0.3s ease;
  }
  .toggle-arrow-right:hover {
  background-color: #cc5200;
}


.slide-right-enter-active, .slide-right-leave-active {
  transition: all 0.4s ease;
}

.slide-right-enter, .slide-right-leave-to {
  opacity: 0;
}
  </style>