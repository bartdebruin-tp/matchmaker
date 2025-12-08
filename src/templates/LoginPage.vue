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
