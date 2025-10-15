<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'

// Components
import MacWindow from '@/components/mac/MacWindow.vue'
import MacSidebar from '@/components/mac/MacSidebar.vue'
import MacTopbar from '@/components/mac/MacTopbar.vue'
import MacDock from '@/components/mac/MacDock.vue'
import MainContent from '@/components/content/MainContent.vue'
import MacMenu from '@/components/mac/MacMenu.vue'

// Context and Data
import { content } from '@/data/content/content'
import { menu_left_click } from '@/data/menu/menu.left-click'

// Apps
import MacTerminal from '@/components/apps/MacTerminal.vue'

const active = ref('About Me')

const scrollToSection = async (name: string) => {
  await nextTick()
  const el = document.getElementById(name)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

watch(active, (newVal) => scrollToSection(newVal))

const openApps = ref<{ name: string; component: any }[]>([])

function handleOpenApp(app: { name: string }) {
  let component = null

  switch (app.name) {
    case 'iTerm':
      component = MacTerminal
      break
    case 'Safari':
      window.open('https://portofolio-mika.vercel.app', '_blank')
      return

    default:
      alert(`"${app.name}" is not available yet.`)
      break
  }

  if (!openApps.value.find((a) => a.name === app.name)) {
    openApps.value.push({ name: app.name, component })
  }
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

    <MacWindow>
      <MacSidebar :items="content" v-model:active="active" />
      <div class="main-container">
        <MainContent>
          <section
            v-for="item in content"
            :key="item.sidebarName"
            :id="item.sidebarName"
            class="content-section"
          >
            <h2>{{ item.title }}</h2>
            <p v-if="typeof item.description === 'string'">{{ item.description }}</p>
          </section>
        </MainContent>
      </div>
    </MacWindow>

    <div v-for="app in openApps" :key="app.name" :style="{ zIndex: 100 + openApps.indexOf(app) }">
      <MacWindow>
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
  background-size: 150%;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  position: relative;
  overflow: hidden;
  font-family:
    -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', Helvetica,
    Arial, sans-serif;
  color: white;
}

.portfolio-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(2px);
  z-index: 0;
}

.mac-menu {
  position: absolute;
  min-width: 200px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(25px) saturate(180%);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: fadeIn 0.15s ease-out;
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
