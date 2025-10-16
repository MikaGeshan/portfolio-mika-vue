<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits(['unlocked'])

const locked = ref(true)
const time = ref('')
const date = ref('')

function updateClock() {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  time.value = `${hours}:${minutes}`

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }
  date.value = now.toLocaleDateString('en-US', options)
}

let clockInterval: number

onMounted(() => {
  updateClock()
  clockInterval = window.setInterval(updateClock, 1000)
  window.addEventListener('keydown', handleKeyPress)
})

onBeforeUnmount(() => {
  clearInterval(clockInterval)
  window.removeEventListener('keydown', handleKeyPress)
})

function handleKeyPress(e: KeyboardEvent) {
  if (e.key === 'Enter') unlock()
}

function unlock() {
  locked.value = false
  emit('unlocked')
}
</script>

<template>
  <transition name="fade">
    <div v-if="locked" class="lockscreen" @click="unlock">
      <div class="clock-container">
        <div class="clock-date">{{ date }}</div>
        <div class="clock-time">{{ time }}</div>
      </div>

      <div class="login-container">
        <img src="@/assets/images/lockscreenprofile.jpeg" alt="User Avatar" class="avatar" />
        <h2 class="username">Mika Geshan</h2>
        <p class="hint">Press Enter or Click Anywhere to Unlock</p>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.lockscreen {
  position: fixed;
  inset: 0;
  background-color: #1c1c1c;
  background-image: url('@/assets/images/macbackground.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 9999;
  color: #fff;
  font-family:
    -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Helvetica,
    Arial, sans-serif;
  overflow: hidden;
  user-select: none;
  cursor: pointer;
  will-change: opacity;
  transform: none;
  backface-visibility: visible;
}

.clock-container {
  text-align: center;
  margin-top: 6vh;
}

.clock-time {
  font-size: 7rem;
  font-weight: 600;
  letter-spacing: -1px;
  margin: 0;
}

.clock-date {
  font-size: 1.5rem;
  opacity: 0.9;
  font-weight: 400;
  margin-top: 0.5rem;
}

.login-container {
  text-align: center;
  margin-bottom: 9vh;
}

.avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 0.8rem;
  border: 2px solid #fff;
}

.username {
  font-weight: 500;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.hint {
  font-size: 0.9rem;
  opacity: 0.7;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
