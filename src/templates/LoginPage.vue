<template>
  <div class="min-h-screen flex items-center justify-center bg-amber-50 px-4">
    <div class="max-w-md w-full">
      <!-- Logo and Title -->
      <div class="text-center mb-8">
        <img src="/app-logo.png" alt="MatchMaker Logo" class="w-40 h-40 mx-auto mb-4" />        
        <p class="text-gray-600">{{ t.auth.signInToDashboard }}</p>
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
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">{{ t.auth.email }}</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">{{ t.auth.password }}</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              :minlength="isSignUp ? 6 : undefined"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? t.auth.pleaseWait : (isSignUp ? t.auth.signUp : t.auth.signIn) }}
          </button>
        </form>

        <!-- Toggle Sign Up / Sign In -->
        <div class="mt-4 text-center">
          <button
            @click="toggleMode"
            class="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            {{ isSignUp ? t.auth.alreadyHaveAccount : t.auth.dontHaveAccount }}
          </button>
        </div>

        <!-- Forgot Password -->
        <div v-if="!isSignUp" class="mt-2 text-center">
          <button
            @click="showResetPassword = true"
            class="text-sm text-gray-600 hover:text-gray-700"
          >
            {{ t.auth.forgotPassword }}
          </button>
        </div>
      </div>
    </div>

    <!-- Reset Password Modal -->
    <BaseModal :isOpen="showResetPassword" :title="t.auth.resetPassword" @close="showResetPassword = false">
      <div class="p-6">
        <form @submit.prevent="handleResetPassword" class="space-y-4">
          <div>
            <label for="reset-email" class="block text-sm font-medium text-gray-700 mb-1">{{ t.auth.email }}</label>
            <input
              id="reset-email"
              v-model="resetEmail"
              type="email"
              required
              autofocus
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div class="flex gap-3">
            <button
              type="button"
              @click="showResetPassword = false"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {{ t.common.cancel }}
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {{ t.auth.sendResetLink }}
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
import { useI18n } from '@/composables/useI18n'
import BaseModal from '@/components/BaseModal.vue'

const { t } = useI18n()
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
      successMessage.value = t.value.auth.confirmationLinkSent
    } else {
      await authStore.signInWithEmail(email.value, password.value)
      router.push('/')
    }
  } catch (e: any) {
    error.value = e.message || t.value.errors[isSignUp.value ? 'signUpFailed' : 'signInFailed']
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
    successMessage.value = t.value.auth.resetLinkSent
    showResetPassword.value = false
    resetEmail.value = ''
  } catch (e: any) {
    error.value = e.message || t.value.errors.saveFailed
  } finally {
    loading.value = false
  }
}
</script>
