


import React, { useState, useEffect } from 'react';
import { useFormData } from '../context/FormDataContext';
import { contractSections } from './TextObject';
import CustomFont from '../fonts/Roboto-Regular.ttf';

const MyDocument = () => {
  const { formData } = useFormData() || {};
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (formData) {
      setDataLoaded(true);
    }
  }, [formData]);

  const handleDownloadPdf = () => {
    if (dataLoaded) {
      const pdfContent = `
        <html>
          <head>
            <style>
              /* Define your styles here */
            </style>
          </head>
          <body>
            <div>
              <p>First Name: ${formData.firstName}</p>
              <p>Last Name: ${formData.lastName}</p>
              <p>Phone: ${formData.phone}</p>
              <p>Email: ${formData.email}</p>
              ${contractSections.map(section => `
                <p>${section.title}</p>
                ${section.items.map(item => `
                  <p>${item}</p>
                `).join('')}
              `).join('')}
              <img src=${formData.signature}></img>
            </div>
          </body>
        </html>
      `;

      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write(pdfContent);
      iframe.contentWindow.document.close();

      setTimeout(() => {
        iframe.contentWindow.print();
        document.body.removeChild(iframe);
      }, 1000); // Adjust this delay if needed
    }
  };

  return (
    <>
      {/* Render the download button when data is loaded */}
      {dataLoaded && (
        <button onClick={handleDownloadPdf}>Download PDF</button>
      )}
    </>
  );
};

export default MyDocument;
