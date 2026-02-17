<template>
  <div class="not-found-view text-center q-pa-xl">
    <q-icon name="error_outline" size="120px" color="grey-5" />
    <h1 class="text-h3 q-mt-lg">404</h1>
    <p class="text-h6 text-grey-7">Страница не найдена</p>
    <q-btn 
      color="primary" 
      label="На главную" 
      @click="$router.push('/')"
      class="q-mt-lg"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  id?: string
}

defineProps<Props>()
</script> 