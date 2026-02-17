<template>
  <div class="ai-model-view">
    <h1>AI Модель</h1>
    <p>ID модели: {{ id }}</p>
    <p>Здесь будет детальная информация об AI модели</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string
}

defineProps<Props>()
</script> 