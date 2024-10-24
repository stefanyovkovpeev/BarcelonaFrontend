<template>
   <!-- Pam app became paid, I will embed a new one,maps just for show  -->
   <div class="map-container">
    <iframe
      class="full-screen-map"
      style="border:0"
      loading="lazy"
      allowfullscreen
      referrerpolicy="no-referrer-when-downgrade"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11998.182441122033!2d2.15899!3d41.387917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4a2f6d7fae4b7%3A0xd01111b0dd3fbebf!2sBarcelona!5e0!3m2!1sen!2ses!4v1698329597052!5m2!1sen!2ses">
    </iframe>
  </div>
  <MapNavbar />
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