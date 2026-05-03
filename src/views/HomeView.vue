<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

    <!-- Hero -->
    <HeroBanner />

    <!-- Products section -->
    <section id="products-section">
      <!-- Header row -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 class="font-display font-bold text-2xl text-stone-900 dark:text-stone-100">
            Electronics & Gadgets
          </h2>
          <p class="text-stone-500 dark:text-stone-400 text-sm mt-0.5">
            {{ filteredProducts.length }} item{{ filteredProducts.length !== 1 ? 's' : '' }} available
          </p>
        </div>
        <!-- Grid / List toggle -->
        <div class="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
          <button
            @click="viewMode = 'grid'"
            class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            :class="viewMode === 'grid' ? 'bg-white dark:bg-stone-700 shadow-sm text-stone-900 dark:text-stone-100' : 'text-stone-500 dark:text-stone-400'"
          >⊞ Grid</button>
          <button
            @click="viewMode = 'list'"
            class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            :class="viewMode === 'list' ? 'bg-white dark:bg-stone-700 shadow-sm text-stone-900 dark:text-stone-100' : 'text-stone-500 dark:text-stone-400'"
          >☰ List</button>
        </div>
      </div>

      <!-- Filters -->
      <div class="mb-6">
        <FilterBar v-model="filters" :categories="categories" />
      </div>

      <!-- Loading state -->
      <LoadingSpinner v-if="loading" message="Loading products..." />

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-16">
        <p class="text-5xl mb-4">😢</p>
        <p class="text-stone-500 dark:text-stone-400">{{ error.message }}</p>
        <button @click="fetchAllProducts" class="btn-primary mt-4">Retry</button>
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredProducts.length === 0" class="text-center py-16">
        <p class="text-5xl mb-4">🔍</p>
        <p class="text-stone-600 dark:text-stone-300 font-medium">No products found</p>
        <p class="text-stone-400 text-sm mt-1">Try adjusting your search or filters</p>
      </div>

      <!-- Product Grid -->
      <div
        v-else
        :class="viewMode === 'grid'
          ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
          : 'flex flex-col gap-3'"
      >
        <template v-if="viewMode === 'grid'">
          <ProductCard
            v-for="(product, i) in paginatedProducts"
            :key="product.id"
            :product="product"
            :class="`stagger-${Math.min(i % 6 + 1, 6)}`"
          />
        </template>
        <template v-else>
          <ProductListRow
            v-for="product in paginatedProducts"
            :key="product.id"
            :product="product"
          />
        </template>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-10">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="btn-secondary py-2 px-4 disabled:opacity-40"
        >← Prev</button>

        <div class="flex items-center gap-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="currentPage = page"
            class="w-9 h-9 rounded-lg text-sm font-medium transition-all"
            :class="page === currentPage
              ? 'bg-fresh-600 text-white shadow-sm'
              : 'btn-secondary py-0 px-0'"
          >{{ page }}</button>
        </div>

        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="btn-secondary py-2 px-4 disabled:opacity-40"
        >Next →</button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { FilterState, Product } from '@/types'
import { useProducts } from '@/composables/useProducts'
import HeroBanner from '@/components/HeroBanner.vue'
import FilterBar from '@/components/FilterBar.vue'
import ProductCard from '@/components/ProductCard.vue'
import ProductListRow from '@/components/ProductListRow.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const { allProducts, categories, loading, error, fetchAllProducts, fetchCategories } = useProducts()

const PAGE_SIZE = 20
const currentPage = ref(1)
const viewMode    = ref<'grid' | 'list'>('grid')

const filters = ref<FilterState>({
  search:   '',
  category: '',
  sortBy:   'default',
  minPrice: 0,
  maxPrice: 9999,
})

// Reset pagination on filter change
watch(filters, () => { currentPage.value = 1 }, { deep: true })

// ── Filtered + sorted product list ────────────────────────────────────────────
const filteredProducts = computed<Product[]>(() => {
  let list = [...allProducts.value]

  if (filters.value.search) {
    const q = filters.value.search.toLowerCase()
    list = list.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    )
  }

  if (filters.value.category) {
    list = list.filter(p => p.category === filters.value.category)
  }

  switch (filters.value.sortBy) {
    case 'price-asc':   list.sort((a, b) => a.price - b.price);        break
    case 'price-desc':  list.sort((a, b) => b.price - a.price);        break
    case 'rating-desc': list.sort((a, b) => b.rating - a.rating);      break
    case 'name-asc':    list.sort((a, b) => a.title.localeCompare(b.title)); break
  }

  return list
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / PAGE_SIZE))

const paginatedProducts = computed<Product[]>(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredProducts.value.slice(start, start + PAGE_SIZE)
})

const visiblePages = computed<number[]>(() => {
  const range: number[] = []
  const delta = 2
  for (let i = Math.max(1, currentPage.value - delta); i <= Math.min(totalPages.value, currentPage.value + delta); i++) {
    range.push(i)
  }
  return range
})

onMounted(async () => {
  await Promise.all([fetchAllProducts(), fetchCategories()])
})
</script>
