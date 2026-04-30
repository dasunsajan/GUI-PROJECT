import { ref, computed } from 'vue'
import type { Product, ProductsResponse, CategoryList, ApiError } from '@/types'

const BASE_URL = 'https://dummyjson.com'

// ─── Shared cache so multiple components share the same fetch ──────────────────
const _allProducts    = ref<Product[]>([])
const _categories     = ref<string[]>([])
const _loadingProducts = ref(false)
const _loadingCats     = ref(false)
const _error           = ref<ApiError | null>(null)
const _fetched         = ref(false)

export function useProducts() {
  // ── Fetch all products (max 100) ───────────────────────────────────────────
  async function fetchAllProducts(): Promise<void> {
    if (_fetched.value) return
    _loadingProducts.value = true
    _error.value = null
    try {
      const res = await fetch(`${BASE_URL}/products?limit=100&skip=0`)
      if (!res.ok) throw { message: 'Failed to fetch products', status: res.status } as ApiError
      const data: ProductsResponse = await res.json()
      _allProducts.value = data.products
      _fetched.value = true
    } catch (e) {
      _error.value = e as ApiError
    } finally {
      _loadingProducts.value = false
    }
  }

  // ── Fetch categories list ──────────────────────────────────────────────────
  async function fetchCategories(): Promise<void> {
    if (_categories.value.length) return
    _loadingCats.value = true
    try {
      const res = await fetch(`${BASE_URL}/products/category-list`)
      if (!res.ok) throw { message: 'Failed to fetch categories', status: res.status } as ApiError
      const data: CategoryList = await res.json()
      _categories.value = data
    } catch (e) {
      _error.value = e as ApiError
    } finally {
      _loadingCats.value = false
    }
  }

  // ── Fetch single product by id ─────────────────────────────────────────────
  async function fetchProductById(id: number): Promise<Product | null> {
    // Check cache first
    const cached = _allProducts.value.find(p => p.id === id)
    if (cached) return cached
    try {
      const res = await fetch(`${BASE_URL}/products/${id}`)
      if (!res.ok) throw { message: 'Product not found', status: res.status } as ApiError
      return (await res.json()) as Product
    } catch (e) {
      _error.value = e as ApiError
      return null
    }
  }

  const electronicsCategories = computed(() =>
    _categories.value.filter(c =>
      ['smartphones', 'laptops', 'tablets', 'mobile-accessories', 'smart-watches',
       'sports-accessories', 'sunglasses', 'automotive', 'motorcycle', 'lighting',
       'furniture', 'home-decoration', 'kitchen-accessories', 'beauty', 'fragrances',
       'skin-care', 'tops', 'womens-bags', 'mens-shirts', 'mens-shoes',
       'womens-shoes', 'womens-dresses', 'womens-jewellery'].includes(c)
    )
  )

  return {
    allProducts:           _allProducts,
    categories:            _categories,
    electronicsCategories,
    loading:               _loadingProducts,
    loadingCats:           _loadingCats,
    error:                 _error,
    fetchAllProducts,
    fetchCategories,
    fetchProductById,
  }
}
