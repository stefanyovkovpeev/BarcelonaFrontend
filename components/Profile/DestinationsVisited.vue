<template>
  <div class="destinations-container">
    <h3 class="visited-title">Visited Destinations</h3>
    <hr class="visited-separator" />

    <div class="visited-destinations-wrapper">
      <ul class="visited-destinations">
        <li 
          v-for="(destination, index) in selectedDestinations" 
          :key="destination" 
          @mouseover="showTooltip(index, destination, $event)"
          @mouseleave="hideTooltip"
        >
          {{ destination }}
          <div 
            v-if="tooltipVisible && tooltipIndex === index" 
            class="tooltip" 
            :style="{ top: mouseY + 'px', left: mouseX + 'px' }"
          >
            <p> {{ getVisitTime(destination) }}</p>
            <p> {{ getReview(destination) }}</p>
          </div>
        </li>
      </ul>
    </div>
    <button class="add-button" @click="toggleDestinationsMenu">
      {{ '+' }}
    </button>
    <transition name="slide-down">
      <div v-if="isDestinationsMenuOpen" class="destinations-menu">
        <ul v-if="!selectedForReview">
          <li v-for="destination in destinations" :key="destination">
            <label>
              <input
                type="checkbox"
                v-model="selectedDestination"
                :value="destination"
                @change="prepareReview(destination)"
              />
              {{ destination }}
            </label>
          </li>
        </ul>
        <div v-if="selectedForReview" class="review-form">
          <h4>{{ selectedDestination }}</h4>
          <textarea v-model="newReview" placeholder="Leave a review..."></textarea>
          <button @click="submitReview">Submit Review</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
const { data, token } = useAuth();

const isDestinationsMenuOpen = ref(false);
const destinations = useState('destinations');
const selectedDestinations = ref([]);
const selectedDestination = ref(null);
const selectedForReview = ref(false);
const newReview = ref("");
const tooltipVisible = ref(false);
const tooltipIndex = ref(null);


const destinationsVisited = await useAsyncData('destinationsVisited', () =>
  $fetch(`http://localhost:8000/api/profile/profilevisits/${data.value.id}/`, {
    method: 'GET',
    headers: {
      Authorization: token.value,
      'Content-Type': 'application/json',
    }
  })
);
if (destinationsVisited.data.value) {
  selectedDestinations.value = destinationsVisited.data.value.map(visit => visit.destination_name);
}

const placesVisited =  useState('placesVisited', () => destinationsVisited.data.value.length)

const showTooltip = (index, event) => {
  tooltipVisible.value = true;
  tooltipIndex.value = index;
  
};

const hideTooltip = () => {
  tooltipVisible.value = false;
  tooltipIndex.value = null;
};

const toggleDestinationsMenu = () => {
  isDestinationsMenuOpen.value = !isDestinationsMenuOpen.value;

  if (isDestinationsMenuOpen.value === true) {
    selectedForReview.value = false;
  }
};


const prepareReview = (destination) => {
  selectedDestination.value = destination;
  selectedForReview.value = true;
};

const submitReview = async () => {
  if (selectedDestination.value && newReview.value) {
    try {
      const response = await $fetch(`http://localhost:8000/api/profile/profilevisits/${data.value.id}/`, {
        method: 'POST',
        headers: {
          Authorization: token.value,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: 11,
          review: newReview.value,
        }),
      });

      selectedDestinations.value.push(selectedDestination.value);
      selectedForReview.value = false;
      isDestinationsMenuOpen.value = false;
      newReview.value = '';

    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit the review. Please try again.");
    }
  }
};

const getReview = (destination) => {
  const visit = destinationsVisited.data.value.find(visit => visit.destination_name === destination);
  return visit ? visit.review : 'No review available';
};

const getVisitTime = (destination) => {
  const visit = destinationsVisited.data.value.find(visit => visit.destination_name === destination);
  return visit ? visit.visited_on : 'Not available';
};
</script>

<style scoped>
.destinations-container {
  width: 100%;
  margin-top: 70px;
  max-width: 300px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.visited-title {
  font-size: 1.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 10px;
}

.visited-separator {
  border: none;
  border-bottom: 2px solid #333;
  margin-bottom: 15px;
}

.visited-destinations-wrapper {
  max-height: 200px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  margin-bottom: 10px;
  overscroll-behavior: contain; 
}

.visited-destinations-wrapper::-webkit-scrollbar {
  display: none;
}

.visited-destinations {
  list-style: none;
  padding: 0;
  margin: 0;
}

.visited-destinations li {
  padding: 10px;
  margin: 5px 0;
  background-color: #ff9d00;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  position: relative;
  transition: background-color 0.3s ease;
}

.visited-destinations li:hover {
  background-color: #cc5200;
}

.tooltip {
  position: relative;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-size: 0.9rem;
  white-space: nowrap;
  z-index: 1000;
  pointer-events: none;
  transition: opacity 0.2s ease-in-out;
}

.add-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #ff9d00;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px;
}

.add-button:hover {
  background-color: #cc5200;
}

.destinations-menu {
  margin-top: 15px;
  background-color: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  max-width: 300px;
  overflow-y: auto;
}

.review-form h4 {
  font-size: 1.2rem;
  color: #333;
}

.review-form textarea {
  width: 90%;
  height: 100px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  margin-bottom: 10px;
  resize: none;
}

.review-form button {
  padding: 10px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.review-form button:hover {
  background-color: #388e3c;
}
</style>