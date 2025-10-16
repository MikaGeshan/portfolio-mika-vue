<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import MacIcons from './MacIcons.vue'
import SwitchSVG from '../SVG/SwitchSVG.vue'
import DeviceTypeSVG from '../SVG/DeviceTypeSVG.vue'
import { top_bar_menu } from '@/data/menu/menu.top-bar'

const time = ref('')

function updateTime() {
  const now = new Date()

  const date = now
    .toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
    .replace(/,/g, '')

  const timeStr = now
    .toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    .replace(/:/g, '.')

  time.value = `${date} ${timeStr}`
}

let timer: number

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="mac-topbar">
    <div class="left">
      <MacIcons name="mdi:apple" size="20" color="#FFF" />
      <template v-for="menu in top_bar_menu" :key="menu.name">
        <span class="menu-item" :style="menu.name === 'Finder' ? 'font-weight: 800' : ''">
          {{ menu.name }}
        </span>
      </template>
    </div>

    <div class="right">
      <DeviceTypeSVG class="icon" />
      <SwitchSVG class="icon" />
      <span class="menu-item">{{ time }}</span>
    </div>
  </div>
</template>

<style scoped>
.mac-topbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  font-size: 13px;
  background: #1e1e1e;
  border-bottom: 1px solid #333333;
  color: white;
  z-index: 20;
}

.left,
.right {
  display: flex;
  align-items: center;
  gap: 25px;
}

.apple-logo {
  font-size: 20px;
  margin-right: 4px;
}

.menu-item {
  cursor: default;
  user-select: none;
  font-size: 15px;
  transition: color 0.2s ease;
}

.menu-item:hover {
  color: #dddddd;
}

.icon {
  width: 15px;
  height: 15px;
  color: white;
  opacity: 1;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.icon:hover {
  opacity: 1;
}
</style>
