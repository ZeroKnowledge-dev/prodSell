<template>
    <div class="p-6 sm:p-8 bg-[var(--light-green)]">
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center mb-6">
            <i class="fas fa-file-invoice-dollar mr-3 text-[var(--medium-green)]"></i> Sales Invoice
        </h2>

        <!-- Customer & Product Selection -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
                <label class="font-semibold text-gray-800">Select Customer:</label>
                <select v-model="customer_id"
                    class="p-2 border border-[var(--medium-green)] rounded-md w-full bg-[var(--pale-green)] text-gray-800">
                    <option value="" disabled>Select Customer</option>
                    <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                        {{ customer.name }} - {{ customer.mobile }}
                    </option>
                </select>

                <button @click="selectCustomer"
                    class="bg-[var(--medium-green)] text-white px-4 py-2 rounded hover:bg-[var(--text-color)] mb-4 sm:mr-2 sm:mb-0 mt-4">
                    Select Customer
                </button>
            </div>

            <div>
                <label class="font-semibold text-gray-800">Select Product:</label>
                <select v-model="selectedProduct"
                    class="p-2 border border-[var(--medium-green)] rounded-md w-full bg-[var(--pale-green)] text-gray-800">
                    <option value="" disabled>Select Product</option>
                    <option v-for="product in products" :key="product.id" :value="product">
                        {{ product.name }} - ${{ product.price }}
                    </option>
                </select>

                <button @click="selectProduct"
                    class="bg-[var(--medium-green)] text-white px-4 py-2 rounded hover:bg-[var(--text-color)] mb-4 sm:mb-0 mt-4">
                    Add Product
                </button>
            </div>
        </div>



        <!-- Invoice Details -->
        <h3 class="text-2xl sm:text-3xl font-bold text-[var(--text-color)] mb-4 flex justify-center mt-6">
            <i class="fas fa-receipt text-[var(--medium-green)] mr-3"></i> Invoice Details
        </h3>

        <div class="bg-[var(--pale-green)] p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between">
            <div class="mb-4 sm:mb-0">
                <p class="mb-2"><strong>Date:</strong> {{ currentDate }}</p>
                <p><strong>Name:</strong> {{ customer_name }}</p>
                <p><strong>Email:</strong> {{ customer_email }}</p>
                <p><strong>Phone:</strong> {{ customer_mobile }}</p>
            </div>
            <div>
                <img class="w-24 sm:w-32" src="../../Assets/img/ProdSell_P.svg" alt="Logo">
            </div>
        </div>

        <!-- Product List -->
        <h4 class="text-lg font-semibold text-[var(--text-color)] mt-4">Products:</h4>

        <EasyDataTable class="custom-table mb-4" :headers="headers" :items="invoiceItems" show-index alternating
            hide-footer :rows-per-page="100" theme-color="var(--medium-green)" table-class-name="customize-table">
            <template #item-action="{ index }">
                <button class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800"
                    @click="removeProduct(index - 1)">
                    Delete
                </button>
            </template>
        </EasyDataTable>

        <!-- Invoice Summary -->
        <div class="flex flex-col sm:flex-row justify-end mb-4">
            <div class="sm:w-1/3">
                <p><strong>Total :</strong> <span class="font-semibold text-[var(--medium-green)]">{{
                    totalAmount.toFixed(2)
                        }}$</span></p>
                <p><strong>Payable :</strong> <span class="font-semibold text-[var(--medium-green)]">{{
                    payableAmount.toFixed(2)
                        }}$</span></p>
                <p><strong>Vat :</strong> <span class="font-semibold text-[var(--medium-green)]">{{ vatAmount.toFixed(2)
                        }}$</span></p>
                <p><strong>Discount :</strong> <span class="font-semibold text-[var(--medium-green)]">{{
                    discountAmount.toFixed(2) }}$</span></p>

                <div class="mt-2">
                    <label for="discountP" class="text-xs font-bold">Discount (%) : </label>
                    <input v-model="discount" name="discountP"
                        class="w-24 p-1 border border-gray-300 bg-gray-100 rounded-md ml-2" type="number" min="0" />
                </div>
            </div>
        </div>

        <!-- Submit Invoice -->
        <div class="flex justify-between items-center mt-6 text-gray-800 font-semibold">
            <button @click="createInvoice"
                class="bg-[var(--medium-green)] text-white px-4 py-2 rounded hover:bg-[var(--text-color)]">
                Submit Invoice
            </button>
        </div>
    </div>

    <template v-if="selectUnit">
        <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div class="bg-[var(--light-green)] rounded-lg p-6 w-[350px] sm:w-[400px] shadow-lg">
                <h2 class="text-2xl font-bold mb-4 text-gray-800">How many units do you want to add?</h2>

                <label class="block text-gray-700 text-sm">Unit</label>
                <input v-model="unit" type="number" min="1"
                    class="w-full border border-[var(--medium-green)] p-2 rounded mb-4 bg-[var(--pale-green)] text-gray-800"
                    placeholder="Enter Unit" />

                <button class="px-4 py-2 bg-[var(--medium-green)] text-white rounded hover:bg-[var(--text-color)]"
                    @click="addProduct">Add</button>
            </div>
        </div>
    </template>


    <!-- Show spinner when loading -->
    <div v-if="loading" class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { getCustomers } from '@/APIRequest/CustomerAPIRequest.js';
