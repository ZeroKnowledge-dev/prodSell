<script setup>
import { defineProps, defineEmits, ref } from "vue";
import EasyDataTable from "vue3-easy-data-table";

const props = defineProps({
    invoice: Object,
});

const printSection = ref(null);


const emit = defineEmits(["close"]);

const headers = [
    { text: "No", value: "index" },
    { text: "Product Name", value: "name" },
    { text: "Quantity", value: "quantity" },
    { text: "Price", value: "price" },
    { text: "Total", value: "total" },
    { text: "Image", value: "image" },
];

const productData = props.invoice?.product?.map((product, index) => ({
    index: index + 1,
    name: product.product.name,
    quantity: product.qty,
    price: `$${product.sale_price}`,
    total: `$${(product.qty * product.sale_price).toFixed(2)}`,
    image: product.product.img_url,
}));



const printInvoice = () => {
    const printContent = printSection.value.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload to restore Vue bindings
};
</script>

<template>
    <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div class="bg-[var(--light-green)] p-6 rounded-2xl shadow-lg w-11/12 sm:w-2/3 md:w-1/2">
            <div class="overflow-y-scroll h-[85vh]" ref="printSection">
                <h3 class="text-2xl font-bold text-[var(--text-color)] mb-4 flex items-center">
                    <i class="fas fa-receipt text-[var(--medium-green)] mr-3"></i> Invoice Details
                </h3>

                <div v-if="invoice"
                    class="bg-[var(--pale-green)] p-4 rounded-lg shadow flex justify-between items-start">
                    <div class="space-y-2">
                        <!-- Customer Information -->
                        <p><strong>Name:</strong> {{ invoice.customer.name }}</p>
                        <p><strong>Email:</strong> {{ invoice.customer.email }}</p>
                        <p><strong>Phone:</strong> {{ invoice.customer.mobile }}</p>
                        <p><strong>Total:</strong> <span class="font-semibold text-[var(--medium-green)]">${{
                            invoice.invoice.total }}</span></p>
                        <p><strong>Discount:</strong> <span class="font-semibold text-[var(--medium-green)]">${{
                            invoice.invoice.discount }}</span></p>
                        <p><strong>Vat:</strong> <span class="font-semibold text-[var(--medium-green)]">${{
                            invoice.invoice.vat }}</span></p>
                        <p><strong>Payable:</strong> <span class="font-semibold text-[var(--medium-green)]">${{
                            invoice.invoice.payable }}</span></p>
                    </div>

                    <div class="flex-shrink-0">
                        <img class="w-24" src="../../Assets/img/ProdSell_P.svg" alt="Logo" />
                    </div>
                </div>

                <h4 class="text-lg font-semibold text-[var(--text-color)] mt-4">Products:</h4>

                <EasyDataTable class="custom-table" :headers="headers" :items="productData" hide-footer alternating
                    :rows-per-page="100" theme-color="var(--medium-green)" table-class-name="customize-table">
                    <template #item-image="{ image }">
                        <img v-if="image" :src="'/storage/' + image" alt="Product Image" class="w-16 h-16 object-cover">
                        <span v-else class="text-gray-500">No Image</span>
                    </template>
                </EasyDataTable>
            </div>

            <div class="flex justify-between mt-4">
                <button @click="printInvoice"
                    class="bg-[var(--medium-green)] text-white px-4 py-2 rounded-lg hover:bg-[var(--text-color)] transition duration-300">
                    Print
                </button>
                <button @click="emit('close')"
                    class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition duration-300">
                    Close
                </button>
            </div>
        </div>
    </div>
</template>
