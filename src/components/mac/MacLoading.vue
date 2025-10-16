<script setup lang="ts">
import AppleLogoSVG from '../SVG/AppleLogoSVG.vue'
</script>

<template>
  <div class="loading-screen">
    <div class="loading-content">
      <AppleLogoSVG class="apple-logo" />
      <div class="loading-bar">
        <div class="loading-progress"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-screen {
  position: fixed;
  inset: 0;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 9999;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
}

.apple-logo {
  width: 120px;
  height: 120px;
  fill: #fff;
  user-select: none;
}

.loading-bar {
  width: 240px;
  height: 8px;
  background-color: gray;
  border-radius: 4px;
  overflow: hidden;
}

.loading-progress {
  width: 0%;
  height: 100%;
  background-color: #ffffff;
  border-radius: 4px;
  animation: progress 2.5s ease-in forwards;
}

@keyframes progress {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}
</style>
