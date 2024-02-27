import React, { useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadFile, saveFormData } from "../services/FirebaseServices";
import SignaturePad from "react-signature-pad-wrapper";

const ContractForm = () => {
  const sigPad = useRef(null);

  const handleCheckSignature = () => {
    if (sigPad.current.isEmpty()) {
      console.log("No signature has been drawn.");
    } else {
      console.log("Signature has been drawn.");
    }
  };

  const validateForm = (values) => {
    const errors = {};
    if (!values.firstName) {
      errors.firstName = "First name is required";
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
    }

    return errors;
  };

  return (
    <div>
      <ToastContainer />
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          photo: null,
          signature: "",
          documentId: "", // Add documentId field
        }}
        validate={validateForm}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            setSubmitting(true);

            if (sigPad.current.isEmpty()) {
              toast.error("Please provide your signature.");
              return; // Stop submission if signature is empty
            }

            const photo = values.photo;
            const photoUrl = await uploadFile(photo, `contracts`, "photo");
            sigPad.current.clear();
            const signatureBlob = sigPad.current.toDataURL(); // get the signature image as a data URL

            const signatureUrl = await uploadFile(
              signatureBlob,
              `contracts`,
              "signature"
            );

            const formData = {
              firstName: values.firstName,
              lastName: values.lastName,
              phone: values.phone,
              email: values.email,
              photoUrl,
              signatureUrl,
              documentId: values.documentId, // Include documentId
            };
            await saveFormData(formData);
            toast.success("Form submitted successfully!");
            resetForm();
            sigPad.current.clear();
          } catch (error) {
            console.error("Error submitting form: ", error);
            toast.error("Error submitting form");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            {/* Form fields */}
            <Field name="firstName" placeholder="First Name" />
            <ErrorMessage name="firstName" component="div" />

            <Field name="lastName" placeholder="Last Name" />
            <ErrorMessage name="lastName" component="div" />

            <Field name="phone" placeholder="Phone" />
            <ErrorMessage name="phone" component="div" />

            <Field name="email" placeholder="Email" />
            <ErrorMessage name="email" component="div" />

            <input
              id="photo"
              name="photo"
              type="file"
              onChange={(event) => {
                const file = event.currentTarget.files[0];
                if (file && file.size < 26214400) {
                  // 25 MB
                  setFieldValue("photo", file); // Set the value of the photo field
                } else {
                  toast.error("File size must be less than 25MB");
                }
              }}
            />
            <ErrorMessage name="photo" component="div" />

            {/* Add a field for documentId */}
            <Field name="documentId" placeholder="Document ID" />
            <ErrorMessage name="documentId" component="div" />

            <div style={{ border: "1px solid black", marginBottom: "10px" }}>
              <SignaturePad
                ref={sigPad}
                canvasProps={{
                  width: 500,
                  height: 200,
                  className: "sigCanvas",
                }}
              />
            </div>
            <button type="button" onClick={() => sigPad.current.clear()}>
              Clear Signature
            </button>
            <button onClick={handleCheckSignature}>Check Signature</button>
            <ErrorMessage name="signature" component="div" />

            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ContractForm;
