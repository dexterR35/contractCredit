import React, { useState, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { FcAddImage } from "react-icons/fc";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast, ToastContainer } from "react-toastify";
import { uploadFile, saveFormData } from "../services/FirebaseServices";
import SignaturePad from "react-signature-canvas";
import InfoCredit from "./InfoCredit";
import TextCredit from "./TextCredit";

const ContractForm = () => {

  const sigPad = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [checkboxState, setCheckboxState] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const currentDate = () => {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0'); // Add leading zero if needed
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
    const year = currentDate.getFullYear();
    return `${day}.${month}.${year}`;
  };
  const validateForm = (values) => {
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

    return errors;
  };
  const checkFormFields = (values) => {

    const requiredFields = ['firstName', 'lastName', 'phone', 'email', 'photo'];
    return requiredFields.every(field => values[field]);
  };
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        limit={4}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
        transition:Bounce
      />
      <div className="mx-auto max-w-3xl sm:p-8 p-3 bg-white">
        <h2 className="text-[24px] sm:text-2xl font-bold text-center my-10">
          Contract de Prestari Servicii
        </h2>
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
                photoUrl = await uploadFile(values.photo, `contracts`);
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
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="select-none">
              <>
                <div className="mt-10 gap-x-6 gap-y-2 flex flex-col">
                  {/* Form fields */}
                  <div className="mx-auto w-full">
                    <div className="mb-2 s">
                      <label htmlFor="firstName">
                        <div>Nume<span> *</span></div>

                        <ErrorMessage
                          name="firstName"
                          component="div"
                          className="error"
                        />
                      </label>
                      <Field name="firstName" className="" />
                    </div>
                    <div className="mb-2 s">
                      <label htmlFor="lastName"> <div>Prenume<span> *</span> </div>  <ErrorMessage
                        name="lastName"
                        component="div"
                        className="error"

                      /></label>
                      <Field name="lastName" />

                    </div>
                    <div className="mb-2 s">
                      <label htmlFor="phone"><div>Telefon<span> *</span> </div>  <ErrorMessage
                        name="phone"
                        component="div"
                        className="error"
                      /></label>
                      <Field name="phone" />

                    </div>
                    <div className="mb-2 s">
                      <label htmlFor="email"><div>Email<span> *</span> </div>   <ErrorMessage
                        name="email"
                        component="div"
                        className="error"
                      /></label>
                      <Field name="email" />

                    </div>
                    <div className="mb-2">

                      <div className="mb-2 flex justify-between">
                        <label>Carte Identitate<span> *</span></label>
                        <ErrorMessage
                          name="photo"
                          component="div"
                          className="error"
                        />
                      </div>

                      <label htmlFor="photo" className="flex flex-col items-center justify-center w-full h-64 border-2 border-green-300 border-dashed rounded-lg cursor-pointer bg-green-50">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <p><FcAddImage size={50}/></p>
                          <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Apasă pentru</span> a insera o imagine</p>
                          <p className="text-xs text-gray-500">-</p>
                          <p className="text-xs text-gray-500">PNG, JPG, JPEG, WEBP </p>
                          <p className="text-xs text-gray-500 mb-2">Fisierul trebuie să contină maxim 12MB</p>
                       
                        </div>
                        {selectedFileName && <p className="text-sm text-gray-800">Fisierul Selectat: {selectedFileName}</p>} 
                        <input
                          id="photo"
                          name="photo"
                          accept="image/png, image/jpg, image/jpeg, image/webp"
                          type="file"
                          className="hidden"
                          onChange={(event) => {
                            const file = event.currentTarget.files[0];
                            if (file) {
                         
                              if (["image/png", "image/jpg", "image/jpeg", "image/webp"].includes(file.type)) {
                                if (file.size < 12582912) { // 12 MB
                                  setSelectedFileName(file.name); 
                                  setFieldValue("photo", file); 
                                } else {
                                  setSelectedFileName("");
                                  toast.error("File size must be less than 12MB");
                                }
                              } else {
                                setSelectedFileName("");
                                toast.error("Invalid file type. Only PNG, JPG, and WEBP are allowed.");
                              }
                            }
                          }}
                        />
                      </label>

                    </div>
                  </div>
                  {/*  add text*/}
                  <TextCredit />

                  <div className="my-2">
                    <div className="flex flex-row space-x-5 sm:w-[80%] w-full">
                      <Field className="w-[25px]" type="checkbox" name="checkbox" checked={checkboxState} onChange={e => {
                        setCheckboxState(e.target.checked);
                        setIsFormValid(e.target.checked && checkFormFields(values));
                      }} />
                      <span className="text-gray-700 sm:text-sm text-sm">Sunt de acord cu procesarea datelor mele conform "Politica de Confidențialitate" și "Termeni și Condiții"</span>
                    </div>
                    {!isFormValid && checkboxState && <div className="error text-center">completează toate campurile</div>}
                  </div>
                  <div className="mb-4 flex sm:flex-row-reverse flex-col-reverse justify-around">
                    <div className="mt-4">
                      <label className="mb-2" htmlFor="lastName">Semnatură client<span>*</span></label>
                      <div className="canvas_container border border-1 border-gray-200">
                        <SignaturePad
                          ref={sigPad}
                          canvasProps={{
                            className: "sigCanvas",
                          }}
                        />
                      </div>
                      <a className="bg-tranparent my-1 cursor-pointer" type="button" onClick={() => sigPad.current.clear()}>
                        Resetează
                      </a>
                    </div>
                    <div className="flex flex-col mt-12">
                      <p className="mb-2 text-lg"><span className="text-[16px]">Numele Clientului:</span> {values.firstName || values.lastName ? `${values.firstName} ${values.lastName}` : " Marian Iordache "}</p>
                      <p className="text-lg"><span className="text-[16px]">Data:</span> {currentDate()}</p>
                    </div>
                  </div>
                </div>

                <div className="container-buttons flex gap-3 mx-auto my-8">
                  <button type="submit" disabled={isSubmitting || !checkboxState || !isFormValid} className={`${isSubmitting || !checkboxState || !isFormValid ? 'bg-gray-400' : 'bg-green-600'}`}>
                    Trimite Contractul
                  </button>
                </div>
              </>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default ContractForm;