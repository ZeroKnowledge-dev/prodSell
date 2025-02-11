<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-[var(--light-green)] rounded-lg p-6 w-full sm:w-[400px] shadow-lg">
            <h2 class="text-2xl font-bold mb-4 text-gray-800">Add Product</h2>

            <!-- Category Select -->
            <label class="block text-gray-700 text-sm">Category</label>
            <select v-model="createProductForm.category_id"
                class="w-full border border-[var(--medium-green)] p-2 rounded mb-3 bg-[var(--pale-green)] text-gray-800">
                <option value="" disabled>Select Category</option>
                <option v-for="category in categories" :value="category.id" :key="category.id">
                    {{ category.name }}
                </option>
            </select>

            <!-- Product Name -->
            <label class="block text-gray-700 text-sm">Name</label>
            <input v-model="createProductForm.name" type="text"
                class="w-full border border-[var(--medium-green)] p-2 rounded mb-3 bg-[var(--pale-green)] text-gray-800"
                placeholder="Enter Product Name" />

            <!-- Product Price -->
            <label class="block text-gray-700 text-sm">Price</label>
            <input v-model="createProductForm.price" type="text"
                class="w-full border border-[var(--medium-green)] p-2 rounded mb-3 bg-[var(--pale-green)] text-gray-800"
                placeholder="Enter Product Price" />

            <!-- Product Unit -->
            <label class="block text-gray-700 text-sm">Unit</label>
            <input v-model="createProductForm.unit" type="text"
                class="w-full border border-[var(--medium-green)] p-2 rounded mb-3 bg-[var(--pale-green)] text-gray-800"
                placeholder="Enter Product Unit" />

            <!-- Image Preview -->
            <div v-if="imageUrl" class="mb-4 flex justify-center">
                <img :src="imageUrl" class="w-24 h-24 object-cover rounded" />
            </div>

            <!-- Image Upload -->
            <div class="flex justify-center mb-4">
                <input type="file" id="file-upload" @input="createProductForm.img_url = $event.target.files[0]"
                    @change="previewImage" ref="photo" class="hidden" />
                <label for="file-upload"
                    class="w-full py-3 text-center bg-[var(--pale-green)] border border-[var(--medium-green)] rounded-md text-gray-800 cursor-pointer hover:bg-[var(--medium-green)] transition">
                    <i class="fas fa-image text-gray-500 mr-4"></i>
                    <span v-if="createProductForm.img_url === null">Upload Product Image</span>
                    <span v-else>Change Image</span>
                </label>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-2">
                <button @click="$emit('close')"
                    class="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">Cancel</button>
                <button @click="addProduct"
                    class="px-4 py-2 bg-[var(--medium-green)] text-white rounded hover:bg-[var(--text-color)]">Add</button>
            </div>
        </div>
    </div>

    <!-- Show spinner when loading -->
    <div v-if="loading" class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
</template>


<script setup>
import { ref } from 'vue';
import { useForm } from '@inertiajs/vue3';
import { getCategories } from '@/APIRequest/CategoryAPIRequest.js';
import { numberRegex } from '@/Utility/Validation';
import AlertMessage from '@/Utility/AlertMessage';

const categories = ref([]);

const createProductForm = useForm({
    category_id: '',
    name: '',
    price: '',
    unit: '',
    img_url: null,
});

const loading = ref(false);

const imageUrl = ref(null);
const emit = defineEmits(['close', 'productSaved']);

const previewImage = (event) => {
    const file = event.target.files[0];
    if (file) {
        createProductForm.img_url = file;
        imageUrl.value = URL.createObjectURL(file);
    }
};

const addProduct = async () => {
    if (!createProductForm.name || !createProductForm.price || !createProductForm.unit || !createProductForm.category_id) {
        AlertMessage.warning('All fields are required!');
        return;
    }

    const isValidPrice = numberRegex(createProductForm.price);
    const isValidUnit = numberRegex(createProductForm.unit);

    if (isValidPrice || isValidUnit) {
        AlertMessage.warning('Please enter valid price and unit.');
        return;
    }

    createProductForm.post('/create-product', {
        onSuccess: () => {
            AlertMessage.success('Product added successfully!');
            emit('productSaved');
            emit('close');
        },
        onError: (errors) => {
            AlertMessage.error('Failed to add product. Please try again.');
        }
    });
};

const fetchCategories = async () => {
    loading.value = true;
    const response = await getCategories();
    categories.value = response;
    loading.value = false;
};

fetchCategories();
</script>
