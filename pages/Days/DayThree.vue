<template>
  <!-- Pam app became paid, I will embed a new one,maps just for show  -->
  <div class="map-container">
   <iframe
     class="full-screen-map"
     style="border:0"
     loading="lazy"
     allowfullscreen
     referrerpolicy="no-referrer-when-downgrade"
     src="https://www.google.com/maps/d/u/0/embed?mid=1yZ1I4udzyvG-OLghwtAU2AAEf0tU24M&ehbc=2E312F&noprof=1" >
   </iframe>
 </div>
 <MapNavbarDays/>
 <MapChatBot />
 <MapDaysMenu />
</template>

<script setup>

</script>

<style scoped>
html, body {
 margin: 0;
 padding: 0;
 height: 100%;
 width: 100%;
 overflow: hidden;
}


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
</style>