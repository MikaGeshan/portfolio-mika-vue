<script setup lang="ts"></script>

<template>
  <div class="main-content">
    <slot />
  </div>
</template>

<style scoped>
.main-content {
  flex: 1;
  height: 100%;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1.5rem;
  scrollbar-width: thin;
  scroll-behavior: smooth;
}

.main-content::-webkit-scrollbar {
  width: 6px;
}

.main-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 3px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}

.main-content > * {
  min-width: 0;
}
</style>
