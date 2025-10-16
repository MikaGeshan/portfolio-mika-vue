<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'

// Data
import { content } from '@/data/content/content'
import { menu_sidebar } from '@/data/menu/menu.sidebar'

const active = ref('About Me')

const scrollToSection = async (name: string) => {
  await nextTick()
  const el = document.getElementById(name)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

watch(active, (newVal) => scrollToSection(newVal))

function select(itemName: string) {
  active.value = itemName
}
</script>

<template>
  <div class="system-settings">
    <aside class="mac-sidebar">
      <div class="sidebar-scroll">
        <div class="profile-container">
          <img src="@/assets/images/photoprofile.jpeg" alt="Profile photo" />
          <div class="profile-info">
            <h4>Mika Geshan</h4>
            <p>Front End Developer</p>
          </div>
        </div>

        <ul>
          <li
            v-for="item in menu_sidebar"
            :key="item.name"
            :class="{ active: active === item.name }"
            @click="select(item.name)"
          >
            <component v-if="typeof item.icon !== 'string'" :is="item.icon" class="icon" />
            <img v-else :src="item.icon" alt="" class="icon image-icon" />
            <span>{{ item.name }}</span>
          </li>
        </ul>
      </div>
    </aside>

    <div class="main-container">
      <section v-for="item in content" :key="item.title" :id="item.title" class="content-section">
        <h2>{{ item.title }}</h2>
        <p v-if="typeof item.description === 'string'">{{ item.description }}</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.system-settings {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
}

.mac-sidebar {
  width: 220px;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  background: transparent;
  border-right: 1px solid black;
  padding-top: 1rem;
  overflow: hidden;
}

.sidebar-scroll {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: gray transparent;
}

.sidebar-scroll::-webkit-scrollbar {
  width: 6px;
}
.sidebar-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.sidebar-scroll::-webkit-scrollbar-thumb {
  background: gray;
  border-radius: 4px;
}

.profile-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 1rem;
  margin-bottom: 1rem;
  border-radius: 12px;
  background: transparent;
  transition: background 0.3s ease;
  flex-shrink: 0;
}

.profile-container:hover {
  background: gray;
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
  gap: 0.25rem;
  overflow: hidden;
}

.profile-info h4 {
  font-weight: 600;
  color: white;
  margin: 0;
  font-size: 1rem;
}

.profile-info p {
  font-size: 0.75rem;
  color: white;
  margin: 0;
}

.mac-sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
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
  background: black;
}

.mac-sidebar li.active {
  background: black;
  color: #007aff;
  font-weight: 600;
}

.icon {
  width: 1.2rem;
  height: 1.2rem;
  color: white;
}

.main-container {
  flex: 1;
  overflow-y: auto;
}
</style>
