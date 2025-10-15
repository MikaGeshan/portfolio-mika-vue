<script lang="ts" setup>
import { defineProps } from 'vue'

interface MenuItem {
  name: string
}

const props = defineProps<{
  items: MenuItem[]
}>()
</script>

<template>
  <div class="mac-menu">
    <ul>
      <li v-for="(item, i) in props.items" :key="i">
        <span>{{ item.name }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.mac-menu {
  position: absolute;
  min-width: 200px;
  background: #2f2f2f;
  border-radius: 8px;
  border: 1px solid #4a4a4a;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.4),
    inset 0 0 0.5px rgba(255, 255, 255, 0.05);
  overflow: hidden;
  color: #f5f5f7;
  font-size: 13px;
  user-select: none;
  z-index: 999;
  padding: 4px 0;
  animation: fadeIn 0.15s ease-out;
}

.mac-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.mac-menu li {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 6px 16px;
  cursor: default;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.mac-menu li:hover {
  background: #3c3c3c;
}

.mac-menu li:active {
  background: #505050;
}

.mac-menu li + li {
  border-top: 1px solid #404040;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
