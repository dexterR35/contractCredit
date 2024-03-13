import { useState, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import SignaturePad from "react-signature-canvas";
import { FcAddImage } from "react-icons/fc";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast, ToastContainer } from "react-toastify";
import { saveFormDataWithFiles } from "../../services/FirebaseServices";
import { currentDate, validateForm, checkFormFields } from "../contractForm/Validation";
import ModalPopup from "../ModalPopup";
import InfoCredit from "../InfoCredit";
import TextCredit from "../TextCredit";

import generatePDFBlob from "../GeneratePdf"

const ContractForm = () => {

  const sigPad = useRef(null);
  const [checkboxState, setCheckboxState] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingData, setLoadingData] = useState(null);


  const downloadPDF = async (values) => {
    try {
      const blob = await generatePDFBlob(values);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${values.firstName}_contract.pdf`; // Adjust the file name as needed
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Handle error if PDF generation fails
    }
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
      <div className="mx-auto max-w-3xl sm:p-8 px-6 py-2 bg-white">
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
            // check pad signature
            setModalVisible(true);
            if (sigPad.current && sigPad.current.isEmpty()) {
              toast.error("Signature is required");
              setSubmitting(false);
              return;
            }

            if (sigPad.current && !sigPad.current.isEmpty()) {
              // prepare signature 
              const signatureBlob = await new Promise((resolve) =>
                sigPad.current.getTrimmedCanvas().toBlob((blob) => resolve(blob), "image/png")
              );
              const signatureData = sigPad.current.toDataURL("image/png");
              if (signatureBlob) {
                values.signature = signatureData;
              }
            }

            // Prepare filesInfo
            const filesInfo = {
              photo: {
                file: values.photo,
                pname: `photo_${values.firstName}_${values.lastName}`
              },
              signature: {
                file: values.signature,
                pname: `signature_${values.firstName}_${values.lastName}`
              },
            };
            try {
              // Save form data and files
              const savedData = await saveFormDataWithFiles(values, filesInfo);
              console.log("Form submitted successfully:", savedData.id);
              // donwload pdf
              setLoadingData(savedData);
            } catch (error) {
              console.error("Error: ", error);
              toast.error("An error occurred. Please try again.");
            } finally {
              //reset and dw
              downloadPDF(values);
              // sendEmail(values)
              // toast.success("Form submitted successfully!");
              setSubmitting(false);
              resetForm();
              sigPad.current.clear();
            }
          }}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="select-none" >
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
                        {values.photo && <p className="text-sm text-gray-800">Fisierul Selectat: {values.photo.name}</p>}

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
                                  setFieldValue("photo", file);
                                  // toast.info("Fisierul a fost adaugat cu succes.");
                                } else {
                                  toast.error("Fisierul trebuie sa contina maxim 12MB");
                                }
                              } else {
                                toast.error("Fisier invalid. Extensia PNG, JPG, and WEBP este obligatorie.");
                              }
                            } else {
                              setFieldValue("photo", ""); // Set to empty string when no file is selected
                            }
                          }}
                          value="" // Set value to empty string to clear the component
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
                      <span className="text-gray-700 sm:text-sm text-sm w-full">Sunt de acord cu procesarea datelor mele conform 'Politica de Confidențialitate' și 'Termeni și Condiții'</span>
                    </div>
                    {/* error when check */}
                    {!isFormValid && checkboxState && <div className="error my-2 text-start">Completează toate campurile.</div>}
                  </div>
                  {/* signature */}
                  <div className="mb-4 flex sm:flex-row-reverse flex-col justify-around">
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
                      <p className="mb-2 text-lg"><span className="text-[16px]">Numele Clientului:</span> {values.firstName || values.lastName ? `${values.firstName} ${values.lastName}` : " Marian Iordache "}</p>
                      <p className="text-lg"><span className="text-[16px]">Data:</span> {currentDate()}</p>
                    </div>
                  </div>
                </div>
                {/* button disabled when is not value or signature or photo */}
                <div className="container-buttons flex gap-3 mx-auto my-8">
                  <button type="submit" disabled={isSubmitting || !checkboxState || !isFormValid} className={`${isSubmitting || !checkboxState || !isFormValid ? 'bg-gray-400' : 'bg-green-600'}`} >  Trimite Contractul</button>
                </div>

              </>
            </Form>
          )}
        </Formik>

        <ModalPopup visible={modalVisible} setLoading={loadingData ? false : true} />
      </div>

    </>
  );
};

export default ContractForm;