<template>
  <div class="min-h-screen bg-[#233d48] py-6 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-white">Clients</h1>
          <p class="text-gray-300">Manage your clients database</p>
        </div>
        <button
          @click="showAddCustomer = true"
          class="px-4 py-2 bg-[#8acc33] hover:bg-[#7bb82d] text-white rounded-md font-medium transition-colors duration-200 flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add Client
        </button>
      </div>

      <!-- Search and Filter Bar -->
      <div class="bg-[#2a4a58] rounded-lg p-4 mb-6 border border-[#2a4a58]">
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search clients by name, email, or phone..."
                class="w-full pl-10 pr-4 py-2 border border-[#2a4a58] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white placeholder-gray-400"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <!-- Filters -->
          <div class="flex flex-wrap gap-4">
            <select
              v-model="filters.status"
              class="px-3 py-2 border border-[#2a4a58] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
            
            <select
              v-model="filters.type"
              class="px-3 py-2 border border-[#2a4a58] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white text-sm"
            >
              <option value="all">All Types</option>
              <option value="Individual">Individual</option>
              <option value="Company">Company</option>
            </select>
            
            <select
              v-model="filters.group"
              class="px-3 py-2 border border-[#2a4a58] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white text-sm"
            >
              <option value="all">All Groups</option>
              <option v-for="group in customerGroups" :key="group" :value="group">{{ group }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-[#2a4a58] rounded-lg p-4 border border-[#2a4a58]">
          <div class="text-sm text-gray-300">Total Clients</div>
          <div class="text-2xl font-bold text-white">{{ filteredCustomers.length }}</div>
        </div>
        <div class="bg-[#2a4a58] rounded-lg p-4 border border-[#2a4a58]">
          <div class="text-sm text-gray-300">Active</div>
          <div class="text-2xl font-bold text-green-400">{{ activeCustomersCount }}</div>
        </div>
        <div class="bg-[#2a4a58] rounded-lg p-4 border border-[#2a4a58]">
          <div class="text-sm text-gray-300">Companies</div>
          <div class="text-2xl font-bold text-blue-400">{{ companyCustomersCount }}</div>
        </div>
        <div class="bg-[#2a4a58] rounded-lg p-4 border border-[#2a4a58]">
          <div class="text-sm text-gray-300">Individuals</div>
          <div class="text-2xl font-bold text-purple-400">{{ individualCustomersCount }}</div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8acc33]"></div>
      </div>

      <!-- Customers Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="customer in filteredCustomers"
          :key="customer.name"
          @click="viewCustomer(customer)"
          class="bg-[#2a4a58] rounded-lg border border-[#2a4a58] p-6 hover:border-[#8acc33] hover:shadow-lg transition-all duration-200 cursor-pointer group"
        >
          <!-- Customer Header -->
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-[#8acc33] rounded-full flex items-center justify-center text-white font-bold text-lg">
                {{ getInitials(customer.customer_name) }}
              </div>
              <div>
                <h3 class="text-white font-semibold text-lg group-hover:text-[#8acc33] transition-colors">
                  {{ customer.customer_name || 'Unnamed Client' }}
                </h3>
                <p class="text-gray-400 text-sm">{{ customer.customer_type || 'N/A' }}</p>
              </div>
            </div>
            <span
              :class="customer.disabled ? 'bg-red-500' : 'bg-[#8acc33]'"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
            >
              {{ customer.disabled ? 'Disabled' : 'Active' }}
            </span>
          </div>

          <!-- Customer Details -->
          <div class="space-y-3">
            <div class="flex items-center text-sm text-gray-300">
              <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              {{ customer.email_id || 'No email' }}
            </div>
            
            <div class="flex items-center text-sm text-gray-300" v-if="customer.mobile_no">
              <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              {{ customer.mobile_no }}
            </div>

            <div class="flex items-center text-sm text-gray-300">
              <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              {{ customer.customer_group || 'No group' }}
            </div>

            <div class="flex items-center text-sm text-gray-300">
              <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Updated {{ formatRelativeTime(customer.modified) }}
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-between items-center pt-4 mt-4 border-t border-[#233d48]">
            <button
              @click.stop="viewCustomer(customer)"
              class="text-[#8acc33] hover:text-green-300 text-sm font-medium transition-colors"
            >
              View Details
            </button>
            <button
              @click.stop="editCustomer(customer)"
              class="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredCustomers.length === 0" class="text-center py-12">
        <div class="bg-[#2a4a58] rounded-lg p-8 border border-[#2a4a58]">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <h3 class="text-lg font-medium text-white mb-2">No clients found</h3>
          <p class="text-gray-400 mb-4">Get started by adding your first client</p>
          <button
            @click="showAddCustomer = true"
            class="px-4 py-2 bg-[#8acc33] hover:bg-[#7bb82d] text-white rounded-md font-medium transition-colors"
          >
            Add Your First Client
          </button>
        </div>
      </div>

      <!-- Add Customer Modal -->
      <div
        v-if="showAddCustomer"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click="cancelEdit"
      >
        <div
          class="bg-[#233d48] rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#2a4a58]"
          @click.stop
        >
          <div class="p-6 border-b border-[#2a4a58] bg-[#2a4a58]">
            <h3 class="text-xl font-semibold text-white">
              Add New Customer
            </h3>
          </div>

          <form @submit.prevent="saveCustomer" class="p-6 space-y-6">
            <!-- Primary Contact Details -->
            <div>
              <h4 class="text-lg font-medium text-gray-300 mb-4">Primary Contact Details</h4>
              <p class="text-sm text-gray-400 mb-4">Provide the main point of contact to ensure smooth communication and reliable client records.</p>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <select
                    v-model="customerForm.salutation"
                    class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                  >
                    <option value="">No title</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                    <option value="Dr">Dr</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                  <input
                    v-model="customerForm.first_name"
                    type="text"
                    class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                  <input
                    v-model="customerForm.last_name"
                    type="text"
                    class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                  >
                </div>
              </div>
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                <input
                  v-model="customerForm.company_name"
                  type="text"
                  class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                >
              </div>
            </div>

            <!-- Communication -->
            <div class="mt-6">
              <h4 class="text-lg font-medium text-gray-300 mb-4">Communication</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                  <input
                    v-model="customerForm.mobile_no"
                    type="tel"
                    class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    v-model="customerForm.email_id"
                    type="email"
                    class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                  >
                </div>
              </div>
            </div>

            <!-- Customer Type and Group -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Customer Type</label>
                <select
                  v-model="customerForm.customer_type"
                  class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                >
                  <option value="Individual">Individual</option>
                  <option value="Company">Company</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Customer Group</label>
                <select
                  v-model="customerForm.customer_group"
                  class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                >
                  <option value="All Customer Groups">All Customer Groups</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Individual">Individual</option>
                  <option value="Government">Government</option>
                </select>
              </div>
            </div>

            <!-- Property Address -->
            <div class="mt-6">
              <h4 class="text-lg font-medium text-gray-300 mb-4">Property Address</h4>
              <p class="text-sm text-gray-400 mb-4">Enter the primary service address, billing address, or any additional locations where services may take place.</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Street 1</label>
                  <input
                    v-model="customerForm.address_line1"
                    type="text"
                    class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Street 2</label>
                  <input
                    v-model="customerForm.address_line2"
                    type="text"
                    class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">City</label>
                  <input
                    v-model="customerForm.city"
                    type="text"
                    class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">State/Province</label>
                  <input
                    v-model="customerForm.state"
                    type="text"
                    class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Country</label>
                  <select
                    v-model="customerForm.country"
                    class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                  >
                    <option value="Ethiopia">Ethiopia</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <!-- Add more countries as needed -->
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Postal Code</label>
                  <input
                    v-model="customerForm.pincode"
                    type="text"
                    class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                  >
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-6 border-t border-[#2a4a58]">
              <button
                type="button"
                @click="cancelEdit"
                class="px-6 py-2 border border-[#8acc33] text-[#8acc33] bg-[#233d48] hover:bg-[#2a4a58] rounded-md font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSaving"
                :class="[
                  'px-6 py-2 rounded-md font-medium transition-colors duration-200 flex items-center',
                  isSaving
                    ? 'bg-gray-500 cursor-not-allowed text-white'
                    : 'bg-[#8acc33] hover:bg-[#7bb82d] text-white'
                ]"
              >
                <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSaving ? 'Saving...' : 'Save Customer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const customers = ref([])
const loading = ref(false)
const showAddCustomer = ref(false)
const isSaving = ref(false)
const searchQuery = ref('')

const filters = ref({
  status: 'all',
  type: 'all',
  group: 'all'
})

const customerForm = ref({
  salutation: '',
  first_name: '',
  last_name: '',
  company_name: '',
  mobile_no: '',
  email_id: '',
  customer_type: 'Individual',
  customer_group: 'All Customer Groups',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  country: '',
  pincode: '',
  territory: '',
  disabled: 0
})

// Computed properties
const filteredCustomers = computed(() => {
  return customers.value.filter(customer => {
    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      const matchesSearch = 
        (customer.customer_name && customer.customer_name.toLowerCase().includes(query)) ||
        (customer.email_id && customer.email_id.toLowerCase().includes(query)) ||
        (customer.mobile_no && customer.mobile_no.includes(query))
      if (!matchesSearch) return false
    }

    // Status filter
    if (filters.value.status !== 'all') {
      if (filters.value.status === 'active' && customer.disabled) return false
      if (filters.value.status === 'disabled' && !customer.disabled) return false
    }

    // Type filter
    if (filters.value.type !== 'all' && customer.customer_type !== filters.value.type) {
      return false
    }

    // Group filter
    if (filters.value.group !== 'all' && customer.customer_group !== filters.value.group) {
      return false
    }

    return true
  })
})

const customerGroups = computed(() => {
  const groups = new Set()
  customers.value.forEach(customer => {
    if (customer.customer_group) {
      groups.add(customer.customer_group)
    }
  })
  return Array.from(groups)
})

const activeCustomersCount = computed(() => {
  return customers.value.filter(c => !c.disabled).length
})

const companyCustomersCount = computed(() => {
  return customers.value.filter(c => c.customer_type === 'Company').length
})

const individualCustomersCount = computed(() => {
  return customers.value.filter(c => c.customer_type === 'Individual').length
})

// Fetch customers
const fetchCustomers = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/method/frappe.client.get_list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Frappe-CSRF-Token': await getCSRFToken()
      },
      body: JSON.stringify({
        doctype: 'Customer',
        fields: ['*'],
        limit: 200,
        order_by: 'modified desc'
      })
    })

    if (response.ok) {
      const data = await response.json()
      customers.value = data.message || []
    } else {
      console.error('Failed to fetch customers')
    }
  } catch (error) {
    console.error('Error fetching customers:', error)
  } finally {
    loading.value = false
  }
}

