<script lang="ts" setup>
interface MenuItem {
  name: string
  shortcut?: string
  disabled?: boolean
  divider?: boolean
}

const props = withDefaults(
  defineProps<{
    items: MenuItem[]
    minWidth?: number
  }>(),
  {
    minWidth: 220,
  },
)

const emit = defineEmits<{
  select: [item: MenuItem]
}>()

function handleSelect(item: MenuItem) {
  if (item.disabled || item.divider) return
  emit('select', item)
}
</script>

<template>
  <div class="mac-menu" role="menu" :style="{ minWidth: `${props.minWidth}px` }">
    <ul>
      <li v-for="(item, index) in props.items" :key="`${item.name}-${index}`">
        <div v-if="item.divider" class="menu-divider" role="separator" />

        <button
          v-else
          type="button"
          class="menu-row"
          :class="{ disabled: item.disabled }"
          :disabled="item.disabled"
          role="menuitem"
          @click="handleSelect(item)"
        >
          <span class="menu-label">{{ item.name }}</span>
          <span v-if="item.shortcut" class="menu-shortcut">{{ item.shortcut }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.mac-menu {
  position: absolute;
  z-index: 999;
  padding: 6px;
  overflow: hidden;
  color: #f5f5f7;
  font-size: 13px;
  user-select: none;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 10px;
  background: rgba(38, 38, 42, 0.9);
  box-shadow:
    0 18px 46px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(22px) saturate(1.35);
  -webkit-backdrop-filter: blur(22px) saturate(1.35);
  animation: menu-in 0.12s cubic-bezier(0.2, 1, 0.36, 1);
}

.mac-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-row {
  width: 100%;
  min-height: 26px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 20px;
  padding: 4px 10px;
  border: 0;
  border-radius: 6px;
  color: inherit;
  background: transparent;
  font: inherit;
  text-align: left;
  cursor: default;
}

.menu-row:not(.disabled):hover,
.menu-row:not(.disabled):focus-visible {
  outline: none;
  background: #0a84ff;
  color: #fff;
}

.menu-row.disabled {
  color: rgba(245, 245, 247, 0.38);
}

.menu-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-shortcut {
  color: rgba(245, 245, 247, 0.58);
  font-size: 12px;
  justify-self: end;
  white-space: nowrap;
}

.menu-row:hover .menu-shortcut,
.menu-row:focus-visible .menu-shortcut {
  color: rgba(255, 255, 255, 0.82);
}

.menu-divider {
  height: 1px;
  margin: 5px 8px;
  background: rgba(255, 255, 255, 0.16);
}

@keyframes menu-in {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
