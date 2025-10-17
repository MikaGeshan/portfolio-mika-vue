<script setup lang="ts">
import { ref } from 'vue'
import WelcomeView from './views/WelcomeView.vue'
import MainView from './views/MainView.vue'

const unlocked = ref(false)

function handleUnlock() {
  unlocked.value = true
}
</script>

<template>
  <transition name="fade">
    <WelcomeView v-if="!unlocked" @unlocked="handleUnlock" key="welcome" />
    <MainView v-else key="main" />
  </transition>
</template>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  font-family:
    -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', Helvetica, Arial, sans-serif;
  font-size: 14px;
  color: white;
  background-color: #121212;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

a {
  color: #0ea5e9;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}

section,
.container {
  padding: 1.5rem;
  color: white;
}
</style>
