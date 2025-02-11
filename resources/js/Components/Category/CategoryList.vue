<template>
    <div class="p-6 bg-[var(--light-green)]">
        <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center mb-6">
            <i class="fas fa-tags mr-3 text-[var(--medium-green)]"></i> Category List
        </h2>

        <div class="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
            <input placeholder="Search..."
                class="p-2 border border-[var(--medium-green)] rounded-md w-full md:w-1/2 bg-[var(--pale-green)] text-gray-800"
                type="text" v-model="searchValue" aria-label="Search categories">
            <button @click="openAddModal"
                class="bg-[var(--medium-green)] text-white px-4 py-2 rounded hover:bg-[var(--text-color)] w-full md:w-auto"
                aria-label="Add new category">
                + Add Category
            </button>
        </div>

        <div v-if="loading" class="text-center my-6">
            <i class="fas fa-spinner fa-spin text-3xl text-[var(--medium-green)]"></i>
            <p class="text-gray-800">Loading categories...</p>
        </div>

        <p v-if="filteredCategories.length === 0 && !loading" class="text-center text-gray-700">No categories found</p>

        <EasyDataTable v-if="!loading && filteredCategories.length > 0" buttons-pagination alternating :headers="Header"
            :items="filteredCategories" :rows-per-page="10" theme-color="var(--medium-green)"
            table-class-name="customize-table">
            <template #item-action="{ serial, id }">
                <div class="flex justify-center gap-2">
                    <button @click="editCategory(categories[serial - 1])"
                        class="bg-[var(--medium-green)] text-white px-3 py-1 rounded hover:bg-[var(--text-color)]"
                        aria-label="Edit category">Edit</button>
                    <button @click="removeCategory(id)" class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800"
                        aria-label="Delete category">Delete</button>
                </div>
            </template>
        </EasyDataTable>

        <CategoryCreateForm v-if="showCreateModal" @close="closeCreateModal" @categorySaved="fetchCategories" />
        <CategoryUpdateForm v-if="showEditModal" :category="selectedCategory" @close="closeEditModal"
            @categoryUpdated="fetchCategories" />
    </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import { getCategories, deleteCategory } from '@/APIRequest/CategoryAPIRequest.js';
import Swal from 'sweetalert2';
import CategoryCreateForm from './CategoryCreateForm.vue';
import CategoryUpdateForm from './CategoryUpdateForm.vue';
import AlertMessage from '@/Utility/AlertMessage.js';

const Header = [
    { text: "No", value: "serial" },
    { text: "Category Name", value: "name" },
    { text: "Action", value: "action" },
];

const categories = ref([]);
const searchValue = ref('');
const loading = ref(false);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const selectedCategory = ref(null);

const fetchCategories = async () => {
    try {
        loading.value = true;
        categories.value = await getCategories();
    } catch (error) {
        AlertMessage.error('Failed to fetch categories. Please try again.');
    } finally {
        loading.value = false;
    }
};

const removeCategory = async (categoryId) => {
    const confirmation = await AlertMessage.confirmDelete();

    if (confirmation.isConfirmed) {
        try {
            const response = await deleteCategory(categoryId);
            if (response === 1) {
                AlertMessage.success('Category deleted successfully!');
                fetchCategories();
            } else {
                AlertMessage.error('Failed to delete category. Please try again.');
            }
        } catch (error) {
            AlertMessage.error('An error occurred. Please try again.');
        }
    }
};

const openAddModal = () => {
    selectedCategory.value = null;
    showCreateModal.value = true;
};

const editCategory = (category) => {
    selectedCategory.value = { ...category };
    showEditModal.value = true;
};

const closeCreateModal = () => {
    showCreateModal.value = false;
};

const closeEditModal = () => {
    showEditModal.value = false;
};

const filteredCategories = computed(() => {
    return categories.value
        .filter(category =>
            category.name.toLowerCase().includes(searchValue.value.toLowerCase())
        )
        .map((category, index) => ({
            ...category,
            serial: index + 1
        }));
});

onMounted(() => {
    fetchCategories();
});
</script>
