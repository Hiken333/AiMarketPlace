<template>
  <div class="help-view">
    <h1>Справка</h1>
    <p>Здесь будет справочная информация</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id?: string
}

defineProps<Props>()
</script> 