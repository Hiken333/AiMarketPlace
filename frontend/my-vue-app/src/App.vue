<script setup lang="ts">
import { RouterView } from 'vue-router'
import MainLayout from './layouts/MainLayout.vue'
</script>

<template>
  <div id="q-app">
    <MainLayout>
      <RouterView />
    </MainLayout>
  </div>
</template>

<style scoped>
#q-app {
  height: 100vh;
}
</style>
