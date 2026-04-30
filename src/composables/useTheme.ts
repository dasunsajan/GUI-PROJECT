import { ref, watch } from 'vue'
import type { ThemeMode } from '@/types'

const STORAGE_KEY = 'volthub-theme'

const _theme = ref<ThemeMode>(
  (localStorage.getItem(STORAGE_KEY) as ThemeMode) ?? 'light'
)

function applyTheme(mode: ThemeMode): void {
  if (mode === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Apply on module load
applyTheme(_theme.value)

watch(_theme, (val) => {
  applyTheme(val)
  localStorage.setItem(STORAGE_KEY, val)
})

export function useTheme() {
  function toggleTheme(): void {
    _theme.value = _theme.value === 'light' ? 'dark' : 'light'
  }

  return {
    theme: _theme,
    toggleTheme,
  }
}
