<template>
  <div class="h-full bg-[#233d48] p-6">
    <!-- Floating Timer Display (when minimized) -->
    <div 
      v-if="timer.isRunning && !showTimerModal" 
      class="fixed top-4 right-4 bg-[#8acc33] text-white px-4 py-2 rounded-lg shadow-lg z-40 cursor-pointer"
      @click="showTimerModal = true"
    >
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <span class="font-bold">{{ timer.displayTime }}</span>
        <span class="text-sm">• Click to open</span>
      </div>
    </div>

    <!-- Main Centered Container -->
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="mb-8">
        <p class="bg-blue-500 text-white text-sm rounded-lg p-2 inline-block">Connect, Grow & Plus plan feature</p>
        <h1 class="text-3xl font-bold text-white mb-2 mt-4">Timesheets</h1>
        <div class="text-gray-300 text-lg">
          <p class="font-bold text-lg">{{ currentUser?.full_name || 'Demo User' }}</p>
          <p>{{ currentUser?.email || 'user@example.com' }}</p>
        </div>
      </div>

      <!-- Time Period Selector and Actions -->
      <div class="bg-[#2a4a58] rounded-lg border border-[#2a4a58] p-4 mb-6">
        <div class="flex justify-between items-center">
          <div class="flex space-x-4 border-[#8acc33] border-b pb-2">
            <button 
              v-for="period in timePeriods" 
              :key="period"
              :class="[
                'px-4 py-2 font-medium rounded-lg transition-colors duration-200',
                selectedPeriod === period 
                  ? 'bg-[#8acc33] text-white' 
                  : 'text-gray-300 hover:text-white'
              ]"
              @click="selectedPeriod = period; loadTimesheets()"
            >
              {{ period }}
            </button>
          </div>
          <div class="flex space-x-3">
            <button 
              @click="createNewTimesheet"
              class="px-4 py-2 bg-[#8acc33] hover:bg-[#7abc22] text-white font-medium rounded-lg transition-colors duration-200"
            >
              New Timesheet
            </button>
            <button 
              @click="loadTimesheets"
              class="px-4 py-2 border border-[#8acc33] text-[#8acc33] bg-transparent hover:bg-[#2a4a58] font-medium rounded-lg transition-colors duration-200"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Timesheets List -->
      <div class="bg-[#2a4a58] rounded-lg border border-[#2a4a58] p-6 mb-6" v-if="timesheets.length > 0">
        <h3 class="text-xl font-semibold text-white mb-4">Existing Timesheets</h3>
        <div class="space-y-3">
          <div 
            v-for="timesheet in timesheets" 
            :key="timesheet.name"
            class="bg-[#233d48] rounded-lg p-4 border border-[#2a4a58] cursor-pointer hover:border-[#8acc33] transition-colors"
            @click="viewTimesheet(timesheet)"
          >
            <div class="flex justify-between items-center">
              <div>
                <div class="text-white font-semibold">{{ timesheet.name }}</div>
                <div class="text-gray-300 text-sm">
                  {{ formatDate(timesheet.start_date) }} - {{ formatDate(timesheet.end_date) }}
                </div>
                <div class="text-gray-400 text-xs mt-1">
                  Status: <span :class="statusColor(timesheet.status)">{{ timesheet.status }}</span>
                  • Total Hours: {{ timesheet.total_hours }}
                  • Company: {{ timesheet.company }}
                </div>
              </div>
              <div class="text-right">
                <div class="text-[#8acc33] font-semibold">{{ timesheet.total_hours }} hrs</div>
                <div class="text-gray-400 text-sm">{{ timesheet.time_logs?.length || 0 }} entries</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Current Timesheet Editor -->
      <div class="bg-[#2a4a58] rounded-lg border border-[#2a4a58] p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-white">
            {{ currentTimesheet.name || 'New Timesheet' }}
          </h3>
          <div class="flex space-x-3">
            <button 
              @click="saveTimesheet"
              :disabled="!hasChanges || isSaving"
              :class="[
                'px-4 py-2 font-medium rounded-lg transition-colors duration-200 flex items-center',
                hasChanges && !isSaving
                  ? 'bg-[#8acc33] hover:bg-[#7abc22] text-white'
                  : 'bg-gray-500 cursor-not-allowed text-gray-300'
              ]"
            >
              <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSaving ? 'Saving...' : (currentTimesheet.name ? 'Update' : 'Save') }}
            </button>
            <button 
              @click="submitTimesheet"
              v-if="currentTimesheet.name && currentTimesheet.status === 'Draft'"
              :disabled="isSubmitting"
              :class="[
                'px-4 py-2 font-medium rounded-lg transition-colors duration-200 flex items-center',
                isSubmitting
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              ]"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSubmitting ? 'Submitting...' : 'Submit' }}
            </button>
          </div>
        </div>

        <!-- Timesheet Details -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
            <input 
              type="date" 
              v-model="currentTimesheet.start_date"
              @change="hasChanges = true"
              class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">End Date</label>
            <input 
              type="date" 
              v-model="currentTimesheet.end_date"
              @change="hasChanges = true"
              class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Customer</label>
            <div class="relative">
              <input 
                type="text" 
                v-model="currentTimesheet.customer"
                @input="hasChanges = true"
                @focus="showCustomerDropdown = true"
                @blur="setTimeout(() => { showCustomerDropdown = false }, 200)"
                class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                placeholder="Select customer"
              />
              
              <!-- Customer Dropdown -->
              <div 
                v-if="showCustomerDropdown" 
                class="absolute z-10 w-full mt-1 bg-[#233d48] border border-[#2a4a58] rounded-md shadow-lg max-h-60 overflow-y-auto"
              >
                <div 
                  v-for="customer in filteredCustomers" 
                  :key="customer.name"
                  @mousedown="selectCustomer(customer)"
                  class="px-3 py-2 text-sm text-white hover:bg-[#2a4a58] cursor-pointer border-b border-[#2a4a58] last:border-b-0"
                >
                  <div class="font-medium">{{ customer.customer_name }}</div>
                  <div class="text-gray-400 text-xs">
                    {{ customer.email_id || 'No email' }} • {{ customer.mobile_no || 'No phone' }}
                  </div>
                </div>
                <div 
                  v-if="filteredCustomers.length === 0" 
                  class="px-3 py-2 text-sm text-gray-400"
                >
                  No customers found
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Time Logs Table -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold text-white mb-4">Time Entries</h4>
          
          <!-- Table Headers -->
          <div class="grid grid-cols-12 gap-4 mb-4 px-4 text-sm font-medium text-gray-300">
            <div class="col-span-2">Activity Type</div>
            <div class="col-span-3">Task/Project</div>
            <div class="col-span-2">From Time</div>
            <div class="col-span-2">To Time</div>
            <div class="col-span-2 text-right">Hours</div>
            <div class="col-span-1">Actions</div>
          </div>

          <!-- Time Log Rows -->
          <div class="space-y-3">
            <div 
              v-for="(log, index) in currentTimesheet.time_logs" 
              :key="index"
              class="grid grid-cols-12 gap-4 items-center bg-[#233d48] rounded-lg p-4 border border-[#2a4a58]"
            >
              <!-- Activity Type -->
              <div class="col-span-2">
                <select 
                  v-model="log.activity_type"
                  @change="updateLogHours(index)"
                  class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white text-sm"
                >
                  <option value="Communication">Communication</option>
                  <option value="Execution">Execution</option>
                  <option value="Planning">Planning</option>
                  <option value="Research">Research</option>
                  <option value="Testing">Testing</option>
                  <option value="Training">Training</option>
                </select>
              </div>
              
              <!-- Task/Project -->
              <div class="col-span-3">
                <div class="relative">
                  <input 
                    type="text" 
                    v-model="log.task"
                    @input="hasChanges = true"
                    @focus="showTaskDropdown(index)"
                    @blur="setTimeout(() => { hideTaskDropdown(index) }, 200)"
                    class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white text-sm"
                    placeholder="Select or type task"
                  />
                  
                  <!-- Task Dropdown -->
                  <div 
                    v-if="log.showTaskDropdown" 
                    class="absolute z-10 w-full mt-1 bg-[#233d48] border border-[#2a4a58] rounded-md shadow-lg max-h-60 overflow-y-auto"
                  >
                    <div 
                      v-for="task in filteredTasks(log.task)" 
                      :key="task.name"
                      @mousedown="selectTask(index, task)"
                      class="px-3 py-2 text-sm text-white hover:bg-[#2a4a58] cursor-pointer border-b border-[#2a4a58] last:border-b-0"
                    >
                      <div class="font-medium">{{ task.subject }}</div>
                      <div class="text-gray-400 text-xs">
                        {{ task.status }} • {{ task.project || 'No Project' }}
                      </div>
                    </div>
                    <div 
                      v-if="filteredTasks(log.task).length === 0" 
                      class="px-3 py-2 text-sm text-gray-400"
                    >
                      No tasks found
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- From Time -->
              <div class="col-span-2">
                <input 
                  type="datetime-local" 
                  v-model="log.from_time"
                  @change="updateLogHours(index)"
                  class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white text-sm"
                >
              </div>
              
              <!-- To Time -->
              <div class="col-span-2">
                <input 
                  type="datetime-local" 
                  v-model="log.to_time"
                  @change="updateLogHours(index)"
                  class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white text-sm"
                >
              </div>
              
              <!-- Hours -->
              <div class="col-span-2 text-right">
                <div class="text-[#8acc33] font-semibold text-sm">{{ log.hours || '0.00' }}</div>
              </div>
              
              <!-- Actions -->
              <div class="col-span-1 text-center">
                <button 
                  @click="removeTimeLog(index)"
                  class="text-red-400 hover:text-red-300 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Add Time and Timer Controls -->
        <div class="bg-[#233d48] rounded-lg border border-[#2a4a58] p-6 mb-6">
          <div class="flex justify-between items-center">
            <div class="flex space-x-4">
              <button 
                @click="addTimeLog"
                class="px-6 py-3 border-2 border-dashed border-[#8acc33] text-[#8acc33] bg-transparent hover:bg-[#2a4a58] font-medium rounded-lg transition-colors duration-200 flex items-center"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Add Time Entry
              </button>
              
              <button 
                @click="startTimer"
                :disabled="timer.isRunning"
                :class="[
                  'px-6 py-3 font-medium rounded-lg transition-colors duration-200 flex items-center',
                  timer.isRunning 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-[#8acc33] hover:bg-[#7abc22] text-white'
                ]"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ timer.isRunning ? 'Timer Running' : 'Start Timer' }}
              </button>
            </div>
            
            <!-- Total Hours -->
            <div class="text-right">
              <div class="text-lg font-semibold text-[#8acc33]">Total Hours: {{ totalHours }}</div>
              <div class="text-sm text-gray-300">{{ currentTimesheet.time_logs?.length || 0 }} entries</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Timer Modal -->
    <div 
      v-if="showTimerModal && timer.isRunning" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="showTimerModal = false"
    >
      <div 
        class="bg-[#233d48] rounded-lg shadow-xl w-full max-w-md border border-[#2a4a58]"
        @click.stop
      >
        <div class="p-6 border-b border-[#2a4a58] bg-[#2a4a58]">
          <h3 class="text-xl font-semibold text-white">Time Tracking Active</h3>
        </div>
        
        <div class="p-6">
          <div class="text-4xl font-bold text-[#8acc33] mb-6 text-center">{{ timer.displayTime }}</div>
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div class="text-sm text-gray-300">Started</div>
              <div class="text-white font-medium">{{ timer.startTimeDisplay }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-300">Activity Type</div>
              <div class="text-white font-medium">{{ timer.activity_type }}</div>
            </div>
          </div>
          <div class="flex space-x-3">
            <button 
              @click="stopTimerAndAddLog"
              class="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-colors duration-200"
            >
              Stop & Add Entry
            </button>
            <button 
              @click="showTimerModal = false"
              class="px-6 py-2 border border-[#8acc33] text-[#8acc33] bg-transparent hover:bg-[#2a4a58] font-medium rounded-md transition-colors duration-200"
            >
              Minimize
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimesheetsPage',
  data() {
    return {
      selectedPeriod: 'Today',
      timePeriods: ['Today', 'Week', 'Month'],
      currentUser: {},
      timesheets: [],
      tasks: [], // Store fetched tasks
      customers: [], // Store fetched customers
      showTimerModal: false,
      showCustomerDropdown: false,
      timer: {
        startTime: null,
        displayTime: '0:00:00',
        startTimeDisplay: '',
        interval: null,
        isRunning: false,
        activity_type: 'Execution'
      },
      currentTimesheet: {
        name: null,
        start_date: this.getTodayDate(),
        end_date: this.getTodayDate(),
        customer: '',
        company: '',
        status: 'Draft',
        time_logs: []
      },
      hasChanges: false,
      isSaving: false,
      isSubmitting: false
    }
  },
  computed: {
    totalHours() {
      if (!this.currentTimesheet.time_logs) return '0.00';
      
      const total = this.currentTimesheet.time_logs.reduce((sum, log) => {
        return sum + (parseFloat(log.hours) || 0);
      }, 0);
      
      return total.toFixed(3);
    },
    
    filteredCustomers() {
      if (!this.currentTimesheet.customer) {
        return this.customers.slice(0, 10); // Show first 10 customers when no search
      }
      
      const term = this.currentTimesheet.customer.toLowerCase();
      return this.customers.filter(customer => 
        customer.customer_name.toLowerCase().includes(term) ||
        (customer.email_id && customer.email_id.toLowerCase().includes(term)) ||
        (customer.mobile_no && customer.mobile_no.includes(term))
      ).slice(0, 10); // Limit to 10 results
    }
  },
  async mounted() {
    await this.loadCurrentUser();
    await this.loadTasks(); // Load tasks on component mount
    await this.loadCustomers(); // Load customers on component mount
    await this.loadTimesheets();
    this.initializeNewTimesheet();
  },
  methods: {
    getTodayDate() {
      return new Date().toISOString().split('T')[0];
    },
    
    async loadCurrentUser() {
      try {
        const response = await fetch('/api/method/frappe.auth.get_logged_user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': this.getCSRFToken()
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          this.currentUser = data.message;
        }
      } catch (error) {
        console.error('Error loading user:', error);
        this.currentUser = { full_name: 'Demo User', email: 'user@example.com' };
      }
    },
    
    // Method to fetch customers from backend
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
            fields: ['name', 'customer_name', 'email_id', 'mobile_no', 'customer_type', 'territory'],
            filters: [['disabled', '=', 0]], // Only active customers
            order_by: 'customer_name asc',
            limit: 200
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          this.customers = data.message || [];
        } else {
          console.error('Failed to load customers');

        }
      } catch (error) {
        console.error('Error loading customers:', error);
      }
    },
    
    // Select customer from dropdown
    selectCustomer(customer) {
      this.currentTimesheet.customer = customer.customer_name;
      this.showCustomerDropdown = false;
      this.hasChanges = true;
    },
    
    // New method to fetch tasks from backend
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
            fields: ['name', 'subject', 'status', 'project', 'priority', 'exp_start_date', 'exp_end_date'],
            filters: [['status', 'not in', ['Completed', 'Cancelled']]],
            order_by: 'modified desc',
            limit: 100
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          this.tasks = data.message || [];
        } else {
          console.error('Failed to load tasks');
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    },
    
    // Filter tasks based on search input
    filteredTasks(searchTerm) {
      if (!searchTerm) {
        return this.tasks.slice(0, 10); // Show first 10 tasks when no search
      }
      
      const term = searchTerm.toLowerCase();
      return this.tasks.filter(task => 
        task.subject.toLowerCase().includes(term) ||
        (task.project && task.project.toLowerCase().includes(term))
      ).slice(0, 10); // Limit to 10 results
    },
    
    // Show task dropdown for specific log entry
    showTaskDropdown(index) {
      this.currentTimesheet.time_logs[index].showTaskDropdown = true;
    },
    
    // Hide task dropdown for specific log entry
    hideTaskDropdown(index) {
      this.currentTimesheet.time_logs[index].showTaskDropdown = false;
    },
    
    // Select a task for the log entry (using task name directly)
    selectTask(index, task) {
      this.currentTimesheet.time_logs[index].task = task.name;
      this.currentTimesheet.time_logs[index].showTaskDropdown = false;
      this.hasChanges = true;
    },
    
    async loadTimesheets() {
      try {
        let filters = {};
        
        if (this.selectedPeriod === 'Today') {
          filters = { start_date: ['>=', this.getTodayDate()] };
        } else if (this.selectedPeriod === 'Week') {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          filters = { start_date: ['>=', weekAgo.toISOString().split('T')[0]] };
        }
        
        const response = await fetch('/api/method/frappe.client.get_list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': this.getCSRFToken()
          },
          body: JSON.stringify({
            doctype: 'Timesheet',
            fields: ['*'],
            filters: filters,
            order_by: 'creation desc'
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          this.timesheets = data.message;
        } else {
          throw new Error('Failed to load timesheets');
        }
      } catch (error) {
        console.error('Error loading timesheets:', error);
        this.showAlert('Error loading timesheets', 'red');
      }
    },
    
    initializeNewTimesheet() {
      this.currentTimesheet = {
        name: null,
        start_date: this.getTodayDate(),
        end_date: this.getTodayDate(),
        customer: '',
        company: '',
        status: 'Draft',
        time_logs: [this.createEmptyTimeLog()]
      };
      this.hasChanges = false;
    },
    
    createEmptyTimeLog() {
      const now = new Date();
      const fromTime = new Date(now.getTime() - (60 * 60 * 1000)); // 1 hour ago
      
      return {
        activity_type: 'Execution',
        from_time: fromTime.toISOString().slice(0, 16),
        to_time: now.toISOString().slice(0, 16),
        task: '',
        hours: '1.000',
        is_billable: 0,
        showTaskDropdown: false
      };
    },
    
    addTimeLog() {
      this.currentTimesheet.time_logs.push(this.createEmptyTimeLog());
      this.hasChanges = true;
    },
    
    removeTimeLog(index) {
      this.currentTimesheet.time_logs.splice(index, 1);
      this.hasChanges = true;
    },
    
    updateLogHours(index) {
      const log = this.currentTimesheet.time_logs[index];
      if (log.from_time && log.to_time) {
        const fromTime = new Date(log.from_time);
        const toTime = new Date(log.to_time);
        
        const diffMs = toTime - fromTime;
        const hours = diffMs / (1000 * 60 * 60);
        
        log.hours = hours.toFixed(6);
      }
      this.hasChanges = true;
    },
    
    createNewTimesheet() {
      this.initializeNewTimesheet();
    },
    
    viewTimesheet(timesheet) {
      this.currentTimesheet = JSON.parse(JSON.stringify(timesheet));
      // Ensure each log has the showTaskDropdown property
      this.currentTimesheet.time_logs = this.currentTimesheet.time_logs.map(log => ({
        ...log,
        showTaskDropdown: false
      }));
      this.hasChanges = false;
    },
    
    async saveTimesheet() {
      if (this.isSaving) return;
      
      this.isSaving = true;
      
      try {
        let response;
        
        // Prepare timesheet data without the dropdown property
        const timesheetData = {
          ...this.currentTimesheet,
          time_logs: this.currentTimesheet.time_logs.map(log => ({
            activity_type: log.activity_type,
            from_time: log.from_time,
            to_time: log.to_time,
            task: log.task, // Only storing task name, not task_id
            hours: log.hours,
            is_billable: log.is_billable
          }))
        };
        
        if (this.currentTimesheet.name) {
          // Update existing timesheet
          response = await fetch('/api/method/frappe.client.save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Frappe-CSRF-Token': this.getCSRFToken()
            },
            body: JSON.stringify({
              doc: timesheetData
            })
          });
        } else {
          // Create new timesheet
          response = await fetch('/api/method/frappe.client.insert', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Frappe-CSRF-Token': this.getCSRFToken()
            },
            body: JSON.stringify({
              doc: {
                doctype: 'Timesheet',
                ...timesheetData
              }
            })
          });
        }
        
        if (response.ok) {
          const data = await response.json();
          
          if (!this.currentTimesheet.name) {
            this.currentTimesheet.name = data.message.name;
          }
          
          this.showAlert('Timesheet saved successfully', 'green');
          this.hasChanges = false;
          this.loadTimesheets();
        } else {
          throw new Error('Failed to save timesheet');
        }
      } catch (error) {
        console.error('Error saving timesheet:', error);
        this.showAlert('Error saving timesheet', 'red');
      } finally {
        this.isSaving = false;
      }
    },
    
    async submitTimesheet() {
      if (this.isSubmitting) return;
      
      this.isSubmitting = true;
      
      try {
        const response = await fetch('/api/method/frappe.client.set_value', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': this.getCSRFToken()
          },
          body: JSON.stringify({
            doctype: 'Timesheet',
            name: this.currentTimesheet.name,
            fieldname: {
              status: 'Submitted'
            }
          })
        });
        
        if (response.ok) {
          this.currentTimesheet.status = 'Submitted';
          this.hasChanges = false;
          this.showAlert('Timesheet submitted successfully', 'green');
          this.loadTimesheets();
        } else {
          throw new Error('Failed to submit timesheet');
        }
      } catch (error) {
        console.error('Error submitting timesheet:', error);
        this.showAlert('Error submitting timesheet', 'red');
      } finally {
        this.isSubmitting = false;
      }
    },
    
    startTimer() {
      if (this.timer.isRunning) return;
      
      const now = new Date();
      this.timer.startTime = now;
      this.timer.startTimeDisplay = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      this.timer.isRunning = true;
      this.showTimerModal = true;
      
      this.timer.interval = setInterval(() => {
        const currentTime = new Date();
        const diff = currentTime - this.timer.startTime;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        this.timer.displayTime = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }, 1000);
    },
    
    stopTimerAndAddLog() {
      if (!this.timer.isRunning) return;
      
      if (this.timer.interval) {
        clearInterval(this.timer.interval);
      }
      
      const now = new Date();
      const endTime = now.toISOString().slice(0, 16);
      const startTime = this.timer.startTime.toISOString().slice(0, 16);
      
      const diffMs = now - this.timer.startTime;
      const hours = (diffMs / (1000 * 60 * 60)).toFixed(6);
      
      this.currentTimesheet.time_logs.push({
        activity_type: this.timer.activity_type,
        from_time: startTime,
        to_time: endTime,
        task: '',
        hours: hours,
        is_billable: 0,
        showTaskDropdown: false
      });
      
      this.timer.isRunning = false;
      this.showTimerModal = false;
      this.timer.displayTime = '0:00:00';
      this.hasChanges = true;
      
      this.showAlert('Time entry added from timer', 'green');
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    
    statusColor(status) {
      const colors = {
        'Draft': 'text-yellow-400',
        'Submitted': 'text-green-400',
        'Cancelled': 'text-red-400'
      };
      return colors[status] || 'text-gray-400';
    },
    
    getCSRFToken() {
      const metaTag = document.querySelector('meta[name="csrf-token"]');
      return metaTag ? metaTag.getAttribute('content') : '';
    },
    
    showAlert(message, indicator) {
      // Simple alert implementation - you can replace with your preferred notification system
      const alertDiv = document.createElement('div');
      alertDiv.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 ${
        indicator === 'green' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`;
      alertDiv.textContent = message;
      
      document.body.appendChild(alertDiv);
      
      setTimeout(() => {
        document.body.removeChild(alertDiv);
      }, 3000);
    },
    
  }
}
</script>

<style scoped>
/* Custom styles for better text readability */
select option {
  background-color: #233d48;
  color: white;
}

/* Ensure proper styling for all interactive elements */
input:focus, select:focus {
  outline: none;
  ring: 2px;
}

/* Style datetime input to look consistent */
input[type="datetime-local"] {
  font-size: 0.875rem;
}

input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}

/* Task dropdown styling */
.task-dropdown {
  max-height: 200px;
  overflow-y: auto;
}
</style>