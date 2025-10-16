<script setup lang="ts">
import { educations } from '@/data/content/educations'
</script>

<template>
  <div class="education-section">
    <div v-for="(edu, index) in educations" :key="index" class="education-item">
      <h3>{{ edu.name }}</h3>
      <p class="year">{{ edu.year }}</p>
      <p class="degree">{{ edu.degree }}</p>
      <p class="description">{{ edu.description }}</p>
    </div>
  </div>
</template>

<style scoped>
.education-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  color: white;
  margin-top: 1rem;
}

.education-item {
  background: #1a1a1a;
  border-radius: 10px;
  padding: 1rem 1.25rem;
  transition: background 0.3s ease;
}

.education-item:hover {
  background: #2a2a2a;
}

.education-item h3 {
  margin: 0 0 0.3rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
}

.education-item .year {
  font-size: 0.85rem;
  color: #b3b3b3;
  margin: 0.15rem 0;
}

.education-item .degree {
  font-size: 0.95rem;
  color: #d9d9d9;
  margin: 0.15rem 0;
}

.education-item .description {
  font-size: 0.9rem;
  color: #e6e6e6;
  margin: 0.15rem 0;
}
</style>
