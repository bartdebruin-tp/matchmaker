import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
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
}))

describe('Auth Store', () => {
  let authStore: ReturnType<typeof useAuthStore>

  beforeEach(async () => {
    setActivePinia(createPinia())
    authStore = useAuthStore()
    
    // Reset all mocks
    const { supabase } = await import('@/lib/supabase')
    vi.mocked(supabase.auth.getSession).mockReset()
    vi.mocked(supabase.auth.signInWithOAuth).mockReset()
    vi.mocked(supabase.auth.signInWithPassword).mockReset()
    vi.mocked(supabase.auth.signUp).mockReset()
    vi.mocked(supabase.auth.signOut).mockReset()
    vi.mocked(supabase.auth.resetPasswordForEmail).mockReset()
    vi.mocked(supabase.auth.onAuthStateChange).mockReset()
  })

  describe('initialize', () => {
    it('should initialize with existing session', async () => {
      const { supabase } = await import('@/lib/supabase')
      
      const mockSession = {
        user: {
          id: 'user123',
          email: 'test@example.com'
        },
        access_token: 'token123'
      }

      vi.mocked(supabase.auth.getSession).mockResolvedValue({ 
        data: { session: mockSession },
        error: null 
      } as any)

      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      } as any)

      await authStore.initialize()

      expect(authStore.user).toBeDefined()
      expect(authStore.user?.email).toBe('test@example.com')
      expect(authStore.session).toBeDefined()
      expect(authStore.loading).toBe(false)
    })

    it('should handle no existing session', async () => {
      const { supabase } = await import('@/lib/supabase')
      
      vi.mocked(supabase.auth.getSession).mockResolvedValue({ 
        data: { session: null },
        error: null 
      } as any)

      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      } as any)

      await authStore.initialize()

      expect(authStore.user).toBeNull()
      expect(authStore.session).toBeNull()
      expect(authStore.loading).toBe(false)
    })

    it('should set up auth state change listener', async () => {
      const { supabase } = await import('@/lib/supabase')
      
      vi.mocked(supabase.auth.getSession).mockResolvedValue({ 
        data: { session: null },
        error: null 
      } as any)

      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      } as any)

      await authStore.initialize()

      expect(supabase.auth.onAuthStateChange).toHaveBeenCalled()
    })
  })

  describe('signInWithGoogle', () => {
    it('should initiate Google OAuth sign in', async () => {
      const { supabase } = await import('@/lib/supabase')
      
      vi.mocked(supabase.auth.signInWithOAuth).mockResolvedValue({ 
        data: { url: 'https://oauth.google.com', provider: 'google' },
        error: null 
      } as any)

      await authStore.signInWithGoogle()

      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: expect.stringContaining(window.location.origin)
        }
      })
    })

    it('should throw error on OAuth failure', async () => {
      const { supabase } = await import('@/lib/supabase')
      
      vi.mocked(supabase.auth.signInWithOAuth).mockResolvedValue({ 
        data: { url: '', provider: 'google' },
        error: { message: 'OAuth failed', name: 'OAuthError', status: 400 }
      } as any)

      await expect(authStore.signInWithGoogle()).rejects.toThrow()
    })
  })



  describe('signInWithEmail', () => {
    it('should sign in with email and password', async () => {
      const { supabase } = await import('@/lib/supabase')
      
      const mockData = {
        user: { id: 'user123', email: 'test@example.com' },
        session: { access_token: 'token123' }
      }

      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({ 
        data: mockData,
        error: null 
      } as any)

      const result = await authStore.signInWithEmail('test@example.com', 'password123')

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
      expect(result).toEqual(mockData)
    })

    it('should throw error on invalid credentials', async () => {
      const { supabase } = await import('@/lib/supabase')
      
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({ 
        data: { user: null, session: null },
        error: { message: 'Invalid credentials', name: 'AuthError', status: 401 }
      } as any)

      await expect(
        authStore.signInWithEmail('test@example.com', 'wrongpassword')
      ).rejects.toThrow()
    })
  })

  describe('signUpWithEmail', () => {
    it('should sign up with email and password', async () => {
      const { supabase } = await import('@/lib/supabase')
      
      const mockData = {
        user: { id: 'user123', email: 'test@example.com' },
        session: null
      }

      vi.mocked(supabase.auth.signUp).mockResolvedValue({ 
        data: mockData,
        error: null 
      } as any)

      const result = await authStore.signUpWithEmail('test@example.com', 'password123')

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          emailRedirectTo: expect.stringContaining(window.location.origin)
        }
      })
      expect(result).toEqual(mockData)
    })

    it('should throw error on sign up failure', async () => {
      const { supabase } = await import('@/lib/supabase')
      
      vi.mocked(supabase.auth.signUp).mockResolvedValue({ 
        data: { user: null, session: null },
        error: { message: 'Email already exists', name: 'AuthError', status: 422 }
      } as any)

      await expect(
        authStore.signUpWithEmail('existing@example.com', 'password123')
      ).rejects.toThrow()
    })
  })

  describe('signOut', () => {
    it('should sign out successfully', async () => {
      const { supabase } = await import('@/lib/supabase')
      
      vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null })

      await authStore.signOut()

      expect(supabase.auth.signOut).toHaveBeenCalled()
    })

    it('should throw error on sign out failure', async () => {
      const { supabase } = await import('@/lib/supabase')
      
      vi.mocked(supabase.auth.signOut).mockResolvedValue({ 
        error: { message: 'Sign out failed' } as any
      })

      await expect(authStore.signOut()).rejects.toThrow()
    })
  })

  describe('resetPassword', () => {
    it('should send password reset email', async () => {
      const { supabase } = await import('@/lib/supabase')
      
      vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValue({ 
        data: {},
        error: null 
      } as any)

      await authStore.resetPassword('test@example.com')

      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        {
          redirectTo: expect.stringContaining('/reset-password')
        }
      )
    })

    it('should throw error on reset failure', async () => {
      const { supabase } = await import('@/lib/supabase')
      
      vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValue({ 
        data: {},
        error: { message: 'Email not found', name: 'AuthError', status: 404 }
      } as any)

      await expect(authStore.resetPassword('nonexistent@example.com')).rejects.toThrow()
    })
  })

  describe('isAuthenticated', () => {
    it('should return true when user is logged in', async () => {
      const { supabase } = await import('@/lib/supabase')
      
      vi.mocked(supabase.auth.getSession).mockResolvedValue({ 
        data: { 
          session: {
            user: { id: 'user123', email: 'test@example.com' },
            access_token: 'token123'
          }
        },
        error: null 
      } as any)

      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      } as any)

      await authStore.initialize()

      expect(authStore.isAuthenticated).toBe(true)
    })

    it('should return false when user is not logged in', () => {
      expect(authStore.isAuthenticated).toBe(false)
    })
  })
})
