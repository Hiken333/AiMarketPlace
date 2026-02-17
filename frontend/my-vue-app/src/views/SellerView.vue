<template>
  <div class="seller-view">
    <h1>Страница продавца</h1>
    <p>ID продавца: {{ id }}</p>
    <p>Здесь будет информация о продавце и его товары</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string
}

defineProps<Props>()
</script> 