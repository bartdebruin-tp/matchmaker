# Quick Start: Using i18n in MatchMaker

## For End Users

### How to Change Language

1. **Open the app**
2. **Tap/Click the Settings icon** (⚙️) in the bottom navigation
3. **Find the "Language" section** at the top
4. **Select your language**:
   - 🇬🇧 **English** - for English interface
   - 🇳🇱 **Nederlands** - for Dutch interface
5. **Done!** The entire app updates immediately

Your language choice is saved automatically.

---

## For Developers

### Quick Reference

#### 1. Import and Setup
```typescript
import { useI18n } from '@/composables/useI18n'

const { t, locale, setLocale } = useI18n()
```

#### 2. Use in Templates
```vue
<template>
  <!-- Simple text -->
  <h1>{{ t.players.title }}</h1>
  
  <!-- Button -->
  <button>{{ t.common.save }}</button>
  
  <!-- Conditional -->
  <span>{{ isLoading ? t.common.loading : t.common.save }}</span>
</template>
```

#### 3. Use in Scripts
```typescript
// Access with .value since t is computed
const message = t.value.players.playerAdded
successMessage.value = t.value.success.saved
```

### Available Translation Keys

```typescript
// Common actions
t.common.cancel, t.common.save, t.common.delete, t.common.edit, 
t.common.add, t.common.close, t.common.loading

// Navigation
t.nav.home, t.nav.players, t.nav.groups, t.nav.settings

// Auth
t.auth.signIn, t.auth.signUp, t.auth.email, t.auth.password

// Players
t.players.title, t.players.addPlayer, t.players.editPlayer,
t.players.playerName, t.players.noPlayers

// Groups
t.groups.title, t.groups.addGroup, t.groups.groupName,
t.groups.matchType, t.groups.random, t.groups.scheduled

// Errors
t.errors.saveFailed, t.errors.deleteFailed, t.errors.invalidEmail

// Success
t.success.saved, t.success.updated, t.success.deleted
```

### Language Switching Programmatically

```typescript
import { useI18n } from '@/composables/useI18n'

const { setLocale } = useI18n()

// Switch to Dutch
setLocale('nl')

// Switch to English
setLocale('en')
```

### Check Current Language

```typescript
const { locale } = useI18n()

console.log(locale.value) // 'en' or 'nl'
```

---

## Translation File Structure

All translations are in **`src/locales/translations.ts`**

```typescript
export const translations = {
  en: {
    common: { save: 'Save', cancel: 'Cancel' },
    players: { title: 'Players', addPlayer: 'Add Player' }
    // ... more
  },
  nl: {
    common: { save: 'Opslaan', cancel: 'Annuleren' },
    players: { title: 'Spelers', addPlayer: 'Speler Toevoegen' }
    // ... more
  }
}
```

---

## Common Patterns

### Form Labels
```vue
<label>{{ t.players.playerName }}</label>
<input v-model="name" :placeholder="t.players.playerName" />
```

### Buttons
```vue
<button>{{ t.common.save }}</button>
<button>{{ loading ? t.common.loading : t.common.save }}</button>
```

### Modal Titles
```vue
<BaseModal :title="isEdit ? t.players.editPlayer : t.players.addPlayer">
```

### Success/Error Messages
```typescript
// In script
try {
  await save()
  toast.success(t.value.success.saved)
} catch (error) {
  toast.error(error.message || t.value.errors.saveFailed)
}
```

### Empty States
```vue
<div v-if="players.length === 0">
  <p>{{ t.players.noPlayers }}</p>
  <button>{{ t.players.createFirstPlayer }}</button>
</div>
```

---

## Testing Checklist

- [ ] Language selector appears in Settings
- [ ] Clicking English shows all English text
- [ ] Clicking Nederlands shows all Dutch text  
- [ ] Language choice persists after refresh
- [ ] All pages show translated text
- [ ] All buttons show translated labels
- [ ] All forms show translated labels
- [ ] Success messages are translated
- [ ] Error messages are translated
- [ ] Empty states are translated
- [ ] No hardcoded English text visible

---

## Troubleshooting

**Problem**: Text shows as object or undefined
- **Solution**: Use `t.value.section.key` in scripts, `t.section.key` in templates

**Problem**: Language doesn't persist
- **Solution**: Check localStorage for `matchmaker_locale` key

**Problem**: Some text not translating
- **Solution**: Verify translation key exists in both `en` and `nl` in translations.ts

**Problem**: TypeScript errors
- **Solution**: Make sure the key exists in the `Translations` interface
