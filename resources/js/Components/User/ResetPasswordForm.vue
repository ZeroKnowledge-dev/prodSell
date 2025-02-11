<script setup>
import { reactive, ref } from 'vue';
import { updatePassword } from '@/APIRequest/UserAPIRequest.js';
import { validatePasswords } from '@/Utility/Validation.js';
import AlertMessage from '@/Utility/AlertMessage';

const state = reactive({
    password: '',
    confirmPassword: ''
});

// Loading state
const loading = ref(false);

// Password visibility
const isPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);

const togglePasswordVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value;
};

const toggleConfirmPasswordVisibility = () => {
    isConfirmPasswordVisible.value = !isConfirmPasswordVisible.value;
};

async function update() {
    const validation = validatePasswords(state.password, state.confirmPassword);

    if (!validation.valid) {
        AlertMessage.error(validation.message);
        return;
    }

    try {
        loading.value = true;
        const response = await updatePassword(state.password);
        loading.value = false;

        if (response.status === 'success') {
            AlertMessage.success('Password updated successfully! Redirecting...');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } else {
            AlertMessage.error('Failed to update password. Please try again.');
        }
    } catch (error) {
        AlertMessage.error('An error occurred. Please try again.');
    }
}
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-[var(--light-green)] px-4 sm:px-6 lg:px-8">
        <div class="bg-[var(--pale-green)] p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md">
            <h2 class="text-center text-xl sm:text-2xl font-bold text-[var(--text-color)] mb-4 sm:mb-6">Update Password
            </h2>
            <form @submit.prevent="update">
                <div class="mb-3 sm:mb-4">
                    <label class="block text-[var(--text-color)] font-medium mb-1">New Password</label>
                    <div class="relative">
                        <input v-model="state.password" :type="isPasswordVisible ? 'text' : 'password'"
                            class="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--medium-green)]"
                            placeholder="Enter new password">
                        <i class="fas cursor-pointer absolute top-1/2 right-3 transform -translate-y-1/2 text-[var(--medium-green)] text-lg"
                            :class="isPasswordVisible ? ' fa-eye' : 'fa-eye-slash'"
                            @click="togglePasswordVisibility"></i>
                    </div>
                </div>
                <div class="mb-3 sm:mb-4">
                    <label class="block text-[var(--text-color)] font-medium mb-1">Confirm New Password</label>
                    <div class="relative">
                        <input v-model="state.confirmPassword" :type="isConfirmPasswordVisible ? 'text' : 'password'"
                            class="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--medium-green)]"
                            placeholder="Confirm new password">
                        <i class="fas cursor-pointer absolute top-1/2 right-3 transform -translate-y-1/2 text-[var(--medium-green)] text-lg"
                            :class="isConfirmPasswordVisible ? ' fa-eye' : 'fa-eye-slash'"
                            @click="toggleConfirmPasswordVisibility"></i>
                    </div>
                </div>
                <button type="submit"
                    class="w-full bg-[var(--medium-green)] text-white py-2 rounded-lg hover:bg-[var(--text-color)] transition">
                    Update Password
                </button>
            </form>
        </div>
    </div>


    <!-- Show spinner when loading -->
    <div v-if="loading" class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
</template>
