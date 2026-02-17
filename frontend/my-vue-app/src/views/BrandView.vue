<template>
  <div class="brand-view">
    <h1>Страница бренда</h1>
    <p>Слаг бренда: {{ slug }}</p>
    <p>Здесь будут товары бренда</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  slug: string
}

defineProps<Props>()
</script> 