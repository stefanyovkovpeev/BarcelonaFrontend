<template>
  <div class="profile-page">
    <NuxtLink to="/" class="back-button">
      BACK
    </NuxtLink>


    <div class="main-content">
      <div class="profile-header">
        <div class="profile-picture-container">
          <label for="profile-picture-upload" class="profile-picture-label">
            <img :src="profile.profile_picture || 'https://via.placeholder.com/150/000000/FFFFFF/?text=No+Image'" alt="Profile Picture" class="profile-picture" />
            <input type="file" id="profile-picture-upload" @change="uploadProfilePicture" style="display: none;" />
          </label>
        </div>
        <div class="user-info">
          <h2>
            <input v-if="editMode" v-model="profile.userName" />
            <span v-else>{{ profile.userName }}</span>
            <button @click="toggleEditMode" class="edit-button">
              {{ editMode ? 'Cancel' : 'Edit' }}
            </button>
            <button v-if="editMode" @click="saveProfile" class="save-button">Save</button>
          </h2>
          <p v-if="!editMode">{{ profile.userBio }}</p>
          <textarea v-else v-model="profile.userBio" placeholder="Enter your bio"></textarea>
          <p>Email: {{ profile.userEmail }}</p>
          <p>Country: {{ profile.userCountry }}</p>
          <p>Looking for: {{ profile.userLookingFor }}</p>
          <p>Barcelona places visited: {{ placesVisited }}/{{ destinations.length }}</p>
        </div>
      </div>
      <div class="destinations-container">
        <h3>Your Destinations</h3>
        <div class="toggle-destinations" @click="toggleDestinationsMenu">
          <span>{{ isDestinationsMenuOpen ? '✔' : '➕' }} Destinations</span>
        </div>
        <transition name="slide-down">
          <ul v-if="isDestinationsMenuOpen" class="destinations-menu">
            <li v-for="destination in destinations" :key="destination">
              <label>
                <input type="checkbox" v-model="selectedDestinations" :value="destination" @change="updatePlacesVisited" />
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

const data=useAuth()

console.log(data.data)

const id=data.data.value.user.id

const profile = ref({
  userName: '',
  userBio: '',
  userEmail: '',
  userCountry: '',
  userLookingFor: '',
  profile_picture: ''
})

const editMode = ref(false)
const currentDay = ref(0)
const diaryEntries = ref(['даъ1', 'даъ2', 'даъ3', 'даъ4'])
const diaryDays = ['Day 1', 'Day 2', 'Day 3', 'Day 4']
const isDestinationsMenuOpen = ref(false)
const destinations = ref(['Sagrada Familia', 'Park Güell', 'Casa Batlló', 'La Rambla'])
const selectedDestinations = ref([])
const placesVisited = ref(0)

const token = data.data.value.user.access
const { data: userProfile, error } = await useAsyncData('userProfile', () =>
  $fetch(`http://localhost:8000/api/profile/${id}/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,  
      'Content-Type': 'application/json',
    },  
  })
);

console.log("User Profile:", userProfile.value);
console.log("Error:", error.value);

profile.value = {
    userName: "",
    userBio: userProfile.value.bio || '',
    userEmail: '', 
    userCountry: userProfile.value.country || '',
    userLookingFor: userProfile.value.looking_for || '',
    profile_picture: userProfile.value.profile_picture || null,
  };


diaryEntries.value=[userProfile.value.diary_day_1,userProfile.value.diary_day_2,userProfile.value.diary_day_3,userProfile.value.diary_day_4]

console.log("User Profile:", userProfile.value);

const toggleEditMode = () => {
  editMode.value = !editMode.value
}

const saveProfile = async () => {
  try {
    await $fetch(`/api/profile/${user?.id}`, {
      method: 'PUT',
      body: profile.value,
    })
    editMode.value = false
  } catch (error) {
    console.error('Failed to save profile:', error)
  }
}

const toggleDestinationsMenu = () => {
  isDestinationsMenuOpen.value = !isDestinationsMenuOpen.value
}

const setCurrentDay = (dayIndex) => {
  currentDay.value = dayIndex
}

const updatePlacesVisited = () => {
  placesVisited.value = selectedDestinations.value.length
}

const saveDiaryEntry = () => {
  console.log('Diary entry saved:', diaryEntries.value[currentDay.value])
}

const uploadProfilePicture = async (event) => {
  const file = event.target.files[0]
  if (file) {
    const formData = new FormData()
    formData.append('profile_picture', file)

    try {
      const response = await $fetch(`/api/profile/${user?.id}/upload/`, {
        method: 'POST',
        body: formData,
      })
      profile.value.profile_picture = response.profile_picture
    } catch (error) {
      console.error('Failed to upload profile picture:', error)
    }
  }
}
</script>

<style scoped>
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
  width: 200px;
  height: 200px;
  border-radius: 50%;
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

.user-info p,
.user-info textarea {
  margin: 5px 0;
  font-size: 20px;
}

.destinations-container {
  width: 25%; 
  margin-left: 20px;
  margin-bottom: 20px;
}

.destinations-container h3 {
  font-size: 24px;
  margin-bottom: 10px;
}

.toggle-destinations {
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 10px;
}

.destinations-menu {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.destinations-menu li {
  margin-bottom: 10px;
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