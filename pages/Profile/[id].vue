<template>
  <div class="profile-page">
    <NuxtLink to="/" class="back-button">BACK</NuxtLink>

    <div class="main-content">
      <div class="profile-header">
        <div class="profile-picture-container">
          <label for="profile-picture-upload" class="profile-picture-label">
            <img
              :src="currentProfilePicture || 'https://via.placeholder.com/150/000000/FFFFFF/?text=No+Image'"
              alt="Profile Picture"
              class="profile-picture"
            />
          </label>

          <div class="nav-buttons">
            <button @click="prevPicture" class="nav-button">❮</button>
            <button @click="nextPicture" class="nav-button">❯</button>
          </div>
        </div>

        <div class="user-info">
          <h2>{{ profile.userName }}</h2>
          <p>{{ profile.userBio }}</p>
          <hr class="separator" />
          <p>Name: {{ profile.Name }}</p>
          <p>Email: {{ profile.userEmail }}</p>
          <p>Country: {{ profile.userCountry }}</p>
          <p>Looking for: {{ profile.userLookingFor }}</p>
          <p>Barcelona places visited: {{ placesVisitedById }}/{{ destinations.length }}</p>
        </div>
      </div>

      <div class="destinations-container">
        <h3 class="visited-title">Visited Destinations</h3>
        <ul class="visited-destinations">
          <li 
            v-for="(destination, index) in selectedDestinations" 
            :key="destination" 
            @mouseover="showTooltip(index, destination, $event)"
            @mouseleave="hideTooltip"
          >
            {{ destination }}
            <div v-if="tooltipVisible && tooltipIndex === index" class="tooltip">
              <p>{{ getVisitTime(destination) }}</p>
              <p>{{ getReview(destination) }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="diary-section">
      <h3>Diary</h3>
      <div class="diary-tabs">
        <button
          v-for="(day, index) in diaryDays"
          :key="index"
          :class="{'active': currentDay === index}"
          @click="setCurrentDay(index)"
        >
          {{ day }}
        </button>
      </div>
      <div class="diary-entry-read-only">
        <p>{{ diaryEntries[currentDay] || "No entry for this day" }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>

const { data, token } = useAuth();
const route = useRoute();
const postId = route.params.id;


const currentDay = ref(0);
const diaryDays = ['Day 1','Day 2', 'Day 3', 'Day 4'];


const setCurrentDay = (dayIndex) => {
  currentDay.value = dayIndex;
};


const { data: destinationsData } = await useAsyncData('destinations', () =>
  $fetch('http://localhost:8000/api/profile/destinations/', {
    method: 'GET',
    headers: {
      'Authorization':token.value,
      'Content-Type': 'application/json',
    }
  })
);

const destinations = useState('destinations', () => 
  destinationsData.value ? destinationsData.value.map((item) => item.destination) : []
);
const selectedDestinations = ref([]);
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

const placesVisitedById = useState('placesVisitedById', () => destinationsVisited.data.value.length);

const showTooltip = (index) => {
  tooltipVisible.value = true;
  tooltipIndex.value = index;
};

const hideTooltip = () => {
  tooltipVisible.value = false;
  tooltipIndex.value = null;
};

const getReview = (destination) => {
  const visit = destinationsVisited.data.value.find(visit => visit.destination_name === destination);
  return visit ? visit.review : 'No review available';
};

const getVisitTime = (destination) => {
  const visit = destinationsVisited.data.value.find(visit => visit.destination_name === destination);
  return visit ? visit.visited_on : 'Not available';
};

const profile = ref({
  userName: '',
  Name: '',
  userBio: '',
  userEmail: '',
  userCountry: '',
  userLookingFor: '',
});

const userProfile = await useAsyncData('userProfile', () =>
  $fetch(`http://localhost:8000/api/profile/${postId}/`, {
    method: 'GET',
    headers: {
      Authorization: token.value,
      'Content-Type': 'application/json',
    }
  })
);

const diaryEntries =  ([
  userProfile.data.value?.diary_day_1 || '',
  userProfile.data.value?.diary_day_2 || '',
  userProfile.data.value?.diary_day_3 || '',
  userProfile.data.value?.diary_day_4 || ''
]);


const { data: userData } = await useAsyncData('userDetail', () =>
  $fetch(`http://localhost:8000/api/profile/detail/${postId}/`, {
    headers: {
      Authorization: token.value, 
      'Content-Type': 'application/json',
    },
  })
);

profile.value = {
  userName: userData.value.username,
  name: `${data.value.first_name} ${data.value.last_name}`,
  userBio: userProfile.data.value?.bio || '',
  userEmail: '',
  userCountry: userProfile.data.value?.country || '',
  userLookingFor: userProfile.data.value?.looking_for || '',
};

const currentPictureIndex = ref(0);

const profile_pictures = ref([]);
const config = useRuntimeConfig();
const Base = config.public.apiBase;

const { data: profilePicturesData, error } = await useAsyncData('profilePictures', () =>
  $fetch(`http://localhost:8000/api/profile/upload/${postId}/`, {
    headers: {
      Authorization: `${token.value}`,
    },
  })
);

if (!error.value) {
  profile_pictures.value = profilePicturesData.value.profile_pictures.map(pic => `${Base}${pic}`);
  currentPictureIndex.value = 0; 
}

const nextPicture = () => {
  currentPictureIndex.value = (currentPictureIndex.value + 1) % profile_pictures.value.length;
};

const prevPicture = () => {
  currentPictureIndex.value = (currentPictureIndex.value - 1 + profile_pictures.value.length) % profile_pictures.value.length;
};

const currentProfilePicture = computed(() => {
  return profile_pictures.value?.[currentPictureIndex.value] || 'https://via.placeholder.com/150/000000/FFFFFF/?text=No+Image';
});
</script>


<style scoped>
.diary-section {
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.diary-section h3 {
  margin-bottom: 10px;
  font-size: 24px;
}

.diary-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.diary-tabs button {
  padding: 10px;
  background-color: #ff9d00;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.diary-tabs button.active {
  background-color: #cc5200;
}

.diary-entry-read-only {
  width: 100%;
  min-height: 200px;
  margin-bottom: 10px;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 18px;
  background-color: #f9f9f9;
  white-space: pre-wrap;
  overflow: hidden;
}
.profile-page {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.back-button {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 8px 12px;
  background-color: #ff9d00;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  font-size: 16px;
}

.main-content {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 20px;
}

.profile-header {
  display: flex;
  width: 70%;
}

.profile-picture-container {
  flex-shrink: 0;
}

.profile-picture {
  width: 400px;
  height: 450px;
  object-fit: contain;
}

.nav-buttons {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.nav-button {
  background-color: #ff9d00;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}

.user-info {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  flex-grow: 1;
}

.separator {
  border: 1px solid #ff9d00;
  margin: 10px 0;
}

.destinations-container {
  max-width: 300px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.visited-title {
  font-size: 1.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 10px;
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
}

.tooltip {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-size: 0.9rem;
  z-index: 1000;
}
</style>