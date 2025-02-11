<template>
    <div class="p-6 bg-[var(--light-green)]">
        <h2 class="text-3xl font-bold text-gray-800 flex items-center mb-6">
            <i class="fas fa-box mr-3 text-[var(--medium-green)]"></i> Product List
        </h2>

        <div class="flex flex-col sm:flex-row justify-between items-center mb-4">
            <!-- Search Bar -->
            <input placeholder="Search..."
                class="p-2 border border-[var(--medium-green)] rounded-md w-full sm:w-1/2 bg-[var(--pale-green)] text-gray-800 mb-4 sm:mb-0"
                type="text" v-model="searchValue">

            <!-- Add Product Button -->
            <button @click="openAddModal"
                class="bg-[var(--medium-green)] text-white px-4 py-2 rounded hover:bg-[var(--text-color)] sm:ml-4 w-full sm:w-auto">
                + Add Product
            </button>
        </div>

        <!-- Loading Spinner -->
        <div v-if="loadProduct" class="text-center my-6">
            <i class="fas fa-spinner fa-spin text-3xl text-[var(--medium-green)]"></i>
            <p class="text-gray-800">Loading products...</p>
        </div>

        <!-- Product Table -->
        <EasyDataTable v-if="!loadProduct" buttons-pagination alternating :headers="Header" :items="filteredProducts"
            :rows-per-page="10" theme-color="var(--medium-green)" table-class-name="customize-table">

            <!-- Render Image Column -->
            <template #item-img_url="{ img_url }">
                <img :src="`/storage/${img_url}`" :alt="`Image`" class="w-16 h-16 object-cover rounded-md"
                    @error="onImageError(item)" />
            </template>

            <!-- Render Action Buttons Column -->
            <template #item-action="{ serial, id, img_url }">
                <div class="flex justify-center space-x-2">
                    <button @click="editProduct(products[serial - 1])"
                        class="bg-[var(--medium-green)] text-white px-3 py-1 rounded hover:bg-[var(--text-color)]">Edit</button>
                    <button @click="removeProduct(id, img_url)"
                        class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800">Delete</button>
                </div>
            </template>
        </EasyDataTable>

        <!-- Modal Forms -->
        <ProductCreateForm v-if="showCreateModal" @close="closeCreateModal" @productSaved="fetchProducts" />
        <ProductUpdateForm v-if="showEditModal" :product="selectedProduct" @close="closeEditModal"
            @productUpdated="fetchProducts" />
    </div>

    <!-- Show spinner when loading -->
    <div v-if="loading" class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import { getProducts, deleteProduct } from '@/APIRequest/ProductAPIRequest.js';
import ProductCreateForm from './ProductCreateForm.vue';
import ProductUpdateForm from './ProductUpdateForm.vue';
import AlertMessage from '@/Utility/AlertMessage';
import Swal from 'sweetalert2';

const Header = [
    { text: "No", value: "serial" },
    { text: "Name", value: "name" },
    { text: "Price", value: "price" },
    { text: "Unit", value: "unit" },
    { text: "Image", value: "img_url" },
    { text: "Action", value: "action" },
];

const products = ref([]);
const searchValue = ref('');
const loadProduct = ref(false);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const selectedProduct = ref(null);

// loading state
const loading = ref(false);



const fetchProducts = async () => {
    try {
        loadProduct.value = true;
        products.value = await getProducts();
    } catch (error) {
        AlertMessage.error('Failed to fetch products. Please try again.');
    } finally {
        loadProduct.value = false;
    }
};

const removeProduct = async (productId, img_url) => {
    // Await the confirmation and handle the result
    const confirmation = await AlertMessage.confirmDelete();

    // If the user confirmed the deletion, proceed with the deletion logic
    if (confirmation.isConfirmed) {
        try {
            loading.value = true;
            const response = await deleteProduct(productId, img_url);
            loading.value = false;
            if (response === 1) {
                AlertMessage.success('Product deleted successfully!');
                fetchProducts();
            } else {
                AlertMessage.error('Failed to delete product. Please try again.');
            }
        } catch (error) {
            AlertMessage.error('An error occurred. Please try again.');
        }
    }
};


const openAddModal = () => {
    selectedProduct.value = null;
    showCreateModal.value = true;
};

const editProduct = (product) => {
    selectedProduct.value = { ...product };
    showEditModal.value = true;
};

const closeCreateModal = () => {
    showCreateModal.value = false;
};

const closeEditModal = () => {
    showEditModal.value = false;
};

const filteredProducts = computed(() => {
    return products.value
        .filter(product =>
            product.name.toLowerCase().includes(searchValue.value.toLowerCase()) ||
            product.price.toLowerCase().includes(searchValue.value.toLowerCase()) ||
            product.unit.toLowerCase().includes(searchValue.value.toLowerCase())
        )
        .map((product, index) => ({
            ...product,
            serial: index + 1
        }));
});

onMounted(() => {
    fetchProducts();
});
</script>
