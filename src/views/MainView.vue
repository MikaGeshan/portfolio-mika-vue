<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import MacWindow from '@/components/mac/MacWindow.vue'
import MacSidebar from '@/components/mac/MacSidebar.vue'
import MacTopbar from '@/components/mac/MacTopbar.vue'
import MacDock from '@/components/mac/MacDock.vue'
import MainContent from '@/components/content/MainContent.vue'
import { content } from '@/data/content/content'

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
</script>

<template>
  <div class="portfolio-container">
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

.window-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.08);
  height: 30px;
}

.buttons {
  display: flex;
  gap: 6px;
}

.buttons span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.close {
  background: #ff5f56;
}

.minimize {
  background: #ffbd2e;
}

.maximize {
  background: #27c93f;
}

.window-body {
  height: calc(100% - 30px);
  padding: 10px;
  overflow: auto;
}
</style>
