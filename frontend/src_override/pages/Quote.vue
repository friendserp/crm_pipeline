<!-- Quotation.vue -->
<template>
  <div class="min-h-screen bg-[#233d48]">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-white text-lg">Loading quotation...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-red-400 text-lg">{{ error }}</div>
    </div>

    <!-- Quotation Content -->
    <div v-else-if="quotation">
      <!-- Header -->
      <div class="bg-[#233d48] border-b border-[#2a4a58]">
        <div class="container mx-auto px-6 py-4">
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-4">
              <button @click="goBack" class="text-gray-300 hover:text-white">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <div>
                <h1 class="text-2xl font-bold text-white">Quotation #{{ quotation.name }}</h1>
                <div class="text-sm text-gray-300 mt-1">
                  {{ quotation.customer_name }} • {{ formatDate(quotation.transaction_date) }}
                </div>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize"
                    :class="getStatusClass(quotation.status)">
                {{ quotation.status }}
              </span>
              <span v-if="isExpiringSoon" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-900 text-yellow-200">
                Expiring soon
              </span>
    
            </div>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-6 py-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Customer & Dates Card -->
            <div class="bg-[#2a4a58] rounded-lg border border-[#315566] p-6">
              <h2 class="text-lg font-semibold text-white mb-4">Customer & Dates</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="text-sm text-gray-300 block mb-2 font-medium">Customer</label>
                  <div class="text-white font-medium">{{ quotation.customer_name }}</div>
                  <div class="text-sm text-gray-400 mt-1">{{ quotation.quotation_to }}</div>
                </div>
                <div>
                  <label class="text-sm text-gray-300 block mb-2 font-medium">Customer Group</label>
                  <div class="text-white">{{ quotation.customer_group }}</div>
                </div>
                <div>
                  <label class="text-sm text-gray-300 block mb-2 font-medium">Transaction Date</label>
                  <div class="text-white">{{ formatDate(quotation.transaction_date) }}</div>
                </div>
                <div>
                  <label class="text-sm text-gray-300 block mb-2 font-medium">Valid Till</label>
                  <div class="text-white">{{ formatDate(quotation.valid_till) }}</div>
                </div>
              </div>
            </div>

            <!-- Items Card -->
            <div class="bg-[#2a4a58] rounded-lg border border-[#315566] p-6">
              <h2 class="text-lg font-semibold text-white mb-4">Items</h2>
              
              <div v-if="quotation.items.length === 0" class="text-center py-8 text-gray-400">
                No items in this quotation
              </div>
              
              <div v-else class="space-y-4">
                <div v-for="item in quotation.items" :key="item.name" 
                     class="bg-[#315566] border border-[#3a6374] rounded-lg p-4 hover:border-[#2E86AB] transition-colors">
                  <div class="flex items-start space-x-4">
                    <img v-if="item.image" :src="item.image" :alt="item.item_name" class="w-16 h-16 object-cover rounded-lg">
                    <div class="flex-1">
                      <div class="flex justify-between items-start">
                        <div>
                          <div class="font-medium text-white">{{ item.item_name }}</div>
                          <div class="text-sm text-gray-400 mt-1">{{ item.description }}</div>
                          <div class="text-sm text-gray-400 mt-1">Code: {{ item.item_code }}</div>
                        </div>
                        <div class="text-right">
                          <div class="font-semibold text-white">{{ formatCurrency(item.amount) }}</div>
                          <div class="text-sm text-gray-400">{{ item.qty }} × {{ formatCurrency(item.rate) }}</div>
                        </div>
                      </div>
                      <div class="mt-3 grid grid-cols-2 gap-4 text-sm text-gray-400">
                        <div>UOM: {{ item.uom }}</div>
                        <div>Stock Qty: {{ item.stock_qty }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment Schedule Card -->
            <div v-if="quotation.payment_schedule && quotation.payment_schedule.length > 0" 
                 class="bg-[#2a4a58] rounded-lg border border-[#315566] p-6">
              <h2 class="text-lg font-semibold text-white mb-4">Payment Schedule</h2>
              
              <div class="space-y-3">
                <div v-for="payment in quotation.payment_schedule" :key="payment.name" 
                     class="bg-[#315566] border border-[#3a6374] rounded-lg p-4">
                  <div class="flex justify-between items-center">
                    <div>
                      <div class="font-medium text-white">{{ formatCurrency(payment.payment_amount) }}</div>
                      <div class="text-sm text-gray-400 mt-1">Due: {{ formatDate(payment.due_date) }}</div>
                    </div>
                    <div class="text-right">
                      <div class="text-sm text-gray-300">{{ payment.invoice_portion }}%</div>
                      <div class="text-sm text-gray-400">Outstanding: {{ formatCurrency(payment.outstanding) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Financial Summary -->
            <div class="bg-[#2a4a58] rounded-lg border border-[#315566] p-6">
              <h3 class="font-semibold text-white mb-4">Financial Summary</h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-300">Net Total</span>
                  <span class="font-semibold text-white">{{ formatCurrency(quotation.net_total) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-300">Taxes</span>
                  <span class="font-semibold text-white">{{ formatCurrency(quotation.total_taxes_and_charges) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-300">Discount</span>
                  <span class="font-semibold text-white">{{ formatCurrency(quotation.discount_amount) }}</span>
                </div>
                <div class="border-t border-[#315566] pt-2">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-300 font-medium">Grand Total</span>
                    <span class="font-bold text-white text-lg">{{ formatCurrency(quotation.grand_total) }}</span>
                  </div>
                </div>
                <div class="text-center text-sm text-gray-400 mt-2">
                  {{ quotation.in_words }}
                </div>
              </div>
            </div>

            <!-- Quotation Information -->
            <div class="bg-[#2a4a58] rounded-lg border border-[#315566] p-6">
              <h3 class="font-semibold text-white mb-4">Quotation Information</h3>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-300">Company</span>
                  <span class="text-white">{{ quotation.company }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-300">Currency</span>
                  <span class="text-white">{{ quotation.currency }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-300">Price List</span>
                  <span class="text-white">{{ quotation.selling_price_list }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-300">Created</span>
                  <span class="text-white">{{ formatDateTime(quotation.creation) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-300">Modified</span>
                  <span class="text-white">{{ formatDateTime(quotation.modified) }}</span>
                </div>
                <div v-if="quotation.opportunity" class="flex justify-between">
                  <span class="text-gray-300">Opportunity</span>
                  <span class="text-white">{{ quotation.opportunity }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'QuotationDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    return { route, router }
  },
  data() {
    return {
      quotation: null,
      loading: false,
      error: null
    }
  },
  computed: {
    quotationId() {
      console.log('Route params:', this.route.params)
      console.log('Quotation ID from route:', this.route.params.quoteId)
      return this.route.params.quoteId
    },
    isExpiringSoon() {
      if (!this.quotation?.valid_till) return false
      const validTill = new Date(this.quotation.valid_till)
      const now = new Date()
      const sevenDaysFromNow = new Date(now)
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
      return validTill <= sevenDaysFromNow && validTill >= now
    }
  },
  watch: {
    '$route.params.id': {
      handler(newId, oldId) {
        if (newId !== oldId) {
          this.loadQuotation()
        }
      },
      immediate: true
    }
  },
  async mounted() {
    console.log('Component mounted, quotationId:', this.quotationId)
    await this.loadQuotation()
  },
  methods: {
    goBack() {
      this.router.back()
    },
    
    async loadQuotation() {
      this.loading = true
      this.error = null
      try {
        console.log('Loading quotation with ID:', this.quotationId)
        
        if (!this.quotationId) {
          throw new Error('No quotation ID provided in route')
        }

        // Method 1: Using frappe.client.get
        const response = await fetch('/api/method/frappe.client.get', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': this.getCSRFToken()
          },
          body: JSON.stringify({
            doctype: 'Quotation',
            name: this.quotationId
          })
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        
        if (data.message) {
          this.quotation = data.message
        } else {
          // Try alternative API endpoint
          await this.loadQuotationAlternative()
        }
      } catch (error) {
        console.error('Error loading quotation with primary method:', error)
        // Try alternative method
        await this.loadQuotationAlternative()
      } finally {
        this.loading = false
      }
    },

    async loadQuotationAlternative() {
      try {
        // Method 2: Using direct resource endpoint
        const response = await fetch(`/api/resource/Quotation/${encodeURIComponent(this.quotationId)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': this.getCSRFToken()
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        this.quotation = data.data
      } catch (error) {
        console.error('Error loading quotation with alternative method:', error)
        this.error = `Quotation "${this.quotationId}" not found`
      }
    },

    getCSRFToken() {
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      console.log('CSRF Token:', token ? 'Found' : 'Not found')
      return token
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
    
    formatDate(dateString) {
      if (!dateString) return 'Not set'
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      } catch {
        return 'Invalid date'
      }
    },
    
    formatDateTime(dateTimeString) {
      if (!dateTimeString) return 'Not set'
      try {
        const date = new Date(dateTimeString)
        return date.toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      } catch {
        return 'Invalid date'
      }
    },
    
    formatCurrency(amount) {
      return `$ US ${parseFloat(amount || 0).toFixed(2)}`
    }
  }
}
</script>