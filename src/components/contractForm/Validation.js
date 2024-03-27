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
        errors.lastName = "Introdu Prenumele";
    }
    if (!values.phone) {
        errors.phone = "Introdu numărul de telefon";
    } else if (!/^[0-9]+$/.test(values.phone)) {
        errors.phone = "Numărul de telefon nu este valid";
    }
    if (!values.email) {
        errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = "Adresa de email nu este validă";
    }
    if (!values.photo) {
        errors.photo = "Adaugă poza cu buletinul";
    } else {
        // Check if the file type is one of the allowed types
        if (!["image/png", "image/jpg", "image/jpeg", "image/webp"].includes(values.photo.type)) {
            errors.photo = "Fisier invalid. Selectează un fisier valid (png/webp/jpg/";
        }
        // Check if the file size is greater than 12 MB
        else if (values.photo.size >= 12582912) {
            errors.photo = "Fisierul trebuie sa contină până in 12mb";
        }
    }
    if (!sigPad || (sigPad.current && sigPad.current.isEmpty())) {
        errors.signature = "Semnătura este obligatorie";
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