<template>
  <div class="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 rounded-xl p-0.5">
    <button
      @click="emit('update', quantity - 1)"
      class="w-7 h-7 flex items-center justify-center rounded-lg text-stone-600 dark:text-stone-300
             hover:bg-white dark:hover:bg-stone-700 transition-all active:scale-90 font-bold text-lg leading-none"
      aria-label="Decrease quantity"
    >−</button>
    <span class="w-8 text-center text-sm font-semibold text-stone-900 dark:text-stone-100">
      {{ quantity }}
    </span>
    <button
      @click="emit('update', quantity + 1)"
      class="w-7 h-7 flex items-center justify-center rounded-lg text-stone-600 dark:text-stone-300
             hover:bg-white dark:hover:bg-stone-700 transition-all active:scale-90 font-bold text-lg leading-none"
      aria-label="Increase quantity"
    >+</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ quantity: number }>()
const emit = defineEmits<{ update: [value: number] }>()
</script>
