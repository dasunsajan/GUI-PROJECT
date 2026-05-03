<template>
  <div class="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
    <NavBar />
    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="$route.fullPath" />
        </Transition>
      </RouterView>
    </main>
    <footer class="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <span>⚡</span>
          <span class="font-display font-bold text-fresh-600 dark:text-fresh-400">VoltHub</span>
        </div>
        <p class="text-stone-400 text-sm">Built with Vue 3, TypeScript &amp; Tailwind CSS · Powered by DummyJSON</p>
        <p class="text-stone-400 text-sm">© {{ new Date().getFullYear() }} VoltHub</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.2s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
