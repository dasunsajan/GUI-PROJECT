<template>
  <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-fresh-700 via-fresh-600 to-earth-600 dark:from-stone-900 dark:via-fresh-900 dark:to-earth-600/40 text-white">
    <!-- Decorative circles -->
    <div class="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
    <div class="absolute -bottom-8 -left-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
    <div class="absolute top-6 right-1/3 w-24 h-24 bg-earth-400/30 rounded-full blur-xl pointer-events-none" />

    <div class="relative z-10 px-8 py-12 md:py-16 md:px-14 flex flex-col md:flex-row md:items-center gap-8">
      <div class="flex-1 animate-fade-up">
        <p class="text-fresh-200 text-sm font-medium uppercase tracking-widest mb-2">Welcome to</p>
        <h1 class="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-4">
          VoltHub<br />
          <span class="text-earth-400">Electronics</span>
        </h1>
        <p class="text-fresh-100 text-lg max-w-md leading-relaxed mb-6">
          Cutting-edge gadgets, smart devices, and tech accessories — all in one place.
        </p>
        <div class="flex flex-wrap gap-3">
          <button
            @click="scrollToProducts"
            class="bg-white text-fresh-700 hover:bg-fresh-50 font-semibold px-6 py-3 rounded-xl transition-all duration-200 active:scale-95 shadow-lg"
          >
            Shop Now →
          </button>
          <RouterLink
            v-if="!authStore.isLoggedIn"
            to="/login"
            class="border-2 border-white/60 hover:border-white hover:bg-white/10 font-medium px-6 py-3 rounded-xl transition-all duration-200"
          >
            Sign In
          </RouterLink>
          <span v-else class="border-2 border-white/60 px-5 py-3 rounded-xl text-sm opacity-90">
            👋 Hello, {{ authStore.user?.firstName }}!
          </span>
        </div>
      </div>

      <!-- Tech emoji grid -->
      <div class="hidden md:grid grid-cols-3 gap-4 text-5xl animate-fade-up stagger-3">
        <span class="text-center hover:scale-110 transition-transform cursor-default select-none" title="Smartphones">📱</span>
        <span class="text-center hover:scale-110 transition-transform cursor-default select-none" title="Laptops">💻</span>
        <span class="text-center hover:scale-110 transition-transform cursor-default select-none" title="Audio">🎧</span>
        <span class="text-center hover:scale-110 transition-transform cursor-default select-none" title="Cameras">📷</span>
        <span class="text-center hover:scale-110 transition-transform cursor-default select-none" title="Gaming">🎮</span>
        <span class="text-center hover:scale-110 transition-transform cursor-default select-none" title="Smart Home">🔌</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()

function scrollToProducts(): void {
  document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })
}
</script>
