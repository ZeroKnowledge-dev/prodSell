import axios from "axios";

// Fetch all products
export const getProducts = async () => {
    try {
        const response = await axios.get("/list-product");
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

// Update a product
export const updateProduct = async (productData) => {
    try {
        const response = await axios.post("/update-product", productData);
        return response.data;
    } catch (error) {
        return error.response
            ? error.response.data
            : { message: "Something went wrong" };
    }
};

// Delete a product
export const deleteProduct = async (productId, img_url) => {
    try {
        const response = await axios.post("/delete-product", {
            id: productId,
            img_url: img_url,
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting product:", error);
        return { status: "error", message: "Failed to delete product" };
    }
};
