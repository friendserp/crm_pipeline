<!-- Quotations.vue -->
<template>
  <div class="w-full min-h-screen bg-[#233d48]">
    <!-- Header -->
    <div class="bg-[#233d48] border-b border-[#2a4a58]">
      <div class="container mx-auto px-6 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-white">Quotations</h1>
          <button class="bg-[#2E86AB] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#257195] transition-colors">
            Create Quotation
          </button>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-6 py-6">
      <!-- Overview Section -->
      <div class="mb-8">
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div class="bg-[#2a4a58] rounded-lg border border-[#315566] p-4 hover:border-[#2E86AB] transition-colors">
            <div class="text-sm text-gray-300">Expiring soon</div>
            <div class="text-xl font-semibold text-white">{{ overview.expiring_soon }}</div>
          </div>
          <div class="bg-[#2a4a58] rounded-lg border border-[#315566] p-4 hover:border-[#2E86AB] transition-colors">
            <div class="text-sm text-gray-300">Draft</div>
            <div class="text-xl font-semibold text-yellow-400">{{ overview.draft }}</div>
          </div>
          <div class="bg-[#2a4a58] rounded-lg border border-[#315566] p-4 hover:border-[#2E86AB] transition-colors">
            <div class="text-sm text-gray-300">Submitted</div>
            <div class="text-xl font-semibold text-blue-400">{{ overview.submitted }}</div>
          </div>
          <div class="bg-[#2a4a58] rounded-lg border border-[#315566] p-4 hover:border-[#2E86AB] transition-colors">
            <div class="text-sm text-gray-300">Lost</div>
            <div class="text-xl font-semibold text-red-400">{{ overview.lost }}</div>
          </div>
          <div class="bg-[#2a4a58] rounded-lg border border-[#315566] p-4 hover:border-[#2E86AB] transition-colors">
            <div class="text-sm text-gray-300">Ordered</div>
            <div class="text-xl font-semibold text-green-400">{{ overview.ordered }}</div>
          </div>
        </div>
      </div>

      <!-- All Quotations Section -->
      <div class="bg-[#2a4a58] rounded-lg border border-[#315566]">
        <div class="p-6 border-b border-[#315566]">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-lg font-semibold text-white">All quotations</h2>
              <div class="text-sm text-gray-300 mt-1">({{ filteredQuotations.length }} results)</div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="p-6 border-b border-[#315566] bg-[#315566]">
          <div class="flex flex-wrap gap-6">
            <div>
              <label class="text-sm text-gray-300 block mb-2 font-medium">Customer</label>
              <select v-model="filters.customer" class="bg-[#233d48] border border-[#315566] text-white rounded-lg px-4 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent">
                <option value="all">All</option>
                <option v-for="customer in uniqueCustomers" :key="customer" :value="customer">{{ customer }}</option>
              </select>
            </div>
            <div>
              <label class="text-sm text-gray-300 block mb-2 font-medium">Date Range</label>
              <select v-model="filters.dateRange" class="bg-[#233d48] border border-[#315566] text-white rounded-lg px-4 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent">
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Quotations Table -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-[#315566] border-b border-[#315566]">
              <tr>
                <th class="text-left py-4 px-6 text-sm font-medium text-gray-300">Quotation</th>
                <th class="text-left py-4 px-6 text-sm font-medium text-gray-300">Customer</th>
                <th class="text-left py-4 px-6 text-sm font-medium text-gray-300">Date</th>
                <th class="text-left py-4 px-6 text-sm font-medium text-gray-300">Status</th>
                <th class="text-left py-4 px-6 text-sm font-medium text-gray-300">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#315566]">
              <tr v-if="loading">
                <td colspan="5" class="text-center py-8 text-gray-400">
                  Loading quotations...
                </td>
              </tr>
              <tr v-else-if="filteredQuotations.length === 0">
                <td colspan="5" class="text-center py-8 text-gray-400">
                  No quotations found
                </td>
              </tr>
              
              <tr v-for="quotation in filteredQuotations" :key="quotation.name" 
                  class="hover:bg-[#315566] cursor-pointer transition-colors group"
                  @click="viewQuotation(quotation.name)">
                <td class="py-4 px-6">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0 w-2 h-2 rounded-full" :class="getStatusColor(quotation.status)"></div>
                    <div>
                      <div class="font-medium text-white group-hover:text-[#2E86AB] transition-colors">
                        #{{ quotation.name }}
                      </div>
                      <div class="text-sm text-gray-400 mt-1">
                        {{ quotation.items?.length || 0 }} items
                      </div>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <div class="text-white">{{ quotation.customer_name }}</div>
                  <div class="text-sm text-gray-400">{{ quotation.quotation_to }}</div>
                </td>
                <td class="py-4 px-6">
                  <div class="text-sm text-white">{{ formatDate(quotation.transaction_date) }}</div>
                  <div class="text-sm text-gray-400">Valid till: {{ formatDate(quotation.valid_till) }}</div>
                </td>
                <td class="py-4 px-6">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                        :class="getStatusClass(quotation.status)">
                    {{ quotation.status }}
                  </span>
                </td>
                <td class="py-4 px-6">
                  <div class="font-medium text-white">{{ formatCurrency(quotation.grand_total) }}</div>
                  <div class="text-sm text-gray-400">{{ quotation.currency }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'Quotations',
  setup() {
    const router = useRouter()
    return { router }
  },
  data() {
    return {
      quotations: [],
      filters: {
        status: 'all',
        customer: 'all',
        dateRange: 'all'
      },
      overview: {
        expiring_soon: 0,
        draft: 0,
        submitted: 0,
        lost: 0,
        ordered: 0
      },
      loading: false
    }
  },
  computed: {
    filteredQuotations() {
      return this.quotations.filter(quotation => {
        if (this.filters.status !== 'all' && quotation.status !== this.filters.status) return false
        if (this.filters.customer !== 'all' && quotation.customer_name !== this.filters.customer) return false
        
        // Date range filtering
        if (this.filters.dateRange !== 'all') {
          const quoteDate = new Date(quotation.transaction_date)
          const now = new Date()
          
          switch (this.filters.dateRange) {
            case 'today':
              return quoteDate.toDateString() === now.toDateString()
            case 'week':
              const weekAgo = new Date(now.setDate(now.getDate() - 7))
              return quoteDate >= weekAgo
            case 'month':
              const monthAgo = new Date(now.setMonth(now.getMonth() - 1))
              return quoteDate >= monthAgo
          }
        }
        
        return true
      })
    },
    recentQuotations() {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      return this.quotations.filter(quote => {
        const quoteDate = new Date(quote.transaction_date)
        return quoteDate >= thirtyDaysAgo
      }).slice(0, 5)
    },
    uniqueCustomers() {
      return [...new Set(this.quotations.map(q => q.customer_name))].sort()
    }
  },
  async mounted() {
    await this.loadQuotations()
    this.calculateOverview()
  },
  watch: {
    filters: {
      handler() {
        this.calculateOverview()
      },
      deep: true
    }
  },
  methods: {
    viewQuotation(quotationId) {
      this.router.push(`/quotes/${quotationId}`)
    },
    
    async loadQuotations() {
      this.loading = true
      try {
        const response = await fetch('/api/method/frappe.client.get_list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': this.getCSRFToken()
          },
          body: JSON.stringify({
            doctype: 'Quotation',
            fields: [
              'name', 'customer_name', 'quotation_to', 'transaction_date', 'valid_till',
              'grand_total', 'currency', 'status', 'items', 'company', 'modified'
            ],
            limit_page_length: 100,
            order_by: 'modified desc'
          })
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        this.quotations = data.message || []
      } catch (error) {
        console.error('Error loading quotations:', error)
        this.quotations = []
      } finally {
        this.loading = false
      }
    },

    getCSRFToken() {
      return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
    },
    
    calculateOverview() {
      const now = new Date()
      const sevenDaysFromNow = new Date(now)
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
      
      this.overview = {
        expiring_soon: this.quotations.filter(quote => {
          if (!quote.valid_till) return false
          const validTill = new Date(quote.valid_till)
          return validTill <= sevenDaysFromNow && validTill >= now && quote.status === 'Submitted'
        }).length,
        
        draft: this.quotations.filter(quote => quote.status === 'Draft').length,
        submitted: this.quotations.filter(quote => quote.status === 'Submitted').length,
        lost: this.quotations.filter(quote => quote.status === 'Lost').length,
        ordered: this.quotations.filter(quote => quote.status === 'Ordered').length
      }
    },
    
    getStatusClass(status) {
      const classes = {
        'Draft': 'bg-gray-700 text-gray-300',
        'Submitted': 'bg-blue-900 text-blue-200',
        'Lost': 'bg-red-900 text-red-200',
        'Ordered': 'bg-green-900 text-green-200',
        'Cancelled': 'bg-red-900 text-red-200'
      }
      return classes[status] || 'bg-gray-700 text-gray-300'
    },

    getStatusColor(status) {
      const colors = {
        'Draft': 'bg-gray-500',
        'Submitted': 'bg-blue-500',
        'Lost': 'bg-red-500',
        'Ordered': 'bg-green-500',
        'Cancelled': 'bg-red-500'
      }
      return colors[status] || 'bg-gray-500'
    },
    
    formatDate(dateString) {
      if (!dateString) return 'Not set'
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      } catch {
        return 'Invalid date'
      }
    },
    
    formatCurrency(amount) {
      return `ETB ${parseFloat(amount || 0).toFixed(2)}`
    }
  }
}
</script>