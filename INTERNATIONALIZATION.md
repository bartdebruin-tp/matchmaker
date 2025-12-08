# Internationalization (i18n) Implementation

## Overview
The MatchMaker application now supports multiple languages (English and Dutch) through a comprehensive internationalization system.

## Implementation Details

### 1. Translation Dictionary
**Location:** `src/locales/translations.ts`

Contains all text strings in both English (`en`) and Dutch (`nl`):
- **Common**: Cancel, Save, Delete, Edit, Add, Close, etc.
- **Navigation**: Home, Players, Groups, Settings
- **Authentication**: Sign in, Sign up, Email, Password, etc.
- **Home Page**: Welcome messages, quick match, active players
- **Players**: Add, edit, delete player messages
- **Groups**: Add, edit, delete group messages  
- **Group Details**: Sessions, matches, player attendance
- **Settings**: Language, theme, account, data management
- **Errors**: Validation errors, network errors, database errors
- **Success Messages**: Saved, updated, deleted confirmations

### 2. useI18n Composable
**Location:** `src/composables/useI18n.ts`

Features:
- **Auto-detection**: Detects browser language on first visit
- **Persistence**: Stores language preference in localStorage
- **Reactive**: Language changes update UI immediately
- **Available locales**: English (🇬🇧) and Dutch (🇳🇱)

Usage:
```typescript
import { useI18n } from '@/composables/useI18n'

const { t, locale, setLocale, availableLocales } = useI18n()

// In template
{{ t.common.save }}

// In script (since t is computed)
t.value.players.playerAdded
```

### 3. Updated Files

#### Pages
- ✅ **LoginPage.vue** - Sign in/up forms, password reset
- ✅ **HomePage.vue** - Welcome, quick match, groups overview
- ✅ **PlayersPage.vue** - Player list, add/edit/delete
- ✅ **GroupsPage.vue** - Group list, add/edit/delete
- ✅ **GroupDetailPage.vue** - Sessions, matches, player management
- ✅ **SettingsPage.vue** - Account, language selector, stats

#### Components
- ✅ **BottomNav.vue** - Navigation labels
- ✅ **PlayerFormModal.vue** - Player form labels and messages
- ✅ **GroupFormModal.vue** - Group form labels and messages
- ✅ **MatchCard.vue** - Match display text

### 4. Language Selector

Added to **SettingsPage** with:
- Visual language picker (flags + names)
- Current language highlighted
- Instant language switching
- Persisted preference

## Usage Guide

### For Users
1. Go to **Settings** page
2. Find the **Language** section at the top
3. Click on your preferred language:
   - 🇬🇧 **English**
   - 🇳🇱 **Nederlands**
4. The app immediately updates to show all text in selected language

### For Developers

#### Adding New Text
1. Add translation keys to `src/locales/translations.ts`:
```typescript
export const translations: Record<Locale, Translations> = {
  en: {
    mySection: {
      myText: 'Hello World'
    }
  },
  nl: {
    mySection: {
      myText: 'Hallo Wereld'
    }
  }
}
```

2. Update the `Translations` interface to include the new keys

3. Use in components:
```vue
<template>
  <div>{{ t.mySection.myText }}</div>
</template>

<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
const { t } = useI18n()
</script>
```

#### Adding New Language
1. Add new locale type to `Locale` union in `translations.ts`:
```typescript
export type Locale = 'en' | 'nl' | 'de'  // Adding German
```

2. Add translations to the `translations` object:
```typescript
export const translations: Record<Locale, Translations> = {
  en: { /* ... */ },
  nl: { /* ... */ },
  de: { /* German translations */ }
}
```

3. Add locale to `availableLocales` in `useI18n.ts`:
```typescript
const availableLocales = [
  { code: 'en' as Locale, name: 'English', flag: '🇬🇧' },
  { code: 'nl' as Locale, name: 'Nederlands', flag: '🇳🇱' },
  { code: 'de' as Locale, name: 'Deutsch', flag: '🇩🇪' }
]
```

## Translation Coverage

### Complete Translation Categories
- ✅ Common actions (cancel, save, delete, edit, add)
- ✅ Navigation (home, players, groups, settings)
- ✅ Authentication (sign in, sign up, password reset)
- ✅ Players management (add, edit, delete, search)
- ✅ Groups management (add, edit, delete, types)
- ✅ Group details (sessions, matches, attendance)
- ✅ Settings (language, account, stats)
- ✅ Error messages (validation, network, database)
- ✅ Success messages (saved, updated, deleted)
- ✅ Empty states (no players, no groups, no sessions)

### Text Patterns Used

**In Templates:**
```vue
<!-- Direct translation -->
<h1>{{ t.players.title }}</h1>
<button>{{ t.common.save }}</button>

<!-- Conditional translation -->
<button>{{ loading ? t.common.loading : t.common.save }}</button>
<button>{{ isEdit ? t.players.editPlayer : t.players.addPlayer }}</button>
```

**In Scripts:**
```typescript
// Success message
successMessage.value = t.value.players.playerAdded

// Error message with fallback
error.value = e.message || t.value.errors.saveFailed

// Conditional message
const message = isEdit ? t.value.success.updated : t.value.success.created
```

## Benefits

1. **Better User Experience**: Users can use the app in their preferred language
2. **Auto-detection**: Automatically shows Dutch for Dutch users
3. **Easy Maintenance**: All text in one place
4. **Type Safety**: TypeScript ensures translations exist
5. **Scalability**: Easy to add more languages
6. **Consistent**: Same terms used throughout the app

## Testing

To test the implementation:

1. **Language Switching**:
   - Go to Settings
   - Switch between English and Dutch
   - Verify all text updates immediately
   - Refresh page - language should persist

2. **Browser Language Detection**:
   - Clear localStorage
   - Set browser language to Dutch
   - Open app - should default to Dutch
   - Set browser language to English
   - Clear localStorage and reopen - should default to English

3. **Coverage Check**:
   - Navigate through all pages
   - Verify no hardcoded English text remains
   - Check all modals and forms
   - Trigger success and error messages
   - Check empty states

## Notes

- Language preference is stored in localStorage with key `matchmaker_locale`
- The system falls back to English if browser language is not Dutch
- All user-facing text has been translated
- Console logs and technical errors remain in English
- The `t` object is reactive - language changes update immediately
