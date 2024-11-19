<template>
  <transition name="slide-down" mode="out-in">
    <div v-if="isTopMenuOpen" class="top-navbar">
      <div class="time-profile-container">
        <NuxtLink to="/profile" class="profile-icon-container">
          <img src="https://img.icons8.com/ios-filled/50/ffffff/user-male-circle.png" alt="Profile Icon" />
        </NuxtLink>
        <div class="clock">{{ time }}</div>
      </div>
      <div class="date-container">
        <div class="date">{{ date }}</div>
        <div class="weekday">{{ weekday }}</div>
      </div>
      <div class="weather">Weather: {{ weather }}</div>
      <div class="toggle-arrow-right" @click="toggleDropdownMenu">
        <div class="arrow-right">{{ isDropdownOpen ? "▲" : "▼" }}</div>
      </div>
      <NuxtLink to="/" class="navbar-button exit-button">Back</NuxtLink>
    </div>
  </transition>

  <transition name="fade">
    <div v-if="isDropdownOpen" class="dropdown-container">
      <div class="dropdown-menu">
        <button @click="setMapToLoad('restaurants')" class="menu-link">Restaurants & Street Food</button>
        <button @click="setMapToLoad('clubs')" class="menu-link">Bars & Clubs</button>
        <button @click="setMapToLoad('shops')" class="menu-link">Shops</button>
        <button @click="setMapToLoad('main_map')" class="menu-link">Destinations Map</button>
      </div>
    </div>
  </transition>
</template>

<script setup>
const { token } = useAuth();

const isTopMenuOpen = ref(true);
const isDropdownOpen = ref(false);
const route = useRoute();

const time = ref("");
const date = ref("");
const weekday = ref("");
const weather = ref("");

const mapToLoadDay1 = useState("mapToLoadDay1", () => "main_map");
const mapToLoadDay2 = useState("mapToLoadDay2", () => "main_map");
const mapToLoadDay3 = useState("mapToLoadDay3", () => "main_map");

const currentDay = computed(() => {
  if (route.path.includes("/Days/DayOne")) return "DayOne";
  if (route.path.includes("/Days/DayTwo")) return "DayTwo";
  if (route.path.includes("/Days/DayThree")) return "DayThree";
  return null; 
});

// Function to set the relevant map state based on the current day
const setMapToLoad = (mapType) => {
  if (currentDay.value === "DayOne") {
    mapToLoadDay1.value = mapType;
  } else if (currentDay.value === "DayTwo") {
    mapToLoadDay2.value = mapType;
  } else if (currentDay.value === "DayThree") {
    mapToLoadDay3.value = mapType;
  }
};

// Watch for changes in currentDay to ensure proper map loading logic
watch(currentDay, (newDay) => {
  console.log(`Current day changed to: ${newDay}`);
  if (newDay === "DayOne") {
    console.log(`Map for Day 1: ${mapToLoadDay1.value}`);
  } else if (newDay === "DayTwo") {
    console.log(`Map for Day 2: ${mapToLoadDay2.value}`);
  } else if (newDay === "DayThree") {
    console.log(`Map for Day 3: ${mapToLoadDay3.value}`);
  }
});



const updateClock = () => {
  const dateObj = new Date();
  const timeOptions = { hour: "2-digit", minute: "2-digit", second: "2-digit" };
  const dateOptions = { year: "numeric", month: "long", day: "numeric" };
  const weekdayOptions = { weekday: "long" };

  time.value = dateObj.toLocaleTimeString(undefined, timeOptions);
  date.value = dateObj.toLocaleDateString(undefined, dateOptions);
  weekday.value = dateObj.toLocaleDateString(undefined, weekdayOptions);
};

const fetchWeather = async () => {
  try {
    const response = await $fetch("http://localhost:8000/api/weather/", {
      method: "GET",
      headers: {
        Authorization: token.value,
        "Content-Type": "application/json",
      },
    });

    console.log(response.weather);
    let roundedTemp = Math.round(response.main.temp);
    weather.value = `${response.weather[0].main}, ${roundedTemp}°C`;
  } catch (error) {
    console.error("Error fetching weather:", error);
    weather.value = "Failed to fetch weather data";
  }
};

const toggleDropdownMenu = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

onMounted(() => {
  // Update time immediately
  updateClock();

  // Set an interval to update the clock every second
  setInterval(updateClock, 1000);

  // Fetch weather only once during component mount
  fetchWeather();

  // Optionally, set a periodic interval for weather updates (e.g., every 5 minutes)
  setInterval(() => {
    fetchWeather();
  }, 5 * 60 * 1000); // 5 minutes in milliseconds
});
</script>

<style scoped>
/* Top Navbar */
.top-navbar {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 39px;
  background-color: rgb(35, 35, 35);
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

.date,
.weekday {
  font-size: 18px;
}

.weather {
  font-size: 18px;
  margin-left: auto;
  margin-right: 240px;
}

.navbar-button {
  background-color: #ff6600;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
}

.navbar-button:hover {
  background-color: #cc5200;
}

/* Dropdown Arrow */
.toggle-arrow-right {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ff6600;
  color: white;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  z-index: 150;
}

.arrow-right {
  font-size: 24px;
  transition: transform 0.3s ease;
}

.toggle-arrow-right:hover {
  background-color: #cc5200;
}

/* Dropdown Container */
.dropdown-container {
  position: absolute;
  top: 49px; /* Slightly below the navbar */
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 999;
}

.dropdown-menu {
  background-color: rgba(35, 35, 35, 0.9);
  border-radius: 5px;
  padding: 10px;
  display: flex;
  gap: 15px;
}

/* Dropdown Menu Buttons */
.menu-link {
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  background-color: #ff6600; /* Orange background */
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.menu-link:hover {
  background-color: #cc5200;
}

/* Profile Icon */
.profile-icon-container {
  position: relative;
  margin-left: 30px;
  margin-right: 200px;
  cursor: pointer;
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

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.5s ease, opacity 1s ease;
}

.slide-down-enter,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>