<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'

type OutputLine =
  | { kind: 'text'; text: string }
  | { kind: 'command'; text: string }
  | { kind: 'link'; label: string; href: string }
  | { kind: 'blank' }

const promptUser = 'mika@portfolio'
const promptPath = '~'

const output = ref<OutputLine[]>([
  { kind: 'text', text: `Last login: ${formatLoginTime()} on ttys000` },
  { kind: 'text', text: 'Type help to see available commands.' },
  { kind: 'blank' },
])

const command = ref('')
const history = ref<string[]>([])
const historyIndex = ref(-1)
const terminalRef = ref<HTMLDivElement | null>(null)
const terminalWrapperRef = ref<HTMLDivElement | null>(null)
const isDark = ref(true)
const helpCommands: [string, string][] = [
  ['help', 'Show available commands'],
  ['echo [txt]', 'Print text'],
  ['clear', 'Clear the terminal'],
  ['date', 'Show current date and time'],
  ['whoami', 'Show creator name'],
  ['abtme', 'Show creator details'],
  ['links', 'Show social links'],
  ['dark', 'Toggle terminal theme'],
]

function formatLoginTime() {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date())
}

function pushOutput(line: OutputLine) {
  output.value.push(line)
}

function pushText(text: string) {
  pushOutput({ kind: 'text', text })
}

function pushBlank() {
  pushOutput({ kind: 'blank' })
}

function pushPromptLine(text: string) {
  pushOutput({ kind: 'command', text })
}

function pushLink(label: string, href: string) {
  pushOutput({ kind: 'link', label, href })
}

function scrollToBottom() {
  nextTick(() => {
    terminalRef.value?.scrollTo({
      top: terminalRef.value.scrollHeight,
      behavior: 'smooth',
    })
  })
}

function runCommand(cmd: string) {
  const trimmedCommand = cmd.trim()

  if (!trimmedCommand) {
    scrollToBottom()
    return
  }

  const [base = '', ...args] = trimmedCommand.split(/\s+/)

  switch (base.toLowerCase()) {
    case 'help':
      pushText('Available commands:')
      helpCommands.forEach(([name, description]) => {
        pushText(`  ${name.padEnd(11)} ${description}`)
      })
      break
    case 'echo':
      pushText(args.length ? trimmedCommand.slice(4).trimStart() : '')
      break
    case 'clear':
      output.value = []
      break
    case 'date':
      pushText(new Date().toString())
      break
    case 'whoami':
      pushText('Mika Geshan')
      break
    case 'abtme':
      pushText('Mika Geshan')
      pushText('Front-End Developer with a Software Engineering background.')
      pushText('Focused on clean interfaces, modern front-end workflows, and adaptable team work.')
      break
    case 'links':
      pushText('Social links:')
      pushLink('LinkedIn', 'https://www.linkedin.com/in/mika-geshan-1741b7330')
      pushLink('Instagram', 'https://www.instagram.com/noturfavmikaaa')
      pushLink('GitHub', 'https://github.com/MikaGeshan')
      break
    case 'dark':
    case 'theme':
      toggleDarkMode()
      pushText(`Theme: ${isDark.value ? 'Dark' : 'Light'}`)
      break
    default:
      pushText(`zsh: command not found: ${base}`)
      break
  }

  scrollToBottom()
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    pushPromptLine(command.value)
    runCommand(command.value)
    if (command.value.trim()) history.value.unshift(command.value)
    command.value = ''
    historyIndex.value = -1
    return
  }

  if (e.key === 'Backspace') {
    e.preventDefault()
    command.value = command.value.slice(0, -1)
    return
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (historyIndex.value + 1 < history.value.length) {
      historyIndex.value++
      command.value = history.value[historyIndex.value] ?? ''
    }
    return
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (historyIndex.value > 0) {
      historyIndex.value--
      command.value = history.value[historyIndex.value] ?? ''
    } else {
      historyIndex.value = -1
      command.value = ''
    }
    return
  }

  if (e.key === 'Escape') {
    terminalWrapperRef.value?.blur()
    return
  }

  if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
    e.preventDefault()
    command.value += e.key
  }
}

function handlePaste(e: ClipboardEvent) {
  const pastedText = e.clipboardData?.getData('text/plain')

  if (!pastedText) return

  e.preventDefault()
  command.value += pastedText.replace(/[\r\n]+/g, ' ')
}

function focusTerminal() {
  terminalWrapperRef.value?.focus()
}

function toggleDarkMode() {
  isDark.value = !isDark.value
}

onMounted(() => {
  nextTick(() => {
    focusTerminal()
    scrollToBottom()
  })
})
</script>

