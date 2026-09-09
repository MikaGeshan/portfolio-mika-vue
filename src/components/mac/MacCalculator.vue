<script setup lang="ts">
import { computed, ref } from 'vue'

type Operator = 'add' | 'subtract' | 'multiply' | 'divide'
type ButtonVariant = 'utility' | 'operator' | 'number'

interface CalculatorButton {
  label: string
  value: string
  variant: ButtonVariant
  wide?: boolean
}

const displayValue = ref('0')
const storedValue = ref<number | null>(null)
const pendingOperator = ref<Operator | null>(null)
const shouldResetDisplay = ref(false)

const buttons: CalculatorButton[] = [
  { label: 'AC', value: 'clear', variant: 'utility' },
  { label: '+/-', value: 'sign', variant: 'utility' },
  { label: '%', value: 'percent', variant: 'utility' },
  { label: '÷', value: 'divide', variant: 'operator' },
  { label: '7', value: '7', variant: 'number' },
  { label: '8', value: '8', variant: 'number' },
  { label: '9', value: '9', variant: 'number' },
  { label: '×', value: 'multiply', variant: 'operator' },
  { label: '4', value: '4', variant: 'number' },
  { label: '5', value: '5', variant: 'number' },
  { label: '6', value: '6', variant: 'number' },
  { label: '-', value: 'subtract', variant: 'operator' },
  { label: '1', value: '1', variant: 'number' },
  { label: '2', value: '2', variant: 'number' },
  { label: '3', value: '3', variant: 'number' },
  { label: '+', value: 'add', variant: 'operator' },
  { label: '0', value: '0', variant: 'number', wide: true },
  { label: '.', value: 'decimal', variant: 'number' },
  { label: '=', value: 'equals', variant: 'operator' },
]

const formattedDisplay = computed(() => {
  if (displayValue.value === 'Error') return displayValue.value

  const numericValue = Number(displayValue.value)
  if (!Number.isFinite(numericValue)) return 'Error'

  if (Math.abs(numericValue) >= 1e10 || (Math.abs(numericValue) < 1e-6 && numericValue !== 0)) {
    return numericValue.toExponential(5)
  }

  return displayValue.value
})

const activeOperatorSymbol = computed(() => {
  const symbols: Record<Operator, string> = {
    add: '+',
    subtract: '-',
    multiply: '×',
    divide: '÷',
  }

  return pendingOperator.value ? symbols[pendingOperator.value] : ''
})

function normalizeResult(value: number) {
  if (!Number.isFinite(value)) return 'Error'

  const rounded = Number.parseFloat(value.toPrecision(12))
  return rounded.toString()
}

function inputDigit(digit: string) {
  if (displayValue.value === 'Error' || shouldResetDisplay.value) {
    displayValue.value = digit
    shouldResetDisplay.value = false
    return
  }

  displayValue.value = displayValue.value === '0' ? digit : `${displayValue.value}${digit}`
}

function inputDecimal() {
  if (displayValue.value === 'Error' || shouldResetDisplay.value) {
    displayValue.value = '0.'
    shouldResetDisplay.value = false
    return
  }

  if (!displayValue.value.includes('.')) {
    displayValue.value = `${displayValue.value}.`
  }
}

function clearCalculator() {
  displayValue.value = '0'
  storedValue.value = null
  pendingOperator.value = null
  shouldResetDisplay.value = false
}

function toggleSign() {
  if (displayValue.value === '0' || displayValue.value === 'Error') return
  displayValue.value = displayValue.value.startsWith('-')
    ? displayValue.value.slice(1)
    : `-${displayValue.value}`
}

function applyPercent() {
  if (displayValue.value === 'Error') return
  displayValue.value = normalizeResult(Number(displayValue.value) / 100)
}

function calculate(left: number, right: number, operator: Operator) {
  switch (operator) {
    case 'add':
      return left + right
    case 'subtract':
      return left - right
    case 'multiply':
      return left * right
    case 'divide':
      return right === 0 ? Number.NaN : left / right
  }
}

function chooseOperator(operator: Operator) {
  const currentValue = Number(displayValue.value)

  if (displayValue.value === 'Error') {
    clearCalculator()
    return
  }

  if (storedValue.value !== null && pendingOperator.value && !shouldResetDisplay.value) {
    const result = calculate(storedValue.value, currentValue, pendingOperator.value)
    displayValue.value = normalizeResult(result)
    storedValue.value = displayValue.value === 'Error' ? null : Number(displayValue.value)
  } else {
    storedValue.value = currentValue
  }

  pendingOperator.value = operator
  shouldResetDisplay.value = true
}

