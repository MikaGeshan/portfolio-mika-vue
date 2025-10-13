<script setup lang="ts">
import { defineProps, defineEmits, type Component } from 'vue'

interface SidebarItem {
  sidebarName: string
  sidebarIcon: string | Component
}

defineProps<{
  items: SidebarItem[]
  active: string
}>()

const emit = defineEmits<{
  (e: 'update:active', value: string): void
}>()

function select(itemName: string) {
  emit('update:active', itemName)
}
</script>

<template>
  <aside class="mac-sidebar">
    <div class="profile-container">
      <img src="@/assets/images/photoprofile.jpeg" alt="Profile photo" />
      <div class="profile-info">
        <h4>Mika Geshan</h4>
        <p>Front End Developer</p>
      </div>
    </div>
    <ul>
      <li
        v-for="item in items"
        :key="item.sidebarName"
        :class="{ active: active === item.sidebarName }"
        @click="select(item.sidebarName)"
      >
        <component
          v-if="typeof item.sidebarIcon !== 'string'"
          :is="item.sidebarIcon"
          class="icon"
        />
        <img v-else :src="item.sidebarIcon" alt="" class="icon image-icon" />
        <span>{{ item.sidebarName }}</span>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.mac-sidebar {
  width: 200px;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  background: transparent;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 0;
  overflow: hidden;
}

.mac-sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  overflow: hidden;
}

.mac-sidebar li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  margin: 0.25rem 0;
  border-radius: 8px;
  cursor: pointer;
  color: white;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.mac-sidebar li:hover {
  background: rgba(255, 255, 255, 0.05);
}

.mac-sidebar li.active {
  background: rgba(0, 120, 255, 0.1);
  color: #007aff;
  font-weight: 600;
}

.profile-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 150%;
  max-width: auto;
  height: auto;
  margin: 1rem auto;
  border-radius: 12px;
  background: transparent;
  transition: background 0.3s ease;
}

.profile-container:hover {
  background: rgba(255, 255, 255, 0.05);
}

.profile-container img {
  flex-shrink: 0;
  width: 55px;
  height: 55px;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  object-fit: cover;
  border: none;
  box-shadow: none;
  transition: transform 0.3s ease;
}

.profile-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  flex-wrap: nowrap;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-info h4 {
  font-weight: 600;
  color: white;
  margin: 0;
  font-size: 1rem;
}

.profile-info p {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.icon {
  width: 1.2rem;
  height: 1.2rem;
  color: white;
}
</style>
