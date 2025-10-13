<script setup lang="ts">
import { ref } from 'vue'
import settings from '@/assets/icons/DockIcons/settings.png'
import finder from '@/assets/icons/DockIcons/finder.png'
import iterm from '@/assets/icons/DockIcons/terminal.png'
import github from '@/assets/icons/DockIcons/github.png'
import trash from '@/assets/icons/DockIcons/trash.png'

const emit = defineEmits(['openApp'])

const apps = ref([
  { name: 'Finder', icon: finder },
  { name: 'Safari', icon: '🌐' },
  { name: 'Mail', icon: '✉️' },
  { name: 'Messages', icon: '💬' },
  { name: 'Settings', icon: settings },
  { name: 'Photos', icon: '📷' },
  { name: 'iTerm', icon: iterm },
  { name: 'GitHub', icon: github },
  { name: 'Trash', icon: trash },
])

const hoveredApp = ref<string | null>(null)

const handleOpen = (app: any) => {
  emit('openApp', app)
}

const showLabel = (appName: string) => {
  hoveredApp.value = appName
}

const hideLabel = () => {
  hoveredApp.value = null
}
</script>

<template>
  <div class="mac-dock">
    <div class="dock-container">
      <div
        v-for="app in apps"
        :key="app.name"
        class="dock-item"
        @click="handleOpen(app)"
        @mouseenter="showLabel(app.name)"
        @mouseleave="hideLabel"
      >
        <transition name="fade">
          <div v-if="hoveredApp === app.name" class="dock-tooltip">
            {{ app.name }}
          </div>
        </transition>

        <img
          v-if="typeof app.icon === 'string' && app.icon.endsWith('.png')"
          class="dock-icon"
          :src="app.icon"
          :alt="app.name"
        />
        <span v-else class="dock-emoji">{{ app.icon }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mac-dock {
  position: absolute;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 18px;
  padding: 8px 14px;
  z-index: 30;
  transition: transform 0.3s ease;
}

.mac-dock:hover {
  transform: translateX(-50%) scale(1.02);
}

.dock-container {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.dock-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    transform 0.25s ease,
    filter 0.25s ease;
}

.dock-item:hover {
  transform: scale(1.3);
  filter: brightness(1.2);
}

.dock-icon {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.dock-emoji {
  font-size: 42px;
  line-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dock-tooltip {
  position: absolute;
  bottom: 70px;
  background: rgba(30, 30, 30, 0.9);
  color: #fff;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
  white-space: nowrap;
  transform: translateY(10px);
  opacity: 0;
  animation: tooltip-up 0.25s ease forwards;
  pointer-events: none;
}

@keyframes tooltip-up {
  to {
    opacity: 1;
    transform: translateY(0);
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
