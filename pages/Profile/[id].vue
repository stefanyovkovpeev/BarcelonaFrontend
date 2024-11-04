<template>
    <div class="profile-page">
      <NuxtLink to="/" class="back-button">BACK</NuxtLink>
  
      <div class="main-content">
        <div class="profile-header">
          <div class="profile-picture-container">
            <label for="profile-picture-upload" class="profile-picture-label">
              <img
                alt="Profile Picture"
                class="profile-picture"
              />
              <input
                type="file"
                id="profile-picture-upload"
                style="display: none;"
              />
            </label>
            
            
  
            <div class="nav-buttons">
            </div>
          </div>
          <div class="user-info">
            <h2>
              <span></span>
            </h2>
            
            <div class="bio-container">
              <input
                type="text"
                placeholder="Enter your bio"
                class="bio-input"
              />
            </div>
  
            <hr class="separator" />
          </div>
        </div>
        <ProfileDestinationsVisited/>
      </div>
     <ProfileDiarySection/>
    </div>
  </template>
  
  
  <script setup>
 </script>