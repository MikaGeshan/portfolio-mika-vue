<script setup lang="ts">
import { ref, onBeforeUnmount, watch, onMounted, computed } from 'vue'
import { X, Minus, Maximize2 } from 'lucide-vue-next'

const props = defineProps({
  title: { type: String, default: 'Untitled Window' },
  width: { type: [Number, String], default: 1100 },
  height: { type: [Number, String], default: 650 },
  zIndex: { type: Number, default: 10 },
  backgroundColor: { type: String, default: '#2d2d2d' },
  initialPosition: {
    type: Object,
    default: () => ({ x: 100, y: 100 }),
  },
  visible: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'minimize', 'fullscreen'])

const isVisible = ref(props.visible)
const isMinimized = ref(false)
const isFullscreen = ref(false)
const position = ref({ ...props.initialPosition })
const size = ref({
  width: Number(props.width),
  height: Number(props.height),
})
const offset = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const isResizing = ref(false)
const resizeDir = ref<string | null>(null)
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
  if (!windowRef.value) return

  if (isDragging.value) {
    const newX = e.clientX - offset.value.x
    const newY = e.clientY - offset.value.y
    position.value.x = newX
    position.value.y = newY
    updateTransform()
  }

  if (isResizing.value && resizeDir.value) {
    const minWidth = 400
    const minHeight = 300

    let newWidth = size.value.width
    let newHeight = size.value.height
    let newX = position.value.x
    let newY = position.value.y

    if (resizeDir.value.includes('right'))
      newWidth = Math.max(minWidth, e.clientX - position.value.x)
    if (resizeDir.value.includes('bottom'))
      newHeight = Math.max(minHeight, e.clientY - position.value.y)
    if (resizeDir.value.includes('left')) {
      const diffX = e.clientX - position.value.x
      newWidth = Math.max(minWidth, size.value.width - diffX)
      newX = e.clientX
    }
    if (resizeDir.value.includes('top')) {
      const diffY = e.clientY - position.value.y
      newHeight = Math.max(minHeight, size.value.height - diffY)
      newY = e.clientY
    }

    size.value = { width: newWidth, height: newHeight }
    position.value = { x: newX, y: newY }
    updateTransform()
  }
}

function onMouseUp() {
  isDragging.value = false
  isResizing.value = false
  resizeDir.value = null
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}

function onResizeStart(direction: string, e: MouseEvent) {
  if (isFullscreen.value) return
  e.stopPropagation()
  isResizing.value = true
  resizeDir.value = direction
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

function updateTransform() {
  if (windowRef.value) {
    windowRef.value.style.transform = `translate(${position.value.x}px, ${position.value.y}px)`
    windowRef.value.style.width = `${size.value.width}px`
    windowRef.value.style.height = `${size.value.height}px`
  }
}

onMounted(() => updateTransform())

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
})

watch(
  () => props.visible,
  (newVal) => (isVisible.value = newVal),
)

const windowStyle = computed(() => ({
  background: props.backgroundColor,
}))
</script>

<template>
  <div
    v-if="isVisible"
    ref="windowRef"
    class="mac-window"
    :class="{ minimized: isMinimized, fullscreen: isFullscreen }"
    :style="windowStyle"
  >
    <div class="window-header" @mousedown="onMouseDown">
      <div class="dots">
        <span class="dot red" @click.stop="toggleClose"><X class="icon" /></span>
        <span class="dot yellow" @click.stop="toggleMinimize"><Minus class="icon" /></span>
        <span class="dot green" @click.stop="toggleFullscreen"><Maximize2 class="icon" /></span>
      </div>
      <span class="window-title">{{ props.title }}</span>
    </div>

    <div class="window-content" v-show="!isMinimized">
      <slot />
    </div>

    <div class="resize-handle top" @mousedown="onResizeStart('top', $event)" />
    <div class="resize-handle right" @mousedown="onResizeStart('right', $event)" />
    <div class="resize-handle bottom" @mousedown="onResizeStart('bottom', $event)" />
    <div class="resize-handle left" @mousedown="onResizeStart('left', $event)" />
    <div class="resize-handle top-left" @mousedown="onResizeStart('top-left', $event)" />
    <div class="resize-handle top-right" @mousedown="onResizeStart('top-right', $event)" />
    <div class="resize-handle bottom-left" @mousedown="onResizeStart('bottom-left', $event)" />
    <div class="resize-handle bottom-right" @mousedown="onResizeStart('bottom-right', $event)" />
  </div>
</template>

<style scoped>
.mac-window {
  position: absolute;
  display: flex;
  flex-direction: column;
  background: #2d2d2d; /* solid dark gray */
  border-radius: 0.75rem;
  border: 1px solid #3a3a3a; /* solid gray */
  box-shadow: 0 12px 35px #000000; /* solid black shadow */
  overflow: hidden;
  cursor: default;
  transition:
    transform 0.08s ease-out,
    box-shadow 0.3s ease;
}

.mac-window.fullscreen {
  position: fixed;
  inset: 0;
  width: 100vw !important;
  height: 100vh !important;
  border-radius: 0;
  z-index: 9999;
  transform: none !important;
  transition: all 0.3s ease;
}

.mac-window.minimized {
  height: 50px !important;
  overflow: hidden;
  transition: height 0.3s ease;
}

.window-header {
  display: flex;
  align-items: center;
  padding: 0.8rem 1.2rem;
  background: #1e1e1e; /* solid dark header */
  border-bottom: 1px solid #3b3b3b;
  cursor: move;
  user-select: none;
}

.window-title {
  flex: 1;
  text-align: center;
  color: #f1f1f1;
  font-size: 0.9rem;
  font-weight: 500;
  pointer-events: none;
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
  width: 0.7rem;
  height: 0.7rem;
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
  padding: 1.5rem;
  overflow: hidden;
  color: #ffffff;
}

.resize-handle {
  position: absolute;
  background: #2d2d2d;
  z-index: 10;
}
.resize-handle.top,
.resize-handle.bottom {
  height: 6px;
  left: 0;
  right: 0;
  cursor: ns-resize;
}
.resize-handle.left,
.resize-handle.right {
  width: 6px;
  top: 0;
  bottom: 0;
  cursor: ew-resize;
}
.resize-handle.top {
  top: -3px;
}
.resize-handle.bottom {
  bottom: -3px;
}
.resize-handle.left {
  left: -3px;
}
.resize-handle.right {
  right: -3px;
}

.resize-handle.top-left,
.resize-handle.top-right,
.resize-handle.bottom-left,
.resize-handle.bottom-right {
  width: 10px;
  height: 10px;
  position: absolute;
}
.resize-handle.top-left {
  top: -2px;
  left: -2px;
  cursor: nwse-resize;
}
.resize-handle.top-right {
  top: -2px;
  right: -2px;
  cursor: nesw-resize;
}
.resize-handle.bottom-left {
  bottom: -2px;
  left: -2px;
  cursor: nesw-resize;
}
.resize-handle.bottom-right {
  bottom: -2px;
  right: -2px;
  cursor: nwse-resize;
}
</style>
