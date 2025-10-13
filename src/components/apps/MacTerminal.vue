<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'

const output = ref<string[]>([
  'Welcome to macOS Terminal 💻',
  'Type `help` to see available commands.',
])

const command = ref('')
const history = ref<string[]>([])
const historyIndex = ref(-1)
const terminalRef = ref<HTMLDivElement | null>(null)

const isDark = ref(true)

function runCommand(cmd: string) {
  const parts = cmd.trim().split(' ')
  const base = parts[0]
  const args = parts.slice(1)

  switch (base) {
    case 'help':
      output.value.push('Available commands:')
      output.value.push('  help       — Show this message')
      output.value.push('  echo [txt] — Print your text')
      output.value.push('  clear      — Clear the terminal')
      output.value.push('  date       — Show current date/time')
      output.value.push('  whoami     — Creator Info')
      output.value.push('  abtme     — Creator Info')
      output.value.push('  dark       — Toggle dark/light mode')
      break

    case 'echo':
      output.value.push(args.join(' '))
      break

    case 'clear':
      output.value = []
      break

    case 'date':
      output.value.push(new Date().toString())
      break

    case 'whoami':
      output.value.push('Mika Geshan')
      break

    case 'abtme':
      output.value.push('Mika Geshan')
      break

    case 'dark':
      toggleDarkMode()
      break

    case '':
      break

    default:
      output.value.push(`command not found: ${base}`)
      break
  }

  nextTick(() => {
    terminalRef.value?.scrollTo({
      top: terminalRef.value.scrollHeight,
      behavior: 'smooth',
    })
  })
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    output.value.push(`❯ ${command.value}`)
    runCommand(command.value)
    if (command.value.trim()) history.value.unshift(command.value)
    command.value = ''
    historyIndex.value = -1
  } else if (e.key === 'Backspace') {
    e.preventDefault()
    command.value = command.value.slice(0, -1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (historyIndex.value + 1 < history.value.length) {
      historyIndex.value++
      command.value = history.value[historyIndex.value]
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (historyIndex.value > 0) {
      historyIndex.value--
      command.value = history.value[historyIndex.value]
    } else {
      historyIndex.value = -1
      command.value = ''
    }
  } else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
    // handle normal typing
    command.value += e.key
  }
}

function toggleDarkMode() {
  isDark.value = !isDark.value
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="terminal-wrapper" :class="{ dark: isDark }" tabindex="0" @click="$el.focus()">
    <div class="terminal-body" ref="terminalRef">
      <div v-for="(line, index) in output" :key="index" class="line">
        {{ line }}
      </div>

      <div class="input-line">
        <span class="prompt">❯</span>
        <span class="command">{{ command }}</span>
        <span class="cursor" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.terminal-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  font-family: 'SF Mono', Menlo, monospace;
  color: #222;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 12px;
  overflow: hidden;
  transition:
    background 0.3s ease,
    color 0.3s ease;
  outline: none;
}

.terminal-wrapper.dark {
  background: rgba(30, 30, 30, 0.9);
  color: #d1d5db;
}

.terminal-body {
  flex: 1;
  padding: 12px 16px;
  overflow-y: auto;
  white-space: pre-wrap;
}

.line {
  margin-bottom: 4px;
}

.input-line {
  display: flex;
  align-items: center;
}

.prompt {
  color: #22c55e;
  margin-right: 6px;
}

.command {
  white-space: pre;
}

.cursor {
  width: 7px;
  height: 15px;
  background-color: currentColor;
  margin-left: 2px;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  50.1%,
  100% {
    opacity: 0;
  }
}
</style>
