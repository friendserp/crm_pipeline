<template>
  <div class="min-h-screen bg-[#233d48] py-6 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-white">{{ currentDate }}</h1>
        <p class="text-gray-300">{{ greeting }}, {{ userName }}</p>
      </div>

      <!-- Giveaway Section -->
      <div class="bg-gradient-to-r from-[#233d48] to-[#1a2f38] rounded-xl p-6 text-white mb-8 shadow-lg border border-gray-600">
        <h2 class="text-xl font-bold mb-2">GIVEAWAY</h2>
        <p class="mb-4 text-gray-300">
          Win one of 10 awesome Marketing Prize Packs!<br>
          Send an email campaign in Jobber by Oct. 31 to be in the running. Terms & Conditions apply.
        </p>
        
        <div class="flex flex-wrap gap-4 mb-6">
          <div class="bg-[#2a4a58] rounded-lg p-4 text-center flex-1 min-w-[150px] border border-gray-600">
            <h3 class="font-semibold">iPhone 17 Pro</h3>
          </div>
          <div class="bg-[#2a4a58] rounded-lg p-4 text-center flex-1 min-w-[150px] border border-gray-600">
            <h3 class="font-semibold">Coaching Session</h3>
          </div>
          <div class="bg-[#2a4a58] rounded-lg p-4 text-center flex-1 min-w-[150px] border border-gray-600">
            <h3 class="font-semibold">$500 Gift Card</h3>
          </div>
        </div>
        
        <button class="bg-[#8acc33] hover:bg-[#7bb82d] text-white font-semibold py-3 px-6 rounded-lg transition-colors">
          Send a Campaign
        </button>
      </div>

      <!-- Onboarding Section -->
      <div class="bg-[#2a4a58] rounded-xl p-6 mb-8 shadow border border-gray-600">
        <h2 class="text-xl font-semibold text-white mb-6">Let's get you up and running</h2>
        
        <div class="space-y-6">
          <div class="flex items-start pb-6 border-b border-gray-600">
            <input type="checkbox" checked disabled class="mt-1 mr-4 h-5 w-5 rounded border-gray-600 text-[#8acc33] bg-[#233d48]">
            <div>
              <h3 class="font-semibold text-gray-400 line-through">Create a Jobber account</h3>
              <p class="text-gray-400 text-sm mt-1">You're all set to start exploring Jobber</p>
            </div>
          </div>
          
          <div class="flex items-start pb-6 border-b border-gray-600">
            <input type="checkbox" disabled class="mt-1 mr-4 h-5 w-5 rounded border-gray-600 text-[#8acc33] bg-[#233d48]">
            <div>
              <h3 class="font-semibold text-white">Optimize your website for visibility</h3>
              <p class="text-gray-300 text-sm mt-1">Improve CALIFORNIA CUDE+ site to attract local bin cleaning clients</p>
            </div>
          </div>
          
          <div class="flex items-start pb-6 border-b border-gray-600">
            <input type="checkbox" disabled class="mt-1 mr-4 h-5 w-5 rounded border-gray-600 text-[#8acc33] bg-[#233d48]">
            <div>
              <h3 class="font-semibold text-white">Streamline your scheduling</h3>
              <p class="text-gray-300 text-sm mt-1">Schedule your bin cleaning jobs efficiently to save time</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <input type="checkbox" disabled class="mt-1 mr-4 h-5 w-5 rounded border-gray-600 text-[#8acc33] bg-[#233d48]">
            <div>
              <h3 class="font-semibold text-white">Simplify invoicing for faster payment</h3>
              <p class="text-gray-300 text-sm mt-1">Send professional invoices to get paid quicker and reduce admin</p>
            </div>
          </div>
        </div>
        
        <div class="pt-6 mt-6 border-t border-gray-600 font-semibold text-white">
          Is this list helpful so far?
        </div>
      </div>

      <!-- Appointments Section -->
      <div class="bg-[#2a4a58] rounded-xl p-6 shadow border border-gray-600">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-white">Today's Appointments</h2>
          <span class="bg-[#8acc33] text-white px-3 py-1 rounded-full text-sm font-medium">
            {{ todayAppointments.length }} appointments
          </span>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8acc33]"></div>
        </div>

        <!-- Appointments Statistics -->
        <div v-else-if="todayAppointments.length > 0" class="mb-6">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-600">
                  <th class="text-left py-3 px-4 text-gray-400 font-medium">Total</th>
                  <th class="text-left py-3 px-4 text-gray-400 font-medium">Scheduled</th>
                  <th class="text-left py-3 px-4 text-gray-400 font-medium">Confirmed</th>
                  <th class="text-left py-3 px-4 text-gray-400 font-medium">Completed</th>
                  <th class="text-left py-3 px-4 text-gray-400 font-medium">Cancelled</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="py-4 px-4 font-medium text-white">{{ todayAppointments.length }}</td>
                  <td class="py-4 px-4 font-medium text-white">{{ scheduledCount }}</td>
                  <td class="py-4 px-4 font-medium text-white">{{ confirmedCount }}</td>
                  <td class="py-4 px-4 font-medium text-white">{{ completedCount }}</td>
                  <td class="py-4 px-4 font-medium text-white">{{ cancelledCount }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Appointments List -->
        <div v-if="!loading">
          <div v-if="todayAppointments.length === 0" class="text-center py-8">
            <p class="text-gray-400 mb-4">
              No appointments scheduled for today.
            </p>
            <button 
              @click="scheduleAppointment"
              class="bg-[#8acc33] hover:bg-[#7bb82d] text-white font-semibold py-2 px-5 rounded-lg transition-colors"
            >
              Schedule an Appointment
            </button>
          </div>
          
          <div v-else class="space-y-4">
            <div 
              v-for="appointment in todayAppointments" 
              :key="appointment.name"
              class="border border-gray-600 rounded-lg p-4 hover:border-[#8acc33] transition-colors duration-200"
            >
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h3 class="text-white font-semibold text-lg">
                    Appointment with {{ appointment.appointment_with }}
                  </h3>
                  <p class="text-gray-300 text-sm mt-1">
                    {{ appointment.customer_name }}
                  </p>
                </div>
                <span 
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="getAppointmentStatusClass(appointment.status)"
                >
                  {{ appointment.status }}
                </span>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <p class="text-gray-400">Time</p>
                  <p class="text-white font-medium">
                    {{ formatTime(appointment.scheduled_time) }} - 
                    {{ formatTime(appointment.custom_scheduled_end_time) }}
                  </p>
                </div>
                <div>
                  <p class="text-gray-400">Contact</p>
                  <p class="text-white">{{ appointment.customer_phone_number }}</p>
                </div>
              </div>
              
              <p class="text-gray-300 text-sm mb-3" v-if="appointment.customer_details">
                {{ appointment.customer_details }}
              </p>
              
              <div class="flex justify-between items-center pt-3 border-t border-gray-600">
                <span class="text-gray-400 text-sm">
                  {{ appointment.customer_email }}
                </span>
                <div class="flex space-x-2">
                  <button 
                    @click="viewAppointmentDetails(appointment.name)"
                    class="text-[#8acc33] hover:text-green-300 text-sm font-medium transition-colors"
                  >
                    View Details
                  </button>
                  <button 
                    @click="editAppointment(appointment)"
                    class="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Reactive data
const loading = ref(false)
const todayAppointments = ref([])
const userName = ref('John') // You can fetch this from user session

// Computed properties
const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
})

