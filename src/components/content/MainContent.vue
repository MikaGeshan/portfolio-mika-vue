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

  background: #2a2a2a;
  color: #f2f2f2;

  scrollbar-width: thin;
  scroll-behavior: smooth;
}

.main-content::-webkit-scrollbar {
  width: 6px;
}

.main-content::-webkit-scrollbar-thumb {
  background: #505050;
  border-radius: 3px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: #6a6a6a;
}

.main-content > * {
  min-width: 0;
}
</style>
