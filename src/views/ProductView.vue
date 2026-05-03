<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Back button -->
    <button @click="router.back()" class="btn-ghost mb-6 flex items-center gap-2 text-sm">
      ← Back
    </button>

    <LoadingSpinner v-if="loading" message="Loading product details..." />

    <div v-else-if="error" class="text-center py-20">
      <p class="text-5xl mb-4">😢</p>
      <p class="text-stone-500">{{ error }}</p>
      <button @click="router.push('/')" class="btn-primary mt-4">Back to Shop</button>
    </div>

    <template v-else-if="product">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fade-up">

        <!-- Image gallery -->
        <div class="space-y-3">
          <div class="aspect-square rounded-3xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <img
              :src="activeImage"
              :alt="product.title"
              class="w-full h-full object-cover transition-all duration-300"
            />
          </div>
          <!-- Thumbnails -->
          <div v-if="product.images.length > 1" class="flex gap-2 overflow-x-auto pb-1">
            <button
              v-for="(img, i) in product.images"
              :key="i"
              @click="activeImage = img"
              class="w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all"
              :class="activeImage === img ? 'border-fresh-500' : 'border-stone-200 dark:border-stone-700 hover:border-fresh-300'"
            >
              <img :src="img" :alt="`View ${i + 1}`" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Details -->
        <div class="flex flex-col gap-5 animate-fade-up stagger-2">
          <!-- Category & title -->
          <div>
            <span class="badge bg-fresh-100 dark:bg-fresh-900/30 text-fresh-700 dark:text-fresh-300 mb-2 inline-block">
              {{ formatCategory(product.category) }}
            </span>
            <h1 class="font-display font-bold text-3xl text-stone-900 dark:text-stone-100 leading-tight">
              {{ product.title }}
            </h1>
            <p v-if="product.brand" class="text-stone-400 text-sm mt-1">by {{ product.brand }}</p>
          </div>

          <!-- Rating -->
          <StarRating :rating="product.rating" />

          <!-- Price block -->
          <div class="flex items-end gap-3">
            <span class="font-bold text-4xl text-stone-900 dark:text-stone-100">${{ product.price.toFixed(2) }}</span>
            <div v-if="product.discountPercentage >= 5" class="flex items-center gap-2 mb-1">
              <span class="text-stone-400 line-through text-lg">${{ originalPrice }}</span>
              <span class="badge bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                -{{ Math.round(product.discountPercentage) }}% OFF
              </span>
            </div>
          </div>

          <!-- Description -->
          <p class="text-stone-600 dark:text-stone-300 leading-relaxed">{{ product.description }}</p>

          <!-- Stock info -->
          <div class="flex items-center gap-2">
            <span
              class="badge"
              :class="product.stock > 10
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : product.stock > 0
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'"
            >
              {{ product.stock > 10 ? '✓ In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock' }}
            </span>
            <span class="text-stone-400 text-xs">SKU: {{ product.sku }}</span>
          </div>

          <!-- Quantity + Add to Cart -->
          <div class="flex items-center gap-3">
            <QuantityControl :quantity="cartQty || 1" @update="handleQuantityChange" />
            <button
              @click="handleAddToCart"
              :disabled="product.stock === 0"
              class="btn-primary flex-1 py-3 text-base"
            >
              {{ inCart ? `✓ In Cart (${cartQty})` : '🛒 Add to Cart' }}
            </button>
          </div>

          <!-- Tags -->
          <div v-if="product.tags.length" class="flex flex-wrap gap-2">
            <span v-for="tag in product.tags" :key="tag" class="badge bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
              #{{ tag }}
            </span>
          </div>

          <!-- Meta details -->
          <div class="grid grid-cols-2 gap-3 text-sm border-t border-stone-100 dark:border-stone-800 pt-4">
            <div v-if="product.weight">
              <p class="text-stone-400 text-xs uppercase tracking-wide">Weight</p>
              <p class="font-medium text-stone-800 dark:text-stone-200">{{ product.weight }}g</p>
            </div>
            <div>
              <p class="text-stone-400 text-xs uppercase tracking-wide">Min. Order</p>
              <p class="font-medium text-stone-800 dark:text-stone-200">{{ product.minimumOrderQuantity }}</p>
            </div>
            <div v-if="product.shippingInformation">
              <p class="text-stone-400 text-xs uppercase tracking-wide">Shipping</p>
              <p class="font-medium text-stone-800 dark:text-stone-200">{{ product.shippingInformation }}</p>
            </div>
            <div v-if="product.returnPolicy">
              <p class="text-stone-400 text-xs uppercase tracking-wide">Returns</p>
              <p class="font-medium text-stone-800 dark:text-stone-200">{{ product.returnPolicy }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews section -->
      <div v-if="product.reviews?.length" class="mt-14">
        <h2 class="font-display font-bold text-2xl text-stone-900 dark:text-stone-100 mb-6">
          Customer Reviews
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="review in product.reviews"
            :key="review.reviewerEmail"
            class="card p-5 space-y-2 animate-fade-up"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-fresh-100 dark:bg-fresh-900/30 text-fresh-600 dark:text-fresh-400 flex items-center justify-center font-bold text-sm">
                  {{ review.reviewerName[0] }}
                </div>
                <span class="font-medium text-sm text-stone-800 dark:text-stone-200">{{ review.reviewerName }}</span>
              </div>
              <StarRating :rating="review.rating" />
            </div>
            <p class="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">{{ review.comment }}</p>
            <p class="text-stone-400 text-xs">{{ formatDate(review.date) }}</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Product } from '@/types'
import { useProducts } from '@/composables/useProducts'
import { useCartStore } from '@/store/cart'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import StarRating from '@/components/StarRating.vue'
import QuantityControl from '@/components/QuantityControl.vue'

const props = defineProps<{ id: number }>()

const router    = useRouter()
const cartStore = useCartStore()
const { fetchProductById } = useProducts()

const product     = ref<Product | null>(null)
const activeImage = ref<string>('')
const loading     = ref(true)
const error       = ref<string | null>(null)

const inCart   = computed(() => cartStore.isInCart(product.value?.id ?? -1))
const cartQty  = computed(() => cartStore.getQuantity(product.value?.id ?? -1))

const originalPrice = computed(() => {
  if (!product.value) return '0'
  const orig = product.value.price / (1 - product.value.discountPercentage / 100)
  return orig.toFixed(2)
})

function formatCategory(cat: string): string {
  return cat.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function handleAddToCart(): void {
  if (product.value) cartStore.addToCart(product.value)
}

function handleQuantityChange(qty: number): void {
  if (product.value && inCart.value) {
    cartStore.updateQuantity(product.value.id, qty)
  }
}

onMounted(async () => {
  loading.value = true
  const p = await fetchProductById(props.id)
  if (p) {
    product.value     = p
    activeImage.value = p.thumbnail
  } else {
    error.value = 'Product not found.'
  }
  loading.value = false
})
</script>
