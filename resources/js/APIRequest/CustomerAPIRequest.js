import axios from "axios";

// Fetch all customers
export const getCustomers = async () => {
    try {
        const response = await axios.get("/list-customer");
        return response.data;
    } catch (error) {
        console.error("Error fetching customers:", error);
        return [];
    }
};

// Create a new customer
export const createCustomer = async (customerData) => {
    try {
        const response = await axios.post("/create-customer", customerData);
        return response; // Assuming the API returns { status: 'success', data: {...} }
    } catch (error) {
        return {
            status: "error",
            message: error.response?.data?.message || "Failed to add customer",
        };
    }
};

// Update a customer
export const updateCustomer = async (customerData) => {
    try {
        const response = await axios.post("/update-customer", customerData);
        return response.data;
    } catch (error) {
        return error.response
            ? error.response.data
            : { message: "Something went wrong" };
    }
};

// Delete a customer
export const deleteCustomer = async (customerId) => {
    try {
        const response = await axios.post("/delete-customer", {
            id: customerId,
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting customer:", error);
        return { status: "error", message: "Failed to delete customer" };
    }
};
