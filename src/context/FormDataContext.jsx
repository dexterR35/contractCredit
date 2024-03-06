import React, { createContext, useState, useContext } from 'react';

const FormDataContext = createContext();

export const useFormData = () => useContext(FormDataContext);

export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    photo: null,
    signature: "",
  });
  const [selectedFileName, setSelectedFileName] = useState("");


  return (
    <FormDataContext.Provider value={{ formData, setFormData, selectedFileName, setSelectedFileName }}>
      {children}
    </FormDataContext.Provider>
  );
};
