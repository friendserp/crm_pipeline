<template>
  <div class="min-h-screen bg-[#233d48] py-6">
    <div class="max-w-full mx-auto px-4">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-white">Appointment Calendar</h2>
        <div class="flex items-center space-x-4">
          <!-- View Selector Dropdown -->
          <div class="relative">
            <button
              @click="showViewDropdown = !showViewDropdown"
              class="flex items-center space-x-2 px-4 py-2 border border-[#8acc33] rounded-md bg-[#233d48] text-[#8acc33] hover:bg-[#2a4a58] focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent transition-colors duration-200"
            >
              <span>{{ getCurrentViewName() }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <!-- Dropdown Menu -->
            <div
              v-if="showViewDropdown"
              class="absolute right-0 mt-2 w-48 bg-[#233d48] rounded-md shadow-lg border border-[#8acc33] z-50"
            >
              <div class="py-1">
                <button
                  @click="setActiveView('calendar')"
                  :class="[
                    'w-full text-left px-4 py-2 text-sm transition-colors duration-200',
                    activeTab === 'calendar'
                      ? 'bg-[#8acc33] text-[#233d48] font-medium'
                      : 'text-[#8acc33] hover:bg-[#2a4a58]'
                  ]"
                >
                  Calendar View
                </button>
                <button
                  @click="setActiveView('list')"
                  :class="[
                    'w-full text-left px-4 py-2 text-sm transition-colors duration-200',
                    activeTab === 'list'
                      ? 'bg-[#8acc33] text-[#233d48] font-medium'
                      : 'text-[#8acc33] hover:bg-[#2a4a58]'
                  ]"
                >
                  List View
                </button>
              </div>
            </div>
          </div>

          <!-- Add Appointment Button -->
          <button 
            @click="showNewAppointmentModal = true"
            class="border border-[#8acc33] text-[#8acc33] bg-[#233d48] hover:bg-[#2a4a58] px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <span>+</span>
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      <!-- Calendar View -->
      <div v-if="activeTab === 'calendar'" class="bg-[#233d48] rounded-lg shadow-sm border border-[#2a4a58]  w-full">
        <FullCalendar
          ref="calendarRef"
          :options="calendarOptions"
        />
      </div>

      <!-- List View -->
      <div v-if="activeTab === 'list'" class="bg-[#233d48] rounded-lg shadow-sm border border-[#2a4a58] overflow-hidden w-full">
        <div class="px-6 py-4 border-b border-[#2a4a58] bg-[#2a4a58]">
          <h3 class="text-lg font-medium text-white">Appointments List</h3>
          <p class="mt-1 text-sm text-gray-300">All your appointments in a list format</p>
        </div>
        
        <!-- Filters -->
        <div class="px-6 py-4 border-b border-[#2a4a58] bg-[#233d48]">
          <div class="flex flex-wrap gap-4 items-center">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Status</label>
              <select 
                v-model="listFilters.status"
                class="px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
              >
                <option value="">All Status</option>
                <option value="Open">Open</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Unverified">Unverified</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Date Range</label>
              <select 
                v-model="listFilters.dateRange"
                class="px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <div class="flex-1 min-w-[200px]">
              <label class="block text-sm font-medium text-gray-300 mb-1">Search</label>
              <input 
                type="text" 
                v-model="listFilters.search"
                placeholder="Search by customer name, email, or phone..."
                class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white placeholder-gray-400"
              >
            </div>
          </div>
        </div>

        <!-- Appointments List -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-[#2a4a58]">
            <thead class="bg-[#2a4a58]">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date & Time
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-[#233d48] divide-y divide-[#2a4a58]">
              <tr 
                v-for="appointment in filteredAppointments" 
                :key="appointment.name"
                class="hover:bg-[#2a4a58] transition-colors duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 bg-[#8acc33] rounded-full flex items-center justify-center">
                      <span class="text-[#233d48] font-medium text-sm">
                        {{ getInitials(appointment.customer_name) }}
                      </span>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-white">
                        {{ appointment.customer_name }}
                      </div>
                      <div class="text-sm text-gray-400">
                        {{ appointment.appointment_with }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-white">{{ appointment.customer_email }}</div>
                  <div class="text-sm text-gray-400">{{ appointment.customer_phone_number }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-white">
                    {{ formatDate(appointment.scheduled_time) }}
                  </div>
                  <div class="text-sm text-gray-400">
                    {{ formatTime(appointment.scheduled_time) }} - {{ formatTime(appointment.custom_scheduled_end_time) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {{ calculateDuration(appointment.scheduled_time, appointment.custom_scheduled_end_time) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="statusBadgeClasses(appointment.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ appointment.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button 
                      @click="viewAppointmentDetails(appointment)"
                      class="text-[#8acc33] hover:text-[#a8e64c] transition-colors duration-200"
                    >
                      View
                    </button>
                    <button 
                      @click="editAppointmentFromList(appointment)"
                      class="text-[#8acc33] hover:text-[#a8e64c] transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button 
                      @click="deleteAppointmentFromList(appointment)"
                      class="text-[#ef4444] hover:text-[#f87171] transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- Empty State -->
          <div 
            v-if="filteredAppointments.length === 0" 
            class="text-center py-12"
          >
            <div class="text-gray-400 mb-4">
              <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-white mb-2">No appointments found</h3>
            <p class="text-gray-400 mb-4">Try adjusting your search or filter criteria</p>
            <button 
              @click="showNewAppointmentModal = true"
              class="border border-[#8acc33] text-[#8acc33] bg-[#233d48] hover:bg-[#2a4a58] px-4 py-2 rounded-md font-medium transition-colors duration-200"
            >
              Create New Appointment
            </button>
          </div>
        </div>
      </div>

      <!-- New Appointment Modal -->
      <div 
        v-if="showNewAppointmentModal" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click="showNewAppointmentModal = false"
      >
        <div 
          class="bg-[#233d48] rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#2a4a58]"
          @click.stop
        >
          <div class="p-6 border-b border-[#2a4a58] bg-[#2a4a58]">
            <h3 class="text-xl font-semibold text-white">Create New Appointment</h3>
          </div>
          <form @submit.prevent="createAppointment" class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Customer Name *</label>
                <input 
                  type="text" 
                  v-model="newAppointment.customer_name" 
                  required
                  class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white placeholder-gray-400"
                  placeholder="Enter customer name"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Customer Email *</label>
                <input 
                  type="email" 
                  v-model="newAppointment.customer_email" 
                  required
                  class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white placeholder-gray-400"
                  placeholder="Enter customer email"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Customer Phone *</label>
                <input 
                  type="text" 
                  v-model="newAppointment.customer_phone_number" 
                  required
                  class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white placeholder-gray-400"
                  placeholder="Enter phone number"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Appointment With</label>
                <select 
                  v-model="newAppointment.appointment_with"
                  class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                >
                  <option value="Lead">Lead</option>
                  <option value="Customer">Customer</option>
                  <option value="Partner">Partner</option>
                </select>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Appointment Details *</label>
              <textarea 
                v-model="newAppointment.customer_details" 
                required
                rows="3"
                class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white placeholder-gray-400"
                placeholder="Enter appointment details"
              ></textarea>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Start Date & Time *</label>
                <input 
                  type="datetime-local" 
                  v-model="newAppointment.scheduled_time" 
                  required
                  class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">End Date & Time *</label>
                <input 
                  type="datetime-local" 
                  v-model="newAppointment.custom_scheduled_end_time" 
                  required
                  class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                >
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 pt-6 border-t border-[#2a4a58]">
              <button 
                type="button" 
                @click="showNewAppointmentModal = false"
                class="px-6 py-2 border border-[#8acc33] text-[#8acc33] bg-[#233d48] hover:bg-[#2a4a58] rounded-md font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="px-6 py-2 border border-[#8acc33] text-[#8acc33] bg-[#233d48] hover:bg-[#2a4a58] rounded-md font-medium transition-colors duration-200"
              >
                Create Appointment
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Appointment Details Modal -->
      <div 
        v-if="selectedAppointment" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click="selectedAppointment = null"
      >
        <div 
          class="bg-[#233d48] rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#2a4a58]"
          @click.stop
        >
          <div class="p-6 border-b border-[#2a4a58] bg-[#2a4a58]">
            <h3 class="text-xl font-semibold text-white">Appointment Details</h3>
          </div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Customer Name</label>
                <p class="text-white font-medium">{{ selectedAppointment.customer_name }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <p class="text-white">{{ selectedAppointment.customer_email }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                <p class="text-white">{{ selectedAppointment.customer_phone_number }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Appointment With</label>
                <p class="text-white">{{ selectedAppointment.appointment_with }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Start Time</label>
                <p class="text-white">{{ formatDateTime(selectedAppointment.scheduled_time) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">End Time</label>
                <p class="text-white">{{ formatDateTime(selectedAppointment.custom_scheduled_end_time) }}</p>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Details</label>
              <p class="text-white bg-[#2a4a58] p-3 rounded-md">{{ selectedAppointment.customer_details }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">Status</label>
              <span :class="statusBadgeClasses(selectedAppointment.status)" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
                {{ selectedAppointment.status }}
              </span>
            </div>
          </div>
          <div class="flex justify-end space-x-3 p-6 border-t border-[#2a4a58] bg-[#2a4a58]">
            <button 
              @click="editAppointment(selectedAppointment)"
              class="px-4 py-2 border border-[#8acc33] text-[#8acc33] bg-[#233d48] hover:bg-[#2a4a58] rounded-md font-medium transition-colors duration-200"
            >
              Edit
            </button>
            <button 
              @click="deleteAppointment(selectedAppointment)"
              class="px-4 py-2 border border-[#ef4444] text-[#ef4444] bg-[#233d48] hover:bg-[#2a4a58] rounded-md font-medium transition-colors duration-200"
            >
              Delete
            </button>
            <button 
              @click="selectedAppointment = null"
              class="px-4 py-2 border border-gray-400 text-gray-400 bg-[#233d48] hover:bg-[#2a4a58] rounded-md font-medium transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <!-- Edit Appointment Modal -->
      <div 
        v-if="editingAppointment" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click="editingAppointment = null"
      >
        <div 
          class="bg-[#233d48] rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#2a4a58]"
          @click.stop
        >
          <div class="p-6 border-b border-[#2a4a58] bg-[#2a4a58]">
            <h3 class="text-xl font-semibold text-white">Edit Appointment</h3>
          </div>
          <form @submit.prevent="updateAppointment" class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Customer Name *</label>
                <input 
                  type="text" 
                  v-model="editingAppointment.customer_name" 
                  required
                  class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Customer Email *</label>
                <input 
                  type="email" 
                  v-model="editingAppointment.customer_email" 
                  required
                  class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Customer Phone *</label>
                <input 
                  type="text" 
                  v-model="editingAppointment.customer_phone_number" 
                  required
                  class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Appointment With</label>
                <select 
                  v-model="editingAppointment.appointment_with"
                  class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                >
                  <option value="Lead">Lead</option>
                  <option value="Customer">Customer</option>
                  <option value="Partner">Partner</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Start Date & Time *</label>
                <input 
                  type="datetime-local" 
                  v-model="editingAppointment.scheduled_time" 
                  required
                  class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">End Date & Time *</label>
                <input 
                  type="datetime-local" 
                  v-model="editingAppointment.custom_scheduled_end_time" 
                  required
                  class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                >
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Appointment Details *</label>
              <textarea 
                v-model="editingAppointment.customer_details" 
                required
                rows="3"
                class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
              ></textarea>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select 
                  v-model="editingAppointment.status"
                  class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                >
                  <option value="Open">Open</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Unverified">Unverified</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 pt-6 border-t border-[#2a4a58]">
              <button 
                type="button" 
                @click="editingAppointment = null"
                class="px-6 py-2 border border-[#8acc33] text-[#8acc33] bg-[#233d48] hover:bg-[#2a4a58] rounded-md font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="px-6 py-2 border border-[#8acc33] text-[#8acc33] bg-[#233d48] hover:bg-[#2a4a58] rounded-md font-medium transition-colors duration-200"
              >
                Update Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

export default {
  name: 'AppointmentCalendar',
  components: {
    FullCalendar
  },
  data() {
    return {
      activeTab: 'calendar',
      showViewDropdown: false,
      appointments: [],
      showNewAppointmentModal: false,
      selectedAppointment: null,
      editingAppointment: null,
      listFilters: {
        status: '',
        dateRange: 'all',
        search: ''
      },
      currentPage: 1,
      itemsPerPage: 10,
      newAppointment: {
        customer_name: '',
        customer_email: '',
        customer_phone_number: '',
        customer_details: '',
        scheduled_time: '',
        custom_scheduled_end_time: '',
        appointment_with: 'Lead',
        status: 'Open'
      },
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: [],
        editable: true,
        selectable: true,
        selectMirror: true,
        droppable: true,
        eventClick: this.handleEventClick,
        eventDrop: this.handleEventDrop,
        eventResize: this.handleEventResize,
        eventDidMount: this.handleEventDidMount,
        select: this.handleDateSelect,
        // FIXED: Better width and height handling
        height: 'auto',
        contentHeight: 'auto',
        aspectRatio: 1.8,
        handleWindowResize: true,
        windowResizeDelay: 100,
        eventTimeFormat: {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        },
        dayMaxEvents: 5,
        views: {
          dayGridMonth: {
            dayMaxEventRows: 3,
            dayHeaderFormat: { weekday: 'short' }
          },
          timeGridWeek: {
            allDaySlot: false,
            slotDuration: '00:30:00',
            slotLabelInterval: '01:00:00',
            slotMinTime: '06:00:00',
            slotMaxTime: '22:00:00',
            expandRows: true,
            dayHeaderFormat: { weekday: 'short', day: 'numeric', month: 'short' }
          },
          timeGridDay: {
            allDaySlot: false,
            slotDuration: '00:30:00',
            slotLabelInterval: '01:00:00',
            slotMinTime: '06:00:00',
            slotMaxTime: '22:00:00',
            expandRows: true,
            dayHeaderFormat: { weekday: 'long', day: 'numeric', month: 'long' }
          }
        },
        eventResizableFromStart: true,
        selectOverlap: false,
        slotMinTime: '06:00:00',
        slotMaxTime: '22:00:00',
        expandRows: true,
        stickyHeaderDates: true,
        nowIndicator: true,
        // FIXED: Critical configuration for showing all days including Saturday
        weekends: true,
        firstDay: 0, // Sunday as first day
        hiddenDays: [], // Show all days (empty array means no hidden days)
        // Enhanced drag and drop
        dragRevertDuration: 0,
        dragScroll: true,
        eventDragMinDistance: 0,
        // Multi-day event support
        eventDurationEditable: true,
        eventStartEditable: true,
        eventOverlap: false,
        // Better event display
        displayEventTime: true,
        displayEventEnd: true
      }
    }
  },
  computed: {
    filteredAppointments() {
      let filtered = this.appointments;

      // Filter by status
      if (this.listFilters.status) {
        filtered = filtered.filter(appointment => 
          appointment.status === this.listFilters.status
        );
      }

      // Filter by date range
      if (this.listFilters.dateRange !== 'all') {
        const now = new Date();
        filtered = filtered.filter(appointment => {
          const appointmentDate = new Date(appointment.scheduled_time);
          
          switch (this.listFilters.dateRange) {
            case 'today':
              return appointmentDate.toDateString() === now.toDateString();
            case 'week':
              const startOfWeek = new Date(now);
              startOfWeek.setDate(now.getDate() - now.getDay());
              startOfWeek.setHours(0, 0, 0, 0);
              const endOfWeek = new Date(startOfWeek);
              endOfWeek.setDate(startOfWeek.getDate() + 6);
              endOfWeek.setHours(23, 59, 59, 999);
              return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
            case 'month':
              return appointmentDate.getMonth() === now.getMonth() && 
                     appointmentDate.getFullYear() === now.getFullYear();
            default:
              return true;
          }
        });
      }

      // Filter by search
      if (this.listFilters.search) {
        const searchLower = this.listFilters.search.toLowerCase();
        filtered = filtered.filter(appointment =>
          appointment.customer_name.toLowerCase().includes(searchLower) ||
          appointment.customer_email.toLowerCase().includes(searchLower) ||
          appointment.customer_phone_number.includes(this.listFilters.search)
        );
      }

      // Sort by date (most recent first)
      return filtered.sort((a, b) => 
        new Date(b.scheduled_time) - new Date(a.scheduled_time)
      );
    }
  },
  mounted() {
    this.fetchAppointments();
    // Close dropdown when clicking outside
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    setActiveView(view) {
      this.activeTab = view;
      this.showViewDropdown = false;
    },

    getCurrentViewName() {
      if (this.activeTab === 'list') return 'List View';
      return 'Calendar View';
    },
    
    handleClickOutside(event) {
      if (!event.target.closest('.relative')) {
        this.showViewDropdown = false;
      }
    },
    
    async fetchAppointments() {
      try {
        const response = await fetch('/api/method/frappe.client.get_list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': this.getCSRFToken()
          },
          body: JSON.stringify({
            doctype: 'Appointment',
            fields: ['*'],
            limit_page_length: 100,
            order_by: 'scheduled_time desc'
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          this.appointments = result.message || [];
          this.updateCalendarEvents();
        } else {
          console.error('Failed to fetch appointments');
          this.useSampleData();
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        this.useSampleData();
      }
    },
    
    useSampleData() {
      this.appointments = [
        {
          "appointment_with": "Lead",
          "calendar_event": null,
          "custom_scheduled_end_time": "2025-10-04 14:23:51",
          "customer_details": "Something detail goes here",
          "customer_email": "lijsamuael@gmail.com",
          "customer_name": "Samuael Ketema",
          "customer_phone_number": "0921644607",
          "customer_skype": null,
          "docstatus": 0,
          "doctype": "Appointment",
          "modified": "2025-10-04 12:36:41.791884",
          "name": "APMT-Samuael Ketema-0003",
          "party": null,
          "scheduled_time": "2025-10-04 12:23:57",
          "status": "Unverified"
        },
        {
          "appointment_with": "Lead",
          "calendar_event": "EV00001",
          "custom_scheduled_end_time": "2025-10-04 16:59:51",
          "customer_details": "Something goes here like details of the appointment",
          "customer_email": "samict77@gmail.com",
          "customer_name": "Elsabet Meseret",
          "customer_phone_number": "0921644607",
          "customer_skype": null,
          "docstatus": 0,
          "doctype": "Appointment",
          "modified": "2025-10-04 12:38:35.136958",
          "name": "APMT-Elsabet Meseret-0004",
          "party": "CRM-LEAD-2025-00002",
          "scheduled_time": "2025-10-04 14:37:46",
          "status": "Open"
        },
        {
          "appointment_with": "Customer",
          "calendar_event": "EV00002",
          "custom_scheduled_end_time": "2025-10-06 10:00:00",
          "customer_details": "Multi-day project meeting",
          "customer_email": "multi@day.com",
          "customer_name": "Multi Day Event",
          "customer_phone_number": "1234567890",
          "customer_skype": null,
          "docstatus": 0,
          "doctype": "Appointment",
          "modified": "2025-10-04 12:38:35.136958",
          "name": "APMT-Multi-Day-0005",
          "party": "CRM-LEAD-2025-00003",
          "scheduled_time": "2025-10-04 09:00:00",
          "status": "Scheduled"
        }
      ];
      this.updateCalendarEvents();
    },
    
    updateCalendarEvents() {
      this.calendarOptions.events = this.appointments.map(appointment => ({
        id: appointment.name,
        title: `${appointment.customer_name} - ${this.formatTime(appointment.scheduled_time)}`,
        start: appointment.scheduled_time,
        end: appointment.custom_scheduled_end_time,
        extendedProps: {
          appointmentData: appointment
        },
        backgroundColor: this.getStatusColor(appointment.status),
        borderColor: this.getStatusColor(appointment.status),
        textColor: '#ffffff',
        // Enhanced event properties for better drag and drop
        durationEditable: true,
        startEditable: true,
        editable: true,
        // Multi-day support
        allDay: this.isMultiDayEvent(appointment),
        display: 'auto'
      }));
    },

    isMultiDayEvent(appointment) {
      if (!appointment.scheduled_time || !appointment.custom_scheduled_end_time) return false;
      
      const start = new Date(appointment.scheduled_time);
      const end = new Date(appointment.custom_scheduled_end_time);
      
      return start.toDateString() !== end.toDateString();
    },
    
    getStatusColor(status) {
      const colors = {
        'Open': '#8acc33',
        'Scheduled': '#3B82F6',
        'Unverified': '#F59E0B',
        'Cancelled': '#EF4444'
      };
      return colors[status] || '#6B7280';
    },
    
    statusBadgeClasses(status) {
      const statusClasses = {
        'Open': 'bg-green-100 text-green-800',
        'Scheduled': 'bg-blue-100 text-blue-800',
        'Unverified': 'bg-amber-100 text-amber-800',
        'Cancelled': 'bg-red-100 text-red-800'
      };
      return statusClasses[status] || 'bg-gray-100 text-gray-800';
    },
    
    getInitials(name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    },
    
    calculateDuration(start, end) {
      const startTime = new Date(start);
      const endTime = new Date(end);
      const duration = endTime - startTime;
      const hours = Math.floor(duration / (1000 * 60 * 60));
      const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      return `${minutes}m`;
    },
    
    formatDate(dateTimeString) {
      if (!dateTimeString) return '';
      const date = new Date(dateTimeString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    
    viewAppointmentDetails(appointment) {
      this.selectedAppointment = appointment;
    },
    
    editAppointmentFromList(appointment) {
      this.editAppointment(appointment);
    },
    
    async deleteAppointmentFromList(appointment) {
      await this.deleteAppointment(appointment);
    },
    
    handleEventClick(info) {
      this.selectedAppointment = info.event.extendedProps.appointmentData;
    },
    
    async handleEventDrop(info) {
      try {
        const appointment = info.event.extendedProps.appointmentData;
        
        const startTime = info.event.start;
        const endTime = info.event.end || new Date(startTime.getTime() + 60 * 60 * 1000);
        
        console.log('Event Drop:', {
          customer: appointment.customer_name,
          originalStart: appointment.scheduled_time,
          originalEnd: appointment.custom_scheduled_end_time,
          newStart: startTime,
          newEnd: endTime
        });
        
        await this.updateAppointmentInERP({
          ...appointment,
          scheduled_time: this.formatDateForAPI(startTime),
          custom_scheduled_end_time: this.formatDateForAPI(endTime)
        });
        
        await this.fetchAppointments();
        
        this.showNotification('Appointment moved successfully', 'success');
        
      } catch (error) {
        console.error('Error updating appointment:', error);
        info.revert();
        this.showNotification('Failed to move appointment', 'error');
      }
    },
    
    async handleEventResize(info) {
      try {
        const appointment = info.event.extendedProps.appointmentData;
        
        const startTime = info.event.start;
        const endTime = info.event.end;
        
        console.log('Event Resize:', {
          customer: appointment.customer_name,
          originalStart: appointment.scheduled_time,
          originalEnd: appointment.custom_scheduled_end_time,
          newStart: startTime,
          newEnd: endTime
        });
        
        await this.updateAppointmentInERP({
          ...appointment,
          scheduled_time: this.formatDateForAPI(startTime),
          custom_scheduled_end_time: this.formatDateForAPI(endTime)
        });
        
        await this.fetchAppointments();
        
        this.showNotification('Appointment duration updated successfully', 'success');
        
      } catch (error) {
        console.error('Error resizing appointment:', error);
        info.revert();
        this.showNotification('Failed to update appointment duration', 'error');
      }
    },
    
    handleEventDidMount(info) {
      const appointment = info.event.extendedProps.appointmentData;
      const status = appointment.status;
      
      // Add border color
      info.el.style.borderLeft = `4px solid ${this.getStatusColor(status)}`;
      info.el.style.borderRadius = '4px';
      
      // Add hover tooltip
      info.el.setAttribute('title', this.getEventTooltip(appointment));
      
      // Enhanced hover effects
      info.el.addEventListener('mouseenter', () => {
        info.el.style.transform = 'scale(1.02)';
        info.el.style.zIndex = '1000';
        info.el.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        info.el.style.cursor = 'grab';
      });
      
      info.el.addEventListener('mouseleave', () => {
        info.el.style.transform = 'scale(1)';
        info.el.style.zIndex = '';
        info.el.style.boxShadow = '';
        info.el.style.cursor = '';
      });

      // Better drag feedback
      info.el.addEventListener('mousedown', () => {
        info.el.style.cursor = 'grabbing';
        info.el.style.opacity = '0.8';
      });
    },
    
    getEventTooltip(appointment) {
      return `${appointment.customer_name}\n${this.formatTime(appointment.scheduled_time)} - ${this.formatTime(appointment.custom_scheduled_end_time)}\nStatus: ${appointment.status}`;
    },
    
    handleDateSelect(selectInfo) {
      this.newAppointment.scheduled_time = this.formatDateForInput(selectInfo.start);
      this.newAppointment.custom_scheduled_end_time = this.formatDateForInput(selectInfo.end || new Date(selectInfo.start.getTime() + 60 * 60 * 1000));
      this.showNewAppointmentModal = true;
      
      selectInfo.view.calendar.unselect();
    },
    
    async createAppointment() {
      try {
        const formattedAppointment = {
          doctype: 'Appointment',
          ...this.newAppointment,
          scheduled_time: this.formatDateForAPI(this.newAppointment.scheduled_time),
          custom_scheduled_end_time: this.formatDateForAPI(this.newAppointment.custom_scheduled_end_time)
        };
        
        const response = await fetch('/api/method/frappe.client.insert', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': this.getCSRFToken()
          },
          body: JSON.stringify({
            doc: formattedAppointment
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          this.appointments.push(result.message);
          this.updateCalendarEvents();
          this.showNewAppointmentModal = false;
          this.resetNewAppointmentForm();
          this.showNotification('Appointment created successfully', 'success');
        } else {
          console.error('Failed to create appointment');
          this.showNotification('Failed to create appointment. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Error creating appointment:', error);
        this.showNotification('Error creating appointment. Please try again.', 'error');
      }
    },
    
    async updateAppointment() {
      try {
        const formattedAppointment = {
          doctype: 'Appointment',
          ...this.editingAppointment,
          scheduled_time: this.formatDateForAPI(this.editingAppointment.scheduled_time),
          custom_scheduled_end_time: this.formatDateForAPI(this.editingAppointment.custom_scheduled_end_time)
        };
        
        const result = await this.updateAppointmentInERP(formattedAppointment);
        
        // Update the local appointment data
        const index = this.appointments.findIndex(a => a.name === this.editingAppointment.name);
        if (index !== -1) {
          this.appointments[index] = { ...this.appointments[index], ...this.editingAppointment };
        }
        
        this.updateCalendarEvents();
        this.editingAppointment = null;
        this.showNotification('Appointment updated successfully', 'success');
        
      } catch (error) {
        console.error('Error updating appointment:', error);
        this.showNotification('Error updating appointment. Please try again.', 'error');
      }
    },
    
    async updateAppointmentInERP(appointmentData) {
      const response = await fetch('/api/method/frappe.client.set_value', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': this.getCSRFToken()
        },
        body: JSON.stringify({
          doctype: 'Appointment',
          name: appointmentData.name,
          fieldname: {
            customer_name: appointmentData.customer_name,
            customer_email: appointmentData.customer_email,
            customer_phone_number: appointmentData.customer_phone_number,
            customer_details: appointmentData.customer_details,
            scheduled_time: appointmentData.scheduled_time,
            custom_scheduled_end_time: appointmentData.custom_scheduled_end_time,
            appointment_with: appointmentData.appointment_with,
            status: appointmentData.status
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update appointment in ERP');
      }
      
      return await response.json();
    },
    
    async deleteAppointment(appointment) {
      if (confirm(`Are you sure you want to delete the appointment with ${appointment.customer_name}?`)) {
        try {
          const response = await fetch('/api/method/frappe.client.delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Frappe-CSRF-Token': this.getCSRFToken()
            },
            body: JSON.stringify({
              doctype: 'Appointment',
              name: appointment.name
            })
          });
          
          if (response.ok) {
            this.appointments = this.appointments.filter(a => a.name !== appointment.name);
            this.updateCalendarEvents();
            this.selectedAppointment = null;
            this.showNotification('Appointment deleted successfully', 'success');
          } else {
            console.error('Failed to delete appointment');
            this.showNotification('Failed to delete appointment. Please try again.', 'error');
          }
        } catch (error) {
          console.error('Error deleting appointment:', error);
          this.showNotification('Error deleting appointment. Please try again.', 'error');
        }
      }
    },
    
    editAppointment(appointment) {
      this.editingAppointment = { ...appointment };
      this.editingAppointment.scheduled_time = this.formatDateForInput(appointment.scheduled_time);
      this.editingAppointment.custom_scheduled_end_time = this.formatDateForInput(appointment.custom_scheduled_end_time);
      this.selectedAppointment = null;
    },
    
    resetNewAppointmentForm() {
      this.newAppointment = {
        customer_name: '',
        customer_email: '',
        customer_phone_number: '',
        customer_details: '',
        scheduled_time: '',
        custom_scheduled_end_time: '',
        appointment_with: 'Lead',
        status: 'Open'
      };
    },
    
    formatDateForAPI(dateTime) {
      if (!dateTime) return '';
      
      const date = dateTime instanceof Date ? dateTime : new Date(dateTime);
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    
    formatDateForInput(dateTimeString) {
      if (!dateTimeString) return '';
      const date = new Date(dateTimeString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    },
    
    formatDateTime(dateTimeString) {
      if (!dateTimeString) return '';
      const date = new Date(dateTimeString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    
    formatTime(dateTimeString) {
      if (!dateTimeString) return '';
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    },
    
    getCSRFToken() {
      const metaTag = document.querySelector('meta[name="csrf-token"]');
      return metaTag ? metaTag.getAttribute('content') : '';
    },

    showNotification(message, type = 'info') {
      const notification = document.createElement('div');
      notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-md shadow-lg border ${
        type === 'success' ? 'bg-green-500 text-white border-green-600' :
        type === 'error' ? 'bg-red-500 text-white border-red-600' :
        'bg-blue-500 text-white border-blue-600'
      }`;
      notification.textContent = message;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
    }
  }
}
</script>

<style>
/* Custom FullCalendar styles to match the dark theme */
.fc {
  font-family: 'Inter', sans-serif;
}

/* FIXED: Full width container */
.fc .fc-view-harness {
  width: 100% !important;
}

.fc .fc-scrollgrid {
  width: 100% !important;
  table-layout: fixed !important;
}

.fc-header-toolbar {
  padding: 1.5rem 1.5rem 0.5rem 1.5rem;
  margin-bottom: 0 !important;
  background-color: #233d48 !important;
  width: 100% !important;
}

.fc-toolbar-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: white !important;
}

.fc-button {
  background-color: #233d48 !important;
  border: 1px solid #8acc33 !important;
  color: #8acc33 !important;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.fc-button:hover {
  background-color: #2a4a58 !important;
  border-color: #8acc33 !important;
}

.fc-button-primary:not(:disabled).fc-button-active {
  background-color: #8acc33 !important;
  border-color: #8acc33 !important;
  color: #233d48 !important;
}

.fc-daygrid-day-number {
  font-weight: 500;
  color: white !important;
  padding: 0.5rem;
}

.fc-day-today {
  background-color: #2a4a58 !important;
}

.fc-day-today .fc-daygrid-day-number {
  color: #8acc33 !important;
  font-weight: 600;
}

.fc-event {
  border: none;
  border-radius: 0.375rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  font-weight: 500;
  margin: 1px 2px;
  transition: all 0.2s ease-in-out;
  position: relative;
}

.fc-event-title {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: white !important;
}

/* FIXED: Ensure all days including Saturday are properly styled and have proper width */
.fc-col-header-cell {
  background-color: #2a4a58 !important;
  font-weight: 600;
  color: white !important;
  padding: 0.75rem 0;
  border-right: 1px solid #4b5e6a !important;
  border-bottom: 1px solid #4b5e6a !important;
  width: 14.2857% !important; /* Equal width for 7 days */
}

/* Specific styling for Saturday column */
.fc-col-header-cell.fc-day-sat {
  background-color: #2a4a58 !important;
  color: white !important;
}

.fc-col-header-cell:last-child {
  border-right: none !important;
}

.fc-daygrid-day-frame {
  min-height: 120px;
  border-right: 1px solid #4b5e6a !important;
  border-bottom: 1px solid #4b5e6a !important;
  width: 100% !important;
}

/* Ensure all day cells have equal width */
.fc-daygrid-day {
  width: 14.2857% !important;
}

/* Ensure Saturday cells are visible */
.fc-day-sat {
  background-color: #233d48 !important;
}

.fc-day-sat.fc-day-today {
  background-color: #2a4a58 !important;
}

.fc-day-sat.fc-day-other {
  background-color: #1d313a !important;
}

.fc-daygrid-day:last-child .fc-daygrid-day-frame {
  border-right: none !important;
}

.fc-scrollgrid {
  border: 1px solid #4b5e6a !important;
  width: 100% !important;
}

.fc-theme-standard td, .fc-theme-standard th {
  border: 1px solid #4b5e6a !important;
}

.fc-day-other {
  background-color: #1d313a !important;
}

.fc-day-other .fc-daygrid-day-number {
  color: #6b7280 !important;
}

/* FIXED: TimeGrid views (Week and Day) - Better width handling */
.fc-timegrid-slot {
  border-bottom: 1px solid #4b5e6a !important;
}

.fc-timegrid-now-indicator-line {
  border-color: #8acc33 !important;
}

.fc-timegrid-now-indicator-arrow {
  border-color: #8acc33 !important;
}

/* Enhanced drag and drop styles */
.fc-event-dragging {
  opacity: 0.9 !important;
  transform: rotate(3deg) scale(1.02) !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3) !important;
  z-index: 1001 !important;
  cursor: grabbing !important;
}

.fc-highlight {
  background: rgba(138, 204, 51, 0.15) !important;
  border: 2px dashed #8acc33 !important;
}

/* Selection highlight */
.fc-highlight {
  background: rgba(138, 204, 51, 0.1) !important;
  border: 1px dashed #8acc33 !important;
}

/* Tooltip styles */
.fc-event[title]:hover:after {
  content: attr(title);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #233d48;
  color: white;
  padding: 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  white-space: pre-line;
  z-index: 1000;
  min-width: 200px;
  text-align: center;
  border: 1px solid #8acc33;
}

/* Ensure events are visible in all views */
.fc-daygrid-event {
  margin: 1px 2px;
}

.fc-timegrid-event {
  margin: 1px;
  border-radius: 0.375rem;
}

/* Enhanced cursor feedback */
.fc-event {
  cursor: grab;
  user-select: none;
}

.fc-event:active {
  cursor: grabbing;
}

/* FIXED: Better responsive design */
@media (max-width: 768px) {
  .fc-toolbar {
    flex-direction: column;
    gap: 1rem;
  }
  
  .fc-toolbar-chunk {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .fc-event-resizer {
    opacity: 1;
  }
  
  /* Ensure all days are visible on mobile */
  .fc-day-sat .fc-daygrid-day-number,
  .fc-day-sun .fc-daygrid-day-number {
    color: white !important;
  }
  
  .fc-col-header-cell {
    font-size: 0.7rem;
    padding: 0.5rem 0;
  }
  
  .fc-daygrid-day-number {
    font-size: 0.8rem;
    padding: 0.25rem;
  }
}

/* Additional fixes for better calendar display */
.fc .fc-event {
  touch-action: pan-y;
}

/* Ensure proper z-index during drag */
.fc-event.fc-event-dragging,
.fc-event.fc-event-resizing {
  z-index: 1001 !important;
}

/* Weekend day styling */
.fc-day-sat,
.fc-day-sun {
  background-color: #233d48 !important;
}

.fc-day-sat.fc-day-other,
.fc-day-sun.fc-day-other {
  background-color: #1d313a !important;
}

/* Make sure all calendar cells have proper styling and width */
.fc-daygrid-day {
  background-color: #233d48 !important;
  width: 14.2857% !important; /* Equal width for 7 days */
}

.fc-daygrid-day.fc-day-other {
  background-color: #1d313a !important;
}

/* FIXED: TimeGrid week view column widths */
.fc-timegrid-axis,
.fc-timegrid-slots {
  width: auto !important;
}

.fc-timegrid-col {
  width: 14.2857% !important; /* Equal width for 7 days in week view */
}

/* Ensure the calendar takes full available width */
.fc .fc-view {
  width: 100% !important;
}
</style>