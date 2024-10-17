<template>
   <!-- Pam app became paid, I will embed a new one  -->
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

.map-frame {
  position: absolute;
  left: 0;
  height: 100%;
  width: 100%;
  border: none;
}
</style>