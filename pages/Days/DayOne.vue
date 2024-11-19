<template>
  <div>
    <div class="map-container">
      <iframe
        class="full-screen-map"
        style="border:0"
        loading="lazy"
        allowfullscreen
        referrerpolicy="no-referrer-when-downgrade"
        :src="currentMapUrl"
      ></iframe>
    </div>

    <div class="info-button" @click="toggleInfoContainer">
      ℹ
    </div>

    <transition name="slide-left">
      <div v-if="isInfoContainerOpen" class="info-container">
        <button class="close-button" @click="toggleInfoContainer">X</button>
        <h2>Today's Itinerary</h2>
        <hr class="divider" />
        <p>{{ itineraryInfo }}</p>
      </div>
    </transition>

    <MapNavbarDays />
    <MapChatBot />
    <MapDaysMenu />
  </div>
</template>

<script setup>
const mapToLoadDay1 = useState("mapToLoadDay1", () => "main_map");
const maps = {
  main_map: "https://www.google.com/maps/d/u/0/embed?mid=1ADWvhioNezS6QpaVjQvCyLKUHkpfKWs&ehbc=2E312F&noprof=1",
  restaurants: "https://www.google.com/maps/d/u/0/embed?mid=16Zc4tVaHSa2BtWeOYvQdmD1MNwJNZKY&ehbc=2E312F&noprof=1",
  clubs: "https://www.google.com/maps/d/u/0/embed?mid=1oqO0ErXEZDrcJpD3Akf2AF4SDcHaRqs&ehbc=2E312F&noprof=1",
  shops: "https://www.google.com/maps/d/u/0/embed?mid=1b0HaiUzRC_iE-e2pUBmyRqZG1UNSafs&ehbc=2E312F&noprof=1",
};
const currentMapUrl = ref(maps.main_map);

watch(mapToLoadDay1, (newValue) => {
  if (maps[newValue]) {
    currentMapUrl.value = maps[newValue];
  } else {
    console.warn(`No map found for type: ${newValue}`);
  }
});


const isInfoContainerOpen = ref(true); 
const itineraryInfo = ref("Discover the Gothic Quarter: A Day of Culture, Cuisine, and Charm.\nWelcome to a day in Barcelona's enchanting Gothic Quarter! Begin your adventure by wandering through its maze-like streets, where history whispers from every stone. Marvel at iconic landmarks like the Barcelona Cathedral and Plaça Reial, then dive into the hidden gems of medieval architecture. Indulge in a leisurely lunch at one of the area’s acclaimed restaurants, savoring local tapas or a paella.\nSpend your afternoon exploring boutique shops, quirky stores, and artisan markets. As the sun sets, the Gothic Quarter transforms into a vibrant nightlife hub. Enjoy dinner at a renowned eatery, followed by drinks at a cozy bar or an unforgettable night at one of its lively clubs.\nThis itinerary is your gateway to experiencing the Gothic Quarter's rich culture, culinary delights, and buzzing energy—all in just one day!\n\n\n----------------------------------------------------------\nStart your morning at the Barcelona Aquarium to skip the lines and enjoy its serene marine displays. Next, head to the bustling Mercat de la Boqueria for a quick snack and some shopping. Continue to the stunning Palau de la Música Catalana and explore nearby Gothic Quarter landmarks. End your day with a stroll up La Rambla to Plaça de Catalunya, soaking in the vibrant city atmosphere.");

const toggleInfoContainer = () => {
  isInfoContainerOpen.value = !isInfoContainerOpen.value;
};

onMounted(() => {
  isInfoContainerOpen.value = true;
});
</script>

<style scoped>
.map-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
}

.full-screen-map {
  width: 100%;
  height: 100%;
}

.info-button {
  position: fixed;
  top: calc(50% + 260px); 
  left: 10px;
  transform: translateY(-50%);
  background-color: #ff6600;
  color: white;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 150;
  transition: background-color 0.3s ease;
}

.info-button:hover {
  background-color: #cc5200;
}


.info-container {
  position: fixed;
  top: 50%;
  left: 85px; 
  transform: translateY(-50%);
  width: 300px;
  background-color: #323232;
  color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 200;
}

.info-container h2 {
  margin-bottom: 10px;
  font-size: 18px;
  background-color: #444;
  padding: 10px;
  border-radius: 3px;
}

.divider {
  border: none;
  border-top: 1px solid #ccc;
  margin: 10px 0;
}

.info-container p {
  font-size: 14px;
  line-height: 1.4;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  color: white;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.close-button:hover {
  color: #ff6600;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-left-enter,
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>