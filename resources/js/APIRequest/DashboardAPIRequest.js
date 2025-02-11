import axios from "axios";

// Fetch summary data
export const fetchSummary = async () => {
    try {
        const response = await axios.get("/summary");
        return response.data;
    } catch (error) {
        console.error("Error fetching summary:", error);
        return null;
    }
};

// Fetch user profile
export const getUserName = async () => {
    try {
        const response = await axios.get("/user-profile");
        let data = response.data.data;
        return `${data.firstName} ${data.lastName}`;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return "User";
    }
};
