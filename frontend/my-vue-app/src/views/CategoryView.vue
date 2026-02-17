<template>
  <q-page class="bg-grey-1">
    <div class="q-pa-lg">
      <div class="text-h4 text-weight-bold q-mb-lg">Категория: {{ categoryId }}</div>
      <div class="text-center q-pa-xl">
        <q-icon name="category" size="4rem" color="grey-5" />
        <div class="text-h6 q-mt-md text-grey-6">Страница категории в разработке</div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
interface Props {
  categoryId: string
}
defineProps<Props>()
</script> 