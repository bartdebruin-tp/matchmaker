import { vi } from 'vitest'

// Mock Supabase client
export const mockSupabaseClient = {
  from: vi.fn(),
  auth: {
    getSession: vi.fn(),
    signInWithOAuth: vi.fn(),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    onAuthStateChange: vi.fn()
  }
}

// Mock environment variables
vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co')
vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key')
