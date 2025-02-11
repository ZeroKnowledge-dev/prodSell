<script setup>
import { onMounted, ref, reactive, computed } from "vue";
import { getInvoices, deleteInvoice, getInvoiceDetails } from "@/APIRequest/InvoiceAPIRequest.js";
import InvoiceDetails from "./InvoiceDetails.vue";
import AlertMessage from "@/Utility/AlertMessage";

const state = reactive({
    invoices: [],
    loading: false,
});

const searchValue = ref('');
const showDetailsModal = ref(false);
const selectedInvoice = ref(null);
const invoiceProduct = ref([]);

// loading state
const loading = ref(false);

const fetchInvoices = async () => {
    state.loading = true;
    state.invoices = await getInvoices();
    state.loading = false;
};

const removeInvoice = async (invoiceId) => {
    const confirmation = await AlertMessage.confirmDelete();
    if (confirmation.isConfirmed) {
        loading.value = true;
        const response = await deleteInvoice(invoiceId);
        loading.value = false;
        if (response === 1) {
            AlertMessage.success('Invoice deleted successfully!');
            fetchInvoices();
        } else {
            AlertMessage.error('Failed to delete invoice. Please try again.');
        }
    }
};

onMounted(fetchInvoices);

const Header = [
    { text: "No", value: "no" },
    { text: "Customer Name", value: "name" },
    { text: "Customer Email", value: "email" },
    { text: "Phone", value: "phone" },
    { text: "Total", value: "total" },
    { text: "Action", value: "actions" },
];

const filteredInvoices = computed(() => {
    return state.invoices
        .filter(invoice =>
            invoice.customer.name.toLowerCase().includes(searchValue.value.toLowerCase()) ||
            invoice.customer.email.toLowerCase().includes(searchValue.value.toLowerCase()) ||
            invoice.customer.mobile.toLowerCase().includes(searchValue.value.toLowerCase())
        )
        .map((invoice, index) => ({
            no: index + 1,
            name: invoice.customer.name,
            email: invoice.customer.email,
            phone: invoice.customer.mobile,
            total: invoice.payable,
            inv_id: invoice.id,
            cus_id: invoice.customer.id,
        }));
});

const invoiceDetails = async (inv_id, cus_id) => {
    state.loading = true;
    selectedInvoice.value = await getInvoiceDetails(inv_id, cus_id);

    invoiceProduct.value = selectedInvoice.value.product;
    state.loading = false;
    showDetailsModal.value = true;
};

const closeDetailsModal = () => {
    showDetailsModal.value = false;
};
</script>

<template>
    <div class="p-6">
        <h2 class="text-3xl font-bold text-gray-800 flex items-center mb-6">
            <i class="fas fa-file-invoice mr-3 text-[var(--medium-green)]"></i> Invoice List
        </h2>

        <!-- Search Input -->
        <div class="flex justify-between items-center mb-4">
            <input placeholder="Search..."
                class="p-2 border border-[var(--medium-green)] rounded-md w-full sm:w-1/2 bg-[var(--pale-green)] text-gray-800"
                type="text" v-model="searchValue">
        </div>

        <!-- Loading State -->
        <div v-if="state.loading" class="text-center my-6">
            <i class="fas fa-spinner fa-spin text-3xl text-[var(--medium-green)]"></i>
            <p class="text-gray-800 mt-2">Loading invoices...</p>
        </div>

        <!-- Invoice Data Table -->
        <EasyDataTable v-if="!state.loading" buttons-pagination alternating :headers="Header" :rows-per-page="10"
            theme-color="var(--medium-green)" table-class-name="customize-table" :items="filteredInvoices">

            <template #item-actions="{ inv_id, cus_id }">
                <div class="flex justify-center space-x-2">
                    <!-- Show Invoice Button -->
                    <button
                        class="bg-[var(--medium-green)] text-white px-3 py-1 rounded mr-2 hover:bg-[var(--text-color)] transition duration-300"
                        @click="invoiceDetails(inv_id, cus_id)">Show</button>

                    <!-- Delete Invoice Button -->
                    <button @click="removeInvoice(inv_id)"
                        class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800 transition duration-300">Delete</button>
                </div>
            </template>
        </EasyDataTable>

        <!-- Invoice Details Modal -->
        <InvoiceDetails v-if="showDetailsModal" :invoice="selectedInvoice" @close="closeDetailsModal" />
    </div>

    <!-- Show spinner when loading -->
    <div v-if="loading" class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
</template>
