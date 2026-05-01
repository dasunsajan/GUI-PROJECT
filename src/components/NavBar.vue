<template>
  <header
    class="sticky top-0 z-40 w-full border-b border-stone-200/80 dark:border-stone-800/80
           bg-white/90 dark:bg-stone-950/90 backdrop-blur-md transition-colors duration-300"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">

        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2 shrink-0">
          <span class="text-2xl">⚡</span>
          <span class="font-display font-bold text-xl tracking-tight text-fresh-600 dark:text-fresh-400">
            VoltHub
          </span>
        </RouterLink>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-1">
          <RouterLink to="/" class="btn-ghost text-sm" active-class="text-fresh-600 dark:text-fresh-400 bg-fresh-50 dark:bg-fresh-900/20">
            Shop
          </RouterLink>
          <RouterLink to="/cart" class="btn-ghost text-sm" active-class="text-fresh-600 dark:text-fresh-400 bg-fresh-50 dark:bg-fresh-900/20">
            Cart
          </RouterLink>
        </nav>

        <!-- Right actions -->
        <div class="flex items-center gap-2">
          <!-- Dark mode -->
          <button
            @click="toggleTheme"
            class="btn-ghost p-2 rounded-full text-lg"
            :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            {{ theme === 'dark' ? '☀️' : '🌙' }}
          </button>

          <!-- Cart -->
          <RouterLink to="/cart" class="relative btn-ghost p-2 rounded-full text-lg">
            🛒
            <span
              v-if="cartStore.totalItems > 0"
              class="absolute -top-0.5 -right-0.5 bg-fresh-600 text-white text-xs w-5 h-5
                     rounded-full flex items-center justify-center font-bold animate-bounce-sm"
            >
              {{ cartStore.totalItems > 9 ? '9+' : cartStore.totalItems }}
            </span>
          </RouterLink>

          <!-- Auth -->
          <template v-if="authStore.isLoggedIn">
            <div class="flex items-center gap-2">
              <img
                :src="authStore.user?.image"
                :alt="authStore.displayName"
                class="w-8 h-8 rounded-full object-cover border-2 border-fresh-400"
              />
              <button @click="authStore.logout()" class="btn-ghost text-sm hidden sm:block text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                Logout
              </button>
            </div>
          </template>
          <template v-else>
            <RouterLink to="/login" class="btn-primary text-sm py-1.5 px-4 hidden sm:block">
              Sign In
            </RouterLink>
          </template>

          <!-- Mobile menu toggle -->
          <button @click="mobileOpen = !mobileOpen" class="btn-ghost md:hidden p-2 rounded-full">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition name="slide-down">
      <div v-if="mobileOpen" class="md:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 px-4 py-3 flex flex-col gap-1">
        <RouterLink to="/" class="btn-ghost text-sm" @click="mobileOpen = false">🏠 Shop</RouterLink>
        <RouterLink to="/cart" class="btn-ghost text-sm" @click="mobileOpen = false">🛒 Cart ({{ cartStore.totalItems }})</RouterLink>
        <RouterLink v-if="!authStore.isLoggedIn" to="/login" class="btn-ghost text-sm" @click="mobileOpen = false">🔐 Sign In</RouterLink>
        <button v-else @click="() => { authStore.logout(); mobileOpen = false }" class="btn-ghost text-sm text-left text-red-500">
          🚪 Logout
        </button>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'

const { theme, toggleTheme } = useTheme()
const cartStore  = useCartStore()
const authStore  = useAuthStore()
const mobileOpen = ref(false)
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
