import axios from "axios";

// Fetch all invoices
export const getInvoices = async () => {
    try {
        const response = await axios.get("/invoice-select");
        return response.data;
    } catch (error) {
        console.error("Error fetching invoices:", error);
        return [];
    }
};

// Get invoice details
export const getInvoiceDetails = async (invoiceId, customerId) => {
    try {
        const response = await axios.post("/invoice-details", {
            inv_id: invoiceId,
            cus_id: customerId,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice details:", error);
        return [];
    }
};

// Delete an invoice
export const deleteInvoice = async (invoiceId) => {
    try {
        const response = await axios.post("/invoice-delete", {
            inv_id: invoiceId,
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting invoice:", error);
        return { status: "error", message: "Failed to delete invoice" };
    }
};
