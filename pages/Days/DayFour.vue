<template>
    <div class="days-page">
      <!-- Embedded Map -->
      <div class="map-container">
        
      </div>
  
      <div class="left-section">
    
        <NuxtLink to="/" class="return-button">
            BACK
        </NuxtLink>
        
        <h2>Day {{ dayNumber }} Plan</h2>
        <p>{{ introduction }}</p>
  
        <div class="recommendations">
          <h3>Recommendations</h3>
          <button class="recommendation-button">Restaurants</button>
          <button class="recommendation-button">Clubs</button>
          <button class="recommendation-button">Spots of Interest</button>
        </div>
      </div>
  
      <div>
        <MapChatBot />
      </div>
    </div>
  </template>
  
  <script setup>
  const dayNumber = 1 
  const introduction = ref(`Today, you will explore some of the most iconic places in Barcelona. Make sure to visit each spot and enjoy the experience.`)
  </script>
  
  <style scoped>
  .days-page {
    position: relative;
    height: 100vh;
    width: 100%;
    overflow: hidden;
  }
  
  .left-section {
    position: absolute;
    top: 0;
    left: 0;
    width: 30%;
    height: 100%;
    padding: 20px;
    background-color: #f4f4f4;
    box-sizing: border-box;
    border-right: 2px solid #ddd;
    overflow-y: auto;
    z-index: 10;
  }
  
  .return-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #ff9d00;
    color: white;
    padding: 8px 12px;
    border-radius: 5px;
    text-decoration: none;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }
  
  .return-button:hover {
    background-color: #cc5200;
  }
  
  .left-section h2 {
    font-size: 28px;
    margin-top: 50px; 
    margin-bottom: 10px;
  }
  
  .left-section p {
    font-size: 16px;
    margin-bottom: 20px;
  }
  
  .recommendations h3 {
    font-size: 22px;
    margin-bottom: 10px;
  }
  
  .recommendation-button {
    display: block;
    width: 100%;
    padding: 10px 0;
    margin-bottom: 10px;
    font-size: 16px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    transition: background-color 0.3s ease;
  }
  
  .recommendation-button:hover {
    background-color: #0056b3;
  }
  
  .map-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    overflow: hidden;
  }
  
  .map-frame {
    width: 100%;
    height: 100%;
    border: none;
  }
  
  .chat-component {
    position: absolute;
    bottom: 20px;
    right: 20px;
    z-index: 200;
  }
  </style>