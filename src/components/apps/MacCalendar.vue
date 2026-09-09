<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

interface CalendarDay {
  date: Date
  key: string
  dayNumber: number
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
}

const today = new Date()
const selectedDate = ref(startOfDay(today))
const visibleMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1))

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const monthLabel = computed(() =>
  visibleMonth.value.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  }),
)

const selectedDateLabel = computed(() =>
  selectedDate.value.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }),
)

const calendarDays = computed<CalendarDay[]>(() => {
  const year = visibleMonth.value.getFullYear()
  const month = visibleMonth.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const gridStart = new Date(year, month, 1 - firstDay.getDay())

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index)

    return {
      date,
      key: dateKey(date),
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      isToday: isSameDay(date, today),
      isSelected: isSameDay(date, selectedDate.value),
    }
  })
})

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

function isSameDay(firstDate: Date, secondDate: Date) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  )
}

function selectDate(date: Date) {
  selectedDate.value = startOfDay(date)
  visibleMonth.value = new Date(date.getFullYear(), date.getMonth(), 1)
}

function changeMonth(monthOffset: number) {
  visibleMonth.value = new Date(
    visibleMonth.value.getFullYear(),
    visibleMonth.value.getMonth() + monthOffset,
    1,
  )
}

function showToday() {
  selectDate(today)
}

function moveSelectedDate(dayOffset: number) {
  selectDate(addDays(selectedDate.value, dayOffset))
}

function handleCalendarKeydown(event: KeyboardEvent) {
  const keyActions: Record<string, () => void> = {
    ArrowLeft: () => moveSelectedDate(-1),
    ArrowRight: () => moveSelectedDate(1),
    ArrowUp: () => moveSelectedDate(-7),
    ArrowDown: () => moveSelectedDate(7),
    Home: showToday,
    PageUp: () => changeMonth(-1),
    PageDown: () => changeMonth(1),
  }

  const action = keyActions[event.key]
  if (!action) return

  event.preventDefault()
  action()
}
</script>

<template>
  <div class="calendar-app" @keydown="handleCalendarKeydown">
    <header class="calendar-header">
      <div>
        <p class="eyebrow">Calendar</p>
        <h2>{{ monthLabel }}</h2>
      </div>

      <div class="calendar-actions">
        <button type="button" class="today-button" @click="showToday">Today</button>
        <button type="button" class="icon-button" aria-label="Previous month" @click="changeMonth(-1)">
          <ChevronLeft aria-hidden="true" />
        </button>
        <button type="button" class="icon-button" aria-label="Next month" @click="changeMonth(1)">
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
    </header>

    <section class="month-grid" aria-label="Month calendar">
      <div v-for="weekday in weekdayLabels" :key="weekday" class="weekday">
        {{ weekday }}
      </div>

      <button
        v-for="day in calendarDays"
        :key="day.key"
        type="button"
        class="day-cell"
        :class="{
          muted: !day.isCurrentMonth,
          today: day.isToday,
          selected: day.isSelected,
        }"
        :aria-label="day.date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })"
        :aria-pressed="day.isSelected"
        @click="selectDate(day.date)"
      >
        <span>{{ day.dayNumber }}</span>
      </button>
    </section>

    <aside class="day-details" aria-live="polite">
      <div>
        <p class="details-label">Selected Day</p>
        <h3>{{ selectedDateLabel }}</h3>
      </div>

      <div class="empty-state">
        <p>No events scheduled.</p>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.calendar-app {
  width: 100%;
  height: 100%;
  min-height: 520px;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 18px;
  padding: 22px;
  color: #f7f7f8;
  background: #242426;
}

.calendar-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.eyebrow,
.details-label {
  margin: 0 0 4px;
  color: #b7b7bc;
  font-size: 12px;
  font-weight: 600;
}

h2,
h3 {
  margin: 0;
  color: #fff;
  font-weight: 650;
  line-height: 1.1;
}

h2 {
  font-size: 30px;
}

h3 {
  font-size: 18px;
}

.calendar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

button {
  font-family: inherit;
}

.today-button,
.icon-button,
.day-cell {
  border: 0;
  color: inherit;
  cursor: pointer;
}

.today-button {
  min-height: 34px;
  padding: 0 14px;
  border-radius: 8px;
  color: #fff;
  background: #0a84ff;
  font-size: 13px;
  font-weight: 600;
}

.icon-button {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #39393d;
}

.icon-button svg {
  width: 18px;
  height: 18px;
}

.month-grid {
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  grid-template-rows: 24px repeat(6, minmax(44px, 1fr));
  gap: 6px;
}

.weekday {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a5a5aa;
  font-size: 12px;
  font-weight: 700;
}

.day-cell {
  position: relative;
  min-width: 0;
  min-height: 44px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 8px;
  border-radius: 8px;
  background: #303034;
  color: #f4f4f5;
  font-size: 14px;
  transition:
    background-color 0.16s ease,
    color 0.16s ease,
    transform 0.08s ease;
}

.day-cell:hover {
  background: #3c3c41;
}

.day-cell:active {
  transform: scale(0.98);
}

.day-cell.muted {
  color: #77777d;
  background: #29292d;
}

.day-cell.today span,
.day-cell.selected span {
  min-width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.day-cell.today span {
  color: #fff;
  background: #bf5af2;
}

.day-cell.selected {
  background: #0a84ff;
  color: #fff;
}

.day-cell.selected span {
  background: rgba(255, 255, 255, 0.2);
}

.today-button:focus-visible,
.icon-button:focus-visible,
.day-cell:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.day-details {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding-top: 16px;
  border-top: 1px solid #3d3d42;
}

.empty-state {
  max-width: 220px;
  color: #c7c7cc;
  font-size: 13px;
  text-align: right;
}

.empty-state p {
  margin: 0;
}

@media (max-width: 720px) {
  .calendar-app {
    min-height: 500px;
    padding: 16px;
    gap: 14px;
  }

  .calendar-header,
  .day-details {
    flex-direction: column;
    align-items: stretch;
  }

  .calendar-actions {
    justify-content: flex-start;
  }

  h2 {
    font-size: 24px;
  }

  .month-grid {
    gap: 4px;
    grid-template-rows: 22px repeat(6, minmax(42px, 1fr));
  }

  .day-cell {
    padding: 6px;
    font-size: 13px;
  }

  .empty-state {
    max-width: none;
    text-align: left;
  }
}
</style>
