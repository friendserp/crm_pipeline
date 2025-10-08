<template>
  <div class="min-h-screen bg-[#233d48] py-6">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8acc33]"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-400 mb-4">
          <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-white mb-2">Failed to load invoice</h3>
        <p class="text-gray-400 mb-4">{{ error }}</p>
        <button
          @click="$router.back()"
          class="px-4 py-2 border border-[#8acc33] text-[#8acc33] bg-[#233d48] hover:bg-[#2a4a58] rounded-md font-medium transition-colors duration-200"
        >
          Back to Invoices
        </button>
      </div>

      <!-- Invoice Content -->
      <div v-else-if="invoice" class="space-y-6">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-2xl font-bold text-white">Invoice for {{ invoice.customer_name }}</h2>
            <p class="text-gray-300">{{ invoice.name }}</p>
          </div>
          <div class="flex space-x-3">
            <button
              @click="$router.back()"
              class="px-4 py-2 border border-[#8acc33] text-[#8acc33] bg-[#233d48] hover:bg-[#2a4a58] rounded-md font-medium transition-colors duration-200"
            >
              Back to Invoices
            </button>
            <button
              @click="deleteInvoice"
              class="px-4 py-2 bg-red-600 text-white rounded-md font-medium transition-colors duration-200 hover:bg-red-700"
            >
              Delete Invoice
            </button>
          </div>
        </div>

        <!-- Invoice Content -->
        <div class="bg-[#233d48] rounded-lg shadow-xl border border-[#2a4a58]">
          <div class="p-6 space-y-6">
            <!-- Invoice Subject -->
            <div>
              <h4 class="text-lg font-medium text-white mb-4">Invoice subject</h4>
              <div class="bg-[#2a4a58] p-4 rounded-lg border border-[#2a4a58]">
                <p class="text-[#8acc33] font-medium">Subject</p>
                <p class="text-gray-300">{{ invoice.title || 'For Services Rendered' }}</p>
              </div>
            </div>

            <!-- Billing Address & Invoice Details -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Billing Address -->
              <div>
                <h4 class="text-lg font-medium text-white mb-4">Billing address</h4>
                <div class="bg-[#2a4a58] p-4 rounded-lg border border-[#2a4a58]">
                  <p class="text-gray-300">{{ getBillingAddress() }}</p>
                  <p class="text-[#8acc33] font-medium mt-2">Property Address</p>
                  <p class="text-gray-300">(Same as billing address)</p>
                  <p class="text-[#8acc33] font-medium mt-2">Contact details</p>
                  <p class="text-gray-300 whitespace-pre-line">{{ getContactDetails() }}</p>
                </div>
              </div>

              <!-- Invoice Details -->
              <div>
                <h4 class="text-lg font-medium text-white mb-4">Invoice details</h4>
                <div class="bg-[#2a4a58] p-4 rounded-lg border border-[#2a4a58] space-y-4">
                  <div>
                    <p class="text-gray-300">Issued date:</p>
                    <p class="text-white">{{ formatDate(invoice.posting_date) || 'Date Sent' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-300">Payment due:</p>
                    <p class="text-white">{{ getPaymentTerms() }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Product/Service Table -->
            <div>
              <h4 class="text-lg font-medium text-white mb-4">Product / Service</h4>
              <div class="bg-[#2a4a58] rounded-lg border border-[#2a4a58] overflow-hidden">
                <table class="w-full">
                  <thead>
                    <tr class="border-b border-[#233d48]">
                      <th class="text-left py-3 px-4 text-gray-300 font-medium">Item Code</th>
                      <th class="text-left py-3 px-4 text-gray-300 font-medium">Item Name</th>
                      <th class="text-left py-3 px-4 text-gray-300 font-medium">Description</th>
                      <th class="text-left py-3 px-4 text-gray-300 font-medium">Qty</th>
                      <th class="text-left py-3 px-4 text-gray-300 font-medium">UOM</th>
                      <th class="text-left py-3 px-4 text-gray-300 font-medium">Rate</th>
                      <th class="text-left py-3 px-4 text-gray-300 font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in invoice.items" :key="item.name" class="border-b border-[#233d48] hover:bg-[#233d48] transition-colors duration-150">
                      <td class="py-3 px-4 text-white">{{ item.item_code }}</td>
                      <td class="py-3 px-4 text-white">{{ item.item_name }}</td>
                      <td class="py-3 px-4 text-gray-300">{{ item.description || '-' }}</td>
                      <td class="py-3 px-4 text-white text-center">{{ formatNumber(item.qty) }}</td>
                      <td class="py-3 px-4 text-gray-300 text-center">{{ item.uom || item.stock_uom || 'Nos' }}</td>
                      <td class="py-3 px-4 text-white text-right">{{ formatCurrency(item.rate) }}</td>
                      <td class="py-3 px-4 text-white text-right">{{ formatCurrency(item.amount) }}</td>
                    </tr>
                    <tr v-if="!invoice.items || invoice.items.length === 0">
                      <td colspan="7" class="py-4 px-4 text-center text-gray-400">
                        No items added
                      </td>
                    </tr>
                  </tbody>
                  <tfoot v-if="invoice.items && invoice.items.length > 0">
                    <tr class="border-t border-[#233d48] bg-[#233d48]">
                      <td colspan="5" class="py-3 px-4 text-right text-gray-300 font-medium">Total:</td>
                      <td class="py-3 px-4 text-right text-white font-medium">{{ formatCurrency(invoice.net_total) }}</td>
                      <td class="py-3 px-4 text-right text-white font-medium">{{ formatCurrency(invoice.grand_total) }}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Totals Section -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div class="flex items-center">
                  <input type="checkbox" class="mr-2">
                  <span class="text-gray-300 text-sm">Client view Change</span>
                </div>
              </div>
              <div class="bg-[#2a4a58] p-4 rounded-lg border border-[#2a4a58] space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-300">Subtotal</span>
                  <span class="text-white">{{ formatCurrency(invoice.net_total) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-300">Discount</span>
                  <span class="text-white">{{ formatCurrency(invoice.discount_amount) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-300">Tax</span>
                  <span class="text-white">{{ formatCurrency(invoice.total_taxes_and_charges) }}</span>
                </div>
                <div class="flex justify-between border-t border-[#233d48] pt-3">
                  <span class="text-white font-medium">Total</span>
                  <span class="text-white font-medium">{{ formatCurrency(invoice.grand_total) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-300">Outstanding Amount</span>
                  <span class="text-white">{{ formatCurrency(invoice.outstanding_amount) }}</span>
                </div>
              </div>
            </div>

            <!-- Additional Information -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 class="text-lg font-medium text-white mb-4">Payment Schedule</h4>
                <div class="bg-[#2a4a58] p-4 rounded-lg border border-[#2a4a58]">
                  <div v-for="payment in invoice.payment_schedule" :key="payment.name" class="border-b border-[#233d48] last:border-b-0 pb-2 mb-2 last:pb-0 last:mb-0">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-300">Due Date:</span>
                      <span class="text-white">{{ formatDate(payment.due_date) }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-300">Amount:</span>
                      <span class="text-white">{{ formatCurrency(payment.payment_amount) }}</span>
                    </div>
                  </div>
                  <div v-if="!invoice.payment_schedule || invoice.payment_schedule.length === 0" class="text-gray-400 text-sm">
                    No payment schedule defined
                  </div>
                </div>
              </div>
              <div>
                <h4 class="text-lg font-medium text-white mb-4">Status Information</h4>
                <div class="bg-[#2a4a58] p-4 rounded-lg border border-[#2a4a58] space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-300">Status:</span>
                    <span :class="statusBadgeClasses(invoice.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {{ invoice.status }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-300">Company:</span>
                    <span class="text-white">{{ invoice.company }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-300">Currency:</span>
                    <span class="text-white">{{ invoice.currency }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-300">Last Modified:</span>
                    <span class="text-white">{{ formatDateTime(invoice.modified) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Edit Invoice Modal -->
        <div 
          v-if="showEditModal" 
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          @click="showEditModal = false"
        >
          <div 
            class="bg-[#233d48] rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[#2a4a58]"
            @click.stop
          >
            <!-- Edit Form would go here -->
            <div class="p-6">
              <h3 class="text-xl font-semibold text-white mb-4">Edit Invoice</h3>
              <p class="text-gray-300">Edit functionality would be implemented here...</p>
              <div class="flex justify-end space-x-3 mt-6">
                <button
                  @click="showEditModal = false"
                  class="px-6 py-2 border border-[#8acc33] text-[#8acc33] bg-[#233d48] hover:bg-[#2a4a58] rounded-md font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  @click="saveEdit"
                  class="px-6 py-2 bg-[#8acc33] text-white rounded-md font-medium transition-colors duration-200"
                >
                  Save Changes
                </button>
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
  name: 'Invoice',
  setup() {
    const route = useRoute()
    const router = useRouter()
    return { route, router }
  },
  data() {
    return {
      invoice: null,
      showEditModal: false,
      loading: true,
      error: null
    }
  },
  async mounted() {
    await this.fetchInvoice()
  },
  methods: {
    async fetchInvoice() {
      this.loading = true
      this.error = null
      try {
        const invoiceName = this.route.params.invoiceId
        console.log('Route params:', this.route.params)
        console.log('Fetching invoice:', invoiceName)
        
        // Use frappe.client.get_value to get invoice details
        const response = await fetch('/api/method/frappe.client.get', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': await this.getCSRFToken()
          },
          body: JSON.stringify({
            doctype: 'Sales Invoice',
            name: invoiceName
          })
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.message) {
            this.invoice = result.message
          } else {
            this.error = 'Invoice not found'
          }
        } else {
          const errorData = await response.json()
          this.error = errorData.message || 'Failed to fetch invoice details'
        }
      } catch (error) {
        console.error('Error fetching invoice:', error)
        this.error = 'Network error while fetching invoice'
      } finally {
        this.loading = false
      }
    },
    
    editInvoice() {
      this.showEditModal = true
    },
    
    saveEdit() {
      // Implement edit functionality
      this.showEditModal = false
      alert('Invoice updated successfully!')
    },
    
    async deleteInvoice() {
      if (!confirm(`Are you sure you want to delete the invoice "${this.invoice.name}"?`)) return

      try {
        const response = await fetch('/api/method/frappe.client.delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': await this.getCSRFToken()
          },
          body: JSON.stringify({
            doctype: 'Sales Invoice',
            name: this.invoice.name
          })
        })
        
        if (response.ok) {
          this.router.push('/invoices')
        } else {
          const errorData = await response.json()
          console.error('Failed to delete invoice:', errorData)
          alert('Failed to delete invoice. Please try again.')
        }
      } catch (error) {
        console.error('Error deleting invoice:', error)
        alert('Error deleting invoice. Please try again.')
      }
    },
    
    getBillingAddress() {
      return this.invoice.address_display || 'Address not available'
    },
    
    getContactDetails() {
      return this.invoice.contact_display || 'Contact details not available'
    },
    
    getPaymentTerms() {
      return this.invoice.payment_terms_template || 'Net 30'
    },
    
    formatDate(dateString) {
      if (!dateString) return 'Not set'
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      } catch (error) {
        return 'Invalid date'
      }
    },
    
    formatDateTime(dateTimeString) {
      if (!dateTimeString) return 'Not set'
      try {
        const date = new Date(dateTimeString)
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      } catch (error) {
        return 'Invalid date'
      }
    },
    
    formatNumber(number) {
      if (!number && number !== 0) return '0'
      try {
        return parseFloat(number).toLocaleString('en-US')
      } catch (error) {
        return '0'
      }
    },
    
    formatCurrency(amount) {
      if (!amount && amount !== 0) return 'ETB 0.00'
      try {
        return `ETB ${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      } catch (error) {
        return 'ETB 0.00'
      }
    },
    
    statusBadgeClasses(status) {
      const statusClasses = {
        'Draft': 'bg-gray-100 text-gray-800',
        'Unpaid': 'bg-yellow-100 text-yellow-800',
        'Paid': 'bg-green-100 text-green-800',
        'Return': 'bg-purple-100 text-purple-800',
        'Overdue': 'bg-red-100 text-red-800',
        'Cancelled': 'bg-gray-100 text-gray-800'
      }
      return statusClasses[status] || 'bg-gray-100 text-gray-800'
    },
    
    async getCSRFToken() {
      try {
        const response = await fetch('/api/method/frappe.csrf_token.get_csrf_token')
        const data = await response.json()
        return data.message.csrf_token
      } catch (error) {
        console.error('Error getting CSRF token:', error)
        return ''
      }
    }
  }
}
</script>