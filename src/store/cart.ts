import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem, Product } from '@/types'

const STORAGE_KEY = 'volthub-cart'

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(loadCart())

  // ── Computed ───────────────────────────────────────────────────────────────
  const totalItems = computed(() =>
    items.value.reduce((acc, item) => acc + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  )

  const isEmpty = computed(() => items.value.length === 0)

  // ── Actions ────────────────────────────────────────────────────────────────
  function addToCart(product: Product): void {
    const existing = items.value.find(i => i.product.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ product, quantity: 1 })
    }
    saveCart(items.value)
  }

  function removeFromCart(productId: number): void {
    items.value = items.value.filter(i => i.product.id !== productId)
    saveCart(items.value)
  }

  function updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    const item = items.value.find(i => i.product.id === productId)
    if (item) {
      item.quantity = quantity
      saveCart(items.value)
    }
  }

  function clearCart(): void {
    items.value = []
    saveCart([])
  }

  function isInCart(productId: number): boolean {
    return items.value.some(i => i.product.id === productId)
  }

  function getQuantity(productId: number): number {
    return items.value.find(i => i.product.id === productId)?.quantity ?? 0
  }

  return {
    items,
    totalItems,
    totalPrice,
    isEmpty,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getQuantity,
  }
})
