import axios from "axios";

// Fetch all categories
export const getCategories = async () => {
    try {
        const response = await axios.get("/list-category");
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};

// Create a new category
export const createCategory = async (categoryData) => {
    try {
        const response = await axios.post("/create-category", categoryData);
        return response.data; // Assuming API returns { status: 'success', data: {...} }
    } catch (error) {
        return {
            status: "error",
            message: error.response?.data?.message || "Failed to add category",
        };
    }
};

// Update a category
export const updateCategory = async (categoryData) => {
    try {
        const response = await axios.post("/update-category", categoryData);
        return response.data;
    } catch (error) {
        return error.response
            ? error.response.data
            : { message: "Something went wrong" };
    }
};

// Delete a category
export const deleteCategory = async (categoryId) => {
    try {
        const response = await axios.post("/delete-category", {
            id: categoryId,
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting category:", error);
        return { status: "error", message: "Failed to delete category" };
    }
};
