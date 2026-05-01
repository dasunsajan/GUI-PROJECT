<template>
  <div class="flex flex-col items-center justify-center gap-3 py-16">
    <div class="w-10 h-10 border-4 border-fresh-200 dark:border-fresh-900 border-t-fresh-500 rounded-full animate-spin" />
    <p class="text-stone-500 dark:text-stone-400 text-sm font-medium">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ message?: string }>()
</script>