// Get CSRF Token
const getCSRFToken = async () => {
  try {
    const response = await fetch('/api/method/frappe.csrf_token.get_csrf_token')
    const data = await response.json()
    return data.message.csrf_token
  } catch (error) {
    console.error('Error getting CSRF token:', error)
    return ''
  }
}

// Save customer
const saveCustomer = async () => {
  isSaving.value = true
  try {
    // Determine customer name
    let customerName = ''
    if (customerForm.value.customer_type === 'Company' && customerForm.value.company_name) {
      customerName = customerForm.value.company_name
    } else {
      customerName = `${customerForm.value.first_name} ${customerForm.value.last_name}`.trim()
    }

    if (!customerName) {
      alert('Please provide either company name or first and last name')
      return
    }

    // Prepare customer data
    const customerData = {
      doctype: 'Customer',
      customer_name: customerName,
      customer_type: customerForm.value.customer_type,
      customer_group: customerForm.value.customer_group,
      salutation: customerForm.value.salutation,
      email_id: customerForm.value.email_id,
      mobile_no: customerForm.value.mobile_no,
      territory: customerForm.value.territory,
      disabled: customerForm.value.disabled
    }

    // Create customer
    const customerResponse = await fetch('/api/method/frappe.client.insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Frappe-CSRF-Token': await getCSRFToken()
      },
      body: JSON.stringify({
        doc: customerData
      })
    })

    if (!customerResponse.ok) {
      const errorData = await customerResponse.json()
      throw new Error(errorData.message || 'Failed to save customer')
    }

    const customerResult = await customerResponse.json()
    const customerNameId = customerResult.message.name

    // Create address if address data is provided
    if (customerForm.value.address_line1 || customerForm.value.city) {
      const addressData = {
        doctype: 'Address',
        address_title: customerName,
        address_type: 'Billing',
        address_line1: customerForm.value.address_line1,
        address_line2: customerForm.value.address_line2,
        city: customerForm.value.city,
        state: customerForm.value.state,
        country: customerForm.value.country,
        pincode: customerForm.value.pincode,
        is_primary_address: 1,
        links: [{
          link_doctype: 'Customer',
          link_name: customerNameId
        }]
      }

      await fetch('/api/method/frappe.client.insert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': await getCSRFToken()
        },
        body: JSON.stringify({
          doc: addressData
        })
      })
    }

    await fetchCustomers()
    cancelEdit()
    showAlert('Customer created successfully!', 'green')
  } catch (error) {
    console.error('Error saving customer:', error)
    showAlert('Error saving customer: ' + error.message, 'red')
  } finally {
    isSaving.value = false
  }
}

// View customer details
const viewCustomer = (customer) => {
  router.push(`/customers/${customer.name}`)
}

// Edit customer
const editCustomer = (customer) => {
  // Implement edit functionality
  console.log('Edit customer:', customer)
}

// Cancel editing
const cancelEdit = () => {
  showAddCustomer.value = false
  customerForm.value = {
    salutation: '',
    first_name: '',
    last_name: '',
    company_name: '',
    mobile_no: '',
    email_id: '',
    customer_type: 'Individual',
    customer_group: 'All Customer Groups',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    territory: '',
    disabled: 0
  }
}

// Helper functions
const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
}

const formatRelativeTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}

const showAlert = (message, type) => {
  const alertDiv = document.createElement('div')
  alertDiv.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
    type === 'green' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
  }`
  alertDiv.textContent = message
  document.body.appendChild(alertDiv)
  setTimeout(() => document.body.removeChild(alertDiv), 3000)
}

onMounted(() => {
  fetchCustomers()
})
</script>