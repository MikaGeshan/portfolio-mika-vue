<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type { Component } from 'vue'

// Components
import MacWindow from '@/components/mac/MacWindow.vue'
import MacTopbar from '@/components/mac/MacTopbar.vue'
import MacDock from '@/components/mac/MacDock.vue'
import MacMenu from '@/components/mac/MacMenu.vue'

// Context and Data
import { menu_left_click } from '@/data/menu/menu.left-click'

// Apps
import MacTerminal from '@/components/apps/MacTerminal.vue'
import MacSystemSettings from '@/components/apps/MacSystemSettings.vue'
import MacCalendar from '@/components/apps/MacCalendar.vue'
import MacCalculator from '@/components/mac/MacCalculator.vue'

interface OpenApp {
  name: string
  component: Component
  visible: boolean
  width: number
  height: number
  initialPosition?: { x: number; y: number }
}

interface AppDefinition {
  component: Component
  width: number
  height: number
}

const openApps = ref<OpenApp[]>([])

const DESKTOP_PADDING = 24
const TOPBAR_HEIGHT = 35
const DOCK_SAFE_AREA = 124

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max))
}

function getCenteredWindowPosition(width: number, height: number) {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const minX = DESKTOP_PADDING
  const maxX = viewportWidth - width - DESKTOP_PADDING
  const minY = TOPBAR_HEIGHT + DESKTOP_PADDING
  const maxY = viewportHeight - height - DOCK_SAFE_AREA

  const x = clamp((viewportWidth - width) / 2, minX, maxX)
  const y = clamp(
    TOPBAR_HEIGHT + (viewportHeight - TOPBAR_HEIGHT - DOCK_SAFE_AREA - height) / 2,
    minY,
    maxY,
  )

  return { x: Math.round(x), y: Math.round(y) }
}

function getWindowSize(appDefinition: AppDefinition) {
  const maxWidth = Math.max(400, window.innerWidth - DESKTOP_PADDING * 2)
  const maxHeight = Math.max(
    300,
    window.innerHeight - TOPBAR_HEIGHT - DOCK_SAFE_AREA - DESKTOP_PADDING * 2,
  )

  return {
    width: Math.min(appDefinition.width, maxWidth),
    height: Math.min(appDefinition.height, maxHeight),
  }
}

function closeApp(name: string) {
  openApps.value = openApps.value.filter((app) => app.name !== name)
}

function handleOpenApp(app: { name: string }) {
  if (app.name === 'Safari') {
    window.open('https://portofolio-mika.vercel.app', '_blank')
    return
  }

  const componentMap: Record<string, AppDefinition> = {
    Calculator: {
      component: MacCalculator,
      width: 400,
      height: 600,
    },
    Calendar: {
      component: MacCalendar,
      width: 760,
      height: 650,
    },
    iTerm: {
      component: MacTerminal,
      width: 820,
      height: 520,
    },
    Settings: {
      component: MacSystemSettings,
      width: 900,
      height: 600,
    },
  }

  const appDefinition = componentMap[app.name]
  if (!appDefinition) {
    alert(`"${app.name}" is not available yet.`)
    return
  }

  const existing = openApps.value.find((a) => a.name === app.name)
  if (existing) {
    existing.visible = true
    openApps.value = [...openApps.value.filter((openApp) => openApp.name !== app.name), existing]
    return
  }

  const windowSize = getWindowSize(appDefinition)
  const initialPosition = getCenteredWindowPosition(windowSize.width, windowSize.height)

  openApps.value.push({
    name: app.name,
    ...appDefinition,
    ...windowSize,
    initialPosition,
    visible: true,
  })
}

const showMenu = ref(false)
const menuPosition = ref({ x: 0, y: 0 })

function openContextMenu(event: MouseEvent) {
  event.preventDefault()

  const padding = 10
  const menuWidth = 200
  const menuHeight = 220

  const x = Math.min(event.clientX, window.innerWidth - menuWidth - padding)
  const y = Math.min(event.clientY, window.innerHeight - menuHeight - padding)

  showMenu.value = true
  menuPosition.value = { x, y }

  nextTick(() => {
    setTimeout(() => {
      window.addEventListener('mousedown', closeContextMenuOnce, { once: true })
    }, 10)
  })
}

function closeContextMenuOnce() {
  showMenu.value = false
}

window.addEventListener('click', () => (showMenu.value = false))
</script>

<template>
  <div class="portfolio-container" @contextmenu.stop.prevent="openContextMenu">
    <MacTopbar />

    <div
      v-for="app in openApps"
      :key="app.name"
      class="window-layer"
      :style="{ zIndex: 10 + openApps.indexOf(app) }"
    >
      <MacWindow
        :title="app.name"
        :visible="app.visible"
        :width="app.width"
        :height="app.height"
        :zIndex="10 + openApps.indexOf(app)"
        :initialPosition="app.initialPosition"
        backgroundColor="#2d2d2d"
        @close="closeApp(app.name)"
      >
        <component :is="app.component" />
      </MacWindow>
    </div>

    <MacDock @openApp="handleOpenApp" />

    <MacMenu
      v-if="showMenu"
      :style="{
        top: `${menuPosition.y}px`,
        left: `${menuPosition.x}px`,
        position: 'absolute',
      }"
      :items="menu_left_click"
    />
  </div>
</template>

<style scoped>
.portfolio-container {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-image: url('@/assets/images/macbackground.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
  color: white;
}

.window-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.window-layer :deep(.mac-window) {
  pointer-events: auto;
}

.mac-menu {
  position: absolute;
  min-width: 200px;
  background-color: #000;
  border-radius: 10px;
  border: 1px solid #555;
  animation: fadeIn 0.15s ease-out;
  color: white;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
