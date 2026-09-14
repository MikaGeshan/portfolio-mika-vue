<script setup lang="ts">
import { ref } from 'vue'
import settings from '@/assets/icons/DockIcons/settings.png'
import finder from '@/assets/icons/DockIcons/finder.png'
import safari from '@/assets/icons/DockIcons/safari.png'
import calculator from '@/assets/icons/DockIcons/calculator.png'
import notes from '@/assets/icons/DockIcons/notes.png'
import mail from '@/assets/icons/DockIcons/mail.png'
import iterm from '@/assets/icons/DockIcons/terminal.png'
import github from '@/assets/icons/DockIcons/github.png'
import trash from '@/assets/icons/DockIcons/trash.png'
import calendar from '@/assets/icons/DockIcons/calendar.png'

interface DockApp {
  name: string
  icon: string
  separatorBefore?: boolean
}

const emit = defineEmits<{
  openApp: [app: DockApp]
}>()

const apps = ref([
  { name: 'Finder', icon: finder },
  { name: 'Safari', icon: safari },
  { name: 'Calculator', icon: calculator },
  { name: 'Calendar', icon: calendar },
  { name: 'Notes', icon: notes },
  { name: 'Mail', icon: mail },
  { name: 'Settings', icon: settings },
  { name: 'iTerm', icon: iterm },
  { name: 'GitHub', icon: github },
  { name: 'Trash', icon: trash, separatorBefore: true },
] satisfies DockApp[])

const appRefs = ref<HTMLElement[]>([])
const mouseX = ref<number | null>(null)
const hoveredApp = ref<string | null>(null)

function getScaleForApp(index: number) {
  if (mouseX.value === null) return 1

  const el = appRefs.value[index]
  if (!el) return 1

  const rect = el.getBoundingClientRect()
  const center = rect.left + rect.width / 2
  const distance = Math.abs(mouseX.value - center)
  const maxDistance = 130
  const maxScale = 1.72

  if (distance > maxDistance) return 1

  const normalized = 1 - distance / maxDistance
  return 1 + Math.pow(normalized, 2.2) * (maxScale - 1)
}

function getItemStyle(index: number) {
  const scale = getScaleForApp(index)

  return {
    marginInline: `${Math.max(0, (scale - 1) * 8)}px`,
    transform: `translateY(${(scale - 1) * -30}px) scale(${scale})`,
    zIndex: Math.round(scale * 100),
  }
}

function handleMouseMove(event: MouseEvent) {
  mouseX.value = event.clientX
}

function handleMouseLeave() {
  mouseX.value = null
  hoveredApp.value = null
}

function handleOpen(app: DockApp) {
  emit('openApp', app)
}
</script>

<template>
  <nav
    class="mac-dock"
    aria-label="Dock"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <div class="dock-container">
      <template v-for="(app, index) in apps" :key="app.name">
        <span v-if="app.separatorBefore" class="dock-separator" aria-hidden="true" />

        <button
          type="button"
          ref="appRefs"
          class="dock-item"
          :aria-label="app.name"
          :style="getItemStyle(index)"
          @click="handleOpen(app)"
          @mouseenter="hoveredApp = app.name"
          @focus="hoveredApp = app.name"
          @mouseleave="hoveredApp = null"
          @blur="hoveredApp = null"
        >
          <transition name="fade">
            <span v-if="hoveredApp === app.name" class="dock-tooltip">
              {{ app.name }}
            </span>
          </transition>

          <img class="dock-icon" :src="app.icon" :alt="app.name" />
        </button>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.mac-dock {
  position: absolute;
  bottom: 16px;
  left: 50%;
  max-width: calc(100vw - 24px);
  padding: 7px 11px 9px;
  overflow: visible;
  z-index: 30;
  transform: translateX(-50%);
  transform-origin: bottom center;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 24px;
  background: rgba(246, 247, 250, 0.2);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.34),
    inset 0 -1px 0 rgba(0, 0, 0, 0.16);
  backdrop-filter: blur(22px) saturate(1.35);
  -webkit-backdrop-filter: blur(22px) saturate(1.35);
}

.dock-container {
  min-height: 72px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 4px;
  overflow: visible;
}

.dock-item {
  position: relative;
  width: 64px;
  height: 72px;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 0 3px 8px;
  border: 0;
  border-radius: 16px;
  background: transparent;
  cursor: pointer;
  transform-origin: bottom center;
  transition: margin 0.14s cubic-bezier(0.2, 1, 0.36, 1),
    transform 0.14s cubic-bezier(0.2, 1, 0.36, 1);
  will-change: transform;
}

.dock-item:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.94);
  outline-offset: 4px;
}

.dock-icon {
  width: 58px;
  height: 58px;
  object-fit: contain;
  pointer-events: none;
  filter: drop-shadow(0 6px 8px rgba(0, 0, 0, 0.22));
  transition: filter 0.18s ease;
}

.dock-item:hover .dock-icon,
.dock-item:focus-visible .dock-icon {
  filter: brightness(1.08) drop-shadow(0 10px 12px rgba(0, 0, 0, 0.24));
}

.dock-separator {
  width: 1px;
  height: 46px;
  flex: 0 0 auto;
  margin: 0 8px 9px 7px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.35);
  box-shadow: 1px 0 0 rgba(0, 0, 0, 0.18);
}

.dock-tooltip {
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  translate: -50% 0;
  transform: translateY(10px);
  opacity: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 11px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  background: rgba(38, 38, 40, 0.88);
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.24);
  pointer-events: none;
  animation: tooltip-up 0.16s cubic-bezier(0.2, 1, 0.36, 1) forwards;
}

@keyframes tooltip-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 720px) {
  .mac-dock {
    bottom: 10px;
    padding: 6px 8px 7px;
    border-radius: 20px;
  }

  .dock-container {
    min-height: 58px;
    gap: 1px;
  }

  .dock-item {
    width: 50px;
    height: 58px;
    padding-bottom: 6px;
  }

  .dock-icon {
    width: 46px;
    height: 46px;
  }

  .dock-separator {
    height: 36px;
    margin: 0 5px 8px;
  }
}
</style>
