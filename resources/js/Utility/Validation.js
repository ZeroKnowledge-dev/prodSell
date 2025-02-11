export const validateLogin = (form) => {
    const errors = {};

    if (!form.email) {
        errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        errors.email = "Invalid email format.";
    }

    if (!form.password) {
        errors.password = "Password is required.";
    } else if (form.password.length < 4) {
        errors.password = "Password must be at least 4 characters.";
    }

    return Object.keys(errors).length ? errors : null;
};

export function validatePasswords(password, confirmPassword) {
    if (!password || !confirmPassword) {
        return { valid: false, message: "Please fill in all fields" };
    }

    if (password !== confirmPassword) {
        return { valid: false, message: "Passwords do not match" };
    }

    // Strong password validation (at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character)
    const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%;^&*])[A-Za-z\d!;@#$%^&*]{8,}$/;

    if (!passwordRegex.test(password)) {
        let message = "Password must be at least 8 characters long, ";
        if (!/[A-Z]/.test(password))
            message += "include at least one uppercase letter, ";
        if (!/[a-z]/.test(password))
            message += "include at least one lowercase letter, ";
        if (!/\d/.test(password)) message += "include at least one number, ";
        if (!/[!@#$%^&*]/.test(password))
            message += "include at least one special character.";

        return { valid: false, message: message.trim() };
    }

    return { valid: true, message: "" };
}

// 1. Name Validation
export function nameRegex(value) {
    let error;
    const nameRegex = /^[A-Z][a-zA-Z]*$/;

    if (!value) {
        error = "Name is required";
    } else if (!nameRegex.test(value)) {
        error = "Invalid Name format (Only letters, first letter capitalized)";
    }

    return error || ""; // Return the error message if there's one, otherwise return an empty string
}

// 2. Email Validation
export function emailRegex(value) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!value) {
        return "Email is required";
    }

    if (!emailRegex.test(value)) {
        return "Invalid email format";
    }
    return "";
}

// 3. Phone Number Validation
export function phoneRegex(value) {
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!value) {
        return "Phone number is required";
    }

    if (!phoneRegex.test(value)) {
        return "Invalid phone number format (Should be between 10-15 digits)";
    }
    return "";
}

// 4. Password Validation
export function passwordRegex(value) {
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;

    if (!value) {
        return "Password is required";
    }

    if (!passwordRegex.test(value)) {
        return "Password must be between 8 to 20 characters, contain 1 uppercase, 1 lowercase, 1 number, and 1 special character";
    }

    return "";
}

// 5. Product Price Validation
export function numberRegex(value) {
    const numberRegex = /^[1-9]\d*(\.\d{1,8})?$/;
    if (!value) {
        return "Field is required";
    }

    if (!numberRegex.test(value)) {
        return "Only positive numbers are allowed";
    }
    return "";
}

// 6. Username Validation (Additional)
export function usernameRegex(value) {
    const usernameRegex = /^[a-zA-Z0-9]{5,15}$/;
    if (!value) {
        return "Username is required";
    }

    if (!usernameRegex.test(value)) {
        return "Username must be between 5-15 characters and contain only alphanumeric characters";
    }
    return "";
}
