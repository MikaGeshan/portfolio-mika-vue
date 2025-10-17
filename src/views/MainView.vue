<script setup lang="ts">
import { ref, nextTick } from 'vue'

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

interface OpenApp {
  name: string
  component: any
  visible: boolean
}

const openApps = ref<OpenApp[]>([])

function handleOpenApp(app: { name: string }) {
  if (app.name === 'Safari') {
    window.open('https://portofolio-mika.vercel.app', '_blank')
    return
  }

  const componentMap: Record<string, any> = {
    iTerm: MacTerminal,
    Settings: MacSystemSettings,
  }

  const component = componentMap[app.name]
  if (!component) {
    alert(`"${app.name}" is not available yet.`)
    return
  }

  const existing = openApps.value.find((a) => a.name === app.name)
  if (existing) {
    existing.visible = true
    return
  }

  openApps.value.push({
    name: app.name,
    component,
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

    <!-- Dynamically render all open apps -->
    <div v-for="app in openApps" :key="app.name" :style="{ zIndex: 100 + openApps.indexOf(app) }">
      <MacWindow
        :title="app.name"
        :visible="app.visible"
        backgroundColor="#2d2d2d"
        @close="app.visible = false"
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
