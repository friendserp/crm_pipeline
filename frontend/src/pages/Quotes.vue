<!-- Quotations.vue -->
<template>
  <div class="w-full min-h-screen bg-[#233d48]">
    <!-- Header -->
    <div class="bg-[#233d48] border-b border-[#2a4a58]">
      <div class="container mx-auto px-6 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-white">Quotations</h1>
          <button 
            @click="createNewQuotation"
            class="bg-[#2E86AB] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#257195] transition-colors"
          >
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

    <!-- Quotation Creation Modal -->
    <div 
      v-if="showCreateModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="closeCreateModal"
    >
      <div 
        class="bg-[#233d48] rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[#2a4a58]"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="p-6 border-b border-[#2a4a58] bg-[#2a4a58]">
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-semibold text-white">
              Create New Quotation
            </h3>
            <button 
              @click="closeCreateModal"
              class="text-gray-400 hover:text-white transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Content -->
        <div class="p-6">
          <!-- Quotation Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- Left Column -->
            <div class="space-y-6">
              <!-- Customer Information -->
              <div class="bg-[#2a4a58] rounded-lg border border-[#2a4a58] p-4">
                <h4 class="text-lg font-semibold text-white mb-4">Customer Information</h4>
                
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Customer *</label>
                    <select 
                      v-model="newQuotation.party_name"
                      class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent bg-[#233d48] text-white"
                      required
                    >
                      <option value="">Select Customer</option>
                      <option 
                        v-for="customer in customers" 
                        :key="customer.name"
                        :value="customer.name"
                      >
                        {{ customer.customer_name }}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Transaction Date *</label>
                    <input 
                      type="date" 
                      v-model="newQuotation.transaction_date"
                      class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent bg-[#233d48] text-white"
                      required
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-6">
              <!-- Currency & Pricing -->
              <div class="bg-[#2a4a58] rounded-lg border border-[#2a4a58] p-4">
                <h4 class="text-lg font-semibold text-white mb-4">Currency & Pricing</h4>
                
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Currency *</label>
                    <select 
                      v-model="newQuotation.currency"
                      @change="handleCurrencyChange"
                      class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent bg-[#233d48] text-white"
                      required
                    >
                      <option value="ETB">ETB - Ethiopian Birr</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                    </select>
                  </div>

                  <!-- Exchange Rate Fields - Show only if currency is not ETB -->
                  <div v-if="newQuotation.currency !== 'ETB'">
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Conversion Rate *</label>
                        <input 
                          type="number" 
                          v-model="newQuotation.conversion_rate"
                          class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent bg-[#233d48] text-white"
                          placeholder="1.0"
                          step="0.0001"
                          required
                        >
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Price List Rate</label>
                        <input 
                          type="number" 
                          v-model="newQuotation.plc_conversion_rate"
                          class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent bg-[#233d48] text-white"
                          placeholder="1.0"
                          step="0.0001"
                        >
                      </div>
                    </div>
                    <p class="text-xs text-gray-400 mt-2">
                      Set exchange rate for {{ newQuotation.currency }} to ETB
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Valid Until *</label>
                    <input 
                      type="date" 
                      v-model="newQuotation.valid_till"
                      class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent bg-[#233d48] text-white"
                      required
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Items Section -->
          <div class="bg-[#2a4a58] rounded-lg border border-[#2a4a58] p-4 mb-6">
            <h4 class="text-lg font-semibold text-white mb-4">Items</h4>
            
            <div class="space-y-4">
              <div 
                v-for="(item, index) in newQuotation.items" 
                :key="index"
                class="border border-[#2a4a58] rounded-md p-4"
              >
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-400 mb-1">Item Code *</label>
                    <select 
                      v-model="item.item_code"
                      @change="updateItemDetails(index)"
                      class="w-full px-2 py-1 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-1 focus:ring-[#2E86AB] focus:border-transparent bg-[#233d48] text-white text-sm"
                      required
                    >
                      <option value="">Select Item</option>
                      <option 
                        v-for="itemOption in items" 
                        :key="itemOption.name"
                        :value="itemOption.item_code"
                      >
                        {{ itemOption.item_name }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-400 mb-1">Quantity *</label>
                    <input 
                      type="number" 
                      v-model="item.qty"
                      @input="calculateItemTotal(index)"
                      class="w-full px-2 py-1 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-1 focus:ring-[#2E86AB] focus:border-transparent bg-[#233d48] text-white text-sm"
                      min="1"
                      required
                    >
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-400 mb-1">Rate *</label>
                    <input 
                      type="number" 
                      v-model="item.rate"
                      @input="calculateItemTotal(index)"
                      class="w-full px-2 py-1 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-1 focus:ring-[#2E86AB] focus:border-transparent bg-[#233d48] text-white text-sm"
                      step="0.01"
                      required
                    >
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-400 mb-1">Amount</label>
                    <div class="w-full px-2 py-1 border border-[#2a4a58] rounded-md bg-[#233d48] text-white text-sm">
                      {{ formatCurrency(item.amount) }}
                    </div>
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <div class="text-sm text-gray-400">
                    {{ item.item_name || 'Select an item' }}
                  </div>
                  <button 
                    @click="removeItem(index)"
                    class="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
              
              <button 
                @click="addItem"
                class="w-full px-3 py-2 border-2 border-dashed border-[#2E86AB] text-[#2E86AB] bg-transparent hover:bg-[#2a4a58] font-medium rounded-md transition-colors duration-200 text-sm"
              >
                + Add Item
              </button>
            </div>
          </div>

          <!-- Totals Section -->
          <div class="bg-[#2a4a58] rounded-lg border border-[#2a4a58] p-4 mb-6">
            <h4 class="text-lg font-semibold text-white mb-4">Total Amount</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label class="block text-sm text-gray-400 mb-1">Total</label>
                <div class="text-xl font-bold text-white">{{ formatCurrency(calculateTotal()) }}</div>
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-1">Currency</label>
                <div class="text-lg text-white">{{ newQuotation.currency }}</div>
              </div>
              <div v-if="newQuotation.currency !== 'ETB'">
                <label class="block text-sm text-gray-400 mb-1">Exchange Rate</label>
                <div class="text-lg text-white">{{ newQuotation.conversion_rate }}</div>
              </div>
              <div v-if="newQuotation.currency !== 'ETB'">
                <label class="block text-sm text-gray-400 mb-1">Total in ETB</label>
                <div class="text-lg text-white">{{ formatCurrency(calculateTotal() * (newQuotation.conversion_rate || 1)) }}</div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-[#2a4a58]">
            <button 
              @click="closeCreateModal"
              class="px-6 py-2 border border-gray-500 text-gray-300 hover:bg-[#2a4a58] font-medium rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button 
              @click="saveQuotation"
              :disabled="isSaving || !isFormValid"
              :class="[
                'px-6 py-2 font-medium rounded-lg transition-colors duration-200',
                isSaving || !isFormValid
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-[#2E86AB] hover:bg-[#257195] text-white'
              ]"
            >
              {{ isSaving ? 'Saving...' : 'Create Quotation' }}
            </button>
          </div>
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
      loading: false,
      
      // New quotation modal data
      showCreateModal: false,
      isSaving: false,
      newQuotation: this.createEmptyQuotation(),
      customers: [],
      items: []
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
    },
    
    isFormValid() {
      const requiredFields = [
        this.newQuotation.party_name,
        this.newQuotation.transaction_date,
        this.newQuotation.valid_till,
        this.newQuotation.currency
      ];
      
      // Check if we have at least one item with required fields
      const hasValidItems = this.newQuotation.items.length > 0 && 
        this.newQuotation.items.every(item => 
          item.item_code && item.qty > 0 && item.rate > 0
        );
      
      // If currency is not ETB, conversion rate is required
      if (this.newQuotation.currency !== 'ETB' && !this.newQuotation.conversion_rate) {
        return false;
      }
      
      return requiredFields.every(field => field && field.toString().trim() !== '') && hasValidItems;
    }
  },
  async mounted() {
    await this.loadQuotations()
    this.calculateOverview()
    await this.loadCustomers()
    await this.loadItems()
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
    createEmptyQuotation() {
      return {
        doctype: 'Quotation',
        party_name: '',
        quotation_to: 'Customer',
        transaction_date: new Date().toISOString().split('T')[0],
        valid_till: this.getDefaultValidTill(),
        currency: 'ETB',
        conversion_rate: 1.0,
        plc_conversion_rate: 1.0,
        items: [this.createEmptyItem()],
        status: 'Draft'
      }
    },
    
    createEmptyItem() {
      return {
        item_code: '',
        item_name: '',
        qty: 1,
        rate: 0.0,
        amount: 0.0
      }
    },
    
    getDefaultValidTill() {
      const date = new Date()
      date.setDate(date.getDate() + 30) // Default to 30 days from now
      return date.toISOString().split('T')[0]
    },
    
    viewQuotation(quotationId) {
      this.router.push(`/quotes/${quotationId}`)
    },
    
    createNewQuotation() {
      this.newQuotation = this.createEmptyQuotation()
      this.showCreateModal = true
    },
    
    closeCreateModal() {
      this.showCreateModal = false
      this.newQuotation = this.createEmptyQuotation()
    },
    
    addItem() {
      this.newQuotation.items.push(this.createEmptyItem())
    },
    
    removeItem(index) {
      if (this.newQuotation.items.length > 1) {
        this.newQuotation.items.splice(index, 1)
      }
    },
    
    async updateItemDetails(index) {
      const item = this.newQuotation.items[index]
      if (item.item_code) {
        const itemData = this.items.find(i => i.item_code === item.item_code)
        if (itemData) {
          item.item_name = itemData.item_name
          item.rate = itemData.standard_rate || 0.0
          this.calculateItemTotal(index)
        }
      }
    },
    
    calculateItemTotal(index) {
      const item = this.newQuotation.items[index]
      item.amount = (item.qty || 0) * (item.rate || 0)
    },
    
    calculateTotal() {
      return this.newQuotation.items.reduce((total, item) => total + (item.amount || 0), 0)
    },
    
    handleCurrencyChange() {
      if (this.newQuotation.currency === 'ETB') {
        this.newQuotation.conversion_rate = 1.0
        this.newQuotation.plc_conversion_rate = 1.0
      } else {
        // Set default exchange rates for other currencies
        this.newQuotation.conversion_rate = this.getDefaultExchangeRate(this.newQuotation.currency)
        this.newQuotation.plc_conversion_rate = this.newQuotation.conversion_rate
      }
    },
    
    getDefaultExchangeRate(currency) {
      const rates = {
        'USD': 55.0,  // Example rate: 1 USD = 55 ETB
        'EUR': 60.0   // Example rate: 1 EUR = 60 ETB
      }
      return rates[currency] || 1.0
    },
    
    async loadCustomers() {
      try {
        const response = await fetch('/api/method/frappe.client.get_list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': this.getCSRFToken()
          },
          body: JSON.stringify({
            doctype: 'Customer',
            fields: ['name', 'customer_name'],
            filters: [['disabled', '=', 0]],
            order_by: 'customer_name',
            limit: 1000
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          this.customers = data.message
        }
      } catch (error) {
        console.error('Error loading customers:', error)
      }
    },
    
    async loadItems() {
      try {
        const response = await fetch('/api/method/frappe.client.get_list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': this.getCSRFToken()
          },
          body: JSON.stringify({
            doctype: 'Item',
            fields: ['name', 'item_code', 'item_name', 'standard_rate'],
            filters: [['disabled', '=', 0]],
            order_by: 'item_name',
            limit: 1000
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          this.items = data.message
        }
      } catch (error) {
        console.error('Error loading items:', error)
      }
    },
    
    async saveQuotation() {
      if (this.isSaving || !this.isFormValid) return
      
      this.isSaving = true
      
      try {
        const quotationData = {
          doctype: 'Quotation',
          ...this.newQuotation,
          // Ensure exchange rates are set properly
          conversion_rate: this.newQuotation.conversion_rate || 1.0,
          plc_conversion_rate: this.newQuotation.plc_conversion_rate || this.newQuotation.conversion_rate || 1.0
        }
        
        const response = await fetch('/api/method/frappe.client.insert', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': this.getCSRFToken()
          },
          body: JSON.stringify({
            doc: quotationData
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          this.showAlert('Quotation created successfully!', 'green')
          this.closeCreateModal()
          await this.loadQuotations() // Refresh the list
        } else {
          const errorData = await response.json()
          throw new Error(errorData._server_messages || 'Failed to create quotation')
        }
      } catch (error) {
        console.error('Error creating quotation:', error)
        this.showAlert('Error creating quotation: ' + error.message, 'red')
      } finally {
        this.isSaving = false
      }
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
              'grand_total', 'currency', 'status', 'items', 'company', 'modified',
              'conversion_rate', 'plc_conversion_rate'
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
    },
    
    showAlert(message, indicator) {
      const alertDiv = document.createElement('div')
      alertDiv.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 ${
        indicator === 'green' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`
      alertDiv.textContent = message
      
      document.body.appendChild(alertDiv)
      
      setTimeout(() => {
        document.body.removeChild(alertDiv)
      }, 3000)
    }
  }
}
</script>