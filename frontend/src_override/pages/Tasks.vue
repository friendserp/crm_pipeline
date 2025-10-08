<!-- Tasks.vue -->
<template>
  <div class="w-full bg-[#233d48]">
    <!-- Header -->
    <div class="bg-[#233d48] border-b border-[#2a4a58]">
      <div class="container mx-auto px-6 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-white">Jobs</h1>
          <button 
            @click="showCreateModal = true"
            class="bg-[#2E86AB] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#257195] transition-colors"
          >
            Create Job
          </button>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-6 py-6">
      <!-- Overview Section -->
      <div class="mb-8">
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div class="bg-[#2a4a58] rounded-lg border border-[#315566] p-4 hover:border-[#2E86AB] transition-colors">
            <div class="text-sm text-gray-300">Ending within 30 days</div>
            <div class="text-xl font-semibold text-white">{{ overview.ending_soon }}</div>
          </div>
          <div class="bg-[#2a4a58] rounded-lg border border-[#315566] p-4 hover:border-[#2E86AB] transition-colors">
            <div class="text-sm text-gray-300">Late</div>
            <div class="text-xl font-semibold text-red-400">{{ overview.late }}</div>
          </div>
          <div class="bg-[#2a4a58] rounded-lg border border-[#315566] p-4 hover:border-[#2E86AB] transition-colors">
            <div class="text-sm text-gray-300">Requires invoicing</div>
            <div class="text-xl font-semibold text-white">{{ overview.requires_invoicing }}</div>
          </div>
          <div class="bg-[#2a4a58] rounded-lg border border-[#315566] p-4 hover:border-[#2E86AB] transition-colors">
            <div class="text-sm text-gray-300">Action Required</div>
            <div class="text-xl font-semibold text-white">{{ overview.action_required }}</div>
          </div>
          <div class="bg-[#2a4a58] rounded-lg border border-[#315566] p-4 hover:border-[#2E86AB] transition-colors">
            <div class="text-sm text-gray-300">Unscheduled</div>
            <div class="text-xl font-semibold text-white">{{ overview.unscheduled }}</div>
          </div>
        </div>
      </div>

      <!-- All Tasks Section -->
      <div class="bg-[#2a4a58] rounded-lg border border-[#315566]">
        <div class="p-6 border-b border-[#315566]">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-lg font-semibold text-white">All tasks</h2>
              <div class="text-sm text-gray-300 mt-1">({{ filteredTasks.length }} results)</div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="p-6 border-b border-[#315566] bg-[#315566]">
          <div class="flex flex-wrap gap-6">
            <div>
              <label class="text-sm text-gray-300 block mb-2 font-medium">Status</label>
              <select v-model="filters.status" class="bg-[#233d48] border border-[#315566] text-white rounded-lg px-4 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent">
                <option value="all">All</option>
                <option value="Open">Open</option>
                <option value="Working">Working</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label class="text-sm text-gray-300 block mb-2 font-medium">Priority</label>
              <select v-model="filters.priority" class="bg-[#233d48] border border-[#315566] text-white rounded-lg px-4 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent">
                <option value="all">All</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label class="text-sm text-gray-300 block mb-2 font-medium">Type</label>
              <select v-model="filters.type" class="bg-[#233d48] border border-[#315566] text-white rounded-lg px-4 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent">
                <option value="all">All</option>
                <option value="One-off job">One-off job</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Tasks Table -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-[#315566] border-b border-[#315566]">
              <tr>
                <th class="text-left py-4 px-6 text-sm font-medium text-gray-300">Task</th>
                <th class="text-left py-4 px-6 text-sm font-medium text-gray-300">Priority</th>
                <th class="text-left py-4 px-6 text-sm font-medium text-gray-300">Schedule</th>
                <th class="text-left py-4 px-6 text-sm font-medium text-gray-300">Status</th>
                <th class="text-left py-4 px-6 text-sm font-medium text-gray-300">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#315566]">
              <tr v-if="filteredTasks.length === 0">
                <td colspan="5" class="text-center py-8 text-gray-400">
                  No tasks found
                </td>
              </tr>
              
              <tr v-for="task in filteredTasks" :key="task.name" 
                  class="hover:bg-[#315566] cursor-pointer transition-colors group"
                  @click="viewTask(task.name)">
                <td class="py-4 px-6">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0 w-2 h-2 rounded-full" :class="getStatusColor(task.status)"></div>
                    <div>
                      <div class="font-medium text-white group-hover:text-[#2E86AB] transition-colors">
                        {{ task.subject }}
                      </div>
                      <div class="text-sm text-gray-400 mt-1">#{{ task.name }} • {{ task.type }}</div>
                      <div class="text-sm text-gray-400 mt-1">
                        <span v-if="task.exp_start_date && task.exp_end_date">
                          {{ formatDate(task.exp_start_date) }} - {{ formatDate(task.exp_end_date) }}
                        </span>
                        <span v-else-if="task.exp_start_date">
                          Starts {{ formatDate(task.exp_start_date) }}
                        </span>
                        <span v-else>No dates set</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                        :class="getPriorityClass(task.priority)">
                    {{ task.priority }}
                  </span>
                </td>
                <td class="py-4 px-6">
                  <div class="text-sm text-white">{{ task.actual_time || 0 }} hrs logged</div>
                  <div class="text-sm text-gray-400">Progress: {{ task.progress }}%</div>
                </td>
                <td class="py-4 px-6">
                  <div class="flex items-center gap-2">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                          :class="getStatusClass(task.status)">
                      {{ task.status }}
                    </span>
                    <span v-if="isLate(task)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900 text-red-200">
                      Late
                    </span>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <div class="font-medium text-white">{{ formatCurrency(task.total_billing_amount) }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create Task Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-[#2a4a58] rounded-lg shadow-xl w-full max-w-2xl border border-[#315566]">
        <div class="p-6 border-b border-[#315566] bg-[#315566]">
          <h3 class="text-xl font-semibold text-white">Create New Job</h3>
        </div>
        
        <div class="p-6">
          <form @submit.prevent="createTask">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Subject *</label>
                <input 
                  type="text" 
                  v-model="newTask.subject"
                  required
                  class="w-full px-3 py-2 border border-[#315566] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent bg-[#233d48] text-white"
                  placeholder="Enter task subject"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Type</label>
                <select 
                  v-model="newTask.type"
                  class="w-full px-3 py-2 border border-[#315566] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent bg-[#233d48] text-white"
                >
                  <option value="One-off job">One-off job</option>
                  <option value="Recurring job">Recurring job</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                <select 
                  v-model="newTask.priority"
                  class="w-full px-3 py-2 border border-[#315566] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent bg-[#233d48] text-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select 
                  v-model="newTask.status"
                  class="w-full px-3 py-2 border border-[#315566] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent bg-[#233d48] text-white"
                >
                  <option value="Open">Open</option>
                  <option value="Working">Working</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                <input 
                  type="date" 
                  v-model="newTask.exp_start_date"
                  class="w-full px-3 py-2 border border-[#315566] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent bg-[#233d48] text-white"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                <input 
                  type="date" 
                  v-model="newTask.exp_end_date"
                  class="w-full px-3 py-2 border border-[#315566] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent bg-[#233d48] text-white"
                >
              </div>
            </div>
            
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea 
                v-model="newTask.description"
                rows="4"
                class="w-full px-3 py-2 border border-[#315566] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent bg-[#233d48] text-white"
                placeholder="Enter task description"
              ></textarea>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Expected Time (hours)</label>
                <input 
                  type="number" 
                  v-model="newTask.expected_time"
                  step="0.5"
                  min="0"
                  class="w-full px-3 py-2 border border-[#315566] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent bg-[#233d48] text-white"
                  placeholder="0.0"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Progress (%)</label>
                <input 
                  type="number" 
                  v-model="newTask.progress"
                  min="0"
                  max="100"
                  class="w-full px-3 py-2 border border-[#315566] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent bg-[#233d48] text-white"
                  placeholder="0"
                >
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4 border-t border-[#315566]">
              <button 
                type="button"
                @click="showCreateModal = false"
                class="px-4 py-2 border border-[#315566] text-gray-300 bg-transparent hover:bg-[#233d48] font-medium rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                type="submit"
                :disabled="isCreating"
                :class="[
                  'px-4 py-2 font-medium rounded-md transition-colors duration-200 flex items-center',
                  isCreating
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-[#2E86AB] hover:bg-[#257195] text-white'
                ]"
              >
                <svg v-if="isCreating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isCreating ? 'Creating...' : 'Create Job' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tasks',
  data() {
    return {
      tasks: [],
      timesheets: [],
      filters: {
        status: 'all',
        priority: 'all',
        type: 'all'
      },
      overview: {
        ending_soon: 0,
        late: 0,
        requires_invoicing: 0,
        action_required: 0,
        unscheduled: 0
      },
      loading: false,
      showCreateModal: false,
      isCreating: false,
      newTask: {
        subject: '',
        type: 'One-off job',
        priority: 'Medium',
        status: 'Open',
        exp_start_date: '',
        exp_end_date: '',
        description: '',
        expected_time: 0,
        progress: 0,
        company: 'Friends ERP'
      }
    }
  },
  computed: {
    filteredTasks() {
      return this.tasks.filter(task => {
        if (this.filters.status !== 'all' && task.status !== this.filters.status) return false
        if (this.filters.priority !== 'all' && task.priority !== this.filters.priority) return false
        if (this.filters.type !== 'all' && task.type !== this.filters.type) return false
        return true
      })
    },
    recentTimesheets() {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      return this.timesheets.filter(ts => {
        if (!ts.start_date) return false
        const startDate = new Date(ts.start_date)
        return startDate >= thirtyDaysAgo && ts.time_logs?.some(log => log.task)
      }).map(ts => {
        const taskId = ts.time_logs?.find(log => log.task)?.task
        const task = this.tasks.find(t => t.name === taskId)
        return {
          ...ts,
          task_name: task ? task.subject : 'Unknown Task'
        }
      }).slice(0, 5)
    }
  },
  async mounted() {
    await this.loadData()
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
    viewTask(taskId) {
      this.$router.push(`/tasks/${taskId}`)
    },
    
    async loadData() {
      this.loading = true
      try {
        await Promise.all([
          this.loadTasks(),
          this.loadTimesheets()
        ])
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        this.loading = false
      }
    },
    
    async loadTasks() {
      try {
        const response = await fetch('/api/method/frappe.client.get_list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': this.getCSRFToken()
          },
          body: JSON.stringify({
            doctype: 'Task',
            fields: [
              '*'
            ],
            limit_page_length: 100,
            order_by: 'modified desc'
          })
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        this.tasks = data.message || []
        this.calculateOverview()
      } catch (error) {
        console.error('Error loading tasks:', error)
      }
    },
    
    async loadTimesheets() {
      try {
        const response = await fetch('/api/method/frappe.client.get_list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': this.getCSRFToken()
          },
          body: JSON.stringify({
            doctype: 'Timesheet',
            fields: [
              'name', 'start_date', 'end_date', 'status', 'total_hours',
              'time_logs'
            ],
            limit_page_length: 50,
            order_by: 'start_date desc'
          })
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        this.timesheets = data.message || []
      } catch (error) {
        console.error('Error loading timesheets:', error)
      }
    },

    async createTask() {
      if (!this.newTask.subject.trim()) {
        this.showAlert('Please enter a task subject', 'red')
        return
      }

      this.isCreating = true
      try {
        const response = await fetch('/api/method/frappe.client.insert', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': this.getCSRFToken()
          },
          body: JSON.stringify({
            doc: {
              doctype: 'Task',
              subject: this.newTask.subject,
              type: this.newTask.type,
              priority: this.newTask.priority,
              status: this.newTask.status,
              exp_start_date: this.newTask.exp_start_date || undefined,
              exp_end_date: this.newTask.exp_end_date || undefined,
              description: this.newTask.description,
              expected_time: parseFloat(this.newTask.expected_time) || 0,
              progress: parseFloat(this.newTask.progress) || 0,
              company: this.newTask.company
            }
          })
        })

        if (response.ok) {
          const data = await response.json()
          this.showAlert('Task created successfully!', 'green')
          this.showCreateModal = false
          this.resetNewTask()
          await this.loadTasks() // Reload tasks to show the new one
        } else {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to create task')
        }
      } catch (error) {
        console.error('Error creating task:', error)
        this.showAlert('Error creating task: ' + error.message, 'red')
      } finally {
        this.isCreating = false
      }
    },

    resetNewTask() {
      this.newTask = {
        subject: '',
        type: 'One-off job',
        priority: 'Medium',
        status: 'Open',
        exp_start_date: '',
        exp_end_date: '',
        description: '',
        expected_time: 0,
        progress: 0,
        company: 'Friends ERP'
      }
    },

    showAlert(message, type) {
      // Simple alert implementation
      const alertDiv = document.createElement('div')
      alertDiv.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
        type === 'green' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`
      alertDiv.textContent = message
      
      document.body.appendChild(alertDiv)
      
      setTimeout(() => {
        document.body.removeChild(alertDiv)
      }, 3000)
    },

    getCSRFToken() {
      return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
    },
    
    calculateOverview() {
      const now = new Date()
      const thirtyDaysFromNow = new Date(now)
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
      
      this.overview = {
        ending_soon: this.tasks.filter(task => {
          if (!task.exp_end_date) return false
          const endDate = new Date(task.exp_end_date)
          return endDate <= thirtyDaysFromNow && endDate >= now && task.status !== 'Completed'
        }).length,
        
        late: this.tasks.filter(task => this.isLate(task)).length,
        
        requires_invoicing: this.tasks.filter(task => 
          task.total_billing_amount > 0 && task.status === 'Completed'
        ).length,
        
        action_required: this.tasks.filter(task => 
          ['Open', 'Working'].includes(task.status) && (task.progress === 0 || this.isLate(task))
        ).length,
        
        unscheduled: this.tasks.filter(task => 
          !task.exp_start_date && !task.exp_end_date
        ).length
      }
    },
    
    isLate(task) {
      if (!task.exp_end_date || ['Completed', 'Cancelled'].includes(task.status)) return false
      const endDate = new Date(task.exp_end_date)
      const now = new Date()
      return endDate < now
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

    getStatusColor(status) {
      const colors = {
        'Open': 'bg-blue-500',
        'Working': 'bg-yellow-500',
        'Completed': 'bg-green-500',
        'Cancelled': 'bg-red-500',
        'Overdue': 'bg-red-500'
      }
      return colors[status] || 'bg-gray-500'
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
    
    formatDate(dateString) {
      if (!dateString) return 'No date'
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
  }
}
</script>