import { getProducts } from '@/APIRequest/ProductAPIRequest.js';
import AlertMessage from '@/Utility/AlertMessage';

const currentDate = new Date().toISOString().split('T')[0];
const customers = ref([]);
const products = ref([]);
const customer_id = ref('');
const customer_name = ref('');
const customer_email = ref('');
const customer_mobile = ref('');
const selectedProduct = ref(null);
const invoiceItems = ref([]);
const invoiceProducts = ref([]);
const discount = ref(0);
const selectUnit = ref(false);
const unit = ref(0);

// Loading state
const loading = ref(false);

const headers = [
    { text: "Name", value: "name" },
    { text: "Price", value: "price" },
    { text: "Unit", value: "qty" },
    { text: "Action", value: "action" },
];

onMounted(async () => {
    loading.value = true;
    customers.value = await getCustomers();
    products.value = await getProducts();
    loading.value = false;
});

const selectCustomer = () => {
    const selected = customers.value.find(c => c.id === customer_id.value);
    if (selected) {
        customer_name.value = selected.name;
        customer_email.value = selected.email;
        customer_mobile.value = selected.mobile;
    }
};

const selectProduct = () => {
    if (selectedProduct.value) {
        selectUnit.value = true; // Show the modal to select unit
        console.log(selectedProduct.value);

    }
};

const addProduct = () => {
    if (unit.value > 0) {
        // Add the selected product along with the unit to invoice items
        invoiceItems.value.push({
            ...selectedProduct.value,
            qty: unit.value  // Add the quantity as unit
        });

        // Reset modal and input fields after adding the product
        selectUnit.value = false;  // Close the modal
        unit.value = 0;  // Reset the unit input
        selectedProduct.value = null;  // Reset selected product
    } else {
        // Show error if unit is invalid
        AlertMessage.error('Please enter a valid unit.');
    }
};

const removeProduct = (index) => {
    invoiceItems.value.splice(index, 1);
};

const totalAmount = computed(() => {
    return invoiceItems.value.reduce((sum, item) => sum + item.price * item.qty, 0);
});

const vatAmount = computed(() => totalAmount.value * 0.05);
const discountAmount = computed(() => totalAmount.value * (discount.value / 100));
const payableAmount = computed(() => totalAmount.value + vatAmount.value - discountAmount.value);

async function createInvoice() {
    if (!customer_id.value) {
        AlertMessage.error('Please select a customer.');
        return;
    }

    if (invoiceItems.value.length === 0) {
        AlertMessage.error('Please add at least one product.');
        return;
    }

    invoiceProducts.value = []; // Reset before adding new products

    for (let i = 0; i < invoiceItems.value.length; i++) {
        const product = invoiceItems.value[i];

        const data = {
            product_id: product.id,
            product_name: product.name,
            qty: parseInt(product.qty, 10),
            sale_price: parseFloat(product.price),
        };

        invoiceProducts.value.push(data);
    }

    const invoiceData = {
        total: totalAmount.value,
        discount: discountAmount.value,
        vat: vatAmount.value,
        payable: payableAmount.value,
        customer_id: customer_id.value,
        products: invoiceProducts.value,
    };

    try {
        loading.value = true;
        const res = await axios.post('/invoice-create', invoiceData);
        loading.value = false;

        if (res.data === 1) {
            AlertMessage.success('Invoice created successfully!');
            resetInvoice();
        } else {
            AlertMessage.error('Failed to create invoice. Please try again.');
        }
    } catch (error) {
        AlertMessage.error('An error occurred. Please try again.');
    }
}


function resetInvoice() {
    customer_id.value = '';
    customer_name.value = '';
    customer_email.value = '';
    customer_mobile.value = '';
    invoiceItems.value = [];
    discount.value = 0;
}
</script>
