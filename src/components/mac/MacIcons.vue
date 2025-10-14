<script setup lang="ts">
import { Icon } from '@iconify/vue'

const props = defineProps({
  name: { type: String, required: true },

  tooltip: { type: String, default: '' },

  clickable: { type: Boolean, default: false },

  size: { type: [Number, String], default: 18 },

  color: { type: String, default: '#fff' },
})

const emit = defineEmits(['click'])

function handleClickIcon() {
  if (props.clickable) emit('click')
}
</script>

<template>
  <div class="mac-top-icon" :class="{ clickable }" @click="handleClickIcon">
    <Icon :icon="name" :width="size" :height="size" :color="color" />

    <transition name="fade">
      <span v-if="tooltip" class="tooltip">{{ tooltip }}</span>
    </transition>
  </div>
</template>

<style scoped>
.mac-top-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 6px;
  cursor: default;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.mac-top-icon.clickable {
  cursor: pointer;
}

.mac-top-icon:hover {
  opacity: 0.85;
  transform: scale(1.05);
}

/* Tooltip styling */
.tooltip {
  position: absolute;
  bottom: -28px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(50, 50, 50, 0.9);
  color: white;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  animation: fadeIn 0.2s ease forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
