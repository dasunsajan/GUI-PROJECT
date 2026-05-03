<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="font-display font-bold text-3xl text-stone-900 dark:text-stone-100 mb-2">
      Your Cart 🛒
    </h1>
    <p class="text-stone-500 dark:text-stone-400 text-sm mb-8">
      {{ cartStore.totalItems }} item{{ cartStore.totalItems !== 1 ? 's' : '' }}
    </p>

    <!-- Empty cart -->
    <div v-if="cartStore.isEmpty" class="text-center py-24 animate-fade-up">
      <p class="text-7xl mb-5">🛒</p>
      <h2 class="font-display font-semibold text-xl text-stone-700 dark:text-stone-200 mb-2">
        Your cart is empty
      </h2>
      <p class="text-stone-400 text-sm mb-6">Add some tech items to get started!</p>
      <RouterLink to="/" class="btn-primary">Browse Products</RouterLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-up">
      <!-- Items list -->
      <div class="lg:col-span-2">
        <div class="card p-4 sm:p-6">
          <div class="flex items-center justify-between mb-2">
            <h2 class="font-semibold text-stone-900 dark:text-stone-100">Items</h2>
            <button @click="cartStore.clearCart()" class="text-sm text-red-400 hover:text-red-600 transition-colors">
              Clear all
            </button>
          </div>
          <CartItemRow v-for="item in cartStore.items" :key="item.product.id" :item="item" />
        </div>
      </div>

      <!-- Order summary -->
      <div class="lg:col-span-1">
        <div class="card p-6 space-y-4 sticky top-24">
          <h2 class="font-display font-semibold text-xl text-stone-900 dark:text-stone-100">Order Summary</h2>

          <div class="space-y-2 text-sm">
            <div class="flex justify-between text-stone-600 dark:text-stone-300">
              <span>Subtotal ({{ cartStore.totalItems }} items)</span>
              <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-stone-600 dark:text-stone-300">
              <span>Delivery</span>
              <span class="text-fresh-600 dark:text-fresh-400 font-medium">FREE</span>
            </div>
            <div class="border-t border-stone-100 dark:border-stone-800 pt-3 flex justify-between font-bold text-lg text-stone-900 dark:text-stone-100">
              <span>Total</span>
              <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Checkout (simulation) -->
          <button
            @click="handleCheckout"
            class="btn-primary w-full py-3 text-base"
          >
            {{ authStore.isLoggedIn ? 'Checkout →' : 'Sign In to Checkout' }}
          </button>

          <RouterLink to="/" class="btn-secondary w-full py-2.5 text-center text-sm block">
            ← Continue Shopping
          </RouterLink>

          <!-- Checkout confirmation toast -->
          <Transition name="fade">
            <div v-if="showToast" class="bg-fresh-50 dark:bg-fresh-900/20 border border-fresh-200 dark:border-fresh-800 rounded-xl p-3 text-center animate-fade-up">
              <p class="text-fresh-700 dark:text-fresh-300 text-sm font-medium">🎉 Order placed successfully!</p>
              <p class="text-fresh-500 text-xs mt-0.5">Thank you for shopping with VoltHub.</p>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import CartItemRow from '@/components/CartItemRow.vue'

const cartStore  = useCartStore()
const authStore  = useAuthStore()
const router     = useRouter()
const showToast  = ref(false)

function handleCheckout(): void {
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
    cartStore.clearCart()
  }, 3000)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
