<script setup>
import { ref } from "vue";
import { sendOtp } from "@/APIRequest/UserAPIRequest.js";
import { emailRegex } from "@/Utility/Validation.js";
import AlertMessage from "@/Utility/AlertMessage";

const email = ref("");
const loading = ref(false);

const sendOtpRequest = async () => {
    const emailValidation = emailRegex(email.value);

    if (emailValidation) {
        AlertMessage.warning('Please enter a valid email.');
        return;
    } else {
        AlertMessage.success('Please wait a moment...');
    }

    try {
        loading.value = true;
        const response = await sendOtp(email.value);
        loading.value = false;
        if (response.status === 'success') {
            AlertMessage.success('OTP sent successfully! Redirecting...');
            sessionStorage.setItem('email', email.value);

            setTimeout(() => {
                window.location.href = "/otpVerification";
            }, 2000);
        }

    } catch (err) {
        AlertMessage.error('Failed to send OTP. Please try again.');
        email.value = '';
        loading.value = false;
    }
};
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-[var(--light-green)] px-4 sm:px-6 lg:px-8">
        <div class="bg-[var(--pale-green)] p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md">
            <h2 class="text-center text-xl sm:text-2xl font-bold text-[var(--text-color)] mb-4 sm:mb-6">Send OTP</h2>
            <form @submit.prevent="sendOtpRequest">
                <div class="mb-3 sm:mb-4">
                    <label class="block text-[var(--text-color)] font-medium mb-1">Email</label>
                    <input v-model="email" type="text"
                        class="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--medium-green)]"
                        placeholder="Enter your email">
                </div>
                <button type="submit"
                    class="w-full bg-[var(--medium-green)] text-white py-2 rounded-lg hover:bg-[var(--text-color)] transition">
                    Send OTP
                </button>
            </form>
        </div>
    </div>

    <!-- Show spinner when loading -->
    <div v-if="loading" class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
</template>
