<template>
  <div class="min-h-screen bg-[#233d48] py-6 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-white">Clients</h1>
          <p class="text-gray-300">Manage your clients database</p>
        </div>
        <button
          @click="showAddCustomer = true"
          class="px-4 py-2 border border-[#8acc33] text-[#8acc33] bg-[#233d48] hover:bg-[#2a4a58] rounded-md font-medium transition-colors duration-200"
        >
          Add Client
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8acc33]"></div>
      </div>

      <!-- Customers Table -->
      <div v-else class="bg-[#2a4a58] rounded-lg shadow-xl border border-[#2a4a58] overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-[#2a4a58] bg-[#233d48]">
                <th class="text-left py-4 px-6 text-gray-300 font-medium">Client Name</th>
                <th class="text-left py-4 px-6 text-gray-300 font-medium">Client Group</th>
                <th class="text-left py-4 px-6 text-gray-300 font-medium">Type</th>
                <th class="text-left py-4 px-6 text-gray-300 font-medium">Status</th>
                <th class="text-left py-4 px-6 text-gray-300 font-medium">Email</th>
                <th class="text-left py-4 px-6 text-gray-300 font-medium">Last Modified</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="customer in customers"
                :key="customer.name"
                @click="viewCustomer(customer)"
                class="border-b border-[#2a4a58] hover:bg-[#233d48] transition-colors duration-200 cursor-pointer"
              >
                <td class="py-4 px-6 text-white font-medium">{{ customer.customer_name || 'N/A' }}</td>
                <td class="py-4 px-6 text-gray-300">{{ customer.customer_group || 'N/A' }}</td>
                <td class="py-4 px-6 text-gray-300">{{ customer.customer_type || 'N/A' }}</td>
                <td class="py-4 px-6">
                  <span
                    :class="customer.disabled ? 'bg-red-500' : 'bg-[#8acc33]'"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                  >
                    {{ customer.disabled ? 'Disabled' : 'Active' }}
                  </span>
                </td>
                <td class="py-4 px-6 text-gray-300">{{ customer.email_id || 'N/A' }}</td>
                <td class="py-4 px-6 text-gray-300">{{ formatDate(customer.modified) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="customers.length === 0" class="text-center py-12">
          <p class="text-gray-400">No customers found</p>
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
                    v-model="customerForm.title"
                    class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                  >
                    <option value="No title">No title</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
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
                    v-model="customerForm.phone_number"
                    type="tel"
                    class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    v-model="customerForm.email"
                    type="email"
                    class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                  >
                </div>
              </div>
            </div>

            <!-- Communication Settings -->
            <div class="mt-6">
              <h4 class="text-lg font-medium text-green-400 mb-4">Communication Settings</h4>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Lead Information</label>
                <input
                  v-model="customerForm.lead_source"
                  type="text"
                  class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                >
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
                    v-model="customerForm.street1"
                    type="text"
                    class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Street 2</label>
                  <input
                    v-model="customerForm.street2"
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
                  <label class="block text-sm font-medium text-gray-300 mb-2">Province</label>
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
              <div class="mt-4 flex items-center">
                <input
                  v-model="customerForm.same_as_property"
                  type="checkbox"
                  class="h-4 w-4 text-[#8acc33] bg-[#233d48] border-[#2a4a58] rounded focus:ring-[#8acc33]"
                >
                <label class="ml-2 text-sm text-green-400">Billing address is the same as property address</label>
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
                class="px-6 py-2 bg-[#8acc33] text-white rounded-md font-medium transition-colors duration-200"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const customers = ref([])
const loading = ref(false)
const showAddCustomer = ref(false)

const customerForm = ref({
  title: 'No title',
  first_name: '',
  last_name: '',
  company_name: '',
  phone_number: '',
  email: '',
  lead_source: '',
  street1: '',
  street2: '',
  city: '',
  state: '',
  country: '',
  pincode: '',
  same_as_property: false,
  customer_name: '',
  customer_group: 'All Customer Groups',
  customer_type: 'Individual',
  tax_id: '',
  territory: '',
  website: '',
  mobile_no: '',
  disabled: 0
})

// Fetch customers using Frappe get_list
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
        limit: 100,
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


// Save customer and address
const saveCustomer = async () => {
  try {
    // Prepare customer data
    const customerData = {
      doctype: 'Customer',
      customer_name: `${customerForm.value.first_name} ${customerForm.value.last_name}` || customerForm.value.company_name || 'Unnamed Customer',
      customer_group: customerForm.value.customer_group,
      customer_type: customerForm.value.customer_type,
      email_id: customerForm.value.email,
      mobile_no: customerForm.value.mobile_no,
      tax_id: customerForm.value.tax_id,
      territory: customerForm.value.country,
      website: customerForm.value.website,
      disabled: customerForm.value.disabled
    }

    const customerResponse = await fetch('/api/resource/Customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Frappe-CSRF-Token': await getCSRFToken()
      },
      body: JSON.stringify(customerData)
    })

    if (!customerResponse.ok) {
      console.error('Failed to save customer')
      alert('Failed to save customer. Please try again.')
      return
    }

    const customerResult = await customerResponse.json()
    const customerName = customerResult.data.name

    // Prepare address data
    const addressData = {
      doctype: 'Address',
      address_title: customerData.customer_name,
      address_type: 'Billing',
      address_line1: customerForm.value.street1,
      address_line2: customerForm.value.street2,
      city: customerForm.value.city,
      state: customerForm.value.state,
      country: customerForm.value.country,
      pincode: customerForm.value.pincode,
      phone: customerForm.value.phone_number,
      email_id: customerForm.value.email,
      links: [
        {
          link_doctype: 'Customer',
          link_name: customerName,
          link_title: customerData.customer_name
        }
      ]
    }

    const addressResponse = await fetch('/api/resource/Address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Frappe-CSRF-Token': await getCSRFToken()
      },
      body: JSON.stringify(addressData)
    })

    if (!addressResponse.ok) {
      console.error('Failed to save address')
      alert('Failed to save address. Please try again.')
      return
    }

    await fetchCustomers()
    cancelEdit()
  } catch (error) {
    console.error('Error saving customer or address:', error)
    alert('Error saving customer or address. Please try again.')
  }
}

// View customer details
const viewCustomer = (customer) => {
  router.push(`/customers/${customer.name}`)
}

// Cancel editing
const cancelEdit = () => {
  showAddCustomer.value = false
  customerForm.value = {
    title: 'No title',
    first_name: '',
    last_name: '',
    company_name: '',
    phone_number: '',
    email: '',
    lead_source: '',
    street1: '',
    street2: '',
    city: '',
    state: '',
    country: 'Ethiopia',
    pincode: '',
    same_as_property: false,
    customer_name: '',
    customer_group: 'Demo Customer Group',
    customer_type: 'Individual',
    tax_id: '',
    territory: '',
    website: '',
    mobile_no: '',
    disabled: 0
  }
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  fetchCustomers()
})
</script>