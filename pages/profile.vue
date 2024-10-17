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
            <input
              type="file"
              id="profile-picture-upload"
              @change="uploadProfilePicture"
              style="display: none;"
            />
          </label>
          <!-- Navigation buttons below the image -->
          <div class="nav-buttons">
            <button @click="prevPicture" class="nav-button">❮</button>
            <button @click="nextPicture" class="nav-button">❯</button>
          </div>
        </div>
        <div class="user-info">
          <h2>
            <span>{{ profile.userName }}</span>
          </h2>
          
          <div class="bio-container">
            <p v-if="!editMode">{{ profile.userBio }}</p>
            <input
              v-if="editMode"
              type="text"
              v-model="profile.userBio"
              placeholder="Enter your bio"
              class="bio-input"
            />
            <button class="edit-button" @click="toggleEditMode">
              <i class="fa fa-pencil"></i> Edit Bio
            </button>
          </div>

          <hr class="separator" />
          <p>Name: {{ profile.name }}</p>
          <p>Email: {{ profile.userEmail }}</p>
          <p>Country: {{ profile.userCountry }}</p>
          <p>Looking for: {{ profile.userLookingFor }}</p>
          <p>Barcelona places visited: {{ placesVisited }}/{{ destinations.length }}</p>
        </div>
      </div>
      <div class="destinations-container">
        <h3 class="visited-title">Visited Destinations</h3>
        <hr class="visited-separator" />
        <ul class="visited-destinations">
          <li v-for="destination in selectedDestinations" :key="destination">
            {{ destination }}
          </li>
        </ul>
        <button class="add-button" @click="toggleDestinationsMenu">+</button>
        <transition name="slide-down">
          <ul v-if="isDestinationsMenuOpen" class="destinations-menu">
            <li v-for="destination in destinations" :key="destination">
              <label>
                <input
                  type="checkbox"
                  v-model="selectedDestinations"
                  :value="destination"
                  @change="updatePlacesVisited"
                />
                {{ destination }}
              </label>
            </li>
          </ul>
        </transition>
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
      <textarea v-model="diaryEntries[currentDay]" placeholder="Write about your day in Barcelona..."></textarea>
      <button @click="saveDiaryEntry">Save</button>
    </div>
  </div>
</template>


<script setup>
const { data, token } = useAuth();

const profile = ref({
  userName: '',
  Name: '',
  userBio: '',
  userEmail: '',
  userCountry: '',
  userLookingFor: '',
});

const profile_pictures = ref([]);

const currentPictureIndex = ref(0); 
const editMode = ref(false);
const currentDay = ref(0);
const diaryDays = ['Day 1', 'Day 2', 'Day 3', 'Day 4'];

const isDestinationsMenuOpen = ref(false);
const destinations = ref(['Sagrada Familia', 'Park Güell', 'Casa Batlló', 'La Rambla']);
const selectedDestinations = ref([]);
const placesVisited = ref(0);

//User profile info --------
const userProfile = await useAsyncData('userProfile', () =>
  $fetch(`http://localhost:8000/api/profile/${data.value.id}/`, {
    method: 'GET',
    headers: {
      'Authorization': `${token.value}`,
      'Content-Type': 'application/json',
    }
  })
);

profile.value = {
  userName: data.value.username,
  name: `${data.value.first_name} ${data.value.last_name}`,
  userBio: userProfile.data.value.bio || '',
  userEmail: '',
  userCountry: userProfile.data.value.country || '',
  userLookingFor: userProfile.data.value.looking_for || '',
};

const diaryEntries = [
  userProfile.data.value.diary_day_1,
  userProfile.data.value.diary_day_2,
  userProfile.data.value.diary_day_3,
  userProfile.data.value.diary_day_4
];

const saveDiaryEntry = () => {
  console.log('Diary entry saved:', diaryEntries.value[currentDay.value]);
};

