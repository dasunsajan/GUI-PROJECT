<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md animate-slide-in">

      <!-- Card -->
      <div class="card p-8 sm:p-10 space-y-6">
        <!-- Header -->
        <div class="text-center">
          <span class="text-4xl">⚡</span>
          <h1 class="font-display font-bold text-2xl text-stone-900 dark:text-stone-100 mt-2">
            Welcome back
          </h1>
          <p class="text-stone-400 text-sm mt-1">Sign in to your VoltHub account</p>
        </div>

        <!-- Demo hint -->
        <div class="bg-fresh-50 dark:bg-fresh-900/20 border border-fresh-200 dark:border-fresh-800 rounded-xl p-3 text-xs text-fresh-700 dark:text-fresh-300">
          <strong>Demo credentials:</strong><br />
          Username: <code class="bg-fresh-100 dark:bg-fresh-900/40 px-1 rounded">emilys</code> &nbsp;
          Password: <code class="bg-fresh-100 dark:bg-fresh-900/40 px-1 rounded">emilyspass</code>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-4" novalidate>
          <div>
            <label class="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5" for="username">
              Username
            </label>
            <input
              id="username"
              v-model.trim="credentials.username"
              type="text"
              autocomplete="username"
              placeholder="emilys"
              class="input"
              :class="{ 'ring-2 ring-red-400 border-red-400': formError }"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5" for="password">
              Password
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="credentials.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="••••••••"
                class="input pr-10"
                :class="{ 'ring-2 ring-red-400 border-red-400': formError }"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-sm"
              >
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <!-- Error message -->
          <p v-if="formError || authStore.error" class="text-red-500 dark:text-red-400 text-sm flex items-center gap-1.5">
            <span>⚠️</span> {{ formError || authStore.error }}
          </p>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="btn-primary w-full py-3 text-base flex items-center justify-center gap-2"
          >
            <span v-if="authStore.loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {{ authStore.loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import type { LoginCredentials } from '@/types'

const authStore    = useAuthStore()
const router       = useRouter()
const showPassword = ref(false)
const formError    = ref('')

const credentials = reactive<LoginCredentials>({
  username: '',
  password: '',
})

async function handleLogin(): Promise<void> {
  formError.value = ''

  if (!credentials.username || !credentials.password) {
    formError.value = 'Please enter your username and password.'
    return
  }

  const success = await authStore.login(credentials)
  if (success) {
    router.push('/')
  }
}
</script>
