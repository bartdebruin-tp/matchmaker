import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/templates/HomePage.vue'
import PlayersPage from '@/templates/PlayersPage.vue'
import GroupsPage from '@/templates/GroupsPage.vue'
import GroupDetailPage from '@/templates/GroupDetailPage.vue'
import SettingsPage from '@/templates/SettingsPage.vue'
import LoginPage from '@/templates/LoginPage.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: { requiresAuth: true }
    },
    {
      path: '/players',
      name: 'players',
      component: PlayersPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/groups',
      name: 'groups',
      component: GroupsPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/groups/:id',
      name: 'group-detail',
      component: GroupDetailPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsPage,
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
