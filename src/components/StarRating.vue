<template>
  <div class="flex items-center gap-1">
    <span
      v-for="i in 5"
      :key="i"
      class="text-lg leading-none"
      :class="i <= Math.round(rating) ? 'text-yellow-400' : 'text-stone-300 dark:text-stone-600'"
    >★</span>
    <span class="text-sm text-stone-500 dark:text-stone-400 ml-1">{{ rating.toFixed(1) }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ rating: number }>()
</script>
