<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-[var(--light-green)] rounded-lg p-6 w-[400px] shadow-lg">
            <h2 class="text-xl md:text-2xl font-bold mb-4 text-gray-800">Add Customer</h2>

            <label class="block text-gray-700 text-sm">Name</label>
            <input v-model="formData.name" type="text"
                class="w-full border border-[var(--medium-green)] p-2 rounded mb-3 bg-[var(--pale-green)] text-gray-800"
                placeholder="Enter Name" />

            <label class="block text-gray-700 text-sm">Email</label>
            <input v-model="formData.email" type="email"
                class="w-full border border-[var(--medium-green)] p-2 rounded mb-3 bg-[var(--pale-green)] text-gray-800"
                placeholder="Enter Email" />

            <label class="block text-gray-700 text-sm">Phone</label>
            <input v-model="formData.mobile" type="text"
                class="w-full border border-[var(--medium-green)] p-2 rounded mb-4 bg-[var(--pale-green)] text-gray-800"
                placeholder="Enter Phone" />

            <div class="flex justify-end space-x-2">
                <button @click="$emit('close')"
                    class="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">Cancel</button>
                <button @click="saveCustomer"
                    class="px-4 py-2 bg-[var(--medium-green)] text-white rounded hover:bg-[var(--text-color)]">Add</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { createCustomer } from '@/APIRequest/CustomerAPIRequest.js';
import { phoneRegex, emailRegex } from '@/Utility/Validation';
import AlertMessage from '@/Utility/AlertMessage.js';

const formData = ref({ name: '', email: '', mobile: '' });

const emit = defineEmits(['close', 'customerSaved']);

const saveCustomer = async () => {
    if (!formData.value.name || !formData.value.email || !formData.value.mobile) {
        AlertMessage.warning('All fields are required!');
        return;
    }

    const phoneValidation = phoneRegex(formData.value.mobile);
    const emailValidation = emailRegex(formData.value.email);

    if (phoneValidation || emailValidation) {
        AlertMessage.warning('Please enter valid phone number and email.');
        return;
    }

    await createCustomer(formData.value);
    AlertMessage.success('Customer added successfully!');
    emit('customerSaved');
    emit('close');
};
</script>
