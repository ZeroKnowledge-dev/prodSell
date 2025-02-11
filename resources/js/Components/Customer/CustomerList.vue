<template>
    <div class="p-6 bg-[var(--light-green)]">
        <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center mb-6">
            <i class="fas fa-users mr-3 text-[var(--medium-green)]"></i> Customer List
        </h2>

        <div class="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
            <input placeholder="Search..."
                class="p-2 border border-[var(--medium-green)] rounded-md w-full md:w-1/2 bg-[var(--pale-green)] text-gray-800"
                type="text" v-model="searchValue" aria-label="Search customers">
            <button @click="openAddModal"
                class="bg-[var(--medium-green)] text-white px-4 py-2 rounded hover:bg-[var(--text-color)] w-full md:w-auto"
                aria-label="Add new customer">
                + Add Customer
            </button>
        </div>

        <div v-if="loading" class="text-center my-6">
            <i class="fas fa-spinner fa-spin text-3xl text-[var(--medium-green)]"></i>
            <p class="text-gray-800">Loading customers...</p>
        </div>

        <p v-if="filteredCustomers.length === 0 && !loading" class="text-center text-gray-700">No customers found</p>

        <EasyDataTable v-if="!loading && filteredCustomers.length > 0" buttons-pagination alternating :headers="Header"
            :items="filteredCustomers" :rows-per-page="10" theme-color="var(--medium-green)"
            table-class-name="customize-table">
            <template #item-action="{ serial, id }">
                <div class="flex justify-center gap-2">
                    <button @click="editCustomer(customers[serial - 1])"
                        class="bg-[var(--medium-green)] text-white px-3 py-1 rounded hover:bg-[var(--text-color)]"
                        aria-label="Edit customer">Edit</button>
                    <button @click="removeCustomer(id)" class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800"
                        aria-label="Delete customer">Delete</button>
                </div>
            </template>
        </EasyDataTable>

        <CustomerCreateForm v-if="showCreateModal" @close="closeCreateModal" @customerSaved="handleCustomerSaved" />
        <CustomerUpdateForm v-if="showEditModal" :customer="selectedCustomer" @close="closeEditModal"
            @customerUpdated="handleCustomerUpdated" />
    </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import { getCustomers, deleteCustomer } from '@/APIRequest/CustomerAPIRequest.js';
import CustomerCreateForm from './CustomerCreateForm.vue';
import CustomerUpdateForm from './CustomerUpdateForm.vue';
import AlertMessage from '@/Utility/AlertMessage.js';

const Header = [
    { text: "No", value: "serial" },
    { text: "Name", value: "name" },
    { text: "Email", value: "email" },
    { text: "Phone", value: "mobile" },
    { text: "Action", value: "action" },
];

const customers = ref([]);
const searchValue = ref('');
const loading = ref(false);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const selectedCustomer = ref(null);

const fetchCustomers = async () => {
    try {
        loading.value = true;
        customers.value = await getCustomers();
    } catch (error) {
        AlertMessage.error('Failed to fetch customers. Please try again.');
    } finally {
        loading.value = false;
    }
};

const removeCustomer = async (customerId) => {
    const confirmation = await AlertMessage.confirmDelete();

    if (confirmation.isConfirmed) {
        try {
            const response = await deleteCustomer(customerId);
            if (response === 1) {
                AlertMessage.success('Customer deleted successfully!');
                fetchCustomers();
            } else {
                AlertMessage.error('Failed to delete customer. Please try again.');
            }
        } catch (error) {
            AlertMessage.error('An error occurred. Please try again.');
        }
    }
};

const openAddModal = () => {
    selectedCustomer.value = null;
    showCreateModal.value = true;
};

const editCustomer = (customer) => {
    selectedCustomer.value = { ...customer };
    showEditModal.value = true;
};

const closeCreateModal = () => {
    showCreateModal.value = false;
};

const closeEditModal = () => {
    showEditModal.value = false;
};

const handleCustomerSaved = () => {
    closeCreateModal();
    fetchCustomers();
};

const handleCustomerUpdated = () => {
    closeEditModal();
    fetchCustomers();
};

const filteredCustomers = computed(() => {
    if (!searchValue.value) {
        return customers.value.map((customer, index) => ({
            ...customer,
            serial: index + 1
        }));
    }

    return customers.value
        .filter(customer =>
            customer.name.toLowerCase().includes(searchValue.value.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchValue.value.toLowerCase()) ||
            customer.mobile.toLowerCase().includes(searchValue.value.toLowerCase())
        )
        .map((customer, index) => ({
            ...customer,
            serial: index + 1
        }));
});

onMounted(() => {
    fetchCustomers();
});
</script>
