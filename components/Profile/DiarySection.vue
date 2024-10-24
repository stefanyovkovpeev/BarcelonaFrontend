<template>
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
  </template>
  
  <script setup>
const { data, token } = useAuth();
  
const diaryEntries =  useState('diaryEntries')

const currentDay = ref(0);
const diaryDays = ['Day 1', 'Day 2', 'Day 3', 'Day 4'];

const setCurrentDay = (dayIndex) => {
  currentDay.value = dayIndex;
};

const saveDiaryEntry = async () => {

  console.log(diaryEntries)
  const diaryData = {
    diary_day_1: diaryEntries.value[0],
    diary_day_2: diaryEntries.value[1],
    diary_day_3: diaryEntries.value[2],
    diary_day_4: diaryEntries.value[3],
  };
  try {
    const response = await $fetch(`http://localhost:8000/api/profile/${data.value.id}/`, {
      method: 'PATCH',
      body: diaryData,
      headers: {
        'Authorization': `${token.value}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Diary entries updated:', response);
  } catch (error) {
    console.error('Failed to save diary entries:', error);
  }
};

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