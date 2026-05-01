<template>
  <article
    class="card group cursor-pointer flex flex-col overflow-hidden animate-fade-up"
    @click="router.push({ name: 'product', params: { id: product.id } })"
  >
    <!-- Image -->
    <div class="relative overflow-hidden bg-stone-100 dark:bg-stone-800 aspect-square">
      <img
        :src="product.thumbnail"
        :alt="product.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <!-- Discount badge -->
      <span
        v-if="product.discountPercentage >= 5"
        class="badge absolute top-2 left-2 bg-red-500 text-white"
      >
        -{{ Math.round(product.discountPercentage) }}%
      </span>
      <!-- Out of stock overlay -->
      <div
        v-if="product.stock === 0"
        class="absolute inset-0 bg-stone-900/50 flex items-center justify-center"
      >
        <span class="badge bg-stone-800 text-stone-100 text-sm">Out of Stock</span>
      </div>
    </div>

    <!-- Info -->
    <div class="flex flex-col flex-1 p-4 gap-2">
      <!-- Category -->
      <span class="text-xs text-fresh-600 dark:text-fresh-400 font-medium uppercase tracking-wide">
        {{ formatCategory(product.category) }}
      </span>

      <!-- Title -->
      <h3 class="font-display font-semibold text-stone-900 dark:text-stone-100 text-sm leading-snug line-clamp-2 group-hover:text-fresh-600 dark:group-hover:text-fresh-400 transition-colors">
        {{ product.title }}
      </h3>

      <!-- Rating -->
      <div class="flex items-center gap-1 text-xs">
        <span class="text-yellow-400">{{ starString }}</span>
        <span class="text-stone-500 dark:text-stone-400">{{ product.rating.toFixed(1) }}</span>
      </div>

      <!-- Spacer -->
      <div class="flex-1" />

      <!-- Price & Cart -->
      <div class="flex items-center justify-between mt-1">
        <div class="flex flex-col">
          <span class="font-bold text-lg text-stone-900 dark:text-stone-100">
            ${{ product.price.toFixed(2) }}
          </span>
          <span v-if="product.discountPercentage >= 5" class="text-xs text-stone-400 line-through">
            ${{ originalPrice }}
          </span>
        </div>

        <!-- Add to cart button -->
        <button
          @click.stop="handleAddToCart"
          :disabled="product.stock === 0"
          class="transition-all duration-200 active:scale-90"
          :class="inCart
            ? 'bg-fresh-100 dark:bg-fresh-900/30 text-fresh-700 dark:text-fresh-300 rounded-xl px-3 py-1.5 text-sm font-medium'
            : 'btn-primary text-sm py-1.5 px-3'"
          :aria-label="inCart ? 'Added to cart' : 'Add to cart'"
        >
          {{ inCart ? `✓ ${qty} in cart` : '+ Add' }}
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Product } from '@/types'
import { useCartStore } from '@/store/cart'

const props = defineProps<{ product: Product }>()

const router    = useRouter()
const cartStore = useCartStore()

const inCart = computed(() => cartStore.isInCart(props.product.id))
const qty    = computed(() => cartStore.getQuantity(props.product.id))

const originalPrice = computed(() => {
  const original = props.product.price / (1 - props.product.discountPercentage / 100)
  return original.toFixed(2)
})

const starString = computed(() => {
  const full  = Math.round(props.product.rating)
  const empty = 5 - full
  return '★'.repeat(full) + '☆'.repeat(empty)
})

function formatCategory(cat: string): string {
  return cat.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function handleAddToCart(): void {
  cartStore.addToCart(props.product)
}
</script>
