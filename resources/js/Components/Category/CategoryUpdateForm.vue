<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-[var(--light-green)] rounded-lg p-6 w-[400px] shadow-lg">
            <h2 class="text-xl md:text-2xl font-bold mb-4 text-gray-800">Update Category</h2>

            <label class="block text-gray-700 text-sm">Category Name</label>
            <input v-model="formData.name" type="text"
                class="w-full border border-[var(--medium-green)] p-2 rounded mb-4 bg-[var(--pale-green)] text-gray-800" />

            <div class="flex justify-end space-x-2">
                <button @click="$emit('close')"
                    class="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">Cancel</button>
                <button @click="editCategory"
                    class="px-4 py-2 bg-[var(--medium-green)] text-white rounded hover:bg-[var(--text-color)]">Update</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { updateCategory } from '@/APIRequest/CategoryAPIRequest.js';
import AlertMessage from '@/Utility/AlertMessage.js';

const props = defineProps({ category: Object });
const emit = defineEmits(['close', 'categoryUpdated']);

const formData = ref({ id: '', name: '' });

watch(() => props.category, (newCategory) => {
    if (newCategory) {
        formData.value = { ...newCategory };  // Fill form with selected category data
    }
}, { immediate: true });

const editCategory = async () => {
    if (!formData.value.name) {
        AlertMessage.warning('Category name is required!');
        return;
    }

    try {
        await updateCategory(formData.value);
        AlertMessage.success('Category updated successfully!');
        emit('categoryUpdated');
        emit('close');
    } catch (error) {
        AlertMessage.error('Failed to update category. Please try again.');
    }
};
</script>
