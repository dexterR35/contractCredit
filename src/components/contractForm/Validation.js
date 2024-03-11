import { toast, ToastContainer } from "react-toastify";
export const currentDate = () => {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0'); // Add leading zero if needed
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
    const year = currentDate.getFullYear();
    return `${day}.${month}.${year}`;
};

export const validateForm = (values,sigPad) => {
    const errors = {};

    if (!values.firstName) {
        errors.firstName = "Introdu Numele";
    }
    if (!values.lastName) {
        errors.lastName = "Last name is required";
    }
    if (!values.phone) {
        errors.phone = "Phone is required";
    } else if (!/^[0-9]+$/.test(values.phone)) {
        errors.phone = "Phone number is not valid";
    }
    if (!values.email) {
        errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = "Invalid email address";
    }
    if (!values.photo) {
        errors.photo = "Photo is required";
    } else {
        // Check if the file type is one of the allowed types
        if (!["image/png", "image/jpg", "image/jpeg", "image/gif", "image/webp"].includes(values.photo.type)) {
            errors.photo = "Invalid file type. Only PNG, JPG, GIF, and WEBP are allowed.";
        }
        // Check if the file size is greater than 12 MB
        else if (values.photo.size >= 12582912) {
            errors.photo = "File size must be less than 12MB";
        }
    }
    if (!sigPad || (sigPad.current && sigPad.current.isEmpty())) {
        errors.signature = "Signature is required";
    }

    return errors;
};


export const checkFormFields = (values, sigPad) => {
    const requiredFields = ['firstName', 'lastName', 'phone', 'email', 'photo'];
    const allFieldsFilled = requiredFields.every(field => values[field]);
    // Check if the signature is filled
    const isSignatureFilled = sigPad.current && !sigPad.current.isEmpty();
    return allFieldsFilled && isSignatureFilled;
};