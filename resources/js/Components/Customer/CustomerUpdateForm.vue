<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-[var(--light-green)] rounded-lg p-6 w-[400px] shadow-lg">
            <h2 class="text-xl md:text-2xl font-bold mb-4 text-gray-800">Update Customer</h2>

            <label class="block text-gray-700 text-sm">Name</label>
            <input v-model="formData.name" type="text"
                class="w-full border border-[var(--medium-green)] p-2 rounded mb-3 bg-[var(--pale-green)] text-gray-800" />

            <label class="block text-gray-700 text-sm">Email</label>
            <input v-model="formData.email" type="email"
                class="w-full border border-[var(--medium-green)] p-2 rounded mb-3 bg-[var(--pale-green)] text-gray-800" />

            <label class="block text-gray-700 text-sm">Phone</label>
            <input v-model="formData.mobile" type="text"
                class="w-full border border-[var(--medium-green)] p-2 rounded mb-4 bg-[var(--pale-green)] text-gray-800" />

            <div class="flex justify-end space-x-2">
                <button @click="$emit('close')"
                    class="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">Cancel</button>
                <button @click="editCustomer"
                    class="px-4 py-2 bg-[var(--medium-green)] text-white rounded hover:bg-[var(--text-color)]">Update</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { updateCustomer } from '@/APIRequest/CustomerAPIRequest.js';
import { emailRegex, phoneRegex } from '@/Utility/Validation.js';
import AlertMessage from '@/Utility/AlertMessage.js';

const props = defineProps({ customer: Object });
const emit = defineEmits(['close', 'customerUpdated']);

const formData = ref({ id: '', name: '', email: '', mobile: '' });

// Watch for changes in the customer prop and update formData
watch(() => props.customer, (newCustomer) => {
    if (newCustomer) {
        formData.value = { ...newCustomer };  // Fill form with selected customer data
    }
}, { immediate: true });

const editCustomer = async () => {
    if (!formData.value.name || !formData.value.email || !formData.value.mobile) {
        AlertMessage.warning('All fields are required!');
        return;
    }

    const isValidPhone = phoneRegex(formData.value.mobile);
    const isValidEmail = emailRegex(formData.value.email);

    if (isValidPhone || isValidEmail) {
        AlertMessage.warning('Please enter valid phone number and email.');
        return;
    }

    try {
        await updateCustomer(formData.value);
        AlertMessage.success('Customer updated successfully!');
        emit('customerUpdated');
        emit('close');
    } catch (error) {
        AlertMessage.error('Failed to update customer. Please try again.');
    }
};
</script>
