<script setup>
import { ref, reactive } from "vue";
import { Link } from "@inertiajs/vue3";
import { loginUser } from "@/APIRequest/UserAPIRequest.js";
import { emailRegex, passwordRegex } from "@/Utility/Validation.js";
import AlertMessage from "@/Utility/AlertMessage"; // Import AlertMessage

const state = reactive({
    email: "",
    password: "",
});

// Loading state
const loading = ref(false);

// Password visibility
const isPasswordVisible = ref(false);

const togglePasswordVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value;
};

const login = async () => {
    const emailValidation = emailRegex(state.email);
    const passwordValidation = passwordRegex(state.password);

    if (emailValidation || passwordValidation) {
        AlertMessage.warning("Please enter valid email and password.");
        return;
    }

    try {
        loading.value = true;
        await loginUser(state);
        loading.value = false;

        AlertMessage.success("Login successful! Welcome back!");

        setTimeout(() => {
            window.location.href = "/";
        }, 2000);

    } catch (err) {
        AlertMessage.error('Email or Password is incorrect. Please try again.');
        loading.value = false;
    }
};
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-[var(--light-green)] px-4 sm:px-6 lg:px-8">
        <div class="bg-[var(--pale-green)] p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md">
            <h2 class="text-center text-xl sm:text-2xl font-bold text-[var(--text-color)] mb-4 sm:mb-6">Login</h2>
            <form @submit.prevent="login">
                <div class="mb-3 sm:mb-4">
                    <label class="block text-[var(--text-color)] font-medium mb-1">Email</label>
                    <input v-model="state.email" type="email"
                        class="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--medium-green)]"
                        placeholder="Enter your email">
                </div>
                <div class="mb-3 sm:mb-4">
                    <label class="block text-[var(--text-color)] font-medium mb-1">Password</label>
                    <div class="relative">
                        <input v-model="state.password" :type="isPasswordVisible ? 'text' : 'password'"
                            class="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--medium-green)]"
                            placeholder="Enter your password">
                        <i class="fas cursor-pointer absolute top-1/2 right-3 transform -translate-y-1/2 text-[var(--medium-green)] text-lg"
                            :class="isPasswordVisible ? ' fa-eye' : 'fa-eye-slash'"
                            @click="togglePasswordVisibility"></i>
                    </div>
                </div>
                <button type="submit"
                    class="w-full bg-[var(--medium-green)] text-white py-2 rounded-lg hover:bg-[var(--text-color)] transition">
                    Login
                </button>
            </form>
            <div class="mt-3 sm:mt-4 text-center">
                <Link href="/forgotPassword" class="text-[var(--text-color)] hover:underline text-xs sm:text-sm">Forgot
                Password?</Link>
            </div>
            <div class="mt-3 sm:mt-4 text-center">
                <p class="text-[var(--text-color)] text-xs sm:text-sm">Don't have an account?
                    <Link href="/registration" class="text-[var(--medium-green)] font-bold hover:underline">Register
                    </Link>
                </p>
            </div>
        </div>
    </div>

    <!-- Show spinner when loading -->
    <div v-if="loading" class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
</template>
