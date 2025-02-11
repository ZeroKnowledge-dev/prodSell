<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-[var(--light-green)] rounded-lg p-6 w-[400px] shadow-lg">
            <h2 class="text-xl md:text-2xl font-bold mb-4 text-gray-800">Add Category</h2>

            <label class="block text-gray-700 text-sm">Category Name</label>
            <input v-model="formData.name" type="text"
                class="w-full border border-[var(--medium-green)] p-2 rounded mb-4 bg-[var(--pale-green)] text-gray-800"
                placeholder="Enter Category Name" />

            <div class="flex justify-end space-x-2">
                <button @click="$emit('close')"
                    class="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">Cancel</button>
                <button @click="saveCategory"
                    class="px-4 py-2 bg-[var(--medium-green)] text-white rounded hover:bg-[var(--text-color)]">Add</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { createCategory } from '@/APIRequest/CategoryAPIRequest.js';
import AlertMessage from '@/Utility/AlertMessage.js';

const formData = ref({ name: '' });

const emit = defineEmits(['close', 'categorySaved']);

const saveCategory = async () => {
    if (!formData.value.name) {
        AlertMessage.warning('Category name is required!');
        return;
    }

    await createCategory(formData.value);
    AlertMessage.success('Category added successfully!');
    emit('categorySaved');
    emit('close');
};
</script>