<template>
  <div
    ref="terminalWrapperRef"
    class="terminal-wrapper"
    :class="{ 'is-dark': isDark, 'is-light': !isDark }"
    tabindex="0"
    role="application"
    aria-label="Portfolio terminal"
    @click="focusTerminal"
    @keydown="handleKeyDown"
    @paste="handlePaste"
  >
    <div class="terminal-chrome" aria-hidden="true">
      <div class="terminal-tab">
        <span class="tab-title">zsh</span>
        <span class="tab-meta">{{ promptUser }}</span>
      </div>
      <div class="terminal-status">
        <span>80x24</span>
        <span>{{ isDark ? 'Dark' : 'Light' }}</span>
      </div>
    </div>

    <div ref="terminalRef" class="terminal-body">
      <div
        v-for="(line, index) in output"
        :key="index"
        class="line"
        :class="`line-${line.kind}`"
      >
        <template v-if="line.kind === 'command'">
          <span class="prompt-user">{{ promptUser }}</span>
          <span class="prompt-path">{{ promptPath }}</span>
          <span class="prompt-symbol">$</span>
          <span class="command-text">{{ line.text }}</span>
        </template>

        <a
          v-else-if="line.kind === 'link'"
          class="terminal-link"
          :href="line.href"
          target="_blank"
          rel="noreferrer noopener"
        >
          {{ line.label }}
        </a>

        <span v-else-if="line.kind === 'blank'" aria-hidden="true">&nbsp;</span>

        <template v-else>{{ line.text }}</template>
      </div>

      <div class="input-line" aria-live="polite">
        <span class="prompt-user">{{ promptUser }}</span>
        <span class="prompt-path">{{ promptPath }}</span>
        <span class="prompt-symbol">$</span>
        <span class="command-text">{{ command }}</span>
        <span class="cursor" aria-hidden="true" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.terminal-wrapper {
  --terminal-bg: #0b0d10;
  --terminal-surface: #15171c;
  --terminal-surface-strong: #1c1f26;
  --terminal-border: rgba(255, 255, 255, 0.09);
  --terminal-text: #d8dee9;
  --terminal-muted: #7f8795;
  --terminal-accent: #33d17a;
  --terminal-link: #77bdfb;
  --terminal-shadow: rgba(0, 0, 0, 0.28);

  display: flex;
  flex-direction: column;
  width: calc(100% + 3rem);
  height: calc(100% + 3rem);
  min-height: 0;
  margin: -1.5rem;
  color: var(--terminal-text);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0)),
    var(--terminal-bg);
  border-radius: 0 0 10px 10px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
  overflow: hidden;
  font-family: 'SF Mono', 'SFMono-Regular', Menlo, Consolas, monospace;
  font-size: 13px;
  line-height: 1.55;
}

.terminal-wrapper.is-light {
  --terminal-bg: #f7f3ea;
  --terminal-surface: #ebe5d8;
  --terminal-surface-strong: #fffaf0;
  --terminal-border: rgba(70, 55, 32, 0.15);
  --terminal-text: #2d261d;
  --terminal-muted: #796e61;
  --terminal-accent: #087443;
  --terminal-link: #1f5f9f;
  --terminal-shadow: rgba(95, 72, 40, 0.14);

  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0)),
    var(--terminal-bg);
}

.terminal-wrapper:focus-visible {
  box-shadow:
    inset 0 0 0 2px rgba(10, 132, 255, 0.72),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.terminal-chrome {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  min-height: 34px;
  padding: 5px 10px 0;
  color: var(--terminal-muted);
  background:
    linear-gradient(180deg, var(--terminal-surface-strong), var(--terminal-surface));
  border-bottom: 1px solid var(--terminal-border);
  box-shadow: 0 8px 24px var(--terminal-shadow);
}

.terminal-tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: min(320px, 62%);
  min-height: 28px;
  padding: 0 12px;
  color: var(--terminal-text);
  background: var(--terminal-bg);
  border: 1px solid var(--terminal-border);
  border-bottom-color: transparent;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 -1px 0 rgba(255, 255, 255, 0.04);
}

.tab-title {
  font-weight: 700;
}

.tab-meta {
  min-width: 0;
  overflow: hidden;
  color: var(--terminal-muted);
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.terminal-status {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 28px;
  padding-bottom: 7px;
  font-size: 11px;
  white-space: nowrap;
}

.terminal-body {
  flex: 1;
  min-height: 0;
  padding: 12px 14px 15px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-color: color-mix(in srgb, var(--terminal-muted) 45%, transparent) transparent;
}

.line,
.input-line {
  width: 100%;
  margin: 0 0 3px;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

.line-link {
  margin-left: 2ch;
}

.input-line {
  display: flex;
  align-items: baseline;
  min-height: 22px;
}

.prompt-user,
.prompt-path,
.prompt-symbol {
  flex: 0 0 auto;
  font-weight: 700;
}

.prompt-user {
  color: var(--terminal-accent);
}

.prompt-path {
  margin-left: 8px;
  color: #f8c555;
}

.prompt-symbol {
  margin: 0 8px 0 6px;
  color: var(--terminal-muted);
}

.command-text {
  min-width: 0;
  color: var(--terminal-text);
  overflow-wrap: anywhere;
}

.terminal-link {
  color: var(--terminal-link);
  font-weight: 650;
  text-decoration: none;
  text-underline-offset: 3px;
}

.terminal-link:hover,
.terminal-link:focus-visible {
  text-decoration: underline;
}

.cursor {
  display: inline-block;
  width: 7px;
  height: 1.2em;
  margin-left: 2px;
  vertical-align: -0.22em;
  background: var(--terminal-text);
  border-radius: 1px;
  animation: terminal-cursor-blink 1s steps(1, end) infinite;
}

@keyframes terminal-cursor-blink {
  50% {
    opacity: 0;
  }
}

@media (max-width: 640px) {
  .terminal-wrapper {
    font-size: 12px;
  }

  .terminal-chrome {
    min-height: 32px;
    padding-inline: 8px;
  }

  .terminal-tab {
    max-width: 70%;
    min-height: 26px;
    padding-inline: 10px;
  }

  .terminal-status {
    gap: 7px;
    min-height: 26px;
    padding-bottom: 6px;
  }

  .terminal-body {
    padding: 11px 12px 14px;
  }
}
</style>
