import { createClient, processLock } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration error:', {
    urlExists: !!supabaseUrl,
    keyExists: !!supabaseAnonKey,
    url: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'missing',
  })
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Validate URL format
if (!supabaseUrl.startsWith('http')) {
  throw new Error('VITE_SUPABASE_URL must be a valid URL starting with http:// or https://')
}

// Validate anon key is not placeholder
if (supabaseAnonKey.includes('sb_publishable_') && supabaseAnonKey.length != 46) {
  console.warn('⚠️  WARNING: Your VITE_SUPABASE_ANON_KEY appears to be a placeholder value.')
  console.warn('Please update your .env file with the actual anon key from your Supabase project.')
  console.warn('Get it from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      lock: processLock,
  }
})
