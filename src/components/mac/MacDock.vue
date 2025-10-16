<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import settings from '@/assets/icons/DockIcons/settings.png'
import finder from '@/assets/icons/DockIcons/finder.png'
import safari from '@/assets/icons/DockIcons/safari.png'
import calculator from '@/assets/icons/DockIcons/calculator.png'
import notes from '@/assets/icons/DockIcons/notes.png'
import mail from '@/assets/icons/DockIcons/mail.png'
import iterm from '@/assets/icons/DockIcons/terminal.png'
import github from '@/assets/icons/DockIcons/github.png'
import trash from '@/assets/icons/DockIcons/trash.png'

const emit = defineEmits(['openApp'])

const apps = ref([
  { name: 'Finder', icon: finder },
  { name: 'Safari', icon: safari },
  { name: 'Calculator', icon: calculator },
  { name: 'Notes', icon: notes },
  { name: 'Mail', icon: mail },
  { name: 'Settings', icon: settings },
  { name: 'iTerm', icon: iterm },
  { name: 'GitHub', icon: github },
  { name: 'Trash', icon: trash },
])

const dockRef = ref<HTMLElement | null>(null)
const appRefs = ref<HTMLElement[]>([])
const mouseX = ref<number | null>(null)
const isHovered = ref(false)
const hoveredApp = ref<string | null>(null)

const getScaleForApp = (index: number) => {
  if (mouseX.value === null) return 1
  const el = appRefs.value[index]
  if (!el) return 1

  const rect = el.getBoundingClientRect()
  const center = rect.left + rect.width / 2
  const distance = Math.abs(mouseX.value - center)
  const maxDistance = 160
  const minScale = 1
  const maxScale = 1.8

  if (distance > maxDistance) return minScale

  const normalized = 1 - distance / maxDistance
  return minScale + Math.pow(normalized, 2.5) * (maxScale - minScale)
}

const handleMouseMove = (e: MouseEvent) => {
  mouseX.value = e.clientX
}

const handleMouseEnter = () => (isHovered.value = true)
const handleMouseLeave = () => {
  mouseX.value = null
  isHovered.value = false
}
const handleOpen = (app: any) => emit('openApp', app)

onMounted(() => {
  nextTick(() => {
    appRefs.value = Array.from(dockRef.value!.querySelectorAll('.dock-item'))
  })
  dockRef.value?.addEventListener('mousemove', handleMouseMove)
  dockRef.value?.addEventListener('mouseenter', handleMouseEnter)
  dockRef.value?.addEventListener('mouseleave', handleMouseLeave)
})
onUnmounted(() => {
  dockRef.value?.removeEventListener('mousemove', handleMouseMove)
  dockRef.value?.removeEventListener('mouseenter', handleMouseEnter)
  dockRef.value?.removeEventListener('mouseleave', handleMouseLeave)
})
</script>

<template>
  <div
    class="mac-dock"
    ref="dockRef"
    :style="{
      transform: isHovered ? 'translateX(-50%) scale(1.2)' : 'translateX(-50%) scale(1)',
      transition: 'transform 0.25s cubic-bezier(0.20, 1, 0.36, 1)',
    }"
  >
    <div class="dock-inner">
      <div class="dock-container">
        <div
          v-for="(app, i) in apps"
          :key="app.name"
          ref="appRefs"
          class="dock-item"
          @click="handleOpen(app)"
          @mouseenter="hoveredApp = app.name"
          @mouseleave="hoveredApp = null"
          :style="{
            transform: `
              scale(${getScaleForApp(i)})
              translateY(${(getScaleForApp(i) - 1) * -25}px)
            `,
            transition: 'transform 0.12s cubic-bezier(0.25, 1, 0.5, 1)',
            willChange: 'transform',
          }"
        >
          <transition name="fade">
            <div v-if="hoveredApp === app.name" class="dock-tooltip">
              <div class="tooltip-icon">
                <span class="tooltip-text">{{ app.name }}</span>
              </div>
            </div>
          </transition>

          <img class="dock-icon" :src="app.icon" :alt="app.name" />
        </div>
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
  background: #2d2d2d;
  border-radius: 20px;
  padding: 10px 18px;
  z-index: 30;
  transform-origin: bottom center;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.dock-inner {
  display: flex;
  justify-content: center;
  width: 100%;
  overflow: visible;
}

.dock-container {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 16px;
  padding: 2px 4px;
}

.dock-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transform-origin: bottom center;
  transition: transform 0.22s cubic-bezier(0.25, 1, 0.5, 1);
  will-change: transform;
}

.dock-item:hover .dock-icon {
  filter: brightness(1.1);
  transform: translateY(-4px);
}

.dock-icon {
  width: 64px;
  height: 64px;
  object-fit: contain;
  pointer-events: none;
  transition:
    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.25s ease;
}

.dock-tooltip {
  position: absolute;
  bottom: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(10px);
  opacity: 0;
  animation: tooltip-up 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  pointer-events: none;
}

.tooltip-icon {
  background: #333;
  color: #fff;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  letter-spacing: 0.3px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tooltip-text {
  text-align: center;
  font-weight: 500;
}

@keyframes tooltip-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
