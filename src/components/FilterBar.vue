<template>
  <div class="w-full space-y-3">
    <!-- Search -->
    <div class="relative">
      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">🔍</span>
      <input
        :value="modelValue.search"
        @input="emit('update:modelValue', { ...modelValue, search: ($event.target as HTMLInputElement).value })"
        type="search"
        placeholder="Search electronics & gadgets..."
        class="input pl-9 pr-4"
      />
    </div>

    <div class="flex flex-wrap gap-2 items-center">
      <!-- Category filter -->
      <select
        :value="modelValue.category"
        @change="emit('update:modelValue', { ...modelValue, category: ($event.target as HTMLSelectElement).value })"
        class="input w-auto flex-1 min-w-[140px] cursor-pointer"
      >
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">
          {{ formatCategory(cat) }}
        </option>
      </select>

      <!-- Sort -->
      <select
        :value="modelValue.sortBy"
        @change="emit('update:modelValue', { ...modelValue, sortBy: ($event.target as HTMLSelectElement).value as SortOption })"
        class="input w-auto flex-1 min-w-[140px] cursor-pointer"
      >
        <option value="default">Sort: Default</option>
        <option value="price-asc">Price: Low → High</option>
        <option value="price-desc">Price: High → Low</option>
        <option value="rating-desc">Highest Rated</option>
        <option value="name-asc">Name: A → Z</option>
      </select>

      <!-- Clear filters -->
      <button
        v-if="hasActiveFilters"
        @click="clearFilters"
        class="btn-ghost text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 whitespace-nowrap"
      >
        ✕ Clear
      </button>
    </div>

    <!-- Active filter pills -->
    <div v-if="hasActiveFilters" class="flex flex-wrap gap-2">
      <span v-if="modelValue.search" class="badge bg-fresh-100 dark:bg-fresh-900/30 text-fresh-700 dark:text-fresh-300 flex items-center gap-1">
        "{{ modelValue.search }}"
        <button @click="emit('update:modelValue', { ...modelValue, search: '' })" class="hover:text-red-500">✕</button>
      </span>
      <span v-if="modelValue.category" class="badge bg-earth-100 dark:bg-earth-500/20 text-earth-600 dark:text-earth-400 flex items-center gap-1">
        {{ formatCategory(modelValue.category) }}
        <button @click="emit('update:modelValue', { ...modelValue, category: '' })" class="hover:text-red-500">✕</button>
      </span>
      <span v-if="modelValue.sortBy !== 'default'" class="badge bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center gap-1">
        {{ sortLabels[modelValue.sortBy] }}
        <button @click="emit('update:modelValue', { ...modelValue, sortBy: 'default' })" class="hover:text-red-500">✕</button>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FilterState, SortOption } from '@/types'

const props = defineProps<{
  modelValue: FilterState
  categories: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: FilterState]
}>()

const sortLabels: Record<SortOption, string> = {
  'default':    'Default',
  'price-asc':  'Price ↑',
  'price-desc': 'Price ↓',
  'rating-desc':'Top Rated',
  'name-asc':   'A → Z',
}

const hasActiveFilters = computed(() =>
  props.modelValue.search !== '' ||
  props.modelValue.category !== '' ||
  props.modelValue.sortBy !== 'default'
)

function formatCategory(cat: string): string {
  return cat.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function clearFilters(): void {
  emit('update:modelValue', {
    search:   '',
    category: '',
    sortBy:   'default',
    minPrice: 0,
    maxPrice: 9999,
  })
}
</script>
