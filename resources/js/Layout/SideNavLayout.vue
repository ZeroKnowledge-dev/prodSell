<template>
    <div class="flex h-screen bg-gray-100">
        <!-- Sidebar -->
        <aside :class="[
            'w-64 bg-[#edf7eb] shadow-lg flex flex-col fixed inset-y-0 left-0 transform transition-transform duration-300 z-50',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        ]" class="md:relative md:translate-x-0 h-screen">
            <div class="flex justify-end">
                <button @click="toggleSidebar" class="md:hidden text-gray-700 relative top-4 right-4">
                    <i class="fas fa-times text-lg"></i>
                </button>
            </div>
            <div class="text-center border-t border-b flex justify-between items-center">
                <img alt="Logo" class=" w-30" src="../Assets/img/ProdSell.svg" />
            </div>
            <nav class="flex-1 p-4 overflow-auto">
                <Link v-for="item in navItems" :key="item.route" :href="item.route" :class="[
                    'flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded',
                    isActiveRoute(item.route) ? 'bg-gray-200 text-green-600' : ''
                ]">
                <i :class="[item.icon, 'mr-3 text-green-600']"></i> {{ item.label }}
                </Link>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 p-6 bg-[var(--light-green)] mt-16 overflow-auto">
            <nav
                class="bg-green-600 p-4 text-white flex items-center justify-between shadow-md fixed top-0 left-0 w-full z-40">
                <button @click="toggleSidebar" class="text-white text-lg focus:outline-none">
                    <i class="fa fa-bars"></i>
                </button>
                <span class="text-lg font-semibold">
                    <img alt="Logo" class=" w-10" src="../Assets/img/user.png" />
                </span>
            </nav>
            <slot></slot>
        </main>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Link } from '@inertiajs/vue3';

const isSidebarOpen = ref(false);

// Sidebar Navigation Items
const navItems = [
    { label: 'Dashboard', route: '/', icon: 'fa fa-tachometer-alt' },
    { label: 'Profile', route: '/profile', icon: 'fa fa-user-circle' },
    { label: 'Customer', route: '/customer', icon: 'fa fa-users' },
    { label: 'Category', route: '/category', icon: 'fa fa-th-list' },
    { label: 'Product', route: '/product', icon: 'fa fa-box' },
    { label: 'Create Sale', route: '/sales', icon: 'fa fa-shopping-cart' },
    { label: 'Invoice', route: '/invoice', icon: 'fa fa-file-invoice-dollar' },
    { label: 'Report', route: '/report', icon: 'fa fa-chart-line' },
    { label: 'Logout', route: '/logout', icon: 'fa fa-sign-out-alt' },
];


// Function to check if the current URL matches the item route
const isActiveRoute = (routePath) => {
    return window.location.pathname === routePath || window.location.pathname.startsWith(routePath + '/');
};

// Toggle sidebar visibility
const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};
</script>
