<template>
  <div class="min-h-screen bg-[#233d48] p-6">
    <!-- Main Centered Container -->
    <div class="max-w-6xl mx-auto">
      <!-- Header Section -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Payment Entries</h1>
        <div class="text-gray-300 text-lg mb-4">
          <p>Manage your payments and receipts efficiently</p>
        </div>
      </div>

      <!-- Search and Actions -->
      <div class="bg-[#2a4a58] rounded-lg border border-[#2a4a58] p-4 mb-6">
        <div class="flex justify-between items-center">
          <div class="flex-1 max-w-md">
            <div class="relative">
              <input 
                type="text" 
                v-model="searchQuery"
                placeholder="Search payments..."
                class="w-full px-4 py-2 pl-10 border border-[#2a4a58] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
              >
              <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
          <div class="flex space-x-3">
            <button 
              @click="createNewPayment"
              class="px-4 py-2 bg-[#8acc33] hover:bg-[#7abc22] text-white font-medium rounded-lg transition-colors duration-200"
            >
              New Payment
            </button>
            <button 
              @click="loadPaymentEntries"
              class="px-4 py-2 border border-[#8acc33] text-[#8acc33] bg-transparent hover:bg-[#2a4a58] font-medium rounded-lg transition-colors duration-200"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Payment Entries List -->
      <div class="bg-[#2a4a58] rounded-lg border border-[#2a4a58] p-6" v-if="filteredPayments.length > 0">
        <h3 class="text-xl font-semibold text-white mb-4">Payment Entries</h3>
        <div class="space-y-3">
          <div 
            v-for="payment in filteredPayments" 
            :key="payment.name"
            class="bg-[#233d48] rounded-lg p-4 border border-[#2a4a58] cursor-pointer hover:border-[#8acc33] transition-colors"
            @click="viewPayment(payment)"
          >
            <div class="flex justify-between items-center">
              <div class="flex-1">
                <div class="flex items-center space-x-4">
                  <div class="text-white font-semibold text-lg">{{ payment.name }}</div>
                  <span :class="statusBadgeClasses(payment.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                    {{ payment.status }}
                  </span>
                  <span :class="typeBadgeClasses(payment.payment_type)" class="px-2 py-1 rounded-full text-xs font-medium">
                    {{ payment.payment_type }}
                  </span>
                </div>
                <div class="text-gray-300 text-sm mt-2">
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span class="text-gray-400">Party:</span>
                      <span class="ml-2">{{ payment.party_name }}</span>
                    </div>
                    <div>
                      <span class="text-gray-400">Amount:</span>
                      <span class="ml-2 text-[#8acc33] font-semibold">{{ formatCurrency(payment.paid_amount) }}</span>
                    </div>
                    <div>
                      <span class="text-gray-400">Date:</span>
                      <span class="ml-2">{{ formatDate(payment.posting_date) }}</span>
                    </div>
                    <div>
                      <span class="text-gray-400">Company:</span>
                      <span class="ml-2">{{ payment.company }}</span>
                    </div>
                  </div>
                </div>
                <div class="text-gray-400 text-xs mt-2">
                  From: {{ payment.paid_from }} → To: {{ payment.paid_to }}
                </div>
              </div>
              <div class="text-right">
                <div class="text-[#8acc33] font-semibold text-lg">{{ formatCurrency(payment.paid_amount) }}</div>
                <div class="text-gray-400 text-sm">{{ payment.party_type }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="paymentEntries.length === 0" class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">No Payment Entries</h3>
        <p class="text-gray-400 mb-4">Get started by creating your first payment entry</p>
        <button 
          @click="createNewPayment"
          class="px-6 py-3 bg-[#8acc33] hover:bg-[#7abc22] text-white font-medium rounded-lg transition-colors duration-200"
        >
          Create New Payment
        </button>
      </div>
    </div>

    <!-- Payment Entry Modal -->
    <div 
      v-if="showModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="closeModal"
    >
      <div 
        class="bg-[#233d48] rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[#2a4a58]"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="p-6 border-b border-[#2a4a58] bg-[#2a4a58]">
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-semibold text-white">
              {{ currentPayment.name || 'New Payment Entry' }}
            </h3>
            <button 
              @click="closeModal"
              class="text-gray-400 hover:text-white transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Content -->
        <div class="p-6">
          <!-- Payment Details Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- Left Column -->
            <div class="space-y-6">
              <!-- Basic Information -->
              <div class="bg-[#2a4a58] rounded-lg border border-[#2a4a58] p-4">
                <h4 class="text-lg font-semibold text-white mb-4">Payment Information</h4>
                
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Payment Type *</label>
                    <select 
                      v-model="currentPayment.payment_type"
                      @change="handlePaymentTypeChange"
                      class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                      required
                    >
                      <option value="Pay">Pay</option>
                      <option value="Receive">Receive</option>
                      <option value="Internal Transfer">Internal Transfer</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Party *</label>
                    <select 
                      v-model="currentPayment.party"
                      @change="updatePartyDetails"
                      class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                      required
                    >
                      <option value="">Select {{ currentPayment.payment_type === 'Receive' ? 'Customer' : 'Supplier' }}</option>
                      <option 
                        v-for="party in currentParties" 
                        :key="party.name"
                        :value="party.name"
                      >
                        {{ party.name }} - {{ party.party_name }}
                      </option>
                    </select>
                  </div>

                  <div v-if="currentPayment.party">
                    <label class="block text-sm font-medium text-gray-300 mb-2">Party Details</label>
                    <div class="w-full px-3 py-2 border border-[#2a4a58] rounded-md bg-[#233d48] text-gray-300 text-sm space-y-1">
                      <div><strong>Name:</strong> {{ currentPayment.party_name }}</div>
                      <div><strong>Type:</strong> {{ currentPayment.party_type }}</div>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Posting Date *</label>
                    <input 
                      type="date" 
                      v-model="currentPayment.posting_date"
                      class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                      required
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-6">
              <!-- Amount Information -->
              <div class="bg-[#2a4a58] rounded-lg border border-[#2a4a58] p-4">
                <h4 class="text-lg font-semibold text-white mb-4">Amount Details</h4>
                
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ currentPayment.payment_type === 'Receive' ? 'Received Amount *' : 'Paid Amount *' }}
                    </label>
                    <input 
                      type="number" 
                      v-model="currentPayment.paid_amount"
                      @input="updateAmountFields"
                      class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white text-lg font-semibold"
                      placeholder="0.00"
                      step="0.01"
                      required
                    >
                  </div>

                  <div v-if="currentPayment.payment_type === 'Receive'">
                    <label class="block text-sm font-medium text-gray-300 mb-2">Received Amount *</label>
                    <input 
                      type="number" 
                      v-model="currentPayment.received_amount"
                      class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                      placeholder="0.00"
                      step="0.01"
                      required
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Amount in Words</label>
                    <div class="w-full px-3 py-2 border border-[#2a4a58] rounded-md bg-[#233d48] text-gray-300 text-sm min-h-[42px] flex items-center">
                      {{ currentPayment.in_words || 'Zero' }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Account Information -->
              <div class="bg-[#2a4a58] rounded-lg border border-[#2a4a58] p-4">
                <h4 class="text-lg font-semibold text-white mb-4">Account Details</h4>
                
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ currentPayment.payment_type === 'Receive' ? 'Paid From *' : 'Paid From *' }}
                    </label>
                    <select 
                      v-model="currentPayment.paid_from"
                      class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                      required
                    >
                      <option value="">Select Account</option>
                      <option 
                        v-for="account in paidFromAccounts" 
                        :key="account.name"
                        :value="account.name"
                      >
                        {{ account.name }} ({{ account.account_type }})
                      </option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      {{ currentPayment.payment_type === 'Receive' ? 'Paid To *' : 'Paid To *' }}
                    </label>
                    <select 
                      v-model="currentPayment.paid_to"
                      class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                      required
                    >
                      <option value="">Select Account</option>
                      <option 
                        v-for="account in cashAccounts" 
                        :key="account.name"
                        :value="account.name"
                      >
                        {{ account.name }} ({{ account.account_type }})
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mode of Payment -->
          <div class="bg-[#2a4a58] rounded-lg border border-[#2a4a58] p-4 mb-6">
            <h4 class="text-lg font-semibold text-white mb-4">Payment Details</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Mode of Payment</label>
                <select 
                  v-model="currentPayment.mode_of_payment"
                  class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                >
                  <option value="">Select Mode</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Reference No</label>
                <input 
                  type="text" 
                  v-model="currentPayment.reference_no"
                  class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
                  placeholder="Optional"
                >
              </div>
            </div>
          </div>

          <!-- References -->
          <div class="bg-[#2a4a58] rounded-lg border border-[#2a4a58] p-4 mb-6">
            <h4 class="text-lg font-semibold text-white mb-4">References</h4>
            
            <div class="space-y-3">
              <div 
                v-for="(ref, index) in currentPayment.references" 
                :key="index"
                class="border border-[#2a4a58] rounded-md p-3"
              >
                <div class="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-400 mb-1">Reference Type</label>
                    <select 
                      v-model="ref.reference_doctype"
                      class="w-full px-2 py-1 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-1 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white text-sm"
                    >
                      <option value="Purchase Invoice">Purchase Invoice</option>
                      <option value="Sales Invoice">Sales Invoice</option>
                      <option value="Journal Entry">Journal Entry</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-400 mb-1">Reference Name</label>
                    <input 
                      type="text" 
                      v-model="ref.reference_name"
                      class="w-full px-2 py-1 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-1 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white text-sm"
                    >
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-400 mb-1">Amount</label>
                    <input 
                      type="number" 
                      v-model="ref.allocated_amount"
                      class="w-full px-2 py-1 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-1 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white text-sm"
                      step="0.01"
                    >
                  </div>
                  <div class="flex items-end">
                    <button 
                      @click="removeReference(index)"
                      class="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
              
              <button 
                @click="addReference"
                class="w-full px-3 py-2 border-2 border-dashed border-[#8acc33] text-[#8acc33] bg-transparent hover:bg-[#2a4a58] font-medium rounded-md transition-colors duration-200 text-sm"
              >
                + Add Reference
              </button>
            </div>
          </div>

          <!-- Remarks -->
          <div class="bg-[#2a4a58] rounded-lg border border-[#2a4a58] p-4 mb-6">
            <h4 class="text-lg font-semibold text-white mb-4">Remarks</h4>
            <textarea 
              v-model="currentPayment.remarks"
              rows="3"
              class="w-full px-3 py-2 border border-[#2a4a58] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8acc33] focus:border-transparent bg-[#233d48] text-white"
              placeholder="Add any remarks or notes..."
            ></textarea>
          </div>

          <!-- Help Section -->
          <div class="bg-[#2a4a58] rounded-lg border border-[#2a4a58] p-4 mb-6">
            <h4 class="text-lg font-semibold text-white mb-3">Help and Documentation</h4>
            <div class="text-gray-300 text-sm space-y-2">
              <p>• You can quickly track all your payments and receipts from this dashboard</p>
              <p>• Submitted payments will automatically appear in your accounting reports</p>
              <p>• Use references to link payments to specific invoices or documents</p>
            </div>
            <div class="mt-4">
              <button class="text-[#8acc33] hover:text-[#7abc22] font-medium text-sm">
                Learn More About Payment Tracking →
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-[#2a4a58]">
            <button 
              v-if="currentPayment.name && currentPayment.status === 'Draft'"
              @click="deletePayment"
              class="px-6 py-2 border border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white font-medium rounded-lg transition-colors duration-200"
            >
              Delete
            </button>
            <button 
              @click="closeModal"
              class="px-6 py-2 border border-gray-500 text-gray-300 hover:bg-[#2a4a58] font-medium rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button 
              @click="submitPayment"
              v-if="currentPayment.name && currentPayment.status === 'Draft'"
              :disabled="isSubmitting"
              :class="[
                'px-6 py-2 font-medium rounded-lg transition-colors duration-200',
                isSubmitting
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              ]"
            >
              {{ isSubmitting ? 'Submitting...' : 'Submit' }}
            </button>
            <button 
              @click="savePayment"
              :disabled="isSaving || !isFormValid"
              :class="[
                'px-6 py-2 font-medium rounded-lg transition-colors duration-200',
                isSaving || !isFormValid
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-[#8acc33] hover:bg-[#7abc22] text-white'
              ]"
            >
              {{ isSaving ? 'Saving...' : (currentPayment.name ? 'Update' : 'Save') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentEntriesPage',
  data() {
    return {
      searchQuery: '',
      paymentEntries: [],
      showModal: false,
      currentPayment: this.createEmptyPayment(),
      cashAccounts: [],
      paidFromAccounts: [],
      customers: [],
      suppliers: [],
      isSaving: false,
      isSubmitting: false
    }
  },
  computed: {
    filteredPayments() {
      if (!this.searchQuery) return this.paymentEntries;
      
      const query = this.searchQuery.toLowerCase();
      return this.paymentEntries.filter(payment => 
        payment.name?.toLowerCase().includes(query) ||
        payment.party_name?.toLowerCase().includes(query) ||
        payment.payment_type?.toLowerCase().includes(query) ||
        payment.status?.toLowerCase().includes(query) ||
        payment.paid_from?.toLowerCase().includes(query) ||
        payment.paid_to?.toLowerCase().includes(query)
      );
    },
    
    isFormValid() {
      const requiredFields = [
        this.currentPayment.payment_type,
        this.currentPayment.party,
        this.currentPayment.posting_date,
        this.currentPayment.paid_amount,
        this.currentPayment.paid_from,
        this.currentPayment.paid_to
      ];
      
      if (this.currentPayment.payment_type === 'Receive') {
        requiredFields.push(this.currentPayment.received_amount);
      }
      
      return requiredFields.every(field => field && field.toString().trim() !== '');
    },
    
    currentParties() {
      if (this.currentPayment.payment_type === 'Receive') {
        return this.customers;
      } else if (this.currentPayment.payment_type === 'Pay') {
        return this.suppliers;
      }
      return [];
    }
  },
  mounted() {
    this.loadPaymentEntries();
    this.loadCashAccounts();
    this.loadPaidFromAccounts();
    this.loadCustomers();
    this.loadSuppliers();
  },
  methods: {
    createEmptyPayment() {
      return {
        name: null,
        payment_type: 'Pay',
        party_type: 'Supplier',
        party: '',
        party_name: '',
        posting_date: new Date().toISOString().split('T')[0],
        paid_amount: 0.0,
        received_amount: 0.0,
        paid_from: '',
        paid_to: '',
        mode_of_payment: '',
        reference_no: '',
        reference_date: new Date().toISOString().split('T')[0],
        remarks: '',
        company: 'Friends ERP (Demo)',
        status: 'Draft',
        references: [],
        in_words: ''
      };
    },
    
    createEmptyReference() {
      return {
        reference_doctype: 'Purchase Invoice',
        reference_name: '',
        allocated_amount: 0.0,
        total_amount: 0.0
      };
    },
    
    addReference() {
      this.currentPayment.references.push(this.createEmptyReference());
    },
    
    removeReference(index) {
      this.currentPayment.references.splice(index, 1);
    },
    
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
            fields: ['name', 'customer_name'],
            filters: [['disabled', '=', 0]],
            order_by: 'customer_name',
            limit: 1000
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          this.customers = data.message.map(customer => ({
            name: customer.name,
            party_name: customer.customer_name,
            party_type: 'Customer'
          }));
        } else {
          // Fallback to sample customers
          this.customers = [
            { name: 'CUST-00001', party_name: 'Grant Plastics Ltd.', party_type: 'Customer' },
            { name: 'CUST-00002', party_name: 'Summit Traders Ltd.', party_type: 'Customer' },
            { name: 'CUST-00003', party_name: 'Zuckerman Security Ltd.', party_type: 'Customer' }
          ];
        }
      } catch (error) {
        console.error('Error loading customers:', error);
        this.customers = [
          { name: 'CUST-00001', party_name: 'Grant Plastics Ltd.', party_type: 'Customer' },
          { name: 'CUST-00002', party_name: 'Summit Traders Ltd.', party_type: 'Customer' }
        ];
      }
    },
    
    async loadSuppliers() {
      try {
        const response = await fetch('/api/method/frappe.client.get_list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': this.getCSRFToken()
          },
          body: JSON.stringify({
            doctype: 'Supplier',
            fields: ['name', 'supplier_name'],
            filters: [['disabled', '=', 0]],
            order_by: 'supplier_name',
            limit: 1000
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          this.suppliers = data.message.map(supplier => ({
            name: supplier.name,
            party_name: supplier.supplier_name,
            party_type: 'Supplier'
          }));
        } else {
          // Fallback to sample suppliers
          this.suppliers = [
            { name: 'SUPP-00001', party_name: 'Grant Plastics Ltd.', party_type: 'Supplier' },
            { name: 'SUPP-00002', party_name: 'Summit Traders Ltd.', party_type: 'Supplier' },
            { name: 'SUPP-00003', party_name: 'Zuckerman Security Ltd.', party_type: 'Supplier' }
          ];
        }
      } catch (error) {
        console.error('Error loading suppliers:', error);
        this.suppliers = [
          { name: 'SUPP-00001', party_name: 'Grant Plastics Ltd.', party_type: 'Supplier' },
          { name: 'SUPP-00002', party_name: 'Summit Traders Ltd.', party_type: 'Supplier' }
        ];
      }
    },
    
    updatePartyDetails() {
      if (this.currentPayment.party) {
        let selectedParty = null;
        
        if (this.currentPayment.payment_type === 'Receive') {
          selectedParty = this.customers.find(c => c.name === this.currentPayment.party);
        } else if (this.currentPayment.payment_type === 'Pay') {
          selectedParty = this.suppliers.find(s => s.name === this.currentPayment.party);
        }
        
        if (selectedParty) {
          this.currentPayment.party_name = selectedParty.party_name;
          this.currentPayment.party_type = selectedParty.party_type;
        }
      } else {
        this.currentPayment.party_name = '';
        this.currentPayment.party_type = this.currentPayment.payment_type === 'Receive' ? 'Customer' : 'Supplier';
      }
    },
    
    updateAmountFields() {
      if (this.currentPayment.payment_type === 'Receive') {
        this.currentPayment.received_amount = this.currentPayment.paid_amount;
      }
      this.updateAmountInWords();
    },
    
    updateAmountInWords() {
      const amount = this.currentPayment.paid_amount;
      if (amount && amount > 0) {
        this.currentPayment.in_words = `ETB ${this.numberToWords(amount)} only.`;
      } else {
        this.currentPayment.in_words = 'Zero';
      }
    },
    
    async loadCashAccounts() {
      try {
        const response = await fetch('/api/method/frappe.client.get_list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': this.getCSRFToken()
          },
          body: JSON.stringify({
            doctype: 'Account',
            fields: ['name', 'account_type', 'account_name'],
            filters: [
              ['account_type', '=', 'Cash'],
              ['is_group', '=', 0],
              ['company', '=', 'Friends ERP (Demo)']
            ],
            order_by: 'name'
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          this.cashAccounts = data.message;
        } else {
          this.cashAccounts = [
            { name: 'Cash - FED', account_type: 'Cash', account_name: 'Cash' },
            { name: 'Petty Cash - FED', account_type: 'Cash', account_name: 'Petty Cash' }
          ];
        }
      } catch (error) {
        console.error('Error loading cash accounts:', error);
        this.cashAccounts = [
          { name: 'Cash - FED', account_type: 'Cash', account_name: 'Cash' },
          { name: 'Petty Cash - FED', account_type: 'Cash', account_name: 'Petty Cash' }
        ];
      }
    },
    
    async loadPaidFromAccounts() {
      try {
        const response = await fetch('/api/method/frappe.client.get_list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': this.getCSRFToken()
          },
          body: JSON.stringify({
            doctype: 'Account',
            fields: ['name', 'account_type', 'account_name'],
            filters: [
              ['company', '=', 'Friends ERP (Demo)'],
              ['is_group', '=', 0]
            ],
            order_by: 'name'
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          this.paidFromAccounts = data.message;
        } else {
          this.paidFromAccounts = [
            { name: 'Debtors - FED', account_type: 'Receivable', account_name: 'Debtors' },
            { name: 'Creditors - FED', account_type: 'Payable', account_name: 'Creditors' },
            { name: 'Demo Bank Account - FED', account_type: 'Bank', account_name: 'Demo Bank Account' }
          ];
        }
      } catch (error) {
        console.error('Error loading paid from accounts:', error);
        this.paidFromAccounts = [
          { name: 'Debtors - FED', account_type: 'Receivable', account_name: 'Debtors' },
          { name: 'Creditors - FED', account_type: 'Payable', account_name: 'Creditors' }
        ];
      }
    },
    
    async loadPaymentEntries() {
      try {
        const response = await fetch('/api/method/frappe.client.get_list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': this.getCSRFToken()
          },
          body: JSON.stringify({
            doctype: 'Payment Entry',
            fields: ['*'],
            order_by: 'creation desc',
            limit: 50
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          this.paymentEntries = data.message;
        } else {
          throw new Error('Failed to load payment entries');
        }
      } catch (error) {
        console.error('Error loading payment entries:', error);
        this.paymentEntries = [
          {
            "name": "ACC-PAY-2025-00006",
            "payment_type": "Receive",
            "party_type": "Customer",
            "party": "CUST-00001",
            "party_name": "Grant Plastics Ltd.",
            "posting_date": "2025-10-07",
            "paid_amount": 1200.0,
            "received_amount": 1200.0,
            "paid_from": "Debtors - FED",
            "paid_to": "Cash - FED",
            "status": "Submitted",
            "company": "Friends ERP (Demo)",
            "in_words": "ETB One Thousand, Two Hundred only.",
            "remarks": "Amount ETB 1200 received from Grant Plastics Ltd.",
            "references": []
          }
        ];
      }
    },
    
    createNewPayment() {
      this.currentPayment = this.createEmptyPayment();
      this.showModal = true;
    },
    
    viewPayment(payment) {
      this.currentPayment = JSON.parse(JSON.stringify(payment));
      this.showModal = true;
    },
    
    closeModal() {
      this.showModal = false;
      this.currentPayment = this.createEmptyPayment();
    },
    
    handlePaymentTypeChange() {
      // Clear party selection when payment type changes
      this.currentPayment.party = '';
      this.currentPayment.party_name = '';
      this.currentPayment.party_type = this.currentPayment.payment_type === 'Receive' ? 'Customer' : 'Supplier';
      
      // Auto-set default accounts based on payment type
      if (this.currentPayment.payment_type === 'Receive') {
        if (!this.currentPayment.paid_from && this.paidFromAccounts.length > 0) {
          const debtorAccount = this.paidFromAccounts.find(acc => acc.account_type === 'Receivable');
          if (debtorAccount) {
            this.currentPayment.paid_from = debtorAccount.name;
          }
        }
        if (!this.currentPayment.paid_to && this.cashAccounts.length > 0) {
          this.currentPayment.paid_to = this.cashAccounts[0].name;
        }
        this.currentPayment.received_amount = this.currentPayment.paid_amount;
      } else if (this.currentPayment.payment_type === 'Pay') {
        if (!this.currentPayment.paid_from && this.paidFromAccounts.length > 0) {
          const bankAccount = this.paidFromAccounts.find(acc => acc.account_type === 'Bank');
          if (bankAccount) {
            this.currentPayment.paid_from = bankAccount.name;
          }
        }
        if (!this.currentPayment.paid_to && this.paidFromAccounts.length > 0) {
          const creditorAccount = this.paidFromAccounts.find(acc => acc.account_type === 'Payable');
          if (creditorAccount) {
            this.currentPayment.paid_to = creditorAccount.name;
          }
        }
      }
    },
    
    numberToWords(num) {
      const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
      const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
      const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
      
      if (num === 0) return 'Zero';
      if (num < 10) return ones[Math.floor(num)];
      if (num < 20) return teens[Math.floor(num) - 10];
      if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
      if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' ' + this.numberToWords(num % 100) : '');
      if (num < 100000) return this.numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 !== 0 ? ' ' + this.numberToWords(num % 1000) : '');
      return 'Large Amount';
    },
    
    async savePayment() {
      if (this.isSaving || !this.isFormValid) return;
      
      this.isSaving = true;
      
      try {
        let response;
        
        if (this.currentPayment.name) {
          response = await fetch('/api/method/frappe.client.save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Frappe-CSRF-Token': this.getCSRFToken()
            },
            body: JSON.stringify({
              doc: this.currentPayment
            })
          });
        } else {
          response = await fetch('/api/method/frappe.client.insert', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Frappe-CSRF-Token': this.getCSRFToken()
            },
            body: JSON.stringify({
              doc: {
                doctype: 'Payment Entry',
                ...this.currentPayment
              }
            })
          });
        }
        
        if (response.ok) {
          const data = await response.json();
          
          if (!this.currentPayment.name) {
            this.currentPayment.name = data.message.name;
          }
          
          this.showAlert('Payment entry saved successfully', 'green');
          this.loadPaymentEntries();
          this.closeModal();
        } else {
          const errorData = await response.json();
          throw new Error(errorData._server_messages || 'Failed to save payment entry');
        }
      } catch (error) {
        console.error('Error saving payment entry:', error);
        this.showAlert('Error saving payment entry: ' + error.message, 'red');
      } finally {
        this.isSaving = false;
      }
    },
    
    async submitPayment() {
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
            doctype: 'Payment Entry',
            name: this.currentPayment.name,
            fieldname: {
              status: 'Submitted'
            }
          })
        });
        
        if (response.ok) {
          this.showAlert('Payment entry submitted successfully', 'green');
          this.loadPaymentEntries();
          this.closeModal();
        } else {
          throw new Error('Failed to submit payment entry');
        }
      } catch (error) {
        console.error('Error submitting payment entry:', error);
        this.showAlert('Error submitting payment entry', 'red');
      } finally {
        this.isSubmitting = false;
      }
    },
    
    async deletePayment() {
      if (!this.currentPayment.name) return;
      
      if (confirm(`Are you sure you want to delete payment ${this.currentPayment.name}?`)) {
        try {
          const response = await fetch('/api/method/frappe.client.delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Frappe-CSRF-Token': this.getCSRFToken()
            },
            body: JSON.stringify({
              doctype: 'Payment Entry',
              name: this.currentPayment.name
            })
          });
          
          if (response.ok) {
            this.showAlert('Payment entry deleted successfully', 'green');
            this.loadPaymentEntries();
            this.closeModal();
          } else {
            throw new Error('Failed to delete payment entry');
          }
        } catch (error) {
          console.error('Error deleting payment entry:', error);
          this.showAlert('Error deleting payment entry', 'red');
        }
      }
    },
    
    formatCurrency(amount) {
      return new Intl.NumberFormat('en-ET', {
        style: 'currency',
        currency: 'ETB'
      }).format(amount);
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    
    statusBadgeClasses(status) {
      const classes = {
        'Draft': 'bg-yellow-100 text-yellow-800',
        'Submitted': 'bg-green-100 text-green-800',
        'Cancelled': 'bg-red-100 text-red-800'
      };
      return classes[status] || 'bg-gray-100 text-gray-800';
    },
    
    typeBadgeClasses(type) {
      const classes = {
        'Pay': 'bg-red-100 text-red-800',
        'Receive': 'bg-green-100 text-green-800',
        'Internal Transfer': 'bg-blue-100 text-blue-800'
      };
      return classes[type] || 'bg-gray-100 text-gray-800';
    },
    
    getCSRFToken() {
      const metaTag = document.querySelector('meta[name="csrf-token"]');
      return metaTag ? metaTag.getAttribute('content') : '';
    },
    
    showAlert(message, indicator) {
      const alertDiv = document.createElement('div');
      alertDiv.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 ${
        indicator === 'green' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`;
      alertDiv.textContent = message;
      
      document.body.appendChild(alertDiv);
      
      setTimeout(() => {
        document.body.removeChild(alertDiv);
      }, 3000);
    }
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
input:focus, select:focus, textarea:focus {
  outline: none;
  ring: 2px;
}
</style>