function evaluate() {
  if (storedValue.value === null || !pendingOperator.value || displayValue.value === 'Error') return

  const currentValue = Number(displayValue.value)
  const result = calculate(storedValue.value, currentValue, pendingOperator.value)

  displayValue.value = normalizeResult(result)
  storedValue.value = null
  pendingOperator.value = null
  shouldResetDisplay.value = true
}

function backspace() {
  if (displayValue.value === 'Error' || shouldResetDisplay.value) {
    displayValue.value = '0'
    shouldResetDisplay.value = false
    return
  }

  displayValue.value =
    displayValue.value.length > 1 && displayValue.value !== '-0'
      ? displayValue.value.slice(0, -1)
      : '0'
}

function handleButtonPress(value: string) {
  if (/^\d$/.test(value)) {
    inputDigit(value)
    return
  }

  switch (value) {
    case 'decimal':
      inputDecimal()
      break
    case 'clear':
      clearCalculator()
      break
    case 'sign':
      toggleSign()
      break
    case 'percent':
      applyPercent()
      break
    case 'add':
    case 'subtract':
    case 'multiply':
    case 'divide':
      chooseOperator(value)
      break
    case 'equals':
      evaluate()
      break
  }
}

function handleKeydown(event: KeyboardEvent) {
  const keyMap: Record<string, string> = {
    Enter: 'equals',
    '=': 'equals',
    Escape: 'clear',
    Backspace: 'backspace',
    '+': 'add',
    '-': 'subtract',
    '*': 'multiply',
    x: 'multiply',
    X: 'multiply',
    '/': 'divide',
    '%': 'percent',
    '.': 'decimal',
    ',': 'decimal',
  }

  if (/^\d$/.test(event.key)) {
    event.preventDefault()
    inputDigit(event.key)
    return
  }

  const mappedValue = keyMap[event.key]
  if (!mappedValue) return

  event.preventDefault()
  if (mappedValue === 'backspace') {
    backspace()
  } else {
    handleButtonPress(mappedValue)
  }
}
</script>

<template>
  <div class="calculator" tabindex="0" @keydown="handleKeydown" @click="$el.focus()">
    <div class="display">
      <div class="operator-indicator">{{ activeOperatorSymbol }}</div>
      <output>{{ formattedDisplay }}</output>
    </div>

    <div class="keypad" aria-label="Calculator keypad">
      <button
        v-for="button in buttons"
        :key="button.value"
        type="button"
        class="calc-button"
        :class="[button.variant, { wide: button.wide, active: pendingOperator === button.value }]"
        @click="handleButtonPress(button.value)"
      >
        {{ button.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.calculator {
  width: min(100%, 360px);
  height: 100%;
  min-height: 460px;
  margin: 0 auto;
  display: grid;
  grid-template-rows: minmax(120px, 1fr) auto;
  gap: 12px;
  padding: 18px;
  color: #fff;
  background:
    linear-gradient(180deg, rgba(72, 72, 76, 0.88), rgba(31, 31, 34, 0.94)),
    #2c2c2f;
  border-radius: 0 0 12px 12px;
  outline: none;
  user-select: none;
}

.display {
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 8px 2px 6px;
  overflow: hidden;
}

.operator-indicator {
  height: 22px;
  color: rgba(255, 255, 255, 0.58);
  font-size: 18px;
  line-height: 1;
}

output {
  width: 100%;
  display: block;
  color: #fff;
  font-size: 64px;
  font-weight: 300;
  line-height: 1;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.keypad {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-auto-rows: 64px;
  gap: 10px;
}

.calc-button {
  min-width: 0;
  border: 0;
  border-radius: 999px;
  color: #fff;
  font: inherit;
  font-size: 25px;
  font-weight: 500;
  cursor: pointer;
  transition:
    transform 0.08s ease,
    filter 0.12s ease,
    background-color 0.12s ease;
}

.calc-button:hover {
  filter: brightness(1.12);
}

.calc-button:active {
  transform: scale(0.96);
  filter: brightness(0.92);
}

.calc-button.number {
  background: #5f6063;
}

.calc-button.utility {
  color: #101010;
  background: #b8b8bb;
}

.calc-button.operator {
  background: #ff9f0a;
}

.calc-button.operator.active {
  color: #ff9f0a;
  background: #fff;
}

.calc-button.wide {
  grid-column: span 2;
  padding-left: 26px;
  text-align: left;
}

@media (max-width: 560px) {
  .calculator {
    width: 100%;
    min-height: 420px;
    padding: 14px;
  }

  output {
    font-size: 52px;
  }

  .keypad {
    grid-auto-rows: 56px;
    gap: 8px;
  }
}
</style>
