<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-[var(--light-green)] rounded-lg p-6 sm:p-8 w-full sm:w-[400px] shadow-lg">
            <h2 class="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">Update Product</h2>

            <!-- Category Select -->
            <label class="block text-gray-700 text-sm">Category</label>
            <select v-model="updateProductForm.category_id"
                class="w-full border border-[var(--medium-green)] p-3 rounded mb-3 bg-[var(--pale-green)] text-gray-800">
                <option value="" disabled>Select Category</option>
                <option v-for="category in categories" :value="category.id" :key="category.id">
                    {{ category.name }}
                </option>
            </select>

            <!-- Product Name -->
            <label class="block text-gray-700 text-sm">Name</label>
            <input v-model="updateProductForm.name" type="text"
                class="w-full border border-[var(--medium-green)] p-3 rounded mb-3 bg-[var(--pale-green)] text-gray-800"
                placeholder="Enter Product Name" />

            <!-- Product Price -->
            <label class="block text-gray-700 text-sm">Price</label>
            <input v-model="updateProductForm.price" type="text"
                class="w-full border border-[var(--medium-green)] p-3 rounded mb-3 bg-[var(--pale-green)] text-gray-800"
                placeholder="Enter Product Price" />

            <!-- Product Unit -->
            <label class="block text-gray-700 text-sm">Unit</label>
            <input v-model="updateProductForm.unit" type="text"
                class="w-full border border-[var(--medium-green)] p-3 rounded mb-3 bg-[var(--pale-green)] text-gray-800"
                placeholder="Enter Product Unit" />

            <!-- Image Preview -->
            <div class="mb-4 flex justify-center">
                <img :src="imageUrl ? imageUrl : `/storage/${updateProductForm.file_path}`"
                    class="w-24 h-24 object-cover rounded" />
            </div>

            <!-- Image Upload -->
            <div class="flex justify-center mb-4">
                <input type="file" id="file-upload" @input="updateProductForm.img_url = $event.target.files[0]"
                    @change="previewImage" ref="photo" class="hidden" />
                <label for="file-upload"
                    class="w-full py-3 text-center bg-[var(--pale-green)] border border-[var(--medium-green)] rounded-md text-gray-800 cursor-pointer hover:bg-[var(--medium-green)] transition">
                    <i class="fas fa-image text-gray-500 mr-4"></i>
                    <span v-if="!updateProductForm.img_url">Upload Product Image</span>
                    <span v-else>Change Image</span>
                </label>
            </div>

            <div class="flex justify-end space-x-2">
                <button @click="$emit('close')"
                    class="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">Cancel</button>
                <button @click="updateProduct"
                    class="px-4 py-2 bg-[var(--medium-green)] text-white rounded hover:bg-[var(--text-color)]">Update</button>
            </div>
        </div>
    </div>


    <!-- Show spinner when loading -->
    <div v-if="loading" class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useForm } from '@inertiajs/vue3';
import { getCategories } from '@/APIRequest/CategoryAPIRequest.js';
import { numberRegex } from '@/Utility/Validation';
import AlertMessage from '@/Utility/AlertMessage';

const props = defineProps({ product: Object });
const emit = defineEmits(['close', 'productUpdated']);

const categories = ref([]);


const updateProductForm = useForm({
    id: '',
    category_id: '',
    name: '',
    price: '',
    unit: '',
    file_path: '', // Stores the old image URL
    img_url: null, // Stores the new image file
});

const imageUrl = ref(null);

// loading state
const loading = ref(false);

// Watch for changes in the product prop and update form data
watch(() => props.product, (newProduct) => {
    if (newProduct) {
        updateProductForm.id = newProduct.id;
        updateProductForm.category_id = newProduct.category_id;
        updateProductForm.name = newProduct.name;
        updateProductForm.price = newProduct.price;
        updateProductForm.unit = newProduct.unit;
        updateProductForm.file_path = newProduct.img_url; // Store existing image URL
        imageUrl.value = `/storage/${newProduct.img_url}`; // Display existing image
    }
}, { immediate: true });

const previewImage = (event) => {
    const file = event.target.files[0];
    if (file) {
        updateProductForm.img_url = file;
        imageUrl.value = URL.createObjectURL(file);
    }
};

const updateProduct = async () => {
    if (!updateProductForm.name || !updateProductForm.price || !updateProductForm.unit || !updateProductForm.category_id) {
        AlertMessage.warning('All fields are required!');
        return;
    }

    const isValidPrice = numberRegex(updateProductForm.price);
    const isValidUnit = numberRegex(updateProductForm.unit);

    if (isValidPrice || isValidUnit) {
        AlertMessage.warning('Please enter valid price and unit.');
        return;
    }

    // If no new image is uploaded, keep the existing file path
    if (!updateProductForm.img_url) {
        updateProductForm.img_url = updateProductForm.file_path;
    }

    updateProductForm.post("/update-product", {
        onSuccess: () => {
            AlertMessage.success('Product updated successfully!');
            emit('productUpdated');
            emit('close');
        },
        onError: (errors) => {
            AlertMessage.error('Failed to update product. Please try again.');
        }
    });
};

const fetchCategories = async () => {
    const response = await getCategories();
    categories.value = response;
};

loading.value = true;
fetchCategories();
loading.value = false;
</script>
