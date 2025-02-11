<script setup>
import { reactive, ref, onMounted } from 'vue';
import { getUserProfile, updateUserProfile } from '@/APIRequest/UserAPIRequest.js';
import { phoneRegex, passwordRegex } from '@/Utility/Validation.js';
import AlertMessage from '@/Utility/AlertMessage';

const formData = reactive({
    firstName: '',
    lastName: '',
    phone: '',
    password: ''
});

const isPasswordVisible = ref(false);
const email = ref('');
const loading = ref(false);
const errors = ref({});

const togglePasswordVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value;
};

const fetchUserProfile = async () => {
    try {
        loading.value = true;
        const user = await getUserProfile();
        if (user) {
            email.value = user.email;
            formData.firstName = user.firstName;
            formData.lastName = user.lastName;
            formData.phone = user.phone;
            formData.password = user.password;
        }
    } finally {
        loading.value = false;
    }
};

const updateProfile = async () => {
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.password) {
        AlertMessage.warning('All fields are required!');
        return;
    }

    const phoneValidation = phoneRegex(formData.phone);
    const passwordValidation = passwordRegex(formData.password);

    if (phoneValidation || passwordValidation) {
        AlertMessage.warning('Please enter valid phone number and password.');
        return;
    }

    try {
        loading.value = true;
        const response = await updateUserProfile(formData);

        if (response.status === 'success') {
            // Success alert using AlertMessage
            AlertMessage.success('Profile updated successfully!');
            errors.value = {};
            fetchUserProfile();
        } else {
            // Show error alert using AlertMessage
            AlertMessage.error(response.message || 'Failed to update profile.');
        }
    } catch (error) {
        // Show error alert in case of an exception
        AlertMessage.error('An error occurred. Please try again.');
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchUserProfile();
});
</script>


<template>
    <main class="flex-1 p-8">
        <div class="max-w-7xl mx-auto">
            <!-- Welcome Section -->
            <div class="text-center mb-12">
                <h1
                    class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[var(--text-color)] drop-shadow-lg">
                    Welcome Back, {{ formData.firstName || 'User' }}
                </h1>
                <p class=" text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 mt-2">Here's an overview of your
                    activity and details.</p>
            </div>

            <!-- Form Section -->
            <div
                class="p-6 sm:p-8 max-w-4xl mx-auto bg-[var(--pale-green)] rounded-3xl shadow-lg border border-white/10">
                <h2
                    class=" text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 flex items-center mb-6">
                    <i class="fas fa-user-edit mr-3 text-[var(--medium-green)]"></i> User Information
                </h2>

                <form class="space-y-6" @submit.prevent="updateProfile">
                    <div>
                        <label class="block text-gray-700 font-semibold">Email</label>
                        <input v-model="email" type="email"
                            class="w-full p-3 border border-gray-300 rounded-lg bg-[var(--light-green)] cursor-not-allowed"
                            placeholder="Enter your email" required disabled>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold">First Name</label>
                        <input v-model="formData.firstName" type="text"
                            class="w-full p-3 border border-gray-300 rounded-lg bg-[var(--light-green)]"
                            placeholder="Enter your first name" required>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold">Last Name</label>
                        <input v-model="formData.lastName" type="text"
                            class="w-full p-3 border border-gray-300 rounded-lg bg-[var(--light-green)]"
                            placeholder="Enter your last name" required>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold">Phone</label>
                        <input v-model="formData.phone" type="tel"
                            class="w-full p-3 border border-gray-300 rounded-lg bg-[var(--light-green)]"
                            placeholder="Enter your phone number" required>
                        <p v-if="errors.phone" class="text-red-500 text-xs sm:text-sm">{{ errors.phone }}</p>
                    </div>
                    <div>
                        <label class="block text-gray-700 font-semibold">Password</label>
                        <div class="relative">
                            <input v-model="formData.password" :type="isPasswordVisible ? 'text' : 'password'"
                                class="w-full p-3 border border-gray-300 rounded-lg bg-[var(--light-green)] pr-10"
                                placeholder="Enter your password (optional)" />
                            <i class="fas cursor-pointer absolute top-1/2 right-3 transform -translate-y-1/2 text-[var(--medium-green)] text-lg"
                                :class="isPasswordVisible ? ' fa-eye' : 'fa-eye-slash'"
                                @click="togglePasswordVisibility"></i>
                        </div>
                        <p v-if="errors.password" class="text-red-500 text-xs sm:text-sm">{{ errors.password }}</p>
                    </div>
                    <button type="submit"
                        class="w-full bg-[var(--medium-green)] text-white py-3 rounded-lg font-semibold hover:bg-[#3a8a5f]">
                        {{ loading ? 'Updating...' : 'Submit' }}
                    </button>
                </form>
            </div>
        </div>
    </main>


    <!-- Show spinner when loading -->
    <div v-if="loading" class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
</template>
