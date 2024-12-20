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
            <button @click="toggleEditMode" class="edit-button">
              <i class="fa" :class="editMode ? 'fa-check' : 'fa-pencil'"></i>
              {{ editMode ? 'Save Profile' : 'Edit Profile' }}
            </button>
          </div>

          <hr class="separator" />

          <p>Name: {{ profile.userName }}</p>
          <p>Email: {{ profile.userEmail }}</p>

          <!-- Editable Country Field -->
          <div>
            <p v-if="!editMode">Country: {{ profile.userCountry }}</p>
            <input
              v-if="editMode"
              type="text"
              v-model="profile.userCountry"
              placeholder="Enter your country"
              class="bio-input"
            />
          </div>

          <!-- Editable Looking For Field -->
          <div>
            <p v-if="!editMode">Looking for: {{ profile.userLookingFor }}</p>
            <input
              v-if="editMode"
              type="text"
              v-model="profile.userLookingFor"
              placeholder="Looking for..."
              class="bio-input"
            />
          </div>

          <p>Barcelona places visited: {{ placesVisited }}/{{ destinations.length }}</p>
        </div>
      </div>
      <ProfileDestinationsVisited />
    </div>
    <ProfileDiarySection />
  </div>
</template>


<script setup>
const { data, token } = useAuth();

const { data: destinationsData } = await useAsyncData('destinations', () =>
  $fetch('http://localhost:8000/api/profile/destinations/', {
    method: 'GET',
    headers: {
      'Authorization':token.value,
      'Content-Type': 'application/json',
    }
  })
);

const destinationsFullListForMapping=useState('destinationsFullList', () => 
  destinationsData.value
);
const destinations = useState('destinations', () => 
  destinationsData.value ? destinationsData.value.map((item) => item.destination) : []
);

//User profile info --------
const profile = ref({
  userName: '',
  Name: '',
  userBio: '',
  userEmail: '',
  userCountry: '',
  userLookingFor: '',
});

const userProfile = await useAsyncData('userProfile', () =>
  $fetch(`http://localhost:8000/api/profile/${data.value.id}/`, {
    method: 'GET',
    headers: {
      'Authorization':token.value,
      'Content-Type': 'application/json',
    }
  })
);
//Usstate for another component
  const diaryEntries = useState('diaryEntries', () => [
  userProfile.data.value?.diary_day_1 || '',
  userProfile.data.value?.diary_day_2 || '',
  userProfile.data.value?.diary_day_3 || '',
  userProfile.data.value?.diary_day_4 || ''
]);

profile.value = {
  userName: data.value.username,
  name: `${data.value.first_name} ${data.value.last_name}`,
  userBio: userProfile.data.value?.bio || '',
  userEmail: '',
  userCountry: userProfile.data.value?.country || '',
  userLookingFor: userProfile.data.value?.looking_for || '',
};

const currentPictureIndex = ref(0); 


const editMode = ref(false);
const toggleEditMode = async () => {

  if (editMode.value) {
    try {
      // Send a POST request regardless of profile existence
      const response = await $fetch(`http://localhost:8000/api/profile/${data.value.id}/`, {
        method: 'POST',
        body: { 
          bio: profile.value.userBio || '',
          country: profile.value.userCountry || '',
          looking_for: profile.value.userLookingFor || ''
        },
        headers: {
          'Authorization': token.value,
          'Content-Type': 'application/json',
        },
      });
      


    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  }

  editMode.value = !editMode.value; 
};


const placesVisited =  useState('placesVisited')




//Profile Pictures--------
const config = useRuntimeConfig();
const Base = config.public.apiBase;
const profile_pictures = ref([]);
const { data: profilePicturesData, error } = await useAsyncData('profilePictures', () =>
  $fetch(`http://localhost:8000/api/profile/upload/${data.value.id}/`, {
    headers: {
      'Authorization': `${token.value}`,
    },
  })
);
if (error.value) {
  profilePicturesData.value=''
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
  
  margin-left: 20px;
  margin-top: 0px;
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

</style>