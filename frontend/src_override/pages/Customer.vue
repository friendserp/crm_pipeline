<template>
  <div class="min-h-screen bg-[#233d48] py-6 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-white">{{ customer.customer_name }}</h1>
          <p class="text-gray-300">Client Details</p>
        </div>
        <div class="flex space-x-3">
          <button
            @click="$router.back()"
            class="px-4 py-2 border border-[#8acc33] text-[#8acc33] bg-[#233d48] hover:bg-[#2a4a58] rounded-md font-medium transition-colors duration-200"
          >
            Back to Clients
          </button>
          <!-- <button
            @click="deleteCustomer"
            class="px-4 py-2 bg-red-600 text-white rounded-md font-medium transition-colors duration-200 hover:bg-red-700"
          >
            Delete Client
          </button> -->
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8acc33]"></div>
      </div>

      <!-- Customer Details -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Properties Card -->
          <div class="bg-[#2a4a58] rounded-lg shadow-xl border border-[#2a4a58] overflow-hidden">
            <div class="p-4 border-b border-[#233d48] bg-[#233d48]">
              <h3 class="text-lg font-semibold text-white">Properties</h3>
            </div>
            <div class="p-4">
              <div class="space-y-3">
                <div>
                  <h4 class="text-[#8acc33] font-medium">Megengaya</h4>
                  <p class="text-gray-300">{{ customer.customer_primary_address || 'Addis Ababa' }}</p>
                  <p class="text-gray-300">{{ customer.territory || 'Oromba' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Contacts Card -->
          <div class="bg-[#2a4a58] rounded-lg shadow-xl border border-[#2a4a58] overflow-hidden">
            <div class="p-4 border-b border-[#233d48] bg-[#233d48]">
              <h3 class="text-lg font-semibold text-white">Contacts</h3>
            </div>
            <div class="p-4">
              <div class="space-y-4">
                <div>
                  <p class="text-gray-300">Name: <span class="text-white">{{ customer.customer_name }}</span></p>
                  <p class="text-gray-300">Role: <span class="text-white">{{ customer.customer_type }}</span></p>
                  <p class="text-gray-300">Phone: <span class="text-white">{{ customer.mobile_no || 'N/A' }}</span></p>
                  <p class="text-gray-300">Email: <span class="text-white">{{ customer.email_id || 'N/A' }}</span></p>
                </div>
              </div>
            </div>
          </div>

          <!-- Jobs Card -->
          <div class="bg-[#2a4a58] rounded-lg shadow-xl border border-[#2a4a58] overflow-hidden">
            <div class="p-4 border-b border-[#233d48] bg-[#233d48]">
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-semibold text-white">Jobs</h3>
                <span class="bg-[#8acc33] text-white px-2 py-1 rounded text-sm">
                  {{ filteredTasks.length }} jobs
                </span>
              </div>
            </div>
            <div class="p-4">
              <div v-if="filteredTasks.length === 0" class="text-center py-4">
                <p class="text-gray-300">No jobs found for this customer</p>
              </div>
              <div v-else class="space-y-4">
                <div 
                  v-for="task in filteredTasks" 
                  :key="task.name"
                  class="border border-[#233d48] rounded-lg p-4 hover:border-[#8acc33] transition-colors duration-200"
                >
                  <div class="flex justify-between items-start mb-2">
                    <h4 class="text-white font-medium">{{ task.subject }}</h4>
                    <span 
                      class="px-2 py-1 rounded text-xs"
                      :class="getStatusClass(task.status)"
                    >
                      {{ task.status }}
                    </span>
                  </div>
                  <p class="text-gray-300 text-sm mb-2" v-html="task.description"></p>
                  <div class="grid grid-cols-2 gap-2 text-sm">
                    <div class="text-gray-300">
                      <span class="text-[#8acc33]">Type:</span> {{ task.type }}
                    </div>
                    <div class="text-gray-300">
                      <span class="text-[#8acc33]">Priority:</span> {{ task.priority }}
                    </div>
                    <div class="text-gray-300">
                      <span class="text-[#8acc33]">Start:</span> {{ formatDate(task.exp_start_date) }}
                    </div>
                    <div class="text-gray-300">
                      <span class="text-[#8acc33]">End:</span> {{ formatDate(task.exp_end_date) }}
                    </div>
                  </div>
                  <div class="mt-3 pt-3 border-t border-[#233d48]">
                    <div class="flex justify-between items-center text-sm">
                      <span class="text-gray-300">Progress: {{ task.progress }}%</span>
                      <span class="text-gray-300">Expected Time: {{ task.expected_time }}h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>

        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Schedule Card -->
          <div class="bg-[#2a4a58] rounded-lg shadow-xl border border-[#2a4a58] overflow-hidden">
            <div class="p-4 border-b border-[#233d48] bg-[#233d48]">
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-semibold text-white">Schedule</h3>
                <span class="bg-[#8acc33] text-white px-2 py-1 rounded text-sm">
                  {{ filteredAppointments.length }} appointments
                </span>
              </div>
            </div>
            <div class="p-4">
              <div v-if="filteredAppointments.length === 0" class="text-center py-4">
                <p class="text-gray-300">No appointments scheduled</p>
              </div>
              <div v-else class="space-y-4">
                <div 
                  v-for="appointment in filteredAppointments" 
                  :key="appointment.name"
                  class="border border-[#233d48] rounded-lg p-4 hover:border-[#8acc33] transition-colors duration-200"
                >
                  <div class="flex justify-between items-start mb-2">
                    <h4 class="text-white font-medium">Appointment with {{ appointment.appointment_with }}</h4>
                    <span 
                      class="px-2 py-1 rounded text-xs"
                      :class="getAppointmentStatusClass(appointment.status)"
                    >
                      {{ appointment.status }}
                    </span>
                  </div>
                  <p class="text-gray-300 text-sm mb-3">{{ appointment.customer_details }}</p>
                  
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-300">Scheduled Time:</span>
                      <span class="text-white">{{ formatDateTime(appointment.scheduled_time) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-300">End Time:</span>
                      <span class="text-white">{{ formatDateTime(appointment.custom_scheduled_end_time) }}</span>
                    </div>
                  </div>
                  
                  <div class="mt-3 pt-3 border-t border-[#233d48]">
                    <div class="flex justify-between items-center text-sm">
                      <span class="text-gray-300">Phone: {{ appointment.customer_phone_number }}</span>
                      <span class="text-gray-300">Email: {{ appointment.customer_email }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Billing History Card -->
          <div class="bg-[#2a4a58] rounded-lg shadow-xl border border-[#2a4a58] overflow-hidden">
            <div class="p-4 border-b border-[#233d48] bg-[#233d48]">
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-semibold text-white">Billing History</h3>
                <span class="bg-[#8acc33] text-white px-2 py-1 rounded text-sm">
                  {{ salesInvoices.length }} invoices
                </span>
              </div>
            </div>
            <div class="p-4">
              <div v-if="salesInvoices.length === 0" class="text-center py-4">
                <p class="text-gray-300">No billing history</p>
                <p class="text-gray-300 text-sm">This client hasn't been billed yet</p>
              </div>
              <div v-else class="space-y-4">
                <div 
                  v-for="invoice in salesInvoices" 
                  :key="invoice.name"
                  class="border border-[#233d48] rounded-lg p-4 hover:border-[#8acc33] transition-colors duration-200"
                >
                  <div class="flex justify-between items-start mb-3">
                    <div>
                      <h4 class="text-white font-medium">{{ invoice.name }}</h4>
                      <p class="text-gray-300 text-sm">{{ formatDate(invoice.posting_date) }}</p>
                    </div>
                    <span 
                      class="px-2 py-1 rounded text-xs"
                      :class="getInvoiceStatusClass(invoice.status)"
                    >
                      {{ invoice.status }}
                    </span>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <p class="text-gray-300">Due Date</p>
                      <p class="text-white">{{ formatDate(invoice.due_date) }}</p>
                    </div>
                    <div>
                      <p class="text-gray-300">Grand Total</p>
                      <p class="text-white font-medium">{{ formatCurrency(invoice.grand_total, invoice.currency) }}</p>
                    </div>
                  </div>
                  
                  <div class="flex justify-between items-center text-sm pt-3 border-t border-[#233d48]">
                    <span class="text-gray-300">
                      Outstanding: {{ formatCurrency(invoice.outstanding_amount, invoice.currency) }}
                    </span>
                    <button 
                      @click="viewInvoice(invoice.name)"
                      class="text-[#8acc33] hover:text-green-300 transition-colors duration-200"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Current Balance Card -->
          <div class="bg-[#2a4a58] rounded-lg shadow-xl border border-[#2a4a58] overflow-hidden">
            <div class="p-4 border-b border-[#233d48] bg-[#233d48]">
              <h3 class="text-lg font-semibold text-white">Current Balance</h3>
            </div>
            <div class="p-4">
              <p class="text-2xl font-bold text-white mb-2">
                {{ formatCurrency(totalOutstanding, defaultCurrency) }}
              </p>
              <p class="text-gray-300 text-sm">Total Outstanding Amount</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const customer = ref({})
const loading = ref(false)
const internalNotes = ref('')
const tasks = ref([])
const appointments = ref([])
const salesInvoices = ref([])
const defaultCurrency = ref('USD') // Default currency, you can change this

// Computed properties for filtered data
const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    return task.customer_name === customer.value.customer_name || 
           task.subject?.includes(customer.value.customer_name);
  });
});

const filteredAppointments = computed(() => {
  return appointments.value.filter(appointment => {
    return appointment.customer_name === customer.value.customer_name;
  });
});

// Computed property for total outstanding amount
const totalOutstanding = computed(() => {
  return salesInvoices.value.reduce((total, invoice) => {
    return total + (parseFloat(invoice.outstanding_amount) || 0);
  }, 0);
});

// Fetch customer details
const fetchCustomer = async () => {
  loading.value = true
  try {
    const customerName = route.params.customerId
    
    // Try to fetch from API first
    const response = await fetch(`/api/resource/Customer/${customerName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Frappe-CSRF-Token': await getCSRFToken()
      }
    })

    if (response.ok) {
      const data = await response.json()
      customer.value = data.data
      
      // Fetch associated data
      await Promise.all([
        fetchCustomerAddress(customerName),
        fetchCustomerTasks(customerName),
        fetchCustomerAppointments(customerName),
        fetchSalesInvoices(customerName)
      ])
    } else {
      console.error('Failed to fetch customer details')

    }
  } catch (error) {
    console.error('Error fetching customer:', error)

  } finally {
    loading.value = false
  }
}

// Fetch sales invoices for customer
const fetchSalesInvoices = async (customerName) => {
  try {
    const response = await fetch('/api/method/frappe.client.get_list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Frappe-CSRF-Token': await getCSRFToken()
      },
      body: JSON.stringify({
        doctype: 'Sales Invoice',
        filters: [
          ['customer', '=', customerName]
        ],
        fields: [
          'name',
          'posting_date',
          'due_date',
          'grand_total',
          'outstanding_amount',
          'status',
          'currency',
          'company'
        ],
        order_by: 'posting_date desc',
        limit: 20
      })
    })

    if (response.ok) {
      const data = await response.json()
      salesInvoices.value = data.message || []
    } else {
      console.error('Failed to fetch sales invoices')
    }
  } catch (error) {
    console.error('Error fetching sales invoices:', error)
  }
}

// Fetch tasks for customer
const fetchCustomerTasks = async (customerName) => {
  try {
    const response = await fetch('/api/method/frappe.client.get_list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Frappe-CSRF-Token': await getCSRFToken()
      },
      body: JSON.stringify({
        doctype: 'Task',
        filters: [
          ['customer', '=', customerName]
        ],
        fields: ['*'],
        limit: 50
      })
    })

    if (response.ok) {
      const data = await response.json()
      tasks.value = data.message || []
    } else {
      console.error('Failed to fetch tasks')
    }
  } catch (error) {
    console.error('Error fetching tasks:', error)
  }
}

// Fetch appointments for customer
const fetchCustomerAppointments = async (customerName) => {
  try {
    const response = await fetch('/api/method/frappe.client.get_list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Frappe-CSRF-Token': await getCSRFToken()
      },
      body: JSON.stringify({
        doctype: 'Appointment',
        filters: [
          ['customer_name', '=', customerName]
        ],
        fields: ['*'],
        limit: 50
      })
    })

    if (response.ok) {
      const data = await response.json()
      appointments.value = data.message || []
    } else {
      console.error('Failed to fetch appointments')
    }
  } catch (error) {
    console.error('Error fetching appointments:', error)
  }
}



// Fetch customer address
const fetchCustomerAddress = async (customerName) => {
  try {
    const addressResponse = await fetch('/api/method/frappe.client.get_list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Frappe-CSRF-Token': await getCSRFToken()
      },
      body: JSON.stringify({
        doctype: 'Address',
        filters: { 'links.link_name': customerName },
        fields: ['name', 'address_line1', 'address_line2', 'city', 'state', 'country', 'pincode', 'phone', 'email_id'],
        limit: 1
      })
    })

    if (addressResponse.ok) {
      const addressDataList = await addressResponse.json()
      if (addressDataList.message && addressDataList.message.length > 0) {
        const address = addressDataList.message[0]
        // Update form if needed
      }
    }
  } catch (error) {
    console.error('Error fetching address:', error)
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

// Helper functions
const getStatusClass = (status) => {
  const statusClasses = {
    'Open': 'bg-blue-500 text-white',
    'Working': 'bg-yellow-500 text-white',
    'Completed': 'bg-green-500 text-white',
    'Cancelled': 'bg-red-500 text-white',
    'Overdue': 'bg-orange-500 text-white'
  }
  return statusClasses[status] || 'bg-gray-500 text-white'
}

const getAppointmentStatusClass = (status) => {
  const statusClasses = {
    'Scheduled': 'bg-blue-500 text-white',
    'Confirmed': 'bg-green-500 text-white',
    'Cancelled': 'bg-red-500 text-white',
    'Unverified': 'bg-yellow-500 text-white',
    'Completed': 'bg-purple-500 text-white'
  }
  return statusClasses[status] || 'bg-gray-500 text-white'
}

const getInvoiceStatusClass = (status) => {
  const statusClasses = {
    'Draft': 'bg-gray-500 text-white',
    'Submitted': 'bg-blue-500 text-white',
    'Paid': 'bg-green-500 text-white',
    'Partly Paid': 'bg-yellow-500 text-white',
    'Unpaid': 'bg-orange-500 text-white',
    'Overdue': 'bg-red-500 text-white',
    'Cancelled': 'bg-red-500 text-white'
  }
  return statusClasses[status] || 'bg-gray-500 text-white'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'N/A'
  return new Date(dateTimeString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return 'N/A'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount)
}

const viewInvoice = (invoiceName) => {
  // Open invoice in new tab or show details
  window.open(`/app/sales-invoice/${invoiceName}`, '_blank')
}

// Delete customer
const deleteCustomer = async () => {
  if (!confirm('Are you sure you want to delete this customer? This action cannot be undone.')) return

  try {
    const response = await fetch('/api/method/frappe.client.delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Frappe-CSRF-Token': await getCSRFToken()
      },
      body: JSON.stringify({
        doctype: 'Customer',
        name: customer.value.name
      })
    })

    if (response.ok) {
      alert('Customer deleted successfully!')
      router.push('/customers')
    } else {
      console.error('Failed to delete customer')
      alert('Failed to delete customer. Please try again.')
    }
  } catch (error) {
    console.error('Error deleting customer:', error)
    alert('Error deleting customer. Please try again.')
  }
}


onMounted(() => {
  fetchCustomer()
})
</script>