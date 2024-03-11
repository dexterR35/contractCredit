import React, { useState, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { FcAddImage } from "react-icons/fc";
import SignaturePad from "react-signature-canvas";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast, ToastContainer } from "react-toastify";
import { saveFormDataWithFiles } from "../../services/FirebaseServices";
import { useFormData } from "../../context/FormDataContext";
import { currentDate, validateForm, checkFormFields } from "../contractForm/Validation";
import InfoCredit from "../InfoCredit";
import TextCredit from "../TextCredit";
import html2pdf from 'html2pdf.js';
// import MyDocument from "../PdfGenerator";

const ContractForm = () => {

  const sigPad = useRef(null);
  /* check state */
  const [checkboxState, setCheckboxState] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  /* global */
  const {
    formData, setFormData, selectedFileName, setSelectedFileName
  } = useFormData();
  const generatePDFBlob = async (values) => {
    const content = document.createElement('div');
    let htmlContent = `
      <h2>Title</h2>
      <p>First Name: ${values.firstName}</p>
      <p>Last Name: ${values.lastName}</p>
      <p>Phone: ${values.phone}</p>
      <p>Email: ${values.email}</p>
      <p>Signature: <img src="${values.signature}" alt="signature" style="width:200px;height:auto;"/></p>
    `;
    content.innerHTML = htmlContent;
    const blobB = await html2pdf(content, {
      filename: `${values.firstName}`,
      margin: [10, 10, 10, 10],
      html2canvas: { scale: 1 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      output: 'blob'
    });
    return blobB;
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
            signature: null,
          }}
          validate={(values) => validateForm(values, sigPad)}   // validation comp
          // when i press the button 
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);


            if (sigPad.current && !sigPad.current.isEmpty()) {
              const signatureBlob = await new Promise((resolve) =>
                sigPad.current.getTrimmedCanvas().toBlob((blob) => resolve(blob), "image/png")
              );
              if (signatureBlob) {
                values.signature = signatureBlob;
              }
            }
            // Construct formData
            const formData = {
              firstName: values.firstName,
              lastName: values.lastName,
              phone: values.phone,
              email: values.email
              // Add other form fields here
            };
       
            // Prepare filesInfo
            const filesInfo = {
              photo: {
                file: values.photo,
                path: "user_photos", // Specify the path in the storage
                pname: `photo_${values.firstName}_${values.lastName}`
              },
              signature: {
                file: values.signature, // This should be a Blob or File object
                path: "user_signatures",
                pname: `signature_${values.firstName}_${values.lastName}`
              }
              // Add other file fields here
            };

            try {
              // Save form data and files
              const savedData = await saveFormDataWithFiles(formData, filesInfo);
              console.log("Form submitted successfully:", savedData.id);
              // Handle after save success
              setFormData(savedData);
              setShowPdf(true);
              toast.success("Form submitted successfully!");
            } catch (error) {
              console.error("Error: ", error);
              toast.error("An error occurred. Please try again.");
            } finally {
              setSubmitting(false);
              resetForm();
              sigPad.current.clear(); // Clear the signature pad
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
                          <p><FcAddImage size={50} /></p>
                          <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Apasă pentru</span> a insera o imagine</p>
                          <p className="text-xs text-gray-500">-</p>
                          <p className="text-xs text-gray-500">PNG, JPG, JPEG, WEBP </p>
                          <p className="text-xs text-gray-500 mb-2">Fisierul trebuie să contină maxim 12MB</p>

                        </div>
                        {selectedFileName && <p className="text-sm text-gray-800">Fisierul Selectat: {selectedFileName}</p>}

                        <Field   // This is the hidden input field for file upload, if i use formik <field we need value to be undifined and empty string for photo ,if i use <input> tag works fine witout unfined and empty string
                          id="photo"
                          name="photo"
                          type="file"
                          accept="image/png, image/jpg, image/jpeg, image/webp"
                          className="hidden"
                          onChange={(event) => {
                            const file = event.currentTarget.files[0];
                            if (file) {
                              if (["image/png", "image/jpg", "image/jpeg", "image/webp"].includes(file.type)) {
                                if (file.size <= 12582912) { // max 12 MB
                                  setSelectedFileName(file.name);
                                  setFieldValue("photo", file);
                                } else {
                                  setSelectedFileName("");
                                  toast.error("Fisierul trebuie sa contina maxim 12MB");
                                }
                              } else {
                                setSelectedFileName("");
                                toast.error("Fisier invalid. extensia PNG, JPG, and WEBP este obligatorie.");
                              }
                            } else {
                              setFieldValue("photo", ""); // Set an empty string if no file is selected
                            }
                          }}
                          value={undefined} // Set value to undefined to avoid the warning
                        />
                      </label>

                    </div>
                  </div>
                  {/*  Text from object*/}
                  <TextCredit />
                  <div className="my-2">
                    <div className="flex flex-row space-x-5 sm:w-[80%] w-full">
                      <Field className="w-[25px]" type="checkbox" name="checkbox" checked={checkboxState} onChange={e => {
                        setCheckboxState(e.target.checked);
                        setIsFormValid(e.target.checked && checkFormFields(values, sigPad));
                      }} />
                      <span className="text-gray-700 sm:text-sm text-sm">Sunt de acord cu procesarea datelor mele conform 'Politica de Confidențialitate' și 'Termeni și Condiții'</span>
                    </div>
                    {/* error when check */}
                    {!isFormValid && checkboxState && <div className="error text-center">completează toate campurile</div>}
                  </div>
                  {/* signature */}
                  <div className="mb-4 flex sm:flex-row-reverse flex-col-reverse justify-around">
                    <div className="mt-4">
                      <label className="mb-2" htmlFor="signature">Semnatură client<span>*</span></label>
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
                    {/* date and name */}
                    <div className="flex flex-col mt-12">
                      <p className="mb-2 text-lg"><span className="text-[16px]">Numele Clientului:</span> {formData.firstName || formData.lastName ? `${values.firstName} ${values.lastName}` : " Marian Iordache "}</p>
                      <p className="text-lg"><span className="text-[16px]">Data:</span> {currentDate()}</p>
                    </div>
                  </div>
                </div>
                {/* button disabled when is not value or signature or photo */}
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
      {/* {showPdf && (
        <div>
          <MyDocument />
        </div>
      )} */}
    </>
  );
};

export default ContractForm;