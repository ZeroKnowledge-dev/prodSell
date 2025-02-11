<script setup>
import { reactive, onMounted, ref, watch } from 'vue';
import axios from 'axios';
import AlertMessage from '@/Utility/AlertMessage';

const state = reactive({
    otp: ['', '', '', ''], // Array to store each OTP digit
    email: sessionStorage.getItem('email') || ''
});

// Refs for input fields
const otpInputs = ref([]);

// Loading state
const loading = ref(false);

// Focus management when typing OTP
function handleInput(index, event) {
    if (event.inputType === "deleteContentBackward") {
        if (index > 0) otpInputs.value[index - 1].focus();
    } else if (index < 3 && event.target.value) {
        otpInputs.value[index + 1].focus();
    }
}

// Computed OTP as string
const otpString = () => state.otp.join('');

// Watch to auto-update OTP string when fields change
watch(state.otp, () => {
    if (otpString().length === 4) verifyOTP();
});

// Verify OTP
async function verifyOTP() {
    if (otpString().length < 4) {
        AlertMessage.warning('Please enter a valid OTP.');
        return;
    }

    try {
        loading.value = true;
        await axios.get('/sanctum/csrf-cookie'); // Ensure CSRF token is set
        const response = await axios.post('/verify-otp', {
            email: state.email,
            otp: otpString()
        });
        loading.value = false;

        if (response.status === 200 && response.data.status === 'success') {
            AlertMessage.success('OTP verification successful! Redirecting...');
            setTimeout(() => {
                sessionStorage.clear();
                window.location.href = '/resetPassword';
            }, 2000);
        } else {
            AlertMessage.error('OTP verification failed. Please try again.');
        }
    } catch (error) {
        loading.value = false;
        AlertMessage.error('An error occurred. Please try again.');
    }
}

// Autofocus first OTP field on mount
onMounted(() => {
    if (otpInputs.value[0]) otpInputs.value[0].focus();
});
</script>


<template>
    <div class="flex items-center justify-center min-h-screen bg-[var(--light-green)] px-4 sm:px-6 lg:px-8">
        <div class="bg-[var(--pale-green)] p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md">
            <h2 class="text-center text-xl sm:text-2xl font-bold text-[var(--text-color)] mb-4 sm:mb-6">OTP Verification
            </h2>
            <form @submit.prevent="verifyOTP">
                <div class="mb-4 text-center">
                    <label class="block text-[var(--text-color)] font-medium mb-2">Enter 4-Digit OTP</label>
                    <div class="flex justify-center gap-2">
                        <input v-for="(digit, index) in state.otp" :key="index" ref="otpInputs"
                            v-model="state.otp[index]" type="text" maxlength="1" @input="handleInput(index, $event)"
                            class="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--medium-green)]">
                    </div>
                </div>
                <button type="submit"
                    class="w-full bg-[var(--medium-green)] text-white py-2 rounded-lg hover:bg-[var(--text-color)] transition">
                    Verify OTP
                </button>
            </form>
        </div>
    </div>

    <!-- Show spinner when loading -->
    <div v-if="loading" class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
</template>
