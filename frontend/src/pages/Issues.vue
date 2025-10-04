<template>
  <div class="min-h-screen bg-[#233d48] py-6">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-white">Issues</h2>
        <div class="flex items-center space-x-4">
          <!-- View Selector Dropdown -->
          <div class="relative">
            <button
              @click="showViewDropdown = !showViewDropdown"
              class="flex items-center space-x-2 px-4 py-2 border border-[#8acc33] rounded-md bg-[#233d48] text-[#8acc33] hover:bg-[#2a4a58] focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent transition-colors duration-200"
            >
              <span>{{ activeView === 'list' ? 'List View' : 'Board View' }}</span>
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
                  @click="setActiveView('list')"
                  :class="[
                    'w-full text-left px-4 py-2 text-sm transition-colors duration-200',
                    activeView === 'list'
                      ? 'bg-[#8acc33] text-[#233d48] font-medium'
                      : 'text-[#8acc33] hover:bg-[#2a4a58]'
                  ]"
                >
                  List View
                </button>
                <button
                  @click="setActiveView('board')"
                  :class="[
                    'w-full text-left px-4 py-2 text-sm transition-colors duration-200',
                    activeView === 'board'
                      ? 'bg-[#8acc33] text-[#233d48] font-medium'
                      : 'text-[#8acc33] hover:bg-[#2a4a58]'
                  ]"
                >
                  Board View
                </button>
              </div>
            </div>
          </div>

          <!-- Create Issue Button -->
          <button 
            @click="showCreateIssueModal = true"
            class="border border-[#8acc33] text-[#8acc33] bg-[#233d48] hover:bg-[#2a4a58] px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <span>+</span>
            <span>Create Issue</span>
          </button>
        </div>
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
              <option value="Open">Open</option>
              <option value="Replied">Replied</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Priority</label>
            <select 
              v-model="filters.priority"
              class="px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
            >
              <option value="">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Date Range</label>
            <select 
              v-model="filters.dateRange"
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
              v-model="filters.search"
              placeholder="Search by subject, customer, or ID..."
              class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white placeholder-gray-400"
            >
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-if="activeView === 'list'" class="bg-[#233d48] rounded-lg shadow-sm border border-[#2a4a58] overflow-hidden">
        <div class="px-6 py-4 border-b border-[#2a4a58] bg-[#2a4a58]">
          <h3 class="text-lg font-medium text-white">Issues List</h3>
          <p class="mt-1 text-sm text-gray-300">All support issues and tickets</p>
        </div>

        <!-- Issues List -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-[#2a4a58]">
            <thead class="bg-[#2a4a58]">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Issue
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Priority
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-[#233d48] divide-y divide-[#2a4a58]">
              <tr 
                v-for="issue in filteredIssues" 
                :key="issue.name"
                class="hover:bg-[#2a4a58] transition-colors duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 bg-[#8acc33] rounded-full flex items-center justify-center">
                      <span class="text-[#233d48] font-medium text-sm">
                        {{ getInitials(issue.subject) }}
                      </span>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-white">
                        {{ issue.subject }}
                      </div>
                      <div class="text-sm text-gray-400">
                        {{ issue.name }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-white">{{ issue.customer || 'N/A' }}</div>
                  <div class="text-sm text-gray-400">{{ issue.raised_by }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="priorityBadgeClasses(issue.priority)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ issue.priority || 'Not Set' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="statusBadgeClasses(issue.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ issue.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {{ formatDate(issue.opening_date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button 
                      @click="viewIssue(issue)"
                      class="text-[#8acc33] hover:text-[#a8e64c] transition-colors duration-200"
                    >
                      View
                    </button>
                    <button 
                      @click="editIssue(issue)"
                      class="text-[#8acc33] hover:text-[#a8e64c] transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button 
                      @click="deleteIssue(issue)"
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
            v-if="filteredIssues.length === 0" 
            class="text-center py-12"
          >
            <div class="text-gray-400 mb-4">
              <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-white mb-2">No issues found</h3>
            <p class="text-gray-400 mb-4">Try adjusting your search or filter criteria</p>
            <button 
              @click="showCreateIssueModal = true"
              class="border border-[#8acc33] text-[#8acc33] bg-[#233d48] hover:bg-[#2a4a58] px-4 py-2 rounded-md font-medium transition-colors duration-200"
            >
              Create New Issue
            </button>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="filteredIssues.length > 0" class="px-6 py-4 border-t border-[#2a4a58] bg-[#2a4a58] flex items-center justify-between">
          <div class="text-sm text-gray-300">
            Showing <span class="font-medium">{{ filteredIssues.length }}</span> of <span class="font-medium">{{ issues.length }}</span> issues
          </div>
          <div class="flex space-x-2">
            <button 
              @click="currentPage--"
              :disabled="currentPage === 1"
              :class="[
                'px-3 py-1 rounded border border-[#8acc33] text-[#8acc33]',
                currentPage === 1 
                  ? 'bg-[#233d48] opacity-50 cursor-not-allowed' 
                  : 'bg-[#233d48] hover:bg-[#2a4a58]'
              ]"
            >
              Previous
            </button>
            <button 
              @click="currentPage++"
              :disabled="currentPage * itemsPerPage >= filteredIssues.length"
              :class="[
                'px-3 py-1 rounded border border-[#8acc33] text-[#8acc33]',
                currentPage * itemsPerPage >= filteredIssues.length
                  ? 'bg-[#233d48] opacity-50 cursor-not-allowed' 
                  : 'bg-[#233d48] hover:bg-[#2a4a58]'
              ]"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Board View -->
      <div v-if="activeView === 'board'" class="bg-[#233d48] rounded-lg shadow-sm border border-[#2a4a58] overflow-hidden">
        <div class="px-6 py-4 border-b border-[#2a4a58] bg-[#2a4a58]">
          <h3 class="text-lg font-medium text-white">Issues Board</h3>
          <p class="mt-1 text-sm text-gray-300">Kanban-style view of issues</p>
        </div>

        <div class="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <!-- Open Column -->
          <div class="bg-[#2a4a58] rounded-lg p-4">
            <h4 class="text-lg font-medium text-white mb-4">Open</h4>
            <div class="space-y-3">
              <div 
                v-for="issue in getIssuesByStatus('Open')" 
                :key="issue.name"
                class="bg-[#233d48] p-4 rounded-lg border border-[#2a4a58] hover:border-[#8acc33] transition-colors duration-200 cursor-pointer"
                @click="viewIssue(issue)"
              >
                <div class="flex justify-between items-start mb-2">
                  <h5 class="text-sm font-medium text-white">{{ issue.subject }}</h5>
                  <span :class="priorityBadgeClasses(issue.priority)" class="inline-flex items-center px-2 py-0.5 rounded text-xs">
                    {{ issue.priority || 'Not Set' }}
                  </span>
                </div>
                <p class="text-xs text-gray-400 mb-2">{{ issue.customer || 'N/A' }}</p>
                <p class="text-xs text-gray-400">{{ formatDate(issue.opening_date) }}</p>
              </div>
            </div>
          </div>

          <!-- Replied Column -->
          <div class="bg-[#2a4a58] rounded-lg p-4">
            <h4 class="text-lg font-medium text-white mb-4">Replied</h4>
            <div class="space-y-3">
              <div 
                v-for="issue in getIssuesByStatus('Replied')" 
                :key="issue.name"
                class="bg-[#233d48] p-4 rounded-lg border border-[#2a4a58] hover:border-[#8acc33] transition-colors duration-200 cursor-pointer"
                @click="viewIssue(issue)"
              >
                <div class="flex justify-between items-start mb-2">
                  <h5 class="text-sm font-medium text-white">{{ issue.subject }}</h5>
                  <span :class="priorityBadgeClasses(issue.priority)" class="inline-flex items-center px-2 py-0.5 rounded text-xs">
                    {{ issue.priority || 'Not Set' }}
                  </span>
                </div>
                <p class="text-xs text-gray-400 mb-2">{{ issue.customer || 'N/A' }}</p>
                <p class="text-xs text-gray-400">{{ formatDate(issue.opening_date) }}</p>
              </div>
            </div>
          </div>

          <!-- Resolved Column -->
          <div class="bg-[#2a4a58] rounded-lg p-4">
            <h4 class="text-lg font-medium text-white mb-4">Resolved</h4>
            <div class="space-y-3">
              <div 
                v-for="issue in getIssuesByStatus('Resolved')" 
                :key="issue.name"
                class="bg-[#233d48] p-4 rounded-lg border border-[#2a4a58] hover:border-[#8acc33] transition-colors duration-200 cursor-pointer"
                @click="viewIssue(issue)"
              >
                <div class="flex justify-between items-start mb-2">
                  <h5 class="text-sm font-medium text-white">{{ issue.subject }}</h5>
                  <span :class="priorityBadgeClasses(issue.priority)" class="inline-flex items-center px-2 py-0.5 rounded text-xs">
                    {{ issue.priority || 'Not Set' }}
                  </span>
                </div>
                <p class="text-xs text-gray-400 mb-2">{{ issue.customer || 'N/A' }}</p>
                <p class="text-xs text-gray-400">{{ formatDate(issue.opening_date) }}</p>
              </div>
            </div>
          </div>

          <!-- Closed Column -->
          <div class="bg-[#2a4a58] rounded-lg p-4">
            <h4 class="text-lg font-medium text-white mb-4">Closed</h4>
            <div class="space-y-3">
              <div 
                v-for="issue in getIssuesByStatus('Closed')" 
                :key="issue.name"
                class="bg-[#233d48] p-4 rounded-lg border border-[#2a4a58] hover:border-[#8acc33] transition-colors duration-200 cursor-pointer"
                @click="viewIssue(issue)"
              >
                <div class="flex justify-between items-start mb-2">
                  <h5 class="text-sm font-medium text-white">{{ issue.subject }}</h5>
                  <span :class="priorityBadgeClasses(issue.priority)" class="inline-flex items-center px-2 py-0.5 rounded text-xs">
                    {{ issue.priority || 'Not Set' }}
                  </span>
                </div>
                <p class="text-xs text-gray-400 mb-2">{{ issue.customer || 'N/A' }}</p>
                <p class="text-xs text-gray-400">{{ formatDate(issue.opening_date) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Issue Modal -->
      <div 
        v-if="showCreateIssueModal" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click="showCreateIssueModal = false"
      >
        <div 
          class="bg-[#233d48] rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#2a4a58]"
          @click.stop
        >
          <div class="p-6 border-b border-[#2a4a58] bg-[#2a4a58]">
            <h3 class="text-xl font-semibold text-white">Create New Issue</h3>
          </div>
          <form @submit.prevent="createIssue" class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Subject *</label>
                <input 
                  type="text" 
                  v-model="newIssue.subject" 
                  required
                  class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white placeholder-gray-400"
                  placeholder="Enter issue subject"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Customer</label>
                <input 
                  type="text" 
                  v-model="newIssue.customer" 
                  class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white placeholder-gray-400"
                  placeholder="Enter customer name"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                <select 
                  v-model="newIssue.priority"
                  class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                >
                  <option value="">Select Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select 
                  v-model="newIssue.status"
                  class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                >
                  <option value="Open">Open</option>
                  <option value="Replied">Replied</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea 
                v-model="newIssue.description" 
                rows="4"
                class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white placeholder-gray-400"
                placeholder="Enter issue description"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Raised By</label>
                <input 
                  type="email" 
                  v-model="newIssue.raised_by" 
                  class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white placeholder-gray-400"
                  placeholder="Enter email address"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Opening Date</label>
                <input 
                  type="date" 
                  v-model="newIssue.opening_date" 
                  class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                >
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 pt-6 border-t border-[#2a4a58]">
              <button 
                type="button" 
                @click="showCreateIssueModal = false"
                class="px-6 py-2 border border-[#8acc33] text-[#8acc33] bg-[#233d48] hover:bg-[#2a4a58] rounded-md font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="px-6 py-2 border border-[#8acc33] text-[#8acc33] bg-[#233d48] hover:bg-[#2a4a58] rounded-md font-medium transition-colors duration-200"
              >
                Create Issue
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- View Issue Modal -->
      <div 
        v-if="selectedIssue" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click="selectedIssue = null"
      >
        <IssueDetail 
          :issue="selectedIssue" 
          @close="selectedIssue = null"
          @issue-updated="handleIssueUpdated"
        />
      </div>
    </div>
  </div>
</template>

<script>
import IssueDetail from './Issue.vue'

export default {
  name: 'Issues',
  components: {
    IssueDetail
  },
  data() {
    return {
      activeView: 'list',
      showViewDropdown: false,
      issues: [],
      showCreateIssueModal: false,
      selectedIssue: null,
      filters: {
        status: '',
        priority: '',
        dateRange: 'all',
        search: ''
      },
      currentPage: 1,
      itemsPerPage: 10,
      newIssue: {
        subject: '',
        customer: '',
        priority: '',
        status: 'Open',
        description: '',
        raised_by: '',
        opening_date: new Date().toISOString().split('T')[0]
      }
    }
  },
  computed: {
    filteredIssues() {
      let filtered = this.issues;

      // Filter by status
      if (this.filters.status) {
        filtered = filtered.filter(issue => 
          issue.status === this.filters.status
        );
      }

      // Filter by priority
      if (this.filters.priority) {
        filtered = filtered.filter(issue => 
          issue.priority === this.filters.priority
        );
      }

      // Filter by date range
      if (this.filters.dateRange !== 'all') {
        const now = new Date();
        filtered = filtered.filter(issue => {
          const issueDate = new Date(issue.opening_date);
          
          switch (this.filters.dateRange) {
            case 'today':
              return issueDate.toDateString() === now.toDateString();
            case 'week':
              const startOfWeek = new Date(now);
              startOfWeek.setDate(now.getDate() - now.getDay());
              startOfWeek.setHours(0, 0, 0, 0);
              const endOfWeek = new Date(startOfWeek);
              endOfWeek.setDate(startOfWeek.getDate() + 6);
              endOfWeek.setHours(23, 59, 59, 999);
              return issueDate >= startOfWeek && issueDate <= endOfWeek;
            case 'month':
              return issueDate.getMonth() === now.getMonth() && 
                     issueDate.getFullYear() === now.getFullYear();
            default:
              return true;
          }
        });
      }

      // Filter by search
      if (this.filters.search) {
        const searchLower = this.filters.search.toLowerCase();
        filtered = filtered.filter(issue =>
          issue.subject.toLowerCase().includes(searchLower) ||
          issue.customer?.toLowerCase().includes(searchLower) ||
          issue.name.toLowerCase().includes(searchLower) ||
          issue.raised_by.toLowerCase().includes(searchLower)
        );
      }

      // Sort by opening date (most recent first)
      return filtered.sort((a, b) => 
        new Date(b.opening_date) - new Date(a.opening_date)
      );
    }
  },
  mounted() {
    this.fetchIssues();
    // Close dropdown when clicking outside
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    setActiveView(view) {
      this.activeView = view;
      this.showViewDropdown = false;
    },
    
    handleClickOutside(event) {
      if (!event.target.closest('.relative')) {
        this.showViewDropdown = false;
      }
    },
    
    async fetchIssues() {
      try {
        const response = await fetch('/api/method/frappe.client.get_list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': this.getCSRFToken()
          },
          body: JSON.stringify({
            doctype: 'Issue',
            fields: ['*'],
            limit_page_length: 100,
            order_by: 'opening_date desc'
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          this.issues = result.message || [];
        } else {
          console.error('Failed to fetch issues');
          throw new Error('Failed to fetch issues');
        }
      } catch (error) {
        console.error('Error fetching issues:', error);
        alert('Error fetching issues. Please try again.');
      }
    },
    
    getIssuesByStatus(status) {
      return this.filteredIssues.filter(issue => issue.status === status);
    },
    
    viewIssue(issue) {
      this.selectedIssue = issue;
    },
    
    editIssue(issue) {
      // For now, open the view modal which will have edit functionality
      this.selectedIssue = issue;
    },
    
    async deleteIssue(issue) {
      if (confirm(`Are you sure you want to delete the issue "${issue.subject}"?`)) {
        try {
          const response = await fetch('/api/method/frappe.client.delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Frappe-CSRF-Token': this.getCSRFToken()
            },
            body: JSON.stringify({
              doctype: 'Issue',
              name: issue.name
            })
          });
          
          if (response.ok) {
            this.issues = this.issues.filter(i => i.name !== issue.name);
          } else {
            console.error('Failed to delete issue');
            alert('Failed to delete issue. Please try again.');
          }
        } catch (error) {
          console.error('Error deleting issue:', error);
          alert('Error deleting issue. Please try again.');
        }
      }
    },
    
    async createIssue() {
      try {
        const formattedIssue = {
          doctype: 'Issue',
          ...this.newIssue
        };
        
        const response = await fetch('/api/method/frappe.client.insert', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': this.getCSRFToken()
          },
          body: JSON.stringify({
            doc: formattedIssue
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          this.issues.unshift(result.message);
          this.showCreateIssueModal = false;
          this.resetNewIssueForm();
        } else {
          console.error('Failed to create issue');
          alert('Failed to create issue. Please try again.');
        }
      } catch (error) {
        console.error('Error creating issue:', error);
        alert('Error creating issue. Please try again.');
      }
    },
    
    handleIssueUpdated(updatedIssue) {
      const index = this.issues.findIndex(i => i.name === updatedIssue.name);
      if (index !== -1) {
        this.issues.splice(index, 1, updatedIssue);
      }
      this.selectedIssue = null;
    },
    
    resetNewIssueForm() {
      this.newIssue = {
        subject: '',
        customer: '',
        priority: '',
        status: 'Open',
        description: '',
        raised_by: '',
        opening_date: new Date().toISOString().split('T')[0]
      };
    },
    
    getInitials(text) {
      return text.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    },
    
    priorityBadgeClasses(priority) {
      const priorityClasses = {
        'Low': 'bg-green-100 text-green-800',
        'Medium': 'bg-yellow-100 text-yellow-800',
        'High': 'bg-orange-100 text-orange-800',
        'Urgent': 'bg-red-100 text-red-800'
      };
      return priorityClasses[priority] || 'bg-gray-100 text-gray-800';
    },
    
    statusBadgeClasses(status) {
      const statusClasses = {
        'Open': 'bg-blue-100 text-blue-800',
        'Replied': 'bg-purple-100 text-purple-800',
        'Resolved': 'bg-green-100 text-green-800',
        'Closed': 'bg-gray-100 text-gray-800'
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
    
    getCSRFToken() {
      const metaTag = document.querySelector('meta[name="csrf-token"]');
      return metaTag ? metaTag.getAttribute('content') : '';
    }
  }
}
</script>