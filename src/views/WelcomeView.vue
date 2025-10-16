<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MacLoading from '@/components/mac/MacLoading.vue'
import MacLockScreen from '@/components/mac/MacLockScreen.vue'

const emit = defineEmits(['unlocked'])
const showLoading = ref(true)

function handleUnlock() {
  emit('unlocked')
}

onMounted(() => {
  setTimeout(() => {
    showLoading.value = false
  }, 3000)
})
</script>

<template>
  <transition name="fade">
    <MacLoading v-if="showLoading" />
  </transition>

  <transition name="fade">
    <MacLockScreen v-if="!showLoading" @unlocked="handleUnlock" />
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
