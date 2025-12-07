<template>
  <div class="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 to-teal-50 px-4">
    <div class="max-w-md w-full">
      <!-- Logo and Title -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-emerald-600 mb-2">MatchMaker</h1>
        <p class="text-gray-600">Sign in to your personal dashboard</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {{ error }}
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
          {{ successMessage }}
        </div>

        <!-- OAuth Buttons -->
        <!-- <div class="space-y-3 mb-6">
          <button
            @click="handleGoogleSignIn"
            :disabled="loading"
            class="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span class="font-medium text-gray-700">Continue with Google</span>
          </button>

          <button
            @click="handleFacebookSignIn"
            :disabled="loading"
            class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span class="font-medium">Continue with Facebook</span>
          </button>
        </div>
        
        <div class="relative mb-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>
    -->

        <!-- Email Form -->
        <form @submit.prevent="handleEmailAuth" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              :minlength="isSignUp ? 6 : undefined"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In') }}
          </button>
        </form>

        <!-- Toggle Sign Up / Sign In -->
        <div class="mt-4 text-center">
          <button
            @click="toggleMode"
            class="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            {{ isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up" }}
          </button>
        </div>

        <!-- Forgot Password -->
        <div v-if="!isSignUp" class="mt-2 text-center">
          <button
            @click="showResetPassword = true"
            class="text-sm text-gray-600 hover:text-gray-700"
          >
            Forgot password?
          </button>
        </div>
      </div>
    </div>

    <!-- Reset Password Modal -->
    <BaseModal :isOpen="showResetPassword" title="Reset Password" @close="showResetPassword = false">
      <div class="p-6">
        <form @submit.prevent="handleResetPassword" class="space-y-4">
          <div>
            <label for="reset-email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="reset-email"
              v-model="resetEmail"
              type="email"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div class="flex gap-3">
            <button
              type="button"
              @click="showResetPassword = false"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import BaseModal from '@/components/BaseModal.vue'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const resetEmail = ref('')
const isSignUp = ref(false)
const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const showResetPassword = ref(false)

const toggleMode = () => {
  isSignUp.value = !isSignUp.value
  error.value = ''
  successMessage.value = ''
}

// const handleGoogleSignIn = async () => {
//   loading.value = true
//   error.value = ''
//   try {
//     await authStore.signInWithGoogle()
//   } catch (e: any) {
//     error.value = e.message || 'Failed to sign in with Google'
//   } finally {
//     loading.value = false
//   }
// }

// const handleFacebookSignIn = async () => {
//   loading.value = true
//   error.value = ''
//   try {
//     await authStore.signInWithFacebook()
//   } catch (e: any) {
//     error.value = e.message || 'Failed to sign in with Facebook'
//   } finally {
//     loading.value = false
//   }
// }

const handleEmailAuth = async () => {
  loading.value = true
  error.value = ''
  successMessage.value = ''
  
  try {
    if (isSignUp.value) {
      await authStore.signUpWithEmail(email.value, password.value)
      successMessage.value = 'Check your email for the confirmation link!'
    } else {
      await authStore.signInWithEmail(email.value, password.value)
      router.push('/')
    }
  } catch (e: any) {
    error.value = e.message || `Failed to ${isSignUp.value ? 'sign up' : 'sign in'}`
  } finally {
    loading.value = false
  }
}

const handleResetPassword = async () => {
  loading.value = true
  error.value = ''
  successMessage.value = ''
  
  try {
    await authStore.resetPassword(resetEmail.value)
    successMessage.value = 'Password reset link sent! Check your email.'
    showResetPassword.value = false
    resetEmail.value = ''
  } catch (e: any) {
    error.value = e.message || 'Failed to send reset link'
  } finally {
    loading.value = false
  }
}
</script>
