<template>
  <div class="min-h-screen bg-[#233d48] py-6">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-white">Sales Invoices</h2>
        <button 
          @click="showCreateForm = true"
          class="border border-[#8acc33] text-[#8acc33] bg-[#233d48] hover:bg-[#2a4a58] px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <span>+</span>
          <span>Create Invoice</span>
        </button>
      </div>

      <!-- Filters -->
      <div class="mb-6 p-4 bg-[#2a4a58] rounded-lg border border-[#2a4a58]">
        <div class="flex flex-wrap gap-4 items-center">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Status</label>
            <select 
              v-model="filters.status"
              class="px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
            >
              <option value="">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
              <option value="Return">Return</option>
              <option value="Overdue">Overdue</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Customer</label>
            <select 
              v-model="filters.customer"
              class="px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
            >
              <option value="">All Customers</option>
              <option v-for="customer in uniqueCustomers" :key="customer" :value="customer">
                {{ customer }}
              </option>
            </select>
          </div>
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-300 mb-1">Search</label>
            <input 
              type="text" 
              v-model="filters.search"
              placeholder="Search by invoice number, customer, or amount..."
              class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white placeholder-gray-400"
            >
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-[#2a4a58] rounded-lg p-4 border border-[#2a4a58]">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-[#8acc33] rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-[#233d48]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-300">Total Invoices</p>
              <p class="text-2xl font-bold text-white">{{ invoices.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-[#2a4a58] rounded-lg p-4 border border-[#2a4a58]">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-300">Total Amount</p>
              <p class="text-2xl font-bold text-white">{{ formatCurrency(totalAmount) }}</p>
            </div>
          </div>
        </div>
        <div class="bg-[#2a4a58] rounded-lg p-4 border border-[#2a4a58]">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-300">Paid Invoices</p>
              <p class="text-2xl font-bold text-white">{{ paidInvoicesCount }}</p>
            </div>
          </div>
        </div>
        <div class="bg-[#2a4a58] rounded-lg p-4 border border-[#2a4a58]">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-300">Overdue</p>
              <p class="text-2xl font-bold text-white">{{ overdueInvoicesCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Invoices Table -->
      <div class="bg-[#233d48] rounded-lg shadow-sm border border-[#2a4a58] overflow-hidden">
        <div class="px-6 py-4 border-b border-[#2a4a58] bg-[#2a4a58]">
          <h3 class="text-lg font-medium text-white">Sales Invoices</h3>
          <p class="mt-1 text-sm text-gray-300">All sales invoices and billing documents</p>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-[#2a4a58]">
            <thead class="bg-[#2a4a58]">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Invoice
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Due Date
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Outstanding
                </th>
              </tr>
            </thead>
            <tbody class="bg-[#233d48] divide-y divide-[#2a4a58]">
              <tr 
                v-for="invoice in filteredInvoices" 
                :key="invoice.name"
                @click="viewInvoice(invoice)"
                class="hover:bg-[#2a4a58] transition-colors duration-150 cursor-pointer"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 bg-[#8acc33] rounded-full flex items-center justify-center">
                      <span class="text-[#233d48] font-medium text-sm">
                        {{ getInitials(invoice.name) }}
                      </span>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-white">
                        {{ invoice.name }}
                      </div>
                      <div class="text-sm text-gray-400">
                        {{ invoice.title }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-white">{{ invoice.customer }}</div>
                  <div class="text-sm text-gray-400">{{ invoice.customer_name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {{ formatDate(invoice.posting_date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {{ formatCurrency(invoice.grand_total) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="statusBadgeClasses(invoice.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ invoice.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {{ formatDate(invoice.due_date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {{ formatCurrency(invoice.outstanding_amount) }}
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- Empty State -->
          <div 
            v-if="filteredInvoices.length === 0" 
            class="text-center py-12"
          >
            <div class="text-gray-400 mb-4">
              <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-white mb-2">No invoices found</h3>
            <p class="text-gray-400 mb-4">Get started by creating your first invoice</p>
            <button 
              @click="showCreateForm = true"
              class="border border-[#8acc33] text-[#8acc33] bg-[#233d48] hover:bg-[#2a4a58] px-4 py-2 rounded-md font-medium transition-colors duration-200"
            >
              Create New Invoice
            </button>
          </div>
        </div>
      </div>

      <!-- Create Invoice Form -->
      <div 
        v-if="showCreateForm" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click="showCreateForm = false"
      >
        <div 
          class="bg-[#233d48] rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[#2a4a58]"
          @click.stop
        >
          <!-- Header -->
          <div class="p-6 border-b border-[#2a4a58] bg-[#2a4a58]">
            <div class="flex justify-between items-center">
              <h3 class="text-xl font-semibold text-white">Create New Invoice</h3>
              <button
                @click="showCreateForm = false"
                class="px-4 py-2 border border-[#8acc33] text-[#8acc33] bg-[#233d48] hover:bg-[#2a4a58] rounded-md font-medium transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>

          <!-- Create Invoice Form -->
          <form @submit.prevent="createInvoice" class="p-6 space-y-6">
            <!-- Customer Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Select Customer</label>
              <select
                v-model="invoiceForm.customer"
                required
                class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
              >
                <option value="">Select a customer...</option>
                <option v-for="customer in customers" :key="customer.name" :value="customer.name">
                  {{ customer.customer_name }}
                </option>
              </select>
            </div>

            <!-- Invoice Details -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Invoice Date</label>
                <input
                  v-model="invoiceForm.posting_date"
                  type="date"
                  required
                  class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
                <input
                  v-model="invoiceForm.due_date"
                  type="date"
                  required
                  class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                >
              </div>
            </div>

            <!-- Items Section -->
            <div>
              <h4 class="text-lg font-medium text-white mb-4">Items</h4>
              <div class="space-y-4">
                <div 
                  v-for="(item, index) in invoiceForm.items" 
                  :key="index"
                  class="bg-[#2a4a58] p-4 rounded-lg border border-[#2a4a58]"
                >
                  <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div class="md:col-span-2">
                      <label class="block text-sm font-medium text-gray-300 mb-1">Item</label>
                      <select
                        v-model="item.item_code"
                        @change="onItemSelect(index, $event)"
                        required
                        class="w-full px-3 py-2 border border-[#233d48] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#2a4a58] text-white"
                      >
                        <option value="">Select an item...</option>
                        <option v-for="itemOption in items" :key="itemOption.name" :value="itemOption.item_code">
                          {{ itemOption.item_name }} ({{ itemOption.item_code }})
                        </option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-300 mb-1">Quantity</label>
                      <input
                        v-model="item.qty"
                        @input="calculateItemAmount(index)"
                        type="number"
                        min="1"
                        required
                        class="w-full px-3 py-2 border border-[#233d48] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#2a4a58] text-white"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-300 mb-1">Rate</label>
                      <input
                        v-model="item.rate"
                        @input="calculateItemAmount(index)"
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        class="w-full px-3 py-2 border border-[#233d48] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#2a4a58] text-white"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-300 mb-1">Amount</label>
                      <input
                        :value="formatCurrency(item.amount)"
                        type="text"
                        readonly
                        class="w-full px-3 py-2 border border-[#233d48] rounded-md bg-[#2a4a58] text-white cursor-not-allowed"
                      >
                    </div>
                  </div>
                  <div v-if="item.description" class="mt-2">
                    <p class="text-sm text-gray-300">{{ item.description }}</p>
                  </div>
                  <button
                    type="button"
                    @click="removeItem(index)"
                    class="mt-2 text-red-400 hover:text-red-300 text-sm transition-colors duration-200"
                  >
                    Remove Item
                  </button>
                </div>
              </div>
              <button
                type="button"
                @click="addItem"
                class="mt-4 text-[#8acc33] hover:text-green-300 transition-colors duration-200 flex items-center"
              >
                <span>+</span>
                <span class="ml-1">Add Item</span>
              </button>
            </div>

            <!-- Totals Section -->
            <div class="bg-[#2a4a58] p-4 rounded-lg border border-[#2a4a58]">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-300">Subtotal:</span>
                    <span class="text-white font-medium">{{ formatCurrency(calculateSubtotal()) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-300">Tax:</span>
                    <span class="text-white">ETB 0.00</span>
                  </div>
                  <div class="flex justify-between border-t border-[#233d48] pt-2">
                    <span class="text-white font-medium">Total:</span>
                    <span class="text-white font-medium">{{ formatCurrency(calculateSubtotal()) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Submit Buttons -->
            <div class="flex justify-end space-x-3 pt-6 border-t border-[#2a4a58]">
              <button
                type="button"
                @click="showCreateForm = false"
                class="px-6 py-2 border border-[#8acc33] text-[#8acc33] bg-[#233d48] hover:bg-[#2a4a58] rounded-md font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-6 py-2 bg-[#8acc33] text-white rounded-md font-medium transition-colors duration-200"
              >
                Create Invoice
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'Invoices',
  setup() {
    const router = useRouter()
    return { router }
  },
  data() {
    return {
      invoices: [],
      customers: [],
      items: [],
      showCreateForm: false,
      filters: {
        status: '',
        customer: '',
        search: ''
      },
      invoiceForm: {
        customer: '',
        posting_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [
          {
            item_code: '',
            item_name: '',
            description: '',
            qty: 1,
            rate: 0,
            amount: 0
          }
        ]
      }
    }
  },
  computed: {
    filteredInvoices() {
      let filtered = this.invoices;

      // Filter by status
      if (this.filters.status) {
        filtered = filtered.filter(invoice => 
          invoice.status === this.filters.status
        );
      }

      // Filter by customer
      if (this.filters.customer) {
        filtered = filtered.filter(invoice => 
          invoice.customer === this.filters.customer
        );
      }

      // Filter by search
      if (this.filters.search) {
        const searchLower = this.filters.search.toLowerCase();
        filtered = filtered.filter(invoice =>
          invoice.name.toLowerCase().includes(searchLower) ||
          invoice.customer.toLowerCase().includes(searchLower) ||
          invoice.customer_name?.toLowerCase().includes(searchLower) ||
          invoice.grand_total.toString().includes(this.filters.search)
        );
      }

      // Sort by posting date (most recent first)
      return filtered.sort((a, b) => 
        new Date(b.posting_date) - new Date(a.posting_date)
      );
    },
    uniqueCustomers() {
      return [...new Set(this.invoices.map(invoice => invoice.customer))].sort();
    },
    totalAmount() {
      return this.invoices.reduce((sum, invoice) => sum + (invoice.grand_total || 0), 0);
    },
    paidInvoicesCount() {
      return this.invoices.filter(invoice => invoice.status === 'Paid').length;
    },
    overdueInvoicesCount() {
      const today = new Date();
      return this.invoices.filter(invoice => {
        if (invoice.status === 'Unpaid' && invoice.due_date) {
          return new Date(invoice.due_date) < today;
        }
        return false;
      }).length;
    }
  },
  async mounted() {
    await this.fetchInvoices();
    await this.fetchCustomers();
    await this.fetchItems();
  },
  methods: {
    async fetchInvoices() {
      try {
        const response = await fetch('/api/method/frappe.client.get_list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': await this.getCSRFToken()
          },
          body: JSON.stringify({
            doctype: 'Sales Invoice',
            fields: ['*'],
            limit_page_length: 100,
            order_by: 'posting_date desc'
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          this.invoices = result.message || [];
        } else {
          console.error('Failed to fetch invoices');
        }
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    },
    
    async fetchCustomers() {
      try {
        const response = await fetch('/api/method/frappe.client.get_list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': await this.getCSRFToken()
          },
          body: JSON.stringify({
            doctype: 'Customer',
            fields: ['name', 'customer_name'],
            limit_page_length: 1000
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          this.customers = result.message || [];
        } else {
          console.error('Failed to fetch customers');
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    },
    
    async fetchItems() {
      try {
        const response = await fetch('/api/method/frappe.client.get_list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': await this.getCSRFToken()
          },
          body: JSON.stringify({
            doctype: 'Item',
            fields: ['name', 'item_code', 'item_name', 'description', 'standard_rate'],
            limit_page_length: 1000
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          this.items = result.message || [];
        } else {
          console.error('Failed to fetch items');
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    },
    
    viewInvoice(invoice) {
      this.router.push(`/invoices/${invoice.name}`);
    },
    
    addItem() {
      this.invoiceForm.items.push({
        item_code: '',
        item_name: '',
        description: '',
        qty: 1,
        rate: 0,
        amount: 0
      });
    },
    
    removeItem(index) {
      this.invoiceForm.items.splice(index, 1);
    },
    
    onItemSelect(index, event) {
      const selectedItemCode = event.target.value;
      const selectedItem = this.items.find(item => item.item_code === selectedItemCode);
      
      if (selectedItem) {
        this.invoiceForm.items[index].item_code = selectedItem.item_code;
        this.invoiceForm.items[index].item_name = selectedItem.item_name;
        this.invoiceForm.items[index].description = selectedItem.description || '';
        this.invoiceForm.items[index].rate = selectedItem.standard_rate || 0;
        this.calculateItemAmount(index);
      }
    },
    
    calculateItemAmount(index) {
      const item = this.invoiceForm.items[index];
      item.amount = (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0);
    },
    
    calculateSubtotal() {
      return this.invoiceForm.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    },
    
    async createInvoice() {
      try {
        // Prepare items for API
        const items = this.invoiceForm.items.map(item => ({
          item_code: item.item_code,
          item_name: item.item_name,
          description: item.description,
          qty: parseFloat(item.qty) || 0,
          rate: parseFloat(item.rate) || 0,
          amount: parseFloat(item.amount) || 0
        }));
        
        const net_total = this.calculateSubtotal();
        
        const invoiceData = {
          doctype: 'Sales Invoice',
          customer: this.invoiceForm.customer,
          posting_date: this.invoiceForm.posting_date,
          due_date: this.invoiceForm.due_date,
          items: items,
          net_total: net_total,
          grand_total: net_total
        };
        
        const response = await fetch('/api/resource/Sales Invoice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': await this.getCSRFToken()
          },
          body: JSON.stringify(invoiceData)
        });
        
        if (response.ok) {
          const result = await response.json();
          await this.fetchInvoices(); // Refresh the list
          this.showCreateForm = false;
          this.resetForm();
          alert('Invoice created successfully!');
        } else {
          console.error('Failed to create invoice');
          alert('Failed to create invoice. Please try again.');
        }
      } catch (error) {
        console.error('Error creating invoice:', error);
        alert('Error creating invoice. Please try again.');
      }
    },
    
    resetForm() {
      this.invoiceForm = {
        customer: '',
        posting_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [
          {
            item_code: '',
            item_name: '',
            description: '',
            qty: 1,
            rate: 0,
            amount: 0
          }
        ]
      };
    },
    
    getInitials(text) {
      return text.split('-').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    },
    
    statusBadgeClasses(status) {
      const statusClasses = {
        'Draft': 'bg-gray-100 text-gray-800',
        'Unpaid': 'bg-yellow-100 text-yellow-800',
        'Paid': 'bg-green-100 text-green-800',
        'Return': 'bg-purple-100 text-purple-800',
        'Overdue': 'bg-red-100 text-red-800',
        'Cancelled': 'bg-gray-100 text-gray-800'
      };
      return statusClasses[status] || 'bg-gray-100 text-gray-800';
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    
    formatCurrency(amount) {
      if (!amount && amount !== 0) return 'ETB 0.00';
      return `ETB ${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },
    
    async getCSRFToken() {
      try {
        const response = await fetch('/api/method/frappe.csrf_token.get_csrf_token');
        const data = await response.json();
        return data.message.csrf_token;
      } catch (error) {
        console.error('Error getting CSRF token:', error);
        return '';
      }
    }
  }
}
</script>