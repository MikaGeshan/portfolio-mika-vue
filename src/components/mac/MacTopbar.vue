<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Wifi, Battery, Search } from 'lucide-vue-next'

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
      <span class="apple-logo"></span>
      <span class="menu-item">Finder</span>
      <span class="menu-item">File</span>
      <span class="menu-item">Edit</span>
      <span class="menu-item">View</span>
      <span class="menu-item">Go</span>
      <span class="menu-item">Window</span>
      <span class="menu-item">Help</span>
    </div>

    <div class="right">
      <Wifi class="icon" />
      <Battery class="icon" />
      <Search class="icon" />
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
  height: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  font-size: 13px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
  opacity: 0.85;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.icon:hover {
  opacity: 1;
}
</style>
