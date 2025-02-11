<script setup>
import { ref, reactive } from "vue";
import { Link } from "@inertiajs/vue3";
import { registerUser } from "@/APIRequest/UserAPIRequest.js";
import { emailRegex, phoneRegex, passwordRegex } from "@/Utility/Validation.js";
import AlertMessage from "@/Utility/AlertMessage";

const state = reactive({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
});

// Loading state
const loading = ref(false);

const register = async () => {
    const emailValidation = emailRegex(state.email);
    const phoneValidation = phoneRegex(state.phone);
    const passwordValidation = passwordRegex(state.password);

    if (emailValidation || phoneValidation || passwordValidation) {
        AlertMessage.warning("Please enter valid email, phone number, and password.");
        return;
    }

    loading.value = true;
    const response = await registerUser(state);
    loading.value = false;

    if (response.status === 'success') {
        AlertMessage.success("Registration successful! Redirecting...");
        setTimeout(() => {
            window.location.href = "/login";
        }, 2000);
    } else {
        AlertMessage.error("Registration failed. Please try again.");
    }
};
</script>



<template>
    <div class="flex items-center justify-center min-h-screen bg-[var(--light-green)] px-4 sm:px-6 lg:px-8">
        <div class="bg-[var(--pale-green)] p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md">
            <h2 class="text-center text-xl sm:text-2xl font-bold text-[var(--text-color)] mb-4 sm:mb-6">Register</h2>
            <form @submit.prevent="register">
                <div class="mb-3 sm:mb-4">
                    <label class="block text-[var(--text-color)] font-medium mb-1">First Name</label>
                    <input v-model="state.firstName" type="text"
                        class="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--medium-green)]"
                        placeholder="Enter your first name">
                </div>
                <div class="mb-3 sm:mb-4">
                    <label class="block text-[var(--text-color)] font-medium mb-1">Last Name</label>
                    <input v-model="state.lastName" type="text"
                        class="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--medium-green)]"
                        placeholder="Enter your last name">
                </div>
                <div class="mb-3 sm:mb-4">
                    <label class="block text-[var(--text-color)] font-medium mb-1">Email</label>
                    <input v-model="state.email" type="email"
                        class="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--medium-green)]"
                        placeholder="Enter your email">
                </div>
                <div class="mb-3 sm:mb-4">
                    <label class="block text-[var(--text-color)] font-medium mb-1">Phone</label>
                    <input v-model="state.phone" type="tel"
                        class="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--medium-green)]"
                        placeholder="Enter your phone number">
                </div>
                <div class="mb-3 sm:mb-4">
                    <label class="block text-[var(--text-color)] font-medium mb-1">Password</label>
                    <input v-model="state.password" type="password"
                        class="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--medium-green)]"
                        placeholder="Enter your password">
                </div>
                <button type="submit"
                    class="w-full bg-[var(--medium-green)] text-white py-2 rounded-lg hover:bg-[var(--text-color)] transition">
                    Register
                </button>
            </form>
            <div class="mt-3 sm:mt-4 text-center">
                <p class="text-[var(--text-color)] text-xs sm:text-sm">Already have an account?
                    <Link href="/login" class="text-[var(--medium-green)] font-bold hover:underline">Login</Link>
                </p>
            </div>
        </div>
    </div>

    <!-- Show spinner when loading -->
    <div v-if="loading" class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
</template>
