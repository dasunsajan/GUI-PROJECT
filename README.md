# ⚡ VoltHub — Modern Electronics SPA

A production-grade Single Page Application built with **Vue 3**, **TypeScript**, **Vite**, and **Tailwind CSS**, consuming the [DummyJSON API](https://dummyjson.com).

---

## 🚀 Getting Started

### Prerequisites
- Node.js **v18+**
- npm **v9+**

### Installation & Running

```bash
# 1. Extract the ZIP and navigate into the project folder
cd volthub

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# Open in browser → http://localhost:5173
```

### Production Build

```bash
npm run build     # Compiles & type-checks
npm run preview   # Preview the production build locally
```

---

## Features Implemented

### Core (Mandatory)
- **Tech Stack**: Vue 3 Composition API, TypeScript, Vite, Tailwind CSS
- **No any types**: All API responses use strict interfaces in src/types/index.ts
- **Component Architecture**: 10+ components including NavBar, ProductCard, FilterBar, CartItemRow, QuantityControl, HeroBanner, StarRating, LoadingSpinner
- **Responsive Layout**: Mobile-first grid/flex, fully responsive across all breakpoints
- **Data Fetching**: Fetches products from /products?limit=100 and categories from /products/category-list
- **Search & Filtering**: Real-time text search + category filter + sort (price, rating, name)
- **Detail View**: Full product page at /product/:id with image gallery, reviews, stock info

### Bonus (A/A+ Level)
- **Authentication**: JWT login via /auth/login, token stored in localStorage
- **Shopping Cart**: Pinia store with localStorage persistence, quantity controls, order total
- **Dynamic Routing**: Vue Router with /product/:id, /cart, /login, 404 handler, page transitions
- **Dark Mode**: Full dark mode with Tailwind dark: modifier, persisted preference

---

## Component Hierarchy

App.vue
  NavBar.vue           - Sticky header, dark mode, cart badge, auth state
  HomeView.vue         - Product listing, pagination, filter, grid/list toggle
    HeroBanner.vue
    FilterBar.vue
    ProductCard.vue (xN)
    ProductListRow.vue (xN, list mode)
  ProductView.vue      - Detail page, image gallery, reviews
    StarRating.vue
    QuantityControl.vue
  CartView.vue         - Cart summary, order total, checkout simulation
    CartItemRow.vue
      QuantityControl.vue
  LoginView.vue        - JWT auth form
  NotFoundView.vue

---

## Demo Login

Username: emilys
Password: emilyspass
