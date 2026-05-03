<template>
  <div class="min-h-[70vh] flex items-center justify-center text-center px-4">
    <div class="animate-fade-up">
      <p class="text-8xl mb-6">🔌</p>
      <h1 class="font-display font-bold text-5xl text-stone-900 dark:text-stone-100 mb-3">404</h1>
      <p class="text-stone-500 dark:text-stone-400 text-lg mb-8">
        Oops! This page seems to have short-circuited.
      </p>
      <RouterLink to="/" class="btn-primary text-base px-8 py-3">
        Back to Shop
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
