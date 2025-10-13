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
  background: transparent;
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
</style>
