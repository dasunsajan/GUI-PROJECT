import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthUser, LoginCredentials, ApiError } from '@/types'

const TOKEN_KEY    = 'volthub-token'
const USER_KEY     = 'volthub-user'

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user    = ref<AuthUser | null>(loadUser())
  const loading = ref(false)
  const error   = ref<string | null>(null)

  const isLoggedIn    = computed(() => user.value !== null)
  const token         = computed(() => localStorage.getItem(TOKEN_KEY))
  const displayName   = computed(() =>
    user.value ? `${user.value.firstName} ${user.value.lastName}` : ''
  )

  async function login(credentials: LoginCredentials): Promise<boolean> {
    loading.value = true
    error.value   = null
    try {
      const res = await fetch('https://dummyjson.com/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...credentials, expiresInMins: 60 }),
      })
      if (!res.ok) {
        const err: ApiError = { message: 'Invalid username or password', status: res.status }
        error.value = err.message
        return false
      }
      const data = (await res.json()) as AuthUser
      user.value  = data
      localStorage.setItem(TOKEN_KEY, data.token)
      localStorage.setItem(USER_KEY,  JSON.stringify(data))
      return true
    } catch {
      error.value = 'Network error. Please try again.'
      return false
    } finally {
      loading.value = false
    }
  }

  function logout(): void {
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  return {
    user,
    loading,
    error,
    isLoggedIn,
    token,
    displayName,
    login,
    logout,
  }
})
