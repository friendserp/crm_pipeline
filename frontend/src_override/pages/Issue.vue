<template>
  <div 
    class="bg-[#233d48] rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[#2a4a58]"
    @click.stop
  >
    <div class="p-6 border-b border-[#2a4a58] bg-[#2a4a58]">
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-xl font-semibold text-white">{{ issue.subject }}</h3>
          <p class="text-sm text-gray-300 mt-1">{{ issue.name }}</p>
        </div>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-white transition-colors duration-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <div class="p-6">
      <!-- Issue Details -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Description -->
          <div class="bg-[#2a4a58] rounded-lg p-4">
            <h4 class="text-lg font-medium text-white mb-3">Description</h4>
            <div class="prose prose-invert max-w-none" v-html="issue.description || 'No description provided'"></div>
          </div>

          <!-- Activity Timeline -->
          <div class="bg-[#2a4a58] rounded-lg p-4">
            <h4 class="text-lg font-medium text-white mb-3">Activity</h4>
            <div class="space-y-3">
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-2 h-2 bg-[#8acc33] rounded-full mt-2"></div>
                <div class="flex-1">
                  <p class="text-sm text-white">Issue created</p>
                  <p class="text-xs text-gray-400">{{ formatDateTime(issue.creation) }}</p>
                </div>
              </div>
              <div v-if="issue.first_responded_on" class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div class="flex-1">
                  <p class="text-sm text-white">First response sent</p>
                  <p class="text-xs text-gray-400">{{ formatDateTime(issue.first_responded_on) }}</p>
                </div>
              </div>
              <div v-if="issue.resolution_details" class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div class="flex-1">
                  <p class="text-sm text-white">Resolution provided</p>
                  <p class="text-xs text-gray-400">{{ formatDateTime(issue.modified) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Status Card -->
          <div class="bg-[#2a4a58] rounded-lg p-4">
            <h4 class="text-lg font-medium text-white mb-3">Status</h4>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-300">Current Status:</span>
                <span :class="statusBadgeClasses(issue.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ issue.status }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-300">Priority:</span>
                <span :class="priorityBadgeClasses(issue.priority)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ issue.priority || 'Not Set' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-300">Agreement Status:</span>
                <span class="text-sm text-white">{{ issue.agreement_status || 'N/A' }}</span>
              </div>
            </div>
          </div>

          <!-- Customer Information -->
          <div class="bg-[#2a4a58] rounded-lg p-4">
            <h4 class="text-lg font-medium text-white mb-3">Customer Information</h4>
            <div class="space-y-2">
              <div>
                <span class="text-sm text-gray-300">Customer:</span>
                <p class="text-sm text-white">{{ issue.customer || 'N/A' }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-300">Raised By:</span>
                <p class="text-sm text-white">{{ issue.raised_by }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-300">Company:</span>
                <p class="text-sm text-white">{{ issue.company || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <!-- Dates -->
          <div class="bg-[#2a4a58] rounded-lg p-4">
            <h4 class="text-lg font-medium text-white mb-3">Dates</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-gray-300">Opened:</span>
                <span class="text-sm text-white">{{ formatDate(issue.opening_date) }}</span>
              </div>
              <div v-if="issue.first_responded_on" class="flex justify-between">
                <span class="text-sm text-gray-300">First Response:</span>
                <span class="text-sm text-white">{{ formatDate(issue.first_responded_on) }}</span>
              </div>
              <div v-if="issue.resolution_details" class="flex justify-between">
                <span class="text-sm text-gray-300">Resolved:</span>
                <span class="text-sm text-white">{{ formatDate(issue.modified) }}</span>
              </div>
            </div>
          </div>

          <!-- Response Times -->
          <div class="bg-[#2a4a58] rounded-lg p-4">
            <h4 class="text-lg font-medium text-white mb-3">Response Times</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-gray-300">First Response:</span>
                <span class="text-sm text-white">{{ issue.first_response_time || 'N/A' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-300">Resolution:</span>
                <span class="text-sm text-white">{{ issue.resolution_time || 'N/A' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-300">Avg Response:</span>
                <span class="text-sm text-white">{{ issue.avg_response_time || 'N/A' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3 pt-6 border-t border-[#2a4a58]">
        <button 
          @click="editIssue"
          class="px-4 py-2 border border-[#8acc33] text-[#8acc33] bg-[#233d48] hover:bg-[#2a4a58] rounded-md font-medium transition-colors duration-200"
        >
          Edit Issue
        </button>
        <button 
          @click="updateStatus"
          class="px-4 py-2 border border-[#8acc33] text-[#8acc33] bg-[#233d48] hover:bg-[#2a4a58] rounded-md font-medium transition-colors duration-200"
        >
          Update Status
        </button>
        <button 
          @click="deleteIssue"
          class="px-4 py-2 border border-[#ef4444] text-[#ef4444] bg-[#233d48] hover:bg-[#2a4a58] rounded-md font-medium transition-colors duration-200"
        >
          Delete
        </button>
      </div>
    </div>

    <!-- Edit Modal -->
    <div 
      v-if="showEditModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="showEditModal = false"
    >
      <div 
        class="bg-[#233d48] rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#2a4a58]"
        @click.stop
      >
        <div class="p-6 border-b border-[#2a4a58] bg-[#2a4a58]">
          <h3 class="text-xl font-semibold text-white">Edit Issue</h3>
        </div>
        <form @submit.prevent="saveIssue" class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Subject *</label>
              <input 
                type="text" 
                v-model="editableIssue.subject" 
                required
                class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Customer</label>
              <input 
                type="text" 
                v-model="editableIssue.customer" 
                class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Priority</label>
              <select 
                v-model="editableIssue.priority"
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
                v-model="editableIssue.status"
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
              v-model="editableIssue.description" 
              rows="4"
              class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Raised By</label>
              <input 
                type="email" 
                v-model="editableIssue.raised_by" 
                class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Resolution Details</label>
              <textarea 
                v-model="editableIssue.resolution_details" 
                rows="2"
                class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                placeholder="Enter resolution details"
              ></textarea>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 pt-6 border-t border-[#2a4a58]">
            <button 
              type="button" 
              @click="showEditModal = false"
              class="px-6 py-2 border border-[#8acc33] text-[#8acc33] bg-[#233d48] hover:bg-[#2a4a58] rounded-md font-medium transition-colors duration-200"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-6 py-2 border border-[#8acc33] text-[#8acc33] bg-[#233d48] hover:bg-[#2a4a58] rounded-md font-medium transition-colors duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IssueDetail',
  props: {
    issue: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showEditModal: false,
      editableIssue: {}
    }
  },
  watch: {
    issue: {
      immediate: true,
      handler(newIssue) {
        this.editableIssue = { ...newIssue };
      }
    }
  },
  methods: {
    editIssue() {
      this.showEditModal = true;
    },
    
    async saveIssue() {
      try {
        const response = await fetch('/api/method/frappe.client.set_value', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': this.getCSRFToken()
          },
          body: JSON.stringify({
            doctype: 'Issue',
            name: this.editableIssue.name,
            fieldname: this.editableIssue
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          this.$emit('issue-updated', result.message);
          this.showEditModal = false;
        } else {
          console.error('Failed to update issue');
          alert('Failed to update issue. Please try again.');
        }
      } catch (error) {
        console.error('Error updating issue:', error);
        alert('Error updating issue. Please try again.');
      }
    },
    
    async updateStatus() {
      const newStatus = prompt('Enter new status (Open, Replied, Resolved, Closed):', this.issue.status);
      if (newStatus && ['Open', 'Replied', 'Resolved', 'Closed'].includes(newStatus)) {
        try {
          const response = await fetch('/api/method/frappe.client.set_value', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Frappe-CSRF-Token': this.getCSRFToken()
            },
            body: JSON.stringify({
              doctype: 'Issue',
              name: this.issue.name,
              fieldname: {
                status: newStatus
              }
            })
          });
          
          if (response.ok) {
            const result = await response.json();
            this.$emit('issue-updated', result.message);
          } else {
            console.error('Failed to update issue status');
            alert('Failed to update issue status. Please try again.');
          }
        } catch (error) {
          console.error('Error updating issue status:', error);
          alert('Error updating issue status. Please try again.');
        }
      }
    },
    
    async deleteIssue() {
      if (confirm(`Are you sure you want to delete the issue "${this.issue.subject}"?`)) {
        try {
          const response = await fetch('/api/method/frappe.client.delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Frappe-CSRF-Token': this.getCSRFToken()
            },
            body: JSON.stringify({
              doctype: 'Issue',
              name: this.issue.name
            })
          });
          
          if (response.ok) {
            this.$emit('close');
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
    
    getCSRFToken() {
      const metaTag = document.querySelector('meta[name="csrf-token"]');
      return metaTag ? metaTag.getAttribute('content') : '';
    }
  }
}
</script>

<style scoped>
.prose {
  color: #d1d5db;
}

.prose p {
  margin-bottom: 1em;
}

.prose :last-child {
  margin-bottom: 0;
}
</style>