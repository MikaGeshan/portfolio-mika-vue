<script setup lang="ts">
import MacLockScreen from '@/components/mac/MacLockScreen.vue'

const emit = defineEmits(['unlocked'])

function handleUnlock() {
  emit('unlocked')
}
</script>

<template>
  <MacLockScreen @unlocked="handleUnlock" />
</template>
