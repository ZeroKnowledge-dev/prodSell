<script setup>
import { ref, onMounted } from 'vue';
import { fetchSummary, getUserName } from '@/APIRequest/DashboardAPIRequest.js';

const summary = ref({});
const loading = ref(true);
const userName = ref('');

onMounted(async () => {
    try {
        summary.value = await fetchSummary();
        userName.value = await getUserName();
    } catch (error) {
        console.error('Error loading data:', error);
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <main class="bg-transparent backdrop-blur-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h1 class="text-3xl sm:text-4xl font-extrabold text-[var(--text-color)] drop-shadow-lg">
                    Welcome Back, {{ userName }}
                </h1>
                <p class="text-base sm:text-lg text-gray-500 mt-2">Here's an overview of your activity and details.</p>
            </div>

            <div
                class="p-6 sm:p-8 max-w-4xl mx-auto bg-[var(--pale-green)] rounded-3xl shadow-2xl backdrop-blur-lg border border-white/10">
                <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center mb-6">
                    <i class="fas fa-chart-line mr-3 text-purple-500"></i> Summary
                </h2>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <template v-for="(value, key) in summary" :key="key">
                        <template v-if="key !== 'recentActivity'">
                            <div
                                class="flex items-center p-5 bg-[var(--light-green)] rounded-xl shadow-md border border-white/10 backdrop-blur-md">
                                <i :class="{
                                    'fas fa-box text-3xl text-teal-500 mr-4': key === 'product',
                                    'fas fa-tags text-3xl text-indigo-500 mr-4': key === 'category',
                                    'fas fa-user text-3xl text-pink-500 mr-4': key === 'customer',
                                    'fas fa-file-invoice text-3xl text-yellow-500 mr-4': key === 'invoice',
                                    'fas fa-dollar-sign text-3xl text-green-500 mr-4': key === 'total',
                                    'fas fa-percentage text-3xl text-purple-500 mr-4': key === 'vat',
                                    'fas fa-money-bill-wave text-3xl text-red-500 mr-4': key === 'payable',
                                }"></i>
                                <div>
                                    <p class="text-sm sm:text-base text-gray-500 capitalize font-semibold">{{ key }}</p>
                                    <p class="text-xl sm:text-2xl font-bold text-gray-800">{{ value }}</p>
                                </div>
                            </div>
                        </template>
                    </template>
                </div>
            </div>

            <div class="mt-12">
                <h2 class="text-xl sm:text-2xl md:text-3xl font-extrabold text-[var(--text-color)] mb-4 sm:mb-6">
                    Recent Activity
                </h2>
                <div
                    class="bg-[var(--pale-green)] p-4 sm:p-6 md:p-8 rounded-3xl shadow-lg border border-white/10 backdrop-blur-lg">
                    <ul class="space-y-3 sm:space-y-4 md:space-y-5">
                        <li v-for="(item, key) in summary.recentActivity" :key="key"
                            class="flex items-center text-sm sm:text-base lg:text-lg text-gray-600">
                            <i
                                class="fa fa-check-circle text-[var(--text-color)] text-xs sm:text-sm lg:text-xl mr-3 sm:mr-4"></i>
                            <span class="text-xs sm:text-sm md:text-lg lg:text-xl mr-3 sm:mr-4">Added a New {{ key
                                }}</span>
                            <span
                                class=" font-normal sm:font-medium lg:font-bold text-[var(--medium-green)]">&nbsp;"{{ item
                                || 'N/A'
                                }}"</span>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    </main>
</template>
