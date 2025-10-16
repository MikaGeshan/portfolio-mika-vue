<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'

const output = ref<(string | { html: string })[]>([
  'Welcome to macOS Terminal 💻',
  'Type `help` to see available commands.',
])

const command = ref('')
const history = ref<string[]>([])
const historyIndex = ref(-1)
const terminalRef = ref<HTMLDivElement | null>(null)
const isDark = ref(true)

function pushOutput(line: string | { html: string }) {
  output.value.push(line)
}

function runCommand(cmd: string) {
  const parts = cmd.trim().split(' ')
  const base = parts[0]
  const args = parts.slice(1)

  switch (base) {
    case 'help':
      pushOutput('Available commands:')
      pushOutput('  help       — Show this message')
      pushOutput('  echo [txt] — Print your text')
      pushOutput('  clear      — Clear the terminal')
      pushOutput('  date       — Show current date/time')
      pushOutput('  whoami     — Creator Info')
      pushOutput('  abtme      — Creator Details')
      pushOutput('  links      — View my social links')
      pushOutput('  dark       — Toggle dark/light mode')
      break
    case 'echo':
      pushOutput(args.join(' '))
      break
    case 'clear':
      output.value = []
      break
    case 'date':
      pushOutput(new Date().toString())
      break
    case 'whoami':
      pushOutput('Mika Geshan')
      break
    case 'abtme':
      pushOutput(
        "Hi, I'm a Front-End Developer with a background in Software Engineering. Skilled in building user-friendly, modern interfaces and quick to adapt to new tools and environments. Experienced in front-end development, both independently and in teams, and able to work remotely or on-site as needed.",
      )
      break
    case 'links':
      pushOutput('My Social Links 🌐')
      pushOutput({
        html: `
          <div class="links">
            🟦 <a href="https://www.linkedin.com/in/mika-geshan-1741b7330" target="_blank">LinkedIn</a><br>
            📷 <a href="https://www.instagram.com/noturfavmikaaa" target="_blank">Instagram</a><br>
            🐙 <a href="https://github.com/MikaGeshan" target="_blank">GitHub</a><br>
          </div>
        `,
      })
      break
    case 'dark':
      toggleDarkMode()
      break
    case '':
      break
    default:
      pushOutput(`command not found: ${base}`)
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
    pushOutput(`❯ ${command.value}`)
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
      <div
        v-for="(line, index) in output"
        :key="index"
        class="line"
        v-html="typeof line === 'string' ? line : line.html"
      />
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
  font-size: 13px;
  color: #222;
  background-color: #f5f5f5;
  border-radius: 0 0 10px 10px;
  overflow: hidden;
  outline: none;
}

.terminal-wrapper.dark {
  background-color: #121212;
  color: #e5e7eb;
}

.terminal-body {
  flex: 1;
  padding: 14px 18px;
  overflow-y: auto;
  white-space: pre-wrap;
  line-height: 1.45;
}

.line {
  margin-bottom: 6px;
  word-wrap: break-word;
}

.input-line {
  display: flex;
  align-items: center;
  margin-top: 2px;
}

.prompt {
  color: #22c55e;
  margin-right: 6px;
  font-weight: 600;
}

.command {
  white-space: pre;
}

.cursor {
  width: 7px;
  height: 15px;
  background-color: currentColor;
  margin-left: 2px;
  border-radius: 1px;
  animation: blink 1s infinite;
}

.links {
  margin-top: 4px;
}

.links a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

.links a:hover {
  text-decoration: underline;
}

.terminal-wrapper.dark .links a {
  color: #60a5fa;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}
</style>
