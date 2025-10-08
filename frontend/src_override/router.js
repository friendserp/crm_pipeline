import { createRouter, createWebHistory } from 'vue-router'
import { userResource } from '@/stores/user'
import { sessionStore } from '@/stores/session'
import { viewsStore } from '@/stores/views'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Welcome.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/Dashboard.vue'),
  },
    {
    alias: '/schedules',
    path: '/schedules/view/:viewType?',
    name: 'Schedules',
    component: () => import('@/pages/Schedules.vue'),
  },
  {
    alias: '/quotes',
    path: '/quotes/view/:viewType?',
    name: 'Quotes',
    component: () => import('@/pages/Quotes.vue'),
  },
  {
    path: '/quotes/:quoteId',
    name: 'Quote',
    component: () => import(`@/pages/${handleMobileView('Quote')}.vue`),
    props: true,
  },
      {
    alias: '/tasks',
    path: '/tasks/view/:viewType?',
    name: 'Tasks',
    component: () => import('@/pages/Tasks.vue'),
  },
  {
    path: '/tasks/:taskId',
    name: 'Task',
    component: () => import(`@/pages/${handleMobileView('Task')}.vue`),
    props: true,
  },
        {
    alias: '/customers',
    path: '/customers/view/:viewType?',
    name: 'Customers',
    component: () => import('@/pages/Customers.vue'),
  },
  {
    path: '/customers/:customerId',
    name: 'Customer',
    component: () => import(`@/pages/${handleMobileView('Customer')}.vue`),
    props: true,
  },
          {
    alias: '/invoices',
    path: '/invoices/view/:viewType?',
    name: 'Invoices',
    component: () => import('@/pages/Invoices.vue'),
  },
  {
    path: '/invoices/:invoiceId',
    name: 'Invoice',
    component: () => import(`@/pages/${handleMobileView('Invoice')}.vue`),
    props: true,
  },
  {
    alias: '/issues',
    path: '/issues/view/:viewType?',
    name: 'Issues',
    component: () => import('@/pages/Issues.vue'),
  },
  {
    path: '/issues/:issueId',
    name: 'Issue',
    component: () => import(`@/pages/${handleMobileView('Issue')}.vue`),
    props: true,
  },
          {
    alias: '/expenses',
    path: '/expenses/view/:viewType?',
    name: 'Expenses',
    component: () => import('@/pages/Expenses.vue'),
  },
    {
    path: '/campaigns',
    name: 'Campaigns',
    component: () => import('@/pages/Campaigns.vue'),
  },
      {
    path: '/timesheets',
    name: 'Timesheets',
    component: () => import('@/pages/Timesheets.vue'),
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: () => import('@/pages/Welcome.vue'),
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/pages/Search.vue'),
  },
  {
    path: '/:invalidpath',
    name: 'Invalid Page',
    component: () => import('@/pages/InvalidPage.vue'),
  },
]

const handleMobileView = (componentName) => {
  return window.innerWidth < 768 ? `Mobile${componentName}` : componentName
}

let router = createRouter({
  history: createWebHistory('/crm'),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const { isLoggedIn } = sessionStore()

  isLoggedIn && (await userResource.promise)

  if (to.name === 'Home' && isLoggedIn) {
    const { views, getDefaultView } = viewsStore()
    await views.promise

    let defaultView = getDefaultView()
    if (!defaultView) {
      next({ name: 'Leads' })
      return
    }

    let { route_name, type, name, is_standard } = defaultView
    route_name = route_name || 'Leads'

    if (name && !is_standard) {
      next({ name: route_name, params: { viewType: type }, query: { view: name } })
    } else {
      next({ name: route_name, params: { viewType: type } })
    }
  } else if (!isLoggedIn) {
    window.location.href = '/login?redirect-to=/crm'
  } else if (to.matched.length === 0) {
    next({ name: 'Invalid Page' })
  } else if (['Deal', 'Lead'].includes(to.name) && !to.hash) {
    let storageKey = to.name === 'Deal' ? 'lastDealTab' : 'lastLeadTab'
    const activeTab = localStorage.getItem(storageKey) || 'activity'
    const hash = '#' + activeTab
    next({ ...to, hash })
  } else {
    next()
  }
})

export default router
