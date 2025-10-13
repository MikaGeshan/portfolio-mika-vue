<script setup lang="ts">
import { ref, onBeforeUnmount, watch, onMounted } from 'vue'
import { X, Minus, Maximize2 } from 'lucide-vue-next'

const props = defineProps({
  title: { type: String, default: 'Untitled Window' },
  width: { type: [Number, String], default: 1100 },
  height: { type: [Number, String], default: 650 },
  zIndex: { type: Number, default: 10 },
  initialPosition: {
    type: Object,
    default: () => ({ x: 100, y: 100 }),
  },
  visible: { type: Boolean, default: true },
})

const emit = defineEmits(['close', 'minimize', 'fullscreen'])

const isVisible = ref(props.visible)
const isMinimized = ref(false)
const isFullscreen = ref(false)

const position = ref({ ...props.initialPosition })
const offset = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const windowRef = ref<HTMLElement | null>(null)

function toggleClose() {
  isVisible.value = false
  emit('close')
}

function toggleMinimize() {
  isMinimized.value = !isMinimized.value
  emit('minimize', isMinimized.value)
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
  emit('fullscreen', isFullscreen.value)

  if (isFullscreen.value) {
    position.value = { x: 0, y: 0 }
    if (windowRef.value) windowRef.value.style.transform = `translate(0, 0)`
  }
}

function onMouseDown(e: MouseEvent) {
  if (isFullscreen.value) return
  isDragging.value = true
  offset.value = {
    x: e.clientX - position.value.x,
    y: e.clientY - position.value.y,
  }
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging.value || !windowRef.value) return

  const newX = e.clientX - offset.value.x
  const newY = e.clientY - offset.value.y

  position.value.x += (newX - position.value.x) * 0.2
  position.value.y += (newY - position.value.y) * 0.2

  windowRef.value.style.transform = `translate(${position.value.x}px, ${position.value.y}px)`
}

function onMouseUp() {
  isDragging.value = false
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}

onMounted(() => {
  if (windowRef.value) {
    windowRef.value.style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
    windowRef.value.style.height =
      typeof props.height === 'number' ? `${props.height}px` : props.height
    windowRef.value.style.zIndex = String(props.zIndex)
    windowRef.value.style.transform = `translate(${position.value.x}px, ${position.value.y}px)`
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
})

watch(
  () => props.visible,
  (newVal) => {
    isVisible.value = newVal
  },
)
</script>

<template>
  <div
    v-if="isVisible"
    ref="windowRef"
    class="mac-window"
    :class="{
      minimized: isMinimized,
      fullscreen: isFullscreen,
    }"
  >
    <div class="window-header" @mousedown="onMouseDown">
      <div class="dots">
        <span class="dot red" @click.stop="toggleClose"><X class="icon" /></span>
        <span class="dot yellow" @click.stop="toggleMinimize"><Minus class="icon" /></span>
        <span class="dot green" @click.stop="toggleFullscreen"><Maximize2 class="icon" /></span>
      </div>
    </div>

    <div class="window-content" v-show="!isMinimized">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.mac-window {
  position: absolute;
  width: 1100px;
  height: 650px;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  background-image: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0.15),
    rgba(255, 255, 255, 0.05)
  );
  border-radius: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.4),
    inset 0 1px 2px rgba(255, 255, 255, 0.15);
  overflow: hidden;
  cursor: default;
  transition:
    transform 0.08s ease-out,
    box-shadow 0.3s ease;
}

.mac-window:hover {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.4),
    inset 0 1px 2px rgba(255, 255, 255, 0.15);
}

.mac-window.fullscreen {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  border-radius: 0;
  z-index: 9999;
  transform: none !important;
  transition: all 0.3s ease;
}

.mac-window.minimized {
  height: 50px;
  overflow: hidden;
  transition: height 0.3s ease;
}

.window-header {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  cursor: move;
  user-select: none;
}

.dots {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-left: 0.25rem;
}

.dot {
  width: 0.85rem;
  height: 0.85rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.dot:hover {
  transform: scale(1.1);
  opacity: 0.9;
}

.red {
  background-color: #ef4444;
}
.yellow {
  background-color: #facc15;
}
.green {
  background-color: #22c55e;
}

.icon {
  width: 0.75rem;
  height: 0.75rem;
  color: black;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.window-header:hover .icon {
  opacity: 1;
}

.window-content {
  display: flex;
  flex: 1;
  padding: 2.5rem;
  overflow: hidden;
}
</style>
