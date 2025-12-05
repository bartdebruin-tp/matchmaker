import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/templates/HomePage.vue'
import PlayersPage from '@/templates/PlayersPage.vue'
import GroupsPage from '@/templates/GroupsPage.vue'
import GroupDetailPage from '@/templates/GroupDetailPage.vue'
import SettingsPage from '@/templates/SettingsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/players',
      name: 'players',
      component: PlayersPage
    },
    {
      path: '/groups',
      name: 'groups',
      component: GroupsPage
    },
    {
      path: '/groups/:id',
      name: 'group-detail',
      component: GroupDetailPage
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsPage
    }
  ]
})

export default router
