import axios from "axios";

// Login user
export const loginUser = async (credentials) => {
    try {
        const response = await axios.post("/user-login", credentials);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

// Register user
export const registerUser = async (userData) => {
    try {
        const response = await axios.post("/user-registration", userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

// Send OTP
export const sendOtp = async (email) => {
    try {
        const response = await axios.post("/send-otp", { email });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

// Reset password
export async function updatePassword(password) {
    try {
        const response = await axios.post("/reset-password", {
            password: password,
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

// Fetch user profile
export const getUserProfile = async () => {
    try {
        const response = await axios.get("/user-profile");
        return response.data.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
};

// Update user profile
export const updateUserProfile = async (userData) => {
    try {
        const response = await axios.post("/user-update", userData);
        return response.data;
    } catch (error) {
        console.error("Error updating user profile:", error);
        return { status: "error", message: "Failed to update profile" };
    }
};
