<template>
  <div class="product-reviews-view">
    <h1>Отзывы о товаре</h1>
    <p>ID товара: {{ id }}</p>
    <p>Здесь будут отзывы о конкретном товаре</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string
}

defineProps<Props>()
</script> 