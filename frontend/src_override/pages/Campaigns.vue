<template>
  <div class="min-h-screen bg-[#233d48] p-6">
    <!-- Main Centered Container -->
    <div class="max-w-6xl mx-auto pt-24">
      <!-- Header Section -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-white mb-4">Bootstrap revenue with Campaigns</h1>
        <div class=" p-6 max-w-4xl mx-auto">
          <p class="text-gray-300 leading-relaxed text-center">
            Your clients are the fieldbook of your business and play an important role in its growth. 
            Whether you want to re-engage your clients, speak your services, or simply announce a change, 
            rubber makes it easy for you to send effective email campaigns to your clients.
          </p>
        </div>
      </div>

      <!-- Add Campaigns Section -->
      <div class=" p-6 mb-6 max-w-4xl mx-auto">
        <div class="flex justify-center items-center gap-8">
          <h2 class="text-xl font-semibold text-white">Add Campaigns</h2>
          <button 
            class="px-6 py-3 bg-[#8acc33] hover:bg-[#7abc22] text-white font-medium rounded-lg transition-colors duration-200"
            @click="createNewCampaign"
          >
            Save plans and pricing
          </button>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="max-w-4xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column -->
          <div class="lg:col-span-2 space-y-6">
            <!-- View Campaign Stats -->
            <div class="bg-[#2a4a58] rounded-lg border border-[#2a4a58] p-6">
              <h3 class="text-lg font-semibold text-white mb-6 text-center">View Campaign</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Click Rate -->
                <div class="text-center p-6 bg-[#233d48] rounded-lg border border-[#2a4a58]">
                  <div class="text-3xl font-bold text-[#8acc33] mb-2">45.5%</div>
                  <div class="text-sm font-medium text-gray-300 mb-1">Click on</div>
                  <div class="text-xs text-[#8acc33] font-medium">You need more</div>
                </div>

                <!-- Join Revenue -->
                <div class="text-center p-6 bg-[#233d48] rounded-lg border border-[#2a4a58]">
                  <div class="text-3xl font-bold text-[#8acc33] mb-2">$5642.49</div>
                  <div class="text-sm font-medium text-gray-300 mb-1">Join revenue</div>
                  <div class="text-xs text-gray-400">4 jobs</div>
                </div>

                <!-- Report -->
                <div class="text-center p-6 bg-[#233d48] rounded-lg border border-[#2a4a58]">
                  <div class="text-sm font-medium text-gray-300 mb-2">Railport</div>
                  <div class="text-xs text-gray-400 mb-1">From:</div>
                  <div class="text-sm font-semibold text-[#8acc33]">Simple to small</div>
                </div>
              </div>
            </div>

            <!-- Hero Banner -->
            <div class="bg-gradient-to-r from-[#2a4a58] to-[#233d48] rounded-lg p-8 text-white border border-[#2a4a58] text-center">
              <h2 class="text-2xl font-bold mb-2">You're home deserves the best!</h2>
              <p class="text-gray-300">Transform your space with our premium solutions</p>
            </div>

            <!-- Bootstrap Online -->
            <div class="bg-[#2a4a58] rounded-lg border border-[#2a4a58] p-6">
              <h3 class="text-xl font-semibold text-white mb-4 text-center">Bootstrap Online</h3>
              <div class="bg-[#233d48] rounded-lg p-4 border border-[#2a4a58] text-center">
                <h4 class="font-semibold text-white mb-2">Create Better Product</h4>
                <p class="text-gray-300 text-sm">Enhance your product offerings with our comprehensive tools and features.</p>
              </div>
            </div>
          </div>

          <!-- Right Column - Features -->
          <div class="space-y-6">
            <!-- Create Campaigns Feature -->
            <div class="bg-[#2a4a58] rounded-lg border border-[#2a4a58] p-6 text-center">
              <div class="w-12 h-12 bg-[#233d48] rounded-lg flex items-center justify-center mb-4 border border-[#2a4a58] mx-auto">
                <svg class="w-6 h-6 text-[#8acc33]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-white mb-3">Create campaigns in no time</h3>
              <p class="text-gray-300 text-sm leading-relaxed">
                Easily create email campaigns using professional templates that help you overcome challenges 
                and make the design work for your own brand.
              </p>
            </div>

            <!-- Automate Campaigns Feature -->
            <div class="bg-[#2a4a58] rounded-lg border border-[#2a4a58] p-6 text-center">
              <div class="w-12 h-12 bg-[#233d48] rounded-lg flex items-center justify-center mb-4 border border-[#2a4a58] mx-auto">
                <svg class="w-6 h-6 text-[#8acc33]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-white mb-3">Automate your campaigns</h3>
              <p class="text-gray-300 text-sm leading-relaxed">
                Set up automated campaigns to send emails based on specific triggers and conditions 
                ensuring your messages reach the right clients at the right time. Once activated, 
                these campaigns run in the background — saving you time and letting you focus on what matters most.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Campaign Modal -->
    <div 
      v-if="showCreateModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="showCreateModal = false"
    >
      <div 
        class="bg-[#233d48] rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#2a4a58]"
        @click.stop
      >
        <div class="p-6 border-b border-[#2a4a58] bg-[#2a4a58]">
          <h3 class="text-xl font-semibold text-white text-center">Create New Campaign</h3>
        </div>
        
        <form @submit.prevent="saveCampaign" class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Campaign Name *</label>
              <input 
                type="text" 
                v-model="newCampaign.campaign_name" 
                required
                class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white text-center"
                placeholder="Enter campaign name"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Campaign Type</label>
              <select 
                v-model="newCampaign.campaign_type"
                class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white text-center"
              >
                <option value="Email">Email</option>
                <option value="SMS">SMS</option>
                <option value="Social Media">Social Media</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
              <input 
                type="date" 
                v-model="newCampaign.start_date" 
                class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white text-center"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">End Date</label>
              <input 
                type="date" 
                v-model="newCampaign.end_date" 
                class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white text-center"
              >
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea 
              v-model="newCampaign.description" 
              rows="4"
              class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white text-center"
              placeholder="Enter campaign description"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Target Audience</label>
            <textarea 
              v-model="newCampaign.target_audience" 
              rows="3"
              class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white text-center"
              placeholder="Describe your target audience"
            ></textarea>
          </div>
          
          <div class="flex justify-center space-x-3 pt-6 border-t border-[#2a4a58]">
            <button 
              type="button" 
              @click="showCreateModal = false"
              class="px-6 py-2 border border-[#8acc33] text-[#8acc33] bg-[#233d48] hover:bg-[#2a4a58] rounded-md font-medium transition-colors duration-200"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-6 py-2 bg-[#8acc33] hover:bg-[#7abc22] text-white font-medium rounded-md transition-colors duration-200"
            >
              Create Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CampaignsPage',
  data() {
    return {
      showCreateModal: false,
      newCampaign: {
        campaign_name: '',
        campaign_type: 'Email',
        start_date: '',
        end_date: '',
        description: '',
        target_audience: ''
      },
      campaignStats: {
        clickRate: 45.5,
        revenue: 5642.49,
        jobs: 4
      }
    }
  },
  mounted() {
    this.loadCampaignData();
  },
  methods: {
    createNewCampaign() {
      this.showCreateModal = true;
      this.resetNewCampaign();
    },
    
    resetNewCampaign() {
      this.newCampaign = {
        campaign_name: '',
        campaign_type: 'Email',
        start_date: '',
        end_date: '',
        description: '',
        target_audience: ''
      };
    },
    
    async saveCampaign() {
      try {
        const response = await fetch('/api/method/frappe.client.insert', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': this.getCSRFToken()
          },
          body: JSON.stringify({
            doc: {
              doctype: 'Campaign',
              campaign_name: this.newCampaign.campaign_name,
              campaign_type: this.newCampaign.campaign_type,
              start_date: this.newCampaign.start_date,
              end_date: this.newCampaign.end_date,
              description: this.newCampaign.description,
              target_audience: this.newCampaign.target_audience
            }
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          this.showCreateModal = false;
          this.loadCampaignData();
          frappe.show_alert({
            message: __('Campaign created successfully'),
            indicator: 'green'
          });
        } else {
          console.error('Failed to create campaign');
          frappe.show_alert({
            message: __('Failed to create campaign'),
            indicator: 'red'
          });
        }
      } catch (error) {
        console.error('Error creating campaign:', error);
        frappe.show_alert({
          message: __('Error creating campaign'),
          indicator: 'red'
        });
      }
    },
    
    async loadCampaignData() {
      try {
        const response = await fetch('/api/method/your_app.api.get_campaign_stats', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': this.getCSRFToken()
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          this.campaignStats = result.message;
        }
      } catch (error) {
        console.error('Error loading campaign data:', error);
      }
    },
    
    getCSRFToken() {
      const metaTag = document.querySelector('meta[name="csrf-token"]');
      return metaTag ? metaTag.getAttribute('content') : '';
    }
  }
}
</script>

<style scoped>
/* Custom styles for better text readability */
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