# MatchMaker - Team Matchup Generator

A modern Vue.js application for creating and managing player groups with random team matchup generation. Now with cloud sync via Supabase!

## ✨ Features

- **Vue 3.5** with Composition API
- **TypeScript** for full type safety
- **Pinia** for state management
- **Supabase** for authentication and database
- **OAuth Login** - Google & Facebook
- **Cloud Sync** - Your data syncs across devices
- **Multi-user** - Each user has their own private data
- **Vite** for fast development
- **TailwindCSS** for beautiful styling
- **PWA Ready** - Install as a mobile app

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase
Follow the complete setup guide in **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)**

Quick summary:
1. Create a Supabase project
2. Run the SQL schema from SUPABASE_SETUP.md
3. Configure OAuth providers (Google, Facebook)
4. Copy `.env.example` to `.env` and add your credentials

### 3. Start Development Server
```bash
npm run dev
```

## 📚 Documentation

- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Complete database and auth setup
- **[INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md)** - Integration summary and testing guide
- **[MATCHMAKER_README.md](MATCHMAKER_README.md)** - Original app documentation

## 🏗️ Project Structuur

```
src/
├── main.ts                     # Entry point met TypeScript
├── App.vue                     # Hoofd component met <script setup lang="ts">
├── components/
│   └── TypeScriptExample.vue   # Voorbeeld component met volledige typing
├── composables/
│   ├── useCounter.ts           # Type-safe counter composable
│   └── useApi.ts               # API composable met generics
├── stores/
│   └── sample.ts               # Pinia store met TypeScript
└── types/
    └── index.ts                # Gedeelde type definities
```

## 🚀 Scripts

```bash
# Development server starten
npm run dev

# TypeScript type checking
npm run type-check

# Build voor productie
npm run build

# Preview build
npm run preview
```

## 💡 TypeScript Kenmerken

### 1. Composition API met Types

```typescript
// Reactive refs met expliciete typing
const count = ref<number>(0)
const message = ref<string>('Hello TypeScript!')

// Computed properties met type inference
const doubleCount = computed(() => count.value * 2)

// Methods met expliciete return types
const increment = (): void => {
  count.value++
}
```

### 2. Type-safe Component Props

```typescript
interface Props {
  title: string
  count?: number
  isVisible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  isVisible: true
})
```

### 3. Event Emits met Types

```typescript
interface Emits {
  (e: 'increment'): void
  (e: 'update:count', value: number): void
  (e: 'click', event: MouseEvent): void
}

const emit = defineEmits<Emits>()
```

### 4. Pinia Store met TypeScript

```typescript
interface SampleData {
  sampleName: string
}

export const useSampleStore = defineStore('sample', () => {
  const sampleName = ref<string>('Sample Name')
  
  function exportSample(): SampleData {
    return { sampleName: sampleName.value }
  }
  
  return { sampleName, exportSample }
})
```

### 5. Custom Composables

```typescript
export function useCounter(options: UseCounterOptions = {}): UseCounterReturn {
  const count = ref<number>(initialValue)
  
  const increment = (): void => {
    if (count.value < max) count.value += step
  }
  
  return { count, increment, /* ... */ }
}
```

## 🔧 TypeScript Configuratie

- **tsconfig.json**: Strict TypeScript configuratie
- **Type checking**: Ingebouwd in build proces
- **Vue SFC support**: Volledige TypeScript support in .vue bestanden
- **Path mapping**: @/ alias voor src/ directory
- **IDE support**: IntelliSense en type checking in VS Code

## 📚 Vue 3.5 + TypeScript Best Practices

1. **Gebruik expliciete types** voor reactive refs
2. **Definieer interfaces** voor props en emits
3. **Type je stores** met TypeScript
4. **Maak herbruikbare composables** met generics
5. **Gebruik strict TypeScript** configuratie
6. **Documenteer types** in aparte bestanden

## 🔗 Nuttige Links

- [Vue 3 TypeScript Guide](https://vuejs.org/guide/typescript/composition-api.html)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Pinia TypeScript](https://pinia.vuejs.org/cookbook/composables.html)
- [Vite TypeScript](https://vitejs.dev/guide/features.html#typescript)
