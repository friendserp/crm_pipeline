<!-- Task.vue -->
<template>
  <div class="min-h-screen bg-[#233d48]">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-white text-lg">Loading task...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-red-400 text-lg">{{ error }}</div>
    </div>

    <!-- Task Content -->
    <div v-else-if="task">
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
                <h1 class="text-2xl font-bold text-white">{{ task.subject }}</h1>
                <div class="text-sm text-gray-300 mt-1">
                  #{{ task.name }} • {{ task.type }}
                </div>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize"
                    :class="getStatusClass(task.status)">
                {{ task.status }}
              </span>
              <span v-if="isLate" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-900 text-red-200">
                Late
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-6 py-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Task Details Card -->
            <div class="bg-[#2a4a58] rounded-lg border border-[#315566] p-6">
              <h2 class="text-lg font-semibold text-white mb-4">Task Details</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="text-sm text-gray-300 block mb-2 font-medium">Priority</label>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                        :class="getPriorityClass(task.priority)">
                    {{ task.priority }}
                  </span>
                </div>
                <div>
                  <label class="text-sm text-gray-300 block mb-2 font-medium">Progress</label>
                  <div class="flex items-center gap-2">
                    <div class="w-full bg-[#233d48] rounded-full h-2">
                      <div class="bg-[#2E86AB] h-2 rounded-full" :style="{ width: task.progress + '%' }"></div>
                    </div>
                    <span class="text-sm text-gray-300 whitespace-nowrap">{{ task.progress }}%</span>
                  </div>
                </div>
                <div>
                  <label class="text-sm text-gray-300 block mb-2 font-medium">Expected Start</label>
                  <div class="text-white">{{ formatDate(task.exp_start_date) }}</div>
                </div>
                <div>
                  <label class="text-sm text-gray-300 block mb-2 font-medium">Expected End</label>
                  <div class="text-white">{{ formatDate(task.exp_end_date) }}</div>
                </div>
                <div>
                  <label class="text-sm text-gray-300 block mb-2 font-medium">Actual Start</label>
                  <div class="text-white">{{ formatDate(task.act_start_date) || 'Not started' }}</div>
                </div>
                <div>
                  <label class="text-sm text-gray-300 block mb-2 font-medium">Actual End</label>
                  <div class="text-white">{{ formatDate(task.act_end_date) || 'Not completed' }}</div>
                </div>
                <div class="md:col-span-2">
                  <label class="text-sm text-gray-300 block mb-2 font-medium">Description</label>
                  <div class="prose max-w-none text-gray-300" v-html="task.description || 'No description provided'"></div>
                </div>
              </div>
            </div>

            <!-- Timesheets Card -->
            <div class="bg-[#2a4a58] rounded-lg border border-[#315566] p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-lg font-semibold text-white">Timesheets</h2>
              </div>
              
              <div v-if="taskTimesheets.length === 0" class="text-center py-8 text-gray-400">
                No timesheets recorded for this task
              </div>
              
              <div v-else class="space-y-4">
                <div v-for="timesheet in taskTimesheets" :key="timesheet.name" 
                     class="bg-[#315566] border border-[#3a6374] rounded-lg p-4 hover:border-[#2E86AB] transition-colors">
                  <div class="flex justify-between items-start mb-3">
                    <div>
                      <div class="font-medium text-white">{{ timesheet.name }}</div>
                      <div class="text-sm text-gray-300 mt-1">
                        {{ formatDate(timesheet.start_date) }} - {{ formatDate(timesheet.end_date) }}
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                            :class="getTimesheetStatusClass(timesheet.status)">
                        {{ timesheet.status }}
                      </span>
                      <div class="text-right">
                        <div class="font-semibold text-white">{{ timesheet.total_hours }} hrs</div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Time Logs -->
                  <div class="border-t border-[#3a6374] pt-3">
                    <div v-for="log in timesheet.time_logs" :key="log.name" 
                         class="text-sm text-gray-300 mb-2 last:mb-0">
                      <div class="flex justify-between items-center">
                        <div>
                          <div class="font-medium">{{ formatDateTime(log.from_time) }} - {{ formatDateTime(log.to_time) }}</div>
                          <div v-if="log.activity_type" class="text-gray-400 mt-1">
                            Activity: {{ log.activity_type }}
                          </div>
                          <div v-if="log.description" class="text-gray-400 mt-1">
                            {{ log.description }}
                          </div>
                        </div>
                        <span class="font-semibold text-white">{{ log.hours }} hrs</span>
                      </div>
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
                  <span class="text-sm text-gray-300">Total Billing</span>
                  <span class="font-semibold text-white">{{ formatCurrency(task.total_billing_amount) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-300">Total Costing</span>
                  <span class="font-semibold text-white">{{ formatCurrency(task.total_costing_amount) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-300">Actual Time</span>
                  <span class="font-semibold text-white">{{ task.actual_time || 0 }} hrs</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-300">Expected Time</span>
                  <span class="font-semibold text-white">{{ task.expected_time || 0 }} hrs</span>
                </div>
              </div>
            </div>

            <!-- Task Information -->
            <div class="bg-[#2a4a58] rounded-lg border border-[#315566] p-6">
              <h3 class="font-semibold text-white mb-4">Task Information</h3>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-300">Created</span>
                  <span class="text-white">{{ formatDateTime(task.creation) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-300">Modified</span>
                  <span class="text-white">{{ formatDateTime(task.modified) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-300">Company</span>
                  <span class="text-white">{{ task.company }}</span>
                </div>
                <div v-if="task.project" class="flex justify-between">
                  <span class="text-gray-300">Project</span>
                  <span class="text-white">{{ task.project }}</span>
                </div>
                <div v-if="task.depends_on_tasks" class="flex justify-between">
                  <span class="text-gray-300">Dependencies</span>
                  <span class="text-white">{{ task.depends_on_tasks }}</span>
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
  name: 'TaskDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    return { route, router }
  },
  data() {
    return {
      task: null,
      timesheets: [],
      loading: false,
      error: null
    }
  },
  computed: {
    taskId() {
      // Get task ID from route parameters
      console.log('Route params:', this.route.params)
      return this.route.params.taskId
    },
    taskTimesheets() {
      // Filter timesheets that have time logs linked to this task
      return this.timesheets.filter(ts => 
        ts.time_logs && ts.time_logs.some(log => log.task === this.taskId)
      )
    },
    isLate() {
      if (!this.task?.exp_end_date || ['Completed', 'Cancelled'].includes(this.task.status)) return false
      const endDate = new Date(this.task.exp_end_date)
      const now = new Date()
      return endDate < now
    }
  },
  watch: {
    // Watch for route changes
    '$route.params.id': {
      handler(newId, oldId) {
        if (newId !== oldId) {
          this.loadData()
        }
      },
      immediate: true
    }
  },
  async mounted() {
    console.log('Component mounted, taskId:', this.taskId)
    await this.loadData()
  },
  methods: {
    goBack() {
      this.router.back()
    },
    
    async loadData() {
      this.loading = true
      this.error = null
      try {
        await Promise.all([
          this.loadTask(),
          this.loadTimesheets()
        ])
      } catch (error) {
        console.error('Error loading data:', error)
        this.error = 'Failed to load task data'
      } finally {
        this.loading = false
      }
    },

    async loadTask() {
      try {
        console.log('Loading task with ID:', this.taskId)
        
        if (!this.taskId) {
          throw new Error('No task ID provided in route')
        }

        // Method 1: Using frappe.client.get
        const response = await fetch('/api/method/frappe.client.get', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': this.getCSRFToken()
          },
          body: JSON.stringify({
            doctype: 'Task',
            name: this.taskId
          })
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        
        if (data.message) {
          this.task = data.message
        } else {
          // Try alternative API endpoint
          await this.loadTaskAlternative()
        }
      } catch (error) {
        console.error('Error loading task with primary method:', error)
        // Try alternative method
        await this.loadTaskAlternative()
      }
    },

    async loadTaskAlternative() {
      try {
        // Method 2: Using direct resource endpoint
        const response = await fetch(`/api/resource/Task/${encodeURIComponent(this.taskId)}`, {
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
        this.task = data.data
      } catch (error) {
        console.error('Error loading task with alternative method:', error)
        throw new Error(`Task "${this.taskId}" not found`)
      }
    },
    
    async loadTimesheets() {
  try {
    console.log("🔄 Fetching all timesheets...")

    // Fetch all timesheets (basic info only)
    const response = await fetch('/api/method/frappe.client.get_list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Frappe-CSRF-Token': this.getCSRFToken()
      },
      body: JSON.stringify({
        doctype: 'Timesheet',
        fields: ['name', 'start_date', 'end_date', 'status', 'total_hours'],
        limit_page_length: 100,
        order_by: 'start_date desc'
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("✅ Timesheets fetched:", data)

    // Now fetch each timesheet in detail to get the time_logs
    const timesheetDetails = await Promise.all(
      data.message.map(async (ts) => {
        console.log(`🔍 Fetching details for Timesheet: ${ts.name}`)

        const detailResponse = await fetch('/api/method/frappe.client.get', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': this.getCSRFToken()
          },
          body: JSON.stringify({
            doctype: 'Timesheet',
            name: ts.name
          })
        })

        if (!detailResponse.ok) {
          console.error(`❌ Failed to fetch details for ${ts.name}`)
          return null
        }

        const detailData = await detailResponse.json()
        console.log(`📄 Timesheet ${ts.name} details:`, detailData)

        return detailData.message
      })
    )

    // Filter only valid results
    const validTimesheets = timesheetDetails.filter(ts => ts !== null)

    // Now filter by time_logs for this specific task
    this.timesheets = validTimesheets.filter(ts => {
      if (!ts.time_logs || ts.time_logs.length === 0) {
        console.log(`⚠️ Timesheet ${ts.name} has no time_logs`)
        return false
      }

      const match = ts.time_logs.some(log => log.task === this.taskId)
      if (match) {
        console.log(`✅ Timesheet ${ts.name} contains task ${this.taskId}`)
      } else {
        console.log(`❌ Timesheet ${ts.name} does NOT contain task ${this.taskId}`)
      }

      return match
    })

    console.log("🎯 Final filtered timesheets:", this.timesheets)

  } catch (error) {
    console.error('💥 Error loading timesheets:', error)
    this.timesheets = []
  }
},


    getCSRFToken() {
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      console.log('CSRF Token:', token ? 'Found' : 'Not found')
      return token
    },
    
    getStatusClass(status) {
      const classes = {
        'Open': 'bg-blue-900 text-blue-200',
        'Working': 'bg-yellow-900 text-yellow-200',
        'Completed': 'bg-green-900 text-green-200',
        'Cancelled': 'bg-red-900 text-red-200',
        'Overdue': 'bg-red-900 text-red-200'
      }
      return classes[status] || 'bg-gray-700 text-gray-300'
    },
    
    getPriorityClass(priority) {
      const classes = {
        'Low': 'bg-green-900 text-green-200',
        'Medium': 'bg-yellow-900 text-yellow-200',
        'High': 'bg-orange-900 text-orange-200',
        'Urgent': 'bg-red-900 text-red-200'
      }
      return classes[priority] || 'bg-gray-700 text-gray-300'
    },
    
    getTimesheetStatusClass(status) {
      const classes = {
        'Draft': 'bg-gray-700 text-gray-300',
        'Submitted': 'bg-blue-900 text-blue-200',
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