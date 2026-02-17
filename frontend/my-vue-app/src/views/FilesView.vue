<template>
  <div class="files-view">
    <h1>Управление файлами</h1>
    <p>Здесь будет файловый менеджер для загрузки и управления файлами</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id?: string
}

defineProps<Props>()
</script> 