import { ref, computed } from 'vue'
import { translations, type Locale, type Translations } from '@/locales/translations'

const STORAGE_KEY = 'matchmaker_locale'

// Get initial locale from localStorage or default to English
const getInitialLocale = (): Locale => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'en' || stored === 'nl') {
    return stored
  }
  // Try to detect browser language
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('nl')) {
    return 'nl'
  }
  return 'en'
}

const currentLocale = ref<Locale>(getInitialLocale())

export function useI18n() {
  const t = computed<Translations>(() => translations[currentLocale.value])
  
  const locale = computed({
    get: () => currentLocale.value,
    set: (value: Locale) => {
      currentLocale.value = value
      localStorage.setItem(STORAGE_KEY, value)
    }
  })

  const setLocale = (newLocale: Locale) => {
    locale.value = newLocale
  }

  const availableLocales = [
    { code: 'en' as Locale, name: 'English', flag: '🇬🇧' },
    { code: 'nl' as Locale, name: 'Nederlands', flag: '🇳🇱' }
  ]

  return {
    t,
    locale,
    setLocale,
    availableLocales
  }
}
