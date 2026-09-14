<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import MacIcons from './MacIcons.vue'
import MacMenu from './MacMenu.vue'
import SwitchSVG from '../SVG/SwitchSVG.vue'
import DeviceTypeSVG from '../SVG/DeviceTypeSVG.vue'
import { apple_menu, top_bar_menu, type TopBarMenu } from '@/data/menu/menu.top-bar'

const time = ref('')
const topbarRef = ref<HTMLElement | null>(null)
const activeMenuName = ref<string | null>(null)
const menuPosition = ref({ top: 34, left: 8 })
const allMenus = computed(() => [apple_menu, ...top_bar_menu])
const activeMenu = computed(() => allMenus.value.find((menu) => menu.name === activeMenuName.value))

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

function openMenu(menu: TopBarMenu, event: MouseEvent | FocusEvent) {
  const trigger = event.currentTarget as HTMLElement
  const rect = trigger.getBoundingClientRect()

  activeMenuName.value = menu.name
  menuPosition.value = {
    top: rect.bottom + 4,
    left: Math.max(6, rect.left),
  }
}

function handleMenuEnter(menu: TopBarMenu, event: MouseEvent) {
  if (!activeMenuName.value) return
  openMenu(menu, event)
}

function closeMenu() {
  activeMenuName.value = null
}

function handleDocumentMouseDown(event: MouseEvent) {
  const target = event.target as Node
  if (!topbarRef.value?.contains(target)) closeMenu()
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeMenu()
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  document.addEventListener('mousedown', handleDocumentMouseDown)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  clearInterval(timer)
  document.removeEventListener('mousedown', handleDocumentMouseDown)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div ref="topbarRef" class="mac-topbar">
    <div class="left">
      <button
        type="button"
        class="menu-trigger apple-trigger"
        :class="{ active: activeMenuName === apple_menu.name }"
        aria-label="Apple menu"
        aria-haspopup="menu"
        :aria-expanded="activeMenuName === apple_menu.name"
        @click.stop="openMenu(apple_menu, $event)"
        @mouseenter="handleMenuEnter(apple_menu, $event)"
      >
        <MacIcons name="mdi:apple" size="19" color="#FFF" />
      </button>

      <template v-for="menu in top_bar_menu" :key="menu.name">
        <button
          type="button"
          class="menu-trigger"
          :class="{ active: activeMenuName === menu.name, strong: menu.name === 'Finder' }"
          aria-haspopup="menu"
          :aria-expanded="activeMenuName === menu.name"
          @click.stop="openMenu(menu, $event)"
          @mouseenter="handleMenuEnter(menu, $event)"
        >
          {{ menu.name }}
        </button>
      </template>
    </div>

    <div class="right">
      <span class="status-icon" aria-hidden="true"><DeviceTypeSVG class="icon" /></span>
      <span class="status-icon" aria-hidden="true"><SwitchSVG class="icon" /></span>
      <span class="menu-item">{{ time }}</span>
    </div>

    <MacMenu
      v-if="activeMenu"
      :items="activeMenu.items"
      :minWidth="236"
      :style="{
        position: 'fixed',
        top: `${menuPosition.top}px`,
        left: `${menuPosition.left}px`,
      }"
      @select="closeMenu"
    />
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
  padding: 0 10px;
  font-size: 13px;
  background: rgba(28, 28, 30, 0.88);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  color: white;
  z-index: 100;
  backdrop-filter: blur(18px) saturate(1.2);
  -webkit-backdrop-filter: blur(18px) saturate(1.2);
}

.left,
.right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.right {
  gap: 10px;
}

.menu-trigger,
.menu-item {
  min-height: 25px;
  display: inline-flex;
  align-items: center;
  border: 0;
  border-radius: 5px;
  color: #f5f5f7;
  background: transparent;
  font: inherit;
  line-height: 1;
  cursor: default;
  user-select: none;
  font-size: 14px;
}

.menu-trigger {
  padding: 0 9px;
  transition:
    background 0.14s ease,
    color 0.14s ease;
}

.apple-trigger {
  width: 30px;
  justify-content: center;
  padding: 0;
}

.menu-trigger.strong {
  font-weight: 800;
}

.menu-trigger:hover,
.menu-trigger.active,
.menu-trigger:focus-visible {
  outline: none;
  background: rgba(255, 255, 255, 0.18);
}

.menu-item {
  padding: 0 2px;
}

.status-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon {
  width: 15px;
  height: 15px;
  color: white;
  opacity: 1;
}
</style>
