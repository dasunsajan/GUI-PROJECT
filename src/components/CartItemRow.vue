<template>
  <div class="flex items-center gap-4 py-4 border-b border-stone-100 dark:border-stone-800 last:border-0 animate-fade-in">
    <!-- Thumbnail -->
    <RouterLink :to="{ name: 'product', params: { id: item.product.id } }">
      <img
        :src="item.product.thumbnail"
        :alt="item.product.title"
        class="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-stone-100 dark:border-stone-800 hover:opacity-80 transition-opacity"
      />
    </RouterLink>

    <!-- Info -->
    <div class="flex-1 min-w-0">
      <RouterLink :to="{ name: 'product', params: { id: item.product.id } }">
        <h3 class="font-medium text-stone-900 dark:text-stone-100 text-sm sm:text-base truncate hover:text-fresh-600 transition-colors">
          {{ item.product.title }}
        </h3>
      </RouterLink>
      <p class="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
        ${{ item.product.price.toFixed(2) }} each
      </p>

      <!-- Quantity controls (mobile) -->
      <div class="flex items-center gap-2 mt-2 sm:hidden">
        <QuantityControl :quantity="item.quantity" @update="cartStore.updateQuantity(item.product.id, $event)" />
      </div>
    </div>

    <!-- Quantity controls (desktop) -->
    <div class="hidden sm:flex items-center">
      <QuantityControl :quantity="item.quantity" @update="cartStore.updateQuantity(item.product.id, $event)" />
    </div>

    <!-- Subtotal -->
    <div class="text-right shrink-0">
      <p class="font-bold text-stone-900 dark:text-stone-100">
        ${{ (item.product.price * item.quantity).toFixed(2) }}
      </p>
      <button
        @click="cartStore.removeFromCart(item.product.id)"
        class="text-xs text-red-400 hover:text-red-600 transition-colors mt-1"
      >
        Remove
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { CartItem } from '@/types'
import { useCartStore } from '@/store/cart'
import QuantityControl from './QuantityControl.vue'

defineProps<{ item: CartItem }>()
const cartStore = useCartStore()
</script>