// Appointment statistics
const scheduledCount = computed(() => {
  return todayAppointments.value.filter(apt => apt.status === 'Scheduled').length
})

const confirmedCount = computed(() => {
  return todayAppointments.value.filter(apt => apt.status === 'Confirmed').length
})

const completedCount = computed(() => {
  return todayAppointments.value.filter(apt => apt.status === 'Completed').length
})

const cancelledCount = computed(() => {
  return todayAppointments.value.filter(apt => apt.status === 'Cancelled').length
})

// Methods
const fetchTodayAppointments = async () => {
  loading.value = true
  try {
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    
    const response = await fetch('/api/method/frappe.client.get_list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Frappe-CSRF-Token': await getCSRFToken()
      },
      body: JSON.stringify({
        doctype: 'Appointment',
        filters: [
          ['scheduled_time', '>=', `${today} 00:00:00`],
          ['scheduled_time', '<=', `${today} 23:59:59`]
        ],
        fields: [
          'name',
          'appointment_with',
          'customer_name',
          'customer_details',
          'customer_email',
          'customer_phone_number',
          'scheduled_time',
          'custom_scheduled_end_time',
          'status',
          'party'
        ],
        order_by: 'scheduled_time asc'
      })
    })

    if (response.ok) {
      const data = await response.json()
      todayAppointments.value = data.message || []
    } else {
      console.error('Failed to fetch appointments')
      // Fallback to sample data
    }
  } catch (error) {
    console.error('Error fetching appointments:', error)
    // Fallback to sample data
  } finally {
    loading.value = false
  }
}

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

const getAppointmentStatusClass = (status) => {
  const statusClasses = {
    'Scheduled': 'bg-blue-500 text-white',
    'Confirmed': 'bg-green-500 text-white',
    'Completed': 'bg-purple-500 text-white',
    'Cancelled': 'bg-red-500 text-white',
    'Unverified': 'bg-yellow-500 text-white'
  }
  return statusClasses[status] || 'bg-gray-500 text-white'
}

const formatTime = (dateTimeString) => {
  if (!dateTimeString) return 'N/A'
  return new Date(dateTimeString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}



onMounted(() => {
  fetchTodayAppointments()
})
</script>

<style scoped>
/* Additional custom styles if needed */
</style>