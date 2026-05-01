<template>
  <div
    class="card flex items-center gap-4 p-4 cursor-pointer group animate-fade-in"
    @click="router.push({ name: 'product', params: { id: product.id } })"
  >
    <img
      :src="product.thumbnail"
      :alt="product.title"
      class="w-16 h-16 object-cover rounded-xl shrink-0 group-hover:opacity-80 transition-opacity"
    />
    <div class="flex-1 min-w-0">
      <p class="text-xs text-fresh-600 dark:text-fresh-400 font-medium uppercase tracking-wide">
        {{ product.category.replace(/-/g, ' ') }}
      </p>
      <h3 class="font-medium text-stone-900 dark:text-stone-100 truncate group-hover:text-fresh-600 transition-colors">
        {{ product.title }}
      </h3>
      <p class="text-xs text-stone-400 truncate mt-0.5 hidden sm:block">{{ product.description }}</p>
    </div>
    <div class="text-right shrink-0 flex flex-col items-end gap-2">
      <span class="font-bold text-stone-900 dark:text-stone-100">${{ product.price.toFixed(2) }}</span>
      <button
        @click.stop="cartStore.addToCart(product)"
        class="btn-primary text-xs py-1 px-3"
        :disabled="product.stock === 0"
      >
        {{ cartStore.isInCart(product.id) ? '✓ Added' : '+ Add' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Product } from '@/types'
import { useCartStore } from '@/store/cart'

defineProps<{ product: Product }>()
const router    = useRouter()
const cartStore = useCartStore()
</script>