//Profile Pictures--------
const config = useRuntimeConfig();
const Base = config.public.apiBase;
const { data: profilePicturesData, error } = await useAsyncData('profilePictures', () =>
  $fetch(`http://localhost:8000/api/profile/upload/${data.value.id}/`, {
    headers: {
      'Authorization': `${token.value}`,
    },
  })
);
if (error.value) {
  console.error('Failed to fetch profile pictures:', error.value);
} else {
  profile_pictures.value = profilePicturesData.value.profile_pictures.map(pic => `${Base}${pic}`);
  currentPictureIndex.value = 0; 
}

const uploadProfilePicture = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('profile_picture', file);

    try {

      await $fetch(`http://localhost:8000/api/profile/upload/${data.value.id}/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `${token.value}`, 
        },
      });
 
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
    }
  }
};

const nextPicture = () => {
  if (profile_pictures.value.length > 0) {
    currentPictureIndex.value = (currentPictureIndex.value + 1) % profile_pictures.value.length;
  }
};

const prevPicture = () => {
  if (profile_pictures.value.length > 0) {
    currentPictureIndex.value = (currentPictureIndex.value - 1 + profile_pictures.value.length) % profile_pictures.value.length;
  }
};

const currentProfilePicture = computed(() => {
  return profile_pictures.value[currentPictureIndex.value] || '';
});


const toggleEditMode = () => {
  editMode.value = !editMode.value;
};

const toggleDestinationsMenu = () => {
  isDestinationsMenuOpen.value = !isDestinationsMenuOpen.value;
};

const setCurrentDay = (dayIndex) => {
  currentDay.value = dayIndex;
};

const updatePlacesVisited = () => {
  placesVisited.value = selectedDestinations.value.length;
};



</script>

<style scoped>

.nav-buttons {
  display: flex; 
  justify-content: center; 
  margin-top:0px; 
}

.nav-button {
  background-color: #ff9d00;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  margin: 0 5px;
}

.nav-button:hover {
  background-color: #cc5200; 
}
.bio-input {
  flex-grow: 1;
  border: none;
  outline: none; 
  padding: 5px; 
  font-size: 19px; 
}

.bio-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.edit-button {
  background-color: #ff9d00; 
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.edit-button i {
  margin-right: 5px; 
}

.separator {
  border: 1px solid #ff9d00;
  margin: 10px 0;
}

.profile-page {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100vh;
  box-sizing: border-box;
  position: relative;
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
  display: inline-block;
  font-size: 16px;
  z-index: 1000;
}

.back-button:hover {
  background-color: #cc5200;
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
  justify-content: flex-start;
  margin-bottom: 20px;
}

.profile-picture-container {
  flex-shrink: 0;
}

.profile-picture-label {
  cursor: pointer;
}

.profile-picture {
  width: 400px; 
  height: 450px; 
  object-fit: contain;

}


.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 20px;
  flex-grow: 1;
}

.user-info h2 {
  margin: 0 0 10px 0;
  font-size: 28px;
}

.user-info p {
  margin: 5px 0;
  font-size: 20px;
}

.destinations-container {
  margin: 0 200px 20px 10px; 
}

.visited-title {
  color: #ff9d00; 
  font-size: 24px; 
  margin: 0; 
}

.visited-separator {
  border: 1px solid #ff9d00; 
  margin: 10px 0;
}

.visited-destinations {
  list-style-type: none;
  padding: 0; 
  margin: 10px 0; 
}

.visited-destinations li {
  margin-bottom: 5px; 
  font-size: 18px; 
}

.add-button {
  background-color: #ff9d00; 
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px; 
}

.add-button:hover {
  background-color: #cc5200; 
}

.destinations-menu {
  max-height: 200px; 
  overflow-y: auto; 
  transition: max-height 0.5s ease; 
  padding: 0; 
  margin: 0; 
  list-style: none; 
  background: white; 
  border: 1px solid #ccc; 
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: max-height 0.5s ease;
}

.slide-down-enter,
.slide-down-leave-to {
  max-height: 0;
  overflow: hidden;
}

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

.diary-section textarea {
  width: 100%;
  height: 200px;
  margin-bottom: 10px;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 18px;
  box-sizing: border-box;
}

.diary-section button {
  align-self: flex-end;
  padding: 10px 20px;
  background-color: #ff9d00;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.diary-section button:hover {
  background-color: #cc5200;
}
</style>