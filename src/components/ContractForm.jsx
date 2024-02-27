import React, { useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadFile, saveFormData } from "../services/FirebaseServices";
import SignaturePad from "react-signature-canvas";
import InfoCredit from "./InfoCredit";
import TextCredit from "./TextCredit";

const ContractForm = () => {
  const sigPad = useRef(null);

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
    <>
      <ToastContainer />
      <div className="mx-auto max-w-[50%]">
        <h2>Contract de Prestari Servicii</h2>
        <InfoCredit />
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            photo: null,
            signature: "",
          }}
          validate={validateForm}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              setSubmitting(true);
              if (sigPad.current.isEmpty()) {
                toast.error("Signature is required");
                return;
              }

              let photoUrl = "";
              let signatureUrl = "";

              const formData = {
                firstName: values.firstName,
                lastName: values.lastName,
                phone: values.phone,
                email: values.email,
              };

              if (values.photo) {
                photoUrl = await uploadFile(values.photo, `contracts`); // Here, creating a unique document ID beforehand
              }

              // Prepare and upload the signature if present
              if (sigPad.current && !sigPad.current.isEmpty()) {
                const signatureBlob = await new Promise((resolve) =>
                  sigPad.current
                    .getTrimmedCanvas()
                    .toBlob((blob) => resolve(blob), "image/png")
                );
                if (signatureBlob) {
                  signatureUrl = await uploadFile(
                    signatureBlob,
                    `contracts`,
                    "signature.png"
                  );
                }
              }

              formData.photoUrl = photoUrl;
              formData.signatureUrl = signatureUrl;

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
            <Form className="bg-red-500">
              <div className="mt-10 gap-x-6 gap-y-8 flex flex-col">
                {/* Form fields */}

                <Field name="firstName" placeholder="First Name" className="" />

                <ErrorMessage name="firstName" component="div" />

                <Field name="lastName" placeholder="Last Name" />

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

                <TextCredit />

                <div
                  style={{ border: "1px solid black", marginBottom: "10px" }}
                  className="canvas_container"
                >
                  <SignaturePad
                    ref={sigPad}
                    canvasProps={{
                      width: 500,
                      height: 200,
                      className: "sigCanvas",
                    }}
                  />
                </div>
              </div>
              <button type="button" onClick={() => sigPad.current.clear()}>
                Clear Signature
              </button>
              {/* <button onClick={handleCheckSignature}>Check Signature</button> */}
              {/* Display the signature image */}

              <ErrorMessage name="signature" component="div" />

              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default ContractForm